@echo off
REM MCP服务器测试脚本

echo 开始测试MCP服务器
echo ===================================

REM 检查Node.js环境
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo 错误: 未找到Node.js，请先安装Node.js
    exit /b 1
)

echo 已找到Node.js
echo 服务器应该已经在运行，若未运行请先启动服务器

echo.
echo 运行测试...
call npx ts-node src/testClient.ts
echo.
echo 测试完成