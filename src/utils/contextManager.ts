/**
 * MCP上下文处理器
 * 
 * 这个模块处理MCP请求中的上下文管理
 */

export interface McpContext {
  query: string;
  requestId?: string;
  userId?: string;
  sessionId?: string;
  language?: string;
  contextItems?: ContextItem[];
  metadata?: Record<string, any>;
}

export interface ContextItem {
  id: string;
  type: string;
  content: any;
  timestamp?: number;
}

export class ContextManager {
  private contextStore: Map<string, McpContext> = new Map();
  
  /**
   * 保存上下文
   */
  saveContext(sessionId: string, context: McpContext): void {
    // 确保上下文有时间戳
    context.metadata = context.metadata || {};
    context.metadata.lastUpdated = Date.now();
    
    this.contextStore.set(sessionId, context);
    console.log(`已保存会话 ${sessionId} 的上下文`);
  }
  
  /**
   * 获取上下文
   */
  getContext(sessionId: string): McpContext | undefined {
    return this.contextStore.get(sessionId);
  }
  
  /**
   * 更新现有上下文
   */
  updateContext(sessionId: string, partialContext: Partial<McpContext>): McpContext | undefined {
    const existingContext = this.contextStore.get(sessionId);
    if (!existingContext) {
      console.warn(`未找到会话 ${sessionId} 的上下文`);
      return undefined;
    }
    
    // 合并上下文
    const updatedContext = {
      ...existingContext,
      ...partialContext,
      metadata: {
        ...existingContext.metadata,
        ...partialContext.metadata,
        lastUpdated: Date.now()
      }
    };
    
    this.contextStore.set(sessionId, updatedContext);
    console.log(`已更新会话 ${sessionId} 的上下文`);
    return updatedContext;
  }
  
  /**
   * 向上下文添加一个上下文项
   */
  addContextItem(sessionId: string, item: ContextItem): McpContext | undefined {
    const context = this.contextStore.get(sessionId);
    if (!context) {
      console.warn(`未找到会话 ${sessionId} 的上下文`);
      return undefined;
    }
    
    // 确保有contextItems数组
    context.contextItems = context.contextItems || [];
    
    // 添加时间戳
    item.timestamp = item.timestamp || Date.now();
    
    // 添加新项目
    context.contextItems.push(item);
    
    // 更新上下文
    this.contextStore.set(sessionId, context);
    console.log(`已向会话 ${sessionId} 添加新的上下文项`);
    return context;
  }
  
  /**
   * 删除上下文
   */
  removeContext(sessionId: string): boolean {
    const existed = this.contextStore.has(sessionId);
    this.contextStore.delete(sessionId);
    
    if (existed) {
      console.log(`已删除会话 ${sessionId} 的上下文`);
    }
    
    return existed;
  }
  
  /**
   * 清理过期上下文（超过一小时未更新的上下文）
   */
  cleanExpiredContexts(maxAgeMs: number = 3600000): number {
    const now = Date.now();
    let cleanedCount = 0;
    
    for (const [sessionId, context] of this.contextStore.entries()) {
      const lastUpdated = context.metadata?.lastUpdated || 0;
      
      if (now - lastUpdated > maxAgeMs) {
        this.contextStore.delete(sessionId);
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      console.log(`已清理 ${cleanedCount} 个过期上下文`);
    }
    
    return cleanedCount;
  }
  
  /**
   * 获取活跃上下文数量
   */
  getActiveContextCount(): number {
    return this.contextStore.size;
  }
}

// 创建一个全局上下文管理器实例
export const globalContextManager = new ContextManager();

export default ContextManager;