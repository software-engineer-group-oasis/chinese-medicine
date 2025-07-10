"use client"
import React, {useEffect, useMemo, useState} from 'react';
import AdminBreadcrumb from "@/components/AdminBreadcrumb";
import axiosInstance from "@/api/config";
import {Button, Form, message, Modal, Select, Tooltip} from "antd";
import {Herb, HerbCategory, HerbLinkCategory} from "@/constTypes/herbs"
import Link from "next/link";
import {Input} from "antd"
import { FaDeleteLeft } from "react-icons/fa6";

export default function AdminHerbCategoryPage() {
    const [herbCategories, setHerbCategories] = useState<HerbCategory[]>([])
    const [herbs, setHerbs] = useState<Herb[]>([])
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [categoryModalVisible, setCategoryModalVisible] = useState(false);
    const [deleteCatModalVisible, setDeleteCatModalVisivle] = useState(false);
    const [selectedHerbName, setSelectedHerbName] = useState("");
    const [selectedHerbId, setSelectedHerbId] = useState(-1);
    const [selectedCategoryId, setSelectedCategoryId] = useState(-1);
    const [filteredCategories, setFilteredCategories] = useState<HerbCategory[]>([]);
    const [form] = Form.useForm();
    const [categoryForm] = Form.useForm();

    const filteredHerbs = useMemo(() => {
        if (!searchTerm) return herbs;
        return herbs.filter((herb:Herb) =>
            herb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            herb.herbLinkCategoryList.some((item: HerbLinkCategory) => item.categoryName.toLowerCase().includes(searchTerm.toLowerCase()))
        )
    }, [herbs, searchTerm])

    //@ts-ignore
    const handleCatFormFinish = async (values)=> {
        //console.log(values.category)
        const cats = values.category
        for (let i = 0; i < cats.length; i++) {
            try {
                const res = await axiosInstance.post("/herb-info-service/category", {
                    name: cats[i]
                })
                if (res.data.code === 0) {
                    message.success(`新增种类${cats[i]}成功`)
                } else {
                    throw new Error(res.data.message || "API请求错误")
                }
            } catch (error) {
            //@ts-ignore
                console.error(error.message)
                //@ts-ignore
                message.error(error.message)
            }
        }
        fetchAllCats();
        categoryForm.setFieldsValue({category: null})
    }

//@ts-ignore
    const handleHerbFormFinish = async (values) => {
        //console.log(values);
        const cats = values.categories;
        //console.log("selectedHerbId", selectedHerbId);
        for (let i = 0; i < cats.length; i++) {
            try {
                const res = await axiosInstance.post(`/herb-info-service/${selectedHerbId}/links/${cats[i]}`)
                if (res.data.code !== 0) {
                    throw new Error("建立药材与种类关系时发生错误")
                }
            } catch (e) {
            //@ts-ignore
                message.error(e.message)
            }
        }
        fetchAllHerbs();
    }

    const handleDeleteCatOfAHerb = async () => {
        try {
            const res = await axiosInstance.delete(`/herb-info-service/${selectedHerbId}/links/${selectedCategoryId}`)
            if (res.data.code !== 0) {
                throw new Error(res.data.message || "API请求失败")
            }
        } catch (err) {
        //@ts-ignore
            message.error(err.message)
        }
        setDeleteCatModalVisivle(false);
        fetchAllHerbs();
    }

    const fetchAllCats = ()=> {
        setLoading(true);
        axiosInstance.get("/herb-info-service/category")
            .then(res => {
                if (res.data.code === 0) {
                    // console.log(res.data)
                    setHerbCategories(res.data.herbCategories)
                    setFilteredCategories(res.data.herbCategories)
                } else {
                    throw new Error(res.data.message || "API请求失败")
                }
            })
            .catch(error => {
                console.error(error.message)
                message.error(error.message)
            })
            .finally(()=> {
                setLoading(false);
            })
    }

    const fetchAllHerbs = ()=> {
        axiosInstance.get("/herb-info-service/herbs")
            .then(res => {
                if (res.data.code === 0) {
                    setHerbs(res.data.herbs)
                } else {
                    throw new Error(res.data.message || "API请求失败")
                }
            })
            .catch(error => {
                console.error(error.message)
                message.error(error.message)
            })
            .finally(()=> {
                setLoading(false);
            })
    }
    // 获取所有种类
    useEffect(() => {
        fetchAllCats();
    }, []);

    // 获取所有中药（其中包含了每一种中草材的类别，一种中药材可以有多个种类）
    useEffect(() => {
        fetchAllHerbs()
    }, []);

    useEffect(() => {
        setFilteredCategories(herbCategories);
    }, [herbCategories]);

    if (loading) {
        return <div>加载中...</div>
    }
    return (
        <div>
            <AdminBreadcrumb items={[
                {title: "中药信息管理", href: "/admin/herb"},
                {title: "中药类别管理"},
            ]} />
            <div className="flex flex-col gap-6 mt-2">
                <div className="self-start w-64">
                    <Input.Search
                        placeholder="输入药材名称或类别搜索"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-blue-500 rounded-md focus:border-blue-700 focus:ring-blue-200 bg-white hover:bg-grey-50 transition-colors "
                    />
                </div>
                {/*类别标签*/}
                <div className={"flex gap-1"}>
                    {herbCategories && herbCategories.map((item:HerbCategory)=> (
                        <div key={item.id} className="bg-stone-200 p-1 rounded-sm">{item.name}</div>
                    ))}
                </div>
                <div>
                    <Button onClick={()=> setCategoryModalVisible(true)}>添加种类关键词</Button>
                </div>
                {
                    filteredHerbs.map((herb: Herb, index: number)=> (
                        <div key={index} className="flex justify-between border-1 border-white rounded-md px-4 py-2 card">
                            <div>
                                <Tooltip title="点击编辑更多信息">
                                    <div className="font-bold text-lg link"><Link href={`/admin/herb/category/detail?name=${herb.name}&id=${herb.id}`}>{herb.name}</Link></div>
                                </Tooltip>
                                <div className="flex gap-4">
                                    {
                                        herb.herbLinkCategoryList.map((item: HerbLinkCategory, index: number)=> (
                                            <Tooltip key={index+item.herbName} title="点击进行删除">
                                                <div className="text-green-700 flex gap-1 items-center"
                                                    onClick={()=> {
                                                            setDeleteCatModalVisivle(true)
                                                            setSelectedHerbId(herb.id)
                                                            setSelectedCategoryId(item.categoryId)
                                                        }
                                                    }
                                                    >
                                                    <FaDeleteLeft /> {item.categoryName}
                                                </div>
                                            </Tooltip>
                                        ))
                                    }
                                </div>
                            </div>
                            <div><Button onClick={()=> {
                                setModalVisible(true)
                                setSelectedHerbName(herb.name)
                                setSelectedHerbId(herb.id)
                            }}>添加种类</Button></div>
                        </div>
                    ))
                }
                {/* 确认删除种类标签模态框 */}
                <Modal open={deleteCatModalVisible} okText={"确定"} cancelText={"取消"} onCancel={()=>setDeleteCatModalVisivle(false)}
                    onOk={handleDeleteCatOfAHerb} okButtonProps={{danger:true}}
                >
                    <p>是否删除此种类标签</p>
                </Modal>
                 {/*修改药材-种类信息模态框*/}
                <Modal title={`药材-种类信息(${selectedHerbName})`} open={modalVisible} okText="确定" cancelText="取消" footer={null}
                    onCancel={()=> {
                        setModalVisible(false)
                        // 保证下一次打开可以看到所有选项
                        setFilteredCategories(herbCategories)
                    }}
                >
                    <Form form={form} onFinish={handleHerbFormFinish}>
                        <Form.Item label="药材种类" name="categories" rules={[ {required: true, message: '至少选择一个种类'} ]}>
                            <Select mode="multiple" placeholder="请选择种类或输入新种类" className="w-full"
                                options={filteredCategories.map((item:HerbCategory)=> ({
                                    label:item.name,
                                    value:item.id
                                }))}
                                allowClear
                                showSearch
                                filterOption={(input, option)=>
                                //@ts-ignore
                                    option.label.toLowerCase().includes(input.toLowerCase())
                                }
                                onSearch={(value)=> {
                                    // 实现搜索功能
                                    if (value) {
                                        const filtered = herbCategories.filter(category =>
                                            category.name.toLowerCase().includes(value.toLowerCase())
                                        );
                                        // 更新选项列表为过滤后的结果
                                        setFilteredCategories(filtered);
                                    } else {
                                        // 如果搜索值为空，显示所有种类
                                        setFilteredCategories(herbCategories);
                                    }
                                }}
                            ></Select>
                        </Form.Item>
                        <div className="flex justify-end mt-4">
                            <Button type="primary" htmlType="submit" loading={loading}>
                                保存更改
                            </Button>
                        </div>
                    </Form>
                </Modal>
                {/* 添加种类标签模态框 */}
                <Modal open={categoryModalVisible} title="种类录入"
                       footer={null}
                       onCancel={()=> {
                            setCategoryModalVisible(false)
                       }}>
                    <Form form={categoryForm} onFinish={handleCatFormFinish}>
                        <Form.Item name="category" rules={[{required:true}]}>
                            <Select
                                mode="tags"
                                placeholder="输入新的种类关键词"
                                className="w-full"
                                allowClear
                            ></Select>
                        </Form.Item>
                        <div>
                            <Button htmlType="submit">确定</Button>
                        </div>
                    </Form>
                </Modal>

            </div>
            <style jsx>
            {`
                .card {
                    background-color: oklch(98.5% 0.001 106.423);
                    border: 2px dotted transparent;
                }
                .card:hover {
                    border: 2px dotted black;
                }
                .link:hover {
                    text-decoration: underline;
                }
            `}
            </style>
        </div>
    );
}