import test from "ava"

// Mock DEFAULTENV
const DEFAULTENV = {
  VUE_APP_NAME: "LinTO Studio",
  VUE_APP_MODE: "basic",
}

// Mock getCurrentTheme
const mockThemeDefaults = {}
function getCurrentTheme() {
  return { defaultEnvValues: mockThemeDefaults }
}

// Replicate getEnv logic for testing
function getEnv(envKey) {
  const vueEnvKey = envKey.startsWith("VUE_APP_") ? envKey : `VUE_APP_${envKey}`

  // Runtime config (Docker)
  if (typeof window !== 'undefined' && window.VUE_APP_CONFIG?.[vueEnvKey] !== undefined) {
    return window.VUE_APP_CONFIG[vueEnvKey]
  }

  // Build-time env (local dev)
  if (process.env[vueEnvKey] !== undefined) {
    return process.env[vueEnvKey]
  }

  // Theme defaults
  const themeEnv = getCurrentTheme()?.defaultEnvValues || {}
  if (themeEnv[vueEnvKey] !== undefined) {
    return themeEnv[vueEnvKey]
  }

  // Hardcoded defaults
  return DEFAULTENV[vueEnvKey]
}

// Test: getEnv returns value from window.VUE_APP_CONFIG when set
test("getEnv returns value from window.VUE_APP_CONFIG when set", (t) => {
  // Setup: set runtime config
  global.window.VUE_APP_CONFIG = {
    VUE_APP_TEST_VALUE: "runtime_value"
  }

  const result = getEnv("VUE_APP_TEST_VALUE")
  t.is(result, "runtime_value")

  // Cleanup
  delete global.window.VUE_APP_CONFIG
})

// Test: getEnv works with short key format (without VUE_APP_ prefix)
test("getEnv works with short key format", (t) => {
  global.window.VUE_APP_CONFIG = {
    VUE_APP_SHORT_KEY: "short_key_value"
  }

  const result = getEnv("SHORT_KEY")
  t.is(result, "short_key_value")

  delete global.window.VUE_APP_CONFIG
})

// Test: getEnv falls back to process.env when window config not set
test("getEnv falls back to process.env when window config not set", (t) => {
  // Ensure window config is not set
  delete global.window.VUE_APP_CONFIG

  // Set process.env value
  process.env.VUE_APP_FALLBACK_TEST = "process_env_value"

  const result = getEnv("VUE_APP_FALLBACK_TEST")
  t.is(result, "process_env_value")

  // Cleanup
  delete process.env.VUE_APP_FALLBACK_TEST
})

// Test: getEnv returns DEFAULTENV value as last resort
test("getEnv returns DEFAULTENV value as last resort", (t) => {
  // Ensure window config and process.env are not set for this key
  delete global.window.VUE_APP_CONFIG

  // VUE_APP_NAME exists in DEFAULTENV
  const result = getEnv("VUE_APP_NAME")
  t.is(result, DEFAULTENV.VUE_APP_NAME)
})

// Test: getEnv prioritizes window config over process.env
test("getEnv prioritizes window config over process.env", (t) => {
  global.window.VUE_APP_CONFIG = {
    VUE_APP_PRIORITY_TEST: "window_value"
  }
  process.env.VUE_APP_PRIORITY_TEST = "process_value"

  const result = getEnv("VUE_APP_PRIORITY_TEST")
  t.is(result, "window_value")

  delete global.window.VUE_APP_CONFIG
  delete process.env.VUE_APP_PRIORITY_TEST
})

// Test: getEnv returns undefined for non-existent keys
test("getEnv returns undefined for non-existent keys", (t) => {
  delete global.window.VUE_APP_CONFIG

  const result = getEnv("VUE_APP_NON_EXISTENT_KEY_12345")
  t.is(result, undefined)
})

// Test: getEnv handles empty string values correctly
test("getEnv handles empty string values correctly", (t) => {
  global.window.VUE_APP_CONFIG = {
    VUE_APP_EMPTY_STRING: ""
  }

  // Empty string is a valid value, should not fall back
  const result = getEnv("VUE_APP_EMPTY_STRING")
  t.is(result, "")

  delete global.window.VUE_APP_CONFIG
})

// Test: getEnv handles boolean-like string values
test("getEnv handles boolean-like string values", (t) => {
  global.window.VUE_APP_CONFIG = {
    VUE_APP_BOOL_TRUE: "true",
    VUE_APP_BOOL_FALSE: "false"
  }

  const trueResult = getEnv("VUE_APP_BOOL_TRUE")
  const falseResult = getEnv("VUE_APP_BOOL_FALSE")

  t.is(trueResult, "true")
  t.is(falseResult, "false")

  delete global.window.VUE_APP_CONFIG
})
