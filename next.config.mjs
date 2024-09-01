import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import locales from "./src/translation/resource.js";
import i18nConfig from "./next-i18next.config.js";
import pwa from "next-pwa"

const withPWA = pwa({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true
})

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    Object.entries(locales).forEach(([lang, translations]) => {
      const dir = path.join(__dirname, "public", "locales", lang);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(
        path.join(dir, "common.json"),
        JSON.stringify(translations.translation, null, 2)
      );
    });
    return config;
  },
  i18n: i18nConfig.i18n,
};

export default withPWA(nextConfig);
