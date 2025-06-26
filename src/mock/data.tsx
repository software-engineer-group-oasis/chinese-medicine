import Link from 'next/link'
import type { TableProps } from 'antd';

interface DataType {
    key: string;
    name: string;
    efficacy: string;
    address: string;
}


export const mockTableData= [
    {
        key: '1',
        name: '灵芷安',
        efficacy: '灵动如芷，安神定志',
        address: '西湖区湖底公园1号',
    },
    {
        key: '2',
        name: '云茯神',
        efficacy: '出自山野云端，宁心安神',
        address: '西湖区湖底公园1号',
    },
    {
        key: '3',
        name: '夜寒花',
        efficacy: "夜中绽放，清热解毒",
        address: '西湖区湖底公园1号',
    },
    {
        key: '4',
        name: '青黛莲',
        efficacy: "色泽青幽，凉血清肝",
        address: '西湖区湖底公园1号',
    },
    {
        key: '5',
        name: '白羽参',
        efficacy: '形似羽毛，补气养元',
        address: '西湖区湖底公园1号',
    },
    {
        key: '6',
        name: '紫苏子',
        efficacy: '温肺止咳，理气宽中',
        address: '西湖区湖底公园1号',
    },
    {
        key: '7',
        name: '玉兰茸',
        efficacy: '取自玉兰花，芳香通窍',
        address: '西湖区湖底公园1号',
    },
];

export const columns: TableProps<DataType>['columns'] = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        render: (text) => (<Link href={`/herb?id=${text}`}>{text}</Link>)
    },
    {
        title: '功效',
        dataIndex: 'efficacy',
        key: 'efficacy',
    },
    {
        title: '产地',
        dataIndex: 'address',
        key: 'address',
    },
];