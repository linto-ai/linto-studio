/****************
**Category***
*****************/

const ExceptionType = 'category'
class CategoryTypeNotDefined extends Error {
  constructor(message, err) {
    super()
    this.name = 'CategoryTypeNotDefined'
    this.type = ExceptionType
    this.status = '400'
    if (message) this.message = message
    else this.message = `Category type is not defined`
    if (err) this.err = err
  }
}

class CategoryTypeNotValid extends Error {
  constructor(message, err) {
    super()
    this.name = 'CategoryTypeNotValid'
    this.type = ExceptionType
    this.status = '400'
    if (message) this.message = message
    else this.message = `Category type is not valid`
    if (err) this.err = err
  }
}

class CategoryError extends Error {
  constructor(message, err) {
    super()
    this.name = 'CategoryError'
    this.type = ExceptionType
    this.status = '400'
    if (message) this.message = message
    else this.message = `Category error`
    if (err) this.err = err
  }
}

module.exports = {
  CategoryTypeNotDefined,
  CategoryTypeNotValid,
  CategoryError
}