<template>
  <div class="pwVerification">
    <div class="handoverType" v-if="dialogData.activeName=='1'">
      <span>交班类型</span>
      <el-radio
        v-model="DoctorScheduleId"
        :label="item.Id"
        v-for="(item,index) in doctorScheduleList"
        :key="index"
        v-show="item.Status==1"
      >{{item.ScheduleName}}</el-radio>
    </div>
    <div class="No">
      <span>
        <span class="w1">工</span>号
      </span>
      <span>{{No}}</span>
    </div>
    <div class="time">
      <span>交班时间</span>
      <el-date-picker
        v-model="finishTimeDialog"
        type="datetime"
        placeholder="请选择日期时间"
        format="yyyy-MM-dd HH:mm:ss"
        value-format="yyyy-MM-dd HH:mm:ss"
        :clearable="false"
        class="my-input-time"
      ></el-date-picker>
    </div>
    <div class="pw">
      <span>
        <span class="w1">密</span>码
      </span>
      <el-input
        size="small"
        v-model="pw"
        type="password"
        @keyup.13="closeDialog"
        autocomplete="new-password"
        :placeholder="pwPlaceholder"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { changeDateTimeFormat } from "@/utils/public";
export default {
  props: {
    closeDialog: {
      type: Function,
      default: function() {
        return {};
      }
    },
    initialize: Boolean
  },

  watch: {},
  data() {
    return {
      No: "",
      pw: "",
      options: [],
      loading: false,
      finishTimeDialog: changeDateTimeFormat(new Date()),
      DoctorScheduleId: "" //班次
    };
  },
  created() {},
  computed: {
    ...mapGetters({
      user: "public/GET_USER",
      getPw: "shiftduty/GET_PW",
      doctorScheduleList: "public/GET_DOCTORSCHEDULEINFO",
      dialogData: "public/GET_DIALOGDATA",
      isSignName: "public/GET_ISSIGNNAME", //是否启用
    }),
    pwPlaceholder:function() {
      console.log(this.isSignName)
      return this.isSignName?'请输入CA密码':'请输入密码'
    }
  },
  watch: {
    pw: function(newValue) {
      this.$store.commit("shiftduty/SET_PW", newValue);
    },
    getPw: {
      immediate: true,
      handler: function(newValue) {
        if (newValue == "") {
          this.pw = "";
        }
      }
    },
    finishTimeDialog: {
      immediate: true,
      handler: function(newValue) {
        this.$emit("update:finishTime", newValue);
      }
    },
    initialize: {
      handler: function(val, oldVal) {
        if (val) {
          this.No = this.user.UserInfo.No;
          this.pw=''
          let hour = new Date().getHours();
          let schNow = "";
          this.finishTimeDialog = changeDateTimeFormat(new Date());

          this.doctorScheduleList.forEach(item => {
            let schStartHour = item.StartTime.split(":")[0];
            let schEndHour = item.EndTime.split(":")[0];
            console.log(schStartHour);
            console.log(schEndHour);
            if (item.IfCrossDay) {
              // 跨天
              if (hour >= schStartHour || hour <= schEndHour) {
                schNow = item;
              }
            } else {
         
              if (hour >= schStartHour && hour <= schEndHour) {
                schNow = item;
              }
            }
          });
          if (schNow != "") {
            this.DoctorScheduleId = schNow.Id;
          }
          console.log(schNow, "班次");
        }
      },
      immediate: true
    }
  },
  methods: {
    // 校验内容
    save() {
      console.log('保存xxx')
      let msg = "";
      if (this.No === "") {
        msg = "工号不允许为空";
      } else if (this.pw === "") {
        msg = "密码不允许为空";
      } else if (this.finishTimeDialog === "") {
        msg = "时间不允许为空";
      } else if (
        this.DoctorScheduleId == "" &&
        this.dialogData.activeName == "1"
      ) {
        msg = "交班类型不允许为空";
      }
      if (msg) {
        this.$msg.warning(msg);
        // 验证出错
        return 1;
      }
      console.log(this.pw,'设置密码')
      this.$store.commit('shiftduty/SET_PW',this.pw)
      let obj = {};
      if (this.dialogData.activeName == "1") {
        obj = {
          No: this.No,
          Pwd: this.pw,
          NursingScheduleId: this.DoctorScheduleId,
          HhandoverTime: this.finishTimeDialog
        };
      } else {
        obj = {
          No: this.No,
          Pwd: this.pw,
          ShiftDateTime: this.finishTimeDialog
        };
      }
      return obj;
    }
  }
};
</script>

<style lang="less" scoped>
.pwVerification {
  margin: 62px 32px 74px 32px;
  .w1 {
    letter-spacing: 29px;
  }
  .time {
    font-size: 14px;
    color: #777777;
    margin-bottom: 32px;

    /deep/ .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      height: 32px;
      width: 283px;
    }
    /deep/ .el-input--prefix .el-input__inner {
      height: 32px;
    }
    /deep/.el-input__prefix,
    .el-input__suffix {
      top: -3.5px;
    }
    span {
      margin-right: 13px;
    }
  }
  // 交班类型
  .handoverType {
    span {
      margin-right: 10px;
    }
    margin-bottom: 32px;
  }
  .No {
    height: 32px;
    line-height: 32px;
    margin-bottom: 32px;
    /deep/ .el-select {
      width: 283px;
      margin-left: 10px;

      .el-input__inner {
        background: #f2f2f2;
        border: none;
      }
    }
    span:nth-child(1) {
      font-size: 14px;
      color: #777777;
    }
    span:nth-child(2) {
      margin-left: 10px;
    }
  }
  .pw {
    span {
      font-size: 14px;
      color: #777777;
    }
    /deep/ .el-input {
      width: 283px;
      margin-left: 10px;

      .el-input__inner {
        background: #f2f2f2;
        border: none;
      }
    }
  }
}
</style>

