// 展示某个中草药的生长追溯
"use client"
import {useSearchParams} from "next/navigation";

export default function HerbPage() {
    const searchParam = useSearchParams();
    console.log(searchParam.get('id') || 'no id')
    return (
        <div className="p-4">
            <header>
                <h1>
                    {searchParam.get('id')}
                </h1>
            </header>
            <main>
                <article>
                    <div>
                        <img src='/images/黄连.jpg' className="w-40 aspect-square rounded-2xl" alt={'Herb'}/>
                    </div>
                    <div>
                        <ul>
                            <li>学名 ：Coptis chinensis</li>
                            <li>产地代表 ：重庆石柱土家族自治县（中国黄连之乡）</li>
                            <li>功效 ：清热燥湿、泻火解毒</li>
                            <li> 用途 ：治疗湿热腹泻、心烦口渴、目赤肿痛等症</li>
                            <li>特点 ：重庆最著名的道地药材之一</li>
                        </ul>
                    </div>
                </article>
            </main>

        </div>
    )
}