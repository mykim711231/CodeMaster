# Register-ScheduledTask.ps1
# This script registers a Windows Task Scheduler job that runs verify-plan-urls.ps1
# daily at 00:00 (midnight). Run this script once with Administrator rights.

$taskName   = 'VerifyPlanUrls'
$scriptPath = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) 'docs\verify-plan-urls.ps1'

$action  = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$scriptPath`""
$trigger = New-ScheduledTaskTrigger -Daily -At 00:00
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Limited

if (Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue) {
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
}

Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Principal $principal -Description 'Daily verification of documentation URLs for CodeMaster project.'
Write-Host "✅ Task '$taskName' registered – runs every day at 00:00."