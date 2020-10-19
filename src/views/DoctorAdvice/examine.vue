<template>
  <div class="examine" ref="examine">
    <div class="tabs-temp">
      <el-radio-group v-model="nowTemp" @change="tapsExamine" fill="#0071e7">
        <el-radio-button
          :label="item.Value"
          v-for="(item, index) in tabsTemp"
          v-if="item.Show"
          :key="index"
          >{{ item.Text }}</el-radio-button
        >
      </el-radio-group>
    </div>
    <div class="content">
      <div class="newCreateExamine" v-show="nowTemp === 'newCreateExamine'">
        <div class="left" ref="treeLeft" :style="{ width: leftWidth + 'px' }">
          <div style="min-width: 200px; height: 100%">
            <myTabs
              :activeName.sync="selectData"
              :tabsList="tabsList"
              :width="66.6"
              :tabChange="tabChange"
            ></myTabs>
            <div class="package-search">
              <el-input
                placeholder="请输入内容"
                v-model.trim="treeName"
                suffix-icon="el-icon-search"
                @input="searchList"
                @keyup.enter.native="getMenu"
              ></el-input>
            </div>
            <treeTable
              v-show="selectData == 1"
              ref="treeList"
              :data="treeData"
              defaultChildren="ChildCategory"
              :selectCallback="selectPackage"
              :defaultExpandAll="isExpand"
            >
            </treeTable>
            <!-- <medicalNowTree
            v-show="selectData==1"
            ref="treeList"
            :default-expanded-keys="defaultExpanded[selectData]"
            :callBack="selectOrderPackage"
            :selectCallback="selectPackage"
            :treeData="treeData"
            key="1"
            children="List"
            type="examine"
            :isHig="false"
            check-on-click-node
            show-checkbox
            check-strictly
          ></medicalNowTree> -->
            <medicalNowTree
              v-show="selectData == 2"
              ref="orderPackage"
              :default-expanded-keys="defaultExpanded[selectData]"
              :callBack="selectOrderPackage"
              :selectCallback="selectPackage"
              :treeData="depTreeData"
              key="2"
              children="List"
              type="package"
              :isHig="false"
              check-on-click-node
              check-strictly
              show-checkbox
            ></medicalNowTree>
            <medicalNowTree
              v-show="selectData == 3"
              ref="orderPackage"
              :default-expanded-keys="defaultExpanded[selectData]"
              :callBack="selectOrderPackage"
              :selectCallback="selectPackage"
              :treeData="personTreeData"
              key="3"
              children="List"
              type="package"
              :isHig="false"
              check-on-click-node
              show-checkbox
              check-strictly
            ></medicalNowTree>
            <!-- <medicalNowTree
            v-else
            ref="orderPackage1"
            key="2"
            :default-expanded-keys="defaultExpanded[selectData]"
            :callBack="selectOrderPackage"
            :treeData="treeData"
            children="List"
            type="orderPackage"
          ></medicalNowTree>-->
          </div>
        </div>
        <div class="resizeLine" ref="resizeLine"></div>
        <div class="right" ref="treeRight">
          <start-request
            title="常用检查项目"
            :usedCheckData="usedCheckData"
            :callback="usedSelect"
          ></start-request>
          <div class="right-tabs">
            <el-radio-group
              v-model="tablsId"
              fill="#0071e7"
              @change="tablsChange"
            >
              <el-radio-button
                :label="item.Id"
                v-for="(item, index) in tabls"
                :key="index"
              >
                <!-- <span v-if="item.isOrder" class="list">套</span> -->
                {{ item.Name }}
                <span
                  class="el-icon-close close"
                  v-if="index != 0 && tablsId == item.Id"
                  @click.stop="delItem(item, index)"
                ></span>
              </el-radio-button>
            </el-radio-group>
          </div>
          <inspectDoctorAdvice
            ref="inspect"
            :tableData="item.Items"
            :commonObj="item.Details"
            @changrequestId="changrequestId($event, item)"
            class="inspect"
            v-for="(item, index) in tabls"
            :key="index"
            v-show="tablsId == item.Id"
            :callback="delRow"
          >
            <searchDoctorAdvice
              slot="change"
              slot-scope="{ index, itemName, departmentCode, categoryNo }"
              :categoryNo="categoryNo"
              :adviceName="7"
              :index="index"
              :departmentCode="departmentCode"
              :itemName="itemName"
              :callBack="add"
            ></searchDoctorAdvice>
            <searchDoctorAdvice
              slot-scope="{ departmentCode, categoryNo }"
              :categoryNo="categoryNo"
              :departmentCode="departmentCode"
              slot="search"
              :adviceName="7"
              :callBack="add"
            ></searchDoctorAdvice>
            <p class="advice-button" slot-scope="{ submitForm }">
              <el-button plain @click="cancel('add')" class="reset"
                >取消</el-button
              >
              <el-button @click="save(submitForm)" class="save">保存</el-button>
            </p>
          </inspectDoctorAdvice>
        </div>
      </div>
      <div class="historyExamine" v-show="nowTemp === 'historyExamine'">
        <div class="left">
          <history-list
            :historyListData="historyListData"
            :callback="historyCall"
            ref="historyList"
          ></history-list>
        </div>
        <div class="right">
          <examin-table :tableData="tableData" :callback="selectRow">
            <template slot-scope="{ scope }" slot="dd">
              <div class="dd-box">
                <el-tooltip effect="dark" content="引用" placement="top-start">
                  <svg-icon
                    iconClass="quote"
                    class="styleIcon"
                    @click.stop="showTable(scope.row)"
                    v-if="patientMsg.Status != 8"
                  ></svg-icon>
                </el-tooltip>
                <el-tooltip
                  effect="dark"
                  content="打印"
                  placement="top-start"
                  v-if="scope.row.Status !== 1 && scope.row.Status !== 7"
                >
                  <svg-icon
                    iconClass="printlist"
                    class="styleIcon"
                    @click.stop="print(scope.row)"
                  ></svg-icon>
                </el-tooltip>
                <!-- <el-tooltip effect="dark" content="查看报告" placement="top-start">
                  <svg-icon
                    iconClass="viewreport"
                    class="styleIcon"
                    @click.stop="lookReport(scope.row)"
                  ></svg-icon>
                </el-tooltip>-->
              </div>
            </template>
          </examin-table>
        </div>
      </div>
      <my-alert
        :visible="isShow"
        title="检查申请单详请"
        :callback="alterCallback"
        :isfooter="false"
        width="1200px"
      >
        <div class="alter-content">
          <component
            :is="'examinDetail'"
            :deatilData="saveSuccessData"
          ></component>
        </div>

        <!-- <templatename="footer"></template> -->
        <div class="btnList" v-if="isFooter && patientMsg.Status != 8">
          <el-button class="save" @click="submitData">提交</el-button>
          <el-button class="reset-list" @click="upData">修改</el-button>
        </div>
      </my-alert>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
