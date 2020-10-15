<template>
  <div>
    <div class="modifyPwBox">
      <div class="pwUser">
        <img src="../../assets/headImages/homePer.svg" alt class="pwPerLeftImg">
        <span class="pwPerLeftWord">{{username}}</span>
      </div>
      <div class="pwInput">
        <el-input
          placeholder="请输入旧密码"
          v-model="oldPw"
          type="password"
          class="inputStyle"
          id="oldPw"
          @blur="lostFocus('oldPw')"
          @focus="getFocus('oldPw')"
          @keyup.enter.native="pressKey1"
        >
          <i
            slot="suffix"
            class="el-input__icon eyecloseImg"
            v-if="oldPw!=''&&showoldPw==false&&showOldIcon==true"
            @click="showOldPw('oldPw')"
          ></i>
          <i
            slot="suffix"
            class="el-input__icon eyeopenImg"
            v-if="oldPw!=''&&showoldPw==true&&showOldIcon==true"
            @click="showOldPw('oldPw')"
          ></i>
          <i
            slot="suffix"
            class="el-input__icon closeImg"
            v-if="oldPw!=''&&showOldIcon==true"
            @click="clearOldPw('oldPw')"
          ></i>
        </el-input>
      </div>
      <div class="pwInput">
        <el-input
          placeholder="请输入新密码"
          v-model="newPw"
          type="password"
          class="inputStyle"
          id="newPw"
          @keyup.enter.native="pressKey2"
        >
          <i
            slot="suffix"
            class="el-input__icon eyecloseImg"
            v-if="newPw!=''&&showNewPw==false&&showNewIcon==true"
            @click="showOldPw('newPw')"
          ></i>
          <i
            slot="suffix"
            class="el-input__icon eyeopenImg"
            v-if="newPw!=''&&showNewPw==true&&showNewIcon==true"
            @click="showOldPw('newPw')"
          ></i>
          <i
            slot="suffix"
            class="el-input__icon closeImg"
            v-if="newPw!=''&&showNewIcon==true"
            @click="clearOldPw('newPw')"
          ></i>
        </el-input>
      </div>
      <div class="pwInput">
        <el-input
          placeholder="请确认新密码"
          v-model="sureNewPw"
          type="password"
          class="inputStyle"
          id="sureNewPw"
          @keyup.enter.native="pressKey3"
        >
          <i
            slot="suffix"
            class="el-input__icon eyecloseImg"
            v-if="sureNewPw!=''&&showSureNewPw==false&&showSureNewIcon==true"
            @click="showOldPw('sureNewPw')"
          ></i>
          <i
            slot="suffix"
            class="el-input__icon eyeopenImg"
            v-if="sureNewPw!=''&&showSureNewPw==true&&showSureNewIcon==true"
            @click="showOldPw('sureNewPw')"
          ></i>
          <i
            slot="suffix"
            class="el-input__icon closeImg"
            v-if="sureNewPw!=''&&showSureNewIcon==true"
            @click="clearOldPw('sureNewPw')"
          ></i>
        </el-input>
      </div>
      <div class="pwInput btnStyle">
        <el-button plain class="btnCancel" @click="close">取消</el-button>
        <el-button type="primary" class="btnSure" @click="sure" :disabled="btnDisabled">确定</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { removeSession } from "@/utils/storage";
