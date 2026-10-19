export function speakerEquals(
  a: { name: string; color?: string; defined?: boolean },
  b: { name: string; color?: string; defined?: boolean },
): boolean {
  return a.name === b.name && a.color === b.color && a.defined === b.defined
}
