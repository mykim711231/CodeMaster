<# 
.SYNOPSIS
    02 - 변경사항 커밋

.DESCRIPTION
    작업 트리의 변경사항을 스테이징하고 커밋을 생성합니다.
    변경사항이 없으면 빈 커밋 생성 옵션을 제공합니다.

.PARAMETER Message
    커밋 메시지 (기본값: "chore: update")

.PARAMETER AllowEmpty
    변경사항이 없을 때 빈 커밋을 허용합니다.

.EXAMPLE
    .\02-commit.ps1 -Message "feat: 새로운 기능 추가"

.EXAMPLE
    .\02-commit.ps1 -Message "trigger deploy" -AllowEmpty
    # 변경사항 없어도 빈 커밋 생성
#>

param(
    [Parameter(Mandatory=$false)]
    [string]$Message = "chore: update",

    [Parameter(Mandatory=$false)]
    [switch]$AllowEmpty = $false
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

Write-Log "=== 02: 변경사항 커밋 ==="

$repoRoot = git rev-parse --show-toplevel 2>$null
if (-not $repoRoot) {
    Write-Log "Git 저장소가 아닙니다." "ERROR"
    exit 1
}
Set-Location $repoRoot

$status = git status --porcelain
$hasChanges = $status.Trim() -ne ""

if ($hasChanges) {
    Write-Log "변경된 파일:"
    Write-Host $status
    
    Write-Log "스테이징 중..."
    git add -A
    if ($LASTEXITCODE -ne 0) {
        Write-Log "git add 실패" "ERROR"
        exit $LASTEXITCODE
    }
    
    Write-Log "커밋 생성: $Message"
    git commit -m "$Message"
    if ($LASTEXITCODE -ne 0) {
        Write-Log "git commit 실패" "ERROR"
        exit $LASTEXITCODE
    }
    
    $commitHash = git rev-parse --short HEAD
    Write-Log "커밋 완료: $commitHash" "SUCCESS"
} else {
    Write-Log "작업 트리가 깨끗합니다. 변경사항이 없습니다." "WARN"
    if ($AllowEmpty) {
        $emptyMsg = "$Message (empty commit)"
        Write-Log "빈 커밋 생성: $emptyMsg"
        git commit --allow-empty -m "$emptyMsg"
        if ($LASTEXITCODE -ne 0) {
            Write-Log "빈 커밋 생성 실패" "ERROR"
            exit $LASTEXITCODE
        }
        $commitHash = git rev-parse --short HEAD
        Write-Log "빈 커밋 완료: $commitHash" "SUCCESS"
    } else {
        Write-Log "빈 커밋을 생성하려면 -AllowEmpty 스위치를 사용하세요." "INFO"
        Write-Log "예: .\02-commit.ps1 -Message 'trigger deploy' -AllowEmpty" "INFO"
        exit 0
    }
}

Write-Log "=== 02: 커밋 완료 ===" "SUCCESS"