"use client";
import axiosInstance from "@/api/config";
import { Topic, TopicStatus, TopicStatusColor } from "@/constTypes/research";
import {
  Card,
  Table,
  Popover,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Tag,
  Popconfirm,
} from "antd";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import dayjs from "dayjs";

const { Option } = Select;

export default function TopicsTable({
  topics,
  onUpdate,
  checkCaptain,
}: {
  topics: Topic[];
  onUpdate: () => void;
  checkCaptain: () => boolean;
}) {
  const params = useSearchParams();
  const teamId = params.get("teamId");
  const [showAddTopicModal, setShowAddTopicModal] = useState(false);
  const [showPutTopicModal, setShowPutTopicModal] = useState(false);
  const [targetTopic, setTargetTopic] = useState<Topic>();

  const [putTopicForm] = Form.useForm();

  const columns = [
    {
      title: "课题编号",
      dataIndex: "topicId",
      key: "topicId",
      render: (text: string) => {
        return (
          <Popover content="点击查看该课题详情">
            <Link href={`/main/research/query/detail?topicId=${text}`}>
              {text}
            </Link>
          </Popover>
        );
      },
    },
    { title: "课题名", dataIndex: "topicName", key: "topicName" },
    { title: "团队编号", dataIndex: "teamId", key: "teamId" },
    {
      title: "开始时间",
      dataIndex: "topicStartTime",
      key: "topicStartTime",
      render: (text: string) => {
        return <span>{new Date(text).toLocaleDateString()}</span>;
      },
    },
    {
      title: "结束时间",
      dataIndex: "topicEndTime",
      key: "topicEndTime",
      render: (text: string) => {
        return <span>{new Date(text).toLocaleDateString()}</span>;
      },
    },
    {
      title: "状态",
      dataIndex: "topicStatus",
      key: "topicStatus",
      render: (text: number) => {
        return <Tag color={TopicStatusColor[text]}>{TopicStatus[text]}</Tag>;
      },
    },
    {
      title: "操作",
      key: "action",
      render: (_, record: Topic) => {
        return (
          checkCaptain() && (
            <div className="flex gap-2">
              <Button
                type="primary"
                onClick={() => {
                  setTargetTopic(record);
                  putTopicForm.setFieldsValue({
                    name: record.topicName,
                    startTime: dayjs(record.topicStartTime),
                    endTime: dayjs(record.topicEndTime),
                    des: record.topicDes,
                    status: TopicStatus[record.topicStatus],
                  });
                  openPutTopicModal();
                }}
              >
                修改
              </Button>
              <Popconfirm
                title="确定删除？"
                onConfirm={() => deleteTopic(record.topicId)}
              >
                <Button type="primary" danger>
                  删除
                </Button>
              </Popconfirm>
            </div>
          )
        );
      },
    },
  ];

  // 新建课题部分
  const openAddTopicModal = () => {
    setShowAddTopicModal(true);
  };
  const closeAddTopicModal = () => {
    setShowAddTopicModal(false);
  };

  const addTopic = async (values) => {
    const body = {
      ...values,
      startTime: values.startTime
        ? values.startTime.format("YYYY-MM-DD")
        : null,
      endTime: values.endTime ? values.endTime.format("YYYY-MM-DD") : null,
    };
    try {
      const data = (
        await axiosInstance.post("herb-research-service/topics/add", body)
      ).data;
      if (data.code === 0) {
        message.success("新建课题成功");
        onUpdate();
      }
    } catch (e) {
      console.error(e.message);
      message.error("新建课题失败" + e.message);
    }
  };

  const openPutTopicModal = () => {
    setShowPutTopicModal(true);
  };
  const closePutTopicModal = () => {
    setShowPutTopicModal(false);
  };

  const putTopic = async (values) => {
    try {
      const body = {
        ...values,
        startTime: values.startTime
          ? values.startTime.format("YYYY-MM-DD") + "T12:00:00"
          : null,
        endTime: values.endTime
          ? values.endTime.format("YYYY-MM-DD") + "T12:00:00"
          : null,
      };
      const data = (
        await axiosInstance.post(
          `/herb-research-service/topics/update/${targetTopic?.topicId}`,
          body
        )
      ).data;
      if (data.code === 0) {
        message.success("更新课题成功");
        onUpdate();
      }
    } catch (e) {
      console.error(e.message);
      message.error("更新课题失败" + e.message);
    }
  };

  const deleteTopic = async (topicId: number) => {
    try {
      const data = (
        await axiosInstance.delete(
          `/herb-research-service/topics/del/${topicId}`
        )
      ).data;
      if (data.code === 0) {
        message.error("删除课题成功");
        onUpdate();
      } else {
        throw new Error(data.message);
      }
    } catch (e) {
      console.error(e.message);
      message.error("删除课题失败" + e.message);
    }
  };

  return (
    <div className="w-[80%]">
      <Card title={<div className="text-2xl font-bold">团队研究课题</div>}>
        {checkCaptain() && (
          <div>
            <Button type="primary" onClick={openAddTopicModal}>
              添加课题
            </Button>
          </div>
        )}
        <Table columns={columns} dataSource={topics} />
      </Card>
      {/* 添加课题模态框 */}
      <Modal
        open={showAddTopicModal}
        title="添加课题"
        footer={null}
        onCancel={closeAddTopicModal}
      >
        <Form layout="vertical" onFinish={addTopic}>
          <Form.Item name="teamId" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="name" label="课题名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="startTime"
            label="开始时间"
            rules={[{ required: true }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="endTime"
            label="结束时间"
            rules={[{ required: true }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item name="des" label="简述" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true }]}>
            <Select>
              <Option value="立项中">立项中</Option>
              <Option value="进行中">进行中</Option>
              <Option value="已结题">已结题</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit">提交</Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* 修改课题模态框 */}
      <Modal
        open={showPutTopicModal}
        title="修改课题"
        footer={null}
        onCancel={closePutTopicModal}
      >
        <Form layout="vertical" onFinish={putTopic} form={putTopicForm}>
          <Form.Item name="teamId" hidden initialValue={targetTopic?.teamId}>
            <Input />
          </Form.Item>
          <Form.Item name="name" label="课题名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="startTime"
            label="开始时间"
            rules={[{ required: true }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="endTime"
            label="结束时间"
            rules={[{ required: true }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item name="des" label="简述" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true }]}>
            <Select>
              <Option value="立项中">立项中</Option>
              <Option value="进行中">进行中</Option>
              <Option value="已结题">已结题</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit">提交</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
