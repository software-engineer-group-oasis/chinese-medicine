import React from 'react';
import { Pagination as AntPagination, Typography } from 'antd';

interface PaginationProps {
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
  pageSizeOptions?: string[];
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  current,
  pageSize,
  total,
  onChange,
  pageSizeOptions = ['4', '8', '12', '16'],
  className = '',
}) => {
  return (
    <div className={`flex justify-center ${className}`}>
      <AntPagination
        current={current}
        pageSize={pageSize}
        total={total}
        showTotal={(total) => <Typography.Text type="secondary">共 {total} 条记录</Typography.Text>}
        onChange={(newPage, newPageSize) => {
          onChange(newPage, newPageSize || pageSize);
        }}
        showSizeChanger
        pageSizeOptions={pageSizeOptions}
      />
    </div>
  );
};

export default Pagination;