import {NextRequest, NextResponse} from "next/server";
import axios from "axios";

export async function GET(request:NextRequest) {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get("address")

    try {
        const response = await axios.get(`https://apis.map.qq.com/ws/geocoder/v1?address=${address}&key=${process.env.TENCENT_GEOCODER_KEY}`)
        const data = response.data;

        console.log(data);
        return NextResponse.json({
            code: 0,
            data: data
        })
    } catch (e) {
        console.error(e)

        return NextResponse.json({
            code: -1,
            message: "服务器错误"
        })
    }
}