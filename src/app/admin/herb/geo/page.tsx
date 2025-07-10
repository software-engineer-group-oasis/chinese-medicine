"use client"
import AdminBreadcrumb from "@/components/AdminBreadcrumb";
import {useEffect, useMemo, useState} from "react";
import {Location, locationColumns, District} from "@/constTypes/herbs";
import {Button, ConfigProvider, Input, message, Table} from "antd";
import zhCN from 'antd/lib/locale/zh_CN';
import useAxios from "@/hooks/useAxios";
import HerbLocationForm from "@/app/admin/herb/geo/HerbLocationForm";
import axiosInstance from "@/api/config";
import Link from "next/link";

export default function AdminGeoPage() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [pagination, setPagination] = useState({
        pageSize: 10,
        current: 1,
    })
    const [isModalVisible, setIsModelVisible] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
    const [searchTerm, setSearchTerm] = useState<string>("")

    // 提交更新
    const handleUpdate = (values:Location)=> {
        console.log(values)
        axiosInstance.put(`/herb-info-service/herbs/location/${values.id}`, {
            ...values,
            name: values.herbName,
            street: values.streetName,
            district: values.districtName,
        })
            .then(res => {
                if (res.data.code === 0) {
                    message.success("更新成功")
                } else {
                    throw new Error("更新失败")
                }
            })
            .catch(err => {
                message.error(err.message)
                console.error(err.message)
            })

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

    // 过滤数据
    const filteredLocations = useMemo(()=> { // useMemo提高性能
        if (!searchTerm.trim()) return locations;
        const lowerCaseSearch = searchTerm.toLowerCase();
        return locations.filter(loc => loc.herbName?.toLowerCase().includes(lowerCaseSearch));
    }, [locations, searchTerm])

    const handleDelete = (id:string) => {

        axiosInstance.delete(`herb-info-service/herbs/location/${id}`)
            .then(res => {
                if (res.data.code === 0) {
                    message.success("删除成功")
                    setIsModelVisible(false);

                } else {
                    throw new Error(res.data?.message || "删除失败")
                }
            })
            .catch(err => {
                message.error(err.message)
            })

        setLocations((prev:Location[])=> {
            return prev.filter((loc:Location) => String(loc.id) !== String(id))
        })
    }

//@ts-ignore
    const {data:locationsData, loading:locationsLoading, error:locationsError} = useAxios("/herb-info-service/herbs/location");
    //@ts-ignore
    const {data:districtsData, loading:districtsLoading, error:districtError} = useAxios("/herb-info-service/division/district");

    useEffect(() => {
        // @ts-ignore
        if (locationsData && locationsData.locations) {
            //@ts-ignore
            setLocations(locationsData.locations);
        }
        //@ts-ignore
        if (districtsData && districtsData.districts) {
            //@ts-ignore
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
            <div className={"my-2 flex gap-2"}>
                <Button><Link href="/admin/herb/geo/add">添加信息</Link></Button>
                <Input.Search
                    placeholder="按药材名搜索"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: 300 }}
                ></Input.Search>
            </div>
            <ConfigProvider locale={{
                ...zhCN,
                Pagination:{
                    ...zhCN.Pagination,
                    page: "页"
                }
            }}>
                <Table
                    columns={locationColumns}
                    dataSource={filteredLocations}
                    loading={locationsLoading}
                    rowKey={"id"}
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50'],
                        total: filteredLocations.length,
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
                              onUpdate={handleUpdate}
                              onDelete={handleDelete}
            />
        </>

    )
}