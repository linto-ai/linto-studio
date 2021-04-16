const path = require('path')

module.exports = {
    configureWebpack: config => {
        config.devtool = false,
            config.optimization = {
                splitChunks: false
            }
    },
    outputDir: path.resolve(__dirname, '../../dist'),
    publicPath: '/assets',

    pages: {
        index: {
            entry: 'src/main.js',
            template: 'public/index.html',
            filename: 'index.html',
            title: 'index'
        },
        login: {
            entry: 'src/login.js',
            template: 'public/index.html',
            filename: 'login.html',
            title: 'login'
        }

    },
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'scss',
            patterns: [path.resolve(__dirname, './public/sass/styles.scss')]
        }
    }
}