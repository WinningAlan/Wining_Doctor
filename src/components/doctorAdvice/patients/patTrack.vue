<template>
  <div class="track">
    <div class="header">
      <div class="left">
        <el-select
          v-model="selectTime"
          placeholder="请选择"
          size="small"
          @change="changeTime"
          value-key="inHouseId"
        >
          <el-option
            v-for="(item,index) in timeList"
            :key="index"
            :label="item.time"
            :value="{...item}"
          ></el-option>
        </el-select>
      </div>
      <div class="right">
        <div class="time-list">{{dayList[index]}}</div>
        <div class="but-in">
          <span class="el-icon-arrow-left" @click.prevent="prePage"></span>
          <span class="el-icon-arrow-right" @click.prevent="nextPage"></span>
        </div>
        <div class="today" @click="toDay" :class="{active:timeType==='today'}">
          <span class="el-icon-date"></span>
          <span>今天</span>
        </div>
        <div class="fen">
          <span style="padding-left:10px;">|</span>
        </div>
        <div class="oneday" @click="tabsTime('oneday')" :class="{active:timeType==='oneday'}">
          <span class="el-icon-date"></span>
          <span>天</span>
        </div>
        <div class="week" @click="tabsTime('week')" :class="{active:timeType==='week'}">
          <span class="el-icon-date"></span>
          <span>周</span>
        </div>
        <div class="row-list">
          <el-tooltip class="item" effect="light" content="自定义展示行" placement="top">
            <div class="row-list el-icon-menu" @click="showSort"></div>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div class="track-content">
      <trackTable
        :timeCol="timeCol"
        :dataList="dataList"
        :isHistory="isHistory"
        :dayType="timeType"
        :time="dayList[index]"
      ></trackTable>
    </div>
    <myAlter :visible="sortShow" title="表格排序" :callback="closeAlter" width="540px">
      <component :is="'sortAlter'" :cloumnList="Rowlist" ref="tableHeader" :initialize="sortShow" />
    </myAlter>
  </div>
