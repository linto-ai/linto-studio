/**
 * The CSS custom properties that color a pack element after the material
 * color family of its kind: a deep accent and a pale wash, which the dark
 * theme inverts together.
 * @param {string} color - material color family (teal, blue…)
 * @returns {{"--pack-accent": string, "--pack-accent-soft": string}}
 */
export function computePackPalette(color) {
  return {
    "--pack-accent": `var(--material-${color}-800)`,
    "--pack-accent-soft": `var(--material-${color}-50)`,
  }
}
