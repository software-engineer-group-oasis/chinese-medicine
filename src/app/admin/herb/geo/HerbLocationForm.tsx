"use client";
import { Form, Input, Modal, Button } from "antd";
import { Location } from "@/constTypes/herbs";
import {useEffect} from "react";

export default function HerbLocationEditModal({open, location, onClose, onUpdate,}: {
    open: boolean;
    location: Location | null;
    onClose: () => void;
    onUpdate: (values: Location) => void;
}) {
    const [form] = Form.useForm();


    useEffect(() => {
        if (location && open) {
            form.setFieldsValue(location);
        } else {
            form.resetFields();
        }
    }, [location, open]);

    const onFinish = (values: Location) => {
        onUpdate(values); // 提交数据给父组件
        onClose(); // 关闭模态框
    };

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
                    <Input />
                </Form.Item>
                <Form.Item name="streetName" label="街道名" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
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
                    <Button type="primary" htmlType="submit">
                        保存
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}