</template>
<script>
import { getDayList, changeDateTimeDay } from "../../../utils/public.js";
import trackTable from "./trackTable.vue";
import { mapGetters } from "vuex";
import myAlter from "@/components/common/myAlter";
import sortAlter from "./sortAlter";
//默认按天显示的时间设置的区间
const colList = [
  {
    title: "2",
    min: "00:01",
    max: "02:00",
    isActive: false
  },
  {
    title: "4",
    min: "02:01",
    max: "04:00",
    isActive: false
  },
  {
    title: "6",
    min: "04:01",
    max: "06:00",
    isActive: false
  },
  {
    title: "8",
    min: "06:01",
    max: "08:00",
    isActive: false
  },
  {
    title: "10",
    min: "08:01",
    max: "10:00",
    isActive: false
  },
  {
    title: "12",
    min: "10:01",
    max: "12:00",
    isActive: false
  },
  {
    title: "14",
    min: "12:01",
    max: "14:00",
    isActive: false
  },
  {
    title: "16",
    min: "14:01",
    max: "16:00",
    isActive: false
  },
  {
    title: "18",
    min: "16:01",
    max: "18:00",
    isActive: false
  },
  {
    title: "20",
    min: "18:01",
    max: "20:00",
    isActive: false
  },
  {
    title: "22",
    min: "20:01",
    max: "22:00",
    isActive: false
  },
  {
    title: "24",
    min: "22:01",
    max: "00:00",
    isActive: false
  }
]; 
export default {
  name: "patTrack",
  components: {
    trackTable,
    myAlter,
    sortAlter
  },
  created() {
    this.getPatientsTime();
  },
  data() {
    return {
      defRowList: [], //默认很坐标的表格数据
      Rowlist: [], //横坐标表格的类表
      timeCol: colList, //展示显示纵坐标的时间
      dataList: [], //展示行的数据
      dayList: [], //天的数组展示
      visible: false, //显示或者隐藏表格行的显示
      selectTime: [], //选择时间的列表默认项
      dayList: [], //天的列表数据
      index: 0, //当前显示的为第几天
      timeList: [], //时间列表的数据
      weekDay: [], //存放周的日期数组
      checkAll: true, //是否是全选
      timeType: "oneday", //默认为展示按天
      inHouseId: "", //患者的在却换时间的时候的inHouseId
      selectNowTime: "", //选中当前的时间
      isHistory: false,//判断为是不是历史数据
    };
  },
  computed: {
    ...mapGetters({
      patientMsg: "public/GET_PATIENTMSG",
      user: "public/GET_USER",
      sortShow: "case/GET_SORTSHOW"
    })
  },
  mounted() {},
  methods: {
    //点击显示弹窗排序
    showSort() {
      this.$store.commit("case/SET_SORTSHOW", true);
    },
    //关闭弹窗
    closeAlter(val) {
      if (val) {
        this.upDataUserHeader();
      }
      this.$store.commit("case/SET_SORTSHOW", false);
    },
    //获取患者的表头
    getUserHeaderList() {
      this.$Api
        .getUserHeaderList({ userId: this.user.UserInfo.Id })
        .then(res => {
          console.log(res);
          if (res.Status && res.Data) {
            this.Rowlist = JSON.parse(res.Data.Header);
            this.dataList = JSON.parse(JSON.stringify(this.Rowlist));
            console.log(this.dataList);
            this.getDiaTrack(this.inHouseId);
          }
        });
    },
    //根据用户更新表头
    upDataUserHeader() {
      console.log("this.Rowlist", this.Rowlist);
      this.$Api
        .upDataUserHeader({
          UserId: this.user.UserInfo.Id,
          Header: JSON.stringify(this.$refs.tableHeader.getCloumn())
        })
        .then(res => {
          if (res.Status) {
            console.log(this.Rowlist);
            this.getUserHeaderList();
          }
        });
    },
    //却换选着的时间今天、周、天
    toDay() {
      if (!this.isHistory) {
        if (this.timeType == "oneday") {
          this.tabsOneDay();
        } else {
          this.tabsWeek();
        }
      }
    },
    //点击切换显示天的模式
    tabsOneDay() {
      let timeArr = this.selectNowTime.time.split("~");
      this.timeCol = colList;
      if (timeArr[0] === timeArr[1]) {
        this.dayList = [timeArr[0]];
      } else {
        this.dayList = getDayList(timeArr[0], timeArr[1]);
      }
      this.index = this.dayList.length - 1;
      this.activeStyle();
      this.getDiaTrack(this.inHouseId);
    },
    //单击却换显示周的模式
    tabsWeek() {
      let arr = [];
      let listArr = [];
      let timeArr = this.selectNowTime.time.split("~");
      if (timeArr[0] === timeArr[1]) {
        arr = [timeArr[0]];
        listArr = arr;
      } else {
        arr = getDayList(timeArr[0], timeArr[1]);
        listArr = this.splitArr(arr, 7);
      }
      this.weekDay = listArr;
      this.index = this.weekDay.length - 1;
      this.setWeekData(listArr, this.index);
    },
    //却换显示天还是周的模式
    tabsTime(type) {
      this.timeType = type;
      if (type == "oneday") {
        this.tabsOneDay();
      } else if (type == "week") {
        this.tabsWeek();
      }
    },
    //却换日期向前
    prePage() {
      if (this.timeType != "today") {
        if (this.index == 0) {
          this.index = 0;
          return;
        } else {
          this.index--;
        }
        if (this.timeType == "week") {
          this.setWeekData(this.weekDay, this.index);
        } else {
          // this.timeCol = colList;
          this.activeStyle();
          this.getDiaTrack(this.inHouseId);
        }
      }
    },
    //却换日期向后
    nextPage() {
      if (this.timeType != "today") {
        if (this.index >= this.dayList.length - 1) {
          this.index = this.dayList.length - 1;
          return;
        } else {
          this.index++;
        }
        if (this.timeType == "week") {
          this.setWeekData(this.weekDay, this.index);
        } else {
          this.activeStyle();
          this.getDiaTrack(this.inHouseId);
        }
      }
    },
    //筛选日期
    changeTime(val) {
      console.log(val.InHouseId);
      if (val) {
        let timeArr = val.time.split("~");
        this.inHouseId = val.inHouseId;
        this.index = 0;
        this.selectNowTime = val;
        this.isHistory = val.isHistory;
        this.tabsTime(this.timeType);
      }
    },
    //获取患者就诊的历史时间
    getPatientsTime(bl) {
      this.$Api
        .getPatientsTime({ patientId: this.patientMsg.PatientId })
        .then(res => {
         bl&& this.tabsTime('oneday')
          if (res.Status) {
            let arr = [];
            for (let i = 0; i < res.Data.length; i++) {
              arr.push({
                time: `${this.formatTime(
                  res.Data[i].InHospTime
                )}~${this.formatTime(res.Data[i].OutHospTime)}`,
                isHistory: res.Data[i].IsHistory,
                inHouseId: res.Data[i].InHouseId
              });
            }
            console.log(this.formatTime(res.Data[0].InHospTime));
            if (
              this.formatTime(res.Data[0].InHospTime) ===
              this.formatTime(res.Data[0].OutHospTime)
            ) {
              this.dayList = [this.formatTime(res.Data[0].InHospTime)];
            } else {
              this.dayList = getDayList(
                this.formatTime(res.Data[0].InHospTime),
                this.formatTime(res.Data[0].OutHospTime)
              );
            }
            console.log("this.dayList", this.dayList);
            console.log("arr", arr);
            this.timeList = arr;
            this.selectTime = arr[0];

            this.selectNowTime = arr[0];
            this.index = this.dayList.length - 1;
            // console.log('this.dayList',this.dayList)
            this.inHouseId = arr[0].inHouseId;
            this.isHistory = arr[0].isHistory;
            this.activeStyle();
            this.getUserHeaderList();
          }
        });
    },
    //定位到当前时刻
    activeStyle() {
      if (!this.isHistory) {
        for (let i = 0; i < this.timeCol.length; i++) {
          this.timeCol[i].isActive = this.isDateBetween(
            `${this.dayList[this.index]} ${this.timeCol[i].min}`,
            `${this.dayList[this.index]} ${this.timeCol[i].max}`
          );
        }
      } else {
        for (let i = 0; i < this.timeCol.length; i++) {
          this.timeCol[i].isActive = false;
        }
      }
    },
    //轴显示的active样式
    weekStyle() {
      if (!this.isHistory) {
        for (let i = 0; i < this.timeCol.length; i++) {
          this.timeCol[i].isActive = this.isDay(this.timeCol[i].title);
        }
        console.log("timeCol", this.timeCol);
      } else {
        for (let i = 0; i < this.timeCol.length; i++) {
          this.timeCol[i].isActive = false;
        }
      }
    },
    //判断是不是为天显示
    isDay(day) {
      if (day) {
        let curData = new Date();
        let beginDate = new Date(day + " " + "00:00");
        let endDate = new Date(day + " " + "23:59");
        if (curData >= beginDate && curData <= endDate) {
          return true;
        }
        return false;
      }
      return false;
    },
    //判断时间是否在这个区间
    isDateBetween(startDateString, endDateString) {
      let curData = new Date();
      let beginDate = new Date(startDateString);
      let endDate = new Date(endDateString);
      if (curData >= beginDate && curData <= endDate) {
        return true;
      }
      return false;
    },
    //格式化后台的时间
    formatTime(time) {
      let str = "";
      let timeArr = [];
      if (time) {
        str = time.split("T")[0];
        timeArr = str.split("-");
        return timeArr.join("/");
      }
    },
    //按照自己需要的长度获得二维数组
    splitArr(arr, length) {
      //获取要切割的数组的长度
      var length = parseInt(length);
      //如果长度小于要划分的长度，返回原数组
      if (length <= 1 || arr.length < length) return arr;
      var groups = []; //拆分成的二维数组的个数
      var number = Math.ceil(arr.length / length); //用slice方法，每四个截取一次
      for (var i = 0; i < number; i++)
        groups.push(arr.slice(length * i, length * (i + 1)));
      return groups;
    },
    //设置周的时间
    setWeekData(val, index) {
      if (typeof val[index] == "string") {
        this.dayList = val;
        let colmArr = [...val];
        let len = colmArr.length;
        for (len; len < 7; len++) {
          colmArr.push("");
        }
        this.timeCol = this.setWeekList(colmArr);
        console.log("this.timeCol", this.timeCol);

        this.dayList = [`${val[0]}~${val[val.length - 1]}`];
        this.weekStyle();
      } else {
        let dayList = [];
        val.forEach(item => {
          if (item) {
            dayList.push(`${item[0]}~${item[item.length - 1]}`);
          }
        });
        this.dayList = dayList;
        console.log(dayList);
        this.timeCol = this.setWeekList(val[index]);
        this.weekStyle();
        console.log("this.timeCol", this.timeCol);
        if (val[index].length < 7) {
          let colmArr = [...val[index]];
          let len = colmArr.length;
          for (len; len < 7; len++) {
            colmArr.push("");
          }
          this.timeCol = this.setWeekList(colmArr);
          this.weekStyle();
          console.log("this.timeCol", this.timeCol);
        }
      }
      this.getDiaTrack(this.inHouseId);
    },
    //获取诊疗轨迹
    getDiaTrack(inHouseId) {
      let data = {
        TrackTypes: [],
        PeriodType: 0,
        InHouseId: inHouseId,
        StartTime: "",
        EndTime: ""
      };
      this.dataList.forEach(item => {
        if (item.Check) {
          data.TrackTypes.push(item.RowType);
        }
      });
      if (this.timeType == "week") {
        data.PeriodType = 2;
        this.index = this.dayList[this.index] ? this.index : 0;
        console.log(this.index ,'this.index ',this.dayList);

        let timeArr = this.dayList[this.index].split("~");
        data.StartTime = `${timeArr[0]} 00:00:00`;
        data.EndTime = `${timeArr[1]} 23:59:59`;
      } else {
        console.log(this.dayList);
        data.PeriodType = 1;
        data.StartTime = `${this.dayList[this.index]} 00:00:00`;
        data.EndTime = `${this.dayList[this.index]} 23:59:59`;
      }
      this.$Api.getDiaTrack(data).then(res => {
        if (res.Status && res.Data) {
          for (let key in res.Data) {
            this.dataList.forEach((item, index) => {
              if (key === item.Model) {
                this.dataList[index]["ChildList"] = res.Data[key];
              }
            });
          }
          console.log(this.dataList);
        }
      });
    },
    //设置时间显示
    setWeekList(list) {
      let arr = [];
      list.forEach(item => {
        arr.push({
          title: item,
          isActive: false,
          min: "",
          max: ""
        });
      });
      return arr;
    }
  }
};
</script>
<style lang="less">
body {
  /deep/.el-popover.row-list-pop {
    min-width: 100px !important;
    /deep/ .el-checkbox + .el-checkbox {
      margin: 0;
    }
  }
}
.track {
  height: 100%;
  box-sizing: border-box;
  padding: 0;
  .header {
    display: flex;
    justify-content: space-between;
    .el-select {
      width: 210px;
      /deep/ .el-input__inner {
        background: #f2f2f2;
        border: none;
        border-radius: 2px;
      }
    }
    .right {
      font-size: 16px;
      display: flex;
      margin-top: 5px;
      div {
        margin-left: 20px;
        cursor: pointer;
      }
      .but-in {
        span {
          padding-right: 10px;
          font-size: 18px;
          font-weight: bold;
          &:hover {
            color: #0071e7;
          }
        }
      }
    }
    .row-list {
      font-size: 25px;
      color: #0071e7;
      margin-top: -5px;
      cursor: pointer;
    }
  }
  .track-content {
    height: 100%;
  }
  .active {
    color: #0071e7;
  }
}
</style>