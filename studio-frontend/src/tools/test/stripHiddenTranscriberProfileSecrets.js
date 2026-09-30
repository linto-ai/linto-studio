import test from "ava"
import stripHiddenTranscriberProfileSecrets, {
  HIDDEN_KEY_PLACEHOLDER,
  HIDDEN_CREDENTIALS_PLACEHOLDER,
} from "../stripHiddenTranscriberProfileSecrets.js"

test("drops every placeholder the Session-API puts in place of a secret", (t) => {
  const config = {
    type: "openai_streaming",
    name: "gpt",
    endpoint: "wss://asr.example",
    key: HIDDEN_KEY_PLACEHOLDER,
    apiKey: HIDDEN_KEY_PLACEHOLDER,
    credentials: HIDDEN_CREDENTIALS_PLACEHOLDER,
  }
  const cleaned = stripHiddenTranscriberProfileSecrets(config)
  t.false("key" in cleaned)
  t.false("apiKey" in cleaned)
  t.false("credentials" in cleaned)
  t.is(cleaned.type, "openai_streaming")
  t.is(cleaned.endpoint, "wss://asr.example")
})

test("keeps a real (newly typed) secret untouched", (t) => {
  const cleaned = stripHiddenTranscriberProfileSecrets({
    key: "real-key",
    apiKey: "sk-real",
    credentials: '{"private_key":"pem"}',
  })
  t.is(cleaned.key, "real-key")
  t.is(cleaned.apiKey, "sk-real")
  t.is(cleaned.credentials, '{"private_key":"pem"}')
})

test("does not mutate its input and passes non-objects through", (t) => {
  const config = { apiKey: HIDDEN_KEY_PLACEHOLDER, name: "n" }
  const cleaned = stripHiddenTranscriberProfileSecrets(config)
  t.is(config.apiKey, HIDDEN_KEY_PLACEHOLDER)
  t.not(cleaned, config)
  t.is(stripHiddenTranscriberProfileSecrets(null), null)
  t.is(stripHiddenTranscriberProfileSecrets(undefined), undefined)
})
