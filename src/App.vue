<template>
  <div class="app">
    <messagebox class="message-style" v-show="header=='headContent'"></messagebox>
    <transition name="fade-transform" mode="out-in">
      <component :is="header" :username="userName" :tel="userNo" :navData="navList"></component>
    </transition>
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="include" >
        <router-view class="app-main-list"  />
      </keep-alive>
    </transition>
    <!--申请单-->
    <iframe
      ref="iframe"
      :src="src"
      class="hidden-iframe"
      scrolling="yes"
      frameborder="0"
      id="iframe"
    ></iframe>
        <iframe
      ref="iframe"
      src=""
      class="hidden-iframe"
      scrolling="yes"
      frameborder="0"
      id="publicIframe"
    ></iframe>
  </div>
</template>
<script>
import { setSession, getSession } from "./utils/storage";
import headContent from "./components/headCom/headContent.vue";
import messagebox from "./components/headCom/messageBox";
import { getYourIP, getServerTimeRandom } from "@/utils/public";
import { mapGetters } from "vuex";
import patientHeader from "./components/headCom/patientHeader.vue";
export default {
  name: "app",
  components: {
    headContent,
    patientHeader,
    messagebox
  },
  data() {
    return {
      src: "", //都昌处理后的url
      include: []
    };
  },
  watch: {
    iframeUrl(val) {
      if (val) {
        getServerTimeRandom(val).then(res => {
          this.src = res;
        });
      }
    },
    $route(to, from) {
      // 如果要to(进入)的页面是需要keepAlive缓存的，把name push进include数组中
      if (to.meta.keepAlive) {
        !this.include.includes(to.name) && this.include.push(to.name);
      }
      // 如果 要 form(离开) 的页面是 keepAlive缓存的，
      // 再根据 deepth 来判断是前进还是后退
      // 如果是后退：
    
      if (from.meta.keepAlive && to.meta.deepth <= from.meta.deepth) {
        const index = this.include.indexOf(from.name);
        index !== -1 && this.include.splice(index, 1);
      }
        console.log(to.meta,from.meta,'from.meta',this.include);
    }
  },
  created() {
    this.getGroup();
    this.getIp();
    this.getSeverity()
    if (this.isQueueNumber === "1") {
      if (
        getSession("doctorSelectDep") &&
        getSession("doctorSelectDep").doctorSelectDep
      ) {
        this.$store.commit(
          "home/SET_DOCTORSELECTDEP",
          getSession("doctorSelectDep").doctorSelectDep
        );
      }
    }
    if (getSession("isSignName") && getSession("signName")) {
      this.$store.commit(
        "public/SET_ISSIGNNAME",
        getSession("isSignName").isSignName
      );
      this.$store.commit(
        "public/SET_SIGNNAME",
        getSession("signName").signName
      );
    } else {
      this.getConfig();
    }
    // window.onmessage=
    window.addEventListener("message", this.load, false);
    this.getHelperSetMenu();
    this.getDictionarry();
    this.getDiagnosisArea();
    this.getDoctorRouterConfig();
    this.getInhosPatDep();
    this.getBloodTypes();
    this.getAllDepartments();
    this.getOrderPackageRange();
    this.getOrderPackageType();
    this.getDoctorSchedule();
    this.getHelperSetMenu();
    this.getFeeTypeList();
    this.getOrderTypeList();
    this.getUserRightList();
    this.getReportConfig();
    this.getTestTreeData();
    this.getAllDep();
  },
  computed: {
    ...mapGetters({
      user: "public/GET_USER",
      userName: "public/GET_USERNAME",
      userNo: "public/GET_USERNO",
      navList: "public/GET_NAVLIST",
      iframeUrl: "public/GET_PRINTIFRAMEURL",
      rationalDrugUseType: "configuration/GET_ISVALIDATEMEDICINE",
      medicalAddEvent: "public/GET_MEDICALADDEVENT", // 是否监听都昌事件
      isQueueNumber: "configuration/GET_ISQUEUENUMBER", //是否启用排队叫号系统
      isIMIS: "configuration/GET_ISIMIS", //是否医保控费
    }),
    header() {
      return this.$route.path.indexOf("doctorAdvice") < 0
        ? "headContent"
        : "patientHeader";
    }
  },
  methods: {
    getConfig() {
      let params = {
        type: 0
      };
      this.$Api.getDoctorConfig(params).then(res => {
        if (res.Status) {
          res.Data.forEach(item => {
            if (item.Code == "isSignName") {
              this.$store.commit("public/SET_ISSIGNNAME", parseInt(item.Value));
              setSession("isSignName", { isSignName: parseInt(item.Value) });
            }
            if (item.Code == "signName") {
              this.$store.commit("public/SET_SIGNNAME", item.Value);
              setSession("signName", { signName: item.Value });
            }
          });
        }
      });
    },
    // 获取账号科室套餐和处方权限
    getUserRightList() {
      this.$Api.getUserRight().then(res => {
        if (res.Status) {
          this.$store.commit("public/SET_USERRIGHTLIST", res.Data);
        } else {
          this.$msg.warning(res.Message);
        }
      });
    },
    // 获取医嘱类型
    getOrderTypeList() {
      this.$Api.getOrderClassification().then(res => {
        if (res.Status) {
          this.$store.commit("doctoradvice/SET_ORDERCLASSIFICATION", res.Data);
        } else {
          this.$msg.warning(res.Message);
        }
      });
    },
    getOrderTypeList() {
      this.$Api.getOrderClassification().then(res => {
        if (res.Status) {
          this.$store.commit("doctoradvice/SET_ORDERCLASSIFICATION", res.Data);
        } else {
          this.$msg.warning(res.Message);
        }
      });
    },
    getReportConfig() {
      this.$Api
        .getTableData({
          tableName: "Sys_ReportConfig",
          PageIndex: 1,
          PageSize: 100,
          IsAsc: true,
          OrderField: "Id"
        })
        .then(res => {
          if (res.Status) {
            this.$store.commit("public/SET_REPORTCONFIG", res.Data);
          } else {
            this.$msg.warning(res.Message);
          }
        });
    },
    // 获取所有医生站交班班次
    getDoctorSchedule() {
      this.$Api
        .getTableData({
          tableName: "Dict_Doctor_Schedule",
          PageIndex: 1,
          PageSize: 100,
          IsAsc: true,
          OrderField: "SortIndex"
        })
        .then(res => {
          if (res.Status) {
            this.$store.commit("public/SET_DOCTORSCHEDULEINFO", res.Data);
          } else {
            this.$msg.warning(res.Message);
          }
        });
    },
    // 获取所有诊疗区
    getDiagnosisArea() {
      let hospitalAreaList = getSession("hospitalAreaList");
      if (hospitalAreaList) {
        this.defaultTemplentList(hospitalAreaList.list);
      } else {
        let data = {
          tableName: "Dict_DiagnosisArea",
          PageIndex: 1,
          PageSize: 9999,
          IsAsc: false,
          list: [
            {
              FieldName: "HospitalAreaId",
              FieldValue: this.user.HospitalAreaId,
              OperatorStr: "="
            }
          ]
        };
        this.$Api.getTableData(data).then(res => {
          if (res.Status) {
            setSession("hospitalAreaList", { list: res.Data });
            this.defaultTemplentList(res.Data);
          }
        });
      }
    },
    // 获取诊疗区对应的默认病历模板
    defaultTemplentList(list) {
      let arr = [];
      list.forEach(item => {
        this.$Api.getDiagnosisArea({ areaId: item.Id }).then(res => {
          res.Data && arr.push(res.Data);
          this.$store.commit("public/SET_DEFAULTTEMPLENT", arr);
        });
      });
    },
    // 通用字典量
    getDictionarry() {
      let dictionaries = getSession("dictionaryData");
      if (dictionaries) {
        this.$store.commit("public/SET_DICTIONARIES", dictionaries.Basic);
        this.$store.commit(
          "public/SET_DICTIONARIESDEFAULT",
          dictionaries.Default
        );
      } else {
        this.$Api.getDictionarry().then(res => {
          if (res.Status) {
            delete res.Data.Basic.TriageDep;
            //setSession("dictionaryData", res.Data);
            // this.$store.commit('public/SET_ALLDEPARTMENTS',res.Data.Basic.TriageDep)

            this.$store.commit("public/SET_DICTIONARIES", res.Data.Basic);
            this.$store.commit(
              "public/SET_DICTIONARIESDEFAULT",
              res.Data.Default
            );
          }
        });
      }
    },
    /**
     * 获取配置项
     * @param {String} type 系统类型
     * Triage = 1,
        Nursing = 2,
        Doctor = 3,
        Quality = 4
     */
    // 获取配置项
    getDoctorRouterConfig() {
      console.log("医生站配置项");
      let params = {
        type: 3
      };
      this.$Api.getDoctorConfig(params).then(res => {
        let data = res.Data || [];
        // 专门处理配置项
        this.$store.commit("configuration/setConfiguration", data);
        if(this.isIMIS!=='0'){
          this.$IMIS.init(this,this.isIMIS)
          this.$IMIS.loginIMIS()
        }
        if (this.rationalDrugUseType === "2") {
          let head = document.getElementsByTagName("head")[0];
          if (process.env.NODE_ENV !== "production") {
            let script1 = document.createElement("script");
            let script2 = document.createElement("script");
            let script3 = document.createElement("script");
            script1.src =
              window.URLCONFIG.Master + "/Scripts/passjs/McConfig.js";
            script2.src =
              window.URLCONFIG.Master +
              "/Scripts/passjs/McJsAll.js?" +
              new Date();
            script3.src =
              window.URLCONFIG.Master + "/Scripts/passjs/McPassIm.js";
            head.appendChild(script1);
            head.appendChild(script2);
            head.appendChild(script3);
          }
          let link = document.createElement("link");
          link.href = window.URLCONFIG.Master + "/Scripts/passjs/McCssAll.css";
          link.rel = "stylesheet";
          link.type = "text/css";
          head.appendChild(link);
        } else {
          let list = document.getElementsByClassName("mc-js");
          for (let index = 0; index < list.length; index++) {
            const el = list[index];
            el.src = "";
          }
        }
      });
    },
    // 获取辅助配置项
    getHelperSetMenu() {
      let params = {
        tableName: "Dict_OrderSideEdgeMenuConfig",
        PageIndex: 1,
        PageSize: 100,
        IsAsc: true,
        OrderField: "SortIndex",
        list: [
          {
            FieldName: "Status",
            FieldValue: "1",
            OperatorStr: "="
          }
        ]
      };
      this.$Api.getTableData(params).then(res => {
        this.$store.commit("public/SET_HELPERSETMENU", res.Data || []);
      });
    },
    // 获取入院科室
    getInhosPatDep() {
      this.$Api.getInPatDepartment().then(res => {
        if (res.Status) {
          this.$store.commit("public/SET_INHOSPATDEP", res.Data || []);
        }
      });
    },
    // 获取血型
    getBloodTypes() {
      this.$Api.getBloodType().then(res => {
        if (res.Status) {
          this.$store.commit("public/SET_BLOODTYPES", res.Data || []);
        }
      });
    },
    // 获取所有的执行科室
    getAllDepartments() {
      let params = {
        hosAreaId: this.user.HospitalAreaId
      };
      this.$Api.getAllDepartment(params).then(res => {
        if (res.Status) {
          this.$store.commit("public/SET_ALLDEPARTMENTS", res.Data || []);
        }
      });
    },
    // 获取所有院区的科室
    getAllDep() {
      this.$Api.getAllDep().then(res => {
        this.$store.commit("public/SET_ALLDEP", res.Data || []);
      });
    },
    // 获取登录用户开套餐权限
    getOrderPackageRange() {
      this.$Api.getOrderPackageRange().then(res => {
        if (res.Status) {
          //this.$store.commit('public/SET_ORDERPACKAGERANGE',res.Data)
          this.$store.commit("orderpackages/SET_ORDERPACKAGERANGE", res.Data);
        }
      });
    },
    // 获取用户已经配置过的医嘱套餐类型
    getOrderPackageType() {
      this.$Api.getOrderPackageType().then(res => {
        if (res.Status) {
          //this.$store.commit('public/SET_ORDERPACKAGETYPE',res.Data)
          this.$store.commit("orderpackages/SET_ORDERPACKAGETYPE", res.Data);
        }
      });
    },
    // 获取费别
    getFeeTypeList() {
      this.$Api.getFeeTypeList().then(res => {
        let data = res.Data || [];
        this.$store.commit("public/SET_FEETYPELIST", data);

        !res.Status && this.$msg.warning(res.Message);
      });
    },
    load(event) {
      // 都昌控件加载完成
      if (window.parent !== event.source) {
        if (this.medicalAddEvent) return;
        let data = event.data;
        let dom = document.getElementById("iframe");
        if (this.src.indexOf("originUrl") === -1) return;
        console.log(data, "模板数据加载完成", this.medicalAddEvent);
        if (data.type === "load") {
          dom.contentWindow.postMessage("ismark", window.URLCONFIG.Emr);
        } else if (data.type == "ismark") {
          if (data.status) {
            clearTimeout(this.timer);
            dom.contentWindow.postMessage("print", window.URLCONFIG.Emr);
            this.$store.commit(
              "public/SET_MEDICALADDEVENT",
              this.$route.name === "medicalHistory"
            );
            // this.$store.commit("public/SET_PRINTIFRAMEURL", '');
          } else {
            this.timer = setTimeout(() => {
              dom.contentWindow.postMessage("ismark", window.URLCONFIG.Emr);
            }, 300);
          }
        }
      }
    },
    // 获取所有耗材大项
    getGroup() {
      this.$Api.getGroupList().then(res => {
        if (res.Status) {
          res.Data &&
            res.Data.forEach(item => {
              item["GroupCode"] = item.Code;
            });
          let obj = {
            Code: "all",
            GroupCode: "all",
            Id: null,
            InputCode: null,
            Name: "全部"
          };
          res.Data.unshift(obj);
          console.log(res.Data, "edw");
          this.$store.commit("public/SET_GROUPARR", res.Data || []);
        }
      });
    },
    // 获取本地ip
    getIp() {
      this.$Api
        .getLocalhostIp()
        .then(res => {
          let IP = res.Data;
          console.log(IP, "IP地址，，，");
          IP && setSession("loginip", { loginip: IP });
        })
        .catch(err => {
          this.isQueueNumber === "1" &&
            this.$msg.info("请检查托盘程序是否启动", 5000);
        });
      getYourIP(ip => {
        console.log(ip, "ip地址，，，");
        ip && setSession("loginip", { loginip: ip });
      });
    },
    //获取检验树结构为急诊的数据code
    getTestTreeData() {
      this.$Api.getTestTreeData({ queryKey: null }).then(res => {
        console.log("data", res);
        let itemCodeList = [];
        if (res.Status) {
          let data = res.Data || [];
          for (let i = 0; i < data.length; i++) {
            if (data[i].Name.indexOf("急诊") > -1) {
              for (let j = 0; j < data[i].ChildCategory.length; j++) {
                itemCodeList.push(data[i].ChildCategory[j].ItemCode);
              }
            }
          }
        }
        this.$store.commit("doctoradvice/SET_TESTITEMCODELIST", itemCodeList);
      });
    },
        //获取绿色通道字典量
    getSeverity() {
      this.$Api
        .getSeverity({
          tableName: "Sys_Dictionary",
          PageIndex: 1,
          PageSize: 99,
          IsAsc: true,
          OrderField: "Value",
          list: [
            { FieldName: "Code", FieldValue: "greenchannel", OperatorStr: "=" }
          ]
        })
        .then(res => {
          if (res.Status) {
            let data = res.Data || [];
            console.log(data,'dataa')
            let obj = {};
            data.forEach(item => {
              obj[item.Text] = item.Abstract;
            });
            this.$store.commit("public/SET_GREENCHANNETYPE", obj);
          }
        });
    }
  }
};
</script>
<style lang="less">
html,
body {
  width: 100%;
  background: #fff;
  height: 100%;
  zoom: 1;
  overflow: hidden;
}
.app {
  width: 100%;
  min-width: 1360px;
  max-width: 1920px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  background: #fff;
  position: relative;
  flex-direction: column;
  // height: ~"calc(100% - 100px)";

  overflow: hidden;
  .hidden-iframe {
    width: 80%;
    height: 80%;
    position: absolute;
    background: #fff;
    z-index: -1000;
  }
  // .iframe {
  //   display: none;
  // }
  .message-style {
    position: absolute;
    cursor: pointer;
    top: 0px;
    right: 160px;
    width: 36px;
    z-index: 100;
  }
  .app-main-list {
    flex: 1;
    height: calc(100vh - 60px);
    width: 100%;
    overflow: hidden;
  }
}

/*fade-transform*/
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.5s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
@media screen and (max-width: 1365px) {
  .app {
    overflow-x: auto;
  }
}
.el-tooltip__popper.paragraph-warp {
  left: 379px !important;
}
.el-tooltip__popper {
  max-width: 676px !important;
}
.has-patients {
  animation: twinkling 2.1s infinite ease-in-out;
  animation-fill-mode: both;
}
@keyframes twinkling {
  0% {
    opacity: 0.2;
    filter: alpha(opacity=20);
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    filter: alpha(opacity=50);
    transform: scale(1.12);
  }
  100% {
    opacity: 0.2;
    filter: alpha(opacity=20);
    transform: scale(1);
  }
}
</style>
