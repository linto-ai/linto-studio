export default class Component {
  constructor(app, ...requiredComponents) {
    let missingComponents = []
    requiredComponents.every((component) => {
      if (app.components.hasOwnProperty(component)) {
        return true
      } else {
        return missingComponents.push(component)
      }
    })
    if (missingComponents.length > 0) {
      throw new componentMissingError(missingComponents)
    }
  }
}

class componentMissingError extends Error {
  constructor(missingComponents) {
    super()
    this.name = "COMPONENT_MISSING"
    this.missingComponents = missingComponents
  }
}
