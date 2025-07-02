"use client"
import { useState } from 'react';
import Card from 'antd/es/card';
import Table from 'antd/es/table';
import Button from 'antd/es/button';
import Tag from 'antd/es/tag';
import Space from 'antd/es/space';
import { PlusOutlined, DeleteOutlined, EyeOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { mockResources } from '@/mock/teaching';
import AdminBreadcrumb from '@/components/AdminBreadcrumb';
import Modal from 'antd/es/modal';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Select from 'antd/es/select';
import { message, Popconfirm, Upload } from 'antd';
import type { UploadProps } from 'antd';

export default function ResourcesPage() {
  const [resources, setResources] = useState(mockResources);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewResource, setPreviewResource] = useState<any>(null);
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [fileList, setFileList] = useState<any[]>([]);

  // 预览资源
  const handlePreview = (record: any) => {
    setPreviewResource(record);
    setPreviewVisible(true);
  };

  // 下载资源
  const handleDownload = (record: any) => {
    // 模拟下载，实际项目中应该调用API获取文件URL
    message.success(`开始下载: ${record.name}`);
    // 更新下载次数
    setResources(resources.map(item => {
      if (item.id === record.id) {
        return { ...item, downloadCount: item.downloadCount + 1 };
      }
      return item;
    }));
  };

  // 删除资源
  const handleDelete = (id: string) => {
    setResources(resources.filter(resource => resource.id !== id));
    message.success('删除成功');
    setSelectedRowKeys(selectedRowKeys.filter(key => key !== id));
  };

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的资源');
      return;
    }
    setResources(resources.filter(resource => !selectedRowKeys.includes(resource.id)));
    message.success('批量删除成功');
    setSelectedRowKeys([]);
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span className="font-semibold">{text}</span>
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        let color = 'blue', label = '视频';
        if (type === 'pdf') { color = 'red'; label = 'PDF文档'; }
        else if (type === 'ppt') { color = 'purple'; label = 'PPT'; }
        else if (type === 'video') { color = 'blue'; label = '视频'; }
        return <Tag color={color}>{label}</Tag>;
      }
    },
    {
      title: '下载次数',
      dataIndex: 'downloadCount',
      key: 'downloadCount',
      width: 100
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => handlePreview(record)}>预览</Button>
          <Button type="link" icon={<DownloadOutlined />} onClick={() => handleDownload(record)}>下载</Button>
          <Popconfirm title="确定要删除该资源吗？" onConfirm={() => handleDelete(record.id)} okText="删除" cancelText="取消">
            <Button type="link" icon={<DeleteOutlined />} danger>删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 文件上传配置
  const uploadProps: UploadProps = {
    onRemove: file => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: file => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  // 新增资源提交
  const handleAddResource = () => {
    form.validateFields().then(values => {
      if (fileList.length === 0) {
        message.error('请上传文件');
        return;
      }

      const newResource = {
        id: Date.now().toString(),
        name: values.name || fileList[0].name,
        type: values.type,
        downloadCount: 0,
        file: fileList[0],
      };
      setResources([newResource, ...resources]);
      setIsModalOpen(false);
      form.resetFields();
      setFileList([]);
      message.success('上传成功');
    }).catch(() => {
      message.error('请检查输入');
    });
  };

  return (
    <div className="p-6">
      <AdminBreadcrumb className="mb-4" items={[
        { title: '教学实验管理', href: '/admin/teaching' },
        { title: '资源管理' }
      ]} />
      <Card bordered={false} className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold mb-1">资源管理</h1>
            <div className="text-gray-500">上传、预览、下载课程视频和文档</div>
          </div>
          <div>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>上传资源</Button>
            <Button className="ml-2" danger disabled={selectedRowKeys.length === 0} onClick={handleBatchDelete}>批量删除</Button>
          </div>
        </div>
      </Card>
      <Card bordered={false}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={resources}
          pagination={{ pageSize: 10 }}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
        />
      </Card>
      <Modal
        title="上传资源"
        open={isModalOpen}
        onOk={handleAddResource}
        onCancel={() => {
          setIsModalOpen(false);
          setFileList([]);
          form.resetFields();
        }}
        okText="上传"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="资源名称"
            rules={[{ required: false, message: '请输入资源名称' }]}
          >
            <Input placeholder="请输入资源名称（可选，默认使用文件名）" />
          </Form.Item>
          <Form.Item
            name="type"
            label="资源类型"
            rules={[{ required: true, message: '请选择资源类型' }]}
          >
            <Select placeholder="请选择类型">
              <Select.Option value="video">视频</Select.Option>
              <Select.Option value="pdf">PDF文档</Select.Option>
              <Select.Option value="ppt">PPT</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="上传文件"
            required
          >
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>选择文件</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="资源预览"
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={800}
      >
        {previewResource && (
          <div className="p-4">
            <h2 className="text-xl mb-4">{previewResource.name}</h2>
            {previewResource.type === 'video' && (
              <div className="bg-gray-100 p-8 text-center rounded">
                <p className="text-gray-500">视频预览（实际项目中应嵌入视频播放器）</p>
              </div>
            )}
            {previewResource.type === 'pdf' && (
              <div className="bg-gray-100 p-8 text-center rounded">
                <p className="text-gray-500">PDF预览（实际项目中应嵌入PDF查看器）</p>
              </div>
            )}
            {previewResource.type === 'ppt' && (
              <div className="bg-gray-100 p-8 text-center rounded">
                <p className="text-gray-500">PPT预览（实际项目中应嵌入PPT查看器）</p>
              </div>
            )}
            <div className="mt-4 text-right">
              <Button type="primary" icon={<DownloadOutlined />} onClick={() => {
                handleDownload(previewResource);
                setPreviewVisible(false);
              }}>下载</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}