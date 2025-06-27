import React from "react";
import GrowthTimeline from '@/components/GrowthTimeline';
import CommentSection from '@/components/CommentSection';
import HerbAIQA from './HerbAIQA';
import { herbDetails, HerbDetail as HerbDetailType } from '@/mock/herbData';

export default function HerbDetail({ herbId }: { herbId: string }) {
  const detail: HerbDetailType | undefined = herbDetails.find(h => h.name === herbId);
  if (!detail) {
    return <div className="p-12 text-center text-red-500">未找到该药材信息</div>;
  }
  return (
    <div className="flex flex-row gap-8 px-8 py-6 bg-[#f8f8f5] min-h-screen">
      {/* 左侧主内容区 */}
      <section className="flex-1 bg-white rounded-2xl shadow p-8">
        {/* 标题与图片 */}
        <div className="flex flex-row gap-8 items-start mb-6">
          <img src={detail.img} className="w-40 aspect-square rounded-2xl border border-[#e0e0d0]" alt={detail.name} />
          <div>
            <h1 className="text-2xl font-bold mb-2 text-[#355C3A]">{detail.name}</h1>
            <ul className="text-base text-gray-700 leading-7">
              <li><b>学名</b>：{detail.scientificName}</li>
              <li><b>产地代表</b>：{detail.origin}</li>
              <li><b>功效</b>：{detail.effect}</li>
              <li><b>用途</b>：{detail.usage}</li>
              <li><b>特点</b>：{detail.feature}</li>
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
        {/* 用户评论区 */}
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
            {herbDetails.filter(h => h.name !== herbId).slice(0, 3).map(h => (
              <li key={h.name}><a href={`/herb?id=${encodeURIComponent(h.name)}`} className="hover:underline text-[#5B8FF9]">{h.name}</a></li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-base font-semibold text-[#355C3A] mb-2">🤖 AI 问答</h3>
          <HerbAIQA herbName={detail.name} />
        </div>
      </aside>
    </div>
  );
} 