<template>
  <div class="timer-shaft">
    <div class="timer-shaft-all">
      <span class="item">在区时间：</span>
      <span class="el-icon-time icon"></span>
      <span class="time bold">{{inTime}}</span>
    </div>
    <div class="timer-shaft-content">
      <div class="timer-shaft-content-item" v-for="(item, index) in timerData" :key="index">
        <p class="round" :class="{dashed:!item.TimeAxis}"></p>
        <p class="left-line" :class="{write:index==0,dashed:!item.TimeAxis&&timerData[index-1]&&!timerData[index-1].TimeAxis}"></p>
        <p class="right-line" v-if="index<timerData.length-1" :class="{dashed:!item.TimeAxis}"></p>
        <p class="name" :class="{dashed:!item.TimeAxis,active:item.TimeAxis&&(index==timerData.length-1?true:!timerData[index+1].TimeAxis)}">{{item.OpertionNodeName}}</p>
        <p class="time" v-if="item.TimeAxis" :class="{active:item.TimeAxis&&(index==timerData.length-1?true:!timerData[index+1].TimeAxis)}">
          <span>{{item.TimeAxis.split('T')[1]}}</span>
          <span>{{item.TimeAxis.split('T')[0]}}</span>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props:{
    timerData:Array,
    inTime:'',
  },

}
</script>>
<style lang="less" scope>
.timer-shaft {
  width: 100%;
  min-height: 83px;
  max-height: 103px;
  box-sizing: border-box;
  border-bottom: 3px solid @mainBg;
  padding: 16px 10px 0px;
  // display: flex;
  // flex-direction: column;
  // justify-content: space-between;
  &-button {
    float: right;
    margin-left: 20px;
    margin-right: 10px;
    .el-button{
      padding: 9px 36px;
    }
    // padding-top: 12px;

  }
  &-all {
    float: right;
    padding-top: 7px;
    > span {
      color: #000622;
      font-size: 14px;
      margin-right: 5px;
    }
    .icon {
      color: #8599c0;
      font-size: 19px;
      // margin-top: 1px;
      // padding-top: 2px;
    }
  }
  &-content {
    overflow-y: auto;
    display: flex;
    // width: 180px;
    // border-radius: 3px;

    // flex: 1;
    // box-sizing: border-box;
    // padding: 20px 15px;
    // background: #fff;
    &-item {
      // width: 25%;
      // float: left;
      flex: 1;
      min-width: 85px;
      position: relative;
      color: #000622;
      font-size: 14px;
      .left-line,
      .right-line {
        float: left;
        height: 2px;
        background: rgba(0, 113, 231, 0.4);
        width: 50%;
        margin-top: 7px;
      }
      .write{
        background: #fff;
      }
      .round {
        position: absolute;
        height: 10px;
        width: 10px;
        border-radius: 50%;
        border: 4px solid #ccc;
        background: #0071e7;
        top: 0;
        left: 50%;
        margin-left: -7px;
   
      }

      .name,
      .time {
        // height: 20px;
        line-height: 20px;
        float: left;
        width: 100%;
        text-align: center;
        padding-top: 15px;
      }
      .time {
        font-size: 13px;
        padding-top: 0px;
display: flex;
justify-content: center;
flex-wrap: wrap;
        > span {
          // float: left;
          // width: 50%;
          // text-align: right;
          box-sizing: border-box;
          &:nth-child(1) {
            padding-right: 5px;
          }
          &:nth-child(2) {
            padding-left: 5px;
            color: rgba(0, 6, 34, 0.4);
            // text-align: left;
          }
        }
      }
        .dashed{
          &.round{
          background: #fff;
          }
          &.name{
            color: rgba(0, 6, 34, 0.4);
          }
          &.right-line,&.left-line{
            background: rgba(192, 203, 233,.4);
          }
        }
        .active{
          &.name{
            color: #0071E7;
            font-weight: bold;
          }
          >span{

                 &:nth-child(1) {
            color: #0071E7;
            }
          &:nth-child(2) {
            color: rgba(0, 113, 231,.4);
          }
          }

        }
    }
  }
 
}
</style>