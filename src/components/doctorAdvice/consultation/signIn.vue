<template>
  <div class="sign-in cl">
    <div class="item cl" v-for="(item,index) in changData" :key="index">
      <span class="item-title">{{item.DepartmentName}}</span>
      <el-select
        v-model="item.DoctorName"
        @change="getDoctor($event,item)"
        @focus="focus(item,index,$event)"
        default-first-option
        filterable
        remote
        value-key="Id"
        placeholder="请输入姓名或者工号"
        :remote-method="(val)=>remoteMethod(val,item,index)"
      >
        <el-option
          v-for="el in options[index]"
          :key="el.DoctorId"
          :label="el.DoctorName"
          :value="el.DoctorId"
        ></el-option>
      </el-select>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    changData: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      options: [],
    };
  },
  methods: {
    getDoctor(val, item) {
      console.log(val,item,'getDoctor');
      if (val) {
        item.DoctorId = val;

      }
    },
    remoteMethod(val, item, index) {
      this.getDoctorName(item, val, index);
    },
    focus(item, index, e) {
      // if (e.target.value) {
      //   this.getDoctorName(item, e.target.value, index);
      // } else {
        this.getDoctorName(item, "", index);
      // }
    },
    getDoctorName(item, val, index) {
      this.$Api
        .searchUser({
          InHouseId:this.$route.query.id,
          DepartmentCode: item.DepartmentCode,
          DoctorName: val
        })
        .then(res => {
          if (res.Status) {
            this.options[index] = res.Data;
            console.log(this.options);
            this.options = [...this.options];
          }
        });
    }
  }
};
</script>
<style lang="less" scoped>
.sign-in {
  .item {
    margin-bottom: 10px;
  }
  padding: 20px;
  .item-title {
    float: left;
    width: 100px;
    text-align: right;
    padding-right: 5px;
    line-height: 32px;
  }
  .el-select {
    float: left;
    /deep/ .el-input__inner {
      background: #f2f2f2;
      border: none;
    }
  }
}
</style>