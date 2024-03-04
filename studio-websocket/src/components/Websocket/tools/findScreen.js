export default function findScreen(screens, screen_id) {
  return screens.find((screen) => screen.screen_id === screen_id) || null
}
