<template>
  <div class="patBasicMsg">
    <div class="patBasicMsgLeft">
      <div>
        <img
          class="right-msg-left"
          src="../../../assets/imges/boyBig.png"
          alt
          v-if="patientMsg.PatGenderCode==1"
        />
        <img
          class="right-msg-left"
          src="../../../assets/imges/girlBig.png"
          v-else-if="patientMsg.PatGenderCode==2"
          alt
        />
        <img class="right-msg-left" src="../../../assets/imges/sexUnknow.svg" alt v-else />
      </div>
      <div>{{patientMsg.PatientName}}</div>
      <ul>
        <li>
          <span>患者ID</span>
          <p>{{patientMsg.HISPatientId}}</p>
        </li>
        <li>
          <span>病历号</span>
          <p>{{patientMsg.RecordNumber}}</p>
        </li>
        <li>
          <span>性别</span>
          <p>{{patientMsg.PatGenderCode|sexFilter}}</p>
        </li>
        <li>
          <span>出生日期</span>
          <p>{{patientMsg.BirthDay | birthDayFilter}}</p>
        </li>
        <li>
          <span>年龄</span>
          <p>{{patientMsg.AgeYear | ageFilter(patientMsg.AgeMonth)}}</p>
        </li>
        <li>
          <span>联系方式</span>
          <p>{{patientMsg.Phone}}</p>
        </li>
        <li>
          <span>身份证号</span>
          <p>{{patientMsg.IDNumber}}</p>
        </li>
        <li>
          <span>就诊卡号</span>
          <p>{{patientMsg.CardNumber}}</p>
        </li>
        <!-- <li>
          <span>健康卡号</span>
          <p>{{patientMsg.HealthCardNumber}}</p>
        </li>-->
        <li>
          <span>婚姻状况</span>
          <p>{{patientMsg.MaritalStatus}}</p>
        </li>
        <li>
          <span>住址</span>
          <p>{{patientMsg.Address}}</p>
        </li>
        <li>
          <span>职业</span>
          <p>{{patientMsg.Profession}}</p>
        </li>
        <li>
          <span>工作单位</span>
          <p>{{patientMsg.WorkUnit}}</p>
        </li>
      </ul>
    </div>
    <div class="patBasicMsgRight">
      <div class="header">
        <el-radio-group v-model="nowTemp" fill="#0071E7" text-color="#fff">
          <el-radio-button
            :label="item.Value"
            v-for="(item,index) in tabsList"
            :key="item.Value"
          >{{item.Text}}</el-radio-button>
        </el-radio-group>
      </div>
      <div class="content">
        <component :is="nowTemp" ref="content"></component>
      </div>
    </div>
  </div>
</template>
<script>
import allergy from "./allergy.vue";
import cost from "./cost.vue";
import patTrack from "./patTrack";
import { mapGetters } from "vuex";
export default {
  name: "patBasicMsg",
  components: {
    allergy,
    patTrack,
    cost
  },
  data() {
    return {
      nowTemp: "patTrack",
      tabsList: [
        {
          Text: "就诊轨迹",
          Value: "patTrack"
        },
        {
          Text: "过敏信息管理",
          Value: "allergy"
        },
        {
          Text: "费用管理",
          Value: "cost"
        }
      ]
    };
  },
  props: {
    initialize: Boolean
  },
  watch: {
    initialize: {
      handler: function(val, oldVal) {
        if (val) {
          this.nowTemp = "patTrack";
          this.$refs.content &&
            this.$refs.content.getPatientsTime &&
            this.$refs.content.getPatientsTime(true);
        }
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters({
      patientMsg: "public/GET_PATIENTMSG"
    })
  }

  /* 
  TODO: 
   methods
   */
};
</script>
<style lang="less" scoped>
.patBasicMsg {
  // display: flex;
  height: ~"calc(100vh - 49px)";
  padding: 10px 30px;
  font-size: 14px;
  box-sizing: border-box;
  .patBasicMsgLeft {
    width: 250px;
    color: @wordColor;
    float: left;
    > div {
      text-align: center;
      margin-bottom: 15px;
    }
    > ul {
      height: ~"calc(100vh - 200px)";
      overflow: auto;
      > li {
        margin-bottom: 10px;
        span:nth-child(1) {
          width: 80px;
          opacity: 0.7;
          height: 100%;
          float: left;
        }
        p {
          width: 160px;
          display: inline-block;
        }
      }
    }
    img {
      width: 66px;
      height: 67px;
      // padding-top: 9px;
      // margin-right: 20px;
    }
    height: 100%;
  }
  .patBasicMsgRight {
    height: 100%;
    overflow: hidden;
    padding-left: 10px;
    border-left: 1px solid #f1f1f1;
    .header {
      /deep/ .el-radio-button__inner {
        height: 32px;
        font-size: 14px;
        border-radius: 0;
      }
    }
    .content {
      height: ~"calc(100vh - 120px)";
      padding: 20px;
      box-sizing: border-box;
    }
  }
}
</style>
