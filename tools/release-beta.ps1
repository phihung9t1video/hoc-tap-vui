# Buoc 3: build APK + ban cap nhat giao dien NGAY TREN MAY NAY, roi tai len GitHub Releases
# o dang BAN THU NGHIEM. Chi may bat "Nhan ban thu nghiem" (dien thoai bo me) tu cap nhat.
# Co the chay khong hoi: release-beta.ps1 -Version 1.0.1 -Notes "..."
param([string]$Version, [string]$Notes, [switch]$NoPause)
. "$PSScriptRoot\common.ps1"
if ($NoPause) { function Fail([string]$msg) { Write-Host "LOI: $msg" -ForegroundColor Red; exit 1 } }

$cur = Get-PkgVersion
$first = -not (& gh release list -R $Repo --limit 1)
Write-Host "Phien ban hien tai: $cur"
$new = if ($Version) { $Version } else { (Read-Host 'Nhap phien ban moi (vi du 1.0.1)').Trim() }
if ($new -notmatch '^\d+\.\d+\.\d+$') { Fail 'Phien ban phai co dang so.so.so, vi du 1.0.1' }
if ((Get-VersionCode $new) -lt (Get-VersionCode $cur) -or ((Get-VersionCode $new) -eq (Get-VersionCode $cur) -and -not $first)) { Fail "Phien ban moi phai lon hon $cur" }
$notes = if ($Notes) { $Notes } else { Read-Host 'Ghi chu thay doi (hien tren GitHub)' }

$jdk = Get-ChildItem (Join-Path $env:USERPROFILE '.jdks') -Directory -Filter 'temurin-21*' -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $jdk) { Fail 'Khong tim thay JDK 21 trong thu muc .jdks.' }
$env:JAVA_HOME = $jdk.FullName
$keyTxt = Join-Path $Root 'android-keys\MAT-KHAU-KHOA-KY.txt'
if (-not (Test-Path $keyTxt)) { Fail 'Khong thay khoa ky APK trong thu muc android-keys.' }

Step 'Kiem tra code'
& npx tsc --noEmit
if ($LASTEXITCODE -ne 0) { Fail 'Code con loi, chua phat hanh.' }

Step "Build giao dien $new"
Remove-Item Env:NEXT_PUBLIC_DISABLE_UPDATES -ErrorAction SilentlyContinue
$env:NEXT_PUBLIC_APP_VERSION = $new
$env:NEXT_PUBLIC_GITHUB_REPO = $Repo
& npm run build
if ($LASTEXITCODE -ne 0) { Fail 'Build giao dien bi loi.' }

$dist = Join-Path $Root 'dist'
if (Test-Path $dist) { Remove-Item $dist -Recurse -Force }
New-Item -ItemType Directory $dist | Out-Null
$webZip = "web-$new.zip"
New-WebZip (Join-Path $Root 'out') (Join-Path $dist $webZip)

Step "Build APK $new"
& npx cap sync android
if ($LASTEXITCODE -ne 0) { Fail 'Dong bo sang Android bi loi.' }
$pw = ((Get-Content $keyTxt | Select-String 'Mat khau').ToString() -split ':', 2)[1].Trim()
$env:KEYSTORE_FILE = Join-Path $Root 'android-keys\hoctapvui.jks'
$env:KEYSTORE_PASSWORD = $pw
$env:KEY_PASSWORD = $pw
$env:KEY_ALIAS = 'hoctapvui'
$code = Get-VersionCode $new
$env:APP_VERSION_CODE = $code
$env:APP_VERSION_NAME = $new
if (-not (Test-Path 'android\local.properties')) { "sdk.dir=$($Sdk -replace '\\','/')" | Out-File -Encoding ascii 'android\local.properties' }
Push-Location android
& .\gradlew.bat assembleRelease --no-daemon -q
$ok = $LASTEXITCODE -eq 0
Pop-Location
if (-not $ok) { Fail 'Build APK bi loi.' }
Copy-Item 'android\app\build\outputs\apk\release\app-release.apk' (Join-Path $dist 'hoc-tap-vui.apk')

$rel = Get-Content 'release.json' -Raw | ConvertFrom-Json
@{ version = $new; versionCode = $code; minNativeCode = [int]$rel.minNativeCode; web = $webZip; apk = 'hoc-tap-vui.apk' } |
  ConvertTo-Json | Out-File -Encoding ascii (Join-Path $dist 'version.json')

Step "Luu phien ban $new len GitHub"
& npm pkg set "version=$new"
$rel.notes = $notes
[IO.File]::WriteAllText((Join-Path $Root 'release.json'), ($rel | ConvertTo-Json), (New-Object Text.UTF8Encoding $false))
& git add -A
& git commit -q -m "Phat hanh thu v$new" -m "$notes"
& git tag "v$new"
& git push -q origin HEAD --tags
if ($LASTEXITCODE -ne 0) { Fail 'Day code len GitHub bi loi.' }

$notesFile = Join-Path $dist 'notes.txt'
[IO.File]::WriteAllText($notesFile, $notes, (New-Object Text.UTF8Encoding $false))
& gh release create "v$new" -R $Repo --prerelease --title "Hoc Tap Vui $new" --notes-file $notesFile `
  (Join-Path $dist 'hoc-tap-vui.apk') (Join-Path $dist $webZip) (Join-Path $dist 'version.json')
if ($LASTEXITCODE -ne 0) { Fail 'Tai ban phat hanh len GitHub bi loi.' }

Write-Host ""
Write-Host "XONG: da phat hanh BAN THU NGHIEM $new." -ForegroundColor Green
Write-Host "Xem tai: https://github.com/$Repo/releases/tag/v$new"
Write-Host "Mo app tren dien thoai bo me (da bat 'Nhan ban thu nghiem') de thu."
Write-Host "Thu on thi chay 4-DUYET-PHAT-HANH.bat de gui cho may cac con."
if (-not $NoPause) { Read-Host "Bam Enter de dong" }
