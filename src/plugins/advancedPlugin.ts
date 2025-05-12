import { ServerPlugin } from '@microsoft/mcp';

/**
 * 高级MCP插件示例
 * 展示了如何创建一个更复杂的MCP插件
 */
export class AdvancedMcpPlugin implements ServerPlugin {
  name = 'advanced-plugin';
  
  // 插件配置
  private config = {
    temperature: 0.7,
    maxTokens: 2000,
    supportedLanguages: ['zh', 'en']
  };
  
  constructor(config?: any) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }
  
  /**
   * 初始化插件
   */
  async initialize() {
    console.log(`[${this.name}] 插件已初始化，配置:`, this.config);
    return true;
  }
  
  /**
   * 请求预处理
   * 在生成响应前对请求进行预处理
   */
  async preprocessRequest(context: any) {
    console.log(`[${this.name}] 预处理请求`);
    
    // 检查请求语言并设置默认值
    if (!context.language) {
      context.language = 'zh';
    }
    
    // 记录请求时间
    context.metadata = context.metadata || {};
    context.metadata.requestTime = new Date().toISOString();
    
    return context;
  }
  
  /**
   * 生成响应
   * 这是主要的处理函数
   */
  async generateResponse(context: any) {
    console.log(`[${this.name}] 生成响应`);
    
    // 简单的响应生成逻辑
    const query = context.query || '';
    let response = '';
    
    // 根据查询内容生成响应
    if (query.includes('帮助') || query.includes('help')) {
      response = '这是一个MCP服务器的帮助信息。您可以发送各种请求来测试系统。';
    } else if (query.includes('状态') || query.includes('status')) {
      response = '系统状态正常，所有服务运行中。';
    } else {
      response = `收到您的请求: "${query}"。这是一个基于MCP的响应。`;
    }
    
    // 添加一些元数据
    const metadata = {
      processingTime: Date.now(),
      modelInfo: 'advanced-mcp-model',
      temperature: this.config.temperature,
      tokenCount: response.length / 4, // 简单估算
      language: context.language
    };
    
    return {
      response,
      metadata
    };
  }
  
  /**
   * 响应后处理
   * 在发送响应前对其进行处理
   */
  async postprocessResponse(response: any, context: any) {
    console.log(`[${this.name}] 后处理响应`);
    
    // 添加响应时间
    response.metadata = response.metadata || {};
    response.metadata.responseTime = new Date().toISOString();
    
    // 如果上下文包含格式要求，可以进行格式转换
    if (context.format === 'html') {
      response.response = `<div class="mcp-response">${response.response}</div>`;
    }
    
    return response;
  }
}

export default AdvancedMcpPlugin;