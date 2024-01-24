export default function findScreenIndex(screens, screenIndex) {
  return screens.findIndex((screen) => screen.screen_id === screenIndex)
}
