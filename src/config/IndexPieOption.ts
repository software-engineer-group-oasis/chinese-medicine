import echarts from "echarts";
type pieOptionProps = {
    data: {
        name:string,
        value:number
    }[]
}
export default function IndexPieOption({data}:pieOptionProps):echarts.EChartOption {
    return {
        title: {
            text: '重庆主要中药材占比',
            left: 'center',
            textStyle: {
                color: '#FFF',
                fontSize: 24,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)',
            backgroundColor: 'rgba(50, 50, 50, 0.7)',
            textStyle: {
                color: '#fff'
            }
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            textStyle: {
                color: '#FFF'
            }
        },
        series: [
            {
                name: '中药材占比',
                type: 'pie',
                radius: ['30%', '50%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: true,
                    formatter: '{b}: {d}%',
                    color: '#FFF'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 16,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: true
                },
                data: data
            }
        ],
        animation: true,
        animationEasing: 'elasticOut',
    };
}