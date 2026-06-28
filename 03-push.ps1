<# 
.SYNOPSIS
    03 - 원격 저장소 푸시

.DESCRIPTION
    로컬 커밋을 원격 저장소(origin/main)에 푸시합니다.
    GitHub Actions 배포 워크플로우를 트리거합니다.

.PARAMETER Remote
    원격 저장소 이름 (기본값: origin)

.PARAMETER Branch
    푸시할 브랜치 이름 (기본값: main)

.PARAMETER Force
    강제 푸시 사용 (--force-with-lease)

.EXAMPLE
    .\03-push.ps1

.EXAMPLE
    .\03-push.ps1 -Force
    # 강제 푸시 (주의 필요)
#>

param(
    [Parameter(Mandatory=$false)]
    [string]$Remote = "origin",

    [Parameter(Mandatory=$false)]
    [string]$Branch = "main",

    [Parameter(Mandatory=$false)]
    [switch]$Force = $false
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $prefix = switch ($Level) {
        "ERROR" { "[ERROR]" }
        "WARN"  { "[WARN]" }
        "SUCCESS" { "[OK]" }
        default { "[INFO]" }
    }
    Write-Host "[$timestamp] $prefix $Message"
}

Write-Log "=== 03: 원격 저장소 푸시 ==="

$repoRoot = git rev-parse --show-toplevel 2>$null
if (-not $repoRoot) {
    Write-Log "Git 저장소가 아닙니다." "ERROR"
    exit 1
}
Set-Location $repoRoot

$currentBranch = git branch --show-current
if ($currentBranch -ne $Branch) {
    Write-Log "현재 브랜치($currentBranch)가 대상 브랜치($Branch)와 다릅니다." "WARN"
}

$hasCommits = git rev-list --count HEAD ^origin/$Branch 2>$null
if ($hasCommits -eq 0 -or -not $hasCommits) {
    $hasCommits = git rev-list --count origin/$Branch..HEAD 2>$null
}
if ($hasCommits -eq 0 -or -not $hasCommits) {
    Write-Log "푸시할 새 커밋이 없습니다." "WARN"
    exit 0
}

Write-Log "푸시할 커밋 수: $hasCommits 개"
Write-Log "대상: $Remote/$Branch"

$pushArgs = @("push", $Remote, $Branch)
if ($Force) {
    $pushArgs += "--force-with-lease"
    Write-Log "강제 푸시 모드 (--force-with-lease)" "WARN"
}

git @pushArgs
if ($LASTEXITCODE -ne 0) {
    Write-Log "푸시 실패" "ERROR"
    exit $LASTEXITCODE
}

$commitHash = git rev-parse --short HEAD
Write-Log "푸시 완료: $commitHash -> $Remote/$Branch" "SUCCESS"
Write-Log "GitHub Actions 배포 워크플로우가 트리거되었습니다." "INFO"
Write-Log "배포 상태 확인: gh run list --limit 3" "INFO"

Write-Log "=== 03: 푸시 완료 ===" "SUCCESS"