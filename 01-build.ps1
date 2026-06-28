<# 
.SYNOPSIS
    01 - 로컬 프로덕션 빌드 검증

.DESCRIPTION
    npm ci로 의존성을 깨끗하게 설치하고, npm run build로 프로덕션 빌드를 수행합니다.
    빌드 성공 시 dist/ 폴더에 산출물이 생성됨을 확인합니다.

.PARAMETER SkipInstall
    의존성 설치(npm ci) 단계를 건너뜁니다. 이미 node_modules가 최신 상태일 때 사용.

.EXAMPLE
    .\01-build.ps1
    # 전체 빌드 수행 (npm ci + npm run build)

.EXAMPLE
    .\01-build.ps1 -SkipInstall
    # 의존성 설치 생략하고 빌드만 수행

.NOTES
    실행 위치: 저장소 루트 또는 하위 디렉토리 어디에서나 실행 가능
    사전 요구사항: Node.js 22+, npm 10+
#>

param(
    [Parameter(Mandatory=$false)]
    [switch]$SkipInstall = $false
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

Write-Log "=== 01: 로컬 프로덕션 빌드 시작 ==="

# 저장소 루트로 이동
$repoRoot = git rev-parse --show-toplevel 2>$null
if (-not $repoRoot) {
    Write-Log "Git 저장소가 아닙니다." "ERROR"
    exit 1
}
Set-Location $repoRoot

if (-not $SkipInstall) {
    Write-Log "의존성 설치 (npm ci)..."
    npm ci
    if ($LASTEXITCODE -ne 0) {
        Write-Log "npm ci 실패" "ERROR"
        exit $LASTEXITCODE
    }
    Write-Log "의존성 설치 완료" "SUCCESS"
} else {
    Write-Log "의존성 설치 생략 (--SkipInstall)" "WARN"
}

Write-Log "프로덕션 빌드 (npm run build)..."
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Log "빌드 실패" "ERROR"
    exit $LASTEXITCODE
}

# 빌드 산출물 확인
if (-not (Test-Path "dist/index.html")) {
    Write-Log "빌드 산출물(dist/index.html)을 찾을 수 없습니다." "ERROR"
    exit 1
}

$distSize = (Get-ChildItem dist -Recurse -File | Measure-Object -Property Length -Sum).Sum / 1KB
Write-Log "빌드 성공! 산출물 크기: {0:N1} KB" -f $distSize "SUCCESS"
Write-Log "=== 01: 빌드 완료 ===" "SUCCESS"