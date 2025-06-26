// 测试Timeline的展示效果
import { Timeline } from "antd";


export default function TimelinePage() {
    const items = [{ children: 'sample', label: 'sample' }];
    return <Timeline items={items} />;
}
