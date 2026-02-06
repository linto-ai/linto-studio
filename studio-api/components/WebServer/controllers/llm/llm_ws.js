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
    if (existing && existing.ws && existing.ws.readyState === WebSocket.OPEN) {
      debug(`Already connected to organization ${organizationId}`)
      return
    }

    // Clean up any stale connection
    if (existing) {
      this._cleanupConnection(organizationId)
    }

    // Create new connection
    await this._createConnection(organizationId, baseUrl)
  }

  /**
   * Create a new WebSocket connection for an organization
   */
  async _createConnection(organizationId, baseUrl) {
    return new Promise((resolve, reject) => {
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

      this.connections.set(organizationId, connectionData)

      ws.on("open", () => {
        appLogger.info(`[LLM WS] Connected to organization ${organizationId}`)
        resolve()
      })

      ws.on("message", (data) => {
        this._handleMessage(organizationId, data)
      })

      ws.on("close", (code) => {
        appLogger.info(`[LLM WS] Disconnected from organization ${organizationId} (code: ${code})`)
        this._cleanupConnection(organizationId)
      })

      ws.on("error", (error) => {
        appLogger.error(`[LLM WS] Error for organization ${organizationId}: ${error.message}`)
        this._cleanupConnection(organizationId)
        reject(error)
      })

      // Timeout for initial connection
      setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          ws.close()
          reject(new Error(`WebSocket connection timeout for organization ${organizationId}`))
        }
      }, 10000)
    })
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
        try {
          callback({
            job_id: job.job_id,
            status: job.status,
            progress: job.progress,
            timestamp: message.timestamp,
          })
        } catch (err) {
          appLogger.error(`[LLM WS] Error in callback for job ${job.job_id}: ${err.message}`)
        }
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

        // Invoke callback
        try {
          callback(update)
        } catch (err) {
          appLogger.error(`[LLM WS] Error in callback for job ${jobId}: ${err.message}`)
        }

        // Update connection state
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
      try {
        callback({
          job_id: jobId,
          status: "failed",
          error: `Failed to fetch job status: ${err.message}`,
          timestamp: new Date().toISOString(),
        })
      } catch (cbErr) {
        appLogger.error(`[LLM WS] Error in error callback for job ${jobId}: ${cbErr.message}`)
      }
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

    // Invoke callback for this job
    const callback = conn.callbacks.get(jobId)
    if (callback) {
      try {
        callback(message)
      } catch (err) {
        appLogger.error(`[LLM WS] Error in callback for job ${jobId}: ${err.message}`)
      }

      // Clean up callback if job is complete
      if (OrganizationWebSocketManager.TERMINAL_STATES.includes(message.status)) {
        conn.callbacks.delete(jobId)
      }
    }

    // Look up conversationId and service info from database to include in broadcast
    let conversationId = null
    let serviceName = null
    let serviceFormat = null
    try {
      const convExports = await model.conversationExport.getByJobId(jobId)
      debug(`[LLM WS] Lookup for job ${jobId}: found ${convExports?.length || 0} records`)
      if (convExports && convExports.length > 0) {
        const convExport = convExports[0]
        conversationId = convExport.convId
        serviceName = convExport.serviceName || convExport.format
        serviceFormat = convExport.format
        debug(`[LLM WS] Found conversationId: ${conversationId}, serviceName: ${serviceName} for job ${jobId}`)
      } else {
        debug(`[LLM WS] No conversationExport found for job ${jobId}`)
      }
    } catch (err) {
      debug(`[LLM WS] Could not look up conversationId for job ${jobId}: ${err.message}`)
    }

    // Broadcast to studio-websocket for real-time frontend updates
    this._broadcastToWebsocket(organizationId, message, conversationId, serviceName, serviceFormat)

    // Check if we should close the connection
    this._checkAndCloseIfEmpty(organizationId)
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
    this._closeConnection(organizationId)
  }

  /**
   * Close WebSocket connection for an organization
   */
  _closeConnection(organizationId) {
    const conn = this.connections.get(organizationId)
    if (conn && conn.ws) {
      if (conn.ws.readyState === WebSocket.OPEN) {
        conn.ws.close(1000, "No active jobs")
      }
    }
    this._cleanupConnection(organizationId)
  }

  /**
   * Clean up connection data for an organization
   */
  _cleanupConnection(organizationId) {
    this.connections.delete(organizationId)
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
   * Get the number of active connections
   */
  getActiveConnectionCount() {
    let count = 0
    for (const [, conn] of this.connections) {
      if (conn.ws && conn.ws.readyState === WebSocket.OPEN) {
        count++
      }
    }
    return count
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
      this._closeConnection(organizationId)
    }
    appLogger.info(`[LLM WS] All connections closed`)
  }

  // ===============================
  // Legacy Compatibility Methods
  // ===============================

  /**
   * Legacy compatibility: watchingList property
   * Returns a set of all active job IDs
   */
  get watchingList() {
    return this.getAllActiveJobs()
  }

  /**
   * Legacy compatibility: getSocket()
   * Returns a dummy object for backward compatibility
   */
  getSocket() {
    return {
      readyState: this.hasActiveConnections() ? WebSocket.OPEN : WebSocket.CLOSED,
    }
  }

  /**
   * Legacy compatibility: getSocketState()
   */
  getSocketState() {
    return this.hasActiveConnections() ? WebSocket.OPEN : WebSocket.CLOSED
  }

  /**
   * Legacy compatibility: connectToJob()
   * Note: This no longer works without organization context
   * Jobs must be watched via ensureConnection + registerJobCallback
   */
  connectToJob(jobId) {
    appLogger.warn(`[LLM WS] connectToJob() is deprecated. Use ensureConnection() + registerJobCallback() with organization ID`)
    return null
  }

  /**
   * Legacy compatibility: sendMessage()
   * Deprecated - use organization-scoped methods
   */
  sendMessage(jobIds) {
    appLogger.warn(`[LLM WS] sendMessage() is deprecated. Use ensureConnection() + registerJobCallback() with organization ID`)
  }

  /**
   * Legacy compatibility: watchJobs()
   * Deprecated - use organization-scoped methods
   */
  watchJobs(jobIds) {
    appLogger.warn(`[LLM WS] watchJobs() is deprecated. Use ensureConnection() + registerJobCallback() with organization ID`)
  }

  /**
   * Legacy compatibility: areJobsInWatchingList()
   */
  areJobsInWatchingList(jobIds) {
    const allJobs = this.getAllActiveJobs()
    return jobIds.every((jobId) => allJobs.has(jobId))
  }

  /**
   * Legacy compatibility: completedJob()
   */
  completedJob(status) {
    const terminalStatuses = ["complete", "completed", "error", "failed", "cancelled", "unknown"]
    return terminalStatuses.includes(status)
  }
}

const singleton = new OrganizationWebSocketManager()
module.exports = singleton
