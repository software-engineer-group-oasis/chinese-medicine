import React from 'react';
import type { ColumnType, ColumnGroupType } from 'antd/es/table';

/**
 * 通用表格列 render 工厂函数
 * @param columns 列配置（常量）
 * @param renderMap { [dataIndex]: (value, record, index) => React.ReactNode }
 * @param handlers 业务操作回调（如 onViewDetail）
 */
export function getTableColumnRenders<T = any>(
  columns: (ColumnType<T> | ColumnGroupType<T>)[],
  renderMap: Record<string, (value: any, record: T, index: number, handlers?: any) => React.ReactNode> = {},
  handlers?: Record<string, (...args: any[]) => void>
): (ColumnType<T> | ColumnGroupType<T>)[] {
  return columns.map((col) => {
    // 兼容分组列
    if ('children' in col && col.children) {
      return {
        ...col,
        children: getTableColumnRenders(col.children, renderMap, handlers),
      };
    }
    // 根据 dataIndex 注入 render
    if ('dataIndex' in col && col.dataIndex && renderMap[col.dataIndex as string]) {
      return {
        ...col,
        render: (value: any, record: T, index: number) =>
          renderMap[col.dataIndex as string]?.(value, record, index, handlers),
      };
    }
    return col;
  });
}
