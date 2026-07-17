import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import { directoryPlugin } from "vite-plugin-list-directory-contents";
import devtoolsJson from "vite-plugin-devtools-json";
import tailwindcss from "@tailwindcss/vite"; 

// ES 모듈에서 __dirname 대신 사용하는 표준 방식
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  css: {
    // 👈 2. 기존 postcss 지정을 제거했습니다. Vite가 Tailwind를 직접 처리하므로 필요 없습니다.
    devSourcemap: true,
  },
  server: {
    watch: {
      ignored: ["**/node_modules/**"],
    },
  },
  plugins: [
    tailwindcss(), 
    devtoolsJson(),
    directoryPlugin({
      baseDir: __dirname,
    }),
  ],
  optimizeDeps: {
    // 비트 서버 시작 시점에 의존성(라이브러리) 검사를 할 파일을 직접 지정하는 옵션이다.
    // 여기에 적히지 않은 html 파일도 브라우저가 요청하면
    // 실시간으로 파일을 컴파일 하므로 HMR은 정상 작동한다.
    entries: [
      "index.html",
      "**/d3-in-action",
      "**/end/index.html",
      "**/start/index.html",
      "**/started.index.html",
    ],
  },
});
