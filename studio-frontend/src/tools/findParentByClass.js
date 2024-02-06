export default function findParentByClass(el, className) {
  while (
    (el = el.parentElement) &&
    !el.classList.contains(className) &&
    el.tagName !== "BODY"
  );
  return el
}
