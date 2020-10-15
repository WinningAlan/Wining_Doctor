<template>
  <div class="teamContent">
    <div class="teamContentRight">
      <div class="appendselect">
        <div class="el-input-group__prepend">模板分类</div>
        <el-select v-model="teamModel.ParentId" clearable placeholder="请选择" size="m">
          <el-option
            v-for="item in teamplateLeveList"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id"
          ></el-option>
        </el-select>
      </div>
      <div class="appendInput">
        <el-input placeholder="请输入内容" v-model="teamModel.Name" style="width:365px" size="m">
          <template slot="prepend">模板名称</template>
        </el-input>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      teamModel: {
        Name: "",
        ParentId: ""
      }
    };
  },
  props: {
    teamplateLeveList:{
      type:Array,
      required: true
    }
  },
  methods: {
    //新增模板
    getData() {
      if (!this.teamModel.ParentId){
        this.$msg.warning("请选择模板分类");
        return false;
      }else if(!this.teamModel.Name) {
         this.$msg.warning("请填写模板名称");
        return false;
      }else{
        let data = {...this.teamModel};
        // this.teamModel.ParentId=this.teamModel.Name='';
        return data
      }
    },
    clearData(){
        this.teamModel.ParentId=this.teamModel.Name='';
    }
  }
};
</script>

<style lang="less" scoped>
.teamContent {
  height: 140px;
  padding: 0px 10px 10px;
  position: relative;
  .teamContentRight {
    padding-top: 22px;
    margin-left: 8px;
    padding-right: 8px;
    .appendselect {
      display: flex;
      /deep/ .el-input-group__prepend {
        width: 55px;
        line-height: 37px;
      }
      /deep/ .el-select {
        width: 268px;
      }
    }
    .appendInput {
      margin-top: 20px;
    }
  }
}
</style>