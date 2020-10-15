<template>
  <div class="orderPackage">
    <!-- <div class="close"> -->
    <slot name="close"></slot>
    <!-- </div> -->
    <div class="orderPackageLeft">
      <div class="title">成套医嘱</div>
      <myTabs :activeName.sync="selectData" :tabsList="tabsList" :width="100"></myTabs>
      <div class="package-search">
        <el-input
          placeholder="请输入内容"
          v-model.trim="treeName"
          @input="getMenu"
          suffix-icon="el-icon-search"
        ></el-input>
      </div>
      <medicalNowTree
        ref="orderPackage"
        :default-expanded-keys="defaultExpanded[selectData]"
        :callBack="selectOrderPackage"
        :treeData="treeData"
        children="detailInfoList"
        type="orderPackage"
        nodeKey="NewId"
      ></medicalNowTree>
    </div>
    <div class="orderPackageRight" v-show="currentOrderPackage.NewId">
      <div class="orderPackageTitle">成套医嘱/{{currentOrderPackage.Name}}</div>
      <div class="orderPackageContent">
        <doctor-advice-list
          :tableData="orderPackageData"
          v-bind.sync="filters"
          ref="reference"
          class="reference"
          :isPackage="true"
          @selection-change="orderSelectionChange"
        ></doctor-advice-list>
      </div>
      <div class="orderPackageButton" v-if="patientMsg.Status !=8">
        <!-- <el-button size="medium" @click="cancel">取消</el-button> -->
        <el-button type="primary" size="medium" @click="copyOrderList">引用</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import doctorAdviceList from "@/components/doctorAdvice/openDoctorAdvice/doctorAdviceList.vue";
import myTabs from "@/components/common/my-tabs.vue";
import medicalNowTree from "../medicalHistory/medicalNowTree.vue";

