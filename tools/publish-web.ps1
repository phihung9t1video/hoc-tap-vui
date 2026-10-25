# Dua ban web (cho iPhone, iPad) len GitHub Pages: https://phihung9t1video.github.io/hoc-tap-vui/
# Build rieng voi duong dan con /hoc-tap-vui roi day len nhanh gh-pages (nhanh nay chi chua ban web da build).
param([switch]$NoPause)
. "$PSScriptRoot\common.ps1"

$ver = Get-PkgVersion
Step "Build ban web $ver"
$env:NEXT_PUBLIC_BASE_PATH = '/hoc-tap-vui'
$env:NEXT_DIST_DIR = '.next-web'
$env:NEXT_PUBLIC_APP_VERSION = $ver
$env:NEXT_PUBLIC_DISABLE_UPDATES = ''
& npm run build
$ok = $LASTEXITCODE -eq 0
Remove-Item Env:NEXT_PUBLIC_BASE_PATH, Env:NEXT_DIST_DIR -ErrorAction SilentlyContinue
if (-not $ok) { Fail 'Build ban web bi loi.' }

Step 'Day len GitHub Pages'
$tmp = Join-Path $env:TEMP "hoctapvui-pages"
if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force }
$built = Join-Path $Root '.next-web'
if (-not (Test-Path (Join-Path $built 'index.html'))) { Fail 'Khong thay ban web da build (.next-web/index.html).' }
# Xuat tinh voi distDir rieng: Next ghi ban web vao chinh thu muc .next-web, bo phan cache cua Next
New-Item $tmp -ItemType Directory | Out-Null
Get-ChildItem $built -Force | Where-Object { $_.Name -notin @('cache', 'server', 'types', 'diagnostics', 'trace', 'build') -and $_.Name -notlike '*.json' -or $_.Name -eq 'manifest.webmanifest' } | Copy-Item -Destination $tmp -Recurse
New-Item (Join-Path $tmp '.nojekyll') -ItemType File | Out-Null
$url = (& git -C $Root remote get-url origin).Trim()
Push-Location $tmp
& git init -q -b gh-pages
& git add -A
& git -c user.name=phihung9t1video -c user.email=phihung9t1@gmail.com commit -q -m "Ban web $ver"
& git push -q --force $url gh-pages
$ok = $LASTEXITCODE -eq 0
Pop-Location
Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
if (-not $ok) { Fail 'Khong day duoc len GitHub Pages.' }

Write-Host ""
Write-Host "XONG: ban web $ver se co tai https://phihung9t1video.github.io/hoc-tap-vui/ sau 1-2 phut." -ForegroundColor Green
if (-not $NoPause) { Read-Host "Bam Enter de dong" }
