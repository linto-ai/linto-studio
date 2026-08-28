import { inject, provide, type InjectionKey } from 'vue'
import type { Core } from './types'

const coreKey: InjectionKey<Core> = Symbol('core')

export function provideCore(core: Core): void {
  provide(coreKey, core)
}

export function useCore(): Core {
  const core = inject(coreKey)
  if (!core) {
    throw new Error('useCore() requires a parent provideCore()')
  }
  return core
}
