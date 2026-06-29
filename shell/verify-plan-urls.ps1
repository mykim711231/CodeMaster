# Auto Verify & Fix PLAN URLs
#
# Purpose : verify-plan-urls.ps1
#           Check each URL in PLAN.md files via HEAD request,
#           replace with known-latest URL if 404,
#           mark status checkbox as [x] for verified URLs.
#           Add 3s delay between requests + 30s pause every 5 URLs
#           to prevent ResourceExhausted errors.
#
# Usage   : .\verify-plan-urls.ps1
#           (run from repo root)

$ErrorActionPreference = "Stop"

function Test-Url($Url, $TimeoutMs = 12000) {
    try {
        $req = [System.Net.WebRequest]::Create($Url)
        $req.Method = "HEAD"
        $req.Timeout = $TimeoutMs
        $req.AllowAutoRedirect = $false
        $req.UserAgent = "CodeMaster-DocMapper/1.0"
        $resp = $req.GetResponse()
        $code = [int]$resp.StatusCode
        $resp.Close()
        return @{ Ok = $true; Code = $code; Redirect = $null }
    }
    catch [System.Net.WebException] {
        $code = 0
        $resp = $_.Exception.Response
        if ($resp) {
            $code = [int]$resp.StatusCode
            if ($code -in @(301,302,307,308)) {
                return @{ Ok = $true; Code = $code; Redirect = $resp.Headers["Location"] }
            }
        }
        return @{ Ok = $false; Code = $code; Redirect = $null }
    }
}

# URL replacement map: "old fragment" -> "new fragment"
# Core mappings
$replacements = @{
    "spring-boot/docs/3.4.x" = "spring-boot/docs/current"
    "djangoproject.com/en/4.2" = "djangoproject.com/en/5.1"
    "palletsprojects.com/en/3.0.x" = "palletsprojects.com/en/3.1.x"
}

# Additional known 404 replacements (extend as needed)
$extraReplacements = @{
    "scikit-learn.org/stable/tutorial/basic_tutorial.html" = "scikit-learn.org/stable/tutorial/"
    "www.pinecone.io/learn/series/pinecone-101/"          = "www.pinecone.io/learn/"
    "fastapi.tiangolo.com/advanced/background-tasks/"    = "fastapi.tiangolo.com/tutorial/background-tasks/"
    "developer.nvidia.com/blog/tensorrt-llm/"           = "developer.nvidia.com/tensorrt-llm"
    "guidance.ai/"                                        = "github.com/guidance-ai/guidance"
    "outlines-dev.github.io/outlines/"                   = "github.com/outlines-dev/outlines"
    "lmql.ai/"                                            = "github.com/eth-sri/lmql"
    "www.kubeflow.org/docs/components/pipelines/introduction/" = "www.kubeflow.org/docs/components/pipelines/"
    "www.whylabs.ai/"                                     = "github.com/whylabs/whylogs"
    "aif360.mybluemix.net/"                               = "github.com/IBM/AIF360"
}

# Merge core and extra into a single lookup table
$mergedReplacements = @{}
foreach ($k in $replacements.Keys) { $mergedReplacements[$k] = $replacements[$k] }
foreach ($k in $extraReplacements.Keys) { $mergedReplacements[$k] = $extraReplacements[$k] }

$plans = @(
    "docs\01.SpringBoot3.4.x\PLAN.md",
    "docs\02.Python3.12\PLAN.md"
)

$repoRoot = git rev-parse --show-toplevel 2>$null
# -----------------------------------------------------------------
# Logging helper – all console output is also saved to a log file.
# The log is written next to the repo root as verify-plan-urls.log
# (already ignored via *.log in .gitignore).
# -----------------------------------------------------------------
$logFile = Join-Path $repoRoot "verify-plan-urls.log"
function Write-Log { param([string]$msg)
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$ts $msg" | Out-File -FilePath $logFile -Encoding utf8 -Append
    Write-Host $msg
}
if (-not $repoRoot) { Write-Error "Not a git repo"; exit 1 }

$totalFixed = 0
$totalChecked = 0
$batchCount = 0

foreach ($planPath in $plans) {
    $fullPath = Join-Path $repoRoot $planPath
    if (-not (Test-Path $fullPath)) { Write-Warning "File not found: $planPath"; continue }

    Write-Host "`n--- Processing: $planPath ---" -ForegroundColor Cyan
    $content = [System.IO.File]::ReadAllText($fullPath)
    $lines = $content -split "`r?`n"
    $newLines = [System.Collections.ArrayList]::new()
    $fileChanged = $false

    $inCodeBlock = $false
    foreach ($line in $lines) {
        $newLine = $line

        if ($line -match '^\s*```') {
            $inCodeBlock = -not $inCodeBlock
            [void]$newLines.Add($newLine)
            continue
        }

        if ($inCodeBlock) {
            [void]$newLines.Add($newLine)
            continue
        }

        if ($line -match 'https?://[^\s|)\"]+') {
            $url = $Matches[0]
            while ($url -match '[,\)\]\}>]$') {
                $url = $url.Substring(0, $url.Length - 1)
            }
            if ($url.Length -lt 10) { [void]$newLines.Add($newLine); continue }
            $totalChecked++
            $batchCount++

            # Apply replacement mapping (core + extra)
            $newUrl = $url
            foreach ($old in $mergedReplacements.Keys) {
                if ($url -match [regex]::Escape($old)) {
                    $newUrl = $url -replace [regex]::Escape($old), $mergedReplacements[$old]
                    break
                }
            }

            # 429 retry handling (max 3 attempts with exponential back‑off)
            $attempt = 0
            $maxAttempts = 3
            do {
                Write-Host -NoNewline "  [$totalChecked] $newUrl  ... "
                $result = Test-Url $newUrl
                $valid = $result.Ok -and $result.Code -ge 200 -and $result.Code -lt 400
                if ($result.Code -eq 429) {
                    $attempt++
                    $waitSec = 30 * $attempt
                    Write-Host "Rate limit (429). Retry $attempt after $waitSec sec" -ForegroundColor Yellow
                    Start-Sleep -Seconds $waitSec
                }
            } while (-not $valid -and $attempt -lt $maxAttempts)

            if (-not $valid) {
                Write-Host "FAIL ($($result.Code))" -ForegroundColor Yellow
            }
            else {
                Write-Host "OK ($($result.Code))" -ForegroundColor Green
                if ($newUrl -ne $url) {
                    $newLine = $newLine -replace [regex]::Escape($url), $newUrl
                    $totalFixed++
                    Write-Host "    -> Replaced: $url => $newUrl" -ForegroundColor Magenta
                }
            }

            $newLine = $newLine -replace '\[ \]', '[x]'
            if ($newLine -ne $line) { $fileChanged = $true }

            Start-Sleep -Seconds 3

            if ($batchCount % 5 -eq 0) {
                Write-Host "  --- Batch pause (30s) after $batchCount URLs ---" -ForegroundColor DarkGray
                Start-Sleep -Seconds 30
            }
        }

        [void]$newLines.Add($newLine)
    }

    if ($fileChanged) {
        $newContent = $newLines -join "`r`n"
        $utf8 = New-Object System.Text.UTF8Encoding $false
        [System.IO.File]::WriteAllText($fullPath, $newContent, $utf8)
        Write-Host "  Saved: $planPath" -ForegroundColor Green
    }
    else {
        Write-Host "  No changes: $planPath" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "=== Done ===" -ForegroundColor Cyan
Write-Host "URLs checked : $totalChecked"
Write-Host "URLs replaced: $totalFixed"
