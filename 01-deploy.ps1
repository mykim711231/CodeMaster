<# 
.SYNOPSIS
    CodeMaster 프로젝트 로컬 빌드 -> 커밋 -> 푸시 -> GitHub Pages 배포 자동화 스크립트

.DESCRIPTION
    1. 로컬 빌드 검증 (npm run build)
    2. 변경사항이 있으면 커밋 및 푸시
    3. GitHub Actions에서 자동으로 GitHub Pages 배포 트리거
    4. 배포 완료까지 대기 및 결과 확인

.NOTES
    작성일: 2025-06-29
    버전: 1.0.0
#>

param(
    [Parameter(Mandatory=$false)]
    [string]$CommitMessage = "chore: deploy via script",

    [Parameter(Mandatory=$false)]
    [switch]$ForcePush = $false,

    [Parameter(Mandatory=$false)]
    [switch]$SkipBuild = $false,

    [Parameter(Mandatory=$false)]
    [switch]$SkipDeployWait = $false
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
        "INFO"  { "[INFO]" }
        default { "[INFO]" }
    }
    Write-Host "[$timestamp] $prefix $Message"
}

function Check-Command {
    param([string]$Command, [string]$Name)
    if (-not (Get-Command $Command -ErrorAction SilentlyContinue)) {
        Write-Log "'$Name' 명령어를 찾을 수 없습니다. PATH를 확인하세요." "ERROR"
        exit 1
    }
}

function Run-Command {
    param([string]$Command, [string]$Description, [switch]$IgnoreError = $false)
    Write-Log "$Description 실행 중... ($Command)"
    $result = Invoke-Expression $Command
    $exitCode = $LASTEXITCODE
    if ($exitCode -ne 0 -and -not $IgnoreError) {
        Write-Log "$Description 실패 (exit code: $exitCode)" "ERROR"
        exit $exitCode
    }
    Write-Log "$Description 완료" "SUCCESS"
    return $result
}

# 사전 검사
Write-Log "=== 사전 환경 검사 ==="
Check-Command "git" "Git"
Check-Command "npm" "Node.js/npm"
Check-Command "gh" "GitHub CLI (선택사항, 배포 확인용)"

# Git 상태 확인
Write-Log "=== Git 상태 확인 ==="
$repoRoot = git rev-parse --show-toplevel 2>$null
if (-not $repoRoot) {
    Write-Log "Git 저장소가 아닙니다." "ERROR"
    exit 1
}
Set-Location $repoRoot
Write-Log "저장소 루트: $repoRoot"

$currentBranch = git branch --show-current
Write-Log "현재 브랜치: $currentBranch"

if ($currentBranch -ne "main") {
    Write-Log "main 브랜치가 아닙니다. 현재: $currentBranch" "WARN"
    $confirm = Read-Host "계속하시겠습니까? (y/N)"
    if ($confirm -notmatch '^[yY]$') {
        Write-Log "사용자 취소" "WARN"
        exit 0
    }
}

# 변경사항 확인
$status = git status --porcelain
$hasChanges = $status.Trim() -ne ""

# 빌드 실행
if (-not $SkipBuild) {
    Write-Log "=== 로컬 빌드 검증 ==="
    Run-Command "npm ci" "의존성 설치 (clean install)"
    Run-Command "npm run build" "프로덕션 빌드"
    
    # 빌드 산출물 확인
    if (-not (Test-Path "dist/index.html")) {
        Write-Log "빌드 산출물(dist/index.html)을 찾을 수 없습니다." "ERROR"
        exit 1
    }
    Write-Log "빌드 산출물 확인 완료" "SUCCESS"
}

