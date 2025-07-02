import React from 'react';
import Tag from 'antd/es/tag';
import Button from 'antd/es/button';

export const evaluationRenderMap = {
  appearanceScore: (score: number) => {
    let color = '#1677ff';
    if (score >= 4.5) color = '#52c41a';
    else if (score >= 4) color = '#1677ff';
    else if (score >= 3) color = '#faad14';
    else color = '#f5222d';
    return <span style={{ color, fontWeight: 500 }}>{score}</span>;
  },
  contentScore: (score: number) => {
    let color = '#1677ff';
    if (score >= 90) color = '#52c41a';
    else if (score >= 80) color = '#1677ff';
    else if (score >= 70) color = '#faad14';
    else color = '#f5222d';
    return <span style={{ color, fontWeight: 500 }}>{score}%</span>;
  },
  overallResult: (result: string) => {
    let color = '#1677ff';
    if (result === '优秀') color = '#52c41a';
    else if (result === '良好') color = '#1677ff';
    else if (result === '合格') color = '#faad14';
    else if (result === '待改进') color = '#fa8c16';
    else if (result === '不合格') color = '#f5222d';
    return <Tag color={color}>{result}</Tag>;
  },
  hasEvidence: (has: boolean) =>
    has ? <Tag color="success">有</Tag> : <Tag color="default">无</Tag>,
  operation: (_: any, record: any, _idx: number, handlers: any) => (
    <Button type="link" size="small" onClick={() => handlers?.onViewDetail(record)}>
      查看详情
    </Button>
  ),
};
