"use client";
import { Table, Input } from "antd";
import React, { useState } from "react";

// 定义科研数据类型
interface ResearchData {
    key: string;
    title: string;
    type: string;
    views: number;
    date: string;
}

const { Search } = Input;

const ResearchDataTable: React.FC = () => {
    // 示例数据
    const dataSource: ResearchData[] = [
        {
            key: '1',
            title: '中药材质量评价体系研究',
            type: '论文',
            views: 245,
            date: '2025-03-15'
        },
        {
            key: '2',
            title: '中药配伍规律数据分析',
            type: '数据集',
            views: 189,
            date: '2025-03-18'
        },
        {
            key: '3',
            title: '中药活性成分提取专利汇编',
            type: '专利',
            views: 320,
            date: '2025-03-20'
        },
        {
            key: '4',
            title: '中药指纹图谱分析方法',
            type: '论文',
            views: 156,
            date: '2025-03-22'
        },
        {
            key: '5',
            title: '中药药理作用机制研究',
            type: '论文',
            views: 278,
            date: '2025-03-25'
        },
        {
            key: '6',
            title: '中药药理作用机制研究',
            type: '论文',
            views: 278,
            date: '2025-03-25'
        },
        {
            key: '7',
            title: '中药药理作用机制研究',
            type: '论文',
            views: 278,
            date: '2025-03-25'
        },
        {
            key: '8',
            title: '中药药理作用机制研究',
            type: '论文',
            views: 278,
            date: '2025-03-25'
        },
    ];

    // 过滤数据的函数
    const [searchText, setSearchText] = useState('');

    // 处理搜索事件
    const handleSearch = (value: string) => {
        setSearchText(value);
    };

    // 过滤数据
    const filteredData = dataSource.filter(item =>
        item.title.toLowerCase().includes(searchText.toLowerCase()) ||
        item.type.toLowerCase().includes(searchText.toLowerCase())
    );

    // 表格列配置
    const columns = [
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: '浏览量',
            dataIndex: 'views',
            key: 'views',
        },
        {
            title: '发布日期',
            dataIndex: 'date',
            key: 'date',
        },
    ];

    return (
        <div className="research-data-table bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">科研数据基本信息</h2>
            <p className="text-gray-600 mb-6">以下展示了近期科研数据的基本信息及访问统计：</p>

            {/* 搜索区域 */}
            <div className="flex justify-between items-center mb-6">
                <div className="w-1/3">
                    <Search
                        placeholder="输入关键词搜索"
                        onSearch={handleSearch}
                        onChange={(e) => setSearchText(e.target.value)}
                        value={searchText}
                        className="search-input"
                    />
                </div>
            </div>

            {/* 数据表格 */}
            <Table
                dataSource={filteredData}
                columns={columns}
                pagination={{ pageSize: 5 }}
                locale={{
                    emptyText: '没有找到匹配的数据'
                }}
            />
        </div>
    );
};

export default ResearchDataTable;
