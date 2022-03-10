/****************
 *****Organization*******
 *****************/

 const ExceptionType = 'organization'


 class OrganizationAddUserError extends Error {
    constructor(message) {
        super()
        this.name = 'OrganizationAddUser'
        this.type = ExceptionType
        this.status = '400'
        if (message) this.message = message
        else this.message = 'Unable to add the user to the organization'
    }
}

class OrganizationUpdateUserError extends Error {
    constructor(message) {
        super()
        this.name = 'OrganizationUpdateUserError'
        this.type = ExceptionType
        this.status = '400'
        if (message) this.message = message
        else this.message = 'Unable to update the user to the organization'
    }
}

 class OrganizationNameAlreadyUsed extends Error {
     constructor(message) {
         super()
         this.name = 'OrganizationNameAlreadyUsed'
         this.type = ExceptionType
         this.status = '403'
         if (message) this.message = message
         else this.message = 'Organization name already use'
     }
 }
 
 class OrganizationParameterMissing extends Error {
     constructor(message) {
         super()
         this.name = 'OrganizationParameterMissing'
         this.type = ExceptionType
         this.status = '405'
         if (message) this.message = message
         else this.message = 'Mandatory parameter are missing'
     }
 }
 
 class OrganizationUnknowType extends Error {
    constructor(message) {
        super()
        this.name = 'OrganizationUnknowType'
        this.type = ExceptionType
        this.status = '405'
        if (message) this.message = message
        else this.message = 'Organization type requested is not supported'
    }
}

 class OrganizationCreationError extends Error {
     constructor(message) {
         super()
         this.name = 'OrganizationCreationError'
         this.type = ExceptionType
         this.status = '403'
         if (message) this.message = message
         else this.message = 'Error during the organization creation process'
     }
 }
 
 class OrganizationError extends Error {
    constructor(message) {
        super()
        this.name = 'OrganizationError'
        this.type = ExceptionType
        this.status = '500'
        if (message) this.message = message
        else this.message = 'Internal Server Error during an organization process'
    }
}

class OrganizationNotFound extends Error {
    constructor(message) {
        super()
        this.name = 'OrganizationNotFound'
        this.type = ExceptionType
        this.status = '404'
        if (message) this.message = message
        else this.message = 'Requested organization not found'
    }
}


 module.exports = {
     //Users Exception
     OrganizationNameAlreadyUsed,
     OrganizationParameterMissing,
     OrganizationUnknowType,
     OrganizationCreationError,
     OrganizationNotFound,
     OrganizationAddUserError,
     OrganizationUpdateUserError,
     OrganizationError
 }