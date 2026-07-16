let fontDirHandle = null;
let fontFileList = []; // 전역 상태 유지
const EXCLUDED_DIRS = [".rejected", ".zipped"];
const CACHE_NAME = "font-picker-assets"; // 캐시 저장소 이름

function normalizeFontKey(str) {
  return str.trim().replace(/\s+/g, " ");
}

// ─────────────── [추가] 초기화 및 자동 복구 로직 ───────────────
document.addEventListener("DOMContentLoaded", async () => {
  // Service Worker 등록 확인
  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register("./js/sw.js"); // sw.js 경로에 맞게 수정
    } catch (err) {
      console.error("Service Worker 등록 실패:", err);
    }
  }
  
  // 재방문 시 캐시된 메타정보가 있는지 확인 후 자동 로드
  await tryRestoreFromCache();
});

// ─────────────── [수정] 폴더 선택 이벤트 리스너 ───────────────
document.getElementById("folder-picker-btn").addEventListener("click", async () => {
  const statusEl = document.getElementById("folder-status");
  try {
    fontDirHandle = await window.showDirectoryPicker();
    const perm = await fontDirHandle.requestPermission({ mode: "read" });
    
    if (perm === "granted") {
      progressModal.showModal();

      const rawFiles = await scanFontFiles(fontDirHandle);
      const dedupedFiles = await dedupeByFontName(rawFiles);
      
      // 로드 가능 여부 필터링 및 FontFace 객체 생성
      fontFileList = await filterLoadableFonts(dedupedFiles);

      // 드랍다운 메뉴 생성
      renderFontDropdown('heading-font-select', fontFileList);
      renderFontDropdown('body-font-select', fontFileList);

      if (fontFileList.length > 0) {
        // ─────────────── [추가] Cache API에 바이너리 및 메타정보 저장 ───────────────
        await saveFontsToCache(fontDirHandle.name, fontFileList);
        updateUIState(true, fontDirHandle.name, fontFileList.length);
      } else {
        statusEl.textContent = "로드 가능한 폰트를 찾지 못했습니다.";
        updateUIState(false);
      }

      progressModal.close();
    } else {
      statusEl.textContent = "권한 거부됨";
    }
  } catch (err) {
    progressModal.close();
    statusEl.textContent = "폴더 선택 취소 또는 에러 발생";
    console.error(err);
  }
});

// ─────────────── [추가] 다시 선택 버튼 이벤트 리스너 ───────────────
document.getElementById("clear-cache-btn")?.addEventListener("click", async () => {
  if (confirm("캐시된 폰트를 완전히 지우고 폴더를 다시 선택하시겠습니까?")) {
    await clearFontCache();
    updateUIState(false);
  }
});

// ─────────────── [추가] Cache API 저장/복구/삭제 핵심 함수들 ───────────────

// 1. 캐시에 폰트 바이너리와 메타데이터 저장
async function saveFontsToCache(folderName, fileList) {
  const cache = await caches.open(CACHE_NAME);
  
  // 메타데이터 생성 (바이너리를 제외한 순수 텍스트 정보만 추출)
  const metaData = {
    folderName: folderName,
    fonts: fileList.map(item => ({
      familyName: item.familyName,
      name: item.name,
      path: item.path
    }))
  };

  // 1-1. 메타데이터 가상 파일로 캐시에 저장
  await cache.put(
    new Request("/api/font-meta.json"),
    new Response(JSON.stringify(metaData), { headers: { "Content-Type": "application/json" } })
  );

  // 1-2. 각 폰트 바이너리를 캐시에 개별 저장 (750MB+ 대용량 분할 저장)
  for (const item of fileList) {
    const fontUrl = `/api/fonts/${encodeURIComponent(item.familyName)}`;
    await cache.put(
      new Request(fontUrl),
      new Response(item.buffer, { headers: { "Content-Type": "font/ttf" } }) // 실제 포맷에 맞게 유연하게 처리됨
    );
  }
  console.log(`[Cache] ${fileList.length}개 폰트 및 메타정보 캐싱 완료.`);
}

// 2. 캐시로부터 상태 복구 (재방문 시 실행)
async function tryRestoreFromCache() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const metaResponse = await cache.match("/api/font-meta.json");
    
    if (!metaResponse) {
      updateUIState(false);
      return;
    }

    const metaData = await metaResponse.json();
    fontFileList = [];

    // 캐시된 바이너리들을 다시 복구하여 FontFace 객체 생성
    for (const fontInfo of metaData.fonts) {
      const fontUrl = `/api/fonts/${encodeURIComponent(fontInfo.familyName)}`;
      const fontResponse = await cache.match(fontUrl);
      
      if (fontResponse) {
        const buffer = await fontResponse.arrayBuffer();
        const fontFace = new FontFace(fontInfo.familyName, buffer);
        fontFileList.push({
          ...fontInfo,
          buffer,
          fontFace
        });
      }
    }

    // 폰트 등록 및 드롭다운 렌더링
    renderFontDropdown('heading-font-select', fontFileList);
    renderFontDropdown('body-font-select', fontFileList);
    
    updateUIState(true, metaData.folderName, fontFileList.length);
    console.log(`[Cache] 캐시로부터 ${fontFileList.length}개 폰트 복구 성공.`);
  } catch (err) {
    console.error("캐시 복구 중 실패:", err);
    updateUIState(false);
  }
}

