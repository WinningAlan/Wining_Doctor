<template>
  <div class="doctorSelectDep">
    选择科室：
    <el-select v-model="dialogData.selectDep" placeholder="请选择">
      <el-option
        v-for="(item,index) in user.Departments"
        :key="index"
        :label="item.Name"
        :value="item.Code"
      ></el-option>
    </el-select>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { setSession, getSession } from "@/utils/storage";
import CallNumber from "@/utils/callNumber.js";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      user: "public/GET_USER",
      dialogData: "public/GET_DIALOGDATA",
      callNumberName: "configuration/GET_CALLNUMBER" //叫号操作系统
    })
  },
  methods: {
    save() {
      console.log("保存科室");
      this.$store.commit("public/SET_DIALOGDATA", {
        ...this.dialogData,
        visible: false
      });
      let callNumberOperation = new CallNumber(this, this.callNumberName);
      let depObj = this.user.Departments.find(item => {
          return item.Code == this.dialogData.selectDep
      })
      console.log(depObj,'选择科室')
      let name = depObj?depObj.Name:''
      let params = {
          selectDep:+this.dialogData.selectDep,
          selectDepName:name,
          userInfo:this.user.UserInfo
      }
      console.log(params,'叫号登录参数')
      console.log(CallNumber,'类')
      console.log(callNumberOperation,'实例')
      callNumberOperation.Login(params);
      return false;
    }
  }
};
</script>
<style lang="less" scoped>
.doctorSelectDep {
  padding: 20px;
}
</style>