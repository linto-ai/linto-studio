export default function transriberImageFromtype(type) {
  switch (type) {
    case "microsoft":
      return "/img/microsoft.png"
    case "linto":
      return "/img/linto.svg"
    case "amazon":
      return "/img/amazon.svg"
    case "voxstral":
      return "/img/voxstral.svg"
    default:
      return "/img/question.svg"
  }
}
