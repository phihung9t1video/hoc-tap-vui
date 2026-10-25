@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Soan de bang Gemini
node tools\gen-ai.mjs