// import requestTree from "../../components/doctorAdvice/requestCommon/requestTree";
import startRequest from "../../components/doctorAdvice/requestCommon/startRequest";
import inspectDoctorAdvice from "../../components/doctorAdvice/openDoctorAdvice/inspectDoctorAdvice";
import searchDoctorAdvice from "../../components/doctorAdvice/openDoctorAdvice/searchDoctorAdvice";
import historyList from "../../components/doctorAdvice/requestCommon/historyList";
import {
  numTostr,
  severalGroups,
  debouce,
  GetFormatDateTime,
} from "../../utils/public";
import myAlert from "@/components/common/myAlter";
import examinTable from "../../components/doctorAdvice/examine/examinTable";
import examinDetail from "../../components/doctorAdvice/examine/examinDetail";
import myTabs from "../../components/common/my-tabs.vue";
import medicalNowTree from "../../components/doctorAdvice/medicalHistory/medicalNowTree.vue";
import { inspectTree } from "../../module/staticData";
import { printObjectType } from "@/module/staticData.js";
import CASign from "@/utils/caSign.js";
import treeTable from "../../components/common/treeTable.vue";
import { getLocalStorage, setLocalStorage } from "@/utils/localstorage";
export default {
  name: "examine", //检查申请单
  data() {
    this.num = 0;
    return {
      treeData: [], //检查的数据
      depTreeData: [], //科室数据
      personTreeData: [], //个人的树结构
      defaultExpanded: {
        1: [1],
        2: [1],
        3: [1],
      }, //默认选中项
      usedCheckData: [], //常用项目的列表数据
      selectData: 1, //切换科室的个人的项目
      treeName: "", //搜索树结构的名称
      tabsList: [
        {
          label: "检查",
          value: 1,
        },
        {
          label: "科室",
          value: 2,
        },
        {
          label: "个人",
          value: 3,
        },
      ], //树结构头部切换的数据
      tablsId: -1, //申请单选中的id
      tabls: [
        {
          Items: [],
          Details: {},
          Name: "申请单一",
          Id: -1,
          isOrder: false,
          requestId: "",
          guId: "",
        },
      ], //申请单列表数据
      nowTemp: "newCreateExamine", //切换后现在的组件,
      tabsTemp: [
        {
          Text: "新建检查",
          Value: "newCreateExamine",
          Show: true,
        },
        {
          Text: "检查记录",
          Value: "historyExamine",
          Show: true,
        },
      ], //切换新建检查和检查记录的数据存储
      historyListData: [], //历史列表数据
      oldData: [], //为申请提交的数据
      tableData: [], //表格数据
      saveSuccessData: [],
      tabsIndex: 0,
      isFooter: true,
      treeType: "examine",
      oneTabs: {},
      timer: null,
      departmentCodeList: [],
      caSignOperation: {}, //
      currentObjData: "",
      leftWidth: 200,
    };
  },
  watch: {
    "patientMsg.Status": {
      handler(val) {
        if (val === 8) {
          this.tabsTemp[0].Show = false;
          this.nowTemp = "historyExamine";
          this.$Api
            .getCheckHistory({ patientId: this.patientMsg.PatientId })
            .then((res) => {
              if (res.Status) {
                this.historyListData = res.Data || [];
                console.log(res);
                this.$nextTick(() => {
                  if (this.historyListData.length > 0) {
                    this.$refs.historyList.selectId = this.historyListData[0].InHospitalId;
                    this.historyListData[0] &&
                      this.getCheckTableData(
                        this.historyListData[0].InHospitalId
                      );
                  }
                });
              }
            });
        } else {
          this.tabsTemp[0].Show = true;
          this.nowTemp = "newCreateExamine";
        }
      },
      deep: true,
      immediate: true,
    },
    isGetCA: function (val) {
      if (val) {
        // 验证
        if (
          this.currentObjData.Data &&
          this.currentObjData.Data[0].Name == "检查申请"
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
            confirmButtonText: "确定",
            cancelButtonText: "取消",
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
    changrequestId(val, item) {
      console.log(item, val, "111");
      item.requestId = val;
      console.log(this.tabls);
    },
    tabChange(val) {},
    //获取科室的树结构
    getOrderPackageDepartment() {
      this.$Api
        .getOrderPackageDepartment({
          keyWord: this.treeName ? this.treeName : null,
          diagnosisKeyWord: this.patientMsg.Diagnosis
            ? this.patientMsg.Diagnosis
            : null,
          symptomKeyWord: this.patientMsg.Symptom
            ? this.patientMsg.Symptom
            : null,
          orderType: 7,
        })
        .then((res) => {
          if (res.Status) {
            this.depTreeData = res.Data || [];
          } else {
            this.depTreeData = [];
          }
        });
    },
    //获取个人的树结构
    getOrderPackagePersonl() {
      this.$Api
        .getOrderPackagePersonl({
          keyWord: this.treeName ? this.treeName : null,
          orderType: 7,
        })
        .then((res) => {
          if (res.Status) {
            this.personTreeData = res.Data || [];
          } else {
            this.personTreeData = [];
          }
        });
    },
    // 选择树状子节点套餐
    selectOrderPackage(row, type, patientKey) {
      // if (!data.hasOwnProperty("detailInfoList")) {
      // 叶子节点
      this.defaultExpanded[this.selectData] = [patientKey];
      console.log(row, type, patientKey, "patientKey");
    },
    //勾选中的回调
    selectPackage(bl, row) {
      console.log("data", bl, row);
      if (this.selectData == 1) {
        if (row.ItemCode && bl) {
          this.$Api
            .postUsedDeatil({
              CategoryCode: row.ParentCode,
              SearchType: 7,
              KeyWord: "",
              DeptCode: "",
              DictItemCode: row.ItemCode,
              HisRegisterId: this.patientMsg.RegistId,
            })
            .then((res) => {
              console.log(res, "selectData");
              if (res.Status && res.Data) {
                console.log(res.Data, "111");
                res.Data.Check[0] &&
                  this.addData(res.Data.Check[0], -1, "", row);
              }
            });
        } else {
          console.log(this.tabls, bl, "bl");
          this.tabls.forEach((data) => {
            data.Items.forEach((item, index) => {
              if (item.DictItemCode === row.ItemCode && !data.isOrder) {
                data.Items.splice(index, 1);
                this.tablsId = data.Id;
              }
            });
          });
          let off = false;
          for (let i = 0; i < this.tabls.length; i++) {
            if (this.tabls.length > 1 && this.tabls[i].Items.length == 0) {
              this.tabls.splice(i, 1);
              i--;
              off = true;
            }
          }
          if (off) {
            this.tablsId = this.tabls[this.tabls.length - 1].Id;
            // for (let i = 0; i < this.tabls.length; i++) {
            //   this.tabls[i].Name = "申请单" + numTostr(i + 1);
            // }
          }
          if (this.tabls.length == 1 && this.tabls[0].Items.length === 0) {
            this.tabls = [
              {
                Items: [],
                Details: {},
                Name: "申请单一",
                Id: -1,
                isOrder: false,
                guId: "",
              },
            ];
            this.tablsId = -1;
          }
          this.clearData();
        }
      } else {
        if (bl) {
          console.log(row, "row");
          let params = {
            PackageId: row.Id,
            OrderType: 7,
          };
          this.$Api.getSetMealDeatil(params).then((res) => {
            if (res.Status) {
              let data = res.Data || [];
              let listData = [];
              for (let i = 0; i < data.length; i++) {
                listData.push({
                  Items: data[i].OrderDetails,
                  Details: {
                    ExcuteDepartment: data[i].CheckFormModel.ExcuteDepartment,
                    Attention: data[i].CheckFormModel.Attention,
                    ContrastAgent: data[i].CheckFormModel.ContrastAgent,
                    DiagnosisAreaType: data[i].CheckFormModel.DiagnosisAreaType,
                    EffectiveTime: data[i].CheckFormModel.EffectiveTime,
                    IsAdditional: data[i].CheckFormModel.IsAdditional,
                    IsBed: data[i].CheckFormModel.IsBed,
                    IsEmergency: data[i].CheckFormModel.IsEmergency,
                    Medium: data[i].CheckFormModel.Medium,
                    OrderType: 7,
                    Remark: data[i].CheckFormModel.Remark,
                    Target: data[i].CheckFormModel.Target,
                  },
                  Name: data[i].CheckFormModel.ApplicationFormName,
                  Id: this.num++,
                  isOrder: true,
                  guId: row.Id,
                });
              }
              if (this.tabls[0].Id == -1) {
                this.tabls = listData;
                console.log(11111);
              } else {
                this.tabls.push(...listData);
              }
              // this.tabls.push(...listData);
              // console.log("this.tabls",this.tabls)
              // for (let i = 0; i < this.tabls.length; i++) {
              //   this.tabls[i].Name = "申请单" + numTostr(i + 1);
              // }
              this.tablsId = this.tabls[this.tabls.length - 1].Id;
              this.oneTabs = this.tabls[this.tabls.length - 1];
              console.log("this.oneTabs", this.oneTabs);
            }
          });
        } else {
          console.log("this.tabls", this.tabls);
          for (let i = 0; i < this.tabls.length; i++) {
            if (this.tabls[i].guId == row.Id && this.tabls[i].isOrder) {
              console.log("this.tabls", this.tabls);
              this.tabls.splice(i, 1);
              i--;
            }
          }
          if (this.tabls.length == 0) {
            this.tabls = [
              {
                Items: [],
                Details: {},
                Name: "申请单一",
                Id: -1,
                isOrder: false,
                guId: "",
              },
            ];
            this.tablsId = this.tabls[0].Id;
            this.oneTabs = this.tabls[0];
          } else {
            // for (let i = 0; i < this.tabls.length; i++) {
            //   this.tabls[i].Name = "申请单" + numTostr(i + 1);
            // }
            this.tablsId = this.tabls[this.tabls.length - 1].Id;
            this.oneTabs = this.tabls[this.tabls.length - 1];
            console.log("this.oneTabs", this.oneTabs);
          }
        }
        this.clearData();
      }
    },
    // 搜索
    getMenu() {
      if (this.selectData == 1) {
        this.getCheckTreeData();
      } else if (this.selectData == 2) {
        this.getOrderPackageDepartment();
      } else if (this.selectData == 3) {
        this.getOrderPackagePersonl();
      }
    },
    //清空数据
    clearData() {
      if (this.tabls.length <= 1) {
        console.log("this", this.tabls);
        if (
          this.tabls[0] &&
          this.tabls[0].Items &&
          this.tabls[0].Items.length == 0
        ) {
          console.log(11111, this.tabls[0]);
          this.tabls = [];
          this.$nextTick(() => {
            this.tabls = [
              {
                Items: [],
                Details: {},
                Name: "申请单一",
                Id: -1,
                isOredr: false,
                guId: "",
              },
            ];
            this.tablsId = -1;
          });
        }
      }
    },
    //切换新建检查和检查记录的数据组件函数
    tapsExamine(val) {
      this.cancel();
      if (val === "historyExamine") {
        this.$Api
          .getCheckHistory({ patientId: this.patientMsg.PatientId })
          .then((res) => {
            if (res.Status) {
              this.historyListData = res.Data || [];
              console.log(res);
              this.$nextTick(() => {
                if (this.historyListData.length > 0) {
                  this.$refs.historyList.selectId = this.historyListData[0].InHospitalId;
                  this.historyListData[0] &&
                    this.getCheckTableData(
                      this.historyListData[0].InHospitalId
                    );
                }
              });
            }
          });
      }
    },
    //新增检查套餐
    add(val, index) {
      console.log(val);
      this.addData(val, index, "input");
    },
    //保存所有的检查申请单
    async save(fun) {
      // let data = await fun();
      this.isFooter = true;
      let arr = [];
      this.oldData = [];
      for (var i = 0; i < this.$refs.inspect.length; i++) {
        arr[i] = await this.$refs.inspect[i].submitForm();
      }
      console.log(arr);

      // let count = 0;
      // for (var i = 0; i < arr.length; i++) {
      //   this.$Api.saveInspectAdvice(arr[i]).then(res => {
      //     count++;
      //     if (res.Status) {
      //       if (count == arr.length) {
      //         this.$msg.success(res.Message);
      //       }
      //     } else {
      //       this.$msg.warning(`申请单${numTostr(i + 1)}保存失败`);
      //       oldData.push(arr[i]);
      //     }
      //   });
      // }

      for (var i = 0; i < arr.length; i++) {
        if (!arr[i]) {
          this.$msg.info(`${this.tabls[i].Name}有必填项未输入,不能提交`);
          return;
        }
      }
      for (let i = 0; i < arr.length; i++) {
        arr[i].ApplicationFormName = this.tabls[i].Name;
        arr[i].ApplicationFormNo = this.tabls[i].requestId;
      }
      this.$Api.postAxamineAll(arr).then((res) => {
        this.$msg[res.Status ? "success" : "warning"](res.Message);
        if (res.Status) {
          console.log(res);
          for (var i = 0; i < res.Data.length; i++) {
            res.Data[i]["Index"] = i + 1;
          }
          this.saveSuccessData = res.Data;
          this.$store.commit("public/SET_ISSHOW", true);
        }
      });
    },
    //取消申请单
    cancel(str) {
      this.tabls = [];
      this.$nextTick(() => {
        this.tabls = [
          {
            Items: [],
            Details: {},
            Name: "申请单一",
            Id: -1,
            isOredr: false,
            guId: "",
          },
        ];
        this.tablsId = -1;
        this.oneTabs = {};
        this.selectOldData({});
        // this.treeData = this.isChenk(JSON.parse(JSON.stringify(this.treeData)));
        this.depTreeData = this.setMealCheck(
          JSON.parse(JSON.stringify(this.depTreeData))
        );
        this.personTreeData = this.setMealCheck(
          JSON.parse(JSON.stringify(this.personTreeData))
        );
      });
    },
    //历史检查的数据列表回调函数
    historyCall(val) {
      console.log(val);
      this.getCheckTableData(val);
    },
    //获取检查申请单的详情
    getCheckTableData(id) {
      this.$Api.getCheckTableData({ inHouseId: id }).then((res) => {
        console.log(res);
        if (res.Status) {
          for (var i = 0; i < res.Data.length; i++) {
            res.Data[i]["Index"] = i + 1;
          }
          this.tableData = res.Data;
        }
      });
    },
    //引用该申请单
    showTable(val) {
      console.log(val);
      this.tabls = [
        {
          Items: [],
          Details: {},
          Name: val.CheckFormModel.ApplicationFormName,
          requestId: val.CheckFormModel.ApplicationFormNo,
          Id: this.num++,
          isOredr: false,
          guId: "",
        },
      ];
      val.CheckFormModel.FormId = "00000000-0000-0000-0000-000000000000";
      val.CheckFormModel.InHouseId = "00000000-0000-0000-0000-000000000000";
      val.CheckFormModel.ApplyTime = GetFormatDateTime();
      delete val.CheckFormModel.Diagnosis;
      delete val.CheckFormModel.DiagnosisCode;
      for (var i = 0; i < val.OrderDetails.length; i++) {
        (val.OrderDetails[i].CheckId = "00000000-0000-0000-0000-000000000000"),
          (val.OrderDetails[i].ItemId = "00000000-0000-0000-0000-000000000000");
      }
      this.tabls[0].Items = val.OrderDetails;
      this.tabls[0].Details = val.CheckFormModel;
      this.nowTemp = "newCreateExamine";
      this.tablsId = this.tabls[0].Id;
      console.log(this.tabls);
    },
    //新增申请单的数据处理
   async addData(val, index, str, row) {
      // res.Data.Check[0], -1, "", row
      // this.getParentCode(val, index, str);
      if (this.oneTabs.isOrder && str === "input") {
        let data = index < 0 ? {} : this.oneTabs.Items[index];
        for (let i = 0; i < this.oneTabs.Items.length; i++) {
          if (this.oneTabs.Items[i].DictItemCode === val.HisMedId) {
            this.$msg.warning("不允许重复添加相同的检查项");
            return;
          }
        }
        data["DictItemCode"] = val.HisMedId;
        data["ItemType"] = val.OrderItemType;
        data["DictItemName"] = val.ItemName;
        data["Price"] = val.Price;
        data["IsDeleted"] = false;
        data["_edit"] = false;
        data["ParentCategoryCode"] = val.CategoryNo;
        data["NewDepartmentList"] = val.Department
          ? [...new Set(val.Department.split(","))]
          : [];
        data.InsuranceUseFlag = await this.isMedicalInsuranceMsg({
          HisRegisterId: this.patientMsg.RegistId,
          HisMedId: val.HisMedId,
          OrderType: 7,
        });
        if (index < 0) {
          this.oneTabs.Items.push(data);
        }
        // return;
      } else {
        this.$Api
          .getParentCode({ code: val.CategoryNo, type: 7 })
          .then( async (res) => {
            let nameData = res.Data || "";
            let data = index < 0 ? {} : this.tabls[this.active].Items[index];
            for (var i = 0; i < this.tabls.length; i++) {
              for (var j = 0; j < this.tabls[i].Items.length; j++) {
                if (
                  this.tabls[i].Items[j].DictItemCode === val.HisMedId &&
                  index != j
                ) {
                  this.$msg.warning("不允许重复添加相同的检查项");
                  if (
                    row &&
                    row.ItemCode === this.tabls[i].Items[j].DictItemCode
                  ) {
                    row.isCheck = false;
                  }
                  return;
                }
              }
            }
            data["DictItemCode"] = val.HisMedId;
            data["ItemType"] = val.OrderItemType;
            data["DictItemName"] = val.ItemName;
            data["Price"] = val.Price;
            data["IsDeleted"] = false;
            data["_edit"] = false;
            data["ParentCategoryCode"] = val.CategoryNo;
            data["NewDepartmentList"] = val.Department
              ? [...new Set(val.Department.split(","))]
              : [];
            data.InsuranceUseFlag =  await this.isMedicalInsuranceMsg({
              HisRegisterId: this.patientMsg.RegistId,
              HisMedId: val.HisMedId,
              OrderType: 7,
            });
            // let bl = this.isThitime(
            //   severalGroups(this.tabls[this.active].Items),
            //   val.Department
            // )
            //   ? true
            //   : false;
            // // console.log(bl, "bkkkkk");
            // console.log(this.isBast(val.Department), "this.isBast(val)");

            let on = true;
            if (this.tabls.length === 1 && this.tabls[0].Id === -1) {
              // console.log(res.Data, "qwertytr");
              this.tabls[0].Items.push(data);
              this.tabls[0].Details = {
                ExcuteDepartment: "",
              };
              this.tabls[0].Name = nameData || "申请单一";
              this.tabls[0].Id = this.num++;
              this.tablsId = this.tabls[0].Id;
              on = false;
            } else {
              let obj = this.isBast(val.Department);
              let isName = this.isName(nameData, data.NewDepartmentList);
              if (this.requestRule == 2) {
                if (
                  index < 0 &&
                  obj &&
                  isName
                  // val.Department.split(",").includes(
                  //   this.tabls[isName["i"]].requestId
                  // )
                ) {
                  this.tabls[isName["i"]].Items.push(data);
                  this.tablsId = this.tabls[isName["i"]].Id;
                  on = false;
                }
              } else {
                if (index < 0 && obj) {
                  this.tabls[obj["i"]].Items.push(data);
                  this.tablsId = this.tabls[obj["i"]].Id;
                  on = false;
                }
              }
            }
            if (on && index < 0) {
              this.tabls.push({
                Items: [{ ...data }],
                Details: {
                  ExcuteDepartment: "",
                },
                Name: nameData || "申请单" + numTostr(i + 1),
                Id: this.num++,
              });
              this.tablsId = this.tabls[this.tabls.length - 1].Id;
            }
          });
      }
    },
    //常用申请单的项目
    usedSelect(val) {
      console.log(val);
      this.$Api
        .postUsedDeatil({
          CategoryCode: val.CategoryCode,
          SearchType: 7,
          KeyWord: "",
          DeptCode: "",
          DictItemCode: val.ItemCode,
          HisRegisterId: this.patientMsg.RegistId,
        })
        .then((res) => {
          if (res.Status && res.Data) {
            console.log(res.Data);
            res.Data.Check[0] && this.addData(res.Data.Check[0], -1);
          }
        });
      // console.log(val);
    },
    //提交检查申请单
    submitData() {
      if (!this.patientMsg.RegistId) {
        this.$msg.info("该患者无有效挂号，请先挂号！");
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
      if (this.isSignName) {
        let obj = {
          Type: "0",
          Data: [{ Name: "检查申请" }],
          No: this.user.UserInfo.No,
          UserName: this.user.UserInfo.Name,
        };
        this.currentObjData = obj;
        this.caSignOperation.KeyVerify();
      } else {
        this.handleOperation();
      }
    },
    async handleOperation() {
      try {
        let isPassIMIS = await this.$IMIS.submmitOrderIMIS(
          this.saveSuccessData,
          this.patientMsg
        );
        if (!isPassIMIS) return;
      } catch (error) {}
      let boj = {
        InHouseId: this.$route.query.id || this.patientMsg.InHouseId,
        OrderList: [],
        HisRegisterId: this.patientMsg.RegistId,
        CASignImg: this.caImgData,
      };
      for (var i = 0; i < this.saveSuccessData.length; i++) {
        boj.OrderList.push(this.saveSuccessData[i].OrderId);
      }
      console.log(boj);
      this.$Api
        .submitAdvice(boj)
        .then((res) => {
          this.$msg[res.Status ? "success" : "warning"](res.Message);
          console.log(res);
          if (res.Status) {
            let strId = "";
            let ObjectTypes = "";
            let TemplateIds = "";
            let len = boj.OrderList.length;
            let prescriptionInfo = res.Data.PrescriptionInfo || [];
            prescriptionInfo.forEach((el) => {
              strId += el.PrescriptionMasterNo + ",";
              ObjectTypes +=
                printObjectType["CheckLargeEquipment"].objectType + ",";
              TemplateIds +=
                printObjectType["CheckLargeEquipment"].templateId + ",";
            });
            boj.OrderList.forEach((item, index) => {
              strId += item;
              if (len - 1 != index) {
                strId += ",";
              }
              ObjectTypes += printObjectType.examine.objectType + ",";
              TemplateIds += printObjectType.examine.templateId + ",";
            });
            if (strId != "") {
              clearTimeout(this.timer);
              let t = new Date().getTime();
              // let str = window.location.protocol + "\\" + window.location.host;
              let url = `${URLCONFIG.Emr}/Nursing/EditPage.aspx?patientId=${
                this.patientMsg.PatientId
              }&inHouseId=${this.patientMsg.InHouseId}&areaType=${
                this.patientMsg.AreaType
              }&createUser=940c7df7-a718-e911-80cd-0050568e1b08&objectType=${
                printObjectType.specialDrugBatch.objectType
              }&ObjectTypes=${ObjectTypes.slice(
                0,
                ObjectTypes.length - 1
              )}&TemplateIds=${TemplateIds.slice(
                0,
                TemplateIds.length - 1
              )}&logUserEditTrack=true&documentId=f2f201db-3ca2-47b0-ba81-ab6b0096abd6&mark=true&templateId=${
                printObjectType.examine.templateId
              }&ids=${strId}&ismult=true&t=${t}`;
              console.log(url);
              this.$store.commit("public/SET_PRINTIFRAMEURL", url);
            }

            this.$store.commit("public/SET_ISSHOW", false);
            if (this.nowTemp === "newCreateExamine") {
              this.cancel();
            } else {
              this.getCheckTableData(this.$refs.historyList.selectId);
            }
          } else {
            this.refreshOrderStatus();
          }
        })
        .catch((err) => {
          this.refreshOrderStatus();
        });
    },
    //修改申请单
    upData() {
      this.dataToData();
    },
    //弹窗的回调
    alterCallback(bl) {
      if (this.nowTemp == "newCreateExamine") {
        this.dataToData();
      } else {
        this.$store.commit("public/SET_ISSHOW", false);
      }
    },
    //数据转化数据修改
    dataToData() {
      var arr = [];
      for (var i = 0; i < this.saveSuccessData.length; i++) {
        this.saveSuccessData[i].CheckFormModel.Diagnosis = this.saveSuccessData[
          i
        ].CheckFormModel.Diagnosis.substring(
          0,
          this.saveSuccessData[i].CheckFormModel.Diagnosis.length - 1
        );
        this.saveSuccessData[
          i
        ].CheckFormModel.DiagnosisCode = this.saveSuccessData[
          i
        ].CheckFormModel.DiagnosisCode.substring(
          0,
          this.saveSuccessData[i].CheckFormModel.DiagnosisCode.length - 1
        );
        if (
          this.saveSuccessData[i].CheckFormModel.Diagnosis.indexOf(";") > -1
        ) {
          this.saveSuccessData[
            i
          ].CheckFormModel.Diagnosis = this.saveSuccessData[
            i
          ].CheckFormModel.Diagnosis.split(";");
          this.saveSuccessData[
            i
          ].CheckFormModel.DiagnosisCode = this.saveSuccessData[
            i
          ].CheckFormModel.DiagnosisCode.split(";");
        } else {
          this.saveSuccessData[i].CheckFormModel.Diagnosis = [
            this.saveSuccessData[i].CheckFormModel.Diagnosis,
          ];
          this.saveSuccessData[i].CheckFormModel.DiagnosisCode = [
            this.saveSuccessData[i].CheckFormModel.DiagnosisCode,
          ];
        }
        this.saveSuccessData[i].CheckFormModel.OrderId = this.saveSuccessData[
          i
        ].OrderId;
        arr.push({
          Items:
            this.saveSuccessData[i].OrderDetails ||
            this.saveSuccessData[i].CheckDetailModels,
          Details: this.saveSuccessData[i].CheckFormModel,
          Name: this.saveSuccessData[i].ApplicationFormName,
          requestId: this.saveSuccessData[i].ApplicationFormNo,
          Id: this.tabls[i].Id,
          isOrder: this.tabls[i].guId ? true : false,
          guId: this.tabls[i].guId,
        });
      }
      this.tabls = arr;
      this.tablsId = this.tabls[0].Id;
      this.oneTabs = this.tabls[0];
      this.$store.commit("public/SET_ISSHOW", false);
      this.nowTemp = "newCreateExamine";
      console.log(this.tabls);
    },
    //选中表格的一行
    selectRow(row) {
      this.saveSuccessData = [
        {
          ...row,
          ApplicationFormName: row.CheckFormModel.ApplicationFormName,
          ApplicationFormNo: row.CheckFormModel.ApplicationFormNo,
        },
      ];
      console.log(row, "row");
      this.$store.commit("public/SET_ISSHOW", true);
      if (row.Status == 1) {
        this.isFooter = true;
      } else {
        this.isFooter = false;
      }
    },
    //申请单的切换
    tablsChange(val) {
      console.log(val);

      for (var i = 0; i < this.tabls.length; i++) {
        if (val === this.tabls[i].Id) {
          this.tabsIndex = i;
          this.oneTabs = this.tabls[i];
        }
      }
      console.log(val, this.oneTabs);
    },
    //打印生清单
    print(val) {
      clearTimeout(this.timer);
      let t = new Date().getTime();
      let str = window.location.protocol + "\\" + window.location.host;
      let url = `${URLCONFIG.Emr}/Nursing/EditPage.aspx?patientId=${this.patientMsg.PatientId}&inHouseId=${this.patientMsg.InHouseId}&areaType=${this.patientMsg.AreaType}&createUser=940c7df7-a718-e911-80cd-0050568e1b08&originUrl=${str}&objectType=${printObjectType.examine.objectType}&logUserEditTrack=true&documentId=f2f201db-3ca2-47b0-ba81-ab6b0096abd6&mark=true&templateId=${printObjectType.examine.templateId}&orderid=${val.OrderId}&areaId=${this.patientMsg.AreaId}&t=${t}`;
      console.log(url, "11111ffffff");
      this.$store.commit("public/SET_PRINTIFRAMEURL", url);
    },
    //删除申请单
    delItem(val, index) {
      this.$confirm("该操作将删除该申请单,是否继续?", "", {
        type: "warning",
      })
        .then(() => {
          let data = this.tabls.splice(index, 1);
          this.tablsId = this.tabls[this.tabls.length - 1].Id;
          this.tabsIndex = this.tabls.length - 1;
          // for (let i = 0; i < this.tabls.length; i++) {
          //   this.tabls[i].Name = "申请单" + numTostr(i + 1);
          // }

          this.delOldData(this.treeData, data[0].Items);
        })
        .catch(() => {
          this.$msg.info("已取消操作");
        });
    },
    getCheckTreeData() {
      this.$Api
        .getCheckTreeData({ queryKey: this.treeName ? this.treeName : null })
        .then((res) => {
          console.log("this.treeData", res);
          if (res.Status) {
            this.treeData = res.Data || [];
            console.log("this.treeData", this.treeData);
          }
        });
    },
    //去重操作
    setArr(arr, str) {
      let obj = {};
      arr = arr.reduce((pre, cur) => {
        obj[cur[str]] ? "" : (obj[cur[str]] = true && pre.push(cur));
        return pre;
      }, []);
      console.log(arr);
      return arr;
    },
    //递归选中的清除
    isChenk(data) {
      for (var j = 0; j < data.length; j++) {
        data[j]["isCheck"] = false; //添加key属性
        if (data[j].ChildCategory) {
          this.isChenk(data[j].ChildCategory);
        }
      }

      return data;
    },
    //递归清空选中套餐
    setMealCheck(data) {
      console.log("data", data);
      for (var i = 0; i < data.length; i++) {
        data[i]["isCheck"] = false;
        if (data[i].detailInfoList) {
          this.setMealCheck(data[i].detailInfoList);
        }
      }
      return data;
    },
    //删除单个检验项目的回调函数
    delRow(row) {
      if (row) {
        console.log(this.oneTabs, row, "111");
        if (this.oneTabs.Name) {
          if (!this.oneTabs.isOrder) {
            this.selectOldData(row);
            // this.treeData = this.selectOldData(this.treeData, row);
          }
        } else {
          this.selectOldData(row);
          // this.treeData = this.selectOldData(this.treeData, row);
        }

        for (let i = 0; i < this.tabls.length; i++) {
          if (this.tabls[i].Items.length === 0 && this.tabls.length > 1) {
            console.log(111111, "qqqqq");
            this.tabls.splice(i, 1);
          }
        }
        this.tablsId = this.tabls[this.tabls.length - 1].Id;
        this.oneTabs = this.tabls[this.tabls.length - 1];
      }

      this.clearData();
    },
    //递归寻找数据
    selectOldData(row) {
      let data = this.$refs.treeList && this.$refs.treeList.getData();
      for (var j = 0; j < data.length; j++) {
        if (data[j].ItemCode === row.DictItemCode || !row.DictItemCode) {
          data[j]._select = false;
          if (row.DictItemCode) break;
        }
      }
      // for (var j = 0; j < data.length; j++) {
      //   if (data[j].ItemCode === row.DictItemCode) {
      //     console.log(1111);
      //     // data[j]["isCheck"] = false;
      //       this.$refs.treeList&&this.$refs.treeList.getNode().setChecked(data[j].Id,false)

      //     return data;
      //   }
      //   if (data[j].ChildCategory) {
      //     this.selectOldData(data[j].ChildCategory, row);
      //   }
      // }
      // return data;
    },
    //递归寻找需要删除的数据
    delOldData(treeData, tableList) {
      console.log(treeData, tableList, "tablelisttableList");
      let data = this.$refs.treeList && this.$refs.treeList.getData();
      for (let j = 0; j < tableList.length; j++) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].ItemCode == tableList[j].DictItemCode) {
            data[i]._select = false;
            break;
          }
        }
      }
    },
    //递归删除套餐的数结构选中项
    delTreeCombo(treeData) {
      for (let i = 0; i < treeData.length; i++) {}
    },
    //获取父级的分类的名称和code
    getParentCode(val, index, str) {
      this.$Api.getParentCode({ code: val.HisMedId, type: 7 }).then((res) => {
        console.log(res);
      });
    },
    //判断新增的项目在该添加到哪一个申请单下面
    isBast(val = "") {
      console.log(val, "bvall");
      let depList = val.split(",");
      for (let i = 0; i < this.tabls.length; i++) {
        for (let j = 0; j < depList.length; j++) {
          if (this.tabls[i].requestId == depList[j]) {
            return {
              i,
            };
          }
        }
      }
    },
    //父类相等放在同一级
    isName(name, department) {
      console.log(name, "name", department);
      for (let i = 0; i < this.tabls.length; i++) {
        if (
          this.tabls[i].Name === name &&
          department.includes(this.tabls[i].requestId)
        ) {
          console.log(this.tabls[i].Name === name);
          return {
            i,
          };
        }
      }
    },
    // 重置医嘱提交错误时的医嘱状态
    refreshOrderStatus() {
      this.$Api
        .refreshOrderStatus({
          inHospitalId: this.$route.query.id || this.patientMsg.InHouseId,
        })
        .then((res) => {});
    },
    // 节流搜索
    searchList() {
      this.debouceElg();
    },
  },
  computed: {
    ...mapGetters({
      patientMsg: "public/GET_PATIENTMSG",
      isShow: "public/GET_ISSHOW",
      isRegister: "configuration/GET_ISREGISTER", //是否可挂号
      requestRule: "configuration/GET_CHECKRULE",
      signName: "public/GET_SIGNNAME", //签名系统简称
      isSignName: "public/GET_ISSIGNNAME", //是否启用
      isGetCA: "public/GET_ISGETCA", //
      user: "public/GET_USER",
      caImgData: "public/GET_CAIMGDATA", //ca签名图片数据流，医嘱提交处使用
    }),
    active() {
      for (var i = 0; i < this.tabls.length; i++) {
        if (this.tablsId == this.tabls[i].Id) {
          this.tabsIndex = i;
          console.log(this.tabsIndex, "qq");
          return this.tabsIndex;
        }
      }
    },
    isExpand() {
      if (this.treeName) {
        return true;
      } else {
        return false;
      }
    },
  },
  created() {
    let leftWidth = getLocalStorage(this.user.UserInfo.No) || {};
    this.leftWidth = leftWidth.examineW || 200;
    this.debouceElg = debouce(this.getMenu, 500);
    this.$Api.getAxamineUsed({}).then((res) => {
      if (res.Status) {
        this.usedCheckData = res.Data;
      }
    });
    this.getCheckTreeData();
    this.getOrderPackageDepartment();
    this.getOrderPackagePersonl();
    if (this.isSignName) {
      this.caSignOperation = new CASign(this, this.signName);
    }
  },
  mounted() {
    let domLeft = this.$refs.treeLeft;
    let domResize = this.$refs.resizeLine;
    let _this = this;
    domResize.onmousedown = function (event) {
      var startX = event.clientX;
      domResize.left = domResize.offsetLeft;
      document.onmousemove = function (ev) {
        let endX = ev.clientX;
        let moveLen = domResize.left + (endX - startX);
        moveLen = moveLen < 200 ? "200" : moveLen;
        moveLen = moveLen > 500 ? "500" : moveLen;
        _this.leftWidth = moveLen - 20;
        let num = _this.user.UserInfo.No;
        let leftWidth = getLocalStorage(num) || {};
        leftWidth.examineW = _this.leftWidth;
        setLocalStorage(num, leftWidth);
        // domResize.style.left = moveLen
        // domLeft.style.width = moveLen-20+'px'
        window.getSelection
          ? window.getSelection().removeAllRanges()
          : document.selection.empty();
      };
      document.onmouseup = function (e) {
        document.onmousemove = null;
        document.onmouseup = null;
        domResize.releaseCapture && domResize.releaseCapture();
      };
    };
  },
  components: {
    medicalNowTree,
    startRequest,
    inspectDoctorAdvice,
    searchDoctorAdvice,
    historyList,
    myAlert,
    examinTable,
    examinDetail,
    myTabs,
    treeTable,
  },
};
</script>
<style scoped lang='less'>
//  @import url("./adviceStyle.less");
.examine {
  padding: 10px 15px;
  height: 100%;
  box-sizing: border-box;

  // font-size: @
  .tabs-temp {
    /deep/.el-radio-button__inner {
      width: 98px;
      height: 32px;
      font-size: 14px;
      border-radius: 0;
    }
  }
  .content {
    margin-top: 15px;
    position: relative;
    height: calc(~"(100vh - 130px)");
    // overflow: auto;
    .newCreateExamine {
      height: 100%;
      .resizeLine {
        cursor: w-resize;
        float: left;
        width: 15px;
        border-left: 3px solid #dfe7f5;
        height: 100%;
      }
      .left {
        height: 100%;
        float: left;
        width: 200px;
        padding-right: 20px;
        height: 100%;
        min-width: 200px;
        max-width: 500px;
        // cursor: w-resize;
        // border-right: 1px solid #dfe7f5;
        // margin-right: 15px;
        overflow-x: auto;
        .medical-now-tree {
          height: calc(100vh - 223px);
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
      .right {
        overflow: auto;
        height: calc(~"(100% - 60px)");
      }
    }
    .historyExamine {
      height: 100%;
      .left {
        width: 130px;
        padding: 0 10px;
        float: left;
        height: 100%;
        border-right: 1px solid #ccc;
      }
      .right {
        overflow: hidden;
        height: 100%;

        box-sizing: border-box;
        padding: 0 10px 0 30px;
      }
    }
  }
  .inspect {
    border: none;
    box-shadow: none;
    padding: 0;
    box-sizing: border-box;
    width: 100%;
  }
  .right-tabs {
    height: 40px;
    padding: 10px 0;
    // .tabs-item {
    //   padding: 10px;
    //   border: 1px solid #ccc;
    //   float: left;
    //   cursor: pointer;
    //   border-right: none;
    //   &:last-child {
    //     border-right: 1px solid #ccc;
    //   }
    // }
    /deep/.el-radio-button__inner {
      min-width: 105px;
      height: 32px;
      font-size: 14px;
      border-radius: 0;
      position: relative;

      // .list {
      //   position: absolute;
      //   left: -10px;
      //   top:0;
      //   width: 20px;
      //   height: 20px;
      //   background: red;
      //   line-height: 20px;
      //   text-align: center;
      //   color:#fff;
      //   transform: rotate(-30deg);
      // }
      .close {
        position: absolute;
        right: 2px;
        margin-top: 0px;
        display: none;
        width: 15px;
        height: 15px;
        text-align: center;
        line-height: 16px;
        color: red;
        border-radius: 50%;
        background: #f2f2f2;
        margin-left: 5px;
      }
      &:hover {
        .close {
          display: inline-block;
        }
      }
    }
  }
}
.advice-button {
  position: absolute;
  bottom: 20px;
  right: 0px;
  left: 0;
  text-align: center;
  margin-left: 220px;
  .save {
    background: #0071e7;
    border-radius: 2px;
    width: 98px;
    color: #fff;
    font-size: 14px;
  }
  .reset {
    background: #f3f5f9;
    width: 98px;
    border-radius: 2px;
  }
}
.styleIcon {
  display: inline-block;
  width: 20px;
  height: 20px;
  color: #0071e7;
  margin-right: 10px;
  cursor: pointer;
}
.btnList {
  height: 60px;
  box-shadow: 0 -2px 7px 0 rgba(102, 136, 169, 0.16);
  .save {
    background: #0071e7;
    border-radius: 2px;
    width: 98px;
    color: #fff;
    font-size: 14px;
    float: right;
    margin-top: 15px;
  }
  .reset-list {
    background: #f3f5f9;
    width: 98px;
    border-radius: 2px;
    float: right;
    margin-top: 15px;
  }
}
.alter-content {
  padding: 10px;
  min-height: 400px;
  overflow: auto;
}
</style>
