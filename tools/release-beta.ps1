# Buoc 3: phat hanh BAN THU NGHIEM len GitHub.
# Chi may bat "Nhan ban thu nghiem" (dien thoai bo me) tu cap nhat. May cac con chua nhan.
. "$PSScriptRoot\common.ps1"
$cur = Get-PkgVersion
Write-Host "Phien ban hien tai: $cur"
$new = (Read-Host 'Nhap phien ban moi (vi du 1.0.1)').Trim()
if ($new -notmatch '^\d+\.\d+\.\d+$') { Fail 'Phien ban phai co dang so.so.so, vi du 1.0.1' }
if ((Get-VersionCode $new) -le (Get-VersionCode $cur)) { Fail "Phien ban moi phai lon hon $cur" }
$notes = Read-Host 'Ghi chu thay doi (hien tren GitHub)'

Step 'Kiem tra code truoc khi phat hanh'
& npx tsc --noEmit
if ($LASTEXITCODE -ne 0) { Fail 'Code con loi, chua phat hanh.' }
& npm run build
if ($LASTEXITCODE -ne 0) { Fail 'Build bi loi, chua phat hanh.' }

Step "Gan phien ban $new va day len GitHub"
& npm pkg set "version=$new"
$rel = Get-Content 'release.json' -Raw | ConvertFrom-Json
$rel.notes = $notes
($rel | ConvertTo-Json) | Out-File -Encoding utf8 'release.json'
& git add -A
& git commit -q -m "Phat hanh thu v$new" -m "$notes"
& git tag "v$new"
& git push -q origin HEAD --tags
if ($LASTEXITCODE -ne 0) { Fail 'Day len GitHub bi loi.' }

Write-Host ""
Write-Host "XONG: GitHub dang build ban thu $new (khoang 5-8 phut)." -ForegroundColor Green
Write-Host "Theo doi: https://github.com/$Repo/actions"
Write-Host "Build xong, mo app tren dien thoai bo me (da bat 'Nhan ban thu nghiem') de thu."
Write-Host "Thu on thi chay 4-DUYET-PHAT-HANH.bat de gui cho may cac con."
Read-Host "Bam Enter de dong"
