<template>
  <!-- <div class="openDoctorAdvice"> -->
  <div
    class="openDoctorAdvice"
    v-loading="!!caRequestLoading"
    :element-loading-text="caRequestLoading"
  >
    <el-popover
      placement="bottom-start"
      :visible-arrow="false"
      width="calc(100vw - 155px)"
      trigger="manual"
      v-model="childPageVisible"
      :popper-class="collapse ? 'prescription-warp w64' : 'prescription-warp '"
    >
      <div class="history" slot="reference"></div>
      <template v-if="childPageVisible">
        <prescription
          v-if="childPageContent == 'prescription'"
          :showSpecialDrugDialog="showSpecialDrugDialog"
        >
          <span
            class="el-icon-close close"
            slot="close"
            @click="childPageVisible = false"
          ></span>
        </prescription>
        <order-package
          v-else-if="childPageContent == 'orderPackage'"
          :callback="closeOrdePack"
        >
          <span
            class="el-icon-close close"
            slot="close"
            @click="childPageVisible = false"
          ></span>
        </order-package>
        <history-doctor-advice
          v-else-if="childPageContent == 'historyDoctorAdvice'"
          :callback="closeOrdePack"
        >
          <span
            class="el-icon-close close"
            slot="close"
            @click="childPageVisible = false"
          ></span>
        </history-doctor-advice>
        <treatmentSingle v-else-if="childPageContent == 'treatmentSingle'">
          <span
            class="el-icon-close close"
            slot="close"
            @click="childPageVisible = false"
          ></span>
        </treatmentSingle>
      </template>
    </el-popover>
    <div class="button-list" :class="{ disabedBtn: isEdit }">
      <div class="back-top-warp">
        <div class="back-top" @click="goBack(isTop)">
          <svg-icon
            iconClass="backTop"
            class="back"
            :class="{ top: isTop }"
          ></svg-icon>
        </div>
      </div>

      <div class="button" @click="showChildPage('orderPackage')">
        <!-- <img src="../../icons/svg/orderPackage.svg" alt /> -->
        <svg-icon iconClass="orderPackage" style="margin-right: 5px"></svg-icon
        >成套医嘱
      </div>
      <div class="button" @click="showChildPage('historyDoctorAdvice')">
        <svg-icon iconClass="history" style="margin-right: 5px"></svg-icon
        >历史医嘱
      </div>
      <el-tooltip
        class="item"
        effect="dark"
        content="查看处置记录"
        placement="top"
      >
        <svg-icon
          iconClass="ziliaodan"
          class="right ziliaodan"
          @click="showChildPage('treatmentSingle')"
        ></svg-icon>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="查看处方" placement="top">
        <svg-icon
          iconClass="prescription"
          class="right"
          @click="showChildPage('prescription')"
        ></svg-icon>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="诊间结算" placement="top">
        <svg-icon
          iconClass="charging"
          class="right"
          @click="chargingClick"
          v-if="patientMsg.Status != 8"
        ></svg-icon>
        <!-- && inHosCost == 1 -->
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="dark"
        content="打印"
        placement="top"
        v-show="isEdit"
      >
        <svg-icon iconClass="print" class="right"></svg-icon>
      </el-tooltip>
      <el-dropdown trigger="click" @command="selectPrint" v-show="!isEdit">
        <!-- <span>分类打印</span> -->
        <el-tooltip class="item" effect="dark" content="打印" placement="top">
          <span style="width: 35px; display: inline-block">
            <svg-icon iconClass="print" class="right"></svg-icon>
          </span>
        </el-tooltip>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="2">打印医嘱单</el-dropdown-item>
          <el-dropdown-item command="1">打印输液单</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-tooltip
        class="item"
        effect="dark"
        content="另存为医嘱套餐"
        placement="top"
      >
        <svg-icon
          iconClass="saveAs"
          class="right"
          @click="saveOrderPackage"
        ></svg-icon>
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="dark"
        content="停止"
        placement="top"
        v-if="
          submitRowData.EffectiveTime === 2 &&
          submitRowData.Status !== 6 &&
          submitRowData.Status !== 4 &&
          patientMsg.Status != 8 &&
          (userRightList.IsHasPrescriptionRight ||
            submitRowData.OrderType !== 14)
        "
      >
        <svg-icon
          iconClass="stop"
          class="right"
          @click="!isEdit && stopAdvice(submitRowData)"
        ></svg-icon>
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="dark"
        content="作废"
        placement="top"
        v-if="
          patientMsg.Status !== 8 &&
          submitRowData.Status !== 7 &&
          submitRowData.EffectiveTime === 1 &&
          submitRowData.Status !== 5 &&
          (userRightList.IsHasPrescriptionRight ||
            submitRowData.OrderType !== 14)
        "
      >
        <svg-icon
          iconClass="cancellation"
          class="right"
          @click="!isEdit && stopAdvice(submitRowData)"
        ></svg-icon>
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="dark"
        content="分类打印"
        placement="top"
        v-show="isEdit"
      >
        <svg-icon iconClass="more-icon" class="right"></svg-icon>
      </el-tooltip>
      <el-dropdown trigger="click" @command="selectChange" v-show="!isEdit">
        <!-- <span>分类打印</span> -->
        <el-tooltip
          class="item"
          effect="dark"
          content="分类打印"
          placement="top"
        >
          <span style="width: 35px; display: inline-block">
            <svg-icon iconClass="more-icon" class="right"></svg-icon>
          </span>
        </el-tooltip>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="2">打印长期医嘱单</el-dropdown-item>
          <el-dropdown-item command="1">打印临时医嘱单</el-dropdown-item>
          <el-dropdown-item command="0">打印长/临医嘱单</el-dropdown-item>
          <el-dropdown-item :divided="true" command="keep"></el-dropdown-item>
          <!-- <div style="cursor:pointer;text-align:center">
            <el-checkbox v-model="keepPrint">续打模式</el-checkbox>
          </div>-->
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="table-header">
      <el-checkbox
        class="select-all"
        :indeterminate="isStatus"
        v-model="isAll"
        @change="selectAll"
      ></el-checkbox>
      <doctor-advice-list
        v-bind.sync="filters"
        class="reference"
      ></doctor-advice-list>
    </div>
    <div class="open-doctor-advice-main" ref="adviceMain">
      <div class="advice-warp" ref="adviceWarp">
        <doctor-advice-list
          :tableData="submitData"
          v-bind.sync="filters"
          ref="reference"
          :show-header="false"
          class="reference"
          @row-click="rowClick"
          @row-contextmenu="contextmenu"
          @selection-change="submitSelectionChange"
        >
          <el-tooltip
            slot-scope="{ scope }"
            slot="cost"
            class="item"
            effect="dark"
            content="关联费用"
            placement="top-start"
            v-if="patientMsg.Status != 8 && scope.row.Status !== 7"
          >
            <svg-icon
              v-if="scope.row.DoctorOrderAdviceItems"
              iconClass="cost"
              class="delete sendBack"
              :class="{ black: !scope.row.DoctorOrderAdviceItems.length }"
              @click.stop="associatedCost(scope.row)"
            ></svg-icon>
          </el-tooltip>
        </doctor-advice-list>
        <div
          class="save-list"
          v-if="!!saveData.length && patientMsg.Status != 8"
          :class="{ isEdit: isEdit }"
        >
          <doctor-advice-list
            :tableData="saveData"
            :isDrop="true"
            :errorAdvice="errorAdvice"
            :show-header="false"
            class="drop"
            ref="drops"
            @selection-change="saveSelectionChange"
            @row-click="editAdvice"
            @row-contextmenu="contextmenu"
          >
            <component
              :editIndex="editIndex"
              :is="componentsName[tableRowData.OrderType]"
              :contextmenu="contextmenuDrup"
              slot-scope="{ scope }"
              ref="doctorAdvice"
              v-if="scope.row._isEdit"
              slot="expand"
              :isChange="true"
              :tableData="newAdviceList"
              :commonObj="commonObj"
            >
              <searchDoctorAdvice
                slot="change"
                slot-scope="{ index, itemName, departmentCode, categoryNo }"
                :departmentCode="departmentCode"
                :adviceName="tableRowData.OrderType"
                :categoryNo="categoryNo"
                :index="index"
                :itemName="itemName"
                :callBack="add"
              ></searchDoctorAdvice>
              <searchDoctorAdvice
                slot="search"
                :adviceName="tableRowData.OrderType"
                slot-scope="{ departmentCode, categoryNo }"
                :categoryNo="categoryNo"
                :departmentCode="departmentCode"
                :callBack="add"
              ></searchDoctorAdvice>
              <p class="advice-button" slot-scope="{ submitForm }">
                <el-button type="primary" plain @click="cancel('change')"
                  >取消</el-button
                >
                <el-button
                  type="primary"
                  @click="save(submitForm, scope.row.OrderId)"
                  v-if="patientMsg.Status != 8"
                  >保存</el-button
                >
              </p>
            </component>
          </doctor-advice-list>
          <p class="cl advice-button" v-if="patientMsg.Status != 8">
            <el-button
              type="primary"
              plain
              @click="cancel('delete')"
              :disabled="isEdit"
              >取消</el-button
            >
            <el-button type="primary" @click="gradeNursing" :disabled="isEdit"
              >提交</el-button
            >
          </p>
        </div>
        <div class="advice-content" v-if="patientMsg.Status != 8">
          <template v-if="!isEdit">
            <h2>新增医嘱</h2>
            <searchDoctorAdvice
              v-if="isAdd"
              :adviceName.sync="adviceBigName"
              :callBack="add"
              :isShow="true"
            ></searchDoctorAdvice>
          </template>
          <component
            :is="componentsName[adviceName]"
            v-if="!isAdd"
            :contextmenu="contextmenuDrup"
            ref="addComponent"
            :tableData="newAdviceList"
            :isAdvice="isConAdvice"
            :commonObj="commonObj"
            :editIndex="editIndex"
          >
            <searchDoctorAdvice
              slot="change"
              slot-scope="{ index, itemName, departmentCode, categoryNo }"
              :adviceName.sync="adviceName"
              :index="index"
              :categoryNo="categoryNo"
              :departmentCode="departmentCode"
              :itemName="itemName"
              :callBack="add"
            ></searchDoctorAdvice>
            <searchDoctorAdvice
              slot-scope="{ departmentCode, categoryNo }"
              :categoryNo="categoryNo"
              :departmentCode="departmentCode"
              slot="search"
              :adviceName.sync="adviceName"
              :callBack="add"
            ></searchDoctorAdvice>
            <p class="advice-button" slot-scope="{ submitForm }">
              <el-button type="primary" plain @click="cancel('add')"
                >取消</el-button
              >
              <el-button type="primary" @click="save(submitForm)"
                >保存</el-button
              >
            </p>
          </component>
        </div>
      </div>
    </div>
    <myAlter
      :title="alterData.alterTitle"
      :visible="alterData.showAlter"
      :isfooter="alterData.alterType !== 'alterConsumables'"
      :width="alterData.width"
      :callback="closeAlter"
      :btn="specialDrugBtns"
      :isDeclareComponent="alterData.alterType === 'declarePatmessage'"
    >
      <!--另存为医嘱套餐-->
      <saveOrderPackage
        v-if="alterData.alterType === 'saveOrderPackage'"
        ref="saveOrder"
        :initial="alterData.showAlter"
      ></saveOrderPackage>
      <!--特殊药品使用患者登记-->
      <specialDrug
        v-else-if="alterData.alterType === 'specialDrug'"
        :specialDrugMessage="specialDrugMessage"
        ref="editSpecialDrug"
        :enable="specialDrugEnable"
      ></specialDrug>
      <declarePatmessage
        v-else-if="alterData.alterType === 'declarePatmessage'"
        :declareMessage="declareMessage"
        ref="declarePatmessage"
      ></declarePatmessage>
      <medicareReimbursement
        v-else-if="alterData.alterType === 'medicareReimbursement'"
      ></medicareReimbursement>
      <!-- 诊间结算 -->
      <clinicRoom
        v-else-if="alterData.alterType === 'clinicRoom'"
        :alterData="alterData"
      ></clinicRoom>
      <!-- 关联费用 -->
      <alterConsumables v-else :alterData="alterData"></alterConsumables>
    </myAlter>
    <prompt-message
      class="prompt_message_style"
      v-if="promptLoadShow"
      :option="{ bl: true, type: '', message: '读取信息中...' }"
    ></prompt-message>
    <contextmenu ref="contextmenu"></contextmenu>
  </div>
