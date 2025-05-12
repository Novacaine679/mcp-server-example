@echo off
REM MCP服务器启动脚本

echo 欢迎使用MCP服务器示例
echo ===================================

REM 检查Node.js环境
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo 错误: 未找到Node.js，请先安装Node.js
    exit /b 1
)

echo 已找到Node.js: 
node --version

REM 检查npm
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo 错误: 未找到npm，请先安装npm
    exit /b 1
)

echo 已找到npm:
npm --version

echo.
echo 安装依赖...
call npm install

echo.
echo 编译TypeScript...
call npx tsc

echo.
echo 启动MCP服务器...
echo 按Ctrl+C停止服务器
echo ===================================
call npm run start