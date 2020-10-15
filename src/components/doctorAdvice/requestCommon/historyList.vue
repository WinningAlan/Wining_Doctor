<template>
  <div class="history-list">
    <div
      class="history-item"
      v-for="(item,index) in historyListData"
      :key="index"
      :class="{active:selectId===item.InHospitalId}"
      @click="selectItem(item)"
    >
      <p>{{item.InHospTime.slice(0,10)}}</p>
      <p class="history-text">{{item.DepartmentName}}</p>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      selectId: ""
    };
  },
  props: {
    historyListData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    callback:{
        type:Function,
        default:()=>{}
    }
  },
  methods:{
      selectItem(val){
          this.selectId = val.InHospitalId;
          this.callback(val.InHospitalId)

      }
  }
};
</script>
<style lang="less" scoped>
.history-list {
  height: 100%;
  font-size: 14px;
  .history-item {
    padding-left: 10px;
    height: 50px;
    border-bottom: 1px solid #ccc;
    cursor: pointer;
    .history-text {
      width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .active {
    background: #0071e7;
    color: #fff;
    border-radius: 3px;
  }
}
</style>
