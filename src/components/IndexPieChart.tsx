import ReactEcharts from "echarts-for-react";
import React, {useEffect} from "react";
import echarts from "echarts";
import axiosInstance from "@/api/config";
import {StatsByHerb} from "@/constTypes/herbs";

export default function IndexPieChart({pieOption}: {pieOption: echarts.EChartOption}) {
    return (
      <>
          <div id={'pieChart-wrapper'}>
              <div id={'pieChart'}>
                  <ReactEcharts
                      option={pieOption}
                      style={{ width: '100%', height: '100%' }}
                  />
              </div>

          </div>
          <style jsx>{`
            #pieChart-wrapper {
                background-image: url('/images/box1_bg.png');
                background-size: contain; // 整张图片显示
                background-repeat: no-repeat;
                background-position: center;
                width: 100%;
                height: auto;
                aspect-ratio: 567/343;
                position: relative;
            }
            #pieChart {
                position: absolute;
                left: 10%;
                top: 12%;
                width: 100%;
                height: 100%;
            }
          `}
          </style>
      </>

  );
}