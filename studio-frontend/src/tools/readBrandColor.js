// The host's brand colour, as the CSS variable resolves on the page: what
// the editor gets through core.primaryColor, since its theme tokens can't be
// overridden from outside the web component. Empty when the variable is unset.
export function readBrandColor(variable = "--primary-color") {
  return window
    .getComputedStyle(document.body)
    .getPropertyValue(variable)
    .trim()
}
