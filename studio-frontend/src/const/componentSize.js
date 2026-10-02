// Shared size scale for small UI atoms (PhIcon, Avatar). Values are in rem
// so sizing follows the user's font-size/zoom preference instead of staying
// fixed regardless of accessibility settings. Based on the browser's default
// root font-size (16px) — this project sets no `html { font-size }` override.
export const SIZE_SCALE = {
  xs: "1rem", // 16px
  sm: "1.25rem", // 20px
  md: "1.5rem", // 24px
  lg: "1.75rem", // 28px
  xl: "2rem", // 32px
}
