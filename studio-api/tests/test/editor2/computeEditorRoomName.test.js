const { computeEditorRoomName } = require(
  `${process.cwd()}/components/EditorHandler/utils/computeEditorRoomName`,
)

describe("computeEditorRoomName", () => {
  test("builds the room name from the conversation id", () => {
    expect(computeEditorRoomName("64a1f2e3b4c5d6e7f8a9b0c1")).toBe(
      "editor/64a1f2e3b4c5d6e7f8a9b0c1",
    )
  })

  test("distinct conversations get distinct rooms", () => {
    expect(computeEditorRoomName("conv-a")).not.toBe(
      computeEditorRoomName("conv-b"),
    )
  })
})
