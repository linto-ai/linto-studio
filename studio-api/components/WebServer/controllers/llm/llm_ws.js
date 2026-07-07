const debug = require("debug")(
  `linto:components:WebServer:controllers:llm:llm_ws`,
)
const WebSocket = require("ws")

const appLogger = require(`${process.cwd()}/lib/logger/logger.js`)
const axios = require(`${process.cwd()}/lib/utility/axios`)
const model = require(`${process.cwd()}/lib/mongodb/models`)

/**
 * Organization-Scoped WebSocket Manager for LLM Gateway V2
 *
 * Manages WebSocket connections per organization, connecting to:
 * - /ws/jobs?organization_id=X - Organization-scoped job monitoring
 *
 * WebSocket Message Formats (from LLM Gateway):
 *
 * Initial message (on connect):
 * {
 *   type: "jobs_snapshot",
 *   jobs: [{job_id, status, progress, service_name, flavor_name, created_at}, ...],
 *   timestamp: "..."
 * }
 *
 * Update messages:
 * {
 *   type: "job_update",
 *   job_id: "uuid",
 *   status: "completed|failed|processing|...",
 *   progress: {...},
 *   result: {...},
 *   error: "...",
 *   timestamp: "..."
 * }
 *
 * Lifecycle:
 * - Open WebSocket when first job is submitted for an organization
 * - Track active jobs per organization (queued, started, processing states)
 * - Close WebSocket when all jobs reach terminal state (completed, failed, cancelled)
 * - Reconnect if a new job is submitted after WebSocket was closed
 */
class OrganizationWebSocketManager {
  constructor() {
    if (!OrganizationWebSocketManager.instance) {
      // organization_id -> { ws: WebSocket, activeJobs: Set<jobId>, callbacks: Map<jobId, callback> }
      this.connections = new Map()
      this._lastBroadcastSignature = new Map()
      this._convInfoByJobId = new Map()
      // In-flight job callbacks preserved across connection drops
      this._orphanedCallbacks = new Map()
      this._reconnectAttempts = new Map()
      OrganizationWebSocketManager.instance = this
    }
    return OrganizationWebSocketManager.instance
  }

  /**
   * Terminal job states - jobs in these states don't need monitoring
   */
  static TERMINAL_STATES = ["completed", "failed", "cancelled"]

  /**
   * Active job states - jobs in these states need monitoring
   */
  static ACTIVE_STATES = ["queued", "started", "processing"]

  /**
   * Convert HTTP URL to WebSocket URL
   */
  _getWsBaseUrl(baseUrl) {
    let wsUrl = baseUrl || process.env.LLM_GATEWAY_SERVICES || "http://localhost:8010"
    // Remove /api/v1 suffix if present
    wsUrl = wsUrl.replace(/\/api\/v1\/?$/, "")
    // Convert http to ws
    wsUrl = wsUrl.replace(/^http/, "ws")
    return wsUrl
  }

  /**
   * Ensure a WebSocket connection exists for an organization
   * Creates a new connection if needed
   *
   * @param {string} organizationId - LinTO organization ID (MongoDB ObjectId string)
   * @param {string} baseUrl - LLM Gateway base URL
   * @returns {Promise<void>}
   */
  async ensureConnection(organizationId, baseUrl) {
    if (!organizationId) {
      appLogger.warn(`[LLM WS] Cannot ensure connection: no organization ID provided`)
      return
    }

    const existing = this.connections.get(organizationId)
    if (existing && existing.ws) {
      if (existing.ws.readyState === WebSocket.OPEN) {
        debug(`Already connected to organization ${organizationId}`)
        return
      }
      // Connection attempt already in flight: share it
      if (existing.ws.readyState === WebSocket.CONNECTING && existing.connectPromise) {
        debug(`Connection to organization ${organizationId} already in progress, waiting for it`)
        return existing.connectPromise
      }
    }

    // Tear down a stale socket so it cannot broadcast as an orphan.
    if (existing) {
      this._destroyConnection(organizationId)
    }

    await this._createConnection(organizationId, baseUrl)
  }

