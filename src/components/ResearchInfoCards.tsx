import { Card } from "antd";
import ReactECharts from "echarts-for-react";

const cards = [
    {
        title: '论文',
        text: '这里是一些论文的展示',
    },
    {
        title: '数据集',
        text: '这里是一些数据集的展示',
    },
    {
        title: '专利',
        text: '这里是一些专利的展示',
    },
];

// 新增科研统计数据
const researchStats = {
    categories: ['中药配方', '临床研究', '药材分析', '药理实验', '文献综述'],
    data: [125, 89, 230, 175, 300]
};

// 柱状图配置
const barChartOption = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    xAxis: {
        type: 'category',
        data: researchStats.categories,
        axisLabel: {
            rotate: 45
        }
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        name: '数量',
        type: 'bar',
        data: researchStats.data,
        itemStyle: {
            color: '#4096ff'
        }
    }]
};

export default function ResearchInfoCards() {
    return (
        <>
            <div className={'wrapper'}>
                <video src={'/科学数据.mp4'} autoPlay muted loop id={'video'}></video>
                <div id={'info-cards'} className={'flex flex-col items-center'}>
                    <h1 className={'text-4xl text-white font-bold py-4'}>xxx课题组的数据汇交</h1>

                    {/* 卡片展示 */}
                    <div className={'flex gap-8 mb-12'}>
                        {cards.map((item, index) => (
                            <Card key={index} title={item.title} hoverable>
                                <p>{item.text}</p>
                            </Card>
                        ))}
                    </div>

                    {/* 数据统计标题 */}
                    <h2 className={'text-2xl text-white font-semibold mb-4'}>科研数据统计报表</h2>

                    {/* 图表说明 */}
                    <p className={'text-white mb-6 text-center px-4'}>
                        下方图表展示了近一年内各类科研数据的收录情况：
                    </p>

                    {/* 统计图表 */}
                    <div className={'w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg'}>
                        <ReactECharts
                            option={barChartOption}
                            style={{ height: 400 }}
                            opts={{ renderer: 'canvas' }}
                        />
                    </div>
                </div>
            </div>
            <style jsx>{`
                #wrapper {
                    position: relative;
                }
                #info-cards {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    width: 100%;
                    padding: 0 2rem;
                    box-sizing: border-box;
                }
                .ant-card {
                    width: 240px;
                }
            `}</style>
        </>
    );
}
