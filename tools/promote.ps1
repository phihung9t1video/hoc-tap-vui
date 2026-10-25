# Buoc 4: duyet ban thu nghiem thanh ban CHINH THUC -> may cac con tu cap nhat.
. "$PSScriptRoot\common.ps1"
Step 'Cac ban phat hanh gan day'
& gh release list -R $Repo --limit 6
$v = (Read-Host 'Nhap phien ban da thu on can duyet (vi du 1.0.1)').Trim().TrimStart('v')
if ($v -notmatch '^\d+\.\d+\.\d+$') { Fail 'Phien ban khong hop le.' }
$ok = Read-Host "Go CO de gui ban $v cho TAT CA may cac con"
if ($ok -ne 'CO') { Write-Host 'Da huy, chua gui ban nao.'; Read-Host 'Bam Enter de dong'; exit 0 }
& gh release edit "v$v" -R $Repo --prerelease=false --latest
if ($LASTEXITCODE -ne 0) { Fail 'Khong duyet duoc (kiem tra phien ban co dung khong).' }
# Cap nhat luon ban web cho iPhone, iPad (chi khi ma nguon tren may dung la ban vua duyet)
if ((Get-PkgVersion) -eq $v) {
  & (Join-Path $PSScriptRoot 'publish-web.ps1') -NoPause
} else {
  Write-Host "Ban web (iPhone, iPad) giu nguyen: ma nguon tren may dang la $(Get-PkgVersion), khac ban $v." -ForegroundColor Yellow
}
Write-Host ""
Write-Host "XONG: ban $v da la ban chinh thuc. May cac con se tu cap nhat khi mo app co mang." -ForegroundColor Green
Write-Host "Ban web cho iPhone, iPad: https://phihung9t1video.github.io/hoc-tap-vui/" -ForegroundColor Green
Read-Host "Bam Enter de dong"
