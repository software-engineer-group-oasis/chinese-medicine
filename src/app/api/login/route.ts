// 模拟登录接口
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // 示例响应数据
        const data = {
            message: 'POST request received successfully!',
            payload: body,
        };

        return NextResponse.json({...data, success: true}, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to process the request' },
            { status: 500 }
        );
    }
}