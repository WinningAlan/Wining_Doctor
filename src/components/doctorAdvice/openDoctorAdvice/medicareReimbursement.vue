<template functional>
  <div class="medicareReimbursement">
    <div class="medicare-content">
      <h2>{{props.adviceData.ItemName}}</h2>
      <p>请选择医保报销类型!</p>
      <h3>适应症说明</h3>
      <p>{{props.adviceData.Memo}}</p>
    </div>
    <div class="my-button">
      <slot />
    </div>
  </div>
</template>
<style scoped lang='less'>
// 'medicareReimbursement',//医保审核
.medicareReimbursement {
  .medicare-content {
    padding: 10px 19px;
  }
  h2 {
    font-size: 18px;
  }
  h3 {
    font-size: 16px;
  }
  p {
    line-height: 32px;
    font-size: 16px;
  }
  .my-button {
    height: 58px;
    box-sizing: border-box;
    box-shadow: 0 -2px 7px 0 rgba(102, 136, 169, 0.16);
    padding: 11px 0;
    /deep/ .el-button {
      float: right;
    }
  }
}
</style>
