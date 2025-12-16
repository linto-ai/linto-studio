export default function getNestedProperty(obj, path) {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj)
}
