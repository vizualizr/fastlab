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
    devSourcemap: true,
  },
  server: {
    watch: {
      ignored: [
        "**/node_modules/**",
        "**/.git/**",
        "**/.vite/**",
        "**/dist/**",
        "**/d3-in-action/**",
      ],
    }, // 👈 watch를 닫는 중괄호 추가
  }, // 👈 server를 닫는 중괄호
  plugins: [
    tailwindcss({
      // 2. Tailwind v4가 클래스를 스캔할 대상 범위를 명시적으로 한정합니다.
      candidateSources: [
        "index.html",
        "src/**/*.{html,js,ts,jsx,tsx}",
        "om/**/*.{html,js,ts,jsx,tsx}",
        "demo/**/*.{html,js,ts,jsx,tsx}",
      ],
    }),
    devtoolsJson(),
    directoryPlugin({
      baseDir: __dirname,
    }),
  ],
  optimizeDeps: {
    // 비트 서버 시작 시점에 의존성(라이브러리) 검사를 할 파일을 직접 지정하는 옵션이다.
    // 여기에 적히지 않은 html 파일도 브라우저가 요청하면
    // 실시간으로 파일을 컴파일 하므로 HMR은 정상 작동한다.
  },
});
