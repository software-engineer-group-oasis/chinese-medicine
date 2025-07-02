"use client"
import { useState } from 'react';
import Card from 'antd/es/card';
import Button from 'antd/es/button';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { mockCourses, mockCategories, mockTags } from '@/mock/teaching';
import AdminBreadcrumb from '@/components/AdminBreadcrumb';
import { CourseTable } from '@/components/teaching/CourseTable';
import type { CourseRecord } from '@/components/teaching/CourseTable';
import Modal from 'antd/es/modal';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Select from 'antd/es/select';
import Tag from 'antd/es/tag';
import { message, Popconfirm, Dropdown } from 'antd';
import type { MenuProps } from 'antd';

export default function CoursesPage() {
  // 课程数据
  const [courses, setCourses] = useState<CourseRecord[]>(
    mockCourses.map(c => ({
      ...c,
      status: (c.status === 'draft' || c.status === 'published' ? c.status : 'draft') as 'draft' | 'published',
    }))
  );
  const [filterText, setFilterText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 辅助函数
  const getCategoryName = (id: string) => mockCategories.find(c => c.id === id)?.name || '-';
  const getTagNames = (ids: string[]) => mockTags.filter(t => ids.includes(t.id)).map(t => t.name);

  // 新增课程
  const handleAddCourse = () => {
    setEditingCourse(null);
    form.resetFields();
    setModalVisible(true);
  };
  // 编辑
  const handleEdit = (record: any) => {
    setEditingCourse(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };
  // 删除
  const handleDelete = (record: any) => {
    Modal.confirm({
      title: '确认删除该课程？',
      content: `课程：${record.title}`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        setCourses(prev => prev.filter(c => c.id !== record.id));
        message.success('删除成功');
      },
    });
  };

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的课程');
      return;
    }
    Modal.confirm({
      title: '批量删除课程',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个课程吗？`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        setCourses(prev => prev.filter(c => !selectedRowKeys.includes(c.id)));
        setSelectedRowKeys([]);
        message.success('批量删除成功');
      },
    });
  };

  // 批量修改状态
  const handleBatchChangeStatus = (status: 'draft' | 'published') => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要修改的课程');
      return;
    }
    setCourses(prev => prev.map(c => 
      selectedRowKeys.includes(c.id) ? { ...c, status } : c
    ));
    message.success(`已将 ${selectedRowKeys.length} 个课程${status === 'published' ? '发布' : '设为草稿'}`);
  };

  // 批量操作菜单
  const batchActionItems: MenuProps['items'] = [
    {
      key: 'publish',
      label: '批量发布',
      onClick: () => handleBatchChangeStatus('published'),
    },
    {
      key: 'draft',
      label: '批量设为草稿',
      onClick: () => handleBatchChangeStatus('draft'),
    },
    {
      key: 'delete',
      label: '批量删除',
      danger: true,
      onClick: handleBatchDelete,
    },
  ];

  // 提交表单
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingCourse) {
        setCourses(prev => prev.map(c => c.id === editingCourse.id ? { ...c, ...values } : c));
        message.success('编辑成功');
      } else {
        setCourses(prev => [
          { ...values, id: Date.now().toString(), status: 'draft' },
          ...prev,
        ]);
        message.success('添加成功');
      }
      setModalVisible(false);
    } catch (error) {
      message.error('请检查表单填写');
    }
  };

  return (
    <div className="p-6">
      <AdminBreadcrumb className="mb-4" items={[
        { title: '教学实验管理', href: '/admin/teaching' },
        { title: '课程管理' }
      ]} />
      <Card bordered={false} className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold mb-1">课程管理</h1>
            <div className="text-gray-500">查看、编辑、排序、删除课程，管理课程内容</div>
          </div>
          <div>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCourse} className="mr-2">新增课程</Button>
            <Dropdown menu={{ items: batchActionItems }} disabled={selectedRowKeys.length === 0}>
              <Button>批量操作 {selectedRowKeys.length > 0 ? `(${selectedRowKeys.length})` : ''}</Button>
            </Dropdown>
          </div>
        </div>
      </Card>
      <Card bordered={false}>
        <CourseTable
          dataSource={courses}
          categories={mockCategories}
          tags={mockTags}
          filterText={filterText}
          onFilterTextChange={setFilterText}
          onEdit={handleEdit}
          onDelete={handleDelete}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
        />
      </Card>
      <Modal
        title={editingCourse ? '编辑课程' : '新增课程'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={editingCourse || {}}
        >
          <Form.Item name="title" label="课程标题" rules={[{ required: true, message: '请输入课程标题' }]}> <Input /> </Form.Item>
          <Form.Item name="description" label="简介"> <Input.TextArea rows={2} /> </Form.Item>
          <Form.Item name="categoryId" label="类别" rules={[{ required: true, message: '请选择类别' }]}> <Select options={mockCategories.map(c => ({ label: c.name, value: c.id }))} /> </Form.Item>
          <Form.Item name="tagIds" label="标签"> <Select mode="multiple" options={mockTags.map(t => ({ label: t.name, value: t.id }))} /> </Form.Item>
          <Form.Item name="sort" label="排序" rules={[{ required: true, message: '请输入排序' }]}> <Input type="number" /> </Form.Item>
          {editingCourse && (
            <Form.Item name="status" label="状态" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="draft">草稿</Select.Option>
                <Select.Option value="published">已发布</Select.Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
}