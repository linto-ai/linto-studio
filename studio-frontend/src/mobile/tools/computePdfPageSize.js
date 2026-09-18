// Size of the canvas that shows one PDF page at `targetWidth` CSS pixels,
// sharp on high density screens: the backing store is scaled by the pixel
// ratio, the CSS size stays at the target width.
export function computePdfPageSize({
  pageWidth,
  pageHeight,
  targetWidth,
  pixelRatio = 1,
}) {
  const cssScale = targetWidth / pageWidth
  const ratio = pixelRatio > 0 ? pixelRatio : 1
  return {
    renderScale: cssScale * ratio,
    cssWidth: Math.round(targetWidth),
    cssHeight: Math.round(pageHeight * cssScale),
  }
}
