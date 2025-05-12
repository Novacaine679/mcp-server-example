import fetch from 'node-fetch';

// 生成一个随机会话ID
const generateSessionId = () => `session-${Math.floor(Math.random() * 1000)}`;

// 基础测试 - 简单查询
async function testBasicQuery() {
  try {
    const sessionId = generateSessionId();
    console.log(`✨ 执行基础查询测试 (会话ID: ${sessionId})...`);
    
    const response = await fetch('http://localhost:3000/api/mcp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: '你好，这是一个测试请求',
        sessionId,
        language: 'zh',
        metadata: {
          clientVersion: '1.0.0',
          timestamp: Date.now()
        },
      }),
    });

    const result = await response.json();
    console.log('✅ 基础查询响应:', result);
    return result;
  } catch (error) {
    console.error('❌ 基础查询失败:', error);
    return null;
  }
}

// 代码生成测试
async function testCodeGeneration() {
  try {
    const sessionId = generateSessionId();
    console.log(`✨ 执行代码生成测试 (会话ID: ${sessionId})...`);
    
    const response = await fetch('http://localhost:3000/api/mcp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: '生成一个Python函数，用于计算斐波那契数列',
        sessionId,
        language: 'zh',
        metadata: {
          clientVersion: '1.0.0',
          timestamp: Date.now(),
          preferences: {
            language: 'python',
            style: 'functional'
          }
        },
      }),
    });

    const result = await response.json();
    console.log('✅ 代码生成响应:', result);
    return result;
  } catch (error) {
    console.error('❌ 代码生成测试失败:', error);
    return null;
  }
}

// 创意内容测试
async function testCreativeContent() {
  try {
    const sessionId = generateSessionId();
    console.log(`✨ 执行创意内容测试 (会话ID: ${sessionId})...`);
    
    const response = await fetch('http://localhost:3000/api/mcp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: '创作一个关于AI与人类合作的短篇故事',
        sessionId,
        language: 'zh',
        metadata: {
          clientVersion: '1.0.0',
          timestamp: Date.now(),
          preferences: {
            genre: 'science fiction',
            tone: 'optimistic'
          }
        },
      }),
    });

    const result = await response.json();
    console.log('✅ 创意内容响应:', result);
    return result;
  } catch (error) {
    console.error('❌ 创意内容测试失败:', error);
    return null;
  }
}

// 测试服务器状态API
async function testServerStats() {
  try {
    console.log('✨ 获取服务器状态...');
    
    const response = await fetch('http://localhost:3000/api/stats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const result = await response.json();
    console.log('✅ 服务器状态:', result);
    return result;
  } catch (error) {
    console.error('❌ 获取服务器状态失败:', error);
    return null;
  }
}

// 运行所有测试
async function runAllTests() {
  console.log('🚀 开始MCP服务器测试...');
  
  // 运行基础测试
  await testBasicQuery();
  console.log('\n-----------------------------------\n');
  
  // 运行代码生成测试
  await testCodeGeneration();
  console.log('\n-----------------------------------\n');
  
  // 运行创意内容测试
  await testCreativeContent();
  console.log('\n-----------------------------------\n');
  
  // 获取服务器状态
  await testServerStats();
  console.log('\n-----------------------------------\n');
  
  console.log('🎉 所有测试完成!');
}

// 运行测试套件
runAllTests();