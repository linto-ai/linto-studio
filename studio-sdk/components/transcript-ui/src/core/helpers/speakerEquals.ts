export function speakerEquals(
  a: { name: string; color?: string },
  b: { name: string; color?: string },
): boolean {
  return a.name === b.name && a.color === b.color
}
