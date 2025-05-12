/**
 * 模型定义文件
 * 
 * 这个文件定义了MCP服务器可以使用的模型配置
 */

export interface ModelConfig {
  id: string;
  name: string;
  version: string;
  description?: string;
  capabilities: string[];
  maxTokens: number;
  temperature: number;
  contextWindow: number;
}

// 定义一些示例模型
export const modelDefinitions: ModelConfig[] = [
  {
    id: 'basic-model',
    name: '基础模型',
    version: '1.0',
    description: '一个简单的基础模型，适合一般性任务',
    capabilities: ['text-generation', 'summarization'],
    maxTokens: 2000,
    temperature: 0.7,
    contextWindow: 4000
  },
  {
    id: 'advanced-model',
    name: '高级模型',
    version: '2.0',
    description: '一个更强大的模型，支持代码生成和复杂推理',
    capabilities: ['text-generation', 'code-generation', 'reasoning'],
    maxTokens: 8000,
    temperature: 0.5,
    contextWindow: 16000
  },
  {
    id: 'specialized-model',
    name: '专业模型',
    version: '1.5',
    description: '为特定领域优化的模型',
    capabilities: ['domain-specific-generation', 'classification'],
    maxTokens: 4000,
    temperature: 0.3,
    contextWindow: 8000
  }
];

// 根据ID获取模型配置
export function getModelById(id: string): ModelConfig | undefined {
  return modelDefinitions.find(model => model.id === id);
}

// 根据能力筛选模型
export function getModelsByCapability(capability: string): ModelConfig[] {
  return modelDefinitions.filter(model => 
    model.capabilities.includes(capability)
  );
}

export default modelDefinitions;