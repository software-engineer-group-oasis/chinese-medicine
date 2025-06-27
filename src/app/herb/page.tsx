"use client"
import {useSearchParams} from "next/navigation";
import GrowthTimeline from '@/components/GrowthTimeline';
import CommentSection from '@/components/CommentSection';
import React, { useCallback, useState, useMemo } from "react";
import { Row, Col, Input, Button, Tag, Breadcrumb, Typography, Pagination, Select } from "antd";
import { SearchOutlined, HomeOutlined, BookOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { herbDetails, HerbDetail } from '@/mock/herbData';

const { Text } = Typography;

const allHerbs: { name: string; img: string; property?: string; part?: string }[] = herbDetails.map(h => ({
  name: h.name,
  img: h.img,
  property: h.property,
  part: h.part,
}));
//中草药特性，方便筛选
const propertyTags = [
  '寒', '热', '温', '凉', '平', '辛', '甘', '苦', '酸', '咸',
];
const partTags = [
  '根', '茎', '叶', '花', '果实', '皮', '全草', '种子', '树脂', '菌类',
];

const PAGE_SIZE = 15;

export default function HerbPage() {
    const searchParam = useSearchParams();
    const herbId = searchParam.get('id');
    const router = useRouter();
    const [searchText, setSearchText] = useState('');
    const [propertyFilter, setPropertyFilter] = useState('全部');
    const [partFilter, setPartFilter] = useState('全部');
    const [page, setPage] = useState(1);

    // 查询功能：按名称模糊搜索+分类筛选
    const filteredHerbs = useMemo(() => {
        let herbs = allHerbs;
        if (searchText.trim()) {
            herbs = herbs.filter(h => h.name.includes(searchText.trim()));
        }
        if (propertyFilter !== '全部') {
            herbs = herbs.filter(h => h.property === propertyFilter);
        }
        if (partFilter !== '全部') {
            herbs = herbs.filter(h => h.part === partFilter);
        }
        return herbs;
    }, [searchText, propertyFilter, partFilter]);

    // 分页
    const total = filteredHerbs.length;
    const pageCount = Math.ceil(total / PAGE_SIZE);
    const herbsToShow: { name: string; img: string }[] = filteredHerbs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // 首页：中药网格+查询+分类+面包屑+分页
    const renderHome = useCallback(() => (
        <div className="bg-[#f8f8f5] min-h-screen">
            <div className="max-w-7xl mx-auto pt-16 pb-8 px-4">
                {/* 面包屑（items写法，修复Antd警告） */}
                <div className="mb-4">
                    <Breadcrumb
                        items={[
                            {
                                title: <Link href="/"><HomeOutlined /> 首页</Link>,
                            },
                            {
                                title: <span><BookOutlined /> 中药百科</span>,
                            },
                        ]}
                    />
                </div>
                {/* 查询与分类 */}
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8 bg-white rounded-2xl shadow p-6">
                    <Input.Search
                        placeholder="搜索中药名、拼音、功效..."
                        enterButton={<Button type="primary" icon={<SearchOutlined />}>查询</Button>}
                        size="large"
                        value={searchText}
                        onChange={e => { setSearchText(e.target.value); setPage(1); }}
                        style={{ maxWidth: 320 }}
                    />
                    <div className="flex flex-wrap items-center gap-2">
                        <Text strong>药性:</Text>
                        <Button
                            size="small"
                            type={propertyFilter === '全部' ? 'primary' : 'default'}
                            onClick={() => { setPropertyFilter('全部'); setPage(1); }}
                        >全部</Button>
                        {propertyTags.map(tag => (
                            <Button
                                key={tag}
                                size="small"
                                type={propertyFilter === tag ? 'primary' : 'default'}
                                onClick={() => { setPropertyFilter(tag); setPage(1); }}
                            >{tag}</Button>
                        ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Text strong>部位:</Text>
                        <Button
                            size="small"
                            type={partFilter === '全部' ? 'primary' : 'default'}
                            onClick={() => { setPartFilter('全部'); setPage(1); }}
                        >全部</Button>
                        {partTags.map(tag => (
                            <Button
                                key={tag}
                                size="small"
                                type={partFilter === tag ? 'primary' : 'default'}
                                onClick={() => { setPartFilter(tag); setPage(1); }}
                            >{tag}</Button>
                        ))}
                    </div>
                </div>
                {/* 网格区 */}
                <div className="bg-white rounded-2xl shadow p-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
                        {herbsToShow.map((herb: { name: string; img: string }) => (
                            <div
                                key={herb.name}
                                className="bg-green-50 rounded-2xl p-8 shadow hover:shadow-2xl transition cursor-pointer flex flex-col items-center w-full h-80 justify-center border-2 border-green-100 hover:border-green-300 group"
                                style={{ boxShadow: '0 4px 16px #e0e0e0' }}
                                onClick={() => router.push(`/herb?id=${encodeURIComponent(herb.name)}`)}
                                title={`查看${herb.name}详情`}
                            >
                                <img
                                    src={herb.img}
                                    alt={herb.name}
                                    className="w-40 h-40 object-cover aspect-square rounded-xl mb-4 bg-white border-2 border-green-100 group-hover:border-green-300"
                                    style={{ transition: 'border 0.2s' }}
                                />
                                <div className="text-[#355C3A] font-bold text-base tracking-wide mb-1 group-hover:text-green-700" style={{ transition: 'color 0.2s' }}>{herb.name}</div>
                            </div>
                        ))}
                    </div>
                    {/* 分页控件+下拉选择 */}
                    <div className="flex flex-col items-center mt-12 gap-2">
                        <Pagination
                            current={page}
                            pageSize={PAGE_SIZE}
                            total={total}
                            onChange={setPage}
                            showSizeChanger={false}
                            showQuickJumper={false}
                            itemRender={(pageNum, type, originalElement) => {
                                if (type === 'prev') return <span>上一页</span>;
                                if (type === 'next') return <span>下一页</span>;
                                return originalElement;
                            }}
                            style={{ display: 'none' }}
                        />
                        <div className="text-gray-500 text-sm mt-1 select-none flex items-center gap-2">
                            <span className="mr-2 cursor-pointer" onClick={() => setPage(1)}>首页</span>
                            <Select
                                size="small"
                                value={page}
                                onChange={setPage}
                                style={{ width: 70 }}
                                popupMatchSelectWidth={false}
                            >
                                {Array.from({ length: pageCount }, (_, i) => (
                                    <Select.Option key={i+1} value={i+1}>{i+1}</Select.Option>
                                ))}
                            </Select>
                            <span className="ml-2 cursor-pointer" onClick={() => setPage(pageCount)}>末页</span>
                            <span className="ml-4">共 {pageCount} 页 {total} 条</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ), [router, searchText, propertyFilter, partFilter, page, herbsToShow, total, pageCount]);

    // 详情页
    const renderDetail = useCallback(() => {
        const detail: HerbDetail | undefined = herbDetails.find(h => h.name === herbId);
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
                            {herbDetails.filter(h => h.name !== herbId).slice(0, 3).map(h => (
                                <li key={h.name}><a href={`/herb?id=${encodeURIComponent(h.name)}`} className="hover:underline text-[#5B8FF9]">{h.name}</a></li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-white rounded-2xl shadow p-6">
                        <h3 className="text-base font-semibold text-[#355C3A] mb-2">🤖 AI 问答</h3>
                        <div className="text-gray-400">（AI 问答功能开发中...）</div>
                    </div>
                </aside>
            </div>
        );
    }, [herbId]);

    if (!herbId) {
        return renderHome();
    } else {
        return renderDetail();
    }
}