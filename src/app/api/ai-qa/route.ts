import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import WebSocket from 'ws';
import CryptoJS from 'crypto-js';

// 讯飞星火X1大模型API配置（从环境变量读取）
const APPID = process.env.XUNFEI_APPID;
const API_KEY = process.env.XUNFEI_API_KEY;
const API_SECRET = process.env.XUNFEI_API_SECRET;
const HOST = process.env.XUNFEI_HOST;
const PATH = process.env.XUNFEI_PATH;
const BASE_URL = `wss://${HOST}${PATH}`;

// 生成RFC1123格式时间字符串
function toGMTString(date: Date) {
  const week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return `${week[date.getUTCDay()]}, ${date.getUTCDate().toString().padStart(2, '0')} ${date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })} ${date.getUTCFullYear()} ${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}:${date.getUTCSeconds().toString().padStart(2, '0')} GMT`;
}

// 生成鉴权URL
function getAuthUrl() {
  const date = toGMTString(new Date());
  const signatureOrigin = `host: ${HOST}\ndate: ${date}\nGET ${PATH} HTTP/1.1`;
  const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, API_SECRET);
  const signature = CryptoJS.enc.Base64.stringify(signatureSha);
  const authorizationOrigin = `api_key=\"${API_KEY}\", algorithm=\"hmac-sha256\", headers=\"host date request-line\", signature=\"${signature}\"`;
  const authorization = Buffer.from(authorizationOrigin, 'utf-8').toString('base64');
  const url = `${BASE_URL}?authorization=${authorization}&date=${encodeURIComponent(date)}&host=${HOST}`;
  return url;
}

export async function POST(req: NextRequest) {
  try {
    const { herbName, question } = await req.json();
    if (!herbName || !question) {
      return NextResponse.json({ error: '参数缺失' }, { status: 400 });
    }

    return new Promise((resolve) => {
      const wsUrl = getAuthUrl();
      const ws = new WebSocket(wsUrl);
      let answer = '';
      let finished = false;
      let errorMsg = '';

      ws.on('open', () => {
        try {
          const payload = {
            header: {
              app_id: APPID,
              uid: uuidv4(),
            },
            payload: {
              message: {
                text: [
                  { role: 'user', content: `请用简明中文回答和中药「${herbName}」相关的问题：${question}` }
                ]
              }
            },
            parameter: {
              chat: {
                domain: 'x1',
                max_tokens: 1024,
                temperature: 0.7,
                top_k: 4
              }
            }
          };
          ws.send(JSON.stringify(payload));
        } catch (e) {
          console.error('ws open/send payload error', e);
        }
      });

      ws.on('message', (data) => {
        try {
          const res = JSON.parse(data.toString());
          if (res.header && res.header.code !== 0) {
            errorMsg = res.header.message || '讯飞API返回错误';
            finished = true;
            ws.close();
          }
          if (res.payload && res.payload.choices && res.payload.choices.text) {
            for (const item of res.payload.choices.text) {
              if (item.content) answer += item.content;
            }
          }
          if (res.header && res.header.status === 2) {
            finished = true;
            ws.close();
          }
        } catch (e) {
          console.error('解析讯飞返回数据失败', e);
          errorMsg = '解析讯飞返回数据失败';
          finished = true;
          ws.close();
        }
      });

      ws.on('close', () => {
        if (errorMsg) {
          console.error('WebSocket关闭，错误：', errorMsg);
          resolve(NextResponse.json({ error: errorMsg }, { status: 500 }));
        } else {
          resolve(NextResponse.json({ answer: answer || '未获取到AI回复' }));
        }
      });

      ws.on('error', (err) => {
        console.error('WebSocket连接失败', err);
        resolve(NextResponse.json({ error: 'WebSocket连接失败' }, { status: 500 }));
      });
    });
  } catch (err) {
    console.error('API全局异常', err);
    return NextResponse.json({ error: 'API全局异常' }, { status: 500 });
  }
} 