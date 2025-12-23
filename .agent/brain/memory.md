# FastLab Project Memory & Rules

이 문서는 `.agent` 및 `.gemini` 폴더의 내용을 바탕으로 정리한 프로젝트 규칙 및 가이드라인입니다.

## 0. 프로젝트 목표 및 비전
- **사용자 목표**: 차트 기반의 **디지털 스토리텔링**에 전문화된 프론트엔드 개발자.
- **프로젝트 목적**: `D3.js in Action` 학습을 병행하며 자신만의 **코드 레시피 아카이브**를 구축하는 것.
- **핵심 약속**: 사용자가 **'레시피로 저장해줘'**라고 요청하면, 해당 로직을 추출하여 `.agent/templates` 내 적절한 경로에 레시피 형식으로 저장하고 `manifest.json`을 업데이트합니다.

## 1. 기본 원칙 (Introduction.md)
- **언어 및 문체**: 답변은 한국어로 하며, 간결하고 명확하게 유지합니다.
- **환경 유지**: 테스트 환경(`npm run dev`)을 최대한 빠르고 안정적으로 유지합니다.
- **변경 기록**: 주요 변경 사항이 발생할 경우 `.log` 폴더(현재 미생성 시 생성 가능)에 기록합니다.
- **외부 파일 접근 제한**: **명시적으로 문서화된 별도의 지시가 없는 한**, 현재 프로젝트 폴더(`fastlab`) 외부에 있는 파일은 수정, 변경, 삭제하지 않습니다.
- **학습 자료**: 사용자 요청 시 `.agent/templates` 폴더의 파일을 기반으로 학습 자료를 생성합니다. (현재 '레시피' 형태의 코드 조각 중심으로 관리 중)

## 2. 시각화 및 문서화 명세 (manifest.json)
- **D3**: 복잡하고 커스텀한 시각화 담당. (`.agent/templates/visualization/d3`)
- **Plot (Observable Plot)**: 간단하고 표준적인 통계 차트 담당. (`.agent/templates/visualization/plot`)
- **Logseq**: 프로젝트/학습 내용 관리. (`.agent/templates/documentation/recipes/logseq.md`)
- **Recipes (레시피)**: 함수 형태가 아닌, 본문에 바로 삽입 가능한 코드 조각(Fragment) 형태로 관리합니다.
- **Margin Convention**: `visualization/d3/recipes/setup-canvas.js` 레시피를 사용하여 SVG 컨테이너 및 inner group(bounds)을 설정합니다. 
  - `top: 40`, `bottom: 25`, `right: 170`, `left: 40`
  - `horizontalMargin`, `verticalMargin` 게터 포함.

## 3. Logseq 관리 (logseq.md)
- 사용자가 "마크다운으로 정리해"라고 요청하면 대화 내용을 요약/정리합니다.
- **문체**: `-다` (개조식).
- **형식**: 코드 블록 내부에 Logseq 호환 마크다운 작성.
- **필수 속성**: `date-created`, `date-modified`, `division`, `stack`, `tags`, `type`, `alias`, `status: [[ai-generated]]`.
- **Division 분류**:
  - `[[makr]]`: 개발/성과물 (글쓰기 제외).
  - `[[carta]]`: 독서/글쓰기.
  - `[[mining]]`: 생계/수익 활동.
- **Host 정보**: `[[p1]]` (주 랩탑), `[[s10e]]` (휴대폰), `[[iPad 9th]]` (가족 패드), `[[iPad Air 2]]` (아들/PDF용).

## 4. 워크플로우 및 브레인 관리 (Brain Ejection)
- **관리 위치**: 에이전트 브레인 파일(작업 계획, 메모리 등)은 이제 프로젝트 내 `.agent/brain` 폴더에서 직접 관리됩니다.
- **주요 파일**:
  - `memory.md`: 프로젝트 규칙 요약.
  - `task.md`: 현재 작업 상태.
  - `implementation_plan.md`: 기술 설계도.
- **Git 관리**: 이 파일들은 프로젝트의 일부로 간주되어 Git에 포함될 수 있습니다.
- **현재 세션 ID**: `80f2ed6b-14b8-41ec-adf1-be7b07728f0d`
