const debug = require('debug')('linto:conversation-manager:router:api:services:service')

const {
    getSaasServices,
    getLlmServices
} = require(`${process.cwd()}/components/WebServer/routecontrollers/services/service.js`)

module.exports = (webserver) => {
    return [
        {
            path: '',
            method: 'get',
            requireAuth: true,
            controller: getSaasServices
        },
        {
            path: '/llm',
            method: 'get',
            requireAuth: true,
            controller: getLlmServices
        },
        {
            path: '/:scope',
            method: 'get',
            requireAuth: true,
            controller: getSaasServices
        },
        {
            path: '/mock/llm',
            method: 'get',
            requireAuth: false,
            controller: mock_llm_get
        },
        {
            path: '/mock/:serviceName/llm',
            method: 'post',
            requireAuth: false,
            controller: mock_llm_post
        },
    ]
}

async function mock_llm_get(req, res, next) {
    try {

        let llm_service_info = [
            {
                serviceName: "mixtral",
                type: "mixtral",
                capabilities: ["summarize"],
                formats: ["cri", "cra", "cred"],
                lang: ["fr"],
            },
            {
                serviceName: "openai",
                type: "gptv4",
                formats: ["cri", "cra"],
                lang: ["fr"],
            }
        ]
        res.status(200).send(llm_service_info)
    }
    catch (err) {
        next(err)
    }
}

async function mock_llm_post(req, res, next) {
    try {
        debug('in mock with serviceName ' + req.params.serviceName)

        //request require a either a file or a content
        if (req.body.content === undefined) {
            res.status(400).json({ message: 'content is required' });
        } else if (req.body.format) {
            res.status(200).json({ message: req.body.content });
        } else {
            res.status(400).json({ message: 'err' });
        }

    } catch (err) {
        next(err)
    }
}