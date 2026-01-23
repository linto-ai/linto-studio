import {
  SECURITY_LEVEL_PUBLIC,
  SECURITY_LEVEL_COMMISSION,
  SECURITY_LEVEL_SENSITIVE,
} from "./securityLevels.js"

const SECURITY_LEVELS_LIST = (t) => [
  {
    value: SECURITY_LEVEL_PUBLIC,
    txt: t("conversation.security_level_txt.0"),
  },
  {
    value: SECURITY_LEVEL_COMMISSION,
    txt: t("conversation.security_level_txt.1"),
  },
  {
    value: SECURITY_LEVEL_SENSITIVE,
    txt: t("conversation.security_level_txt.2"),
  },
]

export default SECURITY_LEVELS_LIST
