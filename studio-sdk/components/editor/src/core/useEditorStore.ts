import { inject, provide, type InjectionKey } from 'vue'
import type { EditorStore } from './types'

const editorStoreKey: InjectionKey<EditorStore> = Symbol('editorStore')

export function provideEditorStore(store: EditorStore): void {
  provide(editorStoreKey, store)
}

export function useEditorStore(): EditorStore {
  const store = inject(editorStoreKey)
  if (!store) {
    throw new Error('useEditorStore() requires a parent provideEditorStore()')
  }
  return store
}
