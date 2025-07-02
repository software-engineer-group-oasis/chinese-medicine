import type { ColumnsType } from 'antd/es/table';

export const EVALUATION_COLUMNS: ColumnsType<any> = [
  {
    title: '药材名称',
    dataIndex: 'herbName',
    key: 'herbName',
    sorter: (a, b) => a.herbName.localeCompare(b.herbName),
  },
  {
    title: '评价日期',
    dataIndex: 'evaluationDate',
    key: 'evaluationDate',
    sorter: (a, b) => new Date(a.evaluationDate).getTime() - new Date(b.evaluationDate).getTime(),
  },
  {
    title: '评价人员',
    dataIndex: 'evaluator',
    key: 'evaluator',
  },
  {
    title: '评价标准',
    dataIndex: 'standardName',
    key: 'standardName',
    render: (text: string, record: any) => `${text} (${record.standardVersion})`,
  },
  {
    title: '外观评分',
    dataIndex: 'appearanceScore',
    key: 'appearanceScore',
    sorter: (a, b) => a.appearanceScore - b.appearanceScore,
  },
  {
    title: '成分含量(%)',
    dataIndex: 'contentScore',
    key: 'contentScore',
    sorter: (a, b) => a.contentScore - b.contentScore,
  },
  {
    title: '来源渠道',
    dataIndex: 'sourceChannel',
    key: 'sourceChannel',
    filters: [
      { text: '自有种植基地', value: '自有种植基地' },
      { text: '合作社', value: '合作社' },
      { text: '市场采购', value: '市场采购' },
      { text: '其他来源', value: '其他来源' },
    ],
    onFilter: (value, record) => record.sourceChannel === value,
  },
  {
    title: '评价结果',
    dataIndex: 'overallResult',
    key: 'overallResult',
    filters: [
      { text: '优秀', value: '优秀' },
      { text: '良好', value: '良好' },
      { text: '合格', value: '合格' },
      { text: '待改进', value: '待改进' },
      { text: '不合格', value: '不合格' },
    ],
    onFilter: (value, record) => record.overallResult === value,
  },
  {
    title: '佐证材料',
    dataIndex: 'hasEvidence',
    key: 'hasEvidence',
    filters: [
      { text: '有', value: true },
      { text: '无', value: false },
    ],
    onFilter: (value, record) => record.hasEvidence === value,
  },
];

export const EVALUATION_FILTERS = [
  { name: 'herbName', label: '药材名称', type: 'input' },
  { name: 'dateRange', label: '评价日期范围', type: 'rangePicker' },
  { name: 'evaluator', label: '评价人员', type: 'select', options: ['张医师', '李研究员', '王主任', '赵博士'] },
  { name: 'standard', label: '评价标准', type: 'select', options: ['通用中药材评价标准 v3.0', '通用中药材评价标准 v2.5', '道地药材专用评价标准 v1.5'] },
  { name: 'appearanceScoreRange', label: '外观评分范围', type: 'radio', options: ['全部', '4.5-5', '4-4.5', '3-4', '0-3'] },
  { name: 'contentScoreRange', label: '成分含量范围', type: 'radio', options: ['全部', '90-100', '80-90', '70-80', '0-70'] },
  { name: 'sourceChannel', label: '来源渠道', type: 'checkbox', options: ['自有种植基地', '合作社', '市场采购', '其他来源'] },
  { name: 'overallResult', label: '评价结果', type: 'checkbox', options: ['优秀', '良好', '合格', '待改进', '不合格'] },
  { name: 'hasEvidence', label: '佐证材料', type: 'radio', options: ['全部', '有', '无'] },
];

export const RESULT_OPTIONS = [
  { text: '优秀', value: '优秀' },
  { text: '良好', value: '良好' },
  { text: '合格', value: '合格' },
  { text: '待改进', value: '待改进' },
  { text: '不合格', value: '不合格' },
];
