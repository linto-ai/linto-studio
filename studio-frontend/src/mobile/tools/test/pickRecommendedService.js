import test from "ava"
import { pickRecommendedService } from "../pickRecommendedService.js"

const services = [
  { serviceName: "a", order: 3 },
  { serviceName: "b", order: 1 },
  { serviceName: "c" },
]

test("pickRecommendedService() honors the remembered service first", (t) => {
  t.is(pickRecommendedService(services, "c").serviceName, "c")
})

test("pickRecommendedService() falls back to the lowest order", (t) => {
  t.is(pickRecommendedService(services, "unknown").serviceName, "b")
  t.is(pickRecommendedService(services, null).serviceName, "b")
})

test("pickRecommendedService() takes the first service without any order", (t) => {
  t.is(
    pickRecommendedService([{ serviceName: "x" }, { serviceName: "y" }], null)
      .serviceName,
    "x",
  )
  t.is(pickRecommendedService([], null), null)
})
