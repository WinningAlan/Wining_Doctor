<!-- 区域记录时间轴 -->
<template functional>
       <div class="area-timer-shaft cl">
        <div class="area-timer-shaft-header">
          <el-checkbox  :value="props.checked" @change="props.timeChick">区域记录合并</el-checkbox>
        </div>
        <div class="phase">
          <div class="phase-item" v-for="(item,index) in props.phaseData" :key="item.Id">
            <div class="phase-current" v-if="index===props.phaseData.length-1"></div>
            <div class="phase-dot" :class="'bg'+item.TargetAreaType"></div>
            <div class="phase-card" :class="{active:props.activeId===item.Id}" @click="props.timeChick(item)">
              <div class="phase-name">{{item.TargetAreaName}}</div>
              <div class="start-time">
                <!-- <span>入区时间:</span> -->
                <span>入区:</span>
                {{item.StartTime | timeFilter}}
              </div>
              <div class="end-time">
                <!-- <span>离开时间:</span> -->
                <span>出区:</span>
                {{item.EndTime | timeFilter}}
              </div>
            </div>
            <span class="icon el-icon-caret-bottom" v-if="index===props.phaseData.length-1"></span>
          </div>
        </div>
      </div>
</template>
<style scoped lang='less'>
    .area-timer-shaft {
      .area-timer-shaft-header {
        float: right;
        margin-right: 20px;
      }
      .phase {
        margin-top: 40px;
        overflow: auto;
        height: calc(~"(100% - 60px)");
      }
      .phase-item {
        height: 100px;
        border-left: 5px solid #f2f2f2;
        margin-left: 25px;
        position: relative;
        cursor: pointer;
        .phase-dot {
          width: 10px;
          height: 10px;
          background: #ec7979;
          border-radius: 50%;
          border: 4px solid #ccc;
          position: absolute;
          left: -12px;
          top: 50%;
          margin-top: -10px;
        }
        .bg1 {
          background: #ec7979;
        }
        .bg2 {
          background: #e4b808;
        }
        .bg3 {
          background: #e4b808;
        }
        .phase-current {
          border-style: solid;
          border-width: 8px;
          position: absolute;
          left: -22px;
          top: 50%;
          margin-top: -10px;
          border-color: transparent transparent transparent #0071e7;
        }
        .icon {
          position: absolute;
          bottom: -18px;
          font-size: 30px;
          left: -17px;
          color: #f2f2f2;
        }
        .phase-card {
          height: 80px;
          width: 133px;
          position: absolute;
          left: 10px;
          top: 50%;
          margin-top: -44px;
          padding: 10px;
          padding-top: 0;
          font-size: 10px;
          line-height: 2;
          .phase-name {
            font-size: 16px;
          }
          &:hover {
            background: #ebf4fd;
          }
          &.active {
            background: #d0e7ff;
          }
        }
      }
    }
</style>
