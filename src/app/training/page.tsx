"use client";
import { useState } from "react";
import { Input, Select, Card, List, Image } from "antd";
import Link from "next/link";

const { Search } = Input;
const { Option } = Select;

// 定义中药材培训数据类型
interface TrainingItem {
    key: string;
    title: string;
    category: string;
    imageUrl: string;
    description: string;
}

export default function TrainingPage() {
    // 状态管理
    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [trainingData] = useState<TrainingItem[]>([
        {
            key: "1",
            title: "人参鉴定与应用",
            category: "根茎类",
            imageUrl: "/images/黄连.jpg",
            description: "学习人参的鉴别特征、药用价值及临床应用"
        },
        {
            key: "2",
            title: "当归种植技术",
            category: "根茎类",
            imageUrl: "/images/黄连.jpg",
            description: "掌握当归的种植环境、栽培技术和采收加工方法"
        },
        {
            key: "3",
            title: "黄连的炮制工艺",
            category: "根茎类",
            imageUrl: "/images/黄连.jpg",
            description: "了解黄连的不同炮制方法及其药效变化"
        },
        {
            key: "4",
            title: "金银花病虫害防治",
            category: "花叶类",
            imageUrl: "/images/黄连.jpg",
            description: "学习金银花常见病虫害的识别与防治技术"
        },
        {
            key: "5",
            title: "菊花栽培管理",
            category: "花叶类",
            imageUrl: "/images/黄连.jpg",
            description: "掌握菊花的品种选择、栽培管理和采收加工技术"
        },
        {
            key: "6",
            title: "枸杞子的现代研究",
            category: "果实类",
            imageUrl: "/images/黄连.jpg",
            description: "了解枸杞子的化学成分、药理作用及最新研究成果"
        }
    ]);

    // 处理搜索
    const handleSearch = (value: string) => {
        setSearchText(value.toLowerCase());
    };

    // 处理分类筛选
    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
    };

    // 过滤数据
    const filteredData = trainingData.filter(item => {
        const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
        const matchesSearch =
            item.title.toLowerCase().includes(searchText) ||
            item.description.toLowerCase().includes(searchText);
        return matchesCategory && matchesSearch;
    });

    // 获取所有唯一类别
    const categories = ["all", ...Array.from(new Set(trainingData.map(item => item.category)))];

    return (
        <div className="p-6">
            {/* 搜索栏 */}
            <div className="mb-6 max-w-md">
                <Search
                    placeholder="输入关键词搜索培训内容"
                    onSearch={handleSearch}
                    onChange={(e) => handleSearch(e.target.value)}
                    value={searchText}
                    size="large"
                />
            </div>

            <div className="flex">
                {/* 左侧筛选组件 */}
                <div className="w-64 mr-6">
                    <Card title="按中药材分类" className="h-fit">
                        <Select
                            defaultValue="all"
                            onChange={handleCategoryChange}
                            className="w-full"
                            size="large"
                        >
                            {categories.map((category, index) => (
                                <Option key={index} value={category}>
                                    {category}
                                </Option>
                            ))}
                        </Select>
                    </Card>
                </div>

                {/* 右侧筛选结果列表 */}
                <div className="flex-1">
                    <List
                        grid={{ gutter: 16, column: 3 }}
                        dataSource={filteredData}
                        renderItem={(item) => (
                            <List.Item>
                                <Card
                                    hoverable
                                    cover={<Image src={item.imageUrl} alt={item.title} height={200} />}
                                    className="h-full"
                                >
                                    <Link href={`/training/detail?key=${item.key}`}>
                                        <Card.Meta title={item.title} description={item.description} />
                                    </Link>
                                </Card>
                            </List.Item>
                        )}
                        locale={{
                            emptyText: '没有找到匹配的培训内容'
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
