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
    const index = Math.floor(i * scale)
    const value = Math.abs(channel[index] ?? 0)
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
