"use client";
import {Suspense, useEffect, useState} from "react";
import {Input, Select, Card, List, Button, message, Modal} from "antd";
import Link from "next/link";
import axiosInstance from "@/api/config";
import {Material} from "@/constTypes/materials";
import { TbUserEdit } from "react-icons/tb";
import { GiHerbsBundle } from "react-icons/gi";
import { BiCategoryAlt } from "react-icons/bi";
import { CiTimer } from "react-icons/ci";
import {liveRoom} from "@/constTypes/training";
import { Typography } from "antd";
import useAuthStore from "@/store/useAuthStore";
import { IoMdClose } from "react-icons/io";
import { GlimmeringButton } from "@/components/GlimmeringButton";


const { Search } = Input;
const { Option } = Select;
const { Paragraph } = Typography

export default function TrainingPage() {
    // 状态管理
    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [defaultMaterials, setDefaultMaterials] = useState<Material[]>([]);
    const [showLiveStreamBox, setShowLiveStreamBox] = useState(false);
    const [liveRoom, setLiveRoom] = useState({
        id: -1, streamUrl: "", streamKey: ""
    })
    const [inputTitle, setInputTitle] = useState("");
    const [isTitleModalVisible, setIsTitleModalVisible] = useState(false);
    // 获取所有唯一类别
    const categories = ["all", ...Array.from(new Set(defaultMaterials.map(item => item.type)))];
    const {token, initializeAuth} =  useAuthStore();
    useEffect(()=> {
        if (!token) {
            initializeAuth();
        }
    }, [])
   

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

    const handleStartLiveStream = async ()=> {
        setIsTitleModalVisible(true);
    }

    const handleConfirm = async ()=> {
        if (!inputTitle.trim()) {
            message.error('请输入直播间标题');
            return;
        }
        
        try {
            const res = await axiosInstance.post("/herb-training-service/live/room", {
                title: inputTitle,
                coverUrl: "/images/green-bg.jpg"
            });
            const data = res.data;
            console.log(data);
            if (data.code === 0) {
                setLiveRoom({...(data.liveRoom)})
                setShowLiveStreamBox(true);
            }
        } catch (e) {
            message.error("服务器错误")
        } finally {
            setIsTitleModalVisible(false);
            setInputTitle('');
        }
    } 

    return (
        <>
            {/*直播按键*/}
            <div className="fixed right-8 bottom-8 z-999">
                <GlimmeringButton
                    title="开启直播"
                    onClick={handleStartLiveStream}
                    role="button"
                    >
                    开启直播
                </GlimmeringButton>
            </div>
            {/*直播提示框*/}
            {
                isTitleModalVisible && (
                <Modal
                    title="创建直播间"
                    open={isTitleModalVisible}
                    onOk={handleConfirm}
                    onCancel={() => setIsTitleModalVisible(false)}
                    okText="确定"
                    cancelText="取消"
                >
                    <Input
                        placeholder="请输入直播间标题"
                        value={inputTitle}
                        onChange={(e) => setInputTitle(e.target.value)}
                    />
                </Modal>
                )
            }
            {
                showLiveStreamBox &&
                <div className="fixed top-1/2 left-1/2 z-999 transform -translate-x-1/2 -translate-y-1/2
                bg-white px-4 py-6 rounded-md">
                    <div className="relative">
                        <div className="absolute right-3 top-3 hover:text-red-600" onClick={()=> setShowLiveStreamBox(prev => !prev)}><IoMdClose /></div>
                        <div>直播间ID: </div>
                        <Paragraph>{liveRoom.id}</Paragraph>
                        <div>直播间密钥:</div>
                        <Paragraph copyable>{liveRoom.streamKey}</Paragraph>
                        <div>直播间服务器链接:</div>
                        <Paragraph copyable>{liveRoom.streamUrl}</Paragraph>
                        <Button type="link">
                            <a target="_blank" rel="noopener noreferrer" href={`${process.env.NEXT_PUBLIC_HOST}/live-stream.html?roomId=${liveRoom.id}&token=${token}`}>前往直播间</a>
                        </Button>
                        
                    </div> 
                </div>
            }

            <Suspense fallback={<div>加载中...</div>}>
                <video src={'/中药制作.mp4'} autoPlay muted loop onError={() => <></>}
                       width={"100%"} style={{
                    margin: "0 auto",
                    marginBottom: "1rem",
                }}
                ></video>
            </Suspense>

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
                            grid={{gutter: 16, column: 3}}
                            dataSource={filteredData}
                            renderItem={(item) => (
                                <List.Item>
                                    <Card
                                        style={{
                                            backgroundImage: "linear-gradient(to right bottom , oklch(75% 0.183 55.934), oklch(85.2% 0.199 91.936) )"
                                        }}
                                        hoverable
                                        className="h-full"
                                        title={"培训材料: " + item.title}
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
                                            <div
                                                className={"flex gap-2  border-2  rounded-md px-2 py-1 items-center m-tag"}>
                                                <GiHerbsBundle/><span>{item.herbName}</span>
                                            </div>
                                            <div
                                                className={"flex gap-2  border-2 rounded-md px-2 py-1 items-center m-tag"}>
                                                <BiCategoryAlt/><span>{item.type}</span>
                                            </div>
                                            <div
                                                className={"flex gap-2  border-2  rounded-md px-2 py-1 items-center m-tag"}>
                                                <TbUserEdit/><span>{item.username}</span>
                                            </div>
                                            <div
                                                className={"flex gap-2  border-2  rounded-md px-2 py-1 items-center m-tag"}>
                                                <CiTimer/><span>{new Date(item.time).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <Card.Meta description={item.des}/>
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
        </>

    );
}
