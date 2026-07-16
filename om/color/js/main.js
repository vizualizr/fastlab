let fontDirHandle = null;

const EXCLUDED_DIRS = [".rejected", ".zipped"];
// const FONT_DIR = [""];

function normalizeFontKey(str) {
  return str.trim().replace(/\s+/g, " ");
}

document
  .getElementById("folder-picker-btn")
  .addEventListener("click", async () => {
    const statusEl = document.getElementById("folder-status");
    try {
      fontDirHandle = await window.showDirectoryPicker();
      const perm = await fontDirHandle.requestPermission({ mode: "read" });
      statusEl.textContent =
        perm === "granted"
          ? `"${fontDirHandle.name}" 접근 권한 확인됨`
          : "권한 거부됨";

      if (perm === "granted") {
        progressModal.showModal(); // ← 대기 화면 시작

        fontFileList = await scanFontFiles(fontDirHandle);
        fontFileList = await dedupeByFontName(fontFileList);
        console.log(
          "중복 제거 후 폰트 목록:",
          fontFileList.map((f) => f.familyName),
        );
        console.log(
          "발견된 폰트 파일:",
          fontFileList.map((f) => f.name),
        );
        statusEl.textContent += ` — 폰트 ${fontFileList.length}개 발견`;

        fontFileList = await filterLoadableFonts(fontFileList);
        statusEl.textContent += ` (로드 가능 ${fontFileList.length}개)`;

        // 드랍다운 메뉴 생성
        renderFontDropdown(fontFileList);
        console.log(`"${fontFileList[0].familyName}" 폰트 등록 및 적용 완료`);

        progressModal.close();   // ← 대기 화면 종료
      }
    } catch (err) {
      progressModal.close();
      statusEl.textContent = "폴더 선택 취소";
    }
  });

  // 선택한 폰트를 적용
document.getElementById('font-select').addEventListener('change', (e) => {
  const idx = Number(e.target.value);
  const selectedItem = fontFileList[idx];
  if (selectedItem) {
    addFontToDocument(selectedItem.fontFace);
    applyFontAsDefault(selectedItem.fontFace);
    console.log(`"${selectedItem.familyName}" 폰트로 변경 적용`);
  }
});

// 폴더 내 폰트 파일만 필터링해 목록 작성.

const FONT_EXTENSIONS = [".ttf", ".otf", ".woff", ".woff2"];
let fontFileList = [];

async function scanFontFiles(dirHandle, path = "") {
  const files = [];
  for await (const [name, handle] of dirHandle.entries()) {
    const currentPath = path ? `${path}/${name}` : name;
    if (handle.kind === "file") {
      const lower = name.toLowerCase();
      if (FONT_EXTENSIONS.some((ext) => lower.endsWith(ext))) {
        files.push({ name, path: currentPath, handle });
      }
    } else if (handle.kind === "directory") {
      if (EXCLUDED_DIRS.includes(name)) continue; // ← 제외 폴더 스킵
      const subFiles = await scanFontFiles(handle, currentPath);
      files.push(...subFiles);
    }
  }
  return files;
}

async function getFontNameInfo(fileHandle) {
  const file = await fileHandle.getFile();
  const buf = await file.arrayBuffer();
  const view = new DataView(buf);

  const tag = view.getUint32(0);
  if (tag === 0x774f4646) return null; // woff, 별도 처리 필요

  const numTables = view.getUint16(4);
  let nameTableOffset = null;
  for (let i = 0; i < numTables; i++) {
    const recordOffset = 12 + i * 16;
    const tableTag = String.fromCharCode(
      view.getUint8(recordOffset),
      view.getUint8(recordOffset + 1),
      view.getUint8(recordOffset + 2),
      view.getUint8(recordOffset + 3),
    );
    if (tableTag === "name") {
      nameTableOffset = view.getUint32(recordOffset + 8);
      break;
    }
  }
  if (nameTableOffset === null) return null;

  const count = view.getUint16(nameTableOffset + 2);
  const stringOffset = nameTableOffset + view.getUint16(nameTableOffset + 4);

  let candidates = {};
  for (let i = 0; i < count; i++) {
    const recOffset = nameTableOffset + 6 + i * 12;
    const platformID = view.getUint16(recOffset);
    const nameID = view.getUint16(recOffset + 6);
    const length = view.getUint16(recOffset + 8);
    const offset = view.getUint16(recOffset + 10);
    // 1: Family, 2: Subfamily, 16: Typographic Family, 17: Typographic Subfamily
    if (![1, 2, 16, 17].includes(nameID)) continue;

    const start = stringOffset + offset;
    const str =
      platformID === 1
        ? new TextDecoder("ascii").decode(new Uint8Array(buf, start, length))
        : new TextDecoder("utf-16be").decode(
            new Uint8Array(buf, start, length),
          );
    candidates[nameID] = str;
  }

  const family = normalizeFontKey(candidates[16] || candidates[1] || "");
  const subfamily = normalizeFontKey(candidates[17] || candidates[2] || "");
  if (!family) return null;
  return {
    family,
    subfamily,
    fullName: subfamily ? `${family} ${subfamily}` : family,
  };
}

// 중복 폰트를 제거하고 폰트 목록을 알파벳 순서로 정렬.
async function dedupeByFontName(fileList) {
  const seen = new Map();
  for (const item of fileList) {
    const info = await getFontNameInfo(item.handle);
    const key = info ? info.fullName : item.name;
    if (!seen.has(key)) {
      seen.set(key, { ...item, familyName: key });
    }
  }
  const result = Array.from(seen.values());
  result.sort((a, b) => a.familyName.localeCompare(b.familyName, "ko"));
  return result;
}

// 등록된 폰트를 페이지 기본 폰트로 적용.
function applyFontAsDefault(fontFace) {
  document.body.style.fontFamily = `"${fontFace.family}", sans-serif`;
}

// 등록(document.fonts.add)만 별도로 분리
function addFontToDocument(fontFace) {
  document.fonts.add(fontFace);
}

// main.js에 추가 — 전체 목록을 미리 로드 테스트해서 실패하는 폰트 제외:
async function filterLoadableFonts(fileList) {
  const loadable = [];
  for (const item of fileList) {
    try {
      const file = await item.handle.getFile();
      const buf = await file.arrayBuffer();
      const fontFace = new FontFace(item.familyName, buf);
      await fontFace.load();
      loadable.push({ ...item, fontFace });
    } catch (err) {
      console.warn(
        `"${item.familyName}" 로드 실패 — 목록에서 제외:`,
        err.message,
      );
    }
  }
  return loadable;
}

// 드랍다운 렌더링 함수 추가:
function renderFontDropdown(fontList) {
  const selectEl = document.getElementById("font-select");
  selectEl.innerHTML = "";

  fontList.forEach((item, idx) => {
    const option = document.createElement("option");
    option.value = idx;
    option.textContent = item.familyName;
    selectEl.appendChild(option);
  });

  selectEl.style.display = fontList.length > 0 ? "inline-block" : "none";

  console.log("dropdown rendering completed");
}

// event blocker for modal to disable ESC event.
const progressModal = document.getElementById("scan-progress-modal");
progressModal.addEventListener("cancel", (e) => e.preventDefault());
