"use client"
import { useState } from 'react';
import Card from 'antd/es/card';
import Table from 'antd/es/table';
import Button from 'antd/es/button';
import Space from 'antd/es/space';
import Tag from 'antd/es/tag';
import Input from 'antd/es/input';
import Modal from 'antd/es/modal';
import Form from 'antd/es/form';
import Select from 'antd/es/select';
import { PlusOutlined, EditOutlined, DeleteOutlined, LockOutlined, UnlockOutlined, SearchOutlined } from '@ant-design/icons';
import { mockUsers, mockRoles, UserInfo, UserStatus } from '@/mock/user';
import AdminBreadcrumb from '@/components/AdminBreadcrumb';
import { message, Popconfirm, Dropdown } from 'antd';
import type { MenuProps } from 'antd';

export default function UserPage() {
  const [users, setUsers] = useState<UserInfo[]>(mockUsers);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<UserInfo | null>(null);
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 获取角色名称
  const getRoleNames = (roleIds: string[]) => {
    return mockRoles
      .filter(role => roleIds.includes(role.id))
      .map(role => role.name);
  };

  // 新增用户
  const handleAddUser = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 编辑用户
  const handleEditUser = (record: UserInfo) => {
    setEditingUser(record);
    form.setFieldsValue({
      ...record,
      // 处理特殊字段
    });
    setModalVisible(true);
  };

  // 删除用户
  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
    message.success('删除成功');
    // 如果删除的用户在选中列表中，也要从选中列表中移除
    setSelectedRowKeys(selectedRowKeys.filter(key => key !== id));
  };

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的用户');
      return;
    }
    Modal.confirm({
      title: '批量删除用户',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个用户吗？`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        setUsers(users.filter(user => !selectedRowKeys.includes(user.id)));
        setSelectedRowKeys([]);
        message.success('批量删除成功');
      },
    });
  };

  // 修改用户状态
  const handleChangeStatus = (id: string, status: UserStatus) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, status } : user
    ));
    message.success(`用户状态已更新为${status === 'active' ? '激活' : status === 'inactive' ? '停用' : '锁定'}`);
  };

  // 批量修改状态
  const handleBatchChangeStatus = (status: UserStatus) => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要修改的用户');
      return;
    }
    setUsers(users.map(user => 
      selectedRowKeys.includes(user.id) ? { ...user, status } : user
    ));
    message.success(`已将 ${selectedRowKeys.length} 个用户状态更新为${status === 'active' ? '激活' : status === 'inactive' ? '停用' : '锁定'}`);
  };

  // 提交表单
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        // 编辑现有用户
        setUsers(users.map(user => 
          user.id === editingUser.id ? { ...user, ...values } : user
        ));
        message.success('编辑成功');
      } else {
        // 新增用户
        const newUser: UserInfo = {
          id: Date.now().toString(),
          username: values.username,
          realName: values.realName,
          email: values.email,
          phone: values.phone,
          roleIds: values.roleIds,
          department: values.department,
          position: values.position,
          status: values.status || 'active',
          createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        };
        setUsers([newUser, ...users]);
        message.success('添加成功');
      }
      setModalVisible(false);
    } catch (error) {
      message.error('请检查表单填写');
    }
  };

  // 批量操作菜单
  const batchActionItems: MenuProps['items'] = [
    {
      key: 'activate',
      label: '批量激活',
      onClick: () => handleBatchChangeStatus('active'),
    },
    {
      key: 'deactivate',
      label: '批量停用',
      onClick: () => handleBatchChangeStatus('inactive'),
    },
    {
      key: 'lock',
      label: '批量锁定',
      onClick: () => handleBatchChangeStatus('locked'),
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      label: '批量删除',
      danger: true,
      onClick: handleBatchDelete,
    },
  ];

  // 表格列定义
  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      render: (text: string) => <span className="font-semibold">{text}</span>
    },
    {
      title: '姓名',
      dataIndex: 'realName',
      key: 'realName',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      render: (text: string) => text || '-'
    },
    {
      title: '角色',
      dataIndex: 'roleIds',
      key: 'roleIds',
      render: (roleIds: string[]) => (
        <Space size={0}>
          {getRoleNames(roleIds).map(name => (
            <Tag key={name} color="blue">{name}</Tag>
          ))}
        </Space>
      )
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      render: (text: string) => text || '-'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: UserStatus) => {
        if (status === 'active') return <Tag color="green">激活</Tag>;
        if (status === 'inactive') return <Tag color="orange">停用</Tag>;
        if (status === 'locked') return <Tag color="red">锁定</Tag>;
        return <Tag>未知</Tag>;
      }
    },
    {
      title: '最后登录',
      dataIndex: 'lastLoginTime',
      key: 'lastLoginTime',
      render: (text: string) => text || '-'
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      render: (_: any, record: UserInfo) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEditUser(record)}>编辑</Button>
          {record.status === 'active' ? (
            <Button type="link" icon={<LockOutlined />} onClick={() => handleChangeStatus(record.id, 'inactive')}>停用</Button>
          ) : record.status === 'inactive' || record.status === 'locked' ? (
            <Button type="link" icon={<UnlockOutlined />} onClick={() => handleChangeStatus(record.id, 'active')}>激活</Button>
          ) : null}
          <Popconfirm title="确定要删除该用户吗？" onConfirm={() => handleDeleteUser(record.id)} okText="删除" cancelText="取消">
            <Button type="link" icon={<DeleteOutlined />} danger>删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 筛选数据
  const filteredUsers = searchText
    ? users.filter(user => 
        user.username.includes(searchText) ||
        user.realName.includes(searchText) ||
        user.email.includes(searchText) ||
        (user.phone && user.phone.includes(searchText)) ||
        (user.department && user.department.includes(searchText))
      )
    : users;

  return (
    <div className="p-6">
      <AdminBreadcrumb className="mb-4" items={[
        { title: '系统管理', href: '/admin' },
        { title: '用户管理' }
      ]} />
      <Card bordered={false} className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold mb-1">用户管理</h1>
            <div className="text-gray-500">管理系统用户，分配角色和权限</div>
          </div>
          <div>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddUser} className="mr-2">新增用户</Button>
            <Dropdown menu={{ items: batchActionItems }} disabled={selectedRowKeys.length === 0}>
              <Button>批量操作 {selectedRowKeys.length > 0 ? `(${selectedRowKeys.length})` : ''}</Button>
            </Dropdown>
          </div>
        </div>
      </Card>
      <Card bordered={false}>
        <div className="mb-4">
          <Input.Search
            placeholder="搜索用户名、姓名、邮箱或部门"
            allowClear
            enterButton={<Button icon={<SearchOutlined />}>搜索</Button>}
            style={{ width: 300 }}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
        </div>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredUsers}
          pagination={{ pageSize: 10 }}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
        />
      </Card>

      <Modal
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
      </Modal>
    </div>
  );
}
