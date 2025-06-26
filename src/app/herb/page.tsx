// 展示某个中草药的生长追溯
"use client"
import {useSearchParams} from "next/navigation";

import GrowthTimeline from '@/components/GrowthTimeline';
import CommentSection from '@/components/CommentSection';

export default function HerbPage() {
    const searchParam = useSearchParams();
    const herbId = searchParam.get('id') || '未知中药';
    return (
        <div className="flex flex-row gap-8 px-8 py-6 bg-[#f8f8f5] min-h-screen">
            {/* 左侧主内容区 */}
            <section className="flex-1 bg-white rounded-2xl shadow p-8">
                {/* 标题与图片 */}
                <div className="flex flex-row gap-8 items-start mb-6">
                    <img src='/images/黄连.jpg' className="w-40 aspect-square rounded-2xl border border-[#e0e0d0]" alt={'Herb'} />
                    <div>
                        <h1 className="text-2xl font-bold mb-2 text-[#355C3A]">{herbId}</h1>
                        <ul className="text-base text-gray-700 leading-7">
                            <li><b>学名</b>：Coptis chinensis</li>
                            <li><b>产地代表</b>：重庆石柱土家族自治县（中国黄连之乡）</li>
                            <li><b>功效</b>：清热燥湿、泻火解毒</li>
                            <li><b>用途</b>：治疗湿热腹泻、心烦口渴、目赤肿痛等症</li>
                            <li><b>特点</b>：重庆最著名的道地药材之一</li>
                        </ul>
                    </div>
                </div>
                {/* 溯源生长 */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-[#8C6B2F] mb-2">🌱 植物生长周期溯源</h2>
                    <GrowthTimeline />
                </div>
                {/* 相关链接区 */}
                <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a href="/course-resource" className="block p-4 rounded-lg border border-[#e0e0d0] bg-[#f9f6ef] hover:bg-[#f3e9d2] transition"><b>相关课程资料</b></a>
                    <a href="/research" className="block p-4 rounded-lg border border-[#e0e0d0] bg-[#f9f6ef] hover:bg-[#f3e9d2] transition"><b>相关课题研究</b></a>
                    <a href="/training" className="block p-4 rounded-lg border border-[#e0e0d0] bg-[#f9f6ef] hover:bg-[#f3e9d2] transition"><b>制作教程</b></a>
                </div>
                {/* 用户评论区（预留） */}
                <div className="mt-8">
                    <h2 className="text-lg font-semibold text-[#8C6B2F] mb-2">💬 用户评论区</h2>
                    <CommentSection />
                </div>
            </section>
            {/* 右侧侧边栏 */}
            <aside className="w-72 flex-shrink-0">
                <div className="bg-white rounded-2xl shadow p-6 mb-6">
                    <h3 className="text-base font-semibold text-[#355C3A] mb-2">🔗 相似药材词条</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                        <li><a href="/herb?id=三七" className="hover:underline text-[#5B8FF9]">三七</a></li>
                        <li><a href="/herb?id=黄芩" className="hover:underline text-[#5B8FF9]">黄芩</a></li>
                        <li><a href="/herb?id=黄柏" className="hover:underline text-[#5B8FF9]">黄柏</a></li>
                    </ul>
                </div>
                <div className="bg-white rounded-2xl shadow p-6">
                    <h3 className="text-base font-semibold text-[#355C3A] mb-2">🤖 AI 问答</h3>
                    <div className="text-gray-400">（AI 问答功能开发中...）</div>
                </div>
            </aside>
        </div>
    )
}