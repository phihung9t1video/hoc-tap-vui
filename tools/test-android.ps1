# Buoc 2: build APK that, cai vao may ao Android (hoac dien thoai cam cap USB) de thu.
# Ban nay TAT tu cap nhat, nen ban tren GitHub khong de len code dang thu.
. "$PSScriptRoot\common.ps1"

$jdk = Get-ChildItem (Join-Path $env:USERPROFILE '.jdks') -Directory -Filter 'temurin-21*' -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $jdk) { Fail 'Khong tim thay JDK 21 trong thu muc .jdks (Android Studio: Settings > Build Tools > Gradle > Gradle JDK > Download JDK 21).' }
$env:JAVA_HOME = $jdk.FullName

Step 'Tim may Android (may ao hoac dien thoai cam cap)'
& $Adb start-server | Out-Null
$dev = (& $Adb devices) | Select-String "`tdevice$" | Select-Object -First 1
if (-not $dev) {
  $avd = (& (Join-Path $Sdk 'emulator\emulator.exe') -list-avds) | Select-Object -First 1
  if (-not $avd) { Fail 'Chua co may ao Android. Tao may ao trong Android Studio (Device Manager) hoac cam dien thoai co bat USB debugging.' }
  Write-Host "Dang bat may ao $avd ..."
  Start-Process (Join-Path $Sdk 'emulator\emulator.exe') -ArgumentList '-avd', $avd, '-no-snapshot-save', '-no-boot-anim'
  & $Adb wait-for-device
  for ($i = 0; $i -lt 120; $i++) { if (((& $Adb shell getprop sys.boot_completed) -join '').Trim() -eq '1') { break }; Start-Sleep 2 }
  $dev = (& $Adb devices) | Select-String "`tdevice$" | Select-Object -First 1
}
$serial = $dev.ToString().Split("`t")[0]
Write-Host "Dung may: $serial"
# Ve man hinh chinh de khong lan voi app khac dang mo tren may ao (vi du RIMS)
& $Adb -s $serial shell input keyevent KEYCODE_HOME 2>$null | Out-Null
Write-Host ""
Write-Host "DANG BUILD APP, MAT KHOANG 3-5 PHUT. Khi xong, app Hoc Tap Vui tu mo tren may ao." -ForegroundColor Yellow
Write-Host "Muon thu nhanh tren trinh duyet thi dung bieu tuong 'Hoc Tap Vui (thu)' tren Desktop." -ForegroundColor Yellow
Write-Host ""

$ver = Get-PkgVersion
Step "Build giao dien (ban thu $ver)"
$env:NEXT_PUBLIC_DISABLE_UPDATES = '1'
$env:NEXT_PUBLIC_APP_VERSION = "$ver-thu"
& npm run build
if ($LASTEXITCODE -ne 0) { Fail 'Build giao dien bi loi (xem thong bao o tren).' }
& npx cap sync android
if ($LASTEXITCODE -ne 0) { Fail 'Dong bo sang Android bi loi.' }

Step 'Build APK'
$keyTxt = Join-Path $Root 'android-keys\MAT-KHAU-KHOA-KY.txt'
if (-not (Test-Path $keyTxt)) { Fail 'Khong thay khoa ky APK trong thu muc android-keys.' }
$pw = ((Get-Content $keyTxt | Select-String 'Mat khau').ToString() -split ':', 2)[1].Trim()
$env:KEYSTORE_FILE = Join-Path $Root 'android-keys\hoctapvui.jks'
$env:KEYSTORE_PASSWORD = $pw
$env:KEY_PASSWORD = $pw
$env:KEY_ALIAS = 'hoctapvui'
$env:APP_VERSION_CODE = Get-VersionCode $ver
$env:APP_VERSION_NAME = "$ver-thu"
if (-not (Test-Path 'android\local.properties')) { "sdk.dir=$($Sdk -replace '\\','/')" | Out-File -Encoding ascii 'android\local.properties' }
Push-Location android
& .\gradlew.bat assembleRelease --no-daemon -q
$ok = $LASTEXITCODE -eq 0
Pop-Location
if (-not $ok) { Fail 'Build APK bi loi (xem thong bao o tren).' }

Step 'Cai va mo app'
& $Adb -s $serial install -r 'android\app\build\outputs\apk\release\app-release.apk'
if ($LASTEXITCODE -ne 0) { Fail 'Cai APK bi loi. Neu may dang co ban moi hon, go app cu tren may ao roi chay lai.' }
& $Adb -s $serial shell monkey -p io.github.phihung9t1video.hoctapvui -c android.intent.category.LAUNCHER 1 2>$null | Out-Null
Write-Host ""
Write-Host "XONG: app ban thu $ver da mo tren may $serial." -ForegroundColor Green
Write-Host "File APK: android\app\build\outputs\apk\release\app-release.apk (chep sang dien thoai de cai thu cung duoc)."
Read-Host "Bam Enter de dong"
