export function getId(entity) {
  return String(entity?._id ?? entity?.id ?? "")
}
