<template>
  <div class="saveOrderPackage">
    <el-form :model="orderPackageParams" :rules="rules" ref="saveOrderPackage" label-width="60px">
      <el-form-item label="名称" prop="PackageName">
        <el-input v-model="orderPackageParams.PackageName" autofocus ref="PackageName"></el-input>
      </el-form-item>
      <!-- <el-form-item label="  拼音" prop="pinyin"></el-form-item> -->
      <el-form-item label="范围" prop="PackageRangeCode">
        <el-radio
          v-model="orderPackageParams.PackageRangeCode"
          :label="item.Value"
          v-for="(item,index) in orderPackageRange"
          :key="index"
          v-show="!(item.Value==2&&userRightList.IsHasDeptRight==false)"
        >{{item.Text}}</el-radio>
      </el-form-item>
      <el-form-item label="类别" prop="PackageCategoryCode">
        <el-select v-model="orderPackageParams.PackageCategoryCode" placeholder="请选择">
          <el-option
            v-for="(item,index) in orderPackageType"
            :key="index"
            :label="item.Text"
            :value="item.Value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  props: {
    initial: Boolean
  },
  data() {
    return {
      rules: {
        PackageName: [
          {
            required: true,
            message: "请输入医嘱套餐名称",
            trigger: "blur"
          }
        ],
        PackageRangeCode: [
          { required: true, message: "请输入范围", trigger: "blur" }
        ],
        PackageCategoryCode: [
          { required: true, message: "请输入类别", trigger: "blur" }
        ]
      },
      orderPackageParams: {
            PackageCategoryCode: '',
            PackageRangeCode: "1",
            PackageName:''
      } //医嘱编辑的相关参数
    };
  },
  watch: {
    initial: {
      immediate: true,
      handler: function(val) {
        if (val) {
          this.$refs.saveOrderPackage&&this.$refs.saveOrderPackage.resetFields()
          this.$refs.PackageName&&this.$refs.PackageName.focus()
          this.orderPackageParams = {
            PackageCategoryCode: this.orderPackageType[0].Value,
            PackageRangeCode: "1",
            PackageName:''
          };
        }
      }
    }
  },
  mounted() {
    console.log(this.userRightList, "用户权限");
    // resetFields
  },
  methods: {
    save() {
      return new Promise((resolve, reject) => {
        this.$refs.saveOrderPackage.validate((valid, obj) => {
          console.log(obj);
          console.log(valid);
          if (valid) {
            // 校验通过
            this.orderPackageParams.CurrentUserId = this.user.UserInfo.Id;
            resolve(this.orderPackageParams);
          } else {
            resolve(false);
          }
        });
      });
    }
  },
  computed: {
    ...mapGetters({
      orderPackageRange: "orderpackages/GET_ORDERPACKAGERANGE",
      orderPackageType: "orderpackages/GET_ORDERPACKAGETYPE",
      user: "public/GET_USER",
      userRightList: "public/GET_USERRIGHTLIST"
    })
  }
};
</script>
<style lang="less" scoped>
.saveOrderPackage {
  padding: 20px;
  .el-input {
    width: 450px;
  }
}
</style>