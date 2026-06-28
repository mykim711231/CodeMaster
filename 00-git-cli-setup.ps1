<# 
.SYNOPSIS
    00 - Git/GitHub CLI 설치 및 인증 설정 (최초 1회 실행)

.DESCRIPTION
    Git CLI, GitHub CLI(gh) 설치와 브라우저 기반 인증을 한 번에 설정합니다.
    관리자 권한 PowerShell에서 실행하세요.

.PARAMETER SkipGit
    Git 설치를 건너뜁니다 (이미 설치된 경우).

.PARAMETER SkipGh
    GitHub CLI 설치를 건너뜁니다 (이미 설치된 경우).

.PARAMETER ConfigureGit
    Git 사용자 정보(name/email) 설정을 대화형으로 수행합니다.

.EXAMPLE
    # 관리자 권한 PowerShell에서 실행
    .\00-git-cli-setup.ps1
    # Git + gh 설치 -> 브라우저 인증 -> Git 사용자 설정까지 모두 수행

.EXAMPLE
    .\00-git-cli-setup.ps1 -SkipGit -SkipGh
    # 설치 생략하고 인증만 수행 (이미 설치된 경우)

.EXAMPLE
    .\00-git-cli-setup.ps1 -ConfigureGit
    # Git 사용자 이름/이메일만 설정

.NOTES
    - 반드시 관리자 권한 PowerShell에서 실행하세요 (winget 필요)
    - 브라우저가 열려 인증을 완료해야 합니다
    - 최초 1회만 실행하면 됩니다
#>

