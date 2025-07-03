"use client"
import AdminBreadcrumb from "@/components/AdminBreadcrumb";
import {useEffect, useState} from "react";
import {Location, locationColumns} from "@/constTypes/herbs";
import {ConfigProvider, Table} from "antd";
import zhCN from 'antd/lib/locale/zh_CN';
import useAxios from "@/hooks/useAxios"; // 基础语言包

export default function AdminGeoPage() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [pagination, setPagination] = useState({
        pageSize: 10,
        current: 1,
    })
    const handleTableChange = (newPagination: any)=> {
        setPagination(newPagination);
    }
    const {data, loading, error} = useAxios("/herb-info-service/herbs/location");

    useEffect(() => {
        // @ts-ignore
        if (data && data.locations) {
            setLocations(data.locations);
        }
    }, [data]);

    if (loading) {
        return <div>加载中...</div>
    }
    if (error) {
        // @ts-ignore
        return <div>{error.message}</div>
    }

    return (
        <>
            <AdminBreadcrumb items={[
                {title: "中药信息管理", href: "/admin/herb"},
                {title: "地理位置信息"}
            ]} />
            <ConfigProvider locale={{
                ...zhCN,
                Pagination:{
                    ...zhCN.Pagination,
                    page: "页"
                }
            }}>
                <Table
                    columns={locationColumns}
                    dataSource={locations}
                    loading={loading}
                    rowKey={"id"}
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50'],
                        total: locations.length,
                        showTotal: (total) => `共${total}条`,
                    }}
                    onChange={handleTableChange}
                />
            </ConfigProvider>

        </>

    )
}