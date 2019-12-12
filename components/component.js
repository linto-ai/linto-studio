const fsPromises = require('fs').promises
const path = require('path')
const EventEmitter = require('eventemitter3')
const { componentMissingError } = require(`${process.cwd()}/lib/customErrors.js`)

class Component extends EventEmitter {
    constructor(app, ...requiredComponents) {
        super()
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

    // recursively requires .js files by crawling filesystem for controllersDir ( shall be ../controllers/)
    // for each required file, calls exported function by binding "this" Component context
    async loadEventControllers(controllersDir) {
        try {
            const currentDir = await fsPromises.readdir(controllersDir)
            for (let item of currentDir) {
                let itemPath = path.join(controllersDir, item)
                let stat = await fsPromises.lstat(itemPath)
                if (stat.isDirectory()) {
                    await this.loadEventControllers(itemPath)
                } else if (item.toLocaleLowerCase().indexOf('.js')) {
                    let controller = require(itemPath)
                    if (typeof controller === "function") controller.call(this)
                }
            }
        } catch (e) {
            throw e
        }
    }

    async init() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.loadEventControllers(path.join(__dirname, this.constructor.name, "/controllers"))
                resolve(this)
            } catch (e) {
                reject(e)
            }
        })
    }
}

module.exports = Component