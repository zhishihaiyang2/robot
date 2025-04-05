import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    const response = await fetch('https://api.siliconflow.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SILICONFLOW_API_KEY}`,
      },
      body: JSON.stringify({
        model: "Qwen/Qwen2.5-7B-Instruct", // 使用文档中推荐的模型
        messages: [
          {
            role: "user",
            content: message
          }
        ],
        stream: false
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API错误:', errorData);
      
      let errorMessage = `API请求失败: ${response.status} ${response.statusText}`;
      if (errorData.code) {
        switch (errorData.code) {
          case 20012:
            errorMessage = "模型不存在，请检查模型名称是否正确";
            break;
          case 401:
            errorMessage = "API密钥未正确设置";
            break;
          case 403:
            errorMessage = "权限不足，可能需要实名认证";
            break;
          case 429:
            errorMessage = "请求频率超限，请稍后再试";
            break;
          default:
            errorMessage = `API错误: ${errorData.message || errorMessage}`;
        }
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return NextResponse.json({ 
      reply: data.choices[0].message.content 
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '处理请求时发生错误' },
      { status: 500 }
    );
  }
} 