  /**
   * Create a new WebSocket connection for an organization
   */
  async _createConnection(organizationId, baseUrl) {
    const wsUrl = `${this._getWsBaseUrl(baseUrl)}/ws/jobs?organization_id=${organizationId}`
    debug(`Creating WebSocket connection to: ${wsUrl}`)

    const ws = new WebSocket(wsUrl)

    const connectionData = {
      ws: ws,
      baseUrl: baseUrl, // Store for HTTP fallback
      activeJobs: new Set(),
      callbacks: new Map(),
      pendingJobs: new Set(), // Jobs submitted but not yet seen in snapshot
      snapshotReceived: false, // Track if initial snapshot has been processed
    }

    // Resume orphaned jobs: the snapshot or HTTP fallback re-delivers their state
    const orphaned = this._orphanedCallbacks.get(organizationId)
    if (orphaned) {
      this._orphanedCallbacks.delete(organizationId)
      for (const [jobId, callback] of orphaned) {
        connectionData.callbacks.set(jobId, callback)
        connectionData.pendingJobs.add(jobId)
      }
    }

    // Shared by concurrent ensureConnection callers
    connectionData.connectPromise = new Promise((resolve, reject) => {
      const connectionTimeout = setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          ws.close()
          reject(new Error(`WebSocket connection timeout for organization ${organizationId}`))
        }
      }, 10000)

      ws.on("open", () => {
        clearTimeout(connectionTimeout)
        this._reconnectAttempts.delete(organizationId)
        appLogger.info(`[LLM WS] Connected to organization ${organizationId}`)
        resolve()
      })

      ws.on("message", (data) => {
        this._handleMessage(organizationId, data)
      })

      ws.on("close", (code) => {
        clearTimeout(connectionTimeout)
        appLogger.info(`[LLM WS] Disconnected from organization ${organizationId} (code: ${code})`)
        this._forgetConnection(organizationId, connectionData)
        this._scheduleReconnect(organizationId, baseUrl)
      })

