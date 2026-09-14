const DOMAIN_PATTERN = /^(?=.{1,253}$)([a-z0-9-]+\.)+[a-z]{2,}$/

export function isEmailDomain(value) {
  return DOMAIN_PATTERN.test(value)
}