</template>

<script>
import testDoctorAdvice from "../../components/doctorAdvice/openDoctorAdvice/testDoctorAdvice.vue";
import inspectDoctorAdvice from "../../components/doctorAdvice/openDoctorAdvice/inspectDoctorAdvice.vue";
import treatDoctorAdvice from "../../components/doctorAdvice/openDoctorAdvice/treatDoctorAdvice.vue";
import drugDoctorAdvice from "../../components/doctorAdvice/openDoctorAdvice/drugDoctorAdvice.vue";
// import bloodDoctorAdvice from "../../components/doctorAdvice/openDoctorAdvice/bloodDoctorAdvice.vue";
import searchDoctorAdvice from "../../components/doctorAdvice/openDoctorAdvice/searchDoctorAdvice.vue";

import { doctorAdviceListData } from "../../module/tableData";
import doctorAdviceList from "../../components/doctorAdvice/openDoctorAdvice/doctorAdviceList.vue";
import nurseDoctorAdvice from "../../components/doctorAdvice/openDoctorAdvice/nurseDoctorAdvice.vue";
import { mapGetters } from "vuex";
import wordDoctorAdvice from "../../components/doctorAdvice/openDoctorAdvice/wordDoctorAdvice.vue";
import mealsDoctorAdvice from "../../components/doctorAdvice/openDoctorAdvice/mealsDoctorAdvice.vue";
// import newOperation from "../../components/doctorAdvice/operation/newOperation.vue";
// import prescription from "../../components/doctorAdvice/openDoctorAdvice/prescription.vue";
import orderPackage from "@/components/doctorAdvice/orderPackage/orderPackage.vue";
import myAlter from "../../components/common/myAlter.vue";
import saveOrderPackage from "@/components/doctorAdvice/orderPackage/saveOrderPackage.vue";
import {
  componentsName,
  adviceId,
  needDeclarePatmessage,
  documentType,
  printObjectType,
  recipeTemp,
} from "../../module/staticData";
import prescription from "../../components/doctorAdvice/openDoctorAdvice/prescription.vue";
import bloodDoctorAdvice from "../../components/doctorAdvice/openDoctorAdvice/bloodDoctorAdvice.vue";
import newOperation from "../../components/doctorAdvice/operation/newOperation.vue";
import newConsultation from "../../components/doctorAdvice/consultation/newCreate.vue";
import specialDrug from "@/components/doctorAdvice/specialDrug.vue";
import historyDoctorAdvice from "@/components/doctorAdvice/historyDoctorAdvice.vue";
import contextmenu from "@/components/doctorAdvice/openDoctorAdvice/contextmenu.vue";
import RationalDrugUse from "../../utils/rationalDrugUse";
import CASign from "@/utils/caSign.js";
import alterConsumables from "@/components/doctorAdvice/openDoctorAdvice/alterConsumables.vue";
import declarePatmessage from "@/components/doctorAdvice/openDoctorAdvice/declarePatMessage.vue";
import treatmentSingle from "../../components/doctorAdvice/openDoctorAdvice/treatmentSingle.vue";
import promptMessage from "../../components/common/promptMessage";
import clinicRoom from "@/components/doctorAdvice/openDoctorAdvice/clinicRoom.vue";
import { getServerTimeRandom } from "@/utils/public";
const cancelMsg = {
  add: "该操作将取消新增医嘱,是否继续",
  change: "该操作将取消修改医嘱,是否继续",
  delete: "该操作将取消所有待提交医嘱,是否继续",
};
export default {
  name: "openDoctorAdvice", //医嘱下达
  components: {
    contextmenu, //右键菜单
    historyDoctorAdvice, //历史医嘱
    specialDrug,
    prescription,
    testDoctorAdvice,
    inspectDoctorAdvice,
    treatDoctorAdvice,
    drugDoctorAdvice,
    bloodDoctorAdvice,
    searchDoctorAdvice,
    doctorAdviceList,
    nurseDoctorAdvice,
    mealsDoctorAdvice,
    wordDoctorAdvice,
    newOperation,
    myAlter,
    orderPackage,
    saveOrderPackage,
    newConsultation,
    alterConsumables,
    declarePatmessage,
    treatmentSingle,
    promptMessage,
    clinicRoom,
  },
  data() {
    // 保存医嘱方法名
    this.saveApiName = {
      14: "saveDrugAdvice",
      5: "saveNursingAdvice",
      122: "saveWordAdvice",
      3: "saveMealAdvice",
      0: "saveTreatAdvice",
      13: "saveTreatAdvice",
      2: "saveTreatAdvice",
      6: "saveTreatAdvice",
      11: "saveTreatAdvice",
      12: "saveTreatAdvice",
      20: "saveTreatAdvice",
      1: "saveTreatAdvice",
      7: "saveInspectAdvice",
      15: "postOperationData",
      4: "saveBloodInfo",
      // "1": "saveOperationAdvice",
      8: "postTestAll",
      31: "addConsultation",
    };
    // 修改医嘱方法名
    this.updateApiName = {
      14: "saveDrugAdvice",
      5: "saveNursingAdvice",
      122: "saveWordAdvice",
      3: "saveMealAdvice",
      0: "saveTreatAdvice",
      2: "saveTreatAdvice",
      6: "saveTreatAdvice",
      11: "saveTreatAdvice",
      13: "saveTreatAdvice",
      12: "saveTreatAdvice",
      20: "saveTreatAdvice",
      1: "saveTreatAdvice",
      // "1": "saveOperationAdvice",
      7: "saveInspectAdvice",
      15: "postOperationData",
      4: "updateBloodInfo",
      8: "postTestAll",
      31: "addConsultation",
    };
    this.printUrlCommon = "/webroot/decision/view/report";

    return {
      documentCardType: documentType,
      needDeclarePatmessage: needDeclarePatmessage,
      declareMessage: {
        证件类型: "",
        证件号码: "",
        人员来源: "99.其它采样点",
        "人员身份(必填)": "99.其它人群",
        "14天内境外入境(必填)": "否",
      }, //新冠申报信息
      componentsName: componentsName,
      adviceId: adviceId,
      orderPackageParams: {}, // 另存为医嘱的参数
      keepPrint: false, //续打模式
      filters: {
        statusChecked: [1, 2, 3, 4, 5, -5, 6, 7], //表格状态字段筛选条件
        effectiveChecked: [1, 2], //表格长/临字段筛选条件
      },
      drugCount: {
        count: undefined,
      }, //药品医嘱末日次数
      //showAlter: false, //显示药品医嘱停止弹窗
      //alterType: "promptMessage", //弹窗类型
      isEdit: false, //是否是编辑状态
      childPageVisible: false, ///显示医嘱下达子页面
      childPageContent: "prescription", //显示子级页面的显示内容
      // prescriptionVisible: false, //显示处方
      // orderPackageVisible:false,//显示医嘱套餐
      isTop: true, //滚动条是否在顶部
      tableRowData: {}, //待提交行数据
      submitRowData: {}, //已提交行数据
      isAll: false,
      saveList: [], //保存状态医嘱选中项
      needSubmitList: [], //需要被提交的医嘱
      submitList: [], //其他状态医嘱选中项
      doctorAdviceListData: [], //提交状态医嘱列表
      saveAdviceList: [], //保存状态医嘱列表
      adviceName: -1,
      adviceBigName: -1, //左侧列表医嘱类型
      commonObj: {}, //医嘱带出的公共数据
      isAdd: true, //是否显示搜索框
      newAdviceList: [], //编辑状态的医嘱列表
      keepPrint: "",
      specialDrugMessage: {}, //特殊药品的信息
      //alterTitle:'该操作将停止该长期医嘱，是否继续？',//弹窗相关标题描述
      alterData: {
        showAlter: false,
        alterType: "alterConsumables",
        alterTitle: "该操作将停止该长期医嘱，是否继续？",
        width: "450px",
        childData: [],
      },
      submitOrderIds: [], //要提交的医嘱列表
      specialDrugBtns: [], //特殊药品的按钮
      specialDrugEnable: true, //领取特殊药品是否可编辑
      timer: null,
      ApplicationFormName: "",
      caSignOperation: {}, //
      currentObjData: "",
      operationType: "submit", //操作类型
      currentRow: null,
      isConAdvice: true, //判断是否是新镇会诊医嘱
      errorAdvice: [], //错误的医嘱
      editIndex: 0,
      promptLoadShow: false,
    };
  },
  created() {
    this.rationalDrugUse = new RationalDrugUse(this, this.rationalDrugUseType);
    this.getOldSubmit();
    this.getTestSampleList();
    this.getDictData();
    this.getAdviceList("doctorAdviceListData", true);
    this.getAdviceList("saveAdviceList", true);
    if (this.isSignName) {
      this.caSignOperation = new CASign(this, this.signName);
    }
    this.$store.commit("public/SET_CAREQUESTLOADING", "");
  },
  mounted() {
    this.$refs.adviceMain.addEventListener("scroll", this.scroll, false);
    console.log(this.rationalDrugUseType, 8889);
    if (this.rationalDrugUseType === "2") {
      document.oncontextmenu = function () {
        return false;
      };
    }
    this.needSubmitList = JSON.parse(JSON.stringify(this.saveList));
  },
  beforeDestroy() {
    this.$refs.adviceMain.removeAttribute("scroll", this.scroll, false);
    if (this.rationalDrugUseType === "2") {
      document.oncontextmenu = function () {};
    }
  },
  computed: {
    ...mapGetters({
      patientMsg: "public/GET_PATIENTMSG",
      drupUnit: "configuration/GET_DRUPUNIT", //抢救留观药品数量单位
      collapse: "public/GET_COLLAPSE",
      signName: "public/GET_SIGNNAME", //签名系统简称
      isSignName: "public/GET_ISSIGNNAME", //是否启用
      isGetCA: "public/GET_ISGETCA", //
      user: "public/GET_USER",
      selectArea: "home/GET_SELECTAREA", //所在区域
      isRegister: "configuration/GET_ISREGISTER", //是否可挂号
      inHosCost: "configuration/GET_INHOSCOST", //是否启用诊间结算
      userRightList: "public/GET_USERRIGHTLIST",
      rationalDrugUseType: "configuration/GET_ISVALIDATEMEDICINE",
      updatePatientList: "public/GET_UPDATEPATIENTLIST", //更新患者列
      caImgData: "public/GET_CAIMGDATA", //ca签名图片数据流，医嘱提交处使用
      caRequestLoading: "public/GET_CAREQUESTLOADING", //ca签名loading提示
      typeList: "doctoradvice/GET_ORDERCLASSIFICATION",
      testItemCodeList: "doctoradvice/GET_TESTITEMCODELIST",
    }),
    // 过滤后提交的医嘱列表
    submitData() {
      this.$nextTick(() => {
        this.rowClick(this.submitRowData);
      });
      return this.doctorAdviceListData.filter((item, index) => {
        item._index = index;
        return (
          this.filters.statusChecked.includes(
            item.EffectiveTime === 1 && item.Status === 5
              ? -item.Status
              : item.Status
          ) && this.filters.effectiveChecked.includes(item.EffectiveTime)
        );
      });
    },
    // 过滤后待提交的医嘱列表
    saveData() {
      this.$nextTick(() => {
        console.log("被保存的数据");
        this.$refs.drops && this.$refs.drops.checked("clearSelection");
        this.$refs.drops && this.$refs.drops.checked("toggleRowSelection");
      });
      return (this.saveList = this.saveAdviceList.filter((item, index) => {
        item._index = index;
        item.isInfoShow = false;
        item._isEdit = false;
        // return item.Status
        return (
          this.filters.statusChecked.includes(item.Status) &&
          this.filters.effectiveChecked.includes(item.EffectiveTime)
        );
      }));
    },
    // 全选的中间状态
    isStatus() {
      //let len = this.saveList.length + this.submitList.length;
      let len = this.needSubmitList.length + this.submitList.length;
      let maxLen = this.saveData.length + this.submitData.length;
      this.isAll = len === 0 ? false : len === maxLen;
      return len !== 0 && len < maxLen;
    },
    regeisterDepCode: function () {
      let obj = this.patientMsg.RegisterInfoList.find((item) => {
        return item.HisRegistId == this.patientMsg.RegistId;
      });
      let code = "";
      if (obj) {
        code = obj.RegDepartmentCode;
      }
      return code;
    },
  },
  watch: {
    updatePatientList(val) {
      this.getAdviceList("doctorAdviceListData");
    },
    // 第一次新增医嘱自动滚动到底部
    isAdd(newVal, oldVal) {
      if (oldVal === true && newVal === false) {
        this.scrollTop = this.$refs.adviceMain.scrollTop;
        this.$nextTick(() => {
          this.goBack(true, 2);
        });
      }
    },
    // 修改医嘱自动滚动到底部
    isEdit(newVal, oldVal) {
      if (oldVal === false && newVal === true) {
        this.scrollTop = this.$refs.adviceMain.scrollTop;
        this.$nextTick(() => {
          //  setTimeout(() => {
          //  console.log(this.$refs.doctorAdvice.$el.offsetTop,'h');

          //  }, 1100);
          this.goBack(true, 1);
        });
      }
    },
    isGetCA: function (val) {
      if (val) {
        // 验证
        if (
          this.currentObjData.Data[0].Name == "停止/作废医嘱" ||
          this.currentObjData.Data[0].Name == "提交医嘱"
        ) {
          this.caSignOperation.checkData(
            this.user.UserInfo,
            this.currentObjData
          );
        }
      }
    },
  },
  methods: {
    //判断药品是否是医保
    isMedicalInsuranceMsg(params) {
      return new Promise(async (resolve, reject) => {
        // let InsuranceUseFlag = false;
        let res = await this.$Api.medicalInsuranceMsg(params);
        if (res.Data) {
          this.$confirm(res.Data, "提示", {
            confirmButtonText: "医保",
            cancelButtonText: "自费",
            showClose: false,
            closeOnClickModal: false,
            closeOnPressEscape: false,
          })
            .then(() => {
              resolve(true);
            })
            .catch(() => {
              resolve(false);
            });
        } else {
          resolve(false);
        }
      });
    },
    //诊间结算
    chargingClick() {
      // this.alterData = {
      //   showAlter: true,
      //   alterType: "clinicRoom",
      //   alterTitle: "诊间结算",
      //   width: "400px",
      //   childData: {
      //     ...res.Data,
      //     PayType: "",
      //     ScanValue: "",
      //   },
      // };
      this.promptLoadShow = true;
      this.$Api
        .readCarNumber({
          type: "ICCard",
          str: JSON.stringify({
            Name: this.user.UserInfo.Name,
            No: this.user.UserInfo.No,
          }),
        })
        .then((res) => {
          this.promptLoadShow = false;
          if (res.Status) {
            this.getchargingInfo(JSON.parse(res.Data));
          }
        });
    },
    //诊间结算获取信息的数据
    getchargingInfo(data) {
      if (data.Name != this.patientMsg.PatientName) {
        return this.$msg.warning("读卡信息与当前就诊患者信息不符！");
      }
      this.$Api
        .getChargingInfo({
          InHospitalId: this.patientMsg.InHouseId,
          HisPatientId: this.patientMsg.HISPatientId,
          FeeType: data.InsuranceCode,
          SocialSecurityNumber: data.SocialSecurityNumber,
          SocialSecurityID: data.SocietyId,
          CordinateArea: data.TcqrCode,
          SocialSecurityType: data.InsuranceCode,
        })
        .then((res) => {
          this.$msg[res.Status ? "success" : "warning"](res.Message);
          if (res.Status && res.Data) {
            this.alterData = {
              showAlter: true,
              alterType: "clinicRoom",
              alterTitle: "诊间结算",
              width: "500px",
              childData: {
                ...res.Data,
                PayType: "",
                ScanValue: "",
              },
            };
          }
        });
    },
    //诊间结算请求支付接口
    postPayTypeSend() {
      if (this.alterData.childData) {
        console.log(this.alterData.childData);
        if (!this.alterData.childData.PayType) {
          return this.$msg.warning("请选择支付方式！");
        }
        if (!this.alterData.childData.ScanValue) {
          return this.$msg.warning("请出示付款码！");
        }
        this.$Api.postPayTypeSend(this.alterData.childData).then((res) => {
          this.$msg[res.Status ? "success" : "warning"](res.Message);
          if (res.Status) {
            this.alterData.showAlter = false;
            this.alterData.childData = [];
          }
        });
      }
    },
    //获取诊断的数据
    getOldSubmit() {
      this.$Api
        .getHistoryDiagnoseList({
          inHouseId: this.$route.query.id || this.patientMsg.InHouseId,
        })
        .then((res) => {
          this.diagnoseList = res.Data || [];
        });
    },
    // 医嘱列表右键事件
    contextmenu(row, event, column) {
      console.log(
        row,
        column,
        event,
        this.$el.getBoundingClientRect().left,
        this.$el
      );
      if (row.OrderType === 14 && this.rationalDrugUseType === "2") {
        let data = [];
        row.OrderDetails.forEach((el) => {
          data.push({
            HisMedId: el.HisMedId,
            MedicineName: el.MedicineName,
            ViewDrugDetailInfoUrl: el.ViewDrugDetailInfoUrl,
          });
        });
        this.$refs.contextmenu &&
          this.$refs.contextmenu.openMenu(
            data,
            event,
            this.$el.getBoundingClientRect().left,
            this.$el.offsetWidth
          );
      }
    },
    // 药品医嘱控件右键事件
    contextmenuDrup(row, event, column) {
      this.rationalDrugUseType === "2" &&
        this.$refs.contextmenu &&
        this.$refs.contextmenu.openMenu(
          [
            {
              HisMedId: row.HisMedId,
              MedicineName: row.MedicineName,
            },
          ],
          event,
          this.$el.getBoundingClientRect().left,
          this.$el.offsetWidth
        );
    },
    // 显示套餐、历史医嘱、处方
    showChildPage(type) {
      this.publicUrl = "";
      if (this.isEdit) return; //编辑模式禁用
      this.childPageVisible = true;
      this.childPageContent = type;
    },
    // 历史医嘱
    historyDoctorAdvice() {
      this.alterData.showAlter = true;
      this.alterData.alterType = "historyDoctorAdvice";
      this.alterData.width = "1166px";
      this.alterData.alterTitle = "历史医嘱";
      //this.getSpecicalDrugMessage();
    },
    closeOrdePack() {
      console.log("历史医嘱引用");
      this.childPageVisible = false;
      this.getAdviceList("saveAdviceList", true);
    },
    // 另存为医嘱套餐
    saveOrderPackage() {
      if (this.isEdit) return; //编辑模式禁用
      console.log(this.needSubmitList, this.saveAdviceList);
      let needSubmitList = [];
      this.needSubmitList.forEach((el) => {
        this.saveAdviceList.forEach((item) => {
          el.OrderId === item.OrderId && needSubmitList.push(el);
        });
      });
      this.needSubmitList = needSubmitList;
      if (this.submitList.length + this.needSubmitList.length == 0) {
        this.$msg.warning("请选择医嘱");
        return;
      }
      this.alterData.showAlter = true;
      this.alterData.alterType = "saveOrderPackage";
      this.alterData.width = "560px";
      this.alterData.alterTitle = "另存为医嘱套餐";
      if (this.$refs.saveOrder) {
        this.$refs.saveOrder.orderPackageParams = {};
      }
    },
    // 复选框选择打印
    selectPrint(val) {
      if (this.isEdit) return; //编辑模式禁用
      if (this.submitList.length == 0) {
        return this.$msg.warning("请选择需要打印的医嘱单");
      }
      let url = "";
      let t = new Date().getTime();
      let str = "";
      this.submitList.forEach((item) => {
        if (val == 1) {
          if (item.OrderType === 14) {
            str += item.CreateTimeSpan + ",";
          }
        } else {
          str += item.CreateTimeSpan + ",";
        }
      });
      str = str.substring(0, str.length - 1);
      if (val == 1) {
        if (!str) return this.$msg.warning("请选择需要打印的输液单");
        str = str.replace(/,/g, "*");
        this.printDuchang(
          printObjectType.infusionOrder.templateId,
          printObjectType.infusionOrder.reportType,
          str,
          printObjectType.infusionOrder.objectType
        );
      } else if (val == 2) {
        this.printDuchang(
          printObjectType.otherAdvice.templateId,
          printObjectType.otherAdvice.reportType,
          str,
          printObjectType.otherAdvice.objectType
        );
      }
    },
    printDuchang(templateId, reportType, timeStr = "", objectType) {
      clearTimeout(this.timer);
      let t = new Date().getTime();
      let str = window.location.protocol + "\\" + window.location.host;
      let url = `${URLCONFIG.Emr}/Nursing/EditPage.aspx?patientId=${this.patientMsg.PatientId}&inHouseId=${this.patientMsg.InHouseId}&areaType=${this.patientMsg.AreaType}&createUser=940c7df7-a718-e911-80cd-0050568e1b08&originUrl=${str}&objectType=${objectType}&logUserEditTrack=true&documentId=f2f201db-3ca2-47b0-ba81-ab6b0096abd6&mark=true&templateId=${templateId}&reportType=${reportType}&timestamps=${timeStr}&areaId=${this.patientMsg.AreaId}&t=${t}`;
      console.log(url);
      this.$store.commit("public/SET_PRINTIFRAMEURL", url);
    },
    // 选择不同类别的打印
    selectChange(value) {
      console.log(value);
      let url = "";
      let t = new Date().getTime();
      let kk = this.keepPrint ? 1 : 0;
      if (value == 0) {
        // 长/临
        this.printDuchang(
          printObjectType.longTempAdvice.templateId,
          printObjectType.longTempAdvice.reportType,
          "",
          printObjectType.longTempAdvice.objectType
        );
      } else if (value == 1) {
        // 临
        this.printDuchang(
          printObjectType.tempAdvice.templateId,
          printObjectType.tempAdvice.reportType,
          "",
          printObjectType.tempAdvice.objectType
        );
      } else if (value == 2) {
        // 长
        this.printDuchang(
          printObjectType.longAdvice.templateId,
          printObjectType.longAdvice.reportType,
          "",
          printObjectType.longAdvice.objectType
        );
      }
      // url = `${URLCONFIG.DoctorAdvicePrint}${this.printUrlCommon}?viewlet=${value}&inhouseid=${this.patientMsg.InHouseId}&iskeepprint=${kk}`;
      // let dom = document.createElement("a");
      // dom.setAttribute("href", url);
      // dom.setAttribute("target", "_blank");
      // dom.click();
      // console.log(url);
    },
    // 获取标本信息
    getTestSampleList() {
      this.$Api.getTestSampleList().then((res) => {
        this.specimenOptions = res.Data || [];
      });
    },

    // 获取频次代码
    getDictData() {
      this.$Api.getFrequency().then((res) => {
        let arr = res.Data || [];
        arr.forEach((item) => {
          if (item.InputString === "QD") {
            this.FrequencyCode = item.Code;
          } else if (item.InputString === "BID") {
            this.BID = item;
          } else if (item.InputString === "ST") {
            this.ST = item.Code;
            this.STObj = item;
          }
        });
      });
    },
    // 关闭弹窗
    async closeAlter(bl) {
      console.log(this.alterData, "关闭弹窗");
      if (bl) {
        // 套餐另存为
        if (this.alterData.alterType === "saveOrderPackage") {
          let params = await this.$refs.saveOrder.save();
          if (!params) {
            this.$msg.warning("请把信息填写完整");
            return;
          }
          let ids = [];
          this.submitList.forEach((item) => {
            ids.push(item.OrderId);
          });
          // this.saveList.forEach(item => {
          //   ids.push(item.OrderId);
          // });
          this.needSubmitList.forEach((item) => {
            ids.push(item.OrderId);
          });
          params.OrderMainIds = ids;
          this.$Api.saveAsOrderPackage(params).then((res) => {
            if (res.Status) {
              this.$msg.success("操作成功");
              return;
            }
          });

          this.alterData.showAlter = false;
        } else if (this.alterData.alterType === "specialDrug") {
          // 特殊药品提交
          console.log("特殊药品提交");
          if (!this.specialDrugEnable) {
            // 修改
            this.specialDrugEnable = true;
            this.specialDrugBtns = [];
            return;
          }
          let params = await this.$refs.editSpecialDrug.save();
          console.log("特殊药品参数", params);
          if (params) {
            let specialDrugArr = params.SpecialMedicinePrescriptions || [];
            let hisorderIds = "";
            let RegisterId = "";
            let ObjectTypes = "";
            let TemplateIds = "";
            specialDrugArr.forEach((item) => {
              if(item.IsPrint){
                  hisorderIds += item.HisOrderId + ",";
              RegisterId += item.RegisterId + ",";
              ObjectTypes +=
                printObjectType[item.PrescriptionName].objectType + ",";
              TemplateIds +=
                printObjectType[item.PrescriptionName].templateId + ",";
              }
            });
            if (hisorderIds != "") {
              clearTimeout(this.timer);
              let t = new Date().getTime();
              // let str = window.location.protocol + "\\" + window.location.host;
              let url = `${URLCONFIG.Emr}/Nursing/EditPage.aspx?patientId=${
                this.patientMsg.PatientId
              }&inHouseId=${this.patientMsg.InHouseId}&areaType=${
                this.patientMsg.AreaType
              }&createUser=940c7df7-a718-e911-80cd-0050568e1b08&objectType=${
                printObjectType.specialDrugBatch.objectType
              }&logUserEditTrack=true&documentId=f2f201db-3ca2-47b0-ba81-ab6b0096abd6&mark=true&templateId=C16DA3C4-D502-4082-AEC8-AB7C00F17C78&ids=${RegisterId.slice(
                0,
                RegisterId.length - 1
              )}&hisorderIds=${hisorderIds.slice(
                0,
                hisorderIds.length - 1
              )}&ObjectTypes=${ObjectTypes.slice(
                0,
                ObjectTypes.length - 1
              )}&TemplateIds=${TemplateIds.slice(
                0,
                TemplateIds.length - 1
              )}&ismult=true&areaId=${this.patientMsg.AreaId}&t=${t}`;
              console.log(url);
              this.$store.commit("public/SET_PRINTIFRAMEURL", url);
            }
            this.publicUrl &&
              getServerTimeRandom(this.publicUrl).then((res) => {
                document.getElementById("publicIframe").src = res;
              });
            this.alterData.showAlter = false;
          }
        } else if (this.alterData.alterType === "declarePatmessage") {
          // 新冠肺炎 检查检验 申报用户信息
          this.$refs.declarePatmessage.save().then((res) => {
            if (res) {
              this.alterData.showAlter = false;
              this.afterDeclareMessageSubmitAdvice();
            }
          });
        } else if (this.alterData.alterType === "clinicRoom") {
          console.log(111);
          this.postPayTypeSend();
        }
      } else {
        if (this.alterData.alterType === "alterConsumables") {
          this.getAdviceList("doctorAdviceListData", true);
        } else if (this.alterData.alterType === "specialDrug") {
          this.publicUrl &&
            this.$store.commit("public/SET_PRINTIFRAMEURL", this.publicUrl);
        }
        this.alterData.showAlter = false;
      }
    },
    // 停止、作废医嘱Api
    stopAdviceApi(row, MaxNumber = 0) {
      this.$Api
        .stopAdvice({
          opertionType: row.EffectiveTime === 2 ? 4 : 5,
          orderIdList: [row.OrderId],
          MaxNumber,
        })
        .then((res) => {
          this.$store.commit("public/SET_CAREQUESTLOADING", "");
          this.$msg[res.Status ? "success" : "warning"](res.Message);
          if (res.Status) {
            this.submitRowData = {};
            this.getAdviceList("doctorAdviceListData");
          }
        });
    },
    // 停止/作废医嘱
    stopAdvice(row) {
      this.operationType = "stop";
      this.currentRow = row;

      if (this.isSignName) {
        let obj = {
          Type: "0",
          Data: [{ Name: "停止/作废医嘱" }],
          No: this.user.UserInfo.No,
          UserName: this.user.UserInfo.Name,
        };
        this.currentObjData = obj;
        // this.$store.commit("public/SET_CACURRENTOBJDATA", this.currentObjData);
        this.$store.commit(
          "public/SET_CAREQUESTLOADING",
          "正在操作医嘱，请稍候"
        );
        this.caSignOperation.KeyVerify();
      } else {
        this.handleOperation();
      }
    },
    // 已提交医嘱当前行
    rowClick(row) {
      if (this.isEdit) return; //编辑模式禁用

      // this.$refs.reference&&this.$refs.reference.tableRowClick(row)
      this.submitRowData =
        this.filters.statusChecked.includes(row.Status) &&
        this.filters.effectiveChecked.includes(row.EffectiveTime)
          ? row
          : {};
    },
    // 修改医嘱
    editAdvice(row, event, column) {
      if (!this.isEdit && this.isAdd) {
        this.toTop = event.clientY;
        if (row.OrderType === 14) {
          // 药品医嘱没有处方权限不能编辑
          if (!this.userRightList.IsHasPrescriptionRight) {
            this.$msg.warning("当前账号没有处方权限，不能编辑药品医嘱");
            return;
          }
          this.$Api.getAdviceDetail({ orderId: row.OrderId }).then((res) => {
            if (res.Status) {
              // this.adviceName=row.OrderType;
              row._isEdit = true;
              //this.$set(row, "_isEdit", true);
              this.isEdit = true;
              this.tableRowData = row;
              console.log(res.Data);
              this.$refs.drops.rowExpansion(row, true);
              this.commonObj = res.Data.doctorOrderMain;

              this.newAdviceList = res.Data.doctorOrderDetails.filter(
                (item) => {
                  let obj = item.SingleMedicinalInfo;
                  for (const key in obj) {
                    // console.log(key,obj[key]);
                    if (key !== "IsSelfProvided") {
                      item[key] = obj[key];
                    }
                  }
                  item.Price =
                    (item.Price / item.DrugStoreFactor) *
                    item[
                      item.DosageUnitCategory === 1
                        ? "InhospitalFactor"
                        : "OutPatientFactor"
                    ];
                  // if (item.DosageUnit!==item.DrugStoreUnit) {
                  //   item.Price=item.Price/item.DrugStoreFactor
                  // }
                  item.doseOption = Array.from(
                    new Set([obj.SpecificationUnit, obj.MinimumUnit])
                  );
                  item.step = {};
                  item.step[obj.SpecificationUnit] = +obj.SpecificationFactor;
                  item.step[obj.MinimumUnit] =
                    obj.SpecificationUnit === obj.MinimumUnit
                      ? +obj.SpecificationFactor
                      : 1;
                  delete item.SingleMedicinalInfo;
                  return true;
                }
              );
            } else {
              this.$msg.warning(res.Message);
            }
          });
          // 护理医嘱，膳食医嘱,治疗医嘱
        } else if (
          row.OrderType === 5 ||
          row.OrderType === 3 ||
          row.OrderType === 0 ||
          row.OrderType === 1 ||
          row.OrderType === 2 ||
          row.OrderType === 6 ||
          row.OrderType === 11 ||
          row.OrderType === 20 ||
          row.OrderType === 12 ||
          row.OrderType === 13
        ) {
          let data = {};
          data.OrderId = row.OrderId;
          data.Id = row.OrderId;
          data.OrderContent = row.OrderContent;
          data.Price = row.OrderDetails[0].Price;
          data.ItemId = row.OrderDetails[0].Id;
          data.ItemType = row.OrderDetails[0].ItemType;
          // data.ItemType=row.OrderType
          data.DictItemCode = row.OrderDetails[0].DictItemCode;
          data.Frequency = row.FrequencyText;
          data.FrequencyCode = row.FrequencyCode;
          // 膳食医嘱，治疗医嘱
          if (
            row.OrderType === 3 ||
            row.OrderType === 0 ||
            row.OrderType === 1 ||
            row.OrderType === 20 ||
            row.OrderType === 12 ||
            row.OrderType === 2 ||
            row.OrderType === 6 ||
            row.OrderType === 11 ||
            row.OrderType === 13
          ) {
            data.Count = row.OrderDetails[0].Count;
            data.Unit = row.OrderDetails[0].Unit;
            data.InsuranceUseFlag = row.OrderDetails[0].InsuranceUseFlag;
          }
          this.newAdviceList.push(data);
          this.commonObj = {};
          this.commonObj.ExcuteDepartment = row.OrderDetails[0].ExcuteDepartment
            ? row.OrderDetails[0].ExcuteDepartment
            : this.regeisterDepCode;
          this.commonObj.StartTime = row.StartTime;
          this.commonObj.Remark = row.Remark;
          this.commonObj.IsAdditional = row.IsAdditional;
          this.commonObj.EffectiveTime = row.EffectiveTime;
          let list = row.OrderDetails[0].ExcuteDepartment
            ? [row.OrderDetails[0].ExcuteDepartment, this.regeisterDepCode]
            : [this.regeisterDepCode];
          this.commonObj.NewDepartmentList = [...new Set(list)];
          // 治疗医嘱
          if (
            row.OrderType === 0 ||
            row.OrderType === 1 ||
            row.OrderType === 20 ||
            row.OrderType === 12 ||
            row.OrderType === 2 ||
            row.OrderType === 6 ||
            row.OrderType === 11 ||
            row.OrderType === 13
          ) {
            this.commonObj.IsEmergency = row.IsEmergency;
            this.commonObj.IsBed = row.IsBed;
          }
          data.IsDeleted = false;
          row._isEdit = true;
          //this.$set(row, "_isEdit", true);
          this.isEdit = true;
          this.tableRowData = row;
          this.$refs.drops.rowExpansion(row, true);
        } else if (row.OrderType === 122) {
          // 文字医嘱
          let data = {};
          data.OrderId = row.OrderId;
          data.WordsType = row.WordsType;
          data.Id = row.OrderId;
          data.OrderContent = row.OrderContent;
          data.Frequency = row.FrequencyText;
          data.FrequencyCode = row.FrequencyCode;
          this.newAdviceList.push(data);
          this.commonObj = {};
          this.commonObj.StartTime = row.StartTime;
          this.commonObj.Remark = row.Remark;
          this.commonObj.IsAdditional = row.IsAdditional;
          this.commonObj.EffectiveTime = row.EffectiveTime;
          data.IsDeleted = false;
          row._isEdit = true;
          //this.$set(row, "_isEdit", true);
          this.isEdit = true;
          this.tableRowData = row;
          this.$refs.drops.rowExpansion(row, true);
          // 手术医嘱
        } else if (row.OrderType === 15) {
          console.log(row);
          this.$Api.getOperationDetail({ formId: row.FormId }).then((res) => {
            if (res.Status) {
              this.commonObj = res.Data;
              row._isEdit = true;
              //this.$set(row, "_isEdit", true);
              this.isEdit = true;
              this.tableRowData = row;
              this.$refs.drops.rowExpansion(row, true);
            } else {
              this.$msg.warning(res.Message);
            }
          });
        } else if (row.OrderType === 7) {
          // 检查医嘱
          let arr = JSON.parse(JSON.stringify(row.OrderDetails));
          arr.forEach((el) => {
            el.OrderId = el.ItemId;
            el.IsDeleted = false;
          });
          if (row.CheckFormModel.Diagnosis) {
            row.CheckFormModel.Diagnosis =
              typeof row.CheckFormModel.Diagnosis === "string"
                ? row.CheckFormModel.Diagnosis.split(",")
                : row.CheckFormModel.Diagnosis;
          } else {
            row.CheckFormModel.Diagnosis = [];
          }
          this.commonObj = row.CheckFormModel;
          this.commonObj.OrderId = row.OrderId;

          this.newAdviceList = arr;
          row._isEdit = true;
          //this.$set(row, "_isEdit", true);
          this.isEdit = true;
          this.tableRowData = row;
          this.$refs.drops.rowExpansion(row, true);
        } else if (row.OrderType === 8) {
          // 检验医嘱
          let arr = JSON.parse(JSON.stringify(row.OrderDetails));
          arr.forEach((el) => {
            el.CheckedList = [];
            if (el.ChildItems == null) {
              el.ChildItems = [];
            }
            el.ChildItems.forEach((a) => {
              el.CheckedList.push(a.DictItemCode);
            });
            // el.IsDeleted=false
          });
          // row.CheckFormModel.Diagnosis= row.CheckFormModel.Diagnosis.split(',')
          this.commonObj = row.TestFormModel;
          this.commonObj.OrderId = row.OrderId;
          this.commonObj.FormId = row.FormId;

          this.newAdviceList = arr;
          row._isEdit = true;
          //this.$set(row, "_isEdit", true);
          this.isEdit = true;
          this.tableRowData = row;
          this.$refs.drops.rowExpansion(row, true);
        } else if (row.OrderType === 4) {
          // 用血
          console.log(row);
          this.$Api
            .getDoctorBloodOrderInfo({ BloodFormId: row.FormId })
            .then((res) => {
              if (res.Status) {
                console.log(res, "res");
                this.commonObj = res.Data.DoctorBloodFormEntity;
                this.newAdviceList = res.Data.DoctorBloodFormDetailsList;
                //     this.commonObj=res.Data
                row._isEdit = true;
                //this.$set(row, "_isEdit", true);
                this.isEdit = true;
                this.tableRowData = row;
                this.$refs.drops.rowExpansion(row, true);
              } else {
                this.$msg.warning(res.Message);
              }
            });
        } else if (row.OrderType === 31) {
          this.$Api
            .getConsultationInfo({ ConsultationId: row.ConsultationId })
            .then((res) => {
              if (res.Status) {
                console.log(res, "res");
                this.isConAdvice = false;
                var arr = [];
                for (let i = 0; i < res.Data.ConsultationDetails.length; i++) {
                  arr.push(res.Data.ConsultationDetails[i].DepartmentCode);
                }
                res.Data.ConsultationDetails = arr;
                this.commonObj = res.Data;
                row._isEdit = true;
                //this.$set(row, "_isEdit", true);
                this.isEdit = true;
                console.log("row", row);
                this.tableRowData = row;
                this.$refs.drops.rowExpansion(row, true);
              } else {
                this.$msg.warning(res.Message);
              }
            });
        }
      }
    },

    // 获取医嘱列表
    getAdviceList(type, bl) {
      this.$Api
        .getAdviceList({
          inHouseId: this.$route.query.id || this.patientMsg.InHouseId,
          orderStatus: type === "saveAdviceList" ? 1 : 2,
        })
        .then((res) => {
          this[type] = res.Data || [];
          if (type === "saveAdviceList" && !this[type].length)
            this.needSubmitList = [];
          this.isEdit = false;
          this.$nextTick(() => {
            // 首次滚动到底部
            if (bl && this.$refs.adviceMain)
              this.$refs.adviceMain.scrollTop = 11111;
            type === "saveAdviceList" &&
              this.$refs.drops &&
              this.$refs.drops.checked("toggleRowSelection");
          });
          !res.Status && this.$msg.warning(res.Message);
        });
    },
    //表格选择
    submitSelectionChange(el) {
      this.submitList = el;
    },
    //表格选择
    saveSelectionChange(el) {
      //this.saveList = el;
      this.needSubmitList = el;
    },
    // 表格全选，全取消
    selectAll(el) {
      this.$refs.reference &&
        this.$refs.reference.checked(
          el ? "toggleRowSelection" : "clearSelection"
        );
      setTimeout(() => {
        this.$refs.drops &&
          this.$refs.drops.checked(
            el ? "toggleRowSelection" : "clearSelection"
          );
      }, 100);
    },
    // 新增医嘱
    async add(item, index) {
      console.log("add", item);

      if (typeof item === "string") {
        item = {
          ItemName: item,
          ItemType: 122,
        };
      }
      // 不允许重复医嘱项目
      this.adviceName = +item.ItemType;

      let off = true;
      let idName = item.ItemType !== 122 ? "HisMedId" : "WordsType";
      this.newAdviceList
        .filter((a) => !a.IsDeleted)
        .forEach((el, i) => {
          console.log(
            el,
            el[this.adviceId[item.ItemType]],
            item[idName],
            "opkn"
          );
          if (
            item[idName] &&
            el[this.adviceId[item.ItemType]] == item[idName] &&
            i !== index
          ) {
            off = false;
          }
        });
      if (!off) return this.$msg.info("该医嘱项目已存在！");
      console.log(item, index, "add");
      // 药品医嘱
      this.commonObj = {};
      if (item.ItemType === 14) {
        this.$Api
          .getDrugDetails({ hisMedicinalId: item.HisMedId })
          .then(async (res) => {
            if (res.Status && res.Data) {
              let data = res.Data;
              data.Id = "00000000-0000-0000-0000-000000000000";
              data.Manufacturer = item.Vendor;
              data.MedicalInsuranceControlFlag =
                item.MedicalInsuranceControlFlag; //医保限制标志
              data.Memo = item.Memo; //医保限制标志
              data.ReimbursementType = item.ReimbursementType || 0; //医保审核标志 0为默认，1为医保，2为自费
              data.doseOption = Array.from(
                new Set([data.SpecificationUnit, data.MinimumUnit])
              );
              data.InsuranceUseFlag = await this.isMedicalInsuranceMsg({
                HisRegisterId: this.patientMsg.RegistId,
                HisMedId: item.HisMedId,
                OrderType: item.ItemType,
              });
              data.step = {};
              data.step[data.SpecificationUnit] = +data.SpecificationFactor;
              data.step[data.MinimumUnit] =
                data.SpecificationUnit === data.MinimumUnit
                  ? +data.SpecificationFactor
                  : 1;
              data.MedicinalUsageList = data.MedicinalUsageList || [];
              // data.numberOption = Array.from(
              //   new Set([data.OutPatientUnit, data.MinimumUnit])
              // );
              // 是否含有静滴用法
              let hasJd = true;
              data.MedicinalUsageList.forEach((el) => {
                if (
                  el.Text === "静滴" &&
                  this.selectArea.DiagnosisAreaType !== 3
                ) {
                  data.UsageText = el.Text;
                  data.UsageCode = el.Value;
                  hasJd = false;
                } else if (
                  el.Text === "口服" &&
                  this.selectArea.DiagnosisAreaType === 3
                ) {
                  data.UsageText = el.Text;
                  data.UsageCode = el.Value;
                  hasJd = false;
                }
              });
              if (hasJd && data.MedicinalUsageList.length) {
                data.UsageText = data.MedicinalUsageList[0].Text;
                data.UsageCode = data.MedicinalUsageList[0].Value;
              }
              data.Dose = data.SpecificationFactor;
              data.Unit = data.SpecificationUnit;
              data.Dosage = 1;
              data.FirstDayDosageNum = 1;

              // 门诊单位或住院单位
              data.DosageUnit = data.OutPatientUnit;
              data.DosageUnitCategory = 2; //是门诊单位还是住院单位
              if (this.drupUnit === "1") {
                data.DosageUnit =
                  this.selectArea.DiagnosisAreaType === 3
                    ? data.OutPatientUnit
                    : data.InhospitalUnit;
                data.DosageUnitCategory =
                  this.selectArea.DiagnosisAreaType === 3 ? 2 : 1; //是门诊单位还是住院单位
              }
              // 单价=零售价/药库系数*住院or门诊系数
              data.Price =
                (data.Price / data.DrugStoreFactor) *
                data[
                  data.DosageUnitCategory === 1
                    ? "InhospitalFactor"
                    : "OutPatientFactor"
                ];

              data.frequency = this.STObj; //默认频次

              data.IsSkinTest = !!data.SkinTestFlag; /// 是否皮试
              data.IsSelfProvided = false; //是否是自带药品
              data.IsAntimicrobial = data.SpecialCode === 9; //是否是抗菌药
              // data.
              let off = this.isAdd;
              // 医嘱新增
              if (index < 0) {
                this.newAdviceList.push(data);
                this.isAdd = this.isEdit;
                if (this.newAdviceList.length === 1) {
                  this.commonObj = {
                    UsageCode: data.UsageCode, //用法代码
                    UsageText: data.UsageText, //用法文本
                    PharmacyNumber: data.PharmacyCode, //药房
                  };
                }
                // ref="addComponent"
                this.$refs.addComponent &&
                  this.$refs.addComponent.computeNum &&
                  this.$refs.addComponent.computeNum(data);
                console.log(data, "data", this.commonObj);
              } else {
                // 修改
                let obj = this.newAdviceList[index];
                for (const key in data) {
                  if (obj.hasOwnProperty(key)) {
                    obj[key] = data[key];
                  }
                }
                if (
                  index === 0 &&
                  this.newAdviceList.filter((item) => !item.IsDeleted)
                    .length === 1
                ) {
                  this.commonObj = {
                    UsageCode: obj.UsageCode, //用法代码
                    UsageText: obj.UsageText, //用法文本
                    PharmacyNumber: obj.PharmacyCode, //药房
                    // MedicinalUsageList:obj.MedicinalUsageList,//用法字典
                  };
                } else {
                  this.commonObj = { t: +new Date() };
                }
                obj._edit = false;
              }
            } else {
              this.$msg.warning(res.Message);
            }
          });
        // 护理医嘱
      } else if (item.ItemType === 5) {
        // 不允许同时添加多个等级护理医嘱
        let off = true;
        this.newAdviceList
          .filter((item) => !item.IsDeleted)
          .forEach((el, i) => {
            if (
              el.OrderContent &&
              el.OrderContent.substring(el.OrderContent.length - 3) ===
                "级护理" &&
              i !== index
            ) {
              off = false;
            }
          });
        if (
          !off &&
          item.ItemName.substring(item.ItemName.length - 3) === "级护理"
        )
          return this.$msg.info("不允许同时添加多个等级护理医嘱");
        // 增加或修改
        let data = index < 0 ? {} : this.newAdviceList[index];
        data.OrderContent = item.ItemName;
        data.Price = item.Price;
        data.ItemType = item.OrderItemType;
        data.DictItemCode = item.HisMedId;
        data.Frequency = "QD";
        data.FrequencyCode = this.FrequencyCode;

        data.IsDeleted = false;
        data._edit = false;
        index < 0 && this.newAdviceList.push(data);
        this.commonObj.ExcuteDepartment = item.Department;

        this.isAdd = this.isEdit;
      } else if (item.ItemType === 122) {
        // 文字医嘱
        let data = index < 0 ? {} : this.newAdviceList[index];
        if (item.WordsType !== undefined) {
          data.WordsType = item.WordsType;
        } else {
          delete data.WordsType;
        }
        data.OrderContent = item.ItemName;
        data.Frequency = "QD";
        data.FrequencyCode = this.FrequencyCode;

        data.IsDeleted = false;
        data._edit = false;
        index < 0 && this.newAdviceList.push(data);
        this.isAdd = this.isEdit;
        // FrequencyCode
      } else if (
        item.ItemType === 3 ||
        item.ItemType === 0 ||
        item.ItemType === 1 ||
        item.ItemType === 2 ||
        item.ItemType === 6 ||
        item.ItemType === 11 ||
        item.ItemType === 12 ||
        item.ItemType === 13 ||
        item.ItemType === 20
      ) {
        // 膳食医嘱,治疗医嘱，手术项目、诊疗、糖、其它
        let data = index < 0 ? {} : this.newAdviceList[index];
        data.DictItemCode = item.HisMedId;
        data.OrderContent = item.ItemName;
        data.Price = item.Price;
        data.ItemType = item.OrderItemType;
        data.Count = 1;
        data.Unit = item.DrugStoreUnit;
        // data.DoseUnit = item.DrugStoreUnit;
        // data.Dose = 1;
        // data.Frequency='QD'
        data.FrequencyCode = item.ItemType === 3 ? this.FrequencyCode : this.ST;
        if (item.ItemType === 0) {
          data.InsuranceUseFlag = await this.isMedicalInsuranceMsg({
            HisRegisterId: this.patientMsg.RegistId,
            HisMedId: item.HisMedId,
            OrderType: item.ItemType,
          });
        }
        data.IsDeleted = false;
        data._edit = false;
        index < 0 && this.newAdviceList.push(data);
        item.Department = item.Department || "";
        this.commonObj.NewDepartmentList = [
          ...new Set([...item.Department.split(","), this.regeisterDepCode]),
        ];
        this.commonObj.ExcuteDepartment =
          this.commonObj.NewDepartmentList[0] || "";
        console.log(this.commonObj, "98888890", this.regeisterDepCode);
        this.isAdd = this.isEdit;
        // FrequencyCode
      } else if (item.ItemType === 7) {
        // 检查医嘱
        this.$Api
          .getParentCode({ code: item.CategoryNo, type: 7 })
          .then(async (list) => {
            if (!this.newAdviceList.length) {
              this.ApplicationFormName = list.Data || "检查申请单";
            }
            let data = index < 0 ? {} : this.newAdviceList[index];
            data.DictItemCode = item.HisMedId;
            data.ItemType = item.OrderItemType;
            data.DictItemName = item.ItemName;
            data.Price = item.Price;
            data["NewDepartmentList"] = item.Department
              ? [...new Set(item.Department.split(","))]
              : [];
            data["ParentCategoryCode"] = item.CategoryNo;
            data.IsDeleted = false;
            data.InsuranceUseFlag = await this.isMedicalInsuranceMsg({
              HisRegisterId: this.patientMsg.RegistId,
              HisMedId: item.HisMedId,
              OrderType: item.ItemType,
            });
            data._edit = false;
            index < 0 && this.newAdviceList.push(data);
            this.commonObj = { ExcuteDepartment: "" };
            this.isAdd = this.isEdit;
          });
      } else if (item.ItemType === 8) {
        // 检验医嘱
        this.$Api
          .getChargeItems({ ClinicItemCode: item.HisMedId })
          .then((res) => {
            if (res.Status) {
              this.$Api
                .getParentCode({ code: item.CategoryNo, type: 8 })
                .then(async (list) => {
                  if (!this.newAdviceList.length) {
                    this.ApplicationFormName = list.Data || "检验申请单";
                  }
                  let arr = res.Data;
                  let data = index < 0 ? {} : this.newAdviceList[index];

                  data.DictItemCode = item.HisMedId;
                  data.ChargeItems = arr;
                  data.CheckedList = [];
                  data.ChildItems = [];
                  data["NewDepartmentList"] = item.Department
                    ? [...new Set(item.Department.split(","))]
                    : [];
                  data["ParentCategoryCode"] = item.CategoryNo;
                  data.CustomizeTestApplyRule = item.CustomizeTestApplyRule
                  arr.forEach((el) => {
                    data.CheckedList.push(el.ChargeItemCode);
                    data.ChildItems.push({
                      DictItemCode: el.ChargeItemCode,
                      DictItemName: el.ChargeItemName,
                      IsDeleted: true,
                    });
                    // data.ChildItems
                  });
                  data.InsuranceUseFlag = await this.isMedicalInsuranceMsg({
                    HisRegisterId: this.patientMsg.RegistId,
                    HisMedId: item.HisMedId,
                    OrderType: item.ItemType,
                  });
                  data.ItemType = item.OrderItemType;
                  data.DictItemName = item.ItemName;
                  data.Attention = "";
                  // let obj = this.specimenOptions[0] || {};
                  let sampleName = "";
                  if (item.PreSampleCode) {
                    for (let j = 0; j < this.specimenOptions.length; j++) {
                      if (
                        item.PreSampleCode[0] ===
                        this.specimenOptions[j].SampleCode
                      ) {
                        sampleName = this.specimenOptions[j].Name;
                      }
                    }
                  }
                  data["SampleCode"] = item.PreSampleCode
                    ? item.PreSampleCode[0]
                    : "";
                  data["SampleName"] = sampleName || "";
                  data.Price = item.Price;
                  data.IsDeleted = false;
                  data._edit = false;
                  index < 0 && this.newAdviceList.push(data);
                  this.commonObj = {
                    ExcuteDepartment: "",
                    IsEmergency:
                      this.testItemCodeList.includes(item.HisMedId) ||
                      this.ApplicationFormName.indexOf("急诊") > -1,
                  };

                  this.isAdd = this.isEdit;
                  this.editIndex = Math.random();
                  console.log(this.editIndex, "this.editIndex", item);
                });
            } else {
              this.$msg.warning(res.Message);
            }
          });
      } else if (item.ItemType === 4) {
        // 用血医嘱
        let data =
          index < 0
            ? {
                BloodFormId: "00000000-0000-0000-0000-000000000000",
                Id: "00000000-0000-0000-0000-000000000000",
              }
            : this.newAdviceList[index];
        // data.OrderContent=item.ItemName
        data.ItemName = item.ItemName;
        data.ItemCode = item.HisMedId;
        data.Unit = item.DrugStoreUnit;
        data.ItemType = item.OrderItemType;
        data.Price = item.Price;
        data.Count = 1;
        data._edit = false;
        data.BloodWay = "";
        if (index < 0 && !this.newAdviceList.length) {
          this.$Api
            .getBloodInfo({
              hisPatientId: this.patientMsg.HISPatientId,
              RecordNumber: this.patientMsg.RecordNumber,
            })
            .then((res) => {
              if (res.Status) {
                this.commonObj = { ...res.Data, ...this.commonObj };
              }
            });
        }
        index < 0 && this.newAdviceList.push(data);
        this.commonObj.ExcuteDepartment = item.Department;
        this.isAdd = this.isEdit;
      } else if (item.ItemType === 15) {
        // 手术申请单
        this.commonObj.OperationName = item.ItemName;
        this.commonObj.OperationCode = item.HisMedId;
        this.isAdd = this.isEdit;
      } else if (item.ItemType === 31) {
        this.isConAdvice = true;
        console.log(item, "item........");
        this.commonObj = {};
        this.commonObj.DictItemCode = item.ClinicItemCode || item.InputCode;
        //  this.commonObj.TypeCode =
        this.isAdd = this.isEdit;
      }
    },
    // 判断护理医嘱是否有等级护理
    hasGradeNursing(arr) {
      for (let i = 0; i < arr.length; i++) {
        const el = arr[i];
        if (
          el.OrderContent &&
          el.OrderContent.substring(el.OrderContent.length - 3) === "级护理"
        )
          return { row: el, index: i };
      }
      return false;
    },
    //  医嘱保存
    async save(submitForm, id) {
      let list = await submitForm();
      let data = JSON.parse(JSON.stringify(list));
      console.log(data, "data");
      if (data) {
        if (id) {
          this.errorAdvice = this.errorAdvice.filter((el) => el !== id);
        }
        let type = this.isEdit ? this.tableRowData.OrderType : this.adviceName;
        if (type === 5) {
          // 护理医嘱-等级护理互斥原则
          let newGradeNursing = this.hasGradeNursing(data.Orders);
          let oldGradeNursing = this.hasGradeNursing(this.saveAdviceList);
          if (
            newGradeNursing &&
            oldGradeNursing &&
            newGradeNursing.row.OrderId !== oldGradeNursing.row.OrderId
          )
            return this.$msg.info(
              "待提交医嘱中已有等级护理，不可再添加等级护理！"
            );
        }
        if (type === 31) {
          let arr = [];
          for (let i = 0; i < data.ConsultationDetails.length; i++) {
            arr.push({
              DepartmentCode: data.ConsultationDetails[i],
            });
          }
          data.ConsultationDetails = arr;
        }
        if (type === 7) {
          data.ApplicationFormName =
            this.ApplicationFormName || data.Details.ApplicationFormName;
          data.ApplicationFormNo = data.Details.ExcuteDepartment;
        }
        if (type === 8) {
          data.forEach((el) => {
            el.ApplicationFormName =
              this.ApplicationFormName ||
              el.TestApplyMainModel.ApplicationFormName;
            el.ApplicationFormNo = el.TestApplyMainModel.ExcuteDepartment;
          });
        }
        if (type == 14) {
          data.doctorOrderMain.HisRegisterId = this.patientMsg.RegistId;
        }
        // 修改or新增
        let api = this.isEdit
          ? this.updateApiName[type]
          : this.saveApiName[type];
        console.log(api, type);
        // return
        this.$Api[api](data).then((res) => {
          this.$msg[res.Status ? "success" : "warning"](res.Message);
          if (res.Status) {
            this.isAdd = true;
            this.newAdviceList = [];
            this.commonObj = {};
            this.isEdit &&
              this.$refs.drops.rowExpansion(this.tableRowData, false);
            this.tableRowData = {};
            this.isEdit = false;
            this.ApplicationFormName = "";
            this.getAdviceList("saveAdviceList");
          }
        });
      }
    },
    // 取消待提交的医嘱
    deleteAdviceList(orderIdList, index) {
      this.$Api
        .deleteAdviceList({
          orderIdList,
          inHouseId: this.$route.query.id || this.patientMsg.InHouseId,
        })
        .then((res) => {
          this.$msg[res.Status ? "success" : "warning"](res.Message);
          if (res.Status) {
            if (!!orderIdList.length) {
              let del = this.saveAdviceList.splice(index, 1)[0];
              this.isEdit =
                del.OrderId === this.tableRowData.OrderId ? false : this.isEdit;
            } else {
              this.isEdit = false;
              this.saveAdviceList = [];
            }
          }
        });
    },
    // 处理护理医嘱-等级护理互斥原则
    gradeNursing() {
      // if (!this.saveList.length) return this.$msg.info("未选择待提交医嘱！");
      if (!this.needSubmitList.length)
        return this.$msg.info("未选择待提交医嘱！");
      // 如果特定类型的检查检验 需要提交用户申报信息
      console.log(this.needSubmitList, "待提交医嘱");
      // return;

      // needSubmitList
      // 提交签
      this.operationType = "submit";
      if (this.isSignName) {
        let submitGradeNursing = this.hasGradeNursing(
          this.doctorAdviceListData.filter(
            (el) => el.OrderType === 5 && el.Status !== 6
          )
        );
        // let saveGradeNursing = this.hasGradeNursing(this.saveList);
        let saveGradeNursing = this.hasGradeNursing(this.needSubmitList);
        let obj = {
          Type: "0",
          Data: [{ Name: "提交医嘱" }],
          No: this.user.UserInfo.No,
          UserName: this.user.UserInfo.Name,
        };
        this.currentObjData = obj;
        // this.$store.commit("public/SET_CACURRENTOBJDATA", this.currentObjData);
        this.$store.commit(
          "public/SET_CAREQUESTLOADING",
          "医嘱正在提交，请稍候"
        );
        this.caSignOperation.KeyVerify();
      } else {
        this.handleOperation();
      }
    },
    handleOperation() {
      // this.$store.commit('public/SET_CAREQUESTLOADING','')
      if (this.operationType == "submit") {
        let submitGradeNursing = this.hasGradeNursing(
          this.doctorAdviceListData.filter(
            (el) => el.OrderType === 5 && el.Status !== 6
          )
        );
        //let saveGradeNursing = this.hasGradeNursing(this.saveList);
        let saveGradeNursing = this.hasGradeNursing(this.needSubmitList);
        if (submitGradeNursing && saveGradeNursing) {
          const h = this.$createElement;
          this.$confirm(
            h("p", null, [
              // h('span', null, '是否更换护理等级 '),
              h(
                "strong",
                { class: submitGradeNursing.row.OrderContent },
                submitGradeNursing.row.OrderContent
              ),
              h("span", { class: "arrows" }, " → "),
              h(
                "strong",
                { class: saveGradeNursing.row.OrderContent },
                saveGradeNursing.row.OrderContent
              ),
            ]),
            "是否更换护理等级？",
            {
              showClose: false,
              customClass: "grade-nursing",
              distinguishCancelAndClose: true,
              confirmButtonText: "确认",
              cancelButtonText: "取消",
            }
          )
            .then(() => {
              this.submitRowData = submitGradeNursing.row;
              this.stopAdviceApi(this.submitRowData);
              this.verifyAdvice();
            })
            .catch((action) => {
              if (action === "cancel") {
                //this.saveList.splice(saveGradeNursing.index, 1);
                this.needSubmitList.splice(saveGradeNursing.index, 1);
                this.deleteAdviceList(
                  [saveGradeNursing.row.OrderId],
                  saveGradeNursing.row._index
                );
                this.verifyAdvice();
              }
            });
        } else {
          this.verifyAdvice();
        }
        console.log(saveGradeNursing, submitGradeNursing);
      } else {
        //  停止药品长期医嘱
        // if (
        //   this.currentRow.EffectiveTime === 2 &&
        //   this.currentRow.OrderType === 14
        // ) {
        //   console.log(this.currentRow);
        //   this.alterData.showAlter = true;
        //   this.alterData.alterType = "promptMessage";
        //   this.alterData.width = "450px";
        //   this.alterData.alterTitle = "该操作将停止该长期医嘱，是否继续？";
        //   return;
        // }
        // if (bl) {
        //   return   this.stopAdviceApi(row)
        // }
        this.$confirm(
          this.currentRow.EffectiveTime === 2
            ? "该操作将停止该长期医嘱，是否继续？"
            : "该操作将作废该临时医嘱，是否继续？",
          "",
          {
            type: "warning",
          }
        )
          .then(() => {
            this.stopAdviceApi(this.currentRow);
          })
          .catch(() => {
            this.$store.commit("public/SET_CAREQUESTLOADING", "");
            this.$msg.info("已取消操作");
          });
      }
    },
    // 医嘱提交验证
    verifyAdvice() {
      //if (!this.saveList.length) return;
      if (!this.needSubmitList.length) {
        this.$store.commit("public/SET_CAREQUESTLOADING", "");
        return;
      }

      if (!this.patientMsg.RegistId) {
        this.$msg.info("该患者无有效挂号，请先挂号！");
        this.$store.commit("public/SET_CAREQUESTLOADING", "");
        if (this.isRegister === "1") {
          let obj = {
            title: "患者挂号",
            width: "800px",
            component: "registrationAlter",
            isShowFooter: true,
            btn: ["挂号", "取消"],
            visible: true,
          };
          this.$store.commit("public/SET_DIALOGDATA", obj);
        }
        return;
      }
      // 新冠肺炎 检查检验申报
      let isFind = false;
      this.needSubmitList.forEach((item) => {
        if (item.OrderDetails) {
          item.OrderDetails.forEach((ii) => {
            if (
              ii.ClinicItemCode &&
              this.needDeclarePatmessage.indexOf(ii.ClinicItemCode) != -1
            ) {
              isFind = true;
              return;
            }
          });
        }
      });
      if (isFind) {
        // 弹窗
        this.alterData.showAlter = true;
        this.alterData.alterType = "declarePatmessage";
        this.alterData.width = "560px";
        this.alterData.alterTitle = "申报用户信息";
        let obj = this.documentCardType.find((item) => {
          return (
            (this.patientMsg.IDTypeName === "身份证" &&
              item.text === "居民身份证") ||
            (this.patientMsg.IDTypeName === "军官证" &&
              item.text === "军人证") ||
            (this.patientMsg.IDTypeName === "护照" && item.text === "护照") ||
            (this.patientMsg.IDTypeName === "其他" && item.text === "其他")
          );
        });
        this.declareMessage = {
          证件类型: (obj && obj.text) || "",
          证件号码: obj && obj.text ? this.patientMsg.IDNumber : "",
          人员来源: "99.其它采样点",
          "人员身份(必填)": "99.其它人群",
          "14天内境外入境(必填)": "否",
        };
      } else {
        this.afterDeclareMessageSubmitAdvice();
      }
    },
    afterDeclareMessageSubmitAdvice() {
      let arr = [];
      let isRationalDrugUse = false;
      console.log(this.needSubmitList, "提交待提交医嘱");
      this.needSubmitList.forEach((item) => {
        if (
          item.OrderType == 14 &&
          !this.userRightList.IsHasPrescriptionRight
        ) {
          this.$store.commit("public/SET_CAREQUESTLOADING", "");
          this.$msg.warning("该账号没有处方权限，药品医嘱不会被提交");
        } else {
          arr.push(item.OrderId);
        }
        if (item.OrderType == 14 && this.userRightList.IsHasPrescriptionRight) {
          isRationalDrugUse = true;
        }
      });
      if (!arr.length) {
        this.$store.commit("public/SET_CAREQUESTLOADING", "");
        this.$msg.warning("没有符合要求的可提交的医嘱");
        return;
      }
      this.submitOrderIds = arr;
      isRationalDrugUse
        ? this.rationalDrugUse.hisScreenData()
        : this.submitAdvice();
    },
    // 医嘱提交
    async submitAdvice(arr = this.submitOrderIds) {
      console.log(this.declareMessage, "申报基本信息");
      try {
        this.$store.commit(
          "public/SET_CAREQUESTLOADING",
          "医嘱正在提交，请稍候"
        );
        let list = this.needSubmitList.filter((item) =>
          arr.includes(item.OrderId)
        );
        let isPassIMIS = await this.$IMIS.submmitOrderIMIS(
          list,
          this.patientMsg
        );
        if (!isPassIMIS)
          return this.$store.commit("public/SET_CAREQUESTLOADING", "");
      } catch (error) {}
      let adviceObj = {};
      let adviceDeclareMessage = {};
      let len = 0;
      // 医嘱分类提交
      this.submitOrderIds.forEach((id) => {
        this.needSubmitList.forEach((item) => {
          if (item.OrderId === id) {
            let name = this.getAdviceName(item.OrderClassificationWord);
            if (adviceObj[name]) {
              adviceObj[name].push(id);
            } else {
              adviceObj[name] = [id];
              len++;
            }
            if (item.OrderDetails) {
              item.OrderDetails.forEach((ii) => {
                if (
                  ii.ClinicItemCode &&
                  this.needDeclarePatmessage.indexOf(ii.ClinicItemCode) != -1
                ) {
                  adviceDeclareMessage[name] = true;
                }
              });
            }
          }
        });
      });
      let count = 0;
      let errorMessage = {};
      let errorAdvice = [];
      let printObj = {
        PrescriptionInfo: [],
        OrderInfos: [],
        IsHasSpecial: false,
      };
      for (let key in adviceObj) {
        const list = adviceObj[key];
        let isNeedDeclare = adviceDeclareMessage[key];
        let declareParams = [];
        if (isNeedDeclare) {
          for (key in this.declareMessage) {
            let obj = {
              Caption: key,
              CaptionValue: this.declareMessage[key],
            };
            declareParams.push(obj);
          }
        }
        console.log(declareParams, "新增提交参数", key);

        this.$Api
          .submitAdvice({
            InHouseId: this.$route.query.id || this.patientMsg.InHouseId,
            OrderList: list,
            HisRegisterId: this.patientMsg.RegistId,
            CASignImg: this.caImgData,
            RegisterInfoList: declareParams,
          })
          .then((res) => {
            count++;
            if (res.Status) {
              this.$store.commit("public/SET_CAREQUESTLOADING", "");
              let successObj = res.Data || {};
              successObj.OrderInfos &&
                printObj.OrderInfos.push(...successObj.OrderInfos);
              successObj.PrescriptionInfo &&
                (key === "药品医嘱"
                  ? printObj.PrescriptionInfo.unshift(
                      ...successObj.PrescriptionInfo
                    )
                  : printObj.PrescriptionInfo.push(
                      ...successObj.PrescriptionInfo
                    ));
              printObj.IsHasSpecial = printObj.IsHasSpecial
                ? printObj.IsHasSpecial
                : successObj.IsHasSpecial;
            } else {
              let errorList = res.Data || [];
              errorAdvice.push(...errorList);
              errorMessage[res.Message] = errorMessage[res.Message]
                ? errorMessage[res.Message] + `、${key}`
                : key;
            }
            if (count === len)
              this.processingData(errorMessage, errorAdvice, printObj, list);
          })
          .catch((error) => {
            this.$store.commit("public/SET_CAREQUESTLOADING", "");
            count++;
            errorMessage["请求超时"] = errorMessage["请求超时"]
              ? errorMessage["请求超时"] + `、${key}`
              : key;
            if (count === len)
              this.processingData(errorMessage, errorAdvice, printObj, list);
            console.log(error, "error");
          });
      }
    },
    // 展示特殊药品
    showSpecialDrugDialog(params, enable = true) {
      this.alterData.showAlter = true;
      this.alterData.alterType = "specialDrug";
      this.alterData.width = "1166px";
      this.alterData.alterTitle = "特殊药品使用患者登记";
      if (!enable) {
        this.specialDrugBtns = ["修改", "关闭"];
        this.specialDrugEnable = enable;
      } else {
        this.specialDrugBtns = [];
      }
      this.getSpecicalDrugMessage(params);
    },
    // 获取特殊药品相关信息
    getSpecicalDrugMessage(params) {
      this.$Api.getSpecialDrugMessage(params).then((res) => {
        if (res.Status) {
          this.specialDrugMessage = res.Data;
        }
      });
    },
    //  医嘱取消
    cancel(type) {
      console.log(this.ApplicationFormName, "11");
      this.ApplicationFormName = "";
      this.$confirm(cancelMsg[type], "", {
        type: "warning",
      })
        .then(() => {
          // 取消新增医嘱
          if (type === "add") {
            this.isAdd = true;
            this.newAdviceList = [];
            this.commonObj = {};
            // 取消修改医嘱
          } else if (type === "change") {
            // this.isEdit=false
            this.$refs.drops.rowExpansion(this.tableRowData, false);
            this.$nextTick(() => {
              this.isEdit = false;
              this.tableRowData._isEdit = false;
              this.newAdviceList = [];
              this.commonObj = {};
            });
            // 取消提交
          } else {
            this.deleteAdviceList([]);
          }
          // this.tableData.splice(index, 1);
          console.log(11);
          // this.$msg.success("取消新增记录成功");
        })
        .catch(() => {
          this.$msg.info("已取消操作");
        });
    },
    // 滚动事件监听
    scroll(el) {
      this.$refs.contextmenu && this.$refs.contextmenu.closeMenu();
      let target = el.target;
      if (target.scrollTop < 100) {
        this.isTop = true;
      } else {
        this.isTop = false;
      }
    },
    // 返回顶部/滚动到底部
    goBack(bl, num) {
      let dom = this.$refs.adviceMain;
      let maxH = this.$refs.adviceWarp.clientHeight;
      let clientH = dom.clientHeight;
      let scrollTop = this.scrollTop || dom.scrollTop;
      let target = bl ? maxH - clientH : 0;
      console.log(maxH, clientH, scrollTop, this.toTop - 160, "dddddda");
      if (num) {
        // s = 5;
        if (num === 1) {
          // console.log(this.toTop ,9);
          target = Math.ceil(this.toTop) - 160 + scrollTop;
        }
      }
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        let step = (target - scrollTop) / 10;
        // 如果大于0向上取整小于0向下取整
        step = step > 0 ? Math.ceil(step) : Math.floor(step);
        // leader发生改变
        // console.log(step);
        // this.$msg.warning(step)
        scrollTop = scrollTop + step;
        if (Math.abs(scrollTop - target) <= 1) {
          scrollTop = target;
        }
        dom.scrollTop = scrollTop;
        if (scrollTop == target) {
          clearInterval(this.timer);
        }
      }, 30);
    },
    // 医嘱关联费用
    associatedCost(row) {
      console.log(row, "row");
      this.index = row._index;
      this.alterData.showAlter = true;
      this.alterData.alterType = "alterConsumables";
      this.alterData.width = "1000px";
      this.alterData.alterTitle = "关联费用";
      let data = row.DoctorOrderAdviceItems || [];
      this.alterData.childData = JSON.parse(JSON.stringify(data));
      this.alterData.DoctorOrderId = row.OrderId;
    },
    // 重置医嘱提交错误时的医嘱状态
    refreshOrderStatus() {
      this.$Api
        .refreshOrderStatus({
          inHospitalId: this.$route.query.id || this.patientMsg.InHouseId,
        })
        .then((res) => {
          this.getAdviceList("doctorAdviceListData");
          this.getAdviceList("saveAdviceList");
          this.$store.commit("public/SET_CAREQUESTLOADING", "");
        });
    },
    // 处理医嘱提交后的数据
    processingData(errorMessage, errorAdvice, printObj, arr) {
      console.log(errorMessage, errorAdvice, printObj);
      let messageArr = [];
      for (const key in errorMessage) {
        messageArr.push(errorMessage[key] + key);
      }
      this.errorAdvice = errorAdvice;
      if (messageArr.length) {
        this.$msg.warning(messageArr.join(), 3000);
        this.refreshOrderStatus();
      } else {
        this.$store.commit("public/SET_CAREQUESTLOADING", "");

        this.$msg.success("医嘱提交成功");
        this.getAdviceList("doctorAdviceListData");
        this.getAdviceList("saveAdviceList");
      }
      let preNumStr = "";
      let ordinaryStr = "";
      let orderIds = "";
      let objectTypes = "";
      let templateIds = "";
      // 处方、治疗、输液单
      printObj.PrescriptionInfo.forEach((item) => {
        if (item.TemplateName == "Ordinary") {
          if (item.IsPrint) {
            ordinaryStr += item.PrescriptionMasterNo + ",";
            objectTypes += printObjectType["prescription"].objectType + ",";
            templateIds += printObjectType["prescription"].templateId + ",";
          }
        } else if (item.TemplateName == "Treatment") {
          if (item.IsPrint) {
            ordinaryStr += item.PrescriptionMasterNo + ",";
            objectTypes +=
              printObjectType["treatDoctorAdvice"].objectType + ",";
            templateIds +=
              printObjectType["treatDoctorAdvice"].templateId + ",";
          }
        } else if (item.TemplateName == "CheckLargeEquipment") {
          if (item.IsPrint) {
            ordinaryStr += item.PrescriptionMasterNo + ",";
            objectTypes +=
              printObjectType["CheckLargeEquipment"].objectType + ",";
            templateIds +=
              printObjectType["CheckLargeEquipment"].templateId + ",";
          }
        } else {
          preNumStr += item.PrescriptionMasterNo + ",";
        }
      });
      orderIds += ordinaryStr;
      let ordLisdt = "";
      printObj.PrescriptionInfo.forEach((item) => {
        if (recipeTemp.includes(item.TemplateName) && item.IsPrint) {
          ordLisdt += item.PrescriptionMasterNo + "*";
        }
      });
      if (ordLisdt) {
        objectTypes += printObjectType["infusionOrder"].objectType + ",";
        templateIds += printObjectType["infusionOrder"].templateId + ",";
        ordLisdt = ordLisdt.substring(0, ordLisdt.length - 1) + ",";
        orderIds += ordLisdt;
      }
      // 检查检验手术用血
      if (printObj.OrderInfos.length) {
        printObj.OrderInfos.forEach((item) => {
          if (item.OrderType == 4) {
            // 用血
            orderIds += item.OrderIds.join(",") + ",";
            for (let i = 0; i < item.OrderIds.length; i++) {
              objectTypes += printObjectType["blood"].objectType + ",";
              templateIds += printObjectType["blood"].templateId + ",";
            }
          } else if (item.OrderType == 15) {
            // 手术
            orderIds += item.OrderIds.join(",") + ",";
            for (let i = 0; i < item.OrderIds.length; i++) {
              objectTypes += printObjectType["operation"].objectType + ",";
              templateIds += printObjectType["operation"].templateId + ",";
            }
          } else if (item.OrderType == 7) {
            // 检查
            orderIds += item.OrderIds.join(",") + ",";
            for (let i = 0; i < item.OrderIds.length; i++) {
              objectTypes += printObjectType["examine"].objectType + ",";
              templateIds += printObjectType["examine"].templateId + ",";
            }
          } else if (item.OrderType == 8) {
            // 检验
            if (item.OrderIds.length == 0) {
              return;
            }
            orderIds += item.OrderIds.join(",") + ",";
            for (let i = 0; i < item.OrderIds.length; i++) {
              objectTypes += printObjectType["checkout"].objectType + ",";
              templateIds += printObjectType["checkout"].templateId + ",";
            }
          } else {
            // orderIds += item.OrderIds.join("*") + ",";
            // // for (let i = 0; i < item.OrderIds.length; i++) {
            // objectTypes += printObjectType["treatDoctorAdvice"].objectType + ",";
            // templateIds += printObjectType["treatDoctorAdvice"].templateId + ",";
            // }
          }
        });
      }

      this.publicUrl = "";
      if (orderIds != "") {
        clearTimeout(this.timer);
        let t = new Date().getTime();
        // let str =
        //   window.location.protocol + "\\" + window.location.host;
        let url = `${URLCONFIG.Emr}/Nursing/EditPage.aspx?patientId=${
          this.patientMsg.PatientId
        }&inHouseId=${this.patientMsg.InHouseId}&areaType=${
          this.patientMsg.AreaType
        }&createUser=940c7df7-a718-e911-80cd-0050568e1b08&objectType=${
          printObjectType.specialDrugBatch.objectType
        }&logUserEditTrack=true&documentId=f2f201db-3ca2-47b0-ba81-ab6b0096abd6&mark=true&templateId=C16DA3C4-D502-4082-AEC8-AB7C00F17C78&ids=${orderIds.slice(
          0,
          orderIds.length - 1
        )}&ObjectTypes=${objectTypes.slice(
          0,
          objectTypes.length - 1
        )}&TemplateIds=${templateIds.slice(
          0,
          templateIds.length - 1
        )}&ismult=true&areaId=${this.patientMsg.AreaId}&t=${t}`;
        console.log(url);
        if (printObj.IsHasSpecial) {
          this.publicUrl = url;
        } else {
          this.$store.commit("public/SET_PRINTIFRAMEURL", url);
        }
      }
      // 特殊药品登记弹窗
      if (printObj.IsHasSpecial) {
        let params = {
          PrescriptionNumber: preNumStr,
          OrderIds: arr,
        };
        this.showSpecialDrugDialog(params);
      }
    },
    // 获取医嘱大类名称
    getAdviceName(word) {
      let str = "";
      this.typeList.forEach((el) => {
        if (el.Word === word) {
          str = el.Name;
        }
      });
      return str;
    },
  },
};
</script>
<style scoped lang='less'>
.openDoctorAdvice {
  padding: 0 19px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  position: relative;
  .history {
    position: absolute;
    top: 0;
    width: 0;
    height: 0;
    z-index: 111;
    left: 0px;
  }
  .button-list {
    height: 32px;
    padding: 10px 0;
    position: relative;

    /deep/.el-dropdown {
      float: right;
    }
    .back-top-warp {
      position: absolute;
      width: 350px;
      height: 42px;
      top: 0;
      left: 50%;
      margin-left: -175px;
      cursor: pointer;
      .back-top {
        position: absolute;
        display: none;
        width: 50px;
        height: 25px;
        border-radius: 0 0 25px 25px;
        color: rgba(0, 113, 231, 0.7);
        font-size: 18px;
        text-align: center;
        box-shadow: 0 4px 4px 2px rgba(117, 165, 217, 0.9);
        top: 0;
        left: 50%;
        margin-left: -25px;
        .back {
          vertical-align: 0em;
          transform: rotate(180deg);
          &.top {
            transform: rotate(0deg);
          }
        }
      }
      &:hover .back-top {
        display: inline-block;
      }
    }
    .right {
      color: rgba(0, 113, 231, 0.7);
      float: right;
      font-size: 20px;
      cursor: pointer;
      padding: 6px 0 0 15px;
      &.ziliaodan {
        font-size: 24px;
        padding: 5px 0 0 15px;
      }
    }
    &.disabedBtn {
      .button,
      .right {
        cursor: not-allowed;
        color: rgba(0, 113, 231, 0.5);
      }
    }
  }
  .table-header {
    position: relative;
    .select-all {
      position: absolute;
      top: 9px;
      left: 10px;
      z-index: 100;
    }
  }
  .open-doctor-advice-main {
    box-sizing: border-box;
    width: 100%;
    height: calc(~"(100% - 118px)");
    overflow: auto;
    .save-list {
      background: #ffffff;
      border: 1px solid #0071e7;
      box-shadow: 0 1px 4px 2px rgba(165, 189, 247, 0.8);
      &.isEdit {
        border-color: rgba(190, 190, 190, 0.8);
        box-shadow: 0 0 4px 2px rgba(190, 190, 190, 0.8);
        /deep/ .delete.no {
          cursor: not-allowed;
          color: rgba(0, 113, 231, 0.5);
        }
      }
    }
  }
  .advice-content {
    box-sizing: border-box;
    padding: 10px 0;
    h2 {
      font-size: 14px;
      color: #000622;
      padding: 15px 0;
      font-weight: 700;
    }
  }
  .advice-button {
    height: 32px;
    padding: 20px 0;
    background: #fff;
    text-align: center;
    .el-button {
      // float: right;
      display: inline-block;
      margin: 0 15px;
      padding: 9px 30px;
    }
    .el-button.el-button--primary.el-button--small.is-plain {
      background: #f3f5f9;
      border: 1px solid #c0cbe9;
      border-radius: 2px;
      color: #000622;
    }
  }
}
</style>
<style lang="less">
.prompt_message_style {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -150px;
  margin-top: -70px;
}
.openDoctorAdvice {
  .el-select,
  .el-date-editor,
  .el-input,
  .el-input-number {
    .el-input__inner {
      background: @controlBg;
      border: none;
    }
    .el-input-number__increase,
    .el-input-number__decrease {
      width: 20px;
    }
  }
}
.prompt-message {
  height: 188px;
  p {
    padding: 10px 19px;
  }
  .el-input-number {
    .el-input__inner {
      background: @controlBg;
      border: none;
    }
    .el-input-number__increase,
    .el-input-number__decrease {
      width: 20px;
    }
  }
  &-count.el-form-item--small.el-form-item {
    margin-bottom: 35px;
  }
  &-button {
    box-shadow: 0 -2px 7px 0 rgba(102, 136, 169, 0.16);
    padding-top: 18px;
    .el-button {
      float: right;
    }
  }
}
.prescription-warp.el-popover {
  transition: all 0.3s cubic-bezier(0.65, 0.05, 0.36, 1);
  width: calc(100vw - 145px);
  height: calc(100vh - 71px);
  background: #fff;
  border-right: 10px solid #dfe7f5;
  box-sizing: border-box;
  top: 69px !important;
  left: 145px !important;
  margin-top: 0;
  box-shadow: none;
  padding: 0;
  &.w64 {
    width: calc(100vw - 74px);
    left: 74px !important;
  }
}
.grade-nursing.el-message-box
  .el-message-box__content
  .el-message-box__message {
  float: none;
  text-align: center;
  .arrows {
    padding: 0 15px;
  }
  > p {
    font-size: 20px;
    font-weight: bold;
    .特级护理 {
      color: #ef4747;
    }
    .一级护理 {
      color: #efc847;
    }
    .二级护理 {
      color: #f4bf16;
    }
    .三级护理 {
      color: #15c132;
    }
  }
}

@import url("../../components/doctorAdvice/openDoctorAdvice/adviceStyle.less");
</style>