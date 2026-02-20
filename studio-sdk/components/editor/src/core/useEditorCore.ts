import { inject, provide, type InjectionKey } from 'vue'
import type { EditorCore } from './types'

const editorCoreKey: InjectionKey<EditorCore> = Symbol('editorCore')

export function provideEditorCore(core: EditorCore): void {
  provide(editorCoreKey, core)
}

export function useEditorCore(): EditorCore {
  const core = inject(editorCoreKey)
  if (!core) {
    throw new Error('useEditorCore() requires a parent provideEditorCore()')
  }
  return core
}
