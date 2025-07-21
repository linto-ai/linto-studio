import { getEnv } from "@/tools/getEnv"

export default function userAvatar(userInfos) {
  const imageUrl = userInfos.img ?? "pictures/default.jpg"

  if (imageUrl.startsWith("http") || imageUrl.startsWith("blob"))
    return imageUrl

  // remove trailing slash
  if (imageUrl.startsWith("/")) {
    return `${getEnv("VUE_APP_PUBLIC_MEDIA")}${imageUrl}`
  }

  return `${getEnv("VUE_APP_PUBLIC_MEDIA")}/${imageUrl}`
}
