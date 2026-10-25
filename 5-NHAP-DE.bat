@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Nhap de tu thu muc NHAP-DE vao kho de co san...
node tools\import-bank.mjs NHAP-DE
node tools\check-bank.mjs | findstr /C:"Tong" /C:"LOI" /C:"Tổng"
echo.
echo De moi se co trong app sau khi chay 3-PHAT-HANH-BAN-THU.bat.
pause
