export const userModelMixin = {
  computed: {
    firstname() {
      return this?.user?.firstname ?? ""
    },
    lastname() {
      return this?.user?.lastname ?? ""
    },
    email() {
      return this?.user?.email ?? ""
    },
    id() {
      return this?.user?._id ?? ""
    },
  },
}
