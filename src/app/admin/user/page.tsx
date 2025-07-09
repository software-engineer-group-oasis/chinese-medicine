"use client";
import { useEffect, useState } from "react";
import Card from "antd/es/card";
import Table from "antd/es/table";
import Button from "antd/es/button";
import Space from "antd/es/space";
import Tag from "antd/es/tag";
import Input from "antd/es/input";
import Modal from "antd/es/modal";
import Form from "antd/es/form";
import Select from "antd/es/select";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined,
  SearchOutlined,
} from "@ant-design/icons";
// import { mockUsers, mockRoles, UserInfo, UserStatus } from '@/mock/user';
import AdminBreadcrumb from "@/components/AdminBreadcrumb";
import { message, Popconfirm, Dropdown } from "antd";
import type { MenuProps } from "antd";
import Link from "next/link";
import { User, userColumns, roleOptions } from "@/constTypes/user";
import axiosInstance from "@/api/config";

const UserTypeLinkColor: { [key: string]: string } = {
  普通用户: "green",
  教师: "blue",
  学生: "violet",
  管理员: "yellow",
  超级管理员: "red",
};

const columns = [
  ...userColumns,
  {
    title: "身份",
    dataIndex: "role",
    key: "role",
    render: (text: string) => {
      return <Tag color={UserTypeLinkColor[text]}>{text}</Tag>;
    },
    filters: roleOptions.map((role) => ({
      text: role,
      value: role,
    })),
    onFilter: (value: string, record: User) => record.role === value,
  },
  {
    title: "操作", render: (_: string, record: User) => {
      return (<Button onClick={() => console.log(record)}>操作</Button>)
    }
  }
];

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const data = (
        await axiosInstance.get("/his-user-service/root/user/info/all")
      ).data;
      if (data.code === 0) {
        console.log(data);
        setUsers(data.users);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error(err.message);
      message.error(err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <div className="p-6">
      <AdminBreadcrumb
        className="mb-4"
        items={[{ title: "系统管理", href: "/admin" }, { title: "用户管理" }]}
      />
      <Card bordered={false} className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold mb-1">用户管理</h1>
            <div className="text-gray-500">管理系统用户，分配角色和权限</div>
          </div>
          <div>
            <Button type="primary" className="mr-2">
              <Link href="/admin/user/add-admin">添加管理员</Link>
            </Button>
            <Button type="primary" className="mr-2">
              <Link href="/admin/user/invite">生成邀请码</Link>
            </Button>
            {/* <Button type="primary" icon={<PlusOutlined />} onClick={handleAddUser} className="mr-2">新增用户</Button> */}
            {/* <Dropdown menu={{ items: batchActionItems }} disabled={selectedRowKeys.length === 0}>
              <Button>批量操作 {selectedRowKeys.length > 0 ? `(${selectedRowKeys.length})` : ''}</Button>
            </Dropdown> */}
          </div>
        </div>
      </Card>
      <Card bordered={false}>
        <div className="mb-4">
          {/* <Input.Search
            placeholder="搜索用户名、姓名、邮箱或部门"
            allowClear
            enterButton={<Button icon={<SearchOutlined />}>搜索</Button>}
            style={{ width: 300 }}
            value={searchText}
            onChange={e => setSearchText(e.target.value)} */}
          {/* /> */}
        </div>
        <Table columns={columns} dataSource={users} />
        {/* <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredUsers}
          pagination={{ pageSize: 10 }}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
        /> */}
      </Card>

      {/* <Modal
        title={editingUser ? '编辑用户' : '新增用户'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={editingUser || { status: 'active' }}
        >
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
              <Input placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item name="realName" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
              <Input placeholder="请输入姓名" />
            </Form.Item>
            <Form.Item name="email" label="邮箱" rules={[{ required: true, message: '请输入邮箱', type: 'email' }]}>
              <Input placeholder="请输入邮箱" />
            </Form.Item>
            <Form.Item name="phone" label="电话">
              <Input placeholder="请输入电话" />
            </Form.Item>
            <Form.Item name="department" label="部门">
              <Input placeholder="请输入部门" />
            </Form.Item>
            <Form.Item name="position" label="职位">
              <Input placeholder="请输入职位" />
            </Form.Item>
          </div>
          <Form.Item name="roleIds" label="角色" rules={[{ required: true, message: '请选择角色' }]}>
            <Select
              mode="multiple"
              placeholder="请选择角色"
              options={mockRoles.map(role => ({ label: role.name, value: role.id }))}
            />
          </Form.Item>
          {editingUser && (
            <Form.Item name="status" label="状态" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="active">激活</Select.Option>
                <Select.Option value="inactive">停用</Select.Option>
                <Select.Option value="locked">锁定</Select.Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal> */}
    </div>
  );
}
