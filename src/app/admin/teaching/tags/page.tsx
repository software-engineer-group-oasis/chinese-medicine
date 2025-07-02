"use client"
import { useState } from 'react';
import Card from 'antd/es/card';
import Table from 'antd/es/table';
import Button from 'antd/es/button';
import Space from 'antd/es/space';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { mockTags } from '@/mock/teaching';
import AdminBreadcrumb from '@/components/AdminBreadcrumb';
import Modal from 'antd/es/modal';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import { message, Popconfirm } from 'antd';

export default function TagsPage() {
  const [tags, setTags] = useState(mockTags);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<any>(null);
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 新增标签
  const handleAddTag = () => {
    setEditingTag(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // 编辑标签
  const handleEditTag = (record: any) => {
    setEditingTag(record);
    form.setFieldsValue({ name: record.name });
    setIsModalOpen(true);
  };

  // 删除标签
  const handleDeleteTag = (id: string) => {
    setTags(tags.filter(tag => tag.id !== id));
    message.success('删除成功');
    setSelectedRowKeys(selectedRowKeys.filter(key => key !== id));
  };

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的标签');
      return;
    }
    setTags(tags.filter(tag => !selectedRowKeys.includes(tag.id)));
    message.success('批量删除成功');
    setSelectedRowKeys([]);
  };

  // 提交表单
  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingTag) {
        // 编辑现有标签
        setTags(tags.map(tag => tag.id === editingTag.id ? { ...tag, name: values.name } : tag));
        message.success('编辑成功');
      } else {
        // 新增标签
        const newTag = {
          id: Date.now().toString(),
          name: values.name,
        };
        setTags([newTag, ...tags]);
        message.success('添加成功');
      }
      setIsModalOpen(false);
      form.resetFields();
    }).catch(() => {
      message.error('请检查输入');
    });
  };

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
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEditTag(record)}>编辑</Button>
          <Popconfirm title="确定要删除该标签吗？" onConfirm={() => handleDeleteTag(record.id)} okText="删除" cancelText="取消">
            <Button type="link" icon={<DeleteOutlined />} danger>删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="p-6">
      <AdminBreadcrumb className="mb-4" items={[
        { title: '教学实验管理', href: '/admin/teaching' },
        { title: '标签管理' }
      ]} />
      <Card bordered={false} className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold mb-1">标签管理</h1>
            <div className="text-gray-500">增删改查课程标签，支持批量打标签</div>
          </div>
          <div>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddTag}>新增标签</Button>
            <Button className="ml-2" danger disabled={selectedRowKeys.length === 0} onClick={handleBatchDelete}>批量删除</Button>
          </div>
        </div>
      </Card>
      <Card bordered={false}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={tags}
          pagination={false}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
        />
      </Card>
      <Modal
        title={editingTag ? '编辑标签' : '新增标签'}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        okText={editingTag ? '保存' : '添加'}
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="标签名称"
            rules={[{ required: true, message: '请输入标签名称' }]}
          >
            <Input placeholder="请输入标签名称" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}