import React, { useEffect, useState, useMemo } from "react";
import GrowthTimeline from '@/components/GrowthTimeline';
import CommentSection from '@/components/CommentSection';
import HerbAIQA from './HerbAIQA';
import Herb3D from '@/components/3D-Herb';
import axiosInstance from '@/api/config';
import { HERB_API } from '@/api/HerbInfoApi';

export default function HerbDetail({ herbId, allHerbs = [] }: { herbId: string, allHerbs?: any[] }) {
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [courseIds, setCourseIds] = useState<number[]>([]);

  // 获取药材详情
  useEffect(() => {
    setLoading(true);
    axiosInstance.get(HERB_API.GET_HERB_DETAIL(herbId))
      .then(res => {
        if (res.data.code === 0) {
          setDetail(res.data.herb);
        } else {
          setDetail(null);
        }
      })
      .catch(() => setDetail(null))
      .finally(() => setLoading(false));
  }, [herbId]);

  // 获取相关课程
  useEffect(() => {
    if (!detail?.id) return;
    axiosInstance.get(HERB_API.GET_HERB_COURSES(detail.id))
      .then(res => {
        if (res.data.code === 0) {
          setCourseIds(res.data.data || []);
        } else {
          setCourseIds([]);
        }
      })
      .catch(() => setCourseIds([]));
  }, [detail?.id]);

  // 相关草药（同类）
  const relatedHerbs = useMemo(() => {
    if (!detail || !detail.herbLinkCategoryList || !allHerbs.length) return [];
    const categoryIds = detail.herbLinkCategoryList.map((c: any) => c.categoryId);
    return allHerbs.filter(h =>
      h.id !== detail.id &&
      h.herbLinkCategoryList &&
      h.herbLinkCategoryList.some((c: any) => categoryIds.includes(c.categoryId))
    ).slice(0, 3);
  }, [detail, allHerbs]);

  // 相关培训/课题（前端关键词过滤，假设有allTrainings/allResearches全量数据）
  // 这里用mock数据举例
  const allTrainings = [];
  const allResearches = [];
  const relatedTrainings = allTrainings.filter((item: any) => item.title?.includes(detail?.name));
  const relatedResearches = allResearches.filter((item: any) => item.title?.includes(detail?.name));

  if (loading) return <div className="p-12 text-center">加载中...</div>;
  if (!detail) return <div className="p-12 text-center text-red-500">未找到该药材信息</div>;

  return (
    <div className="bg-[#f8f8f5] min-h-screen">
      {/* 顶部花式字体+英文名+3D模型展示区 */}
      <div className="w-full flex flex-col items-center justify-center py-8 mb-6" style={{background: '#6bb89e', borderRadius: '0 0 32px 32px'}}>
        <div style={{ fontFamily: 'STKaiti, KaiTi, cursive', fontSize: 36, color: '#fff', textShadow: '2px 2px 8px #8C6B2F', marginBottom: 8 }}>
          {detail.name}
        </div>
        <div style={{ fontFamily: 'serif', fontSize: 22, color: '#fff', opacity: 0.85, marginBottom: 16 }}>
          {detail.scientificName || ''}
        </div>
        <Herb3D modelName={detail.name} />
      </div>
      {/* 主内容区和侧边栏 */}
      <div className="flex flex-row gap-8 px-8 py-6">
        {/* 左侧主内容区 */}
        <section className="flex-1 bg-white rounded-2xl shadow p-8">
          {/* 标题与图片 */}
          <div className="flex flex-row gap-8 items-start mb-6">
            <img src={detail.image || '/images/草药.svg'} className="w-40 aspect-square rounded-2xl border border-[#e0e0d0]" alt={detail.name} />
            <div>
              <h1 className="text-2xl font-bold mb-2 text-[#355C3A]">{detail.name}</h1>
              <ul className="text-base text-gray-700 leading-7">
                <li><b>学名</b>：{detail.scientificName || '-'}</li>
                <li><b>产地代表</b>：{detail.origin || '-'}</li>
                <li><b>简介</b>：{detail.des || '-'}</li>
                {/* 你可以根据后端返回字段补充更多 */}
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
          {/* 相关课程 */}
          {courseIds.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-[#8C6B2F] mb-2">📚 相关课程</h2>
              <ul className="flex flex-wrap gap-4">
                {courseIds.map(cid => (
                  <li key={cid}><a href={`/course-resource/${cid}`} className="text-blue-600 underline">课程ID: {cid}</a></li>
                ))}
              </ul>
            </div>
          )}
          {/* 相关培训/课题 */}
          {relatedTrainings.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-[#8C6B2F] mb-2">🎓 相关培训</h2>
              <ul className="flex flex-wrap gap-4">
                {relatedTrainings.map((t: any) => (
                  <li key={t.id}><a href={`/training/${t.id}`} className="text-blue-600 underline">{t.title}</a></li>
                ))}
              </ul>
            </div>
          )}
          {relatedResearches.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-[#8C6B2F] mb-2">🔬 相关课题</h2>
              <ul className="flex flex-wrap gap-4">
                {relatedResearches.map((r: any) => (
                  <li key={r.id}><a href={`/research/${r.id}`} className="text-blue-600 underline">{r.title}</a></li>
                ))}
              </ul>
            </div>
          )}
        </section>
        {/* 右侧侧边栏 */}
        <aside className="w-72 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <h3 className="text-base font-semibold text-[#355C3A] mb-2">🔗 相似药材词条</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              {relatedHerbs.map(h => (
                <li key={h.id}><a href={`/herb?id=${encodeURIComponent(h.name)}`} className="hover:underline text-[#5B8FF9]">{h.name}</a></li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-base font-semibold text-[#355C3A] mb-2">🤖 AI 问答</h3>
            <HerbAIQA herbName={detail.name} />
          </div>
        </aside>
      </div>
    </div>
  );
}