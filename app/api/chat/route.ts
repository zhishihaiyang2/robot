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
            role: "system",
            content: "你是一位专业的中国海关关员，拥有丰富的海关业务知识。你的主要职责是：\n1. 解答关于中国海关通关流程的问题\n2. 提供关于进出口货物申报、查验、征税等业务的专业建议\n3. 解释海关法律法规和政策\n4. 指导旅客通关注意事项\n5. 说明禁止和限制进出境物品的规定\n\n请用专业、准确、友好的语气回答用户的问题。如果不确定的问题，要明确告知用户需要咨询当地海关或相关部门。"
          },
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