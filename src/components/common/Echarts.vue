<template>
  <div :id="`echarts-box${id}`" :style="{height:height,width:width}"></div>
</template>
<script>
// 引入 echarts 主模块。
import * as Echarts from "echarts/lib/echarts";
// 引入折线图,柱状图
import "echarts/lib/chart/line";
import "echarts/lib/chart/bar";
// 引入提示框组件、标题组件、工具箱组件、图例。

import "echarts/lib/component/tooltip";
import "echarts/lib/component/legend";
import "echarts/lib/component/dataZoom";
// import "echarts/lib/component/title";
// import "echarts/lib/component/toolbox";
import {GetFormatDateTime} from '../../utils/public';
import { infusionPump, water, monitor,testTrend } from "@/module/echartsOption";
import { mapGetters } from "vuex";
const COLOR= {
      "脉搏(次/分)": "#FF6E6E",
      "呼吸频率(次/分)": "#5B5BF3",
      "血氧饱和度(%)": "#ECDF56",
      "收缩压(次/分)": "#18B853",
      "舒张压(次/分)": "#CA5CED",
       "体温(℃)": "#4A9EFF",
       "心率(次/分)": "#FFC64A",
       "输液": "#0071E7",
       "呼吸": "#0071E7",
       }

export default {
  name: "Echarts",
  data() {
    return {
      myChart: "",
      arr:[]
    };
  },
  mounted() {
    this.myChart = Echarts.init(
      document.getElementById(`echarts-box${this.id}`)
    );
  },
  computed: {
    ...mapGetters({
      collapse: "public/GET_COLLAPSE",
      isShowList: "public/GET_ISSHOWLIST",
      timeArr:"public/GET_TIMEARR"
    })
  },
  watch: {
    // 改变尺寸
    collapse() {
      console.log('改变echarts尺寸')
      this.myChart && this.myChart.resize();
    },
    // 改变尺寸
    isShowList() {
      console.log('患者列表展开折叠')
      setTimeout(() => {
        this.myChart && this.myChart.resize();
      }, 300);
    },
    echartsData(val) {
      this.myChart.clear();
console.log(val,'echarts图表数据')
      if (val.Columns&&val.Columns[0]) {
        if (this.type !== "") {
          this.getWaterData(val);
        }else{
          this.dataTreating(val);
        }
      }else{
        if(this.type=='trend'){
          // 检验指标趋势图
          this.getTestDataTrend(val)
        }
      }
    }
  },
  props: {
    echartsData: {
      type: [Object,Array],
      define: "require"
    },
    id: {
      type: String,
      default: "echarts-box"
    },
    width: {
      type: String,
      default: "94%"
    },
    height: {
      type: String,
      default: "350px"
    },
    genre: {
      type: Number,
      default: -1
    },
    type: {
      type: String,
      default: ""
    }
  },
  methods: {
    showLoading(){
      this.myChart.showLoading('default', {
  text: 'loading',
  color: '#c23531',
  textColor: '#000',
  maskColor: 'rgba(255, 255, 255, 0.8)',
  zlevel: 0
})
    },
    setDataZoom(end) {
      this.myChart.dispatchAction({
        type: "dataZoom",
        // 可选，dataZoom 组件的 index，多个 dataZoom 组件时有用，默认为 0
        dataZoomIndex: 0,

        // 开始位置的数值
        startValue: 0,
        // 结束位置的数值
        endValue: end
      });
    },
    // 检验指标趋势
    getTestDataTrend(data) {
      let xData = []
      let seriesData = []
      data.forEach(item => {
        xData.push(item.ReportDate.slice(0,10))
        seriesData.push(item.ItemValue)
      })
      testTrend.xAxis.data = xData
      testTrend.yAxis.name = data[0].ItemName+'('+data[0].Unit+')'
      testTrend.series[0].data = seriesData
      testTrend.title.text = data[0].ItemName+'趋势图'
      console.log(JSON.stringify(testTrend),'图表')
      this.myChart.setOption(testTrend)
    },
    getWaterData(data) {
      let width = this.myChart._dom.clientWidth - 996;
      water.xAxis.data = data.Columns;
      water.legend[0].data = [];
      water.legend[1].data = [];
      water.legend[2].data = [];
      water.series = [];
      water.color = [];

      data.Items.forEach((el, index) => {
        const ITEM = {
          name: "",
          type: "bar",
          symbolSize: 5,
          // showSymbol: false, //默认是否显示标记
          symbol: "circle", //标记样式
          data: []
        };
        ITEM.name = el.m_Item1;
        if (el.m_Item3 === 0) {
          ITEM.stack = "总量";
          ITEM.barMaxWidth = 40;
          // water.legend[1].left = 480+width
          water.legend[1].data.push(el.m_Item1);
        } else if (el.m_Item3 === 1) {
          ITEM.stack = "总量";
          ITEM.barMaxWidth = 40;
          // water.legend[2].left = 480+width

          water.legend[2].data.push(el.m_Item1);
        } else {
          // water.legend[0].left = 340+width
          water.legend[0].data.push(el.m_Item1);
        }

        ITEM.data = el.m_Item4.map(item => {
          if (el.m_Item3 === 0) {
            item[1] = +item[1];
          } else if (el.m_Item3 === 1) {
                  if (el.m_Item1==='便量') {
            item[2] = item[1];
            item[1] = -0;
            } else {
            item[1] = -item[1];
              
            }
          } else {
            this.i = index;
            item[1] = +item[1];
            ITEM.type = "line";
          }

          return item;
        });
        water.color[index] = el.m_Item2;
        water.series[index] = ITEM;
      });
      let h = water.legend[1].data.length;
      water.legend[0].textStyle.rich.b.padding = [-68 - h * 40, 57, 0, 0];
      water.legend[2].top = 80 + h * 20;
      if (this.genre !== -1) {
        water.series.splice(this.i, 1);
        water.color.splice(this.i, 1);
      }
      this.myChart.setOption(water);
    },
    // 仪器过滤的时间范围
      labelFormatter(value){
    value=value<this.echartsData.Columns.length?value:this.echartsData.Columns.length-1;
    let time=GetFormatDateTime('yyyy-MM-dd HH:mm',new Date(this.echartsData.Columns[value]))
    
    // let time=GetFormatDateTime('yyyy-MM-dd HH:mm',new Date(value))
    if (!this.count) {
       this.$store.commit('public/SET_TIMEARR',[time,null])
      // this.arr=[value,null];
      this.count=1
    } else {
      this.$store.commit('public/SET_TIMEARR',[this.timeArr[0],time])
       
      this.count=0
    }
    return time;
},
// getMax(value){
//   this.max=value.max
//   this.min=this.max<=42?value.min-2:value.min<10?0:value.min-10;
//   console.log(value);
//   return this.max
// },
// // 设置Y轴缩放组件
//  setYZoom() {
//    console.log(2222);
//       this.myChart.dispatchAction({
//         type: "dataZoom",
//         // 可选，dataZoom 组件的 index，多个 dataZoom 组件时有用，默认为 0
//         dataZoomIndex: 2,

//         // 开始位置的数值
//         startValue: this.min,
//         // 结束位置的数值
//         endValue: this.max
//       });
//     },
    // 数据处理
    dataTreating(data) {
      // data.Columns.unshift(0);
      let option = data.Rows.length == 1 ?  infusionPump:monitor;
      option.dataZoom[0].labelFormatter=this.labelFormatter
      // option.xAxis.data = data.Columns;
      // option.yAxis.max=this.getMax
      option.series = [];
      option.color = [];
      option.xAxis.data=data.Columns
      data.Rows.forEach((el, index) => {
        const ITEM = {
          name: "",
          type: "line",
          yAxisIndex: 0,
          symbolSize: 5,
          // showSymbol: false, //默认是否显示标记
          symbol: "circle", //标记样式
          data: []
        };
        ITEM.name = el.Name;
        // ITEM.yAxisIndex = el.m_Item1 === "体温" ? 1 : 0;

        ITEM.data = el.Data
        option.color[index] = COLOR[el.Name];
        option.series[index] = ITEM;
      });
      this.myChart.setOption(option);
      this.myChart.hideLoading()
//               this.setYZoom()
// if (data.Items.length > 1) {
//   this.myChart.off('legendselectchanged', this.setYZoom);//注销事件
//   this.myChart.on('legendselectchanged', this.setYZoom);
// }

      // this.myChart.getZr().on("click", params => {
      //   const pointInPixel = [params.offsetX, params.offsetY];
      //   console.log(params);
      //   if (this.myChart.containPixel("grid", pointInPixel)) {
      //     let xIndex = this.myChart.convertFromPixel({ seriesIndex: 0 }, [
      //       params.offsetX,
      //       params.offsetY
      //     ]);
      //     console.log(xIndex); /*事件处理代码书写位置*/
      //   }
      // });
    }
  }
};
</script>

