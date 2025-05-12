#!/bin/bash
# MCP服务器启动脚本

echo "欢迎使用MCP服务器示例"
echo "==================================="

# 检查Node.js环境
if ! command -v node &> /dev/null; then
    echo "错误: 未找到Node.js，请先安装Node.js"
    exit 1
fi

echo "已找到Node.js: "
node --version

# 检查npm
if ! command -v npm &> /dev/null; then
    echo "错误: 未找到npm，请先安装npm"
    exit 1
fi

echo "已找到npm:"
npm --version

echo
echo "安装依赖..."
npm install

echo
echo "编译TypeScript..."
npx tsc

echo
echo "启动MCP服务器..."
echo "按Ctrl+C停止服务器"
echo "==================================="
npm run start