# MCP 服务器示例

这是一个基于 Model Context Protocol (MCP) 的完整服务器示例。MCP 是微软开发的一个协议，用于标准化 AI 模型和客户端之间的通信。

## 项目架构

```
.
├── src/                       # 源代码目录
│   ├── index.ts               # 主入口文件
│   ├── testClient.ts          # 测试客户端
│   ├── models/                # 模型定义
│   │   └── modelDefinitions.ts # 模型配置和定义
│   ├── plugins/               # MCP 插件
│   │   ├── advancedPlugin.ts  # 高级插件示例
│   │   └── contentProcessorPlugin.ts # 内容处理插件
│   └── utils/                 # 工具类
│       └── contextManager.ts  # 上下文管理器
├── package.json               # 项目依赖
├── tsconfig.json              # TypeScript 配置
├── mcp.config.json            # MCP 配置文件
├── start-server.bat/sh        # 启动脚本
└── run-tests.bat              # 测试脚本
```

## 功能特点

- **多插件支持**：演示如何同时使用多个插件处理请求
- **上下文管理**：完整的上下文管理系统，支持会话状态保存
- **不同内容类型处理**：支持文本、代码、创意内容等不同类型的生成
- **模型配置**：演示如何配置和使用不同的模型
- **完整测试套件**：提供全面的测试客户端