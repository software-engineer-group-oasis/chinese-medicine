"use client";
import {Button, Form, Input, message, Modal, Select} from "antd";
import {District, Location, Street} from "@/constTypes/herbs";
import {useEffect, useState} from "react";
import axiosInstance from "@/api/config";

const { Option } = Select;

export default function HerbLocationEditModal({open, location, districts, onClose, onUpdate, onDelete}: {
    open: boolean;
    location: Location | null;
    districts: District[],
    onClose: () => void;
    onUpdate: (values: Location) => void;
    onDelete: (id:string) => void,
}) {
    const [form] = Form.useForm();
    const [streets, setStreets] = useState<Street[]>([]);
    const [loading, setLoading] = useState(false);
    const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

    useEffect(() => {
        if (location && open) {
            form.setFieldsValue({
                ...location,
                address: ""
            });
        } else {
            form.resetFields();
        }
    }, [location, open]);

    const onFinish = (values: Location) => {
        onUpdate(values); // 提交数据给父组件
        onClose(); // 关闭模态框
    };

    // 处理区县选项变化
    const handleDistrictChange= ((districtName: string)=> {
        setLoading(true);
        axiosInstance.get(`/herb-info-service/division/${districtName}/street`)
            .then(res => {
                if (res.data.code === 0) {
                    setStreets(res.data.streets)
                    form.setFieldsValue({
                        streetName: res.data.streets[0].streetName
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

    // 获取经纬度
    const handleGetLatAndLng = () => {
        const address = "重庆市"+form.getFieldValue("districtName")+
            form.getFieldValue("streetName")+
            form.getFieldValue("address")
        fetch("/api/tencent-geocoder?address="+address)
            .then(res => res.json())
            .then(data => {
                form.setFieldsValue({
                    longitude: data.data.result.location.lng,
                    latitude: data.data.result.location.lat
                })
                message.success("经纬度信息更新为["+data.data.result.location.lng+","+data.data.result.location.lat+"]")
            })
    }


    /* 删除模态框部分 begin */

    const showDeleteConfirm = ()=> {
        setDeleteConfirmVisible(true);
    }

    const confirmDelete = ()=> {
        console.log(form.getFieldValue("id"));
        setDeleteConfirmVisible(false);
        onDelete(form.getFieldValue("id"));
    }

    const cancelDelete = ()=> {
        setDeleteConfirmVisible(false);
    }

    /* 删除模态框部分 end */

    if (!districts) {
        return <div>加载中...</div>
    }

    return (
        <Modal
            title="编辑地理位置信息"
            open={open}
            onCancel={onClose}
            footer={null}
        >
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item name="id" label="ID" hidden>
                    <Input />
                </Form.Item>
                <Form.Item name="herbId" label="药材 ID" hidden>
                    <Input />
                </Form.Item>
                <Form.Item name="count" label="数量" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="herbName" label="药材名" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="districtName" label="区县名" rules={[{ required: true }]}>
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
                <Form.Item name="streetName" label="街道名" rules={[{required: true}]}>
                    <Select loading={loading} placeholder="请选择街道">
                        {streets.map((street: Street) => (
                            <Option key={street.streetId} value={street.streetName}>
                                {street.streetName}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="address" label="地址">
                    <Input />
                </Form.Item>
                <Button onClick={handleGetLatAndLng}>
                    获取经纬度
                </Button>
                <Form.Item name="longitude" label="经度" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="latitude" label="纬度" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <div style={{ textAlign: "right" }}>
                    <Button onClick={onClose} style={{ marginRight: 8 }}>
                        取消
                    </Button>
                    <Button onClick={showDeleteConfirm} danger style={{ marginRight: 8 }}>
                        删除
                    </Button>
                    <Button type="primary" htmlType="submit">
                        保存
                    </Button>
                </div>
            </Form>

            <Modal
                title="确认删除"
                open={deleteConfirmVisible}
                onOk={confirmDelete}
                onCancel={cancelDelete}
                okText="确定"
                cancelText="取消"
            >
                <p>你即将删除该记录（此操作不可逆），是否继续</p>
            </Modal>
        </Modal>
    );
}