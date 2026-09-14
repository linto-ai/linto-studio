// Classic Studio pages (editor, live) open in their own browser context:
// a new tab in a browser, an in-app browser sheet with a close button when
// the app is installed. The mobile app itself stays where it was.
export function openInStudio(path) {
  const opened = window.open(path, "_blank", "noopener")
  if (!opened) {
    window.location.assign(path)
  }
}
