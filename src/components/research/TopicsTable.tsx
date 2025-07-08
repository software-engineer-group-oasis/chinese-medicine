"use client";
import { Topic } from "@/constTypes/research";
import { Card, Table, Popover } from "antd";
import Link from "next/link";

const columns = [
  {
    title: "课题编号",
    dataIndex: "topicId",
    key: "topicId",
    render: (text: string) => {
      return (
        <Popover content="点击查看该课题详情">
          <Link href={`/main/research/query/detail?topicId=${text}`}>{text}</Link>
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
  { title: "状态", dataIndex: "topicStatus", key: "topicStatus" },
];

export default function TopicsTable({ topics }: { topics: Topic[] }) {
  return (
    <div className="w-[80%]">
      <Card title={<div className="text-2xl font-bold">团队研究课题</div>}>
        <Table columns={columns} dataSource={topics} />
      </Card>
    </div>
  );
}
