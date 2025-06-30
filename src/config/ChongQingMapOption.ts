import type {EChartsOption } from 'echarts-for-react';


export default function ChongQingMapOption({data, max}:{
    data: {name:string, value:number}[],
    max: number
}): EChartsOption {
    return {
        // backgroundColor: 'rgba(12, 32, 56, 0.8)',
        animation: true,
        animationDuration: 2000,
        animationEasing: 'cubicOut',
        tooltip: {
            backgroundColor: 'rgba(50, 50, 50, 0.7)',
            borderColor: '#333',
            textStyle: {
                color: '#fff'
            },
            trigger: 'item',
            formatter: (params) => {
                return `${params.name}<br/>数值：${params.value || 0}`;
            }
        },
        title: {
            text: '重庆中药材分布图',
            textStyle: {
                color: '#FFF',
                fontWeight: 'bold',
                fontSize: 32
            },
            left: 'center',
            top: 20
        },
        visualMap: [{ // 热力图
            min: 0,
            max: max,
            inRange: {
                color: ['#5B8FF9', '#61DDAA', '#F6BD16', '#F6903D', '#E8684A']
            },
            text: ['高值', '低值'],
            textStyle: {
                color: '#FFF'
            },
            calculable: true,
            bottom: 40,
            left: 40,
        }],
        series: [{
            type: 'map',
            map: 'chongQing', // 这里必须已经通过 registerMap 注册过
            roam: true,
            label: {
                show: true,//显示标签
                formatter: (params:{ name: string; value: number }) => {
                    return params?.name || ''
                },
            },
            layoutCenter: ['45%', '50%'],
            layoutSize: '80%',
            emphasis: { // 鼠标移入
                itemStyle: {
                    color: '#2a333d',
                    borderColor: '#111',
                    shadowBlur: 10,
                    shadowColor: 'rgba(255, 165, 0, 0.8)' // 光晕
                }
            },
            data: data,
        }]
    }
}