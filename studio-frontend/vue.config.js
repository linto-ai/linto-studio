import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"
import getCurrentTheme from "./src/tools/getCurrentTheme.js"
import webpack from "webpack"
import packageJson from "./package.json" with { type: "json" }

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const STYLE_PATH = getCurrentTheme()["stylePath"]

export default {
  configureWebpack: (config) => {
    config.resolve.fallback = {
      crypto: "crypto-browserify",
      path: "path-browserify",
      os: "os-browserify/browser",
      stream: "stream-browserify",
      process: "process/browser",
      buffer: "buffer",
      ...config.resolve.fallback,
    }
    config.plugins = [
      ...(config.plugins || []),
      new webpack.ProvidePlugin({
        process: "process/browser",
        Buffer: ["buffer", "Buffer"],
      }),
      new webpack.DefinePlugin({
        __APP_VERSION__: JSON.stringify(packageJson.version),
      }),
    ]
    ;(config.devtool = false),
      (config.optimization = {
        splitChunks: false,
      })
  },
  outputDir: path.resolve(__dirname, "./dist"),
  publicPath: "/",
  pages: {
    index: {
      entry: "src/main.js",
      template: "public/index.html",
      filename: "index.html",
      title: "index",
    },
  },
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "scss",
      //patterns: [path.resolve(__dirname, "./public/sass/styles.scss")],
    },
  },
  css: {
    loaderOptions: {
      scss: {
        // additionalData: `@use "test.scss" as style-theme;`,
      },
    },
  },
}
