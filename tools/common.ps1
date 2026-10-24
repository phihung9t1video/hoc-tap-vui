# Dung chung cho cac script thu va phat hanh
$ErrorActionPreference = 'Stop'
$Root = Split-Path $PSScriptRoot
Set-Location $Root
$Sdk = Join-Path $env:LOCALAPPDATA 'Android\Sdk'
$Adb = Join-Path $Sdk 'platform-tools\adb.exe'
$Repo = 'phihung9t1video/hoc-tap-vui'

function Get-PkgVersion { (Get-Content (Join-Path $Root 'package.json') -Raw | ConvertFrom-Json).version }
function Get-VersionCode([string]$v) { $p = $v.Split('.') | ForEach-Object { [int]$_ }; $p[0] * 10000 + $p[1] * 100 + $p[2] }
# Nen thu muc thanh zip voi duong dan dung dau "/" (Android khong hieu dau "\" cua Windows)
function New-WebZip([string]$src, [string]$zipPath) {
  Add-Type -AssemblyName System.IO.Compression, System.IO.Compression.FileSystem
  $srcFull = (Resolve-Path $src).Path.TrimEnd('\') + '\'
  $zip = [IO.Compression.ZipFile]::Open($zipPath, [IO.Compression.ZipArchiveMode]::Create)
  try {
    Get-ChildItem $src -Recurse -File | ForEach-Object {
      $rel = $_.FullName.Substring($srcFull.Length).Replace('\', '/')
      [void][IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $rel)
    }
  } finally { $zip.Dispose() }
}
function Step([string]$msg) { Write-Host ""; Write-Host "==> $msg" -ForegroundColor Cyan }
function Fail([string]$msg) { Write-Host ""; Write-Host "LOI: $msg" -ForegroundColor Red; Read-Host "Bam Enter de dong"; exit 1 }
