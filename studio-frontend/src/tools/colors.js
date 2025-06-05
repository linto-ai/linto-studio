export function getColorFromText(text) {
  const hash = text.split("").reduce((acc, char) => {
    return acc + char.charCodeAt(0)
  }, 0)
  return `hsl(${hash % 360}, 100%, 50%)`
}

// Returns a random color based on text and a contrasting text color (black or white)
export function getColorsFromText(text) {
  // Generate a random hue based on the text hash
  const hash = text.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const hue = hash % 360
  const bgColor = `hsl(${hue}, 100%, 50%)`

  // Convert HSL to RGB for contrast calculation
  function hslToRgb(h, s, l) {
    s /= 100
    l /= 100
    const k = (n) => (n + h / 30) % 12
    const a = s * Math.min(l, 1 - l)
    const f = (n) =>
      l - a * Math.max(-1, Math.min(Math.min(k(n) - 3, 9 - k(n)), 1))
    return [
      Math.round(255 * f(0)),
      Math.round(255 * f(8)),
      Math.round(255 * f(4)),
    ]
  }

  // Calculate luminance
  function getLuminance([r, g, b]) {
    const [R, G, B] = [r, g, b].map((v) => {
      v /= 255
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * R + 0.7152 * G + 0.0722 * B
  }

  const rgb = hslToRgb(hue, 100, 50)
  const luminance = getLuminance(rgb)
  // If luminance is high, use black text; otherwise, use white text
  const textColor = luminance > 0.5 ? "#000000" : "#FFFFFF"

  return {
    bg: bgColor,
    text: textColor,
  }
}
