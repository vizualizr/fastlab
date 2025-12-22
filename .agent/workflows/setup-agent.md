---
description: Project-Neutral Agent Setup Manual
---

# Agent Setup Manual (Initial Setup)

새로운 프로젝트를 시작할 때 에이전트의 효율적인 협업 환경을 구축하기 위한 표준 절차입니다. 이 내용은 특정 주제(예: 시각화)에 독립적인 '중립적 인프라' 구축을 목표로 합니다.

## 1. Directory Structure

프로젝트 루트의 `.agent` 폴더 아래 다음 구조를 생성합니다.

- `.agent/brain/`: 세션 아티팩트(`task.md`, `memory.md` 등) 저장소.
- `.agent/workflows/`: 에이전트용 작업 자동화 스크립트.
- `.agent/templates/documentation/recipes/`: 일반 문서화 패턴(예: `logseq.md`).
- `.agent/log/`: 일일 작업 로그 저장소.

## 2. Core Workflows

다음 워크플로 파일을 `.agent/workflows/`에 복사하여 에이전트가 인식하게 합니다.

- **`sync-brain.md`**: 세션 ID를 환경에 맞춰 수정한 후, 세션 데이터를 프로젝트 폴더로 동기화하는 용도로 사용합니다.

## 3. Principles (Memory Baseline)

`memory.md` 파일에 다음 프로젝트 중립적 원칙을 초기화합니다.

- **Answer Style**: 한국어, 간결함, 명확성 유지.
- **Recipe Pattern**: 코드는 함수형 패키지보다 본문 삽입이 용이한 '레시피' 조각 형태를 우선함.
- **Brain Ejection**: 모든 세션 데이터는 `.agent/brain`에서 직접 관리하고 Git으로 버전 관리함.

## 4. Initialization Steps

1. 위 구조를 생성한다.
2. 에이전트에게 `.agent/Introduction.md`를 읽으라고 지시한다.
3. 에이전트에게 현재 세션 ID를 확인하게 한 후 `sync-brain.md`를 업데이트하게 한다.
4. "프로젝트 중립적 설정을 완료했으니 확인해줘"라고 요청한다.
