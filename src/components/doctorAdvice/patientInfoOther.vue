<template functional>
  <div class="patient-info-other cl" :class="{'showGray':props.isGray}">
    <div :class="{new:props.info.IsNew&&props.isShiftDuty}"></div>
    <img src="../../assets/imges/boyBig.png" alt v-if="props.info.PatGenderCode==1" />
    <img src="../../assets/imges/girlBig.png" alt v-else-if="props.info.PatGenderCode==2" />
    <img src="../../assets/imges/sexUnknow.svg" alt v-else />
    <div class="content">
      <div class="content-top clearfix">
        <template v-if="props.info.BedNo">
          <span>{{props.info.BedNo}}</span>
          <span class="bed">床</span>
        </template>
        <div class="rightShiftDuty" v-if="props.isShiftDuty">
          <span class="wei" v-if="props.info.IsPeril"></span>
          <span class="zhong" v-if="props.info.IsHeavy"></span>
          <span class="shu" v-if="props.info.IsOperation"></span>
          <!-- <svg-icon :iconClass="`shu`" class="patTag" v-if="props.info.IsOperation"></svg-icon>
          <svg-icon :iconClass="`wei`" class="patTag" v-if="props.info.IsPeril"></svg-icon>
          <svg-icon :icon-class="`zhong`" class="patTag" v-if="props.info.IsHeavy"></svg-icon>-->
          <!-- <span v-if="props.info.isNew">新</span>
          <span v-if="props.info.IsOperation">术</span>
          <span v-if="props.info.IsPeril">危</span>
          <span v-if="props.info.IsHeavy">重</span>-->
        </div>
        <svg-icon :iconClass="`level${props.info.TriageLevel}`" class="right" v-else></svg-icon>
      </div>
      <div class="content-center clearfix">
        <span class="name">{{props.info.PatientName}}</span>
        <span>/{{props.info.AgeYear | ageFilter(props.info.AgeMonth)}}</span>
      </div>
      <div class="content-bottom clearfix">
        <template v-if="props.docMedicalCar==2">
          <span class="title">病历号:</span>
          <span class="number-content">{{props.info.RecordNumber}}</span>
        </template>
        <template v-if="props.docMedicalCar==0">
          <span class="title">PID:</span>
          <span>{{props.info.HISPatientId}}</span>
        </template>
        <template v-if="props.docMedicalCar==1">
          <span class="title">卡号:</span>
          <span class="number-content">{{props.info.CardNumber}}</span>
        </template>

        <!-- {{props.docMedicalCar}} -->
        <!-- <span></span>
        <span></span>-->
      </div>
      <div class="content-bottom clearfix" v-if="props.isShiftDuty">
        <span class="name">责任医生:</span>
        <span>{{props.info.DoctorName}}</span>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
@wordColor: #333333;
@wordColorGray: #999999;
// 医生交班不可选的患者
.showGray {
  background: #f2f2f2;
}
.patient-info-other {
  position: relative;
  cursor: pointer;
  vertical-align: middle;
  border: 1px solid #e0e0e0;
  border-radius: 2px;
  width: 230px;
  // height: 83px;
  box-sizing: border-box;
  padding: 10px;
  img {
    // vertical-align: center;
    padding-top: 9px;
    width: 50px;
    height: 50px;

    float: left;
  }
  .content {
    color: @wordColor;

    overflow: hidden;
    padding-left: 12px;

    .content-top {
      line-height: 22px;

      font-size: 14px;
      > span {
        float: left;
        font-size: 18px;
        color: #000622;
        font-weight: 600;
      }
      .right {
        float: right;
        width: 22px;
        height: 22px;
      }
      .rightShiftDuty {
        float: right;
        .patTag {
          margin-left: 5px;
        }
      }
    }
    .content-center {
      line-height: 20px;

      font-size: 14px;
      > span {
        float: left;
      }
      .name {
        text-overflow: ellipsis;
        overflow: hidden;
        max-width: 105px;
        color: #000622;
        white-space: nowrap;
      }
    }
    .content-bottom {
      line-height: 19px;

      font-size: 13px;
      > span {
        float: left;
        &.title {
          color: rgba(0, 6, 16, 0.6);
        }
      }
      .number-content{
        display: inline-block;
        width:100px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>

