<template>
  <div class="bedCard" @click="bedJumpTo" ref="bedCard">
    <div :class="{new:patInfo.IsNew}"></div>
    <div class="focus" v-if="showFocus" @click.stop="setAttentionTag(patInfo)">
      <el-tooltip v-if="!patInfo.AttentionTag" content="重点关注">
        <img src="../../assets/imges/whiteFocus.png" alt  />
      </el-tooltip>
      <el-tooltip v-else content="取消重点关注">
        <img src="../../assets/imges/focusSelect.png" alt  />
      </el-tooltip>
      
    </div>
    <div class="bedCardLeft">
      <div class="bedCardLeftHead">{{patInfo.BedNo}}</div>
      <div class="bedCardLeftContent">
        <ul>
          <li>
            <img src="../../assets/imges/boyBig.png" alt v-if="patInfo.PatGenderCode==1" />
            <img src="../../assets/imges/girlBig.png" alt v-else-if="patInfo.PatGenderCode==2" />
            <img src="../../assets/imges/sexUnknow.svg" alt v-else />
          </li>
          <li>
            <svg-icon :iconClass="`level${patInfo.TriageLevel}`" class="icon"></svg-icon>
            <img src="../../assets/imges/focus.png" alt v-if="!patInfo.AttentionTag" />
            <img src="../../assets/imges/focusSelect.png" alt v-else />
          </li>
          <li>
            <el-tooltip placement="top">
              <div slot="content">{{patInfo.PatientName}}</div>
              <div class="patName">{{patInfo.PatientName}}</div>
            </el-tooltip>
          </li>
          <li>{{patInfo.AgeYear | ageFilter(patInfo.AgeMonth)}}</li>
          <li class="leftContentItem" v-show="columnsCode.indexOf('FirstDoctor')!=-1">
            <span class="wordKey">首诊医生：</span>
            {{patInfo.FirstDoctor}}
          </li>
          <li class="leftContentItem" v-show="columnsCode.indexOf('Doctor')!=-1">
            <span class="wordKey">责任医生：</span>
            {{patInfo.Doctor}}
          </li>
          <li class="leftContentItem" v-show="columnsCode.indexOf('Nurse')!=-1">
            <span class="wordKey">责任护士：</span>
            {{patInfo.Nurse}}
          </li>
        </ul>
      </div>
    </div>
    <div class="bedCardRight">
      <div class="bedCardRightHead">
        <el-tooltip :content="greenChanneType[patInfo.GreenChannel]" placement="top">
          <span :class="greenChannelData[greenChanneType[patInfo.GreenChannel]]"></span>
        </el-tooltip>
        <el-tooltip content="群伤" placement="top">
        <span :class="{'qun':patInfo.IsGroupEvent}"></span>
        </el-tooltip>
        <el-tooltip content="过敏" placement="top">
        <span :class="{'min':patInfo.IsAllergy}"></span>
        </el-tooltip>
        <el-tooltip content="欠费模式" placement="top">
        <span :class="{'lv':patInfo.IsArrearsApply}"></span>
        </el-tooltip>
        <el-tooltip content="告病危" placement="top">
        <span :class="{'wei':patInfo.IsPeril}"></span>
        </el-tooltip>
        <el-tooltip content="告病重" placement="top">
        <span :class="{'zhong':patInfo.IsHeavy}"></span>
        </el-tooltip>
        <el-tooltip content="手术" placement="top">
        <span :class="{'shu':patInfo.IsOperation}"></span>
        </el-tooltip>
        <!-- <span class="wei" v-if="patInfo.IsPeril"></span>
        <span class="zhong" v-if="patInfo.IsHeavy"></span>
        <span class="shu" v-if="patInfo.IsOperation"></span> -->
        <!-- <span class="qun"></span>
        <span class="min"></span>
        <span class="lv"></span>
         <span class="wei"></span>
        <span class="zhong"></span>
        <span class="shu"></span> -->
      </div>
      <div class="bedCardRightContent">
        <ul>
          <li>
            <div v-show="columnsCode.indexOf('Department')!=-1">{{patInfo.Department||'--'}}</div>
            <div
              v-show="columnsCode.indexOf('ResidenceTime')!=-1"
            >{{patInfo.ResidenceTime}}</div>
          </li>
          <li v-show="columnsCode.indexOf('RecordNumber')!=-1">
            <span class="wordKey">病历号：</span>
            {{patInfo.RecordNumber}}
          </li>
          <li v-show="columnsCode.indexOf('HISPatientId')!=-1">
            <span class="wordKey">患者ID：</span>
            {{patInfo.HISPatientId}}
          </li>
           <li v-show="columnsCode.indexOf('CardNumber')!=-1">
            <span class="wordKey">就诊卡号：</span>
              {{patInfo.CardNumber}}
          </li>
          <li v-show="columnsCode.indexOf('FeeType')!=-1">
            <span class="wordKey wordLetter">费</span>
            <span class="wordKey">别：</span>
            {{patInfo.FeeType}}
          </li>
          <li v-show="columnsCode.indexOf('Diagnosis')!=-1" style="min-height:20px;" class="cl">
            <span class="wordKey wordLetter diagnosis">诊</span>
            <span class="wordKey diagnosis">断：</span>
            <el-tooltip placement="top">
              <div
                slot="content"
                v-show="patInfo.Diagnosis!=null||patInfo.Diagnosis!=''"
              >{{patInfo.Diagnosis}}</div>
              <span class="show2Line diagnosis">{{patInfo.Diagnosis}}</span>
            </el-tooltip>
          </li>
          <li v-show="columnsCode.indexOf('Remark')!=-1">
            <span class="wordKey wordLetter">备</span>
            <span class="wordKey">注：</span>
            <el-tooltip placement="top">
              <div
                slot="content"
                v-show="patInfo.Remark!=null||patInfo.Remark!=''"
              >{{patInfo.Remark}}</div>
              <span class="remarkWord">{{patInfo.Remark}}</span>
            </el-tooltip>
          </li>
          <li class="twoItem" style="overflow:hidden">
            <div v-show="columnsCode.indexOf('Diet')!=-1">
              <span class="wordKey wordLetter">饮</span>
              <span class="wordKey">食：</span>
              <span class="dietWord">{{patInfo.Diet}}</span> 
            </div>
            <div v-show="columnsCode.indexOf('NursingLevel')!=-1">
              <span class="wordKey">护理等级：</span>
              {{patInfo.NursingLevel|nurseLevelFilter}}
            </div>
          </li>
          <li class="twoItem" style="overflow:hidden">
            <div v-show="columnsCode.indexOf('Fee')!=-1">
              <span class="wordKey wordLetter">费</span>
              <span class="wordKey">用：</span>
              {{patInfo.Fee}}
            </div>
            <div v-show="columnsCode.indexOf('AdvancePayment')!=-1">
              <span class="wordKey">预交金：</span>
              {{patInfo.AdvancePayment}}
            </div>
          </li>
          <li class="twoItem" style="overflow:hidden">
            <div v-show="columnsCode.indexOf('Remainder')!=-1">
              <span class="wordKey wordLetter">余</span>
              <span class="wordKey">额：</span>
              {{patInfo.Remainder}}
            </div>
            <div v-show="columnsCode.indexOf('Identity')!=-1">
              <span class="wordKey wordLetter">身</span>
              <span class="wordKey">份：</span>
              {{patInfo.Identity}}
            </div>
          </li>
         
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import {greenChannelData} from '@/module/staticData.js'
export default {
  props: {
    patInfo: Object, //患者相关信息
    columns: Array,
    setAttentionTag:Function,//
  },
  data() {
    return {
      greenChannelData:greenChannelData,
      showFocus:false
    }
  },
  mounted() {
    let dom = this.$refs.bedCard
    let that = this
    dom.addEventListener('mouseenter',function(e){
      that.showFocus = true
    },false)
    dom.addEventListener('mouseleave',function(e){
      that.showFocus = false
    },false)
  },
  computed: {
    columnsCode: function() {
      let arr = [];
      this.columns.forEach(item => {
        arr.push(item.Code);
      });
      return arr;
    },
    ...mapGetters({
      inHosPatRouter: "configuration/GET_INHOSPATDATAROUTER",
       greenChanneType:"public/GET_GREENCHANNETYPE"
    })
  },
  methods:{
  bedJumpTo() {
      console.log(this.inHosPatRouter)
      this.$store.commit('public/SET_PATIENTMSG',this.patInfo)
      this.$router.push({name:this.inHosPatRouter,query:{id:this.patInfo.Id,from:'home'}})
    }
  },
};
</script>
<style lang="less" scoped>
.bedCard {
  width: 392px;
  height: 246px;
  float: left;
  margin: 10px;
  cursor: pointer;
  box-shadow: 0 0 5px rgba(153, 183, 255, 0.6);
  margin-top: 20px;
  color: @wordColor;
  padding: 10px 15px 20px 15px;
  position: relative;
  // 重点关注
  .focus{
    position: absolute;
    right:0;
    top:0;
    width:30px;
    height: 30px;
    background: rgb(218, 214, 214);
    line-height: 26px;
    text-align: center;
  }
  .bedCardLeft {
    float: left;
    width: 147px;
    .bedCardLeftHead {
      font-size: 20px;
      margin-bottom: 10px;
      color: #000622;
    }
    .bedCardLeftContent {
      border-right: 1px dashed #c0cbe9;
      height: 212px;
      .patName {
        width: 140px;
        .textEllipsis(140);
      }
      > ul {
        text-align: center;
        line-height: 1.6;
        > li:nth-child(1) {
          img {
            width: 45px;
            height: 45px;
            margin-bottom: 4px;
          }
        }
        > li:nth-child(2) {
          img {
            margin-left: 12px;
          }
        }
        > li:nth-child(4) {
          margin-bottom: 11px;
          opacity: 0.7;
        }
      }
      .leftContentItem {
        text-align: left;
        margin-left: 5px;
      }
    }
  }
  .wordKey {
    opacity: 0.6;
  }
  .wordLetter {
    letter-spacing: 13px;
  }
  .wordLetter3 {
    letter-spacing: 6px;
  }
  .bedCardRight {
    float: right;
    padding-left: 15px;
    width: 230px;
    .bedCardRightHead {
      height: 20px;
      margin-bottom: 15px;
      text-align: right;
    }
    .bedCardRightContent {
      > ul {
        line-height: 1.7;
          .diagnosis{
          float: left;
          &.show2Line{
            width: 180px;
          }
        }
        > li:nth-child(1) {
          margin-bottom: 7px;
          overflow: hidden;
          > div:nth-child(1) {
            font-size: 16px;
            float: left;
          }
          > div:nth-child(2) {
            float: right;
            color: @blueMain;
          }
        }
        > li:nth-child(5) {
          > span:nth-child(3) {
            margin-left: 50px;
            margin-top: -19px;
            margin-bottom: 3px;
          }
        }
        .twoItem{
           div {
            float: left;
            width: 50%;
          }
        }
      }
      .remarkWord {
        display: inline-block;
        width: 160px;
        line-height: 1;
        .textEllipsis(160);
      }
      .dietWord{
        display: inline-block;
        width:57px;
        line-height: 1;
        .textEllipsis(57);
      }
    }
  }
}
</style>