# 커밋 및 푸시
if ($hasChanges) {
    Write-Log "=== 변경사항 커밋 및 푸시 ==="
    Write-Log "변경된 파일:`n$status"
    
    Run-Command "git add -A" "전체 변경사항 스테이징"
    Run-Command "git commit -m `"$CommitMessage`"" "커밋 생성"
    
    $pushCmd = "git push origin $currentBranch"
    if ($ForcePush) { $pushCmd += " --force-with-lease" }
    Run-Command $pushCmd "원격 저장소 푸시"
} else {
    Write-Log "작업 트리가 깨끗합니다. 커밋할 변경사항이 없습니다." "INFO"
    Write-Log "기존 커밋으로 배포 트리거를 위해 빈 커밋을 생성하시겠습니까? (y/N)"
    $confirm = Read-Host
    if ($confirm -match '^[yY]$') {
        $emptyCommitMsg = "$CommitMessage (empty commit to trigger deploy)"
        Run-Command "git commit --allow-empty -m `"$emptyCommitMsg`"" "빈 커밋 생성"
        $pushCmd = "git push origin $currentBranch"
        if ($ForcePush) { $pushCmd += " --force-with-lease" }
        Run-Command $pushCmd "원격 저장소 푸시"
    } else {
        Write-Log "푸시 생략. 기존 최신 커밋으로 배포가 이미 완료되었을 수 있습니다." "INFO"
    }
}

# 배포 대기 및 확인
if (-not $SkipDeployWait) {
    Write-Log "=== GitHub Actions 배포 대기 및 확인 ==="
    
    if (Get-Command "gh" -ErrorAction SilentlyContinue) {
        Write-Log "GitHub CLI로 워크플로우 실행 확인 중..."
        
        # 최신 워크플로우 실행 ID 가져오기
        $runId = gh run list --workflow="Deploy to GitHub Pages" --branch=$currentBranch --limit=1 --json=databaseId --jq='.[0].databaseId' 2>$null
        
        if ($runId) {
            Write-Log "워크플로우 실행 ID: $runId"
            Write-Log "배포 완료까지 대기 중... (최대 5분)"
            
            $maxWait = 300  # 5분
            $interval = 10  # 10초
            $elapsed = 0
            
            while ($elapsed -lt $maxWait) {
                $status = gh run view $runId --json=status,conclusion --jq='.status + " " + .conclusion' 2>$null
                if ($status) {
                    $parts = $status.Split(" ")
                    $runStatus = $parts[0]
                    $conclusion = $parts[1]
                    
                    Write-Log "현재 상태: $runStatus / 결론: $conclusion"
                    
                    if ($runStatus -eq "completed") {
                        if ($conclusion -eq "success") {
                            Write-Log "배포 성공!" "SUCCESS"
                            $url = gh run view $runId --json=url --jq='.url' 2>$null
                            Write-Log "워크플로우 URL: $url"
                            
                            # GitHub Pages URL 출력
                            $pagesUrl = "https://mykim711231.github.io/CodeMaster/"
                            Write-Log "배포된 사이트: $pagesUrl" "SUCCESS"
                            break
                        } else {
                            Write-Log "배포 실패: $conclusion" "ERROR"
                            $url = gh run view $runId --json=url --jq='.url' 2>$null
                            Write-Log "로그 확인: $url" "ERROR"
                            exit 1
                        }
                    }
                }
                
                Start-Sleep -Seconds $interval
                $elapsed += $interval
            }
            
            if ($elapsed -ge $maxWait) {
                Write-Log "배포 대기 시간 초과 (5분). GitHub Actions에서 직접 확인하세요." "WARN"
            }
        } else {
            Write-Log "워크플로우 실행 정보를 찾을 수 없습니다. 수동으로 확인하세요." "WARN"
        }
    } else {
        Write-Log "GitHub CLI(gh)가 설치되지 않아 배포 상태를 자동 확인할 수 없습니다." "WARN"
        Write-Log "GitHub Actions 탭에서 수동으로 확인하세요: https://github.com/mykim711231/CodeMaster/actions"
    }
}

Write-Log "=== 배포 프로세스 완료 ===" "SUCCESS"
Write-Log "사이트 확인: https://mykim711231.github.io/CodeMaster/"