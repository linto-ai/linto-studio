// Hands a file to the phone's share sheet (mail, SMS, WhatsApp…). Browsers
// without file sharing (desktop, older iOS) download it instead.
// Returns "shared", "cancelled", "downloaded" or "failed".
export async function shareFile(file, title) {
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title })
      return "shared"
    } catch (error) {
      if (error?.name === "AbortError") return "cancelled"
      console.error("share failed, downloading instead", error)
    }
  }
  return downloadFile(file) ? "downloaded" : "failed"
}

function downloadFile(file) {
  try {
    const url = URL.createObjectURL(file)
    const link = document.createElement("a")
    link.href = url
    link.download = file.name
    link.click()
    URL.revokeObjectURL(url)
    return true
  } catch (error) {
    console.error("download failed", error)
    return false
  }
}
