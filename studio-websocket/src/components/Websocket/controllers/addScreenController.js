import SubtitleHelper from "../models/subtitles.js"
import { addScreen } from "../request/index.js"

export default async function addScreenController(data, io) {
  try {
    let { userToken, conversationId, subtitleId, screenData } = data
    let subtitle = SubtitleHelper.getById(subtitleId)
    let placement = screenData.after ? "after" : "before"

    let newScreen = await addScreen(
      conversationId,
      subtitleId,
      screenData.screen_id,
      placement,
      screenData.newScreen,
      userToken
    )

    if (newScreen.status === "success") {
      screenData.newScreen.screen_id = newScreen.data._id
      subtitle.addScreen(screenData, (binaryDelta) => {
        let room = `subtitle/${subtitleId}`
        console.log("send to room " + room)
        io.to(room).emit("subtitle_updated", {
          origin: "subtitle_screen_added",
          delta: binaryDelta,
        })
      })
    } else {
      this.emit("error")
    }
  } catch (error) {
    console.log(error)
    this.emit("error")
  }
}