      ws.on("error", (error) => {
        clearTimeout(connectionTimeout)
        appLogger.error(`[LLM WS] Error for organization ${organizationId}: ${error.message}`)
        this._forgetConnection(organizationId, connectionData)
        this._scheduleReconnect(organizationId, baseUrl)
        reject(error)
      })
    })

    this.connections.set(organizationId, connectionData)

    return connectionData.connectPromise
  }

  /**
   * Reconnect while orphaned jobs are waiting so their updates keep flowing
   */
  _scheduleReconnect(organizationId, baseUrl) {
    if (!this._orphanedCallbacks.has(organizationId)) return

    const attempts = this._reconnectAttempts.get(organizationId) || 0
    if (attempts >= 5) {
      appLogger.warn(`[LLM WS] Giving up reconnecting to organization ${organizationId}; in-flight jobs will resume on the next connection`)
      return
    }
    this._reconnectAttempts.set(organizationId, attempts + 1)

    const timer = setTimeout(() => {
      if (!this._orphanedCallbacks.has(organizationId)) return
      if (this.connections.has(organizationId)) return
      this.ensureConnection(organizationId, baseUrl).catch((err) => {
        appLogger.error(`[LLM WS] Reconnect to organization ${organizationId} failed: ${err.message}`)
      })
    }, 5000)
    if (typeof timer.unref === "function") timer.unref()
  }

  /**
   * Register a callback for a specific job
   * The callback will be invoked when job_update messages arrive for this job
   *
   * If the initial snapshot has already been received and the job is not in the
   * active jobs list, immediately fetch status via HTTP (handles race condition
   * where jobs complete before callbacks are registered)
   *
   * @param {string} organizationId - Organization ID
   * @param {string} jobId - Job UUID
   * @param {Function} callback - Callback function (update) => void
   */
  registerJobCallback(organizationId, jobId, callback) {
    const conn = this.connections.get(organizationId)
    if (!conn) {
      appLogger.warn(`[LLM WS] Cannot register callback: no connection for organization ${organizationId}`)
      return
    }

    conn.callbacks.set(jobId, callback)
    debug(`Registered callback for job ${jobId} in organization ${organizationId}`)

    // If snapshot was already received and job is not in active jobs,
    // immediately fetch status via HTTP (job may have completed before we registered)
    if (conn.snapshotReceived && !conn.activeJobs.has(jobId)) {
      debug(`[LLM WS] Snapshot already received, job ${jobId} not in active jobs - fetching status via HTTP`)
      this._fetchAndUpdateJobStatus(organizationId, jobId, callback, conn.baseUrl)
    } else {
      conn.pendingJobs.add(jobId) // Mark as pending until we see it in snapshot or update
    }
  }

  /**
   * Unregister a job callback
   */
  unregisterJobCallback(organizationId, jobId) {
    const conn = this.connections.get(organizationId)
    if (conn) {
      conn.callbacks.delete(jobId)
      conn.pendingJobs.delete(jobId)
      conn.activeJobs.delete(jobId)
    }
  }

  /**
   * Handle incoming WebSocket message
   */
  _handleMessage(organizationId, data) {
    try {
      const message = JSON.parse(data.toString())
      debug(`[LLM WS] Received message for org ${organizationId}:`, message.type)

      if (message.type === "jobs_snapshot") {
        this._handleJobsSnapshot(organizationId, message)
      } else if (message.type === "job_update") {
        this._handleJobUpdate(organizationId, message)
      } else {
        debug(`[LLM WS] Unknown message type: ${message.type}`)
      }
    } catch (error) {
      appLogger.error(`[LLM WS] Error parsing message for org ${organizationId}: ${error.message}`)
    }
  }

  /**
   * Handle jobs_snapshot message
   * Updates the set of active jobs for this organization
   */
  async _handleJobsSnapshot(organizationId, message) {
    const conn = this.connections.get(organizationId)
    if (!conn) return

    const jobs = message.jobs || []
    const jobIdsInSnapshot = new Set(jobs.map((j) => j.job_id))
    debug(`[LLM WS] Jobs snapshot for org ${organizationId}: ${jobs.length} jobs`)

    // Mark snapshot as received - callbacks registered after this will trigger HTTP fetch
    conn.snapshotReceived = true

    // Update active jobs set
    conn.activeJobs.clear()
    for (const job of jobs) {
      if (OrganizationWebSocketManager.ACTIVE_STATES.includes(job.status)) {
        conn.activeJobs.add(job.job_id)
      }

      // Remove from pending if we see it
      conn.pendingJobs.delete(job.job_id)

      // Invoke callback for each job in snapshot (initial state)
      const callback = conn.callbacks.get(job.job_id)
      if (callback) {
        this._deliverUpdate(organizationId, callback, {
          job_id: job.job_id,
          status: job.status,
          progress: job.progress,
          timestamp: message.timestamp,
        })
      }
    }

    // Check for missing jobs: jobs that have callbacks but aren't in the snapshot
    // These jobs might have completed/failed before the snapshot was sent
    const missingJobs = []
    for (const [jobId, callback] of conn.callbacks) {
      if (!jobIdsInSnapshot.has(jobId)) {
        missingJobs.push({ jobId, callback })
      }
    }

    // Fetch status for missing jobs via HTTP API
    if (missingJobs.length > 0) {
      appLogger.info(`[LLM WS] ${missingJobs.length} jobs missing from snapshot, fetching status via HTTP`)
      for (const { jobId, callback } of missingJobs) {
        await this._fetchAndUpdateJobStatus(organizationId, jobId, callback, conn.baseUrl)
      }
    }

    // Check if we should close the connection
    this._checkAndCloseIfEmpty(organizationId)
  }

  /**
   * Fetch job status via HTTP API and invoke callback
   * Used as fallback when job is not in WebSocket snapshot
   */
  async _fetchAndUpdateJobStatus(organizationId, jobId, callback, baseUrl) {
    try {
      const url = `${baseUrl}/api/v1/jobs/${jobId}`
      const response = await axios.get(url)

      if (response && response.status) {
        debug(`[LLM WS] HTTP status for job ${jobId}: ${response.status}`)

        // Build update message from HTTP response
        const update = {
          job_id: jobId,
          status: response.status,
          progress: response.progress || null,
          result: response.result || null,
          error: response.error || null,
          timestamp: new Date().toISOString(),
        }

        this._deliverUpdate(organizationId, callback, update)

        const conn = this.connections.get(organizationId)
        if (conn) {
          conn.pendingJobs.delete(jobId)
          if (OrganizationWebSocketManager.TERMINAL_STATES.includes(response.status)) {
            conn.activeJobs.delete(jobId)
            conn.callbacks.delete(jobId)
          }
        }
      }
    } catch (err) {
      appLogger.error(`[LLM WS] Failed to fetch job status for ${jobId}: ${err.message}`)
      // Mark as error if we can't fetch status
      this._deliverUpdate(organizationId, callback, {
        job_id: jobId,
        status: "failed",
        error: `Failed to fetch job status: ${err.message}`,
        timestamp: new Date().toISOString(),
      })
    }
  }

  /**
   * Handle job_update message
   * Updates job status and invokes registered callback
   */
  async _handleJobUpdate(organizationId, message) {
    const conn = this.connections.get(organizationId)
    if (!conn) return

    const jobId = message.job_id
    debug(`[LLM WS] Job update for ${jobId}: status=${message.status}`)

    // Remove from pending
    conn.pendingJobs.delete(jobId)

    // Update active jobs set based on status
    if (OrganizationWebSocketManager.TERMINAL_STATES.includes(message.status)) {
      conn.activeJobs.delete(jobId)
    } else if (OrganizationWebSocketManager.ACTIVE_STATES.includes(message.status)) {
      conn.activeJobs.add(jobId)
    }

    // Every replica gets every org job; only the callback owner broadcasts
    const callback = conn.callbacks.get(jobId)
    if (callback) {
      this._deliverUpdate(organizationId, callback, message)

      if (OrganizationWebSocketManager.TERMINAL_STATES.includes(message.status)) {
        conn.callbacks.delete(jobId)
      }
    }

    this._checkAndCloseIfEmpty(organizationId)
  }

  /**
   * Invoke a job callback safely, then broadcast the update to the frontend.
   */
  _deliverUpdate(organizationId, callback, update) {
    try {
      callback(update)
    } catch (err) {
      appLogger.error(`[LLM WS] Error in callback for job ${update.job_id}: ${err.message}`)
    }
    this._lookupAndBroadcast(organizationId, update)
  }

  /**
   * True if this update differs from the job's last broadcast, and records it.
   */
  _isNewBroadcast(message) {
    // Progress differs across delivery paths, so terminal states dedup on status alone
    let signature = message.status
    if (!OrganizationWebSocketManager.TERMINAL_STATES.includes(message.status)) {
      signature += `|${message.progress?.percentage ?? ""}|${message.progress?.phase ?? ""}`
    }

    if (this._lastBroadcastSignature.get(message.job_id) === signature) {
      return false
    }
    if (this._lastBroadcastSignature.size >= 1000) {
      this._lastBroadcastSignature.delete(this._lastBroadcastSignature.keys().next().value)
    }
    // Delete first so a live job's entry does not age toward the eviction head
    this._lastBroadcastSignature.delete(message.job_id)
    this._lastBroadcastSignature.set(message.job_id, signature)
    return true
  }

  /**
   * Look up the job's conversation/service info and broadcast the update.
   */
  async _lookupAndBroadcast(organizationId, message) {
    if (!this._isNewBroadcast(message)) {
      debug(`[LLM WS] Skipping duplicate broadcast for job ${message.job_id} (status ${message.status})`)
      return
    }

    let retryable = false
    let convInfo = this._convInfoByJobId.get(message.job_id)
    if (!convInfo) {
      convInfo = { conversationId: null, serviceName: null, serviceFormat: null }
      try {
        const convExports = await model.conversationExport.getByJobId(message.job_id)
        if (convExports instanceof Error) throw convExports
        debug(`[LLM WS] Lookup for job ${message.job_id}: found ${convExports?.length || 0} records`)
        if (convExports && convExports.length > 0) {
          const convExport = convExports[0]
          convInfo = {
            conversationId: convExport.convId,
            serviceName: convExport.serviceName || convExport.format,
            serviceFormat: convExport.format,
          }
          if (this._convInfoByJobId.size >= 1000) {
            this._convInfoByJobId.delete(this._convInfoByJobId.keys().next().value)
          }
          this._convInfoByJobId.set(message.job_id, convInfo)
          debug(`[LLM WS] Found conversationId: ${convInfo.conversationId}, serviceName: ${convInfo.serviceName} for job ${message.job_id}`)
        } else {
          debug(`[LLM WS] No conversationExport found for job ${message.job_id}`)
        }
      } catch (err) {
        retryable = true
        debug(`[LLM WS] Could not look up conversationId for job ${message.job_id}: ${err.message}`)
      }
    }

    try {
      await this._broadcastToWebsocket(organizationId, message, convInfo.conversationId, convInfo.serviceName, convInfo.serviceFormat)
    } catch (err) {
      retryable = true
      debug(`[LLM WS] Failed to broadcast job ${message.job_id}: ${err.message}`)
    }

    if (retryable) {
      // Clear the signature so a redelivery can repair a degraded or failed broadcast
      this._lastBroadcastSignature.delete(message.job_id)
    } else if (OrganizationWebSocketManager.TERMINAL_STATES.includes(message.status)) {
      this._convInfoByJobId.delete(message.job_id)
    }
  }

  /**
   * Set the app reference for accessing IoHandler
   * Called during initialization
   * @param {object} app - Express app with components
   */
  setApp(app) {
    this._app = app
  }

  /**
   * Broadcast job update to frontend via IoHandler
   * @param {string} organizationId - Organization ID
   * @param {object} message - Job update message from LLM Gateway
   * @param {string|null} conversationId - Conversation ID from database lookup
   * @param {string|null} serviceName - Service name (for frontend matching)
   * @param {string|null} serviceFormat - Service format/route (for frontend matching)
   */
  async _broadcastToWebsocket(organizationId, message, conversationId = null, serviceName = null, serviceFormat = null) {
    // Use IoHandler directly if available (same process)
    if (this._app && this._app.components && this._app.components["IoHandler"]) {
      const ioHandler = this._app.components["IoHandler"]
      ioHandler.notifyLlmJobUpdate({
        organizationId,
        conversationId: conversationId,
        jobId: message.job_id,
        status: message.status,
        progress: message.progress || null,
        result: message.result || null,
        error: message.error || null,
        serviceName: serviceName,
        serviceFormat: serviceFormat,
        timestamp: new Date().toISOString(),
      })
      debug(`[LLM WS] Broadcasted job ${message.job_id} update via IoHandler (service: ${serviceName})`)
    } else {
      debug(`[LLM WS] Cannot broadcast: IoHandler not available`)
    }
  }

  /**
   * Check if the connection should be closed (no more active jobs)
   */
  _checkAndCloseIfEmpty(organizationId) {
    const conn = this.connections.get(organizationId)
    if (!conn) return

    // Don't close if there are active jobs, pending jobs, or registered callbacks
    if (conn.activeJobs.size > 0 || conn.pendingJobs.size > 0 || conn.callbacks.size > 0) {
      return
    }

    appLogger.info(`[LLM WS] No active jobs for organization ${organizationId}, closing connection`)
    this._destroyConnection(organizationId)
  }

  // Detach listeners and forget conn, unless a newer one replaced it
  _forgetConnection(organizationId, conn) {
    // typeof guards: test ws mocks are not EventEmitters
    if (typeof conn?.ws?.removeAllListeners === "function") {
      conn.ws.removeAllListeners()
      // Keep an error sink: a listener-less "error" event crashes the process
      conn.ws.on("error", () => {})
    }
    if (this.connections.get(organizationId) === conn) {
      this.connections.delete(organizationId)
    }
    // Preserve in-flight jobs so the next connection can resume them
    if (conn?.callbacks?.size > 0) {
      let stash = this._orphanedCallbacks.get(organizationId)
      if (!stash) {
        stash = new Map()
        this._orphanedCallbacks.set(organizationId, stash)
      }
      for (const [jobId, callback] of conn.callbacks) {
        stash.set(jobId, callback)
      }
    }
  }

  // Detach first so the close handler does not fire
  _destroyConnection(organizationId) {
    const conn = this.connections.get(organizationId)
    if (!conn) return

    const ws = conn.ws
    this._forgetConnection(organizationId, conn)
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
      ws.close(1000, "No active jobs")
    }
  }

  /**
   * Check if there are any active connections
   * Used for backward compatibility with getSocketStatus()
   */
  hasActiveConnections() {
    for (const [, conn] of this.connections) {
      if (conn.ws && conn.ws.readyState === WebSocket.OPEN) {
        return true
      }
    }
    return false
  }

  /**
   * Get all active job IDs across all organizations
   */
  getAllActiveJobs() {
    const allJobs = new Set()
    for (const [, conn] of this.connections) {
      for (const jobId of conn.activeJobs) {
        allJobs.add(jobId)
      }
    }
    return allJobs
  }

  /**
   * Close all WebSocket connections
   */
  closeAll() {
    for (const [organizationId] of this.connections) {
      this._destroyConnection(organizationId)
    }
    appLogger.info(`[LLM WS] All connections closed`)
  }

}

const singleton = new OrganizationWebSocketManager()
module.exports = singleton
