<template>
  <div class="head-content clearfix">
    <div class="left-logo">
      <a href="./#/home">
        <img src="../../assets/logo.png" />
      </a>
    </div>
    <div class="nav-list">
      <ul>
        <router-link
          tag="li"
          v-for="(item,index) in navList"
          :to="{name:item.UiRouter}"
          :key="index"
          v-if="item.UiRouter!='con'"
          :class="{active:$route.path.indexOf(item.UiRouter)>-1}"
        >
          <!-- <div :class="item.Icon"></div> -->
          <svg-icon :iconClass="item.Icon" class="menu-icon"></svg-icon>
          <span>{{item.Name}}</span>
        </router-link>
      </ul>
    </div>
    <div class="right-mess">
      <div class="dome clearfix">
        <div class="homePerRight">
          <el-dropdown @command="handleClick">
            <span class="el-dropdown-link">
              {{username}}
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="tel" class="dropItem cl">
                <div class="imgStyle imgBgStyle1"></div>
                <span class="dropWord">
                  {{username}} &nbsp;
                  <span class="telWord">{{tel}}</span>
                </span>
                <div class="line"></div>
              </el-dropdown-item>
              <!-- <el-dropdown-item command="changearea" class="dropItem cl">
                <div class="imgStyle imgBgStyle4"></div>
                <span class="dropWord">切换院区</span>
                <div class="line"></div>
              </el-dropdown-item>-->
              <el-dropdown-item command="pw" class="dropItem cl">
                <div class="imgStyle imgBgStyle2"></div>
                <span class="dropWord">修改密码</span>
                <div class="line"></div>
              </el-dropdown-item>
              <el-dropdown-item command="zhuxiao" class="dropItem cl">
                <div class="imgStyle imgBgStyle3"></div>
                <span class="dropWord">注销登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="homePerLeft"></div>
      </div>
      <!-- <div class="messageStyle">
        <messagebox></messagebox>
      </div>-->
    </div>
    <my-alert title="修改密码" width="485px" :visible="showDialog" :callback="close" :isfooter="false">
      <component
        :is="component"
        slot="content"
        :username="username"
        :cancel="close"
        ref="changeArea"
        :isShow="showDialog"
      ></component>
    </my-alert>
  </div>
</template>
<script>
import myAlert from "@/components/common/myAlter";
import modifyPw from "@/components/headCom/modifyPw";
// import messagebox from "../../components/headCom/messageBox";

import { mapGetters } from "vuex";

export default {
  props: {
    username: {
      type: String,
      default: ""
    },
    tel: {
      type: String,
      default: ""
    },
    navData: {
      type: Array
    }
  },
  components: {
    myAlert,
    modifyPw
    // messagebox
  },
  computed: {},
  data() {
    return {
      showDialog: false,
      component: ""
    };
  },
  computed: {
    navList() {
      return this.navData.filter(item => {
        return item.UiRouter !== "doctorAdvice";
        // return true
      });
    }
  },
  methods: {
    handleClick(command) {
      if (command === "pw") {
        // 修改密码
        this.component = "modifyPw";

        this.showDialog = true;
        // this.showModifyAlert()
      } else if (command === "zhuxiao") {
        // 注销登录
        this.$Api.logout().then(res => {
          sessionStorage.clear();
          window.location.href = "./#/login";
        });
      }
    },

    close(bl) {
      this.showDialog = false;
    }
  }
};
</script>
<style lang="less" scoped>
.head-content {
  height: 60px;

  width: 100%;
  background: #0071e7;

  .left-logo {
    float: left;
    width: 169px;

    height: 60px;
    color: #fff;
    font-size: 24px;
    text-align: center;
    a {
      display: block;
      width: 170px;

      height: 60px;
    }
    img {
      width: 90px;
      height: 20px;
      margin: 20px 0;
    }
  }
  li {
    list-style: none;
  }
  .nav-list {
    float: left;
    ul {
      display: flex;
      li {
        font-size: 14px;
        color: #fff;
        height: 60px;
        width: 86px;
        text-align: center;
        position: relative;
        &:hover {
          cursor: pointer;
        }
      }
      .active {
        background: #fff;
        font-weight: bold;
        color: #0071e7;
      }
    }
  }
}

.menu-icon {
  width: 20px;
  height: 20px;
  margin: 8px auto 4px;
  display: block;
}
.right-mess {
  height: 60px;
  float: right;
  // .messageStyle {
  //   cursor: pointer;

  //   float: right;
  //   padding-right: 60px;
  //   margin-bottom: -9px;
  // }
}

.homePerLeft {
  cursor: pointer;

  float: right;
  margin-top: 14px;
  padding-right: 10px;
  background-image: url("../../assets/headImages/homePer.png");
  background-repeat: no-repeat;
  background-size: 28px 28px;
  width: 28px;
  height: 28px;
}

.dome {
  float: right;
}
.dome:hover .homePerLeft {
  background-image: url("../../assets/headImages/homePerGray.png");
}
.homePerRight {
  float: right;
  margin-top: 15px;
  cursor: pointer;
}
.el-dropdown-link {
  font-size: 16px;
  color: #fff;
}

.line {
  height: 0.5px;
  border: none;
  overflow: hidden;
  width: 100%;
  border-bottom: 0.5px solid #ebebeb;
}
.imgStyle {
  padding-right: 10px;
  margin-top: 4px;
  float: left;
}
.imgBgStyle1 {
  background-image: url("../../assets/headImages/perModify.svg");
  background-repeat: no-repeat;
  width: 15px;
  height: 18px;
}
.imgBgStyle2 {
  background-image: url("../../assets/headImages/pwModify.svg");
  background-repeat: no-repeat;
  width: 14px;
  height: 18px;
}
.imgBgStyle3 {
  background-image: url("../../assets/headImages/zhuxiao.svg");
  background-repeat: no-repeat;
  width: 17px;
  height: 18px;
}

// .dropItem {
//   line-height: 36px;
// }
.dropItem:hover {
  font-weight: bold;
  // color: #0f80ed;
  overflow: hidden;
  .imgBgStyle1 {
    background-image: url("../../assets/headImages/perModifyBlue.svg");
  }
  .imgBgStyle2 {
    background-image: url("../../assets/headImages/pwModifyBlue.svg");
  }
  .imgBgStyle3 {
    background-image: url("../../assets/headImages/zhuxiaoBlue.svg");
  }
}
.dropWord {
  float: left;
}
.telWord {
  font-size: 12px;

  width: 60px;
  float: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.con-item{
  text-decoration: none;
}
</style>

