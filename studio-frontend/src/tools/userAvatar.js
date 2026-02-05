import { getEnv } from "@/tools/getEnv"

export default function userAvatar(userInfos) {
  const imageUrl = userInfos.img ?? "pictures/default.jpg"

  if (imageUrl.startsWith("http") || imageUrl.startsWith("blob"))
    return imageUrl

  const baseUrl = window.location.origin
  console.log("public path", getEnv("VUE_APP_PUBLIC_MEDIA"))
  let publicMedia = getEnv("VUE_APP_PUBLIC_MEDIA").trim("/")

  if (!publicMedia.startsWith("http")) {
    publicMedia = `${baseUrl}${publicMedia}`
  }

  // remove trailing slash
  if (imageUrl.startsWith("/")) {
    return `${publicMedia}${imageUrl}`
  }

  return `${publicMedia}/${imageUrl}`
}
