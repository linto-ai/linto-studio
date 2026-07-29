/**
 * Normalizes raw waveform values (any scale, e.g. 16-bit ints from the
 * audiowaveform format) to [-1, 1] floats as expected by WaveSurfer.
 * Scales against the 98th percentile (values above it clip at 1) so a few
 * isolated loud peaks don't flatten the rest of the waveform.
 */
export function normalizePeaks(data: number[]): Float32Array {
  const peaks = new Float32Array(data.length)
  if (data.length === 0) return peaks

  const sorted = data.map(Math.abs).sort((a, b) => a - b)
  const reference = sorted[Math.floor((sorted.length - 1) * 0.98)] ?? 0
  if (reference === 0) return peaks

  // Gamma > 1 expands the contrast: average speech stays mid-height while
  // near-silence drops to a flat line instead of a thin permanent bar.
  const gamma = 1.5
  for (let i = 0; i < data.length; i++) {
    const value = (data[i] ?? 0) / reference
    const clipped = Math.max(-1, Math.min(1, value))
    peaks[i] = Math.sign(clipped) * Math.abs(clipped) ** gamma
  }
  return peaks
}

export function renderWaveform(
  channels: (number[] | Float32Array)[],
  ctx: CanvasRenderingContext2D,
): void {
  const { width, height } = ctx.canvas
  const channel = channels[0]!
  const scale = channel.length / width
  const step = 0.5

  ctx.translate(0, height / 2)
  ctx.strokeStyle = ctx.fillStyle
  ctx.beginPath()

  for (let i = 0; i < width; i += step * 2) {
    // Average all values that fall into this pixel bucket: on long audios
    // (several data points per pixel) point-sampling picks loud windows too
    // often and the waveform turns into a solid mass.
    const start = Math.floor(i * scale)
    const end = Math.max(start + 1, Math.floor((i + step * 2) * scale))
    let sum = 0
    for (let j = start; j < end; j++) sum += Math.abs(channel[j] ?? 0)
    const value = sum / (end - start)
    let x = i
    let y = value * (height / 2)

    ctx.moveTo(x, 0)
    ctx.lineTo(x, y)
    ctx.lineTo(x + step, 0)

    x = x + step
    y = -y
    ctx.moveTo(x, 0)
    ctx.lineTo(x, y)
    ctx.lineTo(x + step, 0)
  }

  ctx.stroke()
  ctx.closePath()
}
