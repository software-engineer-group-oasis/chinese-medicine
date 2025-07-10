"use client";

import axiosInstance from "@/api/config";
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Radio,
  Table,
  Tag,
  Upload,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { exportToExcel } from "@/utils/exportToExcel";
import { Tabs } from "antd";
import { InvitationCode } from "@/constTypes/user";

const columns = [
  { title: "学校", dataIndex: "schoolName", key: "schoolName" },
  { title: "姓名", dataIndex: "userName", key: "userName" },
];

const invCodeCols = [
  { title: "学校", dataIndex: "inviteSchool", key: "inviteSchool" },
  { title: "姓名", dataIndex: "inviteName" },
  { title: "邀请码", dataIndex: "code" },
  {
    title: "过期时间",
    dataIndex: "codeExpireTime",
    render: (text: string) => {
      return new Date(text).toLocaleString();
    },
  },
];

export default function InvitePage() {
  const [form] = Form.useForm();
  const [records, setRecords] = useState([]);
  const [recordsWithInvCode, setRecordsWithInvCode] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [exportName, setExportName] = useState("");
  //   /his-user-service/teacher/invite/student/me(?page=1&size=10)
  const [invitationCodes, setInvitationCodes] = useState<InvitationCode[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false); // 控制“加载更多”按钮是否可用
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]); // 控制批量删除

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys as number[]);
    },
  };

  const invCodeFromMeCols = [
    ...invCodeCols,
    {
      title: "是否使用",
      dataIndex: "codeIsUsed",
      key: "codeIsUsed",
      render: (isUsed: boolean) => {
        return isUsed ? (
          <Tag color="green">已使用</Tag>
        ) : (
          <Tag color="gray">未使用</Tag>
        );
      },
      filters: [
        { text: "已使用", value: true },
        { text: "未使用", value: false },
      ],
      onFilter: (value: boolean, record: InvitationCode) =>
        record.codeIsUsed === value,
    },
    {
      title: "操作",
      key: "action",
      render: (_: string, record: InvitationCode) => {
        return (
          <div className="flex gap-2">
            <Popconfirm
              title="确定删除？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => deleteInvCode(record.codeId)}
            >
              <Button danger>删除</Button>
            </Popconfirm>
            {record.codeIsUsed && <Button>查看详情</Button>}
          </div>
        );
      },
    },
  ];

  const deleteInvCode = async (invitationId: number) => {
    const data = (
      await axiosInstance.delete(
        `/his-user-service/teacher/invite/student/me/${invitationId}`
      )
    ).data;
    if (data.code === 0) {
      setInvitationCodes((prev) =>
        prev.filter(
          (invCode: InvitationCode) => invCode.codeId !== invitationId
        )
      );
      message.success("删除邀请码成功");
    } else throw new Error("删除失败");
  };

  const fetchMoreInvitationCodes = async () => {
    fetchInvitationCodes(page + 1);
    setPage((prev) => prev + 1);
  };

  const fetchInvitationCodes = async (page: number) => {
    if (loading) return;
    setLoading(true);
    try {
      const data = (
        await axiosInstance.get(
          `/his-user-service/teacher/invite/student/me?page=${page}&size=10`
        )
      ).data;
      if (data.code === 0) {
        if (page > 1) {
          setInvitationCodes((prev) => [...prev, ...data.invitationCodes]);
        } else {
          setInvitationCodes(data.invitationCodes);
        }
      }
    } catch (err) {
    //@ts-ignore
      console.error(err.message);
      //@ts-ignore
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

//@ts-ignore
  const parseTable = async (values) => {
    setLoading(true);
    console.log(values);
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
    const url = "/his-user-service/teacher/invite/student";
    let invitationCodes = [];
    try {
      for (let i = 0; i < records.length; i++) {
        const res = await axiosInstance.post(url, records[i]);
        const data = res.data;
        if (data.code === 0) {
          invitationCodes.push(data.invitationCode);
        } else throw new Error(data.message);
      }
      //@ts-ignore
      setRecordsWithInvCode(invitationCodes);
    } catch (err) {
    //@ts-ignore
      message.error(err.message);
      //@ts-ignore
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

  const deleteSingle = async (id:number) => {
    try {
      const res = await axiosInstance.delete(
        `/his-user-service/teacher/invite/student/me/${id}`
      );
      return { success: true, id };
    } catch (err) {
      console.error(`删除 ${id} 失败`, err);
      return { success: false, id };
    }
  };

  const batchDeleteInvCodes = async () => {
    if (!selectedRowKeys.length) return;

    const results = await Promise.all(selectedRowKeys.map(deleteSingle));

    const successes = results.filter((r) => r.success);
    const failures = results.filter((r) => !r.success);

    if (successes.length > 0) {
      message.success(`成功删除 ${successes.length} 条记录`);
      setInvitationCodes((prev) =>
        prev.filter((inv) => !successes.some((s) => s.id === inv.codeId))
      );
      setSelectedRowKeys(failures.map((f) => f.id)); // 剩下的是失败的
    }

    if (failures.length > 0) {
      message.warning(`有 ${failures.length} 条记录删除失败`);
    }
  };

  useEffect(() => {
    getInviteCode();
  }, [records]);

  useEffect(() => {
    fetchInvitationCodes(page);
  }, [page]);

  return (
    <div>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="生成邀请码" key="1">
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
              <Form.Item>
                <Button htmlType="submit" loading={loading}>
                  上传并解析
                </Button>
              </Form.Item>
            </Form>
            <div className="flex flex-col gap-6">
              <Card
                title={<div className="font-bold text-2xl">文件解析结果</div>}
              >
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
        </Tabs.TabPane>
        <Tabs.TabPane tab="邀请码管理" key="2">
          <Card
            title={<div className="font-bold text-3xl">我发出的邀请码</div>}
          >
            <Button danger type="primary" onClick={batchDeleteInvCodes} disabled={selectedRowKeys.length === 0}>批量删除</Button>
            <Table
              dataSource={invitationCodes}
              // @ts-ignore
              columns={invCodeFromMeCols}
              rowKey="codeId" // 必须指定 rowKey，否则 rowSelection 不生效
              rowSelection={rowSelection}
            />
            <Button
              type="primary"
              onClick={fetchMoreInvitationCodes}
              disabled={loading}
            >
              加载更多
            </Button>
          </Card>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}
