import { describe, expect, it } from "bun:test"
import { createCore } from "@linto-ai/transcript-ui-core"
import { createNoticePlugin } from "../index"

describe("createNoticePlugin", () => {
  it("exposes the content, closed by default", () => {
    const core = createCore()
    core.use(createNoticePlugin({ content: "## Notice" }))

    expect(core.notice!.content.value).toBe("## Notice")
    expect(core.notice!.isOpen.value).toBe(false)
  })

  it("registers the dialog in the noticeDialog slot", () => {
    const core = createCore()
    core.use(createNoticePlugin({ content: "" }))

    expect(core.components.noticeDialog).toBeDefined()
  })

  it("opens and closes", () => {
    const core = createCore()
    core.use(createNoticePlugin({ content: "" }))

    core.notice!.open()
    expect(core.notice!.isOpen.value).toBe(true)

    core.notice!.close()
    expect(core.notice!.isOpen.value).toBe(false)
  })

  it("closes and clears core.notice on uninstall", () => {
    const core = createCore()
    core.use(createNoticePlugin({ content: "" }))
    const notice = core.notice!
    notice.open()

    core.destroy()

    expect(notice.isOpen.value).toBe(false)
    expect(core.notice).toBeUndefined()
  })
})
