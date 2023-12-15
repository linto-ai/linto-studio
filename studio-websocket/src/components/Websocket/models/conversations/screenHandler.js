import { updateScreen } from "../../request/index.js"

export async function handleScreenChange(
  yEvent,
  transaction,
  conversationId,
  subtitleId,
  userToken
) {
  if (transaction.origin === "websocket") return true

  if (yEvent.length === 1 && yEvent[0].path.length === 0) {
    // TODO: update all screens
    return true
  } else {
    return await updateSingleScreen(
      yEvent,
      transaction,
      conversationId,
      subtitleId,
      userToken
    )
  }
}

async function updateSingleScreen(
  yEvent,
  transaction,
  conversationId,
  subtitleId,
  userToken
) {
  let screenToUpdate = []
  for (const event of yEvent) {
    const screenIndex = event.path[0]
    const screen = event.currentTarget.get(screenIndex).toJSON()
    screenToUpdate.push(screen)
  }

  const nbOfScreenToUpdate = screenToUpdate.length

  if (nbOfScreenToUpdate > 1) {
    console.error("More than one screen to update")
    return false
  }

  if (nbOfScreenToUpdate === 1) {
    let screen = screenToUpdate[0]
    let res = await updateScreen(
      conversationId,
      subtitleId,
      screen.screen_id,
      screen,
      userToken
    )

    return res.status === "success"
  }
}
