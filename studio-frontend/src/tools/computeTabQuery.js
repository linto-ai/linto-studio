// The URL query showing a tab, the other parameters untouched. The first tab is
// the default one and stays out of the URL.
export function computeTabQuery(query, tabs, tab) {
  const nextQuery = { ...query, tab }
  if (tab === tabs[0].name) delete nextQuery.tab
  return nextQuery
}
