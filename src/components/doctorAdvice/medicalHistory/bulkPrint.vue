<template>
  <div
    class="bulk-print"
    v-loading="showLoading"
    element-loading-text="拼命加载中"
    element-loading-background="rgba(200, 200, 200, 0.6)"
  >
    <p class="bulk-print-button cl">
      <el-button type="primary" @click="print">打印</el-button>

      <el-checkbox v-model="isMerge" @change="loading($event,)">合并打印</el-checkbox>
      <el-checkbox v-model="isChecked" @change="change">续打</el-checkbox>
      <!-- <el-button type="primary" @click="print('merge')">合并打印</el-button>
      <el-button type="primary" @click="print('add')">续打</el-button>-->
    </p>
    <iframe
      ref="iframe"
      :src="url"
      scrolling="yes"
      frameborder="0"
      class="bulk-print-iframe"
      id="bulkPrint"
    ></iframe>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {getServerTimeRandom } from "@/utils/public";

export default {
  name: "bulkPrint", //批量打印
  props: ["idList"],
  data() {
    return {
      url: "",
      isMerge: false,
      isChecked:false
    };
  },
  computed: {
    ...mapGetters({
      patientMsg: "public/GET_PATIENTMSG",
      user: "public/GET_USER",
      showLoading: "public/GET_SHOWLOADING",
      selectArea: "home/GET_SELECTAREA" ,//所在区域
      showLoading:'public/GET_SHOWLOADING'
    })
  },
  watch: {
    idList: {
      handler: function(newVal) {
        this.isMerge = false;
        this.isChecked = false;
        this.loading(this.isMerge);
      },
      immediate: true
    },
    showLoading(bl){
      if (!bl&&this.isChecked) {
        setTimeout(() => {
          this.change()
        }, 700);
      }
      // !bl&&
    }
  },
  methods: {
    print() {
        let type = this.isChecked ? "JumpPrint" : "print";
      document
        .getElementById("bulkPrint")
        .contentWindow.postMessage(type, window.URLCONFIG.Emr);
    },
        change() {
      let type = this.isChecked ? "JumpPrintIn" : "JumpPrintOut";
           document
        .getElementById("bulkPrint")
        .contentWindow.postMessage(type, window.URLCONFIG.Emr);
    },
    loading(bl) {
      let type = bl ? 15 : 13;
      let obj = {
        patientId: this.patientMsg.PatientId,
        inHospPatId: this.patientMsg.InHouseId,
        areaType: this.selectArea.DiagnosisAreaType,
        createUser: this.user.UserInfo.Id,
        mark: true,
        originUrl: window.location.protocol + "\\" + window.location.host,
        objectType: type,
        t: +new Date(),
        documentIds: this.idList
      };
      this.$store.commit("public/SET_SHOWLOADING", true);

      let str = "";
      for (const key in obj) {
        str += `${key}=${obj[key]}&`;
      }
      str = str.substring(0, str.length - 1);
      getServerTimeRandom( `${URLCONFIG.Emr}/Nursing/EditPage.aspx?${str}`).then(res=>{
       this.url=res
      });
    }
  }
};
</script>
<style scoped lang='less'>
.bulk-print {
  padding: 10px 20px;
  box-sizing: border-box;
  height: 90vh;
  .el-button,
  .el-checkbox {
    float: right;
  }
  .el-checkbox {
    margin: 8px 15px 0 0;
  }
  .bulk-print-iframe {
    width: 100%;
    height: calc(100% - 36px);
  }
}
</style>
