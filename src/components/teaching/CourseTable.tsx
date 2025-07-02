import React from 'react';
import Table from 'antd/es/table';
import Tag from 'antd/es/tag';
import Button from 'antd/es/button';
import Space from 'antd/es/space';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { TableRowSelection } from 'antd/es/table/interface';

export interface CourseRecord {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  tagIds: string[];
  sort: number;
  status: 'draft' | 'published';
}

interface CourseTableProps {
  dataSource: CourseRecord[];
  categories: { id: string; name: string }[];
  tags: { id: string; name: string }[];
  loading?: boolean;
  onEdit?: (record: CourseRecord) => void;
  onDelete?: (record: CourseRecord) => void;
  filterText?: string;
  onFilterTextChange?: (text: string) => void;
  rowSelection?: TableRowSelection<CourseRecord>;
}

export const CourseTable: React.FC<CourseTableProps> = ({
  dataSource,
  categories,
  tags,
  loading,
  onEdit,
  onDelete,
  filterText = '',
  onFilterTextChange,
  rowSelection,
}) => {
  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || '-';
  const getTagNames = (ids: string[]) => tags.filter(t => ids.includes(t.id)).map(t => t.name);

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: CourseRecord) => (
        <Space>
          <span className="font-semibold">{text}</span>
          {record.status === 'draft' && <Tag color="orange">草稿</Tag>}
          {record.status === 'published' && <Tag color="blue">已发布</Tag>}
        </Space>
      )
    },
    {
      title: '简介',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '类别',
      dataIndex: 'categoryId',
      key: 'categoryId',
      render: (id: string) => getCategoryName(id)
    },
    {
      title: '标签',
      dataIndex: 'tagIds',
      key: 'tagIds',
      render: (ids: string[]) => getTagNames(ids).map(name => <Tag key={name}>{name}</Tag>),
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 60
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_: any, record: CourseRecord) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => onEdit?.(record)}>编辑</Button>
          <Button type="link" icon={<DeleteOutlined />} danger onClick={() => onDelete?.(record)}>删除</Button>
        </Space>
      )
    }
  ];

  // 简单文本筛选
  const filteredData = filterText
    ? dataSource.filter(item =>
        item.title.includes(filterText) ||
        item.description.includes(filterText)
      )
    : dataSource;

  return (
    <div>
      {onFilterTextChange && (
        <Space className="mb-4">
          <input
            className="ant-input"
            style={{ width: 240 }}
            placeholder="搜索课程标题/简介"
            value={filterText}
            onChange={e => onFilterTextChange(e.target.value)}
          />
        </Space>
      )}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        pagination={{ pageSize: 10 }}
        rowSelection={rowSelection}
      />
    </div>
  );
};
