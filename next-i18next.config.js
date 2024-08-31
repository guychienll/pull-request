const path = require("path");
const locales = require("./src/translation/resource");

module.exports = {
  i18n: {
    defaultLocale: "zh-TW",
    locales: Object.keys(locales),
  },
  localePath: path.resolve("./public/locales"),
};
