import { MCPServer, ServerPlugin } from '@microsoft/mcp';
import express from 'express';
import path from 'path';
import AdvancedMcpPlugin from './plugins/advancedPlugin';
import ContentProcessorPlugin from './plugins/contentProcessorPlugin';
import { globalContextManager } from './utils/contextManager';

// 创建一个简单的插件
class SimplePlugin implements ServerPlugin {
  name = 'simple-plugin';
  
  async generateResponse(context: any) {
    // 在这里处理生成响应的逻辑
    console.log('收到请求，上下文：', context);
    
    // 简单的返回示例
    return {
      response: `这是MCP服务器的响应。收到的上下文长度：${JSON.stringify(context).length}字符`,
      metadata: {
        processingTime: Date.now(),
        source: 'simple-mcp-server'
      }
    };
  }
}

async function main() {
  // 创建Express应用
  const app = express();
  app.use(express.json());
  
  // 创建MCP服务器，同时使用多个插件
  const mcpServer = new MCPServer({
    plugins: [
      new SimplePlugin(),
      new AdvancedMcpPlugin({
        temperature: 0.8,
        maxTokens: 1500
      }),
      new ContentProcessorPlugin({
        defaultModel: 'advanced-model',
        maxOutputLength: 2000
      })
    ]
  });
  
  // 注册MCP路由
  app.use('/api/mcp', mcpServer.requestHandler);
  
  // 添加API查询当前活跃会话数的端点
  app.get('/api/stats', (req: express.Request, res: express.Response) => {
    res.json({
      activeSessions: globalContextManager.getActiveContextCount(),
      serverStatus: 'healthy',
      timestamp: new Date().toISOString()
    });
  });
  
  // 添加一个清理过期上下文的端点
  app.post('/api/maintenance/cleanup', (req: express.Request, res: express.Response) => {
    const cleanedCount = globalContextManager.cleanExpiredContexts();
    res.json({
      success: true,
      cleanedSessions: cleanedCount,
      timestamp: new Date().toISOString()
    });
  });
  
  // 简单的主页
  app.get('/', (req: express.Request, res: express.Response) => {
    res.send(`
      <html>
        <head>
          <title>MCP服务器</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            h1 { color: #333; }
            .container { max-width: 800px; margin: 0 auto; }
            .endpoint { background: #f4f4f4; padding: 10px; border-radius: 4px; margin: 10px 0; }
            code { background: #e0e0e0; padding: 2px 4px; border-radius: 3px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>MCP服务器正在运行</h1>
            <p>这是一个使用Model Context Protocol (MCP)的示例服务器。</p>
            
            <h2>可用端点:</h2>
            <div class="endpoint">
              <strong>MCP API:</strong> <code>/api/mcp</code> (POST)
            </div>
            <div class="endpoint">
              <strong>服务器状态:</strong> <code>/api/stats</code> (GET)
            </div>
            <div class="endpoint">
              <strong>清理会话:</strong> <code>/api/maintenance/cleanup</code> (POST)
            </div>
            
            <h2>测试示例:</h2>
            <p>使用以下curl命令测试服务器:</p>
            <pre>curl -X POST http://localhost:3000/api/mcp \\
  -H "Content-Type: application/json" \\
  -d '{"query": "生成一个Python示例代码", "sessionId": "test-session"}'</pre>
          </div>
        </body>
      </html>
    `);
  });
  
  // 启动服务器
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`MCP服务器已启动，监听端口：${PORT}`);
    console.log(`访问 http://localhost:${PORT} 查看服务器状态`);
    console.log(`API端点：http://localhost:${PORT}/api/mcp`);
  });
}

main().catch(err => {
  console.error('服务器启动失败:', err);
  process.exit(1);
});