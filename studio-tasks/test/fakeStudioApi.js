// Stands for studio-api during a test: answers each "METHOD path" with the
// given handler and keeps the calls it received.
function fakeStudioApi(t, routes) {
  const calls = []

  async function request(url, options) {
    const call = {
      route: `${options.method} ${url.pathname}`,
      query: Object.fromEntries(url.searchParams),
      authorization: options.headers.Authorization,
      body: options.body ? JSON.parse(options.body) : undefined,
    }
    calls.push(call)

    const handler = routes[call.route]
    let status = 404
    let body = { message: "Not found" }
    if (handler) {
      const answer = handler(call)
      status = answer.status ?? 200
      body = answer.body
    }
    return {
      ok: status >= 200 && status < 300,
      status,
      json: async () => body,
      text: async () => JSON.stringify(body),
    }
  }

  t.mock.method(globalThis, "fetch", request)
  return { calls }
}

module.exports = { fakeStudioApi }
