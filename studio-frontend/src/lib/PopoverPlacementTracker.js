// Watches everything that can move or resize an open popover, and asks for a
// new placement at most once per frame:
// - the window is resized or a container of the trigger scrolls;
// - the content changes size: results arriving after a loading state, a
//   search filtering the list, a footer appearing. Without it, the side
//   chosen from the first, smaller content would stick.
// Scrolling inside the popover itself moves nothing, and is ignored.
export default class PopoverPlacementTracker {
  constructor(content, onChange) {
    this.content = content
    this.onChange = onChange
    this.p_frame = null
    this.p_schedule = this.p_schedule.bind(this)
    this.p_onScroll = this.p_onScroll.bind(this)
    this.p_onChildrenChange = this.p_onChildrenChange.bind(this)

    // The content box itself is capped by its maximum height: its children
    // keep their natural size, so they are the ones that report growth.
    this.p_resizeObserver = new ResizeObserver(this.p_schedule)
    this.p_resizeObserver.observe(content)
    for (const child of content.children) {
      this.p_resizeObserver.observe(child)
    }
    // A child replaced (loading state, then results) is observed in turn.
    this.p_mutationObserver = new MutationObserver(this.p_onChildrenChange)
    this.p_mutationObserver.observe(content, { childList: true })

    window.addEventListener("resize", this.p_schedule, { passive: true })
    window.addEventListener("scroll", this.p_onScroll, {
      capture: true,
      passive: true,
    })
  }

  destroy() {
    this.p_resizeObserver.disconnect()
    this.p_mutationObserver.disconnect()
    window.removeEventListener("resize", this.p_schedule)
    window.removeEventListener("scroll", this.p_onScroll, { capture: true })
    cancelAnimationFrame(this.p_frame)
    this.p_frame = null
  }

  p_onChildrenChange(mutations) {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node instanceof Element) this.p_resizeObserver.observe(node)
      }
    }
    this.p_schedule()
  }

  p_onScroll(event) {
    if (event.target instanceof Node && this.content.contains(event.target)) {
      return
    }
    this.p_schedule()
  }

  p_schedule() {
    if (this.p_frame !== null) return
    this.p_frame = requestAnimationFrame(() => {
      this.p_frame = null
      this.onChange()
    })
  }
}
