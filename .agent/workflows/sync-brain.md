---
description: Synchronize active session artifacts to project folder
---

# Sync Brain Artifacts

이 워크플로는 현재 에이전트 세션의 활성 데이터(계획, 메모리, 작업 목록 등)를 프로젝트의 `.agent/brain` 폴더로 동기화합니다. Git 커밋 전에 실행하여 에이전트의 최신 상태를 프로젝트에 반영하세요.

```powershell
$sessionID = "80f2ed6b-14b8-41ec-adf1-be7b07728f0d"
$source = "C:\Users\onlin\.gemini\antigravity\brain\$sessionID"
$dest = ".agent/brain"

New-Item -ItemType Directory -Force -Path $dest
Copy-Item -Path "$source\*" -Destination $dest -Recurse -Force
Write-Host "Sync complete to $dest"
```

# Restore Brain (Emergency Only)

**경고**: 현재 세션의 데이터를 로컬 저장본으로 덮어씁니다.

```powershell
$sessionID = "80f2ed6b-14b8-41ec-adf1-be7b07728f0d"
$source = ".agent/brain"
$dest = "C:\Users\onlin\.gemini\antigravity\brain\$sessionID"

Copy-Item -Path "$source\*" -Destination $dest -Recurse -Force
Write-Host "Restore complete from $source"
```
