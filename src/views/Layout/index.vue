<template>
  <div class="layout">
    <div class="layout-left" :class="{isCollapse:collapse}">
      <sidebar :navList="navData"></sidebar>
      <div class="layout-left-tool cl" v-if="collapse" key="1">
        <el-popover placement="right" title trigger="hover" popper-class="menu">
          <ul @click="selectHelper">
            <li v-for="(item,index) in helperMenuList" :key="index" v-show="item.Status">
              <svg-icon :iconClass="item.MenuIcon" class="icon"></svg-icon>
              <span>{{item.MenuName}}</span>
            </li>
          </ul>
          <span class="item" slot="reference">
            <svg-icon iconClass="addHelper" class="icon"></svg-icon>
          </span>
        </el-popover>
      </div>
      <div class="layout-left-tool cl" v-else key="2">
        <el-popover placement="right" title trigger="hover" popper-class="menu">
          <ul @click="selectHelper">
            <li v-for="(item,index) in helperMenuList" :key="index">
              <svg-icon :iconClass="item.MenuIcon" class="icon"></svg-icon>
              <span>{{item.MenuName}}</span>
            </li>
          </ul>
          <span class="item" slot="reference">
            <svg-icon iconClass="addHelper" class="icon"></svg-icon>
          </span>
        </el-popover>
      </div>
    </div>
    <app-main></app-main>
    <patient-list :class="{hide:isShowList}"></patient-list>
    <span class="collapse" @click="checked" :class="{left65:collapse}">
      <svg-icon :iconClass="collapse?'expanded':'fewer'" class="icon"></svg-icon>
    </span>
    <my-alter
      :title="alterData.title"
      :visible="reportShow"
      :isfooter="false"
      :width="alterData.width"
      :callback="closeDialog"
    >
      <component
        :is="alterData.component"
        ref="content"
        :initialize="reportShow"
        :patientData="patientMsg"
      ></component>
    </my-alter>
  </div>
