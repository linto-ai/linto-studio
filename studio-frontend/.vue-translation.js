import path from "path"
import { JSONAdapter } from "vue-translation-manager"

module.exports = {
  srcPath: path.join(__dirname, "src/"),
  adapter: new JSONAdapter({
    path: path.join(__dirname, "src/locales/en.json"),
  }),
  languages: ["en"],
}
