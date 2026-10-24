# Buoc 1: thu nhanh tren trinh duyet. Sua code den dau, trang tu cap nhat den do.
. "$PSScriptRoot\common.ps1"
$env:NEXT_DIST_DIR = '.next-dev'
$env:NEXT_PUBLIC_DISABLE_UPDATES = '1'
Step 'Mo app thu tai http://localhost:3000 (dong cua so nay de tat)'
$opener = 'for($i=0;$i -lt 120;$i++){ if((curl.exe -s -o NUL -m 2 -w "%{http_code}" http://localhost:3000) -eq "200"){ Start-Process "http://localhost:3000"; break }; Start-Sleep 1 }'
Start-Process powershell -WindowStyle Hidden -ArgumentList '-NoProfile', '-Command', $opener
& npx next dev -p 3000
