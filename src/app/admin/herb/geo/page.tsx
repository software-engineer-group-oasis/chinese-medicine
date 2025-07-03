"use client"
import AdminBreadcrumb from "@/components/AdminBreadcrumb";
import {useEffect, useState} from "react";
import {Location, locationColumns, District} from "@/constTypes/herbs";
import {ConfigProvider, Table} from "antd";
import zhCN from 'antd/lib/locale/zh_CN';
import useAxios from "@/hooks/useAxios";
import HerbLocationForm from "@/app/admin/herb/geo/HerbLocationForm";

export default function AdminGeoPage() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [pagination, setPagination] = useState({
        pageSize: 10,
        current: 1,
    })
    const [isModalVisible, setIsModelVisible] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)

    // 提交更新
    const handleUpdate = (values:Location)=> {
        console.log(values)
        const address = values.districtName+values.streetName
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



    const {data:locationsData, loading:locationsLoading, error:locationsError} = useAxios("/herb-info-service/herbs/location");
    const {data:districtsData, loading:districtsLoading, error:districtError} = useAxios("/herb-info-service/division/district");

    useEffect(() => {
        // @ts-ignore
        if (locationsData && locationsData.locations) {
            setLocations(locationsData.locations);
        }
        if (districtsData && districtsData.districts) {
            setDistricts(districtsData.districts);
        }
    }, [locationsData, districtsData]);

    if (locationsLoading || districtsLoading) {
        return <div>加载中...</div>
    }
    if (locationsError || districtError) {
        // @ts-ignore
        return <div>{locationsError?.message || districtsError?.message}</div>
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
                    loading={locationsLoading}
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
                              districts={districts}
                              onClose={closeModel}
                              onUpdate={handleUpdate} />
        </>

    )
}