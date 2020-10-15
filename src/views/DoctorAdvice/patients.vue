<template>
  <div class="patients">
    <timer-shaft :timerData="timerData" :inTime="inTime"></timer-shaft>
    <div class="patients-echart">
      <div class="title cl">
        <el-radio-group
          class="left-radio"
          v-model="activeInstrument"
          @change="getEquipment"
          fill="#0071E7"
        >
          <el-radio-button
            v-for="item in instrumentOption"
            :key="item.MonitorCode"
            :label="item.MonitorCode"
          >{{item.MonitorName}}</el-radio-button>
        </el-radio-group>
        <span class="message">{{message}}</span>
      </div>
      <div class="title cl">
        <span class="name">时间选择</span>
        <el-select v-model="timeInterval" placeholder="请选择" size="mini" @change="setDataZoom">
          <el-option value="999999" label="全部">全部</el-option>
          <el-option
            v-for="item in timeData"
            :key="item.ItemKey"
            :label="item.ItemValue"
            :value="item.ItemKey"
          >{{item.ItemValue}}</el-option>
        </el-select>
        <p class="time">{{timeArr[0]}} ~ {{timeArr[1]}}</p>
      </div>
      <echarts
        :echartsData="instrumentData"
        :id="'sa'"
        :height="instrumentHeight"
        ref="instrumentData"
      ></echarts>
      <p class="line"></p>
      <div class="ecahtr-view">
        <echarts :echartsData="waterBalance" :id="'2'" type="day" :height="waterHeight"></echarts>
        <div
          class="no-data"
          :style="{height:waterHeight,'line-height':waterHeight}"
          v-if="waterBalance.Columns.length==0"
        >液体平衡项暂无数据...</div>
      </div>
    </div>

    <!-- <div class="patients-msg">
      <el-radio-group v-model="activeName" @change="tabClick">
        <el-badge :value="8" :max="9">
          <el-radio-button label="院前"></el-radio-button>
        </el-badge>
        <el-badge :value="12" :max="9">
          <el-radio-button label="院内"></el-radio-button>
        </el-badge>
      </el-radio-group>
      <ul class="patients-msg-list">
        <li class="item cl" v-for="(item, index) in 15" :key="index">
          <span class="yuan" :class="{white:index%2==0}"></span>
          <span class="time">06-{{(index+1)>9?index+1:'0'+(index+1)}}</span>
          <span class="name">{{activeName}}：皮试结果</span>
        </li>
      </ul>
    </div>-->
  </div>
</template>

<script>
import timerShaft from "../../components/doctorAdvice/patients/timerShaft";
import Echarts from "../../components/common/Echarts";
import { mapGetters } from "vuex";
import { GetFormatDateTime, getDifferenceTime } from "../../utils/public";

