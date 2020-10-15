<template>
  <div class="BoxMessageHanrd">
    <ul class="msgUl">
      <li>
        <div class="flexMssage" v-show="isShowList">
          <p class="setMo"></p>
          <div class="scoreMessage">
            <h3>未读消息列表</h3>
            <div class="item-box" v-for="item in MssageList" :key="item.MessageId">
              <div class="header cl">
                <h3 class="title">{{item.Title}}</h3>
                <p class="msg-time">{{item.CreateTime | timeFilter}}</p>
              </div>
              <div class="content">{{item.Content}}</div>
            </div>
          </div>
          <div class="moreMassage">
            <el-button type="text" @click="linkMore()">{{this.preMsgSize}}条消息未读，查看全部消息</el-button>
          </div>
        </div>
        <div class="iconwing" slot="reference" @click="ShowList">
          <div class="wingNumber" v-show="messageCount!==0">{{messageCount}}</div>
          <i class="bellStyle"></i>
        </div>
      </li>
    </ul>
    <div class="TopmassageBox" ref="massageBox" v-if="isShowAlert">
      <div class="msg-content" v-for="(item,index) in preMsgData">
        <div class="header cl">
          <h3 class="title">{{item.Title}}</h3>
          <p class="msg-time">{{item.CreateTime | timeFilter}}</p>
        </div>
        <div class="content">{{item.Content}}</div>
        <p class="is-know" @click="isKnow(item)">我知道了</p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      vmodeltom: "",
      options: [],
      useInfo: {},
      MssageList: [],
      isShowList: false,
      MassageInfo: {},
      isShowAlert: false,
      MssageModel: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      userId: "",
      msgData: "",
      newLength: 0,
      DtNow: "",
      strData: "",
      preMsgData: [],
      showAlertTimer: null,
      preMsgSize: 0,
      preisShowAlert: false
    };
  },
  created() {
    if (this.user) {
      this.useId = this.user.UserInfo.Id + "";
    }
  },
  mounted() {
    this.$nextTick(() => {
      $.support.cors = true;
      $.connection.hub.url = URLCONFIG.Master + "/signalr/";
      $.connection.hub.qs = {
        userid: this.user.UserInfo.Id,
        system: "Doctor"
      };
      var proxy = $.connection.messageHub;
      // 此处displayDatas即ChatHub类Show方法里面的
      var str = "";
      proxy.client.displayMessage = id => {
        if (id == null || id == "" || typeof id == "undefined") {
          this.getMsgData(str);
        } else {
          str = id;
        }
      };
      $.connection.hub.start();
    });
    //处理页面阻止冒泡
    var mgobj = this;
    document.addEventListener("click", function(eve) {
      let e = eve || window.event;
      const path = e.path || (e.composedPath && e.composedPath());
      if (!path) return;
      var isP = false;
      path.forEach(a => {
        if (a.className == "flexMssage") {
          isP = true;
        }
      });
      if (e.target.className != "bellStyle" && !isP) {
        mgobj.isShowList = false;
      }
    });
  },
  computed: {
    ...mapGetters({
      user: "public/GET_USER",
      messageCount: "public/GET_MESSAGECOUNT",
      messageList: "public/GET_MESSAGELIST",
      messageCheckOpen: "public/GET_MESSAGECHECKOPEN"
    })
  },
  methods: {
    //获取提示消息
    getMsgData(str) {
      this.$Api
        .getMessage({
          userId: this.user.UserInfo.Id,
          contectedId: str
        })
        .then(res => {
          console.log(res);
          if (res.Status) {
            clearInterval(this.showAlertTimer);
            this.preMsgData = res.Data;
            this.isShowAlert = true;
            this.showAlertTimer = setInterval(() => {
              if (this.isShowAlert) {
                this.isShowAlert = false;
              }
            }, 5000);
            for (var i = 0; i < res.Data.length; i++) {
              this.createNotify(res.Data[i].Title, {
                body: res.Data[i].Content,
                icon: "../../assets/logo.png",
                dir: "auto",
                lang: "zh-CN",
                tag: "testNotice"
              });
            }
          }
        });
    },
    //获取未读的消息列表
    onReadMsg() {
      this.$Api
        .getNotReadMessageList({
          userId: this.user.UserInfo.Id,
          pageIndex: 1,
          pageSize: 10
        })
        .then(res => {
          console.log(res);
          if (res.Status) {
            this.preMsgSize = res.Count;
            this.MssageList = res.Data;
          }
        });
    },
    ShowList() {
      this.isShowList = !this.isShowList;
      if (this.isShowList) {
        this.onReadMsg();
      }
    },

    isKnow(val) {
      this.$Api
        .updateUserMessageStatus({
          MessageId: val.MessageId,
          UserId: val.ToUser
        })
        .then(res => {
          if (res.Status) {
            this.isShowAlert = false;
          }
        });
    },

    //更改可读状态

    //更改消息接收或拒绝状态

    //获取未读消息数量

    //接受消息

    linkMore() {
      this.$router.push({ path: "/allMessage" });
      this.isShowList = false;
    },
    //链接地址设置
    timeReserve() {
      $.support.cors = true;
      $.connection.hub.url = URLCONFIG.Master + "/signalr/";
      var hub = $.connection.MessageHub;
      var objvue = this;
      hub.client.showMessage = function(msg) {
        var rusult = JSON.parse(msg);
        this.$Api
          .getOptionList({
            userNo: objvue.useId
          })
          .then(res => {
            if (res.Status && res.Data) {
              var msgStatus = res.Data.IsShield == 1 ? true : false;
              //判断是否当前人的消息
              if (
                rusult.ReceiveUser.toUpperCase() == objvue.useId.toUpperCase()
              ) {
                objvue.mapInfo(msgStatus, rusult);
              }
            }
          });
      };
      $.connection.hub.start();
    },
    createNotify(title, options) {
      var PERMISSON_GRANTED = "granted";
      var PERMISSON_DENIED = "denied";
      var PERMISSON_DEFAULT = "default";

      if (Notification.permission === PERMISSON_GRANTED) {
        notify(title, options);
      } else {
        Notification.requestPermission(res => {
          if (res === PERMISSON_GRANTED) {
            notify(title, options);
          }
        });
      }

      function notify($title, $options) {
        var notification = new Notification($title, $options);
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.showAlertTimer);
  }
};
</script>
<style  lang="less" scoped>
.BoxMessageHanrd {
  position: relative;
  padding: 14px 0;
  display: inline-block;
  box-sizing: border-box;
  width: 100%;
  font-size: 16px;
  margin-bottom: 5px;
  height: 60px;
  .msgUl {
    list-style: none;
    float: right;
  }
  .msgUl li {
    display: inline-block;
    position: relative;
    margin-left: 40px;
  }
  .msgUl li:last-child {
    margin-left: 8px;
    color: #827979dd;
  }
  .iconwing,
  .iconPoto {
    border-radius: 50%;
    width: 28px;
    height: 28px;
    text-align: center;
    position: relative;
  }
  .iconwing .wingNumber {
    position: absolute;
    -webkit-transform-origin: 25px 30px;
    transform-origin: 25px 30px;
    border-radius: 50%;
    bottom: 19px;
    left: 17px;
    min-width: 20px;
    max-width: 30px;
    height: 17px;
    background: #ef5757;
    text-align: center;
    font-family: SourceHanSans-Normal;
    font-size: 12px;
    color: white;
    padding-bottom: 2px;
  }
  /deep/.el-icon-bell {
    padding-top: 5px !important;
  }
  .iconwing i,
  .iconPoto i {
    color: #ffffff;
  }
  /deep/ .el-input__inner {
    border: 0px;
    position: relative;
    bottom: 2px;
  }
  /deep/ .el-select .el-input .el-select__caret {
    color: #333333;
    font-weight: 700;
  }
}
.popperEdit {
  background: #dddd !important;
  top: 57px !important;
  padding-right: 0px;
}
/deep/ .el-popper[x-placement^="bottom"] {
  margin-top: 44px;
}
.item-box {
  background: white;
  padding: 7px 12px;
  border-radius: 2px;
  margin-top: 12px;
  // .spanTag {
  //   font-weight: 700;
  //   color: #333333 !important;
  // }
  // .spanLeft {
  //   float: left;
  //   width: 80px;
  //   color: #999999;
  //   text-align: left;
  // }
  // .spanRight {
  //   float: right;
  //   width: 190px;
  // }
  // .spanData {
  //   margin-right: 15px;
  // }
  // table tbody tr td span {
  //   margin-top: 5px;
  // }
}
// .item-box:first-child {
//   padding: 0px 12px 0px 12px !important;
//   margin-top: 0px;
// }
.item-box span {
  display: inline-block;
}
.flexMssage {
  z-index: 99999;
  top: 44px;
  width: 300px;
  background: #efebeb;
  left: -150px;
  padding-top: 15px;
  max-height: 544px;
  min-height: 50px;
  position: absolute;
  font-size: 14px;
}
.scoreMessage {
  overflow: auto;
  max-height: 500px;
  padding: 10px;
  box-shadow: 0px 3px 27px 0 rgba(0, 0, 0, 0.1);
  .title {
    float: left;
  }
  .msg-time {
    float: right;
  }
  .content {
    min-height: 50px;
    padding: 10px 0;
  }
}
.moreMassage {
  padding-top: 4px;
  border-left: 0px;
  width: 100%;
  text-align: center;
  position: relative;
  background: white;
  box-shadow: 3px 4px 12px 4px rgba(0, 0, 0, 0.1);
}
.TopmassageBox,
.qu-massageBox {
  padding: 14px 23px;
  position: fixed;
  bottom: 13px;
  background: #f2f2f2;
  float: right;
  right: 20px;
  z-index: 99999;
  min-width: 240px;
  .title {
    float: left;
  }
  .msg-time {
    float: right;
  }
  .content {
    min-height: 50px;
    padding: 10px 0;
  }
  .is-know {
    float: right;
    color: #0071e7;
    font-size: 14px;
  }

  -webkit-box-shadow: 2px 3px 12px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 0px 3px 27px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  border: 1px solid #ebeef5;

  transition: all 0.5s ease-in-out 0s;
  animation: animimMssage 1s;
}
.qu-massageBox {
  top: 20px;
  right: 20px;
  max-height: 300px;
  overflow: auto;
}
@keyframes animimMssage {
  from {
    right: -373px;
  }
  to {
    right: 20px;
  }
}
/deep/ .el-notification__content p {
  margin-inline-end: 4em;
}
/deep/ .el-dialog__header,
/deep/ .el-dialog__footer {
  display: none;
}
/deep/ .v-modal {
  display: none;
}
/deep/ .el-popover .el-popper {
  background-color: #999999;
  padding-top: 12px;
  padding-left: 6px;
}
.bellStyle {
  display: inline-block;
  width: 28px;
  height: 28px;
  background-image: url("../../assets/headImages/bell.png");
}
.bellStyle:hover {
  background-image: url("../../assets/headImages/bellBlue.png");
}
.contentWordStyle[data-v-38101708] {
  color: #333333;
}
.setMo {
  position: absolute;
  width: 0;
  height: 0;
  border-bottom: 10px solid #efebeb;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  top: -9px;
  left: 150px;
}
/deep/.el-button {
  font-size: 14px;
}
</style>
