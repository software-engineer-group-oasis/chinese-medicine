"use client"
import { useState } from 'react';
import Card from 'antd/es/card';
import Table from 'antd/es/table';
import Button from 'antd/es/button';
import Space from 'antd/es/space';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { mockCategories } from '@/mock/teaching';
import AdminBreadcrumb from '@/components/AdminBreadcrumb';
import Modal from 'antd/es/modal';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import { message, Popconfirm } from 'antd';

export default function CategoriesPage() {
  const [categories, setCategories] = useState(mockCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm] = Form.useForm();

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span className="font-semibold">{text}</span>
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => {
            setEditingCategory(record);
            setIsEditModalOpen(true);
            editForm.setFieldsValue({ name: record.name });
          }}>编辑</Button>
          <Popconfirm title="确定要删除该类别吗？" onConfirm={() => handleDeleteCategory(record.id)} okText="删除" cancelText="取消">
            <Button type="link" icon={<DeleteOutlined />} danger>删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 新增类别提交
  const handleAddCategory = () => {
    form.validateFields().then(values => {
      const newCategory = {
        id: Date.now().toString(),
        name: values.name,
      };
      setCategories([newCategory, ...categories]);
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  // 删除类别
  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
    message.success('删除成功');
    setSelectedRowKeys(selectedRowKeys.filter(key => key !== id));
  };

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的类别');
      return;
    }
    setCategories(categories.filter(cat => !selectedRowKeys.includes(cat.id)));
    message.success('批量删除成功');
    setSelectedRowKeys([]);
  };

  // 编辑类别提交
  const handleEditCategory = () => {
    editForm.validateFields().then(values => {
      setCategories(categories.map(cat => cat.id === editingCategory.id ? { ...cat, name: values.name } : cat));
      setIsEditModalOpen(false);
      message.success('编辑成功');
    }).catch(() => {
      message.error('请检查输入');
    });
  };

  return (
    <div className="p-6">
      <AdminBreadcrumb className="mb-4" items={[
        { title: '教学实验管理', href: '/admin/teaching' },
        { title: '类别管理' }
      ]} />
      <Card bordered={false} className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold mb-1">类别管理</h1>
            <div className="text-gray-500">增删改查课程类别，设置课程分类体系</div>
          </div>
          <div>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
              新增类别
            </Button>
            <Button className="ml-2" danger disabled={selectedRowKeys.length === 0} onClick={handleBatchDelete}>
              批量删除
            </Button>
          </div>
        </div>
      </Card>
      <Card bordered={false}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={categories}
          pagination={false}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
        />
      </Card>
      <Modal
        title="新增课程类别"
        open={isModalOpen}
        onOk={handleAddCategory}
        onCancel={() => setIsModalOpen(false)}
        okText="添加"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="类别名称"
            rules={[{ required: true, message: '请输入类别名称' }]}
          >
            <Input placeholder="请输入类别名称" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="编辑类别"
        open={isEditModalOpen}
        onOk={handleEditCategory}
        onCancel={() => setIsEditModalOpen(false)}
        okText="保存"
        cancelText="取消"
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="name"
            label="类别名称"
            rules={[{ required: true, message: '请输入类别名称' }]}
          >
            <Input placeholder="请输入类别名称" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}