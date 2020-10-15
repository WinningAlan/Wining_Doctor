import {
  createZero,GetFormatDateTime
} from "@/utils/public";
const dataZoom = [{
    show: true,
    realtime: true,
    start: 0,
    end:100,
    xAxisIndex: 0,
    backgroundColor: '#DFE7F5',
    borderColor: '#DFE7F5',
    fillerColor: "#fff",
    height: 10,
    bottom: 10,
    left: 110,
    right: 160,
  handleSize: 30,
  minValueSpan: 1,

  textStyle: {
    color:'rgba(0, 6, 34,.5)'
  },
    dataBackground: {
      lineStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: '#DFE7F5' // 0% 处的颜色
          }, {
            offset: 1,
            color: '#DFE7F5' // 100% 处的颜色
          }],
          global: false // 缺省为 false
        }
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: '#DFE7F5' // 0% 处的颜色
          }, {
            offset: 1,
            color: '#DFE7F5' // 100% 处的颜色
          }],
          global: false // 缺省为 false
        }
      }
    }
    // handleSize:' 60 %',
  },
  {
    type: 'inside',
    realtime: true,
    start: 30,
    end: 70,

    minValueSpan: 1,
    maxSpan: 100,
    AxisIndex: 0
  },
  // {
  //   show: true,
  //   realtime: true,
  //   // start: 0,
  //   // end: 100,
  //   left: 10,
  //   width: 10,
  //   minValueSpan: 1,

  //   filterMode:'none',
  //   yAxisIndex: 0,
  //   handleSize: 30,
  //   textStyle: {
  //     color:'rgba(0, 6, 34,.5)'
  //   },
  //   backgroundColor: '#DFE7F5',
  //   borderColor: '#DFE7F5',
  //   fillerColor: "#fff",
  //   dataBackground: {
  //     lineStyle: {
  //       color: {
  //         type: 'linear',
  //         x: 0,
  //         y: 0,
  //         x2: 0,
  //         y2: 1,
  //         colorStops: [{
  //           offset: 0,
  //           color: '#DFE7F5' // 0% 处的颜色
  //         }, {
  //           offset: 1,
  //           color: '#DFE7F5' // 100% 处的颜色
  //         }],
  //         global: false // 缺省为 false
  //       }
  //     },
  //     areaStyle: {
  //       color: {
  //         type: 'linear',
  //         x: 0,
  //         y: 0,
  //         x2: 0,
  //         y2: 1,
  //         colorStops: [{
  //           offset: 0,
  //           color: '#DFE7F5' // 0% 处的颜色
  //         }, {
  //           offset: 1,
  //           color: '#DFE7F5' // 100% 处的颜色
  //         }],
  //         global: false // 缺省为 false
  //       }
  //     }
  //   }
  // },
  // {
  //   type: 'inside',
  //   realtime: true,
  //   start: 30,
  //   end: 70,
  //   minSpan: 0,
  //   maxSpan: 100,
  //   yAxisIndex: 0,
  //   filterMode: 'none',
  // },
]


const tooltip={
  trigger: "axis",
  textStyle: {
    fontSize: 12,
    color: "#666666",
    fontFamily: "SourceHanSans-Regular"
  },
  // 提示框位置
  position: function (point, params, dom, rect, size) {
    let left = point[0] + size.contentSize[0]/4;
    let top = point[1] - size.contentSize[1] /2;
    return [left, top];
  },
  padding: 14,
  backgroundColor: "#FFFFFF",
  extraCssText: "box-shadow: 0 0 5px 0 rgba(57,109,178,0.50);border-radius: 2px 2px 2px 0px 0px 0px 2px;",
  axisPointer: {
    lineStyle: {
      type: "dashed"
    }
  },
  formatter: function (params) {
    var res = "" + params[0].name;
    for (var i = 0, l = params.length; i < l; i++) {
      res += `<br/>${
        params[i].seriesName
      }：<span class="echarts-tip" style="color:${params[i].color};">${params[i].seriesName==='平衡量'?params[i].value[1]:params[i].seriesName==='便量'?params[i].value[2]:Math.abs(params[i].value[1])}</span>`;
    }
    return res;
  }
}