export default {
  name: "patients",
  data() {
    return {
      inTime: "", //在区时间
      timerData: [], //时间轴
      waterHeight: "260px",
      instrumentHeight: "220px",
      waterBalance: { Columns: [] }, //液体平衡数据
      instrumentData: {}, //仪器图表数据
      activeName: "院内",
      timeInterval: "999999", //时间间隔
      timeData: [], //时间列表
      activeInstrument: 1, //当前仪器
      instrumentOption: [], //仪器列表
      message: "", //演示数据提示
      rkTimeObj: "" //最近一次入抢救或留观时间
    };
  },
  computed: {
    ...mapGetters({
      timeArr: "public/GET_TIMEARR",
      patientMsg: "public/GET_PATIENTMSG",
      selectArea: "home/GET_SELECTAREA" //所在区域
    })
  },
  created() {
    console.log(this.$route,'当前路由')
    let h = document.body.clientHeight - 288;
    if (480 < h && h <= 520) {
      this.instrumentHeight = h - 260 + "px";
    } else if (h > 520) {
      this.instrumentHeight = this.waterHeight = h / 2 + "px";
    }
  },
  components: {
    timerShaft,
    Echarts
  },

  destroyed() {
    clearInterval(this.timer);
  },
  mounted() {
    // this.getTimerShaft();
    this.getTimeChoice();
    this.getMontior();
    this.getLiquidBalance();
  },
  watch: {
    patientMsg: {
      handler(val) {
        if (val.AreaType) {
          this.getTimerShaft(val.AreaType);
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 获取液体平衡数据
    getLiquidBalance() {
      this.$Api
        .getLiquidBalance({
          inHouseId: this.$route.query.id||this.patientMsg.InHouseId,
          inOrOut: -1,
          startTime: this.patientMsg.InHospTime || "2019-01-01 00:00",
          endTime: GetFormatDateTime()
        })
        .then(res => {
          console.log("waterBalance", res);
          let data = res.Data || { Columns: [] };
          if (!data.Columns[0]) {
            data.Columns.push(GetFormatDateTime("yyyy/MM/dd", new Date()));
          }
          this.waterBalance = data;
        });
    },
    // 获取仪器列表
    getMontior() {
      this.$Api
        .getMontior({
          hosPatId: this.$route.query.id||this.patientMsg.InHouseId,
          startDateTime: this.patientMsg.InHospTime || "2019-01-01 00:00",
          endDateTime: GetFormatDateTime()
        })
        .then(res => {
          if (res.Status) {
            this.instrumentOption = res.Data || [];
            if (this.instrumentOption.length) {
              this.activeInstrument = this.instrumentOption[0].MonitorCode;
              this.getEquipment();
            }
          }
          this.message = res.Message === "演示数据" ? "演示数据" : "";
        });
    },
    // 获取仪器数据
    getEquipment() {
      this.$refs.instrumentData.showLoading();
      this.$Api
        .getEquipment({
          hosPatId: this.$route.query.id||this.patientMsg.InHouseId,
          monitorCode: this.activeInstrument,
          startDateTime: this.patientMsg.InHospTime || "2019-01-01 00:00",
          endDateTime: GetFormatDateTime()
        })
        .then(res => {
          // 静态数据
          if (res.Status) {
            this.instrumentData = res.Data || { Columns: [] };
          }
        });
    },
    // 设置图表缩放组件属性
    setDataZoom(el) {
      this.$refs.instrumentData.setDataZoom(parseInt(el));
    },
    // 格式化时间
    setTime() {
      let rkTime = this.rkTimeObj ? this.rkTimeObj.TimeAxis : "";
      let ckTime = this.timerData[this.timerData.length - 1]
        ? this.timerData[this.timerData.length - 1].TimeAxis
        : "";
      if (rkTime) {
        this.inTime = getDifferenceTime(rkTime, ckTime || new Date());
      }
      if (
        this.selectArea.DiagnosisAreaType !== this.patientMsg.AreaType ||
        this.patientMsg.Status === 8
      ) {
        clearInterval(this.timer);
      }
    },
    // /获取监护仪时间间隔选项
    getTimeChoice() {
      this.$Api.getTimeChoice().then(res => {
        this.timeData = [
          {
            ItemKey: 10,
            ItemValue: "10分钟"
          },
          {
            ItemKey: 20,
            ItemValue: "20分钟"
          },
          {
            ItemKey: 30,
            ItemValue: "30分钟"
          },
          {
            ItemKey: 60,
            ItemValue: "1小时"
          },
          {
            ItemKey: 120,
            ItemValue: "2小时"
          }
        ];
      });
    },
    // 获取时间轴
    getTimerShaft(type) {
      console.log("this.patientMsg.AreaType", this.patientMsg.AreaType);
      this.$Api
        .getTimerShaft({ hosPatId: this.$route.query.id, areaType: type })
        .then(res => {
          if (res.Status) {
            this.timerData = res.Data || [];
            console.log(res, "yybububuh");
            let len = this.timerData.length;
            let isFind = false;
            for (let i = len - 1; i >= 0; i--) {
              if (isFind) {
                continue;
              }
              if (
                this.timerData[i].OpertionNodeName == "入抢救室" ||
                this.timerData[i].OpertionNodeName == "入留观室"
              ) {
                this.rkTimeObj = this.timerData[i];
                isFind = true;
              }
            }
            this.setTime();
            if (
              this.selectArea.DiagnosisAreaType === this.patientMsg.AreaType &&
              this.patientMsg.Status !== 8
            ) {
              this.timer = setInterval(() => {
                this.setTime();
              }, 1000);
            }
          }
        });
    },
    //  切换选项卡
    tabClick(el) {
      console.log(el);
    }
  }
};
</script>
<style scoped lang='less'>
.patients {
  // background: @mainBg;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  &-echart {
    overflow-y: auto;
    background: #fff;
    box-sizing: border-box;
    padding: 10px;
    flex: 1;
    margin: 0 10px;
    height: calc(~"(100% - 103px)");
    .title {
      margin-bottom: 10px;
      font-size: 14px;
      /deep/ .el-radio-button--small .el-radio-button__inner {
        padding: 9px 30px;
        font-size: 14px;
      }
      /deep/ .el-input__inner {
        width: 120px;
        background: @controlBg;
        color: rgb(0, 6, 34);
      }
      .el-select,
      .name,
      .el-radio-group {
        float: left;
      }
      .name {
        color: rgba(0, 6, 16, 0.6);
        margin-right: 9px;
        line-height: 28px;
      }
      .time,
      .message {
        float: right;
        color: #000622;
      }
      .message {
        font-size: 18px;
        color: #0071e7;
      }
    }
    .line {
      height: 0;
      border-bottom: 1px solid #c0cbe9;
      padding-top: 5px;
      margin-bottom: 5px;
    }
  }
  &-msg {
    width: 198px;
    height: calc(~"(100% - 103px)");
    background: #fff;
    border: 1px solid#C0CBE9;
    border-bottom: none;
    /deep/ .el-radio-button--small .el-radio-button__inner {
      display: inline-block;
      width: 99px;
      // box-sizing: border-box;
      border-top: none;
      border-left: none;
      border-right: none;
      line-height: 32px;
      text-align: center;
      padding: 0;
      border-radius: 0;
    }
    /deep/ .el-badge__content {
      z-index: 100;
      right: 36px;
      top: 10px;
    }
    &-list {
      height: calc(~"(100% - 32px)");
      overflow-y: auto;
      .item {
        height: 39px;
        line-height: 39px;
        padding: 0 5px;
        border-bottom: 1px solid #dfe7f5;
        cursor: pointer;
        &:hover {
          background: rgba(0, 113, 231, 0.1);
        }
        &:last-child {
          border-bottom-color: transparent;
        }
        .yuan,
        .time,
        .name {
          float: left;
        }
        .yuan {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          margin-top: (39-5)/2px;
          margin-right: 5px;
          background: #e36464;
          &.white {
            background: none;
          }
        }
        .time {
          margin-right: 10px;
        }
      }
    }
  }
  .ecahtr-view {
    position: relative;
    .no-data {
      width: 100%;
      position: absolute;
      left: 0;
      top: 0;
      text-align: center;
      font-size: 16px;
      color: #0071e7;
    }
  }
}
</style>
