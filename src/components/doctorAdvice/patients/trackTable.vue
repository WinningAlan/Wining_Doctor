
<template>
  <div class="trackTable">
    <div class="header">
      <div class="first">时间</div>
      <div
        class="time-item"
        v-for="(item,index) in timeCol"
        :class="{active:item.isActive}"
      >{{item.title}}</div>
    </div>
    <div class="row-list">
      <div class="row" v-for="(item,index) in dataList" :key="index" v-if="item.Check">
        <div class="row-first">{{item.RowName}}</div>
        <div class="warp" v-if="item.RowType==1">
          <div class="row-item" v-for="(item,index) in item.ChildList" :key="index">
            <p style="line-height:50px;">
              <span
                v-for="(data,dataIndex) in item.DiagnosisTracks"
                :class="{lineCenter:item.DiagnosisTracks.length===1}"
              >{{data.Name}}{{dataIndex===item.DiagnosisTracks.length-1?"":"——>"}}</span>
            </p>
          </div>
        </div>
        <div class="warp" v-if="item.RowType==2">
          <div class="row-item" v-for="(item,index) in item.ChildList" :key="index">
            <p
              v-for="(data,dataIndex) in item.DiagnosisTracks"
              :class="{lineCenter:item.DiagnosisTracks.length===1}"
            >{{data.Name}}</p>
          </div>
        </div>
        <div class="warp" v-if="item.RowType==3">
          <div class="row-item" v-for="(item,index) in item.ChildList" :key="index">
            <p
              class="RowTyp3"
              v-for="(data,dataIndex) in item.DiagnosisTracks"
              :class="{lineCenter:item.DiagnosisTracks.length===1}"
              @click="selectCase(data)"
            >
              <el-popover placement="top-start" width="100" trigger="hover">
                <p>{{data.Name}}</p>
                <span>{{data.TrackTime | timeFilter}}</span>
                <p slot="reference">{{data.Name}}</p>
              </el-popover>
            </p>
          </div>
        </div>
        <div class="warp" v-if="item.RowType==4">
          <div class="row-item" v-for="(item,index) in item.ChildList" :key="index">
            <div
              v-for="(data,dataIndex) in item.DiagnosisTracks"
              :class="{lineCenter:item.DiagnosisTracks.length===1}"
              @click="selectCheck(data)"
            >
              <el-popover placement="top-start" width="100" trigger="hover">
                <p>{{data.Name}}</p>
                <span>{{data.TrackTime | timeFilter}}</span>
                <p>{{data.IsGenerated?"检查报告已出":"检查报告未出"}}</p>
                <p slot="reference" class="RowTyp4" :class="{'isGenerated':data.IsGenerated}">
                  {{data.Name}}
                  <span class="el-icon-tickets"></span>
                </p>
              </el-popover>
            </div>
          </div>
        </div>
        <div class="warp" v-if="item.RowType==5">
          <div class="row-item" v-for="(item,index) in item.ChildList" :key="index">
            <div
              v-for="(data,dataIndex) in item.DiagnosisTracks"
              :class="{lineCenter:item.DiagnosisTracks.length===1}"
              @click="selectCheck(data)"
            >
              <el-popover placement="top-start" width="100" trigger="hover">
                <p>{{data.Name}}</p>
                <span>{{data.TrackTime | timeFilter}}</span>
                <p>{{data.IsGenerated?"检验报告已出":"检验报告未出"}}</p>
                <p slot="reference" class="RowTyp4" :class="{'isGenerated':data.IsGenerated}">
                  {{data.Name}}
                  <span class="el-icon-tickets"></span>
                </p>
              </el-popover>
            </div>
          </div>
        </div>
        <div class="warp" v-if="item.RowType==6">
          <div class="row-item" v-for="(item,index) in item.ChildList" :key="index">
            <div
              v-for="(data,dataIndex) in item.DiagnosisTracks"
              :class="{lineCenter:item.DiagnosisTracks.length===1}"
            >
              <el-popover placement="top-start" width="100" trigger="hover">
                <p>{{data.Name}}</p>
                <span>{{data.TrackTime | timeFilter}}</span>
                <p slot="reference" class="RowTyp6">{{data.Name}}</p>
              </el-popover>
            </div>
          </div>
        </div>
        <div class="warp" v-if="item.RowType==7">
          <div class="row-item" v-for="(item,index) in item.ChildList" :key="index">
            <div
              class="RowTyp7"
              v-for="(data,dataIndex) in item.DiagnosisTracks"
              :class="{lineCenter:item.DiagnosisTracks.length===1}"
            >
              <el-popover placement="top-start" width="100" trigger="hover">
                <p>{{data.Name}}</p>
                <span>{{data.TrackTime | timeFilter}}</span>
                <p slot="reference" class="RowTyp6">{{data.Name}}</p>
              </el-popover>
            </div>
          </div>
        </div>
        <div
          class="warp"
          style="border:1px solid #ccc;border-top:none;border-left:none"
          v-if="item.RowType==8"
        >
          <div
            class="row-item"
            v-for="(item,index) in item.ChildList"
            :key="index"
            style="border:none"
          >
            <div
              class="RowTyp8"
              v-for="(data,dataIndex) in item.DiagnosisTracks"
              :class="{lineCenter:item.DiagnosisTracks.length===1}"
            >
              <el-popover placement="top-start" width="100" trigger="hover">
                <p>{{data.Name}}</p>
                <span>{{data.TrackTime | timeFilter}}</span>
                <p slot="reference" class="RowTyp8">
                  <span class="qu"></span>
                  <span class="content">{{data.Name}}</span>
                </p>
              </el-popover>
            </div>
          </div>
        </div>
        <div class="warp" v-if="item.RowType==9">
          <div class="row-item" v-for="(item,index) in item.ChildList" :key="index">
            <p
              class="RowTyp9"
              v-for="(data,dataIndex) in item.DiagnosisTracks"
              :class="{lineCenter:item.DiagnosisTracks.length===1}"
            >
              <el-popover placement="top-start" width="100" trigger="hover">
                <p>{{data.Name}}</p>
                <span>{{data.TrackTime | timeFilter}}</span>
                <p slot="reference">{{data.Name}}</p>
              </el-popover>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    timeCol: {
      type: Array,
      default: () => {
        return;
      }
    },
    dataList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    isHistory: {
      type: Boolean,
      default: true
    },
    dayType: {
      type: String,
      default: "oneday"
    },
    time: {
      type: String,
      default: ""
    }
  },
  methods: {
    //选中的病历去查看对应的病历
    selectCase(val) {
      let data = { ...this.$route.query };
      if (val) {
        this.$store.commit("public/SET_DIALOGDATA", {});
        this.$store.commit("case/SET_CASEDATA", val);
        this.$router.push({ name: "medicalHistory", query: data });
      }
    },
    //选中后的检查检验查看报告调阅的数据
    selectCheck(val) {
      if (val.IsGenerated) {
        this.$store.commit("case/SET_CASEDATA", val);
        this.$store.commit("home/SET_DIALOGDATA", {
          component: "readReport",
          width: "1366px",
          title: "报告调阅"
        });

        this.$store.commit("home/SET_REPORTSHOW", true);
      }
    }
    // color(val) {
    //   if (this.isHistory) {
    //     if (this.dayType == "oneday") {
    //       console.log(val);
    //       console.log(this.time);
    //     }
    //   }
    // },
    // isDateBetween(startDateString, endDateString) {
    //    let curData = new Date();
    //    let beginDate = new Date(startDateString);
    //    let endDate = new Date(endDateString);
    //    if(curData >= beginDate && curData <=  endDate){
    //       return true
    //    }
    //    return false
    // },
  },
  watch: {}
};
</script>
<style lang="less" scoped>
.trackTable {
  height: 100%;
  padding-top: 10px;

  .lineCenter {
    line-height: 50px;
  }
  .header {
    height: 50px;
    display: flex;
    background: #f4f8fc;
    color: #333333;
    font-weight: bold;
    line-height: 50px;
    text-align: center;
    .time-item {
      flex: 1;
      font-weight: bold;
      line-height: 50px;
      text-align: center;
      border: 1px solid #ccc;
      border-left: 0;
    }
    .active {
      color: #0071e7;
      border-bottom: 3px solid #0071e7;
    }
  }
  .first,
  .row-first {
    width: 100px;
    color: #333333;
    font-weight: bold;
    line-height: 50px;
    text-align: center;
    border: 1px solid #ccc;
    background: #f4f8fc;
    
  }
  .row-first {
    border-top: 0;
  }

  .row {
    display: flex;
  }
  .warp {
    display: flex;
    flex: 1;
  }
  .row-item {
    flex: 1;
    border: 1px solid #ccc;
    border-top: 0;
    border-left: 0;
    text-align: center;
    .RowTyp3 {
      line-height: 1.6;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
        color: #0071e7;
      }
    }
    .RowTyp4 {
      line-height: 1.7;

      span {
        font-size: 16px;
        padding-left: 10px;
      }
    }
    .isGenerated {
      text-decoration: underline;
      color: #0071e7;
      cursor: pointer;
    }
    .RowTyp7 {
      line-height: 1.6;
    }
    .RowTyp6 {
      line-height: 1.6;
    }
    .RowTyp8 {
      height: 30px;
      line-height: 30px;
      position: relative;
      text-align: left;
      .qu {
        position: absolute;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 2px solid #0071e7;
        left: 10%;
        top: 10px;
        cursor: pointer;
      }
      .content {
        position: absolute;
        left: 20%;
        top: 2px;
        width: 80%;
        z-index: 10;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
      }
    }
  }
  .row-list {
    height: ~"calc(100% - 65px)";
    overflow: auto;
    box-sizing: border-box;
  }
}
</style>