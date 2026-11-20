import { apiGetPublicUserById } from "../../api/studio-api/user.js"
import { API_ENDPOINTS } from "@/const/apiEndpoints.js"

export async function getUserInfo(userId) {
  try {
    let user = await apiGetPublicUserById(userId)
    if (user.status === "success") {
      return {
        _id: userId,
        firstname: user.data.firstname,
        lastname: user.data.lastname,
        fullname: user.data.firstname + " " + user.data.lastname,
        email: user.data.email,
        img: `${API_ENDPOINTS.media}/${user.data.img}`,
        visibility: user.data.visibility,
      }
    } else {
      return {
        _id: userId,
        firstname: "private",
        lastname: "user",
        fullname: "private user",
        email: "",
        img: `${API_ENDPOINTS.media}/pictures/default.jpg`,
        visibility: "private",
      }
    }
  } catch (error) {
    console.error(error)
  }
}
