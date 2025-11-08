import moment from "moment"
import { getCookie } from "../tools/getCookie"
import { sendRequest } from "../tools/sendRequest"
import { logout } from "../tools/logout"
import { sendMultipartFormData } from "../tools/sendMultipartFormData.js"
import { setCookie } from "../tools/setCookie.js"
import { timeToHMS } from "../tools/timeToHMS.js"
import { capitalizeFirstLetter } from "../tools/capitalizeFirstLetter.js"
import { testFieldEmpty } from "../tools/fields/testEmpty.js"
import { testContent } from "../tools/fields/testContent.js"
import { testName } from "../tools/fields/testName.js"
import { testEmail } from "../tools/fields/testEmail.js"
import { testPassword } from "../tools/fields/testPassword.js"
import { testPasswordConfirm } from "../tools/fields/testPasswordConfirm.js"

// Vue 3: Filters are deprecated, convert to global properties and utility functions
export const filters = {
  sendRequest,
  logout,
  sendMultipartFormData,
  timeToHMS,
  dateToJMY: function (date) {
    let splitDate = date.split("T")
    return splitDate[0]
  },
  dateToJMYHMS: function (date) {
    let splitDate = date.split("T")
    let fullTime = splitDate[1]
    let splitTime = fullTime.split("+")
    return `${splitDate[0]} - ${splitTime[0]}`
  },
  CapitalizeFirstLetter: function (string) {
    return capitalizeFirstLetter(string)
  },
  testFieldEmpty,
  testSelectField: function (obj) {
    obj.error = null
    obj.valid = false
    if (typeof obj.value === "undefined") {
      obj.value = ""
    }
    if (obj.value === "" || obj.value.length === 0) {
      obj.error = "This field is required"
    } else {
      obj.valid = true
    }
  },
  testName,
  testContent,
  testPassword,
  testPasswordConfirm,
  testEmail,
  setCookie,
  getCookie,
  getTimeDiffText: function (date) {
    return moment(date).fromNow()
  }
}

// Vue 3 plugin to install filters as global properties
export default {
  install(app) {
    // Make filters available as $filters in all components
    app.config.globalProperties.$filters = filters
  }
}
