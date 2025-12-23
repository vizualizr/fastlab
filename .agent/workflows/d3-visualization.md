---
description: D3.js 시각화 구현을 위한 데이터 파이프라인 및 전략 가이드
---

D3.js 시각화 작업을 시작할 때 다음의 **6단계 데이터 파이프라인**을 따라 작업합니다. 모든 단계는 한꺼번에 완성하려 하지 말고, `console.log`로 데이터를 확인하며 단계별로 진행하세요.

## 1. D3 시각화 로드맵 (The Data Flow Pipeline)

### Step 0: 데이터 소스 검증 (Data Source Verification)
작업 시작 전 데이터가 올바르게 로드되었는지, 타입 변환이 필요한지 확인합니다.
- `d3.csv`, `d3.json` 등으로 데이터 로드.
- `console.table(data)`를 사용하여 초기 데이터 구조 파악.
- 날짜 데이터(`new Date()`)나 숫자 데이터(`+d`)의 파싱 상태 확인.

### Step 1: 캔버스 설정 (Canvas Setup)
SVG가 그려질 공간과 여백을 정의합니다.
- `width`, `height`, `margin` 객체 생성.
- `innerWidth`, `innerHeight` 계산 (전체 크기에서 마진 제외).
- `svg` 요소 추가 및 `viewBox` 설정.
- 실제 차트가 그려질 그룹 요소(`<g>`)를 생성하고 마진만큼 `translate` 이동.

### Step 2: 스케일 정의 (Scale Definition)
데이터 값(Domain)을 화면 픽셀(Range)로 매핑하는 공식을 만듭니다.
- `d3.scaleTime()`, `d3.scaleLinear()`, `d3.scaleBand()` 등 선택.
- `domain()`에는 데이터의 최솟값/최댓값 설정.
- `range()`에는 위에서 계산한 `innerWidth`, `innerHeight` 활용.

### Step 3: 데이터 바인딩 및 시각화 요소 생성
실제 데이터를 화면에 그립니다.
- `selectAll()`, `data()`, `join()` 패턴 사용.
- 각 요소(`circle`, `rect`, `path` 등)의 속성(`attr`) 설정 시 바인딩된 데이터 `d` 활용.
- 복잡한 도형은 `d3.line()`, `d3.area()` 같은 생성기 활용.

### Step 4: 축 구현 및 스타일링 (Axis & Styling)
차트의 가독성을 높이는 보조 요소를 추가합니다.
- `d3.axisBottom(xScale)` 등으로 축 생성기 정의.
- `.call(axis)`를 통해 SVG에 렌더링.
- **팁**: 눈금 위치 조정이 필요하면 렌더링 후 `selectAll('.tick text')`로 다시 선택하여 개별 `attr` 수정.

### Step 5: 프레임워크 이식 (Framework Adaptation)
완성된 코드를 타겟 프레임워크(Astro, Svelte, React 등)에 맞게 조정합니다.
- **Astro/Svelte**: `onMount()` 생명주기 안에서 D3 코드 실행.
- **반응형**: 창 크기 변경 시 스케일과 축을 다시 계산하는 로직 추가.
- **컴포넌트화**: 하드코딩된 선택자 대신 `bind:this` 등으로 요소를 참조하도록 변경.

## 2. 구현 전략 (Implementation Strategy)

- **Zero-Base 금지**: [D3 Gallery](https://observablehq.com/@d3/gallery)나 기존 템플릿에서 가장 유사한 예제를 찾아 시작하세요.
- **d의 이해**: `.attr(name, d => ...)`에서 `d`는 D3가 루프를 돌며 넣어주는 **개별 데이터 한 조각**임을 잊지 마세요.
- **기록**: 복잡한 좌표 계산이나 스타일링 트릭은 나중을 위해 스니펫으로 기록해 둡니다.
