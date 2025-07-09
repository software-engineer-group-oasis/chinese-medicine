"use client";

import axiosInstance from "@/api/config";
import { Button, Card, Form, Input, message, Modal, Radio, Table, Upload } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { exportToExcel } from "@/utils/exportToExcel";

const columns = [
  { title: "学校", dataIndex: "schoolName" },
  { title: "学生", dataIndex: "userName" },
];

const invCodeCols = [
  { title: "学校", dataIndex: "inviteSchool" },
  { title: "学生", dataIndex: "inviteName" },
  { title: "邀请码", dataIndex: "code" },
  {
    title: "过期时间",
    dataIndex: "codeExpireTime",
    render: (text: string) => {
      return new Date(text).toLocaleString();
    },
  },
];

export default function AdminInvitePage() {
  const [form] = Form.useForm();
  const [records, setRecords] = useState([]);
  const [recordsWithInvCode, setRecordsWithInvCode] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [exportName, setExportName] = useState("");
  const [selectedUserType, setSelectedUserType] = useState("");

  const parseTable = async (values) => {
    setLoading(true);
    console.log(values);
    setSelectedUserType(values.userType)
    try {
      const formData = new FormData();
      formData.append("file", values.file.file);

      const response = await fetch("/api/parse-table", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("data:", data);

      if (response.ok) {
        setRecords(data);
        message.success("文件解析成功");
      } else {
        //setError(data.error || '处理文件时出错');
        message.error("文件解析失败");
      }
    } catch (err) {
      //setError('网络错误或服务器无响应');
      console.error("上传失败:", err);
      message.error("网络错误或服务器无响应");
    } finally {
      setLoading(false);
    }
  };

  const getInviteCode = async () => {
    let url = "";
    if (selectedUserType === "teacher") {
      url = "/his-user-service/root/teacher/invite"
    }
    if (selectedUserType === "student") {
      url ="/his-user-service/teacher/invite/student"
    }
    let invitationCodes = [];
    try {
      for (let i = 0; i < records.length; i++) {
        const res = await axiosInstance.post(
          url,
          records[i]
        );
        const data = res.data;
        if (data.code === 0) {
          invitationCodes.push(data.invitationCode);
        } else throw new Error(data.message);
      }
      setRecordsWithInvCode(invitationCodes);
    } catch (err) {
      message.error(err.message);
      console.error(err.message);
    }
  };

  const handleExportClick = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (!exportName.trim()) {
      message.error("请输入有效的文件名");
      return;
    }
    message.success("文件已经开始下载");
    if (!exportName.includes(".xlsx")) {
      exportToExcel(recordsWithInvCode, invCodeCols, exportName + ".xlsx");
    } else {
      exportToExcel(recordsWithInvCode, invCodeCols, exportName);
    }
    setIsModalVisible(false);
    setExportName("");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setExportName("");
  };

  useEffect(() => {
    getInviteCode();
  }, [records]);

  return (
    <div>
      <Card title={<div className="font-bold text-3xl">邀请码生成</div>}>
        <Form form={form} layout="vertical" onFinish={parseTable}>
          <Form.Item
            name="file"
            label="选择Excel文件"
            rules={[{ required: true, message: "请选择要上传的文件" }]}
          >
            <Upload.Dragger
              name="file"
              accept=".xlsx,.xls,.csv"
              maxCount={1}
              showUploadList={{ showRemoveIcon: true }}
              beforeUpload={() => false} // 禁用自动上传
            >
              <div className="bg-blue-500 px-4 py-6 rounded-md">
                点击或拖拽文件到此区域上传
              </div>
            </Upload.Dragger>
          </Form.Item>
          <Form.Item
            name="userType"
            label="为谁生成邀请码"
            rules={[{ required: true, message: "请选择用户类型" }]}
          >
            <Radio.Group>
              <Radio value="student">学生</Radio>
              <Radio value="teacher">教师</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" loading={loading}>
              上传并解析
            </Button>
          </Form.Item>
        </Form>
        <div className="flex flex-col gap-6">
          <Card title={<div className="font-bold text-2xl">文件解析结果</div>}>
            <Table columns={columns} dataSource={records} />
          </Card>
          <Card title={<div className="font-bold text-2xl">邀请码</div>}>
            <Table columns={invCodeCols} dataSource={recordsWithInvCode} />
          </Card>
        </div>
        <div className="mt-6">
          <Button onClick={handleExportClick}>导出数据</Button>
        </div>
        <Modal
          title="请输入文件名"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="确认"
          cancelText="取消"
        >
          <Input
            placeholder="请输入文件名（不带扩展名）"
            value={exportName}
            onChange={(e) => setExportName(e.target.value)}
            onPressEnter={handleOk}
          />
        </Modal>
      </Card>
    </div>
  );
}
