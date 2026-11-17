import { API_ENDPOINTS } from "@/const/apiEndpoints.js"

export default function userAvatar(userInfos) {
  const imageUrl = userInfos.img ?? "pictures/default.jpg"

  if (imageUrl.startsWith("http") || imageUrl.startsWith("blob"))
    return imageUrl

  // remove leading slash
  if (imageUrl.startsWith("/")) {
    return `${API_ENDPOINTS.media}${imageUrl}`
  }

  return `${API_ENDPOINTS.media}/${imageUrl}`
}
