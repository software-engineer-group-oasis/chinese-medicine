import { TeamMember } from "@/constTypes/research";
import { Card, Table, Tag } from "antd";

const columns = [
  { title: "用户ID", dataIndex: "userId", key: "userId" },
  { title: "团队成员ID", dataIndex: "teamMemberId", key: "teamMemberId" },
  { title: "成员名", dataIndex: "teamMemberName", key: "teamMemberName" },
  { title: "成员简介", dataIndex: "teamMemberDes", key: "teamMemberDes" },
  {
    title: "成员身份",
    dataIndex: "teamMemberIsCaptain",
    key: "teamMemberIsCaptain",
    render: (isCaptain: boolean) => {
      return isCaptain === true ? (
        <Tag color="green">队长</Tag>
      ) : (
        <Tag color="blue">队员</Tag>
      );
    },
  },
];

export default function TeamMembers({ members }: { members: TeamMember[] }) {
  return (
    <div className="w-[80%]">
      <Card title={<div className="text-2xl font-bold">团队成员</div>}>
        <Table
          dataSource={members}
          columns={columns}
          pagination={{
            pageSize: 5,
          }}
        />
      </Card>
    </div>
  );
}
