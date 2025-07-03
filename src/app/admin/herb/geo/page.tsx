"use client"
import AdminBreadcrumb from "@/components/AdminBreadcrumb";
import {useEffect, useState} from "react";
import {Location, locationColumns} from "@/constTypes/herbs";
import {ConfigProvider, Table} from "antd";
import zhCN from 'antd/lib/locale/zh_CN';
import useAxios from "@/hooks/useAxios";
import HerbLocationForm from "@/app/admin/herb/geo/HerbLocationForm";

export default function AdminGeoPage() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [pagination, setPagination] = useState({
        pageSize: 10,
        current: 1,
    })
    const [isModalVisible, setIsModelVisible] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)

    // 提交更新
    const handleUpdate = (values)=> {
        console.log(values)
        // TODO 进行api请求

        // 更新本地状态
        setLocations((prev) => (
            prev.map((loc) => loc.id === values.id ? values : loc)
        ))
    }

    // 打开模态框
    const showModel = (record: Location)=> {
        setSelectedLocation(record)
        setIsModelVisible(true)
    }

    const closeModel = ()=> {
        setIsModelVisible(false);
    }

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
                    onRow={(record, rowIndex) => ({
                        onClick: (event) => {
                            showModel(record)
                        },
                    })}
                />
            </ConfigProvider>

            <HerbLocationForm open={isModalVisible}
                              location={selectedLocation}
                              onClose={closeModel}
                              onUpdate={handleUpdate} />
        </>

    )
}