/**
 * A discussion of the API (a chat "session" on the wire) in the shape of the
 * SDK chat plugin.
 * @param {{ _id: string, title: string }} session
 * @returns {{ id: string, title: string }}
 */
export function mapDiscussion(session) {
  return { id: session._id, title: session.title }
}
