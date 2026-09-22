import { afterEach, describe, expect, it } from "bun:test"
import { nextTick } from "vue"
import { createCore } from "../createCore"

/** Stands in for the browser's media query so the core can be built at a
 *  chosen width and resized — there is no DOM under `bun test`. */
function installViewport(isMobile: boolean) {
  const listeners = new Set<(event: MediaQueryListEvent) => void>()
  const query = {
    matches: isMobile,
    addEventListener(_: string, listener: (event: MediaQueryListEvent) => void) {
      listeners.add(listener)
    },
    removeEventListener(
      _: string,
      listener: (event: MediaQueryListEvent) => void,
    ) {
      listeners.delete(listener)
    },
  }
  Object.defineProperty(globalThis, "window", {
    value: { matchMedia: () => query },
    configurable: true,
    writable: true,
  })
  return {
    resizeTo(matches: boolean) {
      query.matches = matches
      for (const listener of [...listeners]) {
        listener({ matches } as MediaQueryListEvent)
      }
    },
    listenerCount: () => listeners.size,
  }
}

function uninstallViewport(): void {
  Reflect.deleteProperty(globalThis, "window")
}

afterEach(uninstallViewport)

describe("createCore — sidebar drawer", () => {
  it("opens and closes on mobile, reporting every move to the host", () => {
    installViewport(true)
    const core = createCore()
    const seen: boolean[] = []
    core.on("sidebar:open", ({ open }) => seen.push(open))

    expect(core.sidebarOpen.value).toBe(false)

    core.setSidebarOpen(true)
    expect(core.sidebarOpen.value).toBe(true)

    core.setSidebarOpen(false)
    expect(core.sidebarOpen.value).toBe(false)

    expect(seen).toEqual([true, false])
  })

  it("stays silent when the state does not actually change", () => {
    installViewport(true)
    const core = createCore()
    let events = 0
    core.on("sidebar:open", () => events++)

    core.setSidebarOpen(false)
    core.setSidebarOpen(true)
    core.setSidebarOpen(true)

    expect(events).toBe(1)
  })

  it("refuses to open above the breakpoint, and keeps no armed state", () => {
    const viewport = installViewport(false)
    const core = createCore()
    let events = 0
    core.on("sidebar:open", () => events++)

    core.setSidebarOpen(true)
    expect(core.sidebarOpen.value).toBe(false)
    expect(events).toBe(0)

    // The drawer appears at phone width — closed, not sprung open by the
    // call made while it did not exist.
    viewport.resizeTo(true)
    expect(core.sidebarOpen.value).toBe(false)
    expect(events).toBe(0)
  })

  it("closes itself when the viewport leaves phone width", () => {
    const viewport = installViewport(true)
    const core = createCore()
    const seen: boolean[] = []
    core.on("sidebar:open", ({ open }) => seen.push(open))

    core.setSidebarOpen(true)
    viewport.resizeTo(false)

    expect(core.sidebarOpen.value).toBe(false)
    expect(seen).toEqual([true, false])
  })
})

describe("createCore — viewport", () => {
  it("reports every crossing of the breakpoint to the host", () => {
    const viewport = installViewport(false)
    const core = createCore()
    const seen: boolean[] = []
    core.on("viewport:change", ({ isMobile }) => seen.push(isMobile))

    expect(core.isMobile.value).toBe(false)

    viewport.resizeTo(true)
    expect(core.isMobile.value).toBe(true)

    viewport.resizeTo(false)
    expect(core.isMobile.value).toBe(false)

    expect(seen).toEqual([true, false])
  })

  it("releases its listener on destroy", () => {
    const viewport = installViewport(true)
    const core = createCore()
    expect(viewport.listenerCount()).toBe(1)

    core.destroy()
    expect(viewport.listenerCount()).toBe(0)
  })

  it("builds and tears down without a DOM to watch", () => {
    uninstallViewport()
    const core = createCore()

    expect(core.isMobile.value).toBe(false)
    expect(() => core.destroy()).not.toThrow()
  })
})

describe("createCore — transcript font size", () => {
  it("starts at the default and announces every change", async () => {
    const core = createCore()
    const seen: number[] = []
    core.on("transcript:fontSize", ({ fontSize }) => seen.push(fontSize))

    expect(core.transcriptFontSize.value).toBe(18)

    core.transcriptFontSize.value = 24
    await nextTick()
    core.transcriptFontSize.value = 14
    await nextTick()

    expect(seen).toEqual([24, 14])
  })

  it("stops announcing once destroyed", async () => {
    const core = createCore()
    let events = 0
    core.on("transcript:fontSize", () => events++)

    core.destroy()
    core.transcriptFontSize.value = 24
    await nextTick()

    expect(events).toBe(0)
  })
})

describe("createCore — theme", () => {
  it("starts light and announces every switch", async () => {
    const core = createCore()
    const seen: string[] = []
    core.on("theme:change", ({ theme }) => seen.push(theme))

    expect(core.theme.value).toBe("light")

    core.theme.value = "dark"
    await nextTick()
    core.theme.value = "light"
    await nextTick()

    expect(seen).toEqual(["dark", "light"])
  })

  it("stops announcing once destroyed", async () => {
    const core = createCore()
    let events = 0
    core.on("theme:change", () => events++)

    core.destroy()
    core.theme.value = "dark"
    await nextTick()

    expect(events).toBe(0)
  })
})
