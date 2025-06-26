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

export const chongQingHerbs = [
    {
        name: "黄连",
        image: "/images/黄连.jpg",
        description: "重庆石柱县是著名的“黄连之乡”，所产黄连（味连）以根茎粗壮、苦味浓郁著称. 清热燥湿、泻火解毒。常用于湿热痞满、高热神昏等症。现代研究证实其含小檗碱，具抗菌消炎作用。"
    },
    {
        name: "川贝母",
        image: "/images/川贝母.jpg",
        description: "主产于重庆大巴山高海拔地区，以“松贝”为优，形似怀中抱月，质地细腻。润肺止咳，尤擅治疗肺热燥咳。常与雪梨、冰糖炖服，为川渝地区传统润肺方。"
    },
    {
        name: "金钱草",
        image: "/images/金钱草.webp",
        description: "重庆湿润山谷常见，叶片如铜钱，茎匍匐生长。利湿退黄、利尿通淋，是治疗胆结石、尿路结石的要药。当地草药铺常配鸡内金增强排石效果。"
    },
    {
        name: "杜仲",
        image: "/images/杜仲.webp",
        description: "重庆三峡库区多产，树皮折断可见银白色胶丝。补肝肾、强筋骨，高血压患者常用杜仲叶泡茶。其胶丝为天然橡胶原料，体现“药效与物理特性关联”的中医智慧。"
    },
    {
        name: "何首乌",
        image: "/images/何首乌.webp",
        description: "重庆武陵山区野生何首乌块根表面多凹凸瘤状，断面云锦花纹明显。制首乌补益精血，生首乌解毒截疟。当地土家族有九蒸九晒炮制传统。"
    }
]