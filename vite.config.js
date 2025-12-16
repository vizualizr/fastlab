import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import { directoryPlugin } from "vite-plugin-list-directory-contents";
import devtoolsJson from "vite-plugin-devtools-json";

// ES 모듈에서 __dirname 대신 사용하는 표준 방식
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  css: {
    postcss: "./postcss.config.cjs",
    devSourcemap: true,
  },
  server: {
    watch: {
      ignored: ["**/node_modules/**"],
    },
  },
  plugins: [devtoolsJson(), directoryPlugin({ baseDir: __dirname })],
});
