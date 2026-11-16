import { API_UNREACHABLE_ROUTE } from "../const/apiUnreachableRoute.js"

/**
 * Where a navigation goes while the API does not answer: the "API
 * unreachable" page, which keeps the page asked for to retry it. Its own
 * query key, not `next`: the classic guard sends any navigation coming
 * from a page with `?next=` to that target, which would loop with the
 * guard's own redirects (organization scope, settings…).
 * @param {{ fullPath: string }} to
 * @returns {{ name: string, query: { page: string } }}
 */
export function buildApiUnreachableRoute(to) {
  return { name: API_UNREACHABLE_ROUTE, query: { page: to.fullPath } }
}
