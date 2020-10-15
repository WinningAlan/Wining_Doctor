<template>
  <div class="viewReportAlter">
    <el-radio-group v-model="activeName" fill="#0071E7" @change="getList">
      <el-radio-button
        :label="item.value"
        v-for="(item, index) in tabsData"
        :key="index"
      >{{item.text}}</el-radio-button>
    </el-radio-group>
    <div class="viewReportAlter-content my-input-time">
      <fileHandleList v-show="activeName===3" :patientData="patientData" ref="fileHandleList"></fileHandleList>

      <areaTimerShaft
        v-if="activeName!==3"
        :timeChick="timeChick"
        :checked="checked"
        :activeId="checkObj.Id"
        :phaseData="phaseData"
      ></areaTimerShaft>
      <div class="list-right">
        <div class="flex-between inquire">
          <div class="search-left">
            <template v-if="activeName===2">
              <span>时间</span>
              <el-date-picker
                v-model="endTime"
                prefix-icon="el-icon-date"
                type="date"
                :clearable="false"
                size="small"
                :picker-options="pickerOptions"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              ></el-date-picker>
              <el-button type="primary" size="small" @click="setTimeArr(endTime)">查询</el-button>
            </template>
          </div>
          <div class="print flex-between">
            <template v-if="activeName===2">
              <el-button plain @click="prePage(0)" :disabled="currentIndex==0" class="btn">首页</el-button>
              <el-button
                class="btn"
                plain
                @click="prePage(currentIndex-1)"
                :disabled="currentIndex==0"
              >上一页</el-button>
              <el-button
                class="btn"
                plain
                @click="prePage(currentIndex+1)"
                :disabled="currentIndex==sevenTimeArr.length-1"
              >下一页</el-button>
              <el-button
                plain
                class="btn"
                @click="prePage(sevenTimeArr.length-1)"
                :disabled="currentIndex==sevenTimeArr.length-1"
              >末页</el-button>
              <el-button plain @click="print" class="btn">打印</el-button>
            </template>
            <template v-else-if="activeName===1">
              <el-checkbox v-model="isChecked" @change="change">续打模式</el-checkbox>
              <el-tooltip placement="top" content="打印" effect="light">
                <span class="icon-print" @click="print"></span>
              </el-tooltip>
            </template>
            <el-tooltip placement="top" content="打印" effect="light" v-else>
              <span class="icon-print" @click="print"></span>
            </el-tooltip>
          </div>
        </div>
        <div
          class="content"
          v-loading="showLoading"
          id="content"
          element-loading-text="拼命加载中"
          ref="iframeContent"
          element-loading-background="rgba(200, 200, 200, 0.6)"
        >
          <!-- 当前选中的护理文书模板的id: {{currentLeafId}} -->
          <div class="iframeContent">
            <iframe
              :src="iframeSrc"
              class="iframeStyle"
              scrolling="yes"
              ref="iframe"
              frameborder="0"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getTimeOfToday,
  GetFormatDateTime,
  changeDateTimeFormat,
  getServerTimeRandom
} from "@/utils/public";
import areaTimerShaft from "./areaTimerShaft.vue";
import fileHandleList from "./fileHandleList.vue";
export default {
  name: "viewReportAlter", //查看护理单，体温单、护理文书
  components: {
    areaTimerShaft,
    fileHandleList
  },
  props: {
    // 组件变化
    initialize: false,
    // 患者信息
    patientData: {
      type: Object,
      required: true
    }
  },
  watch: {
    initialize: {
      handler: function(val, oldVal) {
        if (val) {
          this.getList(1);
          this.checkAll(false);
          window.addEventListener("message", this.refeshPage, false);
          this.$store.commit("public/SET_MEDICALADDEVENT", true);
        } else {
          clearTimeout(this.timer);
          window.removeEventListener("message", this.refeshPage, false);
          this.$store.commit("public/SET_MEDICALADDEVENT", this.$route.name==='medicalHistory');
          
        }
        this.activeName = 1;
      },
      immediate: true
    }
  },
  data() {
    return {
      tabsData: [
        {
          text: "护理单",
          value: 1
        },
        {
          text: "体温单",
          value: 2
        },
        {
          text: "护理文书",
          value: 3
        }
      ],
      activeName: 1, //活动的文书
      pickerOptions: {
        disabledDate: this.disabledDate
      },
      showLoading: false,
      iframeSrc: "", //iframe地址
      isChecked: false, //打印模式
      checked: false, //是否全选
      checkObj: "", //选中的时间轴
      phaseData: [], //时间轴数据
      timeArr: getTimeOfToday(),
      endTime: new Date(), //查询时间
      currentIndex: 0, //当前第几个7天的体温单
      sevenTimeArr: [] //入区时间和当前时间七天数组
    };
  },
  mounted() {},
  beforeDestroy() {
    clearTimeout(this.timer);
    window.removeEventListener("message", this.refeshPage, false);
  },
  methods: {
    // 监听消息
    refeshPage(event) {
      if (window.parent !== event.source) {
        console.log(event.data, "sds");
        let data = event.data;
        if (data.type === "load") {
          if (this.isPrint) {
            clearTimeout(this.timer);
            this.domId = "iframe-list";
            this.timer = setTimeout(() => {
              document
                .getElementById("iframe-list")
                .contentWindow.postMessage("ismark", window.URLCONFIG.Emr);
              this.$store.commit("file/SET_ISPRINT", false);
            }, 500);
          } else {
            this.showLoading = false;
          }
        } else if (data.type === "ismark") {
          clearTimeout(this.timer);
          if (data.status) {
            document
              .getElementById(this.domId)
              .contentWindow.postMessage("print", window.URLCONFIG.Emr);
            document
              .getElementById(this.domId)
              .contentWindow.postMessage("markOut", window.URLCONFIG.Emr);
          } else {
            this.timer = setTimeout(() => {
              document
                .getElementById(this.domId)
                .contentWindow.postMessage("ismark", window.URLCONFIG.Emr);
            }, 200);
          }
        }
      }
    },
    //   获取各种文书数据
    getList(val) {
      this.iframeSrc = "";
      val !== 3 && this.checkAll(false);
      this.activeName = val;
      val === 3
        ? this.$refs.fileHandleList &&
          this.$refs.fileHandleList.handleClick("1", true)
        : this.getPhaseInfo(this.patientData.InHouseId);
    },
    // 改变打印模式
    change() {
      let type = this.isChecked ? "JumpPrintIn" : "JumpPrintOut";
      this.$refs.iframe.contentWindow.postMessage(type, window.URLCONFIG.Emr);
    },
    // 时间轴选中
    timeChick(item) {
      console.log(item);
      typeof item === "boolean" ? this.checkAll(item) : this.checkItem(item);
    },
    // 禁用时间
    disabledDate(time) {
      if (this.checkObj) {
        let endTime = this.checkObj.EndTime || new Date();
        return (
          time.getTime() > new Date(endTime).getTime() ||
          time.getTime() <
            new Date(
              GetFormatDateTime(
                "yyyy-MM-dd",
                new Date(this.checkObj.StartTime)
              ) + " 00:00:00"
            ).getTime()
        );
      } else {
        return false;
      }
    },
    // 全选
    checkAll(val) {
      this.checked = val;
      if (val && this.phaseData.length > 0) {
        let phaseCard = document.getElementsByClassName("phase-card");
        this.checkObj = { ...this.checkObj };
        this.checkObj.EndTime =
          this.phaseData[this.phaseData.length - 1].EndTime ||
          GetFormatDateTime();
        this.checkObj.StartTime = this.phaseData[0].StartTime;
        // this.setTimeArr(this.checkObj.EndTime);
        this.activeName === 1
          ? this.setNursingList(this.checkObj, this.checkObj.TargetAreaId)
          : this.setTimeArr(this.checkObj.EndTime);

        for (let i = 0; i < phaseCard.length; i++) {
          phaseCard[i].classList.add("active");
        }
      } else {
        if (this.phaseData.length) {
          let phaseCard = document.getElementsByClassName("phase-card");
          for (var i = 0; i < phaseCard.length - 1; i++) {
            phaseCard[i].classList.remove("active");
          }
          this.checkItem(this.phaseData[this.phaseData.length - 1]);
        } else {
          this.iframeSrc = "";
        }
      }
    },
    // 选区
    checkItem(val) {
      console.log(val);
      if (this.checked) {
        return;
      }
      this.checkObj = val;
      let time = this.checkObj.EndTime || GetFormatDateTime();
      this.activeName === 1
        ? this.setNursingList(val, val.TargetAreaId)
        : this.setTimeArr(time);
      // this.setTimeArr(time);
    },

    // 打印当前模板
    print() {
      if (this.activeName === 2) {
        this.$refs.iframe.contentWindow.postMessage(
          "TempPrint",
          window.URLCONFIG.Emr
        );

      } else if (this.activeName === 1) {
        let type = this.isChecked ? "JumpPrint" : "print";
        this.$refs.iframe.contentWindow.postMessage(type, window.URLCONFIG.Emr);
      } else {
        this.$refs.iframe.contentWindow.postMessage(
          "print",
          window.URLCONFIG.Emr
        );
      }
    },

    setTimeArr(time = new Date()) {
      console.log(time);
      this.endTime = time;

      let timeArr = this.getSevenTimeList(this.checkObj.StartTime);
      this.sevenTimeArr = timeArr;
      let minMaxTime = this.getMinMaxTime(this.endTime, timeArr);
      console.log(minMaxTime);
      this.setTemperature(minMaxTime);
    },
    // 获取时间轴
    getPhaseInfo(id) {
      console.log(id, "dssssssss");
      this.$Api.getTimerArr({ id }).then(res => {
        if (res.Status) {
          this.phaseData = res.Data || [];
          if (this.phaseData.length) {
            this.checkObj = this.phaseData[this.phaseData.length - 1];
            console.log(this.phaseData, "this.phaseData", this.activeName);
            if (this.activeName === 1) {
              this.setNursingList(
                this.phaseData[this.phaseData.length - 1],
                this.phaseData[this.phaseData.length - 1].TargetAreaId
              );
            } else {
              let time = this.checkObj.EndTime || new Date();
              this.setTimeArr(time);
            }
          } else {
            this.iframeSrc = "";
          }
        } else {
          this.$msg.warning(res.Message);
          this.iframeSrc = "";
        }
      });
    },
    // 设置护理单
    setNursingList(val, areaId) {
      console.log(val, areaId);
      let option = {
        inHospPatId: this.patientData.InHouseId,
        objectType: 3,
        startDateTime: val.StartTime,
        endDateTime: val.EndTime,
        mark: true,
        originUrl: window.location.protocol + "\\" + window.location.host,
        areaId: areaId,
        patientId: this.patientData.PatientId,
        templateId: "8066e545023dc059e1876878a8be6612"
      };
      this.setIframeUrl(option, "EditPage");
    },
    // 设置体温单
    setTemperature(time) {
      let start =
        GetFormatDateTime("yyyy-MM-dd", new Date(time[0])) + " 00:00:00";
      let end =
        GetFormatDateTime("yyyy-MM-dd", new Date(time[1])) + " 23:59:59";
      let option = {
        inHospPatId: this.patientData.InHouseId,
        // areaId: this.diagnosisAreaId,
        objectType: 4,
        originUrl: window.location.protocol + "\\" + window.location.host,
        triageId: this.patientData.TriageId,
        startDateTime: start,
        endDateTime: end
      };
      this.setIframeUrl(option, "Temperature");
    },
    // 设置iframe的url
    setIframeUrl(option, type) {
      let url = `${window.URLCONFIG.Emr}/nursing/${type}.aspx?`;
      for (const key in option) {
        url = url + key + "=" + option[key] + "&";
      }
      url = url.substring(0, url.length - 1);
      if (this.iframeSrc === url) {
        return;
      }
      this.iframeSrc = "";
      getServerTimeRandom(url).then(res=>{
       this.iframeSrc=res
        this.showLoading = true;
      if (type === "Temperature") {
        this.$refs.iframe.onload = function(el) {
          this.showLoading = false;
        }.bind(this);
      }
      });

    },

    // 获取七天数组
    getSevenTimeList(start) {
      let timeArr = [];
      let now = new Date().getTime();
      let startTime = new Date(start).getTime();
      let count = Math.ceil((now - startTime) / 1000 / (7 * 24 * 3600));
      for (let i = 0; i < count; i++) {
        let obj = {};
        obj.minTime = startTime + i * 7 * 24 * 3600 * 1000;
        obj.maxTime =
          startTime + (i + 1) * 7 * 24 * 3600 * 1000 - 24 * 3600 * 1000;
        timeArr.push(obj);
      }
      return timeArr;
    },
    // 获取指定格式的时间日期2019-8-7 00:00:00 2019-8-8 23:59:59
    //GetFormatDateTime
    // 输入一个时间过去一个周期的最大值和最小值
    getMinMaxTime(st, ttArr) {
      let start = new Date(st).getTime();
      let minTime = 0;
      let maxTime = 0;
      ttArr.forEach((item, index) => {
        if (item.minTime <= start && item.maxTime >= start) {
          minTime = item.minTime;
          maxTime = item.maxTime;
          this.currentIndex = index;
        }
      });
      if (minTime == 0 && maxTime == 0) {
        minTime = new Date(ttArr[0].minTime);
        maxTime = new Date(ttArr[0].maxTime);
      } else {
        minTime = new Date(minTime);
        maxTime = new Date(maxTime);
      }
      return [
        GetFormatDateTime("yyyy-MM-dd", minTime) + " 00:00:00",
        GetFormatDateTime("yyyy-MM-dd", maxTime) + " 23:59:59"
      ];
    },
    // 切页
    prePage(index) {
      console.log(this.sevenTimeArr);

      this.currentIndex = index;
      this.setTemperature([
        this.sevenTimeArr[this.currentIndex].minTime,
        this.sevenTimeArr[this.currentIndex].maxTime
      ]);
    }
  }
};
</script>
<style scoped lang='less'>
.viewReportAlter {
  height: 80vh;
  box-sizing: border-box;
  padding: 20px 30px;
  .btn {
    background: #ffffff;
    border: 1px solid #1989fa;
    color: #1989fa;
    &.is-disabled {
      border-color: rgba(25, 137, 250, 0.4);
      color: rgba(25, 137, 250, 0.4);
    }
  }
  .viewReportAlter-content {
    height: calc(~"(100% - 50px)");
    padding-top: 20px;
    box-sizing: border-box;

    /deep/ .area-timer-shaft {
      height: 100%;
      width: 200px;
      float: left;
      overflow: auto;
      box-sizing: border-box;
      box-shadow: 0 0 10px 0 rgba(57, 109, 178, 0.5);
      margin-right: 10px;
      padding: 20px 0px 20px 0px;
    }
    .list-right {
      height: 100%;
      padding-left: 20px;
      overflow: hidden;
      .content {
        height: calc(~"(100% - 30px)");
        padding-top: 10px;
        box-sizing: border-box;
        .iframeStyle,
        .iframeContent {
          height: 100%;
          width: 100%;
        }
      }
    }
    .inquire {
      height: 32px;
      line-height: 32px;
      .el-date-editor {
        margin: 0 10px;
      }
      .el-button {
        font-size: 16px;
        padding: 0;
        line-height: 30px;
        text-align: center;
        width: 80px;
      }
      .print {
        color: #333333;
        span {
          width: 18px;
          height: 32px;
          margin-left: 25px;
          cursor: pointer;
          background: url("../../assets/imges/print.svg") center no-repeat;
        }
      }
    }
  }
}
@media print {
  .iframeStyle {
    height: 100%;
    width: 100%;
  }
}
</style>
