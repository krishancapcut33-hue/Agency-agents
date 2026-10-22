@echo off
cd /d %~dp0
set N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true
set N8N_API_KEY=claude-n8n-secret-key
npx n8n start
pause
