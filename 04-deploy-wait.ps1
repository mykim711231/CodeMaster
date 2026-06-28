<# 
.SYNOPSIS
    04 - GitHub Pages 배포 대기 및 결과 확인

.DESCRIPTION
    GitHub Actions에서 실행 중인 배포 워크플로우를 모니터링하고,
    완료 시 결과(성공/실패)와 배포된 사이트 URL을 출력합니다.
    GitHub CLI(gh)가 필요합니다.

.PARAMETER Workflow
    워크플로우 이름 (기본값: "Deploy to GitHub Pages")

.PARAMETER Branch
    브랜치 이름 (기본값: main)

.PARAMETER TimeoutSec
    최대 대기 시간(초) (기본값: 300 = 5분)

.PARAMETER IntervalSec
    확인 간격(초) (기본값: 10)

.EXAMPLE
    .\04-deploy-wait.ps1

.EXAMPLE
    .\04-deploy-wait.ps1 -TimeoutSec 600
    # 10분 대기
#>

param(
    [Parameter(Mandatory=$false)]
    [string]$Workflow = "Deploy to GitHub Pages",

    [Parameter(Mandatory=$false)]
    [string]$Branch = "main",

    [Parameter(Mandatory=$false)]
    [int]$TimeoutSec = 300,

    [Parameter(Mandatory=$false)]
    [int]$IntervalSec = 10
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

Write-Log "=== 04: GitHub Pages 배포 대기 ==="

# gh CLI 확인
if (-not (Get-Command "gh" -ErrorAction SilentlyContinue)) {
    Write-Log "GitHub CLI(gh)가 설치되지 않았습니다." "ERROR"
    Write-Log "설치: winget install GitHub.cli" "INFO"
    Write-Log "또는 수동 확인: https://github.com/mykim711231/CodeMaster/actions" "INFO"
    exit 1
}

# 인증 확인
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Log "GitHub CLI 인증이 필요합니다." "ERROR"
    Write-Log "실행: gh auth login" "INFO"
    exit 1
}

# 저장소 루트
$repoRoot = git rev-parse --show-toplevel 2>$null
if (-not $repoRoot) {
    Write-Log "Git 저장소가 아닙니다." "ERROR"
    exit 1
}
Set-Location $repoRoot

# 최신 워크플로우 실행 찾기
Write-Log "워크플로우 '$Workflow' ($Branch 브랜치) 실행 검색 중..."
$runId = gh run list --workflow="$Workflow" --branch=$Branch --limit=1 --json=databaseId --jq='.[0].databaseId' 2>$null

if (-not $runId -or $runId -eq "null" -or $runId.Trim() -eq "") {
    Write-Log "실행 중인 워크플로우를 찾을 수 없습니다." "WARN"
    Write-Log "수동 확인: https://github.com/mykim711231/CodeMaster/actions" "INFO"
    exit 0
}

Write-Log "발견된 실행 ID: $runId"
Write-Log "배포 완료까지 대기 중... (최대 {0}초, {1}초 간격)" -f $TimeoutSec, $IntervalSec

$elapsed = 0
$completed = $false

while ($elapsed -lt $TimeoutSec) {
    $runInfo = gh run view $runId --json=status,conclusion,url,createdAt --jq='{status: .status, conclusion: .conclusion, url: .url, createdAt: .createdAt}' 2>$null
    
    if ($runInfo) {
        $info = $runInfo | ConvertFrom-Json
        $status = $info.status
        $conclusion = $info.conclusion
        $url = $info.url
        
        Write-Log "상태: $status  |  결론: $conclusion  |  경과: ${elapsed}s"
        
        if ($status -eq "completed") {
            $completed = $true
            if ($conclusion -eq "success") {
                Write-Log "배포 성공!" "SUCCESS"
                Write-Log "워크플로우: $url"
                
                # GitHub Pages URL
                $pagesUrl = "https://mykim711231.github.io/CodeMaster/"
                Write-Log "배포된 사이트: $pagesUrl" "SUCCESS"
                
                # 배포 시간 계산
                $created = [DateTime]::Parse($info.createdAt).ToLocalTime()
                $now = Get-Date
                $duration = $now - $created
                Write-Log "소요 시간: {0}분 {1}초" -f [math]::Floor($duration.TotalMinutes), $duration.Seconds
            } else {
                Write-Log "배포 실패: $conclusion" "ERROR"
                Write-Log "로그 확인: $url" "ERROR"
                Write-Log "상세 로그: gh run view $runId --log" "INFO"
            }
            break
        }
    }
    
    Start-Sleep -Seconds $IntervalSec
    $elapsed += $IntervalSec
}

if (-not $completed) {
    Write-Log "대기 시간 초과 ({0}초). 워크플로우가 아직 실행 중입니다." -f $TimeoutSec "WARN"
    Write-Log "나중에 다시 실행하거나 GitHub에서 직접 확인하세요." "INFO"
    Write-Log "워크플로우: https://github.com/mykim711231/CodeMaster/actions/runs/$runId" "INFO"
}

Write-Log "=== 04: 배포 대기 완료 ==="