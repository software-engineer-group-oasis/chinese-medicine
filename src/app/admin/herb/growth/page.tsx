"use client"
import AdminBreadcrumb from "@/components/AdminBreadcrumb";
import {useEffect, useState} from "react";
import { HerbGrowth, growthColumns } from "@/constTypes/herbs"
import useAxios from "@/hooks/useAxios";
import {Button, message, Popconfirm, Table} from "antd";
import axiosInstance from "@/api/config";


export default function AdminGrowthPage() {
    const [herbGrowths, setHerbGrowths] = useState<HerbGrowth[]>([]);
    const {data:herbGrowthData, error, loading} = useAxios("/herb-info-service/growth/all", "get", null, {})
    // todo 这里目前必须要创建者才能够删除??
    const handleDelete = async (id:string) => {
        try {
            const res = await axiosInstance.delete(`/herb-info-service/growth/${id}`)
            if (res.data.code === 0) {
                message.success("删除成功")
            } else {
                throw new Error(res.data.message || "删除失败")
            }
        } catch (err) {
        //@ts-ignore
            message.error(err.message)
        }
    }
    const columns = growthColumns.map(col => {
        if (col.key === 'action') {
            return {
                ...col,
                //@ts-ignore
                render: (_, record:HerbGrowth)=> (
                    <div className="flex gap-2">
                        {/*todo 点击进入某一条记录的详情页面，后端没有对应的接口*/}
                        <Button type="primary" onClick={()=> {
                            console.log(record.herbName)
                        }}>编辑</Button>

                        <Popconfirm
                            title="确认删除"
                            description={"是否确定删除这条记录"}
                            okText="是"
                            cancelText="否"
                            //@ts-ignore
                            onConfirm={()=> handleDelete(record.id)}
                        >
                            <Button danger>删除</Button>
                        </Popconfirm>

                    </div>

                )
            }
        }
        return col;
    })

    useEffect(()=> {
    //@ts-ignore
        if (herbGrowthData && herbGrowthData.code === 0) {
        //@ts-ignore
            setHerbGrowths(herbGrowthData.herbGrowths)
            //@ts-ignore
            console.log("herbGrowths:", herbGrowthData.herbGrowths)
        }
    }, [herbGrowthData])

    if (loading) {
        return <div>加载中...</div>
    }

    if (error) {
        return <div>加载失败...</div>
    }

    return (
        <>
            <AdminBreadcrumb items={[
                {title: "中药信息管理", href: "/admin/herb"},
                {title: "成长溯源信息"}
            ]} />
            <Table
                columns={columns}
                dataSource={herbGrowths}
                loading={loading}
                rowKey="id"
                pagination={{
                    pageSize: 5,
                    total: herbGrowths.length
                }}
            />
        </>

    )
}