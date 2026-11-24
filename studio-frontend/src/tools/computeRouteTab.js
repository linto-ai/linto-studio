// The tab a page shows for the one its URL asks: the first one when the URL
// asks for none, or for a tab the page does not have.
export function computeRouteTab(tabs, requestedTab) {
  const isKnown = tabs.some((tab) => tab.name === requestedTab)
  return isKnown ? requestedTab : tabs[0].name
}
