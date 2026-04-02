import { ref, onMounted, onBeforeUnmount } from 'vue'

const MOBILE_BREAKPOINT = '(max-width: 767px)'

export function useIsMobile() {
  const isMobile = ref(false)
  let mql: MediaQueryList | null = null

  function onChange(e: MediaQueryListEvent) {
    isMobile.value = e.matches
  }

  onMounted(() => {
    mql = window.matchMedia(MOBILE_BREAKPOINT)
    isMobile.value = mql.matches
    mql.addEventListener('change', onChange)
  })

  onBeforeUnmount(() => {
    mql?.removeEventListener('change', onChange)
  })

  return { isMobile }
}
