import axiosInstance from "@/api/config";
import { TeamMember } from "@/constTypes/research";
import useAuthStore from "@/store/useAuthStore";
import { Button, Card, Form, Input, message, Modal, Table, Tag } from "antd";
import { useEffect, useState } from "react";

export default function TeamMembers({
  members,
  onUpdate,
  checkCaptain
}: {
  members: TeamMember[];
  onUpdate: () => void;
  checkCaptain:()=> boolean
}) {
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showTransCaptainModal, setShowTransCaptainModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember>();
  const [showPutModal, setShowPutModal] = useState(false);

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
    {
      title: "操作",
      key: "action",
      render: (text: string, record: TeamMember) => {
        return (
          checkCaptain() && (
            <div className="flex gap-2">
              {!record.teamMemberIsCaptain && (
                <Button
                  type="primary"
                  danger
                  onClick={() => delMember(record.teamId)}
                >
                  删除
                </Button>
              )}
              {record.teamMemberIsCaptain && members.length === 1 && (
                <Button
                  type="primary"
                  danger
                  onClick={() => delMember(record.teamId)}
                >
                  删除
                </Button>
              )}
              <Button type="primary" onClick={()=> {
                openPutModal();
                setSelectedMember(record)
              }}>修改</Button>
            </div>
          )
        );
      },
    },
  ];

  const captain = () => {
    return members.find((member: TeamMember) => member.teamMemberIsCaptain);
  };

  // 添加团队成员部分
  const openAddMemberModal = () => {
    setShowAddMemberModal(true);
  };

  const closeAddMemberModal = () => {
    setShowAddMemberModal(false);
  };

// @ts-ignore
  const addTeamMember = async (values) => {
    console.log(values);
    try {
      const data = (
        await axiosInstance.post("/herb-research-service/teams/member", values)
      ).data;
      if (data.code === 0) {
        message.success("添加成员成功");
        onUpdate(); // 通知父组件
        closeAddMemberModal();
      } else {
        throw new Error(data.message);
      }
    } catch (e) {
    // @ts-ignore
      console.error(e.message);
      //@ts-ignore
      message.error("添加成员失败" + e.message);
    }
  };

  // 转移队长部分
  const openTransCaptainModal = () => {
    setShowTransCaptainModal(true);
  };

  const closeTransCaptainModal = () => {
    setShowTransCaptainModal(false);
  };

//@ts-ignore
  const transCaption = async (values) => {
    try {
      const teamMemberId = values.teamMemberId;
      const data = (
        await axiosInstance.post(
          `/herb-research-service/teams/captain/${teamMemberId}`
        )
      ).data;
      if (data.code === 0) {
        message.success("转让队长成功");
        onUpdate(); // 通知父组件
        closeTransCaptainModal();
      } else {
        throw new Error(data.message);
      }
    } catch (e) {
    // @ts-ignore
      console.error(e.message);
      // @ts-ignore
      message.error("转让队长失败" + e.message);
    }
  };

  // 删除队员部分
  const delMember = async (memberId: number) => {
    try {
      const data = (
        await axiosInstance.delete(
          `/herb-research-service/teams/member/${memberId}`
        )
      ).data;
      if (data.code === 0) {
        message.success("删除队员成功");
        onUpdate(); // 通知父组件
      } else {
        throw new Error(data.message);
      }
    } catch (e) {
    // @ts-ignore
      console.error(e.message);
      // @ts-ignore
      message.error("删除队员失败" + e.message);
    }
  };

  // 更新成员信息部分
  // @ts-ignore
  const putMember = async (values) => {
    try {
      const body = {
        ...values,
        teamMemberIsCaptain: (selectedMember as TeamMember).teamMemberIsCaptain
      }
      const data = (
        await axiosInstance.put(
          `/herb-research-service/teams/member/${selectedMember?.teamMemberId}`,
          body
        )
      ).data;
      console.log(data);
      if (data.code === 0) {
        message.success("更新队员信息成功");
        onUpdate(); // 通知父组件
      } else {
        throw new Error(data.message);
      }
    } catch (e) {
    // @ts-ignore
      console.error(e.message);
      // @ts-ignore
      message.error("更新队员信息失败" + e.message);
    }
  };

  const openPutModal = () => {
    setShowPutModal(true);
  };

  const closePutModal = () => {
    setShowPutModal(false);
  };

  return (
    <div className="w-[80%]">
      <Card title={<div className="text-2xl font-bold">团队成员</div>}>
        {checkCaptain() && (
          <>
            <Button type="primary" onClick={openAddMemberModal}>
              添加团队成员
            </Button>
            <Button type="primary" onClick={openTransCaptainModal}>
              转让队长
            </Button>
          </>
        )}
        <Table
          dataSource={members}
          columns={columns}
          pagination={{
            pageSize: 5,
          }}
        />
      </Card>

      {/* 添加成员模态框 */}
      <Modal
        open={showAddMemberModal}
        title="添加成员"
        footer={null}
        onCancel={closeAddMemberModal}
      >
        <Form layout="vertical" onFinish={addTeamMember}>
          <Form.Item name="teamId" hidden initialValue={members[0].teamId}>
            <Input />
          </Form.Item>
          <Form.Item name="userId" label="用户ID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="teamMemberName"
            label="成员姓名"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="teamMemberDes"
            label="成员简介"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="teamMemberIsCaptain" hidden initialValue={false}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* 转让队长模态框 */}
      <Modal
        open={showTransCaptainModal}
        title="转让队长"
        footer={null}
        onCancel={closeTransCaptainModal}
      >
        <Form layout="vertical" onFinish={transCaption}>
          <Form.Item
            name="teamMemberId"
            label="新队长的成员ID"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* 更新成员信息模态框 */}
      <Modal open={showPutModal} title="编辑成员信息" footer={null} onCancel={closePutModal}>
        <Form
          layout="vertical"
          onFinish={putMember}
          initialValues={selectedMember}
        >
          <Form.Item name="userId" label="用户ID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="teamMemberName"
            label="成员姓名"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="teamMemberDes"
            label="成员简介"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