const yqTooltip={
  trigger: "axis",
  textStyle: {
    fontSize: 12,
    color: "#666666",
    fontFamily: "SourceHanSans-Regular"
  },
  // 提示框位置
  position: function (point, params, dom, rect, size) {
    let left = point[0] + size.contentSize[0]/4;
    let top = point[1] - size.contentSize[1] /2;
    return [left, top];
  },
  padding: 14,
  backgroundColor: "#FFFFFF",
  extraCssText: "box-shadow: 0 0 5px 0 rgba(57,109,178,0.50);border-radius: 2px 2px 2px 0px 0px 0px 2px;",
  axisPointer: {
    lineStyle: {
      type: "dashed"
    }
  },
  formatter: function (params) {
    var res = "" + GetFormatDateTime("yyyy/MM/dd HH:mm",new Date(params[0].name));
    // console.log(params,11111111111);
    for (var i = 0, l = params.length; i < l; i++) {
      res += `<br/>${
        params[i].seriesName
      }：<span class="echarts-tip" style="color:${params[i].color};">${Math.abs(
        params[i].value) 
      }</span>`;
    }
    return res;
  }
}
// 输液泵数据 呼吸机
export const infusionPump = {
  tooltip:yqTooltip,
  legend: {
    // right: 60
    // type: 'scroll',
    orient: 'vertical',
    right: 0,
    top: 20,
    bottom: 35
  },
  grid: {
    top: 20,
    left: 45,
    right: 160,
    bottom: 35,
    containLabel: true
  },
  color: [],
  xAxis: {
    type: "category",
    boundaryGap: false,
    // boundaryGap: ['30%', '20%'],
    axisLine: {
      onZero:true,
      lineStyle: {
        color: "rgba(192, 203, 233,.4)"
      }
    },
    splitLine: {
      lineStyle: {
        color: "#E0E0E0"
      }
    },
    axisTick: {
      alignWithLabel: true
    },
    axisLabel: {
      color:'rgba(0, 6, 34,.5)',
      formatter: function (value,index) {
        // 格式化成月/日，
        // if (value == 0) {
        //   return "";
        // }
        if (!index) return '';

        var date = new Date(value);
        var texts = [date.getMonth() + 1, date.getDate()];
        texts = texts.map(item => {
          if (item > 9) {
            return item;
          } else {
            return "0" + item;
          }
        });

        return (
          texts.join("/") +
          "\n" +
          createZero(date.getHours()) +
          ":" +
          createZero(date.getMinutes())
        );
      }
    },
    // data: []
  },
  dataZoom: dataZoom,
  yAxis: {
    // name: "其他",
    type: "value",
    min: function(value) {
      return value.min<=10?0: value.min-10;
    },
    // max: 240,
    // min: 0,
    // maxInterval: 20,
    // 刻度文字
    axisLabel: {
      verticalAlign: "top",
      color:'rgba(0, 6, 34,.5)',
    },
    splitLine: {
      show:false,
      lineStyle: {
        color: "#E0E0E0"
      }
    },
    axisLine: {

      lineStyle: {
        color: "rgba(192, 203, 233,.4)"
      }
    }
  },
  series: []
}
// 监护仪
export const monitor = {
  tooltip:yqTooltip,
  legend: {
    // right: 60
    // type: 'scroll',
    orient: 'vertical',
    right: 0,
    top: 20,
    bottom: 35,
    // formatter: function (name) {
    //   return name == '体温' ? name + '(°C)' :name == '血氧饱和度' ? name + '(%)':name + '(次/分)';
    // },

  },
  grid: {
    top: 20,

    left: 45,
    right: 160,
    bottom: 30,
    containLabel: true
  },
  color: [],
  xAxis: {
    type: "category",
    boundaryGap: false,
    // boundaryGap: ['30%', '20%'],
    axisLine: {
      lineStyle: {
        color: "rgba(192, 203, 233,.4)"
        
      }
    },
    splitLine: {
      onZero:true,

      lineStyle: {
        color: "#E0E0E0"
      }
    },
    axisTick: {
      alignWithLabel: true
    },
    axisLabel: {
      color:'rgba(0, 6, 34,.5)',

      formatter: function (value,index) {
        // 格式化成月/日，
        // if (value == 0) {
        //   return "";
        // }
        if (!index) return '';
        var date = new Date(value);
        var texts = [date.getMonth() + 1, date.getDate()];
        texts = texts.map(item => {
          if (item > 9) {
            return item;
          } else {
            return "0" + item;
          }
        });

        return (
          texts.join("/") +
          "\n" +
          createZero(date.getHours()) +
          ":" +
          createZero(date.getMinutes())
        );
      }
    },
    // data: []
  },
  dataZoom,
  yAxis: {
    // name: "其他",
    type: "value",
    min: function(value) {
      return value.max>42?value.min -10:value.min -2;
    },
    max: function(value) {
      // return value.max<=42?42:value.max;
      return value.max;
  },
    // max: 240,
    // min: 0,
    maxInterval: 30,
    // 刻度文字
    axisLabel: {
      color:'rgba(0, 6, 34,.5)',

      verticalAlign: "top"
    },
    splitLine: {
      show:false,
      lineStyle: {
        color: "#E0E0E0"
      }
    },
    axisLine: {
      lineStyle: {
        color: "rgba(192, 203, 233,.4)"
      }
    }
  },

  series: []
};
export const water = {
  tooltip,
  legend: [{
      orient: 'vertical',
      right: 0,
      top: 20,
      data: [],
      formatter: function (name) {
        return name + "\n" + "{a|入量}" + "\n" + "{b|出量}";
      },
      textStyle: {
        rich: {
          a: {
            color: "#777777",
            padding: [-28, 0, 0, 0]
          },
          b: {
            color: "#777777",
            padding: [-56 * 4, 50, 0, 0]
          }
        }
      }
    },
    {
      orient: 'vertical',
      right: 0,
      top: 60,
      // bottom: 20,
      itemWidth: 10,
      itemHeight: 10,
      data: [],
      formatter: function (name) {
        return "{w|" + name + "}";
      },
      textStyle: {
        rich: {
          w: {
            width: 65,
            padding: [-2, 0, 0, 0]
          }
        }
      }
    },
    {
      orient: 'vertical',
      right: 0,
      top: 80,
      // bottom: 20,
      data: [],
      formatter: function (name) {
        return "{w|" + name + "}";
      },
      itemWidth: 10,
      itemHeight: 10,
      textStyle: {
        rich: {
          w: {
            width: 65,
            padding: [-2, 0, 0, 0]
          }
        }
      },
      // top: 20
    },

  ],

  grid: {
    top: 20,
    left: 45,
    right: 130,
    bottom: "3%",
    containLabel: true
  },
  color: [],
  xAxis: {
    type: "category",
    boundaryGap: true,
    axisLine: {
      lineStyle: {
        color: "rgba(192, 203, 233,.4)"
        
      }
    },
    splitLine: {
      lineStyle: {
        color: "#E0E0E0"
      }
    },
    axisTick: {
      alignWithLabel: true
    },
    axisLabel: {
      color:'rgba(0, 6, 34,.5)',

      formatter: function (value) {
        // 格式化成月/日，

        if (value.indexOf("/") < 0) {
          return "第" + value + "周";
        } else {
          let texts = value.split("T")[0].split("/");
          texts[1] = createZero(+texts[1])
          texts[2] = createZero(+texts[2])
          return texts.join("/");
        }
      }
    },
    data: []
  },
  yAxis: {
    name: "单位:ml",
    type: "value",
    nameLocation: "start",
    nameTextStyle: {
      color:'rgba(0, 6, 34,.5)',
    },
    // 刻度文字
    axisLabel: {
      color:'rgba(0, 6, 34,.5)',

      verticalAlign: "top"
    },
    splitLine: {
      show: false
    },
    axisLine: {
      lineStyle: {
        color: "rgba(192, 203, 233,.4)"
      }
    }
  },
  series: []
};
// 
export const testTrend = {
  title:{
    text:'趋势图'
  },
  tooltip:{
    trigger:'axis',
    formatter:function(params){
      params = params[0]
      return params.name+'<br/>'+params.value
    }
  },
  dataZoom: dataZoom,
  xAxis:{
    type:'category',//类目轴，适用于离散的类目数据
    data:[],
  },
  yAxis:{
    type:'value',
    name:'',
  },
  series:[{
    data:[],
    type:'line',
    smooth:true,
  }]
}
