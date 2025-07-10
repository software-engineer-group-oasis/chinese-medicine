// 上传文件到腾讯云COS
import COS from 'cos-nodejs-sdk-v5';
import { NextRequest } from 'next/server';
import { Readable } from 'stream';

// 将 ReadableStream 转换为 Node.js Stream
//@ts-ignore
function convertToNodeStream(readableStream) {
    return new Readable({
        read() {
            const reader = readableStream.getReader();
            const pushChunk = async () => {
                const result = await reader.read();
                if (result.done) {
                    this.push(null); // 结束流
                } else {
                    this.push(result.value); // 推送数据块
                    pushChunk(); // 继续读取下一个数据块
                }
            };
            pushChunk();
        },
    });
}

export async function POST(request: NextRequest) {
    try {
        // 1. 解析上传文件
        const contentType = request.headers.get('content-type') || '';

        // 检查内容类型是否为表单数据
        if (!contentType.includes('multipart/form-data')) {
            return new Response(
                JSON.stringify({ error: 'Invalid content type' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // 2. 初始化COS实例
        const cos = new COS({
            SecretId: process.env.COS_SECRET_ID,
            SecretKey: process.env.COS_SECRET_KEY,
        });

        // 3. 执行上传
        const formData = await request.formData();
        const file = formData.get('upload-file');

        if (!file) {
            return new Response(
                JSON.stringify({ error: 'No file uploaded' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // 将文件转换为可读流
        //@ts-ignore
        const buffer = Buffer.from(await file.arrayBuffer());
        const readableStream = new ReadableStream({
            start(controller) {
                controller.enqueue(buffer);
                controller.close();
            }
        });

        // 将ReadableStream转换为Node.js Stream
        const nodeStream = convertToNodeStream(readableStream);

        const result = await new Promise((resolve, reject) => {
            cos.putObject({
            //@ts-ignore
                Bucket: process.env.COS_BUCKET,
                //@ts-ignore
                Region: process.env.COS_REGION,
                //@ts-ignore
                Key: new Date().getTime() + '-' + file.name,
                Body: nodeStream, // 使用转换后的Node.js流
                StorageClass: 'STANDARD',
            }, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        console.log(result.Location)

        return new Response(
            JSON.stringify({
            //@ts-ignore
                url: `https://${result.Location}`,
                status: 'success'
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Upload failed:', error);
        return new Response(
            JSON.stringify({
                error: 'Upload failed',
                //@ts-ignore
                details: error.message
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
