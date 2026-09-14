// Classic Studio pages (editor, live) open in their own browser context:
// a new tab in a browser, an in-app browser sheet with a close button when
// the app is installed. The mobile app itself stays where it was.
// window.open() returns null with "noopener" even on success, so the
// return value says nothing: never fall back to navigating this tab.
export function openInStudio(path) {
  window.open(path, "_blank", "noopener")
}
