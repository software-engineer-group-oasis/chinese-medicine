"use client"
import {Button, Form, Input, message, Select} from "antd";
import {District, Street} from "@/constTypes/herbs";
import {useEffect, useState} from "react";
import useAxios from "@/hooks/useAxios";
import axiosInstance from "@/api/config";

const { Option } = Select;

export default function AdminGeoAddPage() {
    const [form] = Form.useForm();
    const [districts, setDistricts] = useState<District[]>([]);
    const [loading, setLoading] = useState(false);
    const [streets, setStreets] = useState<Street[]>([]);
    //@ts-ignore
    const {data:districtsData, loading:districtsLoading, error:districtError} = useAxios("/herb-info-service/division/district");

    useEffect(() => {
    //@ts-ignore
        if (districtsData && districtsData.districts) {
            //@ts-ignore
            setDistricts(districtsData.districts);
        }
    }, [districtsData]);

    if (districtError) {
       return <div>加载失败...</div>
    }
    if (districtsLoading) {
        return <div>加载中...</div>
    }

    // 处理区县选项变化
    const handleDistrictChange= ((districtName: string)=> {
        setLoading(true);
        axiosInstance.get(`/herb-info-service/division/${districtName}/street`)
            .then(res => {
                if (res.data.code === 0) {
                    setStreets(res.data.streets)
                    form.setFieldsValue({
                        street: res.data.streets[0].streetName
                    })
                } else {
                    throw new Error(res.data?.message || "请求API错误")
                }
            })
            .catch(error => {
                console.error(error.message)
                message.error("请求API错误")
            })
            .finally(() => setLoading(false))
    })

    const handleGetLatAndLng = ()=> {
        const address = "重庆市"+form.getFieldValue("district")+
            form.getFieldValue("street")+
            form.getFieldValue("address")
        fetch("/api/tencent-geocoder?address="+address)
            .then(res => res.json())
            .then(data => {
                form.setFieldsValue({
                    longitude: data.data.result.location.lng,
                    latitude: data.data.result.location.lat
                })
                message.success("经纬度信息设置为["+data.data.result.location.lng+","+data.data.result.location.lat+"]")
            })
    }

    // 处理表单提交
    //@ts-ignore
    const handleFinish = (values)=> {
        axiosInstance.post("/herb-info-service/herbs/location", values)
            .then(res => {
                if (res.data.code === 0) {
                    message.success("数据上传成功")
                } else {
                    throw new Error(res.data?.message || "数据上传失败")
                }
            })
            .catch(error => {
                message.error(error.message)
                console.error(error.message)
            })
    }

    return (
        <>
            <div className="px-6 py-4 border-2 border-slate-300 rounded-md font-bold text-2xl">
                <div className="my-4">
                    <h1>中药地理信息录入</h1>
                </div>
                <Form form={form}
                      onFinish={handleFinish}
                      layout="vertical"
                >
                    <Form.Item name="name" label="药材名" rules={[{ required: true }]}>
                        <Input allowClear/>
                    </Form.Item>
                    <Form.Item name="count" label="数量" rules={[{ required: true }]}>
                        <Input allowClear/>
                    </Form.Item>
                    <Form.Item name="district" label="区县名" rules={[{ required: true }]}>
                        <Select
                            showSearch
                            placeholder={"请选择区县"}
                            optionFilterProp={"children"}
                            filterOption={(input, option) =>
                                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                            }
                            options= {
                                districts.map((district: District)=> {
                                    return {
                                        value: district.name,
                                        label: district.name
                                    }
                                })
                            }
                            onChange={handleDistrictChange}
                        />
                    </Form.Item>
                    <Form.Item name="street" label="街道名" rules={[{ required: true }]}>
                        <Select loading={loading} placeholder="请选择街道">
                            {streets.map((street:Street) => (
                                <Option key={street.streetId} value={street.streetName}>
                                    {street.streetName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="address" label="地址">
                        <Input allowClear/>
                    </Form.Item>
                    <Form.Item name="longitude" label="经度" rules={[{ required: true }]}>
                        <Input allowClear/>
                    </Form.Item>
                    <Form.Item name="latitude" label="纬度" rules={[{ required: true }]}>
                        <Input allowClear/>
                    </Form.Item>

                    <div className="flex gap-2">
                        <Button onClick={handleGetLatAndLng}>
                            获取经纬度
                        </Button>
                        <Button type="primary" htmlType="submit">
                            确定上传
                        </Button>
                    </div>

                </Form>
            </div>

        </>
    )
}