export default {
  components: {
    doctorAdviceList,
    myTabs,
    medicalNowTree
  },
  props: ["callback"],
  data() {
    this.time=0;
    return {
      filters: {
        effectiveChecked: [1, 2] //表格长/临字段筛选条件
      },
      treeName: "",
      selectData: "1",
      treeData: [],
      activeName: "dep",
      filterText: "",
      orderPackageAllData: [],
      //orderPackageData: [],
      defaultExpanded: {
        1: [],
        2: []
      }, //展开的节点
      orderList: [], //展示医嘱列表
      orderListCopy:[],//需要引用的医嘱列表
      currentOrderPackage: {}, //当前选中的叶子节点的套餐
      // showOrderPackageContent: false //是否显示当前套餐详细信息
    };
  },
  computed: {
    ...mapGetters({
      patientMsg: "public/GET_PATIENTMSG",
      user: "public/GET_USER",
      orderPackageRange: "orderpackages/GET_ORDERPACKAGERANGE",
    }),
    tabsList:function() {
      let arr = []
      this.orderPackageRange.forEach(item => {
        let obj = {
          value: item.Value,
          label: item.Text
        }
        arr.push(obj)
      })
      console.log(arr,'uuuuuuuu')
      return arr
    },
    orderPackageData:{
      get:function() {
        this.orderPackageAllData = this.orderPackageAllData || []
        let arr = this.orderPackageAllData.filter(item => {
          return this.filters.effectiveChecked.includes(item.EffectiveTime)
        })
        this.orderList = arr
        return arr
      },
      set:function(newValue) {
        return newValue
      }
    }
  },
  created() {
    this.getMenu(null);
  },
  watch: {
    selectData(val) {
      this.treeName = null;
      this.getMenu(this.treeName);
    }
  },
  methods: {
    // 获取默认展开项
    getNodeKey(data, id) {
      if (data.hasOwnProperty("detailInfoList") && data.detailInfoList.length) {
        return this.getNodeKey(data.detailInfoList[0], data.NewId);
      } else {
        return { data, id };
      }
    },
    getMenu(value) {
      console.log(value);
      let params = {
        keyWord: value == "" ? null : value,
        diagnosisKeyWord: this.patientMsg.Diagnosis==''?null:this.patientMsg.Diagnosis,
        symptomKeyWord: this.patientMsg.Symptom==''?null:this.patientMsg.Symptom
      };
      console.log(params);
      this.$Api[
        this.selectData === "1"
          ? "getOrderPackagePersonl"
          : "getOrderPackageDepartment"
      ](params).then(res => {
        if (res.Status) {
          this.treeData = res.Data || [];
          // 默认展开，选中
          if (
            !this.defaultExpanded[this.selectData].length &&
            this.treeData.length
          ) {
            let nodeData = this.getNodeKey(
              this.treeData[0],
              this.treeData[0].NewId
            );
            console.log(nodeData);
            this.$nextTick(() => {
              this.$refs.orderPackage.currentChange(nodeData.data, nodeData.id);
            });
          }
        }else{
          this.$msg.warning(res.Message)
        }
      });
    },
    // 选择树状子节点套餐
    selectOrderPackage(data, type, patientKey) {
      // if (!data.hasOwnProperty("detailInfoList")) {
      // 叶子节点
      this.$refs.reference &&
            this.$refs.reference.checked("clearSelection");
      this.defaultExpanded[this.selectData] = [patientKey];
      console.log(type, patientKey, "patientKey");
      this.currentOrderPackage = data;
      // this.showOrderPackageContent = true;
      let params = {
        orderPackageId: data.Id,
        DataStatus: 1
      };
      this.$Api.getOrderPackageDetail(params).then(res => {
        if (res.Status) {
          this.orderListCopy = res.Data
          this.orderPackageAllData = res.Data;
          this.$refs.reference &&
            this.$refs.reference.checked("toggleRowSelection");
        }else{
          this.$msg.warning(res.Message)
        }
      });
      // } else {
      //   this.showOrderPackageContent = false;
      // }
    },
    // 引用
    copyOrderList() {
      let now=new Date().getTime()
      let con=now-this.time;
      if (con>1000) {
        this.time=now
      }else{
        return
      }
      // 把选中引用的医嘱添加到医嘱下达未提交列表
      // 类似需要执行保存
      console.log(this.orderListCopy)
      if (this.orderListCopy.length == 0) {
        this.$msg.warning("请选择需要引用的医嘱");
        return;
      }
      let orderIds = [];
      console.log(this.orderListCopy,'要引用医嘱列表')
      this.orderListCopy.forEach(item => {
        orderIds.push(item.OrderId);
      });
      let params = {
        CurrentUserId: this.user.UserInfo.Id,
        OrderMainIds: orderIds,
        InHouseId: this.patientMsg.InHouseId
      };
      this.$Api.quoteOrderPackage(params).then(res => {
        this.$msg[res.Status ? "success" : "warning"](res.Message);
        res.Status && this.callback();
      });

    },
    // 选中需要引用的医嘱
    orderSelectionChange(el) {
      console.log(el,'选择引用医嘱');
      //this.orderList = el;
      this.orderListCopy=el
      console.log(this.orderListCopy,'要引用医嘱xxxxxx')
    },
 
  }
};
</script>
<style lang="less" scoped>
.orderPackage {
  height: 100%;
  width: 100%;
  position: relative;
  padding: 10px 20px;
  box-sizing: border-box;
  .close {
    position: absolute;
    right: 15px;
    top: 5px;
    font-size: 30px;
    cursor: pointer;
    color: @blueMain;
  }
  .orderPackageLeft {
    // width:200px;
    // height: 100%;
    height: calc(100vh - 95px);

    float: left;
    border-right: 1px solid #dfe7f5;
    padding-right: 20px;
    .title {
      width: 180px;
      height: 32px;
      background: rgba(0, 113, 231, 0.1);
      color: @wordColor;
      font-weight: bold;
      line-height: 32px;
      padding-left: 20px;
    }
         .medical-now-tree {
        height: calc(100vh - 210px);
        overflow: auto;
      }
    .package-search {
      border-bottom: 1px solid #dfe7f5;
      /deep/ .el-input {
        .el-input__inner {
          border: none;
        }
        .el-icon-search {
          font-size: 20px;
          color: #dfe7f5;
          font-weight: bold;
          // cursor: pointer;
        }
      }
    }
  }
  .orderPackageRight {
    //height: 100%;
    height: calc(~"(100% - 20px)");
    display: flow-root;
    padding-left: 20px;
    overflow: hidden;
    margin-top:20px;
    position: relative;
    .orderPackageTitle {
      color: @wordColor;
      font-weight: bold;
      margin-bottom: 10px;
      padding-top: 10px;
    }
    .orderPackageButton {
      text-align: center;
      position: absolute;
      bottom: 0px;
      left: 0;
      right: 0;
    }
    .orderPackageContent {
      height: calc(~"(100% - 85px)");
      overflow: auto;
      margin-bottom: 10px;
    }
  }
}
</style>