import { mapGetters } from "vuex";
export default {
  props: {
    username: {
      type: String,
      default: ""
    },
    cancel: {
      type: Function
    },
    password: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      oldPw: "",
      newPw: "",
      sureNewPw: "",
      showoldPw: false,
      showNewPw: false,
      showSureNewPw: false,
      showOldIcon: true,
      showNewIcon: true,
      showSureNewIcon: true
    };
  },
  methods: {
    showOldPw(id) {
      this.getFocus(id);
      let dom = document.getElementById(id);
      let show = false;
      if (id === "oldPw") {
        this.showoldPw = !this.showoldPw;
        show = this.showoldPw;
      } else if (id == "newPw") {
        this.showNewPw = !this.showNewPw;
        show = this.showNewPw;
      } else if (id === "sureNewPw") {
        this.showSureNewPw = !this.showSureNewPw;
        show = this.showSureNewPw;
      }

      if (show) {
        dom.setAttribute("type", "text");
      } else {
        dom.setAttribute("type", "password");
      }
    },
    clearOldPw(id) {
      if (id === "oldPw") {
        this.oldPw = "";
        this.showoldPw = false;
      } else if (id == "newPw") {
        this.showNewPw = false;
        this.newPw = "";
      } else if (id === "sureNewPw") {
        this.showSureNewPw = false;
        this.sureNewPw = "";
      }

      let dom = document.getElementById(id);
      dom.setAttribute("type", "password");
      this.getFocus(id);
    },
    close() {
      this.cancel(false);
    },
    sure() {
      if (this.newPw != this.sureNewPw) {
        this.$message({
          showClose: true,
          message: "两次输入密码不一致",
          type: "error",
          center: true
        });
        return;
      }
      this.$Api
        .changePwd({
          No: this.userNo,
          OldPwd: this.oldPw,
          NewPwd: this.newPw
        })
        .then(res => {
          if (res.Status) {
            removeSession("user");
            window.location.href = "./#/login";
            this.$message({
              showClose: true,
              message: "修改密码成功",
              type: "success",
              center: true
            });
          } else {
            this.$message({
              showClose: true,
              message: res.Message,
              type: "error",
              center: true
            });
          }
        });
    },
    lostFocus(id) {
      // if(id === "oldPw"){
      //     this.showOldIcon = false
      // } else if(id == 'newPw'){
      //     this.showNewIcon = false
      // } else if(id === 'sureNewPw') {
      //     this.showSureNewIcon = false
      // }
    },
    getFocus(id) {
      // if(id === "oldPw"){
      //     this.showOldIcon = true
      // } else if(id == 'newPw'){
      //     this.showNewIcon = true
      // } else if(id === 'sureNewPw') {
      //     this.showSureNewIcon = true
      // }
    },
    pressKey1(event) {
      if (event.keyCode === 13) {
        let dom = document.getElementById("newPw");
        dom.focus();
      }
    },
    pressKey2(event) {
      if (event.keyCode === 13) {
        let dom = document.getElementById("sureNewPw");
        dom.focus();
      }
    },
    pressKey3(event) {
      if (event.keyCode === 13) {
        if (this.btnDisabled === false) {
          this.sure();
        } else {
          let dom = document.getElementById("oldPw");
          dom.focus();
        }
      }
    }
  },
  computed: {
    btnDisabled: function() {
      if (this.oldPw != "" && this.newPw != "" && this.sureNewPw != "") {
        return false;
      } else {
        return true;
      }
    },
    ...mapGetters({
      user: "public/GET_USER"
    }),
    userNo: function() {
      return this.user.UserInfo.No;
    }
  }
};
</script>
<style lang="less" scoped>
.modifyPwBox {
  padding: 0 76px;
  text-align: center;
  /deep/ .el-input__inner {
    border-radius: 0;
    border: none;
    border-bottom: 1px solid #d9d9d9;
  }

  .inputStyle {
    border: none;
  }

  .pwUser {
    padding: 35px 0;
  }
  .pwInput {
    padding-bottom: 11px;
  }
  // .el-button{
  //     width: 156px;
  //     height: 48px;
  // }
  .el-button {
    width: 156px;
    height: 48px;
    margin-right: 0px;
    font-size: 20px;
    font-weight: bold;
    margin-top: 20px;
  }
  .btnCancel.el-button {
    margin-right: 20px;
  }
  .pwPerLeftImg {
    width: 38px;
    height: 39px;
    padding-right: 15px;
  }
  .pwPerLeftWord {
    vertical-align: middle;
    font-size: 22px;
  }
  .pwUser > div {
    display: inline-block;
    font-size: 22px;
  }

  .btnStyle {
    padding-bottom: 50px;
  }
  .el-button--primary.is-disabled,
  .el-button--primary.is-disabled:active,
  .el-button--primary.is-disabled:focus,
  .el-button--primary.is-disabled:hover {
    background-color: #ededed;
    border-color: #ededed;
  }
  .closeImg {
    background-image: url("../../assets/headImages/closeun.svg");
    background-repeat: no-repeat;
    display: inline-block;
    margin-top: 10px;
    cursor: pointer;
  }
  .closeImg:hover {
    background-image: url("../../assets/headImages/close.svg");
    background-repeat: no-repeat;
  }
  .eyecloseImg {
    display: inline-block;
    background-image: url("../../assets/headImages/eyecloseun.svg");
    background-repeat: no-repeat;
    cursor: pointer;
  }
  .eyecloseImg:hover {
    background-image: url("../../assets/headImages/eyeclose.svg");
    background-repeat: no-repeat;
  }
  .eyeopenImg {
    display: inline-block;
    background-image: url("../../assets/headImages/eyeopenun.svg");
    background-repeat: no-repeat;
    cursor: pointer;
  }
  .eyeopenImg:hover {
    background-image: url("../../assets/headImages/eyeopen.svg");
    background-repeat: no-repeat;
  }
}
</style>


