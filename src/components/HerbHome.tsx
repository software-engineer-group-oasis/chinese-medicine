import React from "react";
import { Input, Button, Typography, Breadcrumb, Select } from "antd";
import { SearchOutlined, HomeOutlined, BookOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Text } = Typography;

export default function HerbHome({
  searchText,
  setSearchText,
  propertyFilter,
  setPropertyFilter,
  partFilter,
  setPartFilter,
  page,
  setPage,
  herbsToShow,
  total,
  pageCount,
  propertyTags,
  partTags,
  PAGE_SIZE
}: any) {
  return (
    <div className="bg-[#f8f8f5] min-h-screen">
      <div className="max-w-7xl mx-auto pt-16 pb-8 px-4">
        {/* 面包屑 */}
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
            {propertyTags.map((tag: string) => (
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
            {partTags.map((tag: string) => (
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
                onClick={() => window.location.href = `/herb?id=${encodeURIComponent(herb.name)}`}
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
  );
} 