// 3. 캐시 전체 초기화
async function clearFontCache() {
  await caches.delete(CACHE_NAME);
  fontFileList = [];
  document.getElementById('heading-font-select').innerHTML = "";
  document.getElementById('body-font-select').innerHTML = "";
  console.log("[Cache] 폰트 캐시가 정상적으로 삭제되었습니다.");
}

// 4. UI 상태 변경 함수 (토글 구조)
function updateUIState(isLoaded, folderName = "", count = 0) {
  const statusEl = document.getElementById("folder-status");
  const pickerBtn = document.getElementById("folder-picker-btn");
  const clearBtn = document.getElementById("clear-cache-btn");

  if (isLoaded) {
    statusEl.textContent = `"${folderName}" 로드됨 (${count}개 폰트)`;
    pickerBtn.style.display = "none";
    if (clearBtn) clearBtn.style.display = "inline-block";
  } else {
    statusEl.textContent = "선택된 폴더 없음";
    pickerBtn.style.display = "inline-block";
    if (clearBtn) clearBtn.style.display = "none";
  }
}

// ─────────────── 이하 기존 코드 유지 (폰트 선택, 스캔, 파싱, 렌더링) ───────────────
const FONT_EXTENSIONS = [".ttf", ".otf", ".woff", ".woff2"];

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

async function getFontNameInfo(fileHandle, buffer = null) {
  const buf = buffer || (await (await fileHandle.getFile()).arrayBuffer());
  const view = new DataView(buf);

  const tag = view.getUint32(0);
  if (tag === 0x774f4646 || tag === 0x774f4632) return null; // woff, woff2 — 별도 처리 필요

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

// 중복 폰트를 제거하고 폰트 목록을 알파벳 순서로 정렬. (buffer 캐싱)
async function dedupeByFontName(fileList) {
  const seen = new Map();
  for (const item of fileList) {
    try {
      const file = await item.handle.getFile();
      const buffer = await file.arrayBuffer();
      const info = await getFontNameInfo(item.handle, buffer);
      const key = info ? info.fullName : item.name;
      if (!seen.has(key)) {
        seen.set(key, { ...item, buffer, familyName: key });
      }
    } catch (err) {
      console.warn(`"${item.name}" 파일 읽기 실패:`, err.message);
    }
  }
  const result = Array.from(seen.values());
  result.sort((a, b) => a.familyName.localeCompare(b.familyName, "ko"));
  return result;
}

// 제목 폰트 적용
function applyHeadingFont(fontFace) {
  document.documentElement.style.setProperty('--font-heading', `"${fontFace.family}"`);
}

// 본문 폰트 적용
function applyBodyFont(fontFace) {
  document.documentElement.style.setProperty('--font-body', `"${fontFace.family}"`);
}

// 등록(document.fonts.add)만 별도로 분리
function addFontToDocument(fontFace) {
  document.fonts.add(fontFace);
}

async function filterLoadableFonts(fileList) {
  const loadPromises = fileList.map(async (item) => {
    try {
      const fontFace = new FontFace(item.familyName, item.buffer);
      await fontFace.load(); // 검증 단계에서 브라우저 메모리에 로드 테스트
      return { ...item, fontFace };
    } catch (err) {
      console.warn(`"${item.familyName}" 로드 실패 — 목록에서 제외:`, err.message);
      return null;
    }
  });
  const results = await Promise.all(loadPromises);
  return results.filter(r => r !== null);
}

function renderFontDropdown(selectId, fontList) {
  const selectEl = document.getElementById(selectId);
  selectEl.innerHTML = "";
  fontList.forEach((item, idx) => {
    const option = document.createElement("option");
    option.value = idx;
    option.textContent = item.familyName;
    selectEl.appendChild(option);
  });
  selectEl.style.display = fontList.length > 0 ? "inline-block" : "none";
}

// 제목/본문 선택 이벤트 (안전장치 추가: 선택 시점에 브라우저 Document에 동적 등록)
const handleFontChange = (selectId, applyFn) => (e) => {
  const idx = Number(e.target.value);
  const selectedItem = fontFileList[idx];
  if (selectedItem) {
    // 폰트가 유실되었을 가능성을 대비해 load() 확인 후 add 진행
    selectedItem.fontFace.load().then(() => {
      addFontToDocument(selectedItem.fontFace);
      applyFn(selectedItem.fontFace);
      console.log(`폰트 적용 완료: "${selectedItem.familyName}"`);
    });
  }
};

document.getElementById('heading-font-select').addEventListener('change', handleFontChange('heading-font-select', applyHeadingFont));
document.getElementById('body-font-select').addEventListener('change', handleFontChange('body-font-select', applyBodyFont));

const progressModal = document.getElementById("scan-progress-modal");
progressModal.addEventListener("cancel", (e) => e.preventDefault());
