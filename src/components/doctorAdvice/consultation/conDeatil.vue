
<template functional>
  <div class="detail">
    <div class="content">
      <div class="type cl">
        <span class="title">会诊类别</span>
        <p>{{props.detailData.TypeName}}</p>
      </div>
      <div class="type cl">
        <span class="title">会诊项目</span>
        <p>{{props.detailData.DictItemName}}</p>
      </div>
      <div class="type cl" v-if="props.detailData.HospitalName">
        <span class="title">医疗机构</span>
        <p>{{props.detailData.HospitalName}}</p>
      </div>
      <div class="type cl">
        <span class="title">拟邀科室</span>
        <p>{{props.detailData.DepartmentNames}}</p>
      </div>
      <div class="type cl">
        <span class="title">会诊地点</span>
        <p>{{props.detailData.LocationName}}</p>
      </div>
      <div class="type cl">
        <span class="title">会诊费用</span>
        <p>{{(+props.detailData.Fee).toFixed(2)}}</p>
      </div>
      <div class="type cl">
        <span class="title">会诊目的</span>
        <p>{{props.detailData.Target}}</p>
      </div>
            <div class="type cl">
        <span class="title">会诊时间</span>
        <p>{{props.detailData.StartDate |timeFilter}}</p>
      </div>
      
      <div class="type cl">
        <span class="title">会诊联系人</span>
        <p>{{props.detailData.ContactName}}</p>
      </div>
      <div class="type cl">
        <span class="title">联系电话</span>
        <p>{{props.detailData.ContactPhone}}</p>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.detail {
  padding: 10px;
  padding-bottom: 10px;
  font-size: 14px;
  h3 {
    text-align: center;
  }
  .content {
    padding-right: 40px;
    .title {
      padding-right: 10px;
      width: 120px;
      font-weight: bold;
      text-align: right;
      float: left;
    }
    p {
      float: left;
      overflow: auto;
      width: 300px;
    }
  }
  .content > div {
    margin-bottom: 10px;
  }
  // .last {
  //   display: flex;
  //   justify-content: space-between;
  // }
}
</style>