</template>
<script>
import sidebar from "./sidebar.vue";
import appMain from "./appMain.vue";
import { mapGetters } from "vuex";
import patientList from "../../components/doctorAdvice/patientList.vue";
import myAlter from "@/components/common/myAlter";
import readReport from "@/components/layout/readReport.vue";
import viewReportAlter from "@/components/layout/viewReportAlter.vue";
import { ajax } from "../../utils/ajax";
export default {
  name: "layout",
  components: {
    sidebar,
    appMain,
    patientList,
    myAlter,
    readReport,
    viewReportAlter
  },
  data() {
    return {
      navData: [],
    };
  },
  computed: {
    ...mapGetters({
      isShowList: "public/GET_ISSHOWLIST",
      navList: "public/GET_NAVLIST",
      collapse: "public/GET_COLLAPSE",
      reportShow: "home/GET_REPORTSHOW",
      patientMsg: "public/GET_PATIENTMSG",
      helperMenuList: "public/GET_HELPERSETMENU", // 辅助菜单
      alterData: "home/GET_DIALOGDATA",
      user: "public/GET_USER"
    }),
    doctorDep(){
       let data = this.patientMsg.RegisterInfoList || [];
       let depId = '';
       for(let i = 0;i<data.length;i++ ){
         if(this.patientMsg.RegistId === data[i].HisRegistId){
            depId = data[i].RegDepartmentCode;
         }
       }
       return depId
    },
    
  },
    watch:{
   'patientMsg.AreaType'(val,oldVal){
     if(this.$route.path.indexOf('doctorAdvice')<0||val===oldVal)return
          for (let index = 0; index < this.navList.length; index++) {
        const ele = this.navList[index];
        if ('doctorAdvice' === ele.UiRouter) {
          this.navData = ele.Children.filter(el => {
            return (
              val!== 3 ||
              el.UiRouter !== "patients"
            );
          });
          return;
        }
      }
  }
  },
    watch:{
   'patientMsg.AreaType'(val,oldVal){
     if(this.$route.path.indexOf('doctorAdvice')<0||val===oldVal)return
          for (let index = 0; index < this.navList.length; index++) {
        const ele = this.navList[index];
        if ('doctorAdvice' === ele.UiRouter) {
          this.navData = ele.Children.filter(el => {
            return (
              val!== 3 ||
              el.UiRouter !== "patients"
            );
          });
          return;
        }
      }
  }
  },
  methods: {
    selectHelper(e) {
      if (e.srcElement) {
        let name = e.srcElement.innerText;
        let obj;
        switch (name) {
          case "报告调阅":
            obj = {
              component: "readReport",
              width: "1366px",
              title: name
            };
            this.$store.commit("home/SET_DIALOGDATA", obj);
            this.$store.commit("home/SET_REPORTSHOW", true);
            break;
          case "护理病历":
            obj = {
              component: "viewReportAlter",
              width: "88vw",
              title: name
            };
            this.$store.commit("home/SET_DIALOGDATA", obj);
            this.$store.commit("home/SET_REPORTSHOW", true);
            break;
          case "疾病监测上报":
            ajax(
              {},
              `http://localhost:10808/api/IDMSReport?yqdm=${this.user.HospitalAreaCode}&doctorNo=${this.user.UserInfo.No}&doctorDep=${this.doctorDep}&ghxh=${this.patientMsg.RegistId}`
            ).then(res => {
              if(!res.Status){
                this.$msg.warning(res.Message)
              }
            });
            break;
        }
      }
    },
    checked(type) {
      this.$store.commit("public/SET_COLLAPSE", !this.collapse);
    },
    closeDialog(val) {
      this.$store.commit("home/SET_REPORTSHOW", false);
    }
  },
  beforeRouteEnter(to, from, next) {
    next(ve => {
      let name = to.path.split("/")[1];
      for (let index = 0; index < ve.navList.length; index++) {
        const ele = ve.navList[index];
        if (name === ele.UiRouter) {
          ve.navData = ele.Children.filter(el => {
            return (
              ve.patientMsg.AreaType !== 3 ||
              el.UiRouter !== "patients"
            );
          });
          return;
        }
      }
    });
  }
};
</script>
<style lang="less">
.layout {
  display: flex;
  position: relative;

  > .collapse {
    width: 11px;
    height: 28px;
    line-height: 28px;
    box-shadow: 1px 1px 3px 2px rgba(153, 183, 255, 0.6);
    color: #666;
    text-align: center;
    position: absolute;
    top: 50%;
    margin-top: -14px;
    cursor: pointer;
    background: #fff;
    transition: all 0.3s cubic-bezier(0.65, 0.05, 0.36, 1);

    left: 135px;
    &.left65 {
      left: 65px;
    }
    .icon {
      width: 11px;
      height: 11px;
      color: #666;
    }
  }
  .layout-left {
    width: 135px;

    transition: all 0.3s cubic-bezier(0.65, 0.05, 0.36, 1);

    .layout-left-tool {
      width: 100%;
      //  height:55px;
      height: 45px;
      overflow: hidden;

      .item {
        float: left;
        width: 45px;
        height: 45px;
        box-sizing: border-box;
        border: 1px solid #bdcaee;
        border-right-color: transparent;
        font-size: 20px;
        text-align: center;
        margin-left: 9.5px;
        color: #bdcaee;
        cursor: pointer;
        .icon {
          vertical-align: -0.35em;
        }
        &:first-child {
          border-radius: 2px 0 0 2px;
        }
        &:last-child {
          border-radius: 0 2px 2px 0;
          border-right-color: #bdcaee;
        }
        &:hover {
          background: rgba(0, 113, 231, 0.1);
          border-color: #0071e7;
          color: #0071e7;
        }
      }
    }
    &.isCollapse {
      width: 64px;
      .layout-left-tool {
        height: 135px;
        .item {
          // width: 64px;
          margin: 0 9.5px;
          // height: 64px;
          border: 1px solid #bdcaee;
          border-bottom-color: transparent;
          &:first-child {
            border-radius: 2px 2px 0 0;
          }
          &:last-child {
            border-radius: 0 0 2px 2px;
            border-bottom-color: #bdcaee;
          }
          &:hover {
            background: rgba(0, 113, 231, 0.1);
            border-color: #0071e7;
            color: #0071e7;
          }
        }
      }
    }
  }

  .app-main {
    /*84 = navbar + tags-view = 50 +34 */
    /* min-height: calc(100vh - 84px); */
    flex: 1;
    width: 100%;
    position: relative;
    overflow: hidden;
    //  height: calc(100vh - 60px);
    height: 100%;

    .view {
      box-sizing: border-box;
      border: 10px solid @mainBg;
      // padding-bottom: 10px;
      border-bottom: none;
      // border-bottom-color: transparent;
      // padding: 10px 20px;
      // background: @mainBg;
      // flex: 1;
      height: 100%;
      // height: calc(100vh - 60px);;
    }
  }
}
</style>
<style lang="less">
.el-popover.el-popper.menu {
  min-width: 140px !important;
  padding: 0;
  > ul {
    > li {
      padding: 10px 5px;
      box-sizing: border-box;
      color: #8599c0;
      cursor: pointer;
      padding-left: 12px;
      > span {
        margin-left: 10px;
        //color: @wordColor;
      }
    }
    li:hover {
      //border: 1px solid #0071e7;
      background: rgba(0, 113, 231, 0.1);
      color: #0071e7;
    }
  }
  a>li{
    color: rgb(133, 153, 192)!important;
  }
}
</style>