param(
    [Parameter(Mandatory=$false)]
    [switch]$SkipGit = $false,

    [Parameter(Mandatory=$false)]
    [switch]$SkipGh = $false,

    [Parameter(Mandatory=$false)]
    [switch]$ConfigureGit = $true
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

function Check-Admin {
    $principal = [Security.Principal.WindowsPrincipal]::new([Security.Principal.WindowsIdentity]::GetCurrent())
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Test-Command {
    param([string]$Name, [string]$Command)
    if (Get-Command $Command -ErrorAction SilentlyContinue) {
        $version = & $Command --version 2>&1 | Select-Object -First 1
        Write-Log "$Name 이미 설치됨: $version" "SUCCESS"
        return $true
    }
    return $false
}

Write-Log "=== 00: Git/GitHub CLI 설치 및 인증 설정 ==="

# 관리자 권한 확인
if (-not (Check-Admin)) {
    Write-Log "관리자 권한 PowerShell에서 실행해야 합니다!" "ERROR"
    Write-Log "시작 메뉴 > PowerShell 우클릭 > '관리자 권한으로 실행'" "INFO"
    exit 1
}

# 1. Git 설치
if (-not $SkipGit) {
    if (-not (Test-Command "Git" "git")) {
        Write-Log "Git 설치 중 (winget)..."
        winget install --id Git.Git -e --source winget --accept-source-agreements --accept-package-agreements
        if ($LASTEXITCODE -ne 0) {
            Write-Log "Git 설치 실패. 수동 설치: https://git-scm.com/download/win" "ERROR"
            exit 1
        }
        Write-Log "Git 설치 완료. 새 터미널에서 다시 실행하세요." "SUCCESS"
        Write-Log "또는: refreshenv 후 계속 진행" "INFO"
        # PATH 갱신
        $env:PATH = [Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" + [Environment]::GetEnvironmentVariable("PATH", "User")
    }
} else {
    Write-Log "Git 설치 생략 (--SkipGit)" "WARN"
}

# 2. GitHub CLI 설치
if (-not $SkipGh) {
    if (-not (Test-Command "GitHub CLI" "gh")) {
        Write-Log "GitHub CLI(gh) 설치 중 (winget)..."
        winget install --id GitHub.cli -e --source winget --accept-source-agreements --accept-package-agreements
        if ($LASTEXITCODE -ne 0) {
            Write-Log "gh 설치 실패. 수동 설치: https://cli.github.com/" "ERROR"
            exit 1
        }
        Write-Log "gh 설치 완료" "SUCCESS"
        # PATH 갱신
        $env:PATH = [Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" + [Environment]::GetEnvironmentVariable("PATH", "User")
    }
} else {
    Write-Log "gh 설치 생략 (--SkipGh)" "WARN"
}

# 3. Git 사용자 설정
if ($ConfigureGit) {
    Write-Log "=== Git 사용자 정보 설정 ==="
    $currentName = git config --global user.name 2>$null
    $currentEmail = git config --global user.email 2>$null
    
    if ($currentName -and $currentEmail) {
        Write-Log "현재 설정: $currentName <$currentEmail>"
        $change = Read-Host "변경하시겠습니까? (y/N)"
        if ($change -notmatch '^[yY]$') {
            Write-Log "기존 설정 유지" "INFO"
        } else {
            $newName = Read-Host "Git 사용자 이름"
            $newEmail = Read-Host "Git 이메일 (GitHub 계정 이메일)"
            if ($newName -and $newEmail) {
                git config --global user.name "$newName"
                git config --global user.email "$newEmail"
                Write-Log "설정 완료: $newName <$newEmail>" "SUCCESS"
            }
        }
    } else {
        $newName = Read-Host "Git 사용자 이름 입력"
        $newEmail = Read-Host "Git 이메일 입력 (GitHub 계정 이메일)"
        if ($newName -and $newEmail) {
            git config --global user.name "$newName"
            git config --global user.email "$newEmail"
            Write-Log "설정 완료: $newName <$newEmail>" "SUCCESS"
        } else {
            Write-Log "이름/이메일 필수입니다. 나중에 수동 설정: git config --global user.name '이름'" "WARN"
        }
    }
    
    # 유용한 Git 전역 설정
    Write-Log "유용한 Git 전역 설정 적용 중..."
    git config --global init.defaultBranch main
    git config --global pull.rebase false
    git config --global core.autocrlf true
    git config --global credential.manager cross-platform
    Write-Log "Git 기본 설정 완료" "SUCCESS"
}

# 4. GitHub CLI 인증 (브라우저)
Write-Log "=== GitHub CLI 브라우저 인증 ==="
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -eq 0 -and $authStatus -like "*Logged in*") {
    Write-Log "이미 인증됨: $($authStatus | Select-String 'Logged in').Matches.Value" "SUCCESS"
    $reauth = Read-Host "재인증 하시겠습니까? (y/N)"
    if ($reauth -notmatch '^[yY]$') {
        Write-Log "기존 인증 유지" "INFO"
    } else {
        Write-Log "브라우저 인증 시작..."
        gh auth login --web --git-protocol https
    }
} else {
    Write-Log "브라우저에서 GitHub 인증을 진행합니다..."
    Write-Log "브라우저가 열리면 GitHub 계정으로 로그인하고 권한을 허용하세요."
    gh auth login --web --git-protocol https
    if ($LASTEXITCODE -ne 0) {
        Write-Log "인증 실패. 수동 실행: gh auth login --web" "ERROR"
        exit 1
    }
    Write-Log "인증 성공!" "SUCCESS"
}

# 5. SSH 키 확인 및 안내 (선택사항)
Write-Log "=== SSH 키 확인 (선택사항, HTTPS 쓰면 불필요) ==="
$sshPath = "$env:USERPROFILE\.ssh\id_ed25519.pub"
if (Test-Path $sshPath) {
    Write-Log "ED25519 SSH 키 발견: $sshPath" "SUCCESS"
    $key = Get-Content $sshPath
    Write-Log "공개키 (GitHub Settings > SSH Keys에 등록):"
    Write-Host $key
} else {
    Write-Log "SSH 키가 없습니다. HTTPS로 인증했으므로 필수는 아닙니다." "INFO"
    $create = Read-Host "SSH 키 생성하시겠습니까? (y/N)"
    if ($create -match '^[yY]$') {
        $email = git config --global user.email
        if (-not $email) { $email = Read-Host "이메일 입력" }
        ssh-keygen -t ed25519 -C "$email" -f "$env:USERPROFILE\.ssh\id_ed25519"
        Write-Log "SSH 키 생성 완료. 공개키를 GitHub에 등록하세요:"
        Get-Content "$env:USERPROFILE\.ssh\id_ed25519.pub"
    }
}

Write-Log "=== 00: 설정 완료 ===" "SUCCESS"
Write-Log ""
Write-Log "다음 단계:" "INFO"
Write-Log "  1. 일반 PowerShell(관리자 불필요) 새로 열기"
Write-Log "  2. 저장소 클론: git clone https://github.com/mykim711231/CodeMaster.git"
Write-Log "  3. 빌드 테스트: .\01-build.ps1"
Write-Log "  4. 배포: .\01-deploy.ps1"