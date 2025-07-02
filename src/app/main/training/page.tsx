"use client";
import {useEffect, useState} from "react";
import { Input, Select, Card, List} from "antd";
import Link from "next/link";
import axiosInstance from "@/api/config";
import {Material} from "@/constTypes/materials";
import { TbUserEdit } from "react-icons/tb";
import { GiHerbsBundle } from "react-icons/gi";
import { BiCategoryAlt } from "react-icons/bi";
import { CiTimer } from "react-icons/ci";

const { Search } = Input;
const { Option } = Select;

export default function TrainingPage() {
    // 状态管理
    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [defaultMaterials, setDefaultMaterials] = useState<Material[]>([]);
    // 获取所有唯一类别
    const categories = ["all", ...Array.from(new Set(defaultMaterials.map(item => item.type)))];

    useEffect(() => {
        axiosInstance.get("/herb-training-service/material/all")
            .then(res => {
                if (res.data.code === 0) {
                    //console.log(res.data.materials)
                    setDefaultMaterials(res.data.materials)
                    setSelectedCategory("all")
                } else {
                    throw new Error("API请求失败")
                }
            })
            .catch(error => {
                console.error("API请求失败", error.message);
            })
    }, []);

    // 处理搜索
    const handleSearch = (value: string) => {
        setSearchText(value.toLowerCase());
    };

    // 处理分类筛选
    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
    };

    // 过滤数据
    const filteredData = defaultMaterials.filter(item => {
        const matchesCategory = selectedCategory === "all" || item.type === selectedCategory;
        const matchesSearch =
            item.title.toLowerCase().includes(searchText) ||
            item.des.toLowerCase().includes(searchText) ||
            item.type.toLowerCase().includes(searchText) ||
            item.herbName.toLowerCase().includes(searchText)
        return matchesCategory && matchesSearch;
    });

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
                                    style = {{
                                        backgroundImage: "linear-gradient(to right bottom , oklch(75% 0.183 55.934), oklch(85.2% 0.199 91.936) )"
                                    }}
                                    hoverable
                                    className="h-full"
                                    title={"培训材料: "+item.title}
                                    extra={(<div className={"flex gap-4"}>
                                        <div>观看次数: {item.count}</div>
                                        <Link href={`/main/training/detail?key=${item.id}`}>
                                            <span style={{
                                                color: "#fff",
                                                textDecoration: "underline",
                                                fontWeight: "bold"
                                            }}>编号: {item.id}</span>
                                        </Link>
                                    </div>)}>
                                    <div className={'flex gap-2 my-2'}>
                                        <div className={"flex gap-2  border-2  rounded-md px-2 py-1 items-center m-tag"}>
                                            <GiHerbsBundle /><span>{item.herbName}</span>
                                        </div>
                                        <div className={"flex gap-2  border-2 rounded-md px-2 py-1 items-center m-tag"}>
                                            <BiCategoryAlt /><span>{item.type}</span>
                                        </div>
                                        <div className={"flex gap-2  border-2  rounded-md px-2 py-1 items-center m-tag"}>
                                            <TbUserEdit /><span>{item.username}</span>
                                        </div>
                                        <div className={"flex gap-2  border-2  rounded-md px-2 py-1 items-center m-tag"}>
                                            <CiTimer /><span>{new Date(item.time).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <Card.Meta description={item.des} />
                                </Card>
                            </List.Item>
                        )}
                        locale={{
                            emptyText: '没有找到匹配的培训内容'
                        }}
                    />
                </div>

                <style jsx>{`
                    .m-tag {
                        color: #000;
                        background-color: #fff;
                        transition: all 0.3s ease-in-out;
                    }
                    .m-tag:hover {
                        color: #fff;
                        background-color: #000;
                    }
                `}</style>
            </div>
        </div>
    );
}
