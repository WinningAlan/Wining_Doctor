<template>
  <div class="turnTo">
    <div class="title">请选择疾病转归：</div>
    <div class="turnToContent">
      <el-radio
        v-model="turnedTo"
        v-for="(item,index) in turnedToList"
        :key="index"
        :label="item.Value"
        v-show="item.Value!=-1"
      >{{item.Text}}</el-radio>
    </div>
    <div class="title">请选择患者去向：</div>
    <div class="turnToContent">
      <el-radio
        v-model="transferTo"
        v-for="(item,index) in nursingToList"
        :key="index"
        :label="item.Value"
        v-show="item.Value!=-1"
        :disabled="(selectArea.DiagnosisAreaType==1&&item.Value==1)||selectArea.DiagnosisAreaType==2&&item.Value==4"
      >{{item.Text}}</el-radio>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import CallNumber from "@/utils/callNumber.js";
export default {
  data() {
    return {
      turnedTo: 1,
      transferTo: 2
    };
  },
  props: {
    initialize: Boolean
  },
  watch: {
    initialize: {
      handler: function(val, oldVal) {
        if (val) {
          this.turnedTo = 1;
          this.transferTo = 2;
        }
      },
      immediate: true
    }
  },
  created() {
    if (this.isQueueNumber === "1") {
      this.callNumber = new CallNumber(this, this.callNumberName);
    }
  },
  computed: {
    ...mapGetters({
      dialogData: "public/GET_DIALOGDATA",
      selectArea: "home/GET_SELECTAREA",
      dictionarys: "public/GET_DICTIONARIES",
      user: "public/GET_USER",
      isQueueNumber: "configuration/GET_ISQUEUENUMBER", //是否启用排队叫号系统
      callNumberName: "configuration/GET_CALLNUMBER", //叫号操作系统
      caImgData: "public/GET_CAIMGDATA" //ca签名图片数据流，医嘱提交处使用
    }),
    nursingToList: function() {
      return this.dictionarys.NursingTo;
    },
    turnedToList: function() {
      return this.dictionarys.TurnedTo;
    }
  },
  methods: {
    async save() {
      let patData = this.dialogData.data;
        console.log(this.transferTo == 6, "转归");
        //this.$store.commit("public/SET_DIALOGDATA", {});
        if (this.transferTo == 7) {
          // 住院
          let obj = {
            title: "住院申请",
            width: "650px",
            component: "inHosRequestNotes",
            visible: true,
            data: {...patData,turnedTo: this.turnedTo,
              transferTo: this.transferTo}
          };
          this.$store.commit("public/SET_DIALOGDATA", obj);
        } else if (this.transferTo == 6) {
          // z转院//猜测
          let obj = {
            title: "转院申请",
            width: "650px",
            component: "transferHosRequestNotes",
            visible: true,
            data: {...patData,turnedTo: this.turnedTo,
              transferTo: this.transferTo}
          };
          this.$store.commit("public/SET_DIALOGDATA", obj);
        } else {
          if (this.selectArea.DiagnosisAreaType === 3) {
            // 先接诊//之后
            if (
              patData.Id == "00000000-0000-0000-0000-000000000000" ||
              patData.Id == null
            ) {
              let params = {
                triageId: patData.TriageId,
                patientId: patData.PatientId,
                registerId: patData.ActiveRegistId,
                departmentCode: patData.DepartmentCode,
                triageLevel: patData.TriageLevel
              };
              let res = await this.$Api.patReceive(params);
              if (res.Status) {
                //this.$msg.success(res.Message);
                patData.Id = res.Data;
              } else {
                this.$msg.warning("就诊失败");
                return false;
              }
            }
            let obj = {
              inHospitalId: patData.Id,
              turnedTo: this.turnedTo,
              transferTo: this.transferTo
            };
            let result = await this.$Api.patPrognosis(obj);
            if (result.Status) {
              this.$msg.success(result.Message);
              // 改变叫号系统状态
              console.log(
                this.isQueueNumber,
                "ffffff",
                this.transferTo,
                this.callNumber
              );
              if (this.isQueueNumber === "1" && !patData.IsRecall) {
                if (
                  this.transferTo == 2 ||
                  this.transferTo == 6 ||
                  this.transferTo == 7 ||
                  this.transferTo == 8
                ) {
                  this.callNumber.ChangeBrzt(patData.ActiveRegistId, 5);
                }
              }

              // 急门诊需要刷新
              if (this.$route.name == "openDoctorAdvice") {
                let t = new Date().getTime();
                // 当前处于医嘱下达页面，刷新医嘱列表
                this.$router.push({
                  path: this.$route.path,
                  query: {
                    id: this.$route.query.id,
                    from: this.$route.query.from,
                    t: t
                  }
                });
              }
              return true;
            } else {
              this.$msg.warning(result.Message);
              return false;
            }
          } else {
            let obj = {
              inHospitalId: patData.Id,
              turnedTo: this.turnedTo,
              transferTo: this.transferTo,
              CASignImg: this.caImgData
            };
            let result = await this.$Api.patPrognosis(obj);
            if (result.Status) {
              this.$msg.success(result.Message);
              return true;
            } else {
              this.$msg.warning(result.Message);
              return false;
            }
          }
        }
    }
  }
};
</script>
<style lang="less" scoped>
.turnTo {
  padding: 0 20px 20px 20px;
  .title {
    margin-top: 20px;
  }
  .turnToContent {
    /deep/.el-radio {
      margin-top: 20px;
      margin-right: 97px;
    }
    /deep/.el-radio + .el-radio {
      margin-left: 0;
    }
  }
}
</style>