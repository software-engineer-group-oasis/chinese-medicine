"use client";
import { Content } from "@/constTypes/research";
import { Card, Table, Popover } from "antd";
import Link from "next/link";

const columns = [
  {
    title: "资料编号",
    dataIndex: "contentId",
    key: "contentId",
    render: (text: string) => {
      return (
      <Popover content="点击查看资料详情">
        <Link href={`/main/research/query/detail/content?contentId=${text}`}>{text}</Link>
      </Popover>
      )
    },
  },
  { title: "资料名", dataIndex: "contentName", key: "contentName" },
  { title: "资料描述", dataIndex: "contentDes", key: "contentDes" },
  {
    title: "发布时间",
    dataIndex: "contentTime",
    key: "contentTime",
    render: (text: string) => {
      return <span>{new Date(text).toLocaleDateString()}</span>;
    },
  },
  {
    title: "所属课题",
    dataIndex: "topicName",
    key: "topicName",
  },
  { title: "资料类型", dataIndex: "contentTypeName", key: "contentTypeName" },
  { title: "上传者ID", dataIndex: "userId", key: "userId" },
];

export default function TeamContentsTable({
  contents,
}: {
  contents: Content[];
}) {
  return (
    <div className="w-[80%]">
      <Card title={<div className="text-2xl font-bold">课题资料</div>}>
        <Table columns={columns} dataSource={contents} />
      </Card>
    </div>
  );
}
