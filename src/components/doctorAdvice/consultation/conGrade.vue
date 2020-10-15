<template>
  <div class="con-grand">
    <div class="warp" v-for="(item,index) in gradeData" :key="index">
      <h3>{{item.DepartmentName}}</h3>
      <div class="grand cl">
        <span class="title">评分</span>
        <el-rate v-model="item.EvaluationGrade" show-text></el-rate>
      </div>
      <div class="grop cl">
        <span class="title">评论</span>
        <el-input type="textarea" placeholder="请输入内容" v-model="item.EvaluationDesc"></el-input>
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
    gradeData: {
      type: Array,
      default: () => {
        return [];
      }
    }
  }
};
</script>
<style lang="less" scoped>
.con-grand {
  padding: 20px;
  flex-wrap: wrap;
  max-height: 500px;
  overflow: auto;
  .warp{
    padding-bottom: 10px;
    border-bottom: 1px solid #ccc;
    margin-bottom: 10px;
    h3{
      padding-bottom: 10px;
    }
    &:last-child{
      border-bottom:none;
    }
  }
  .grand {
    padding-bottom: 20px;
  }
  .title {
    float: left;
    padding-right: 20px;
  }
  /deep/ .el-textarea__inner {
    height: 60px;
     
  }
  .el-textarea {
    height: 60px;
    width: 650px;
  }
}
</style>