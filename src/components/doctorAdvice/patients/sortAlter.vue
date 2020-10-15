<template>
  <div class="header-content">
    <el-checkbox
      border
      :indeterminate="isIndeterminate"
      v-model="checkAll"
      @change="checkAllChange"
      class="elCheck-All"
    >全选</el-checkbox>
    <!-- <el-checkbox-group v-model="checkedColuns" @change="checkCloumnChange"> -->
      <draggable v-model="checkAllColuns"  class="check-group" :options="{animation:500}">
        <!-- <transition-group> -->
      <el-checkbox
        border
        v-model="item.Check"
        v-for="item in checkAllColuns"
        @change="checkCloumnChange"
        :key="item.key"
      >{{item.RowName}}</el-checkbox>
        <!-- </transition-group> -->
      </draggable>
    <!-- </el-checkbox-group> -->
  </div>
</template>
<script>
import draggable from 'vuedraggable'
export default {
  components:{
draggable
  },
  data() {
    return {
      checkAll: false,
      isIndeterminate: true,
      checkAllColuns:[],
      length:0,//列的长度
      checkedLength:0,//选中的数量
    };
  },
  props: {
    cloumnList: {
      type: Array
    },
initialize:Boolean,
  },
    watch: {
    initialize: {
      handler: function(val, oldVal) {
       if (val) {
             console.log(this.cloumnList)
    this.checkAllColuns=JSON.parse(JSON.stringify(this.cloumnList));
    this.length=this.checkAllColuns.length;
    this.checkedLength=0
    this.checkAllColuns.forEach(item=>{
     item.Check&&++this.checkedLength
    })
    this.isIndeterminate=this.checkedLength>0&&this.checkedLength<this.length;
    this.checkAll=this.checkedLength===this.length
       }
      },
      immediate: true
    }
  },
 

  methods: {
    getCloumn(){
      // let arr=[];
      this.checkAllColuns.forEach((item,index)=>{
        item.SortIndex=index
      })
      console.log(this.checkAllColuns);
      return this.checkAllColuns
    },
    checkAllChange(val) {
      this.checkAllColuns.forEach(item=>{
        item.Check = val
      })
      this.checkedLength=val?this.length:0;
      this.isIndeterminate = false;
    },
    checkCloumnChange(value) {
    value? ++this.checkedLength: this.checkedLength--;
          this.isIndeterminate=this.checkedLength>0&&this.checkedLength<this.length;
    this.checkAll=this.checkedLength===this.length
    }
  }
};
</script>
<style  lang="less" scoped>
.header-content {
  padding: 20px 20px ;
  max-height: 500px;
  /deep/ .el-checkbox + .el-checkbox {
    margin-left: 0px;

  }
  .el-checkbox.is-bordered+.el-checkbox.is-bordered{
      margin-left:0;
  }
  .check-group {
    padding-left: 30px;
  
    .el-checkbox {
      margin-right: 15px;
      margin-top: 10px;
      width: 135px;
      cursor: move;
    }
  }
  .elCheck-All {
    margin-left: 30px;
  }
}
</style>