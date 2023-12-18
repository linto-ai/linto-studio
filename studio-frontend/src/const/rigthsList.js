const RIGHTS_LIST = (t) => [
  {
    value: 0,
    txt: t("conversation.members_right_txt.none"),
  },
  {
    value: 1,
    txt: t("conversation.members_right_txt.read"),
  },
  {
    value: 3,
    txt: t("conversation.members_right_txt.comment"),
  },
  {
    value: 7,
    txt: t("conversation.members_right_txt.write"),
  },
  {
    value: 23,
    txt: t("conversation.members_right_txt.share"),
  },
  {
    value: 31,
    txt: t("conversation.members_right_txt.full_rights"),
  },
]

export default RIGHTS_LIST
