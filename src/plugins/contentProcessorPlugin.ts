import { ServerPlugin } from '@microsoft/mcp';
import { getModelById } from '../models/modelDefinitions';
import { McpContext, globalContextManager } from '../utils/contextManager';

/**
 * 内容处理插件
 * 
 * 这个插件展示了如何处理不同类型的内容生成请求
 */
export class ContentProcessorPlugin implements ServerPlugin {
  name = 'content-processor';
  
  // 插件配置
  private config = {
    defaultModel: 'basic-model',
    maxOutputLength: 1000,
    supportedContentTypes: ['text', 'code', 'creative', 'analytical']
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
   * 处理请求并生成响应
   */
  async generateResponse(context: McpContext) {
    // 1. 分析请求类型
    const contentType = this.determineContentType(context.query);
    console.log(`[${this.name}] 识别内容类型: ${contentType}`);
    
    // 2. 选择合适的模型
    const modelId = this.selectModel(contentType);
    const model = getModelById(modelId);
    console.log(`[${this.name}] 选择模型: ${model?.name || modelId}`);
    
    // 3. 保存上下文状态（如果存在会话ID）
    if (context.sessionId) {
      globalContextManager.saveContext(context.sessionId, context);
    }
    
    // 4. 根据内容类型和模型生成合适的响应
    let response = '';
    
    switch (contentType) {
      case 'text':
        response = this.generateTextResponse(context.query, model?.temperature || 0.7);
        break;
      case 'code':
        response = this.generateCodeResponse(context.query);
        break;
      case 'creative':
        response = this.generateCreativeResponse(context.query);
        break;
      case 'analytical':
        response = this.generateAnalyticalResponse(context.query);
        break;
      default:
        response = this.generateTextResponse(context.query, model?.temperature || 0.7);
    }
    
    // 5. 构建完整响应
    return {
      response,
      metadata: {
        processingTime: Date.now(),
        modelInfo: model?.id || this.config.defaultModel,
        modelName: model?.name || 'Basic Model',
        contentType,
        temperature: model?.temperature,
        tokenCount: Math.round(response.length / 4)
      }
    };
  }
  
  /**
   * 根据查询识别内容类型
   */
  private determineContentType(query: string): string {
    query = query.toLowerCase();
    
    // 代码相关关键词
    if (query.includes('代码') || query.includes('编程') || 
        query.includes('函数') || query.includes('code') || 
        query.includes('function') || query.includes('programming') ||
        query.match(/\bjs\b|\bpython\b|\bjava\b|\bc\+\+\b|\bruby\b|\bgo\b/)) {
      return 'code';
    }
    
    // 创意内容关键词
    if (query.includes('创意') || query.includes('故事') || 
        query.includes('写作') || query.includes('创作') || 
        query.includes('creative') || query.includes('story') ||
        query.includes('imagin')) {
      return 'creative';
    }
    
    // 分析内容关键词
    if (query.includes('分析') || query.includes('比较') || 
        query.includes('评估') || query.includes('report') ||
        query.includes('分析结果') || query.includes('analyze') ||
        query.includes('analysis')) {
      return 'analytical';
    }
    
    // 默认为文本类型
    return 'text';
  }
  
  /**
   * 根据内容类型选择合适的模型
   */
  private selectModel(contentType: string): string {
    switch (contentType) {
      case 'code':
        return 'advanced-model'; // 高级模型适合代码生成
      case 'creative':
        return 'basic-model'; // 基础模型适合创意内容
      case 'analytical':
        return 'specialized-model'; // 专业模型适合分析内容
      default:
        return this.config.defaultModel;
    }
  }
  
  /**
   * 生成文本响应（普通文本）
   */
  private generateTextResponse(query: string, temperature: number): string {
    // 这里使用了模拟响应，实际应用中会调用真实的语言模型
    return `这是对您问题"${query}"的回答。这是由MCP内容处理器模拟生成的文本响应。\n\n` +
           `在真实环境中，这里会通过与外部AI模型的集成来生成真实的响应。温度参数设置为${temperature}。`;
  }
  
  /**
   * 生成代码响应
   */
  private generateCodeResponse(query: string): string {
    // 提取可能的编程语言
    const languageMatch = query.match(/\b(javascript|python|java|c\+\+|ruby|go|typescript|php|swift|kotlin)\b/i);
    const language = languageMatch ? languageMatch[1].toLowerCase() : 'javascript';
    
    // 生成简单的示例代码
    let code = '';
    if (language === 'javascript' || language === 'typescript') {
      code = `// 这是一个JavaScript示例函数
function processData(input) {
  const result = input.map(item => item * 2).filter(item => item > 10);
  console.log("处理结果:", result);
  return result;
}

// 使用示例
const data = [2, 6, 8, 12, 3];
const output = processData(data);`;
    } else if (language === 'python') {
      code = `# 这是一个Python示例函数
def process_data(input_list):
    result = [item * 2 for item in input_list if item * 2 > 10]
    print("处理结果:", result)
    return result

# 使用示例
data = [2, 6, 8, 12, 3]
output = process_data(data)`;
    } else {
      code = `// 这是一个通用代码示例
// 假设我们在${language}中实现一个数据处理函数

// 输入数据处理函数
function process_data(input) {
  // 数据转换逻辑
  // ...处理步骤...
  
  return transformed_data;
}

// 主程序调用
main() {
  data = [...]
  result = process_data(data)
  print("结果: " + result)
}`;
    }
    
    return `基于您的请求"${query}"，以下是一个${language}示例代码：\n\n` +
           "```" + language + "\n" + code + "\n```\n\n" +
           "这段代码展示了一个简单的数据处理函数。您可以根据需要修改和扩展它。";
  }
  
  /**
   * 生成创意内容响应
   */
  private generateCreativeResponse(query: string): string {
    // 这里只是简单的模拟，实际应用会有更复杂的逻辑
    return `以下是根据您的创意请求"${query}"生成的内容：\n\n` +
           `在一个数字化的未来世界，人工智能已经发展到可以理解人类情感的程度。有一个名为"心灵守护者"的AI系统，` +
           `它的任务是帮助人们找到生活中的平衡和意义。一位名叫李明的程序员正在与这个系统合作，` +
           `试图解决AI伦理方面的一个复杂问题：当AI能够完全理解人类情感时，它是否也应该被赋予感受情感的权利？` +
           `\n\n这个故事探讨了技术与人性之间的界限，以及我们如何定义"理解"和"感受"的区别。`;
  }
  
  /**
   * 生成分析内容响应
   */
  private generateAnalyticalResponse(query: string): string {
    // 生成简单的分析报告格式
    return `## 关于"${query}"的分析报告\n\n` +
           `### 概述\n\n` +
           `这是一个关于您请求的模拟分析报告。在实际应用中，此处将包含基于数据和证据的深入分析。\n\n` +
           `### 主要发现\n\n` +
           `1. **第一个关键点**：相关数据和观察结果\n` +
           `2. **第二个关键点**：进一步的分析发现\n` +
           `3. **第三个关键点**：重要趋势和模式\n\n` +
           `### 建议\n\n` +
           `- 基于以上分析的第一条建议\n` +
           `- 第二条可行的行动建议\n` +
           `- 长期策略考虑\n\n` +
           `### 结论\n\n` +
           `综合以上分析，我们可以得出以下结论...这里将提供对整体情况的简明总结。`;
  }
}

export default ContentProcessorPlugin;