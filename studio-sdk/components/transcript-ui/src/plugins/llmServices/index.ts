import { ref, computed, shallowRef, type Ref } from "vue"
import type {
  Core,
  CorePlugin,
  LLMService,
  LLMServiceInit,
  LLMServiceStatus,
  LLMServicesPluginApi,
} from "../../core/types"

export type {
  LLMService,
  LLMServiceInit,
  LLMServiceStatus,
  LLMServicesPluginApi,
}

interface InternalLLMService {
  readonly id: string
  readonly label: Ref<string>
  readonly description: Ref<string | null>
  readonly content: Ref<string>
  readonly status: Ref<LLMServiceStatus>
  readonly progress: Ref<number>
  readonly phase: Ref<string | null>
  readonly error: Ref<string | null>
  readonly lastUpdate: Ref<number | null>
}

function createService(init: LLMServiceInit): InternalLLMService {
  return {
    id: init.id,
    label: ref<string>(init.label),
    description: ref<string | null>(init.description ?? null),
    content: ref<string>(init.content ?? ""),
    status: ref<LLMServiceStatus>(init.status ?? "idle"),
    progress: ref<number>(init.progress ?? 0),
    phase: ref<string | null>(init.phase ?? null),
    error: ref<string | null>(init.error ?? null),
    lastUpdate: ref<number | null>(init.lastUpdate ?? null),
  }
}

function clampProgress(value: number): number {
  if (!Number.isFinite(value)) return 0
  if (value < 0) return 0
  if (value > 100) return 100
  return value
}

export function createLLMServicesPlugin(): CorePlugin {
  return {
    name: "llmServices",

    install(core: Core) {
      const services = new Map<string, InternalLLMService>()
      const list = shallowRef<LLMService[]>([])
      const activeId = ref<string | null>(null)

      function rebuildList(): void {
        list.value = Array.from(services.values())
      }

      function require(id: string): InternalLLMService | undefined {
        return services.get(id)
      }

      function register(init: LLMServiceInit): LLMService {
        const existing = services.get(init.id)
        if (existing) {
          if (init.label !== undefined) existing.label.value = init.label
          if (init.description !== undefined)
            existing.description.value = init.description
          if (init.content !== undefined) existing.content.value = init.content
          if (init.status !== undefined) existing.status.value = init.status
          if (init.progress !== undefined)
            existing.progress.value = clampProgress(init.progress)
          if (init.phase !== undefined) existing.phase.value = init.phase
          if (init.error !== undefined) existing.error.value = init.error
          if (init.lastUpdate !== undefined)
            existing.lastUpdate.value = init.lastUpdate
          return existing
        }

        const service = createService(init)
        services.set(init.id, service)
        rebuildList()
        return service
      }

      function unregister(id: string): void {
        if (!services.delete(id)) return
        if (activeId.value === id) {
          activeId.value = null
          core.emit("llmService:active", { id: null })
        }
        rebuildList()
      }

      function clear(): void {
        if (services.size === 0 && activeId.value === null) return
        services.clear()
        if (activeId.value !== null) {
          activeId.value = null
          core.emit("llmService:active", { id: null })
        }
        rebuildList()
      }

      function get(id: string): LLMService | undefined {
        return services.get(id)
      }

      function setActive(id: string | null): void {
        if (id !== null && !services.has(id)) return
        if (activeId.value === id) return
        activeId.value = id
        core.emit("llmService:active", { id })
      }

      function setLabel(id: string, label: string): void {
        const service = require(id)
        if (service) service.label.value = label
      }

      function setStatus(id: string, status: LLMServiceStatus): void {
        const service = require(id)
        if (!service) return
        service.status.value = status
        if (status !== "error") service.error.value = null
        if (status === "complete") {
          service.progress.value = 100
          service.phase.value = null
        }
      }

      function setProgress(
        id: string,
        percentage: number,
        phase?: string | null,
      ): void {
        const service = require(id)
        if (!service) return
        service.progress.value = clampProgress(percentage)
        if (phase !== undefined) service.phase.value = phase
      }

      function setContent(
        id: string,
        content: string,
        lastUpdate?: number | null,
      ): void {
        const service = require(id)
        if (!service) return
        service.content.value = content
        service.lastUpdate.value = lastUpdate ?? Date.now()
      }

      function setError(id: string, error: string | null): void {
        const service = require(id)
        if (!service) return
        service.error.value = error
        if (error) service.status.value = "error"
      }

      const active = computed<LLMService | null>(() => {
        const id = activeId.value
        if (id === null) return null
        return services.get(id) ?? null
      })

      const api: LLMServicesPluginApi = {
        list,
        activeId,
        active,
        setActive,
        register,
        unregister,
        clear,
        get,
        setLabel,
        setStatus,
        setProgress,
        setContent,
        setError,
      }

      core.llmServices = api

      return () => {
        services.clear()
        list.value = []
        activeId.value = null
        core.llmServices = undefined
      }
    },
  }
}
