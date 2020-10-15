<template>
  <div class="check-out" ref="checkout">
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
      <div class="newCreateTest" v-show="nowTemp === 'newCreateTest'">
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
                @input="searchList"
                @keyup.enter.native="getMenu"
                suffix-icon="el-icon-search"
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
            type="checkout"
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
              show-checkbox
              check-strictly
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
          </div>
        </div>
        <div class="resizeLine" ref="resizeLine"></div>
        <div class="right" ref="treeRight">
          <start-request
            title="常用检验项目"
            :callback="usedSelect"
            :usedCheckData="usedCheckData"
          ></start-request>
          <div class="right-tabs">
            <el-radio-group
              v-model="tablsId"
              @change="tablsChange"
              fill="#0071e7"
            >
              <el-radio-button
                :label="item.Id"
                v-for="(item, index) in tabls"
                :key="index"
              >
                {{ item.Name }}
                <span
                  class="el-icon-close close"
                  v-if="index != 0 && tablsId == item.Id"
                  @click.stop="delItem(item, index)"
                ></span>
              </el-radio-button>
            </el-radio-group>
          </div>
          <testDoctorAdvice
            ref="inspect"
            :editIndex="editIndex"
            :tableData="item.TestApplyDetailsModel"
            :commonObj="item.TestApplyMainModel"
            @changrequestId="changrequestId($event, item)"
            class="inspect"
            v-for="(item, index) in tabls"
            :key="index"
            v-show="tablsId == item.Id"
            :callback="delRowTest"
          >
            <searchDoctorAdvice
              slot="change"
              slot-scope="{ index, itemName, departmentCode, categoryNo }"
              :adviceName="8"
              :index="index"
              :departmentCode="departmentCode"
              :categoryNo="categoryNo"
              :itemName="itemName"
              :callBack="add"
            ></searchDoctorAdvice>
            <searchDoctorAdvice
              slot-scope="{ departmentCode, categoryNo }"
              :departmentCode="departmentCode"
              :categoryNo="categoryNo"
              slot="search"
              :adviceName="8"
              :callBack="add"
            ></searchDoctorAdvice>
            <p class="advice-button" slot-scope="{ submitForm }">
              <el-button plain @click="cancel('add')" class="reset"
                >取消</el-button
              >
              <el-button @click="save(submitForm)" class="save">保存</el-button>
            </p>
          </testDoctorAdvice>
        </div>
      </div>
      <div class="historyTest" v-show="nowTemp === 'historyTest'">
        <div class="left">
          <history-list
            :historyListData="historyListData"
            :callback="getCheckTableData"
            ref="historyList"
          ></history-list>
        </div>
        <div class="right">
          <test-history :tableData="tableData" :callback="selectRow">
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
          </test-history>
        </div>
      </div>
      <!-- <my-alter></my-alter> -->
      <my-alert
        :visible="isShow"
        :title="dialogTitle"
        :callback="alterCallback"
        :isfooter="dialogComponent != 'testDetail'"
        :width="dialogWidth"
        :isDeclareComponent="dialogComponent != 'testDetail'"
      >
        <div :class="[dialogComponent == 'testDetail' ? 'alter-content' : '']">
          <component
            ref="alterComponent"
            :is="dialogComponent"
            :deatilData="saveSuccessData"
            :declareMessage="declareMessage"
          ></component>
        </div>

        <!-- <templatename="footer"></template> -->
        <div
          class="btnList"
          v-if="
            isFooter &&
            patientMsg.Status != 8 &&
            dialogComponent == 'testDetail'
          "
        >
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
import testDoctorAdvice from "../../components/doctorAdvice/openDoctorAdvice/testDoctorAdvice";
import searchDoctorAdvice from "../../components/doctorAdvice/openDoctorAdvice/searchDoctorAdvice";
import historyList from "../../components/doctorAdvice/requestCommon/historyList";
import { numTostr, debouce, GetFormatDateTime } from "../../utils/public";
import myAlert from "@/components/common/myAlter";
import testHistory from "../../components/doctorAdvice/checkout/testHistory";
import testDetail from "../../components/doctorAdvice/checkout/testDetail";
import myTabs from "../../components/common/my-tabs.vue";
import medicalNowTree from "../../components/doctorAdvice/medicalHistory/medicalNowTree.vue";
import { testTree, documentType } from "../../module/staticData";
import { printObjectType, needDeclarePatmessage } from "@/module/staticData.js";
import CASign from "@/utils/caSign.js";
import declarePatmessage from "@/components/doctorAdvice/openDoctorAdvice/declarePatMessage.vue";
import treeTable from "../../components/common/treeTable.vue";
import { getLocalStorage, setLocalStorage } from "@/utils/localstorage";
import { resolve } from "path";
export default {
  name: "checkout", //检验申请单
  data() {
    this.num = 0;
    return {
      declareMessage: {
        证件类型: "",
        证件号码: "",
        人员来源: "99.其它采样点",
        "人员身份(必填)": "99.其它人群",
        "14天内境外入境(必填)": "否",
      },
      needDeclarePatmessage: {},
      needDeclarePatmessage: needDeclarePatmessage,
      dialogTitle: "检验申请单",
      dialogWidth: "1200px",
      dialogComponent: "testDetail",
      treeData: [],
      depTreeData: [],
      personTreeData: [],
      defaultExpanded: {
        1: [1],
        2: [1],
        3: [1],
      }, //默认选中项
      usedCheckData: [], //常用检验项的数据
      selectData: 1, //切换科室的个人的项目
      treeName: "", //搜索树结构的名称
      tabsList: [
        {
          label: "检验",
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
          TestApplyDetailsModel: [],
          TestApplyMainModel: {},
          Name: "申请单一",
          Id: -1,
          requestId: "",
          isOrder: false,
          guId: "",
        },
      ], //申请单列表数据
      nowTemp: "newCreateTest", //切换后现在的组件,
      tabsTemp: [
        {
          Text: "新建检验",
          Value: "newCreateTest",
          Show: true,
        },
        {
          Text: "检验记录",
          Value: "historyTest",
          Show: true,
        },
      ], //切换新建检查和检查记录的数据存储
      historyListData: [], //历史列表数据
      oldData: [], //为申请提交的数据
      tableData: [], //表格数据
      tabsIndex: 0,
      saveSuccessData: [],
      isFooter: true,
      treeType: "checkout",
      oneTabs: {},
      timer: null,
      caSignOperation: {}, //
      currentObjData: "",
      specimenOptions: [],
      editIndex: 0,
      leftWidth: 200,
      tabWidth: 66.6,
    };
  },
  created() {
    let leftWidth = getLocalStorage(this.user.UserInfo.No) || {};
    this.leftWidth = leftWidth.checkoutW || 200;
    this.debouceElg = debouce(this.getMenu, 500);
    this.$Api.getTestUsedList().then((res) => {
      if (res.Status) {
        console.log("data", res.Data);
        this.usedCheckData = res.Data;
      }
    });
    this.getTestTreeData();

    this.getOrderPackageDepartment();

    this.getOrderPackagePersonl();
    this.getTestSampleList();
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
      console.log("鼠标点击", startX, domResize.left, domResize.offsetLeft);
      domResize.left = domResize.offsetLeft;
      document.onmousemove = function (ev) {
        let endX = ev.clientX;
        let moveLen = domResize.left + (endX - startX);
        // console.log('鼠标滑动',endX,moveLen)

        moveLen = moveLen < 200 ? "200" : moveLen;
        moveLen = moveLen > 500 ? "500" : moveLen;
        _this.leftWidth = moveLen - 20;
        let num = _this.user.UserInfo.No;
        let leftWidth = getLocalStorage(num) || {};
        leftWidth.checkoutW = _this.leftWidth;
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
            type: "warning",
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
    tabChange(val) {
      // if (val == 1) {
      //   this.treeType = "checkout";
      //   this.getTestTreeData();
      // } else if (val == 2) {
      //   this.getOrderPackageDepartment();
      //   this.treeType = "package";
      // } else if (val == 3) {
      //   this.getOrderPackagePersonl();
      //   this.treeType = "package";
      // }
    },
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
          orderType: 8,
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
          orderType: 8,
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
      // 叶子节点
      this.defaultExpanded[this.selectData] = [patientKey];
      this.currentOrderPackage = row;
      this.showOrderPackageContent = true;
    },
    selectPackage(bl, row) {
      console.log("data", bl, row, this.selectData);
      let params = {
        orderPackageId: row.Id,
        DataStatus: 1,
      };
      if (this.selectData === 1) {
        if (row.ItemCode && bl) {
          this.usedSelect(row, true);
        } else {
          console.log(this.tabls, bl, "bl");
          this.tabls.forEach((data) => {
            data.TestApplyDetailsModel.forEach((item, index) => {
              if (item.DictItemCode === row.ItemCode) {
                data.TestApplyDetailsModel.splice(index, 1);
                this.tablsId = data.Id;
              }
            });
          });
          let off = false;
          for (let i = 0; i < this.tabls.length; i++) {
            if (
              this.tabls.length > 1 &&
              this.tabls[i].TestApplyDetailsModel.length == 0
            ) {
              this.tabls.splice(i, 1);
              off = true;
            }
          }
          if (off) {
            this.tablsId = this.tabls[this.tabls.length - 1].Id;
            // for (let i = 0; i < this.tabls.length; i++) {
            //   this.tabls[i].Name = "申请单" + numTostr(i + 1);
            // }
          }
          this.clearData();
        }
      } else {
        if (bl) {
          let params = {
            PackageId: row.Id,
            OrderType: 8,
          };
          let listData = [];
          this.$Api.getSetMealDeatil(params).then((res) => {
            if (res.Status) {
              let testData = res.Data || [];
              for (let i = 0; i < testData.length; i++) {
                listData.push({
                  TestApplyDetailsModel: testData[i].OrderDetails,
                  TestApplyMainModel: {
                    ExcuteDepartment:
                      testData[i].TestFormModel.ExcuteDepartment,
                    InHouseId: "",
                    IsDeleted: testData[i].TestFormModel.IsDeleted,
                    IsEmergency: testData[i].TestFormModel.IsEmergency,
                    IsOtherTest: testData[i].TestFormModel.IsOtherTest,
                    Remark: testData[i].TestFormModel.Remark,
                  },
                  Name: testData[i].TestFormModel.ApplicationFormName,
                  Id: this.num++,
                  isOrder: true,
                  guId: row.Id,
                });
              }
              for (let i = 0; i < listData.length; i++) {
                for (
                  let j = 0;
                  j < listData[i].TestApplyDetailsModel.length;
                  j++
                ) {
                  listData[i].TestApplyDetailsModel[j].CheckedList = [];
                  for (
                    let k = 0;
                    k < listData[i].TestApplyDetailsModel[j].ChildItems.length;
                    k++
                  ) {
                    listData[i].TestApplyDetailsModel[j].CheckedList.push(
                      listData[i].TestApplyDetailsModel[j].ChildItems[k]
                        .DictItemCode
                    );
                  }
                }
              }
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
            this.editIndex = Math.random();
            console.log("this.oneTabs", this.oneTabs);
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
                TestApplyDetailsModel: [],
                TestApplyMainModel: {},
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
          this.clearData();
        }
      }
    },
    // 获取标本信息
    getTestSampleList() {
      this.$Api.getTestSampleList({ t: new Date().getTime() }).then((res) => {
        console.log("resres", res);
        this.specimenOptions = res.Data || [];
      });
    },
    //勾选清楚最后一项的数据
    clearData() {
      if (this.tabls.length <= 1) {
        console.log("this", this.tabls);
        if (
          this.tabls[0] &&
          this.tabls[0].TestApplyDetailsModel &&
          this.tabls[0].TestApplyDetailsModel.length == 0
        ) {
          console.log(11111, this.tabls[0]);
          this.tabls = [];
          this.$nextTick(() => {
            this.tabls = [
              {
                TestApplyDetailsModel: [],
                TestApplyMainModel: {},
                Name: "申请单一",
                Id: -1,
                isOrder: false,
                guId: "",
              },
            ];
            this.tablsId = -1;
            this.oneTabs = this.tabls[0];
          });
        }
      }
    },
    // 搜索
    getMenu(el) {
      if (this.selectData == 1) {
        this.getTestTreeData();
      } else if (this.selectData == 2) {
        this.getOrderPackageDepartment();
      } else if (this.selectData == 3) {
        this.getOrderPackagePersonl();
      }
    },
    //切换新建检查和检查记录的数据组件函数
    tapsExamine(val) {
      console.log(val);
      console.log(this.patientMsg);
      this.cancel();
      if (val === "historyTest") {
        this.$Api
          .getTestHistoryList({ patientId: this.patientMsg.PatientId })
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
      this.dialogTitle = "检验申请单";
      this.dialogWidth = "1200px";
      this.dialogComponent = "testDetail";
      this.isFooter = true;
      let arr = [];
      this.oldData = [];
      for (var i = 0; i < this.$refs.inspect.length; i++) {
        arr[i] = await this.$refs.inspect[i].submitForm();
      }
      let list = JSON.parse(JSON.stringify(arr));
      for (var i = 0; i < list.length; i++) {
        if (!list[i]) {
          this.$msg.info(`${this.tabls[i].Name}有必填项未输入,不能提交`);
          return;
        }
      }
      let tabls = [];
      let count = 0;
      list.forEach((item, i) => {
        tabls[i] = [];
        item.forEach((el, j) => {
          el.ApplicationFormName = this.tabls[i].Name;
          el.ApplicationFormNo = this.tabls[i].requestId;
          let item = { ...this.tabls[i] };
          item.Id = count;
          item.guId = j ? "" : item.guId;
          item.isOrder = j ? false : item.isOrder;
          tabls[i].push(item);
          count++;
        });
      });
      console.log(tabls, "tabls");
      list = list.flat();
      this.tabls = tabls.flat();
      this.$Api.postTestAll(list).then((res) => {
        this.$msg[res.Status ? "success" : "warning"](res.Message);
        if (res.Status) {
          for (var i = 0; i < res.Data.length; i++) {
            res.Data[i]["Index"] = i + 1;
          }
          this.saveSuccessData = res.Data;
          console.log(this.saveSuccessData, this.tabls);
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
            TestApplyDetailsModel: [],
            TestApplyMainModel: {},
            Name: "申请单一",
            Id: -1,
            requestId: "",
            isOrder: false,
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
    //获取检查申请单的详情
    getCheckTableData(id) {
      this.$Api.getTestHistoryTable({ inHouseId: id }).then((res) => {
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
          TestApplyDetailsModel: [],
          TestApplyMainModel: {},
          Name: "申请单一",
          Id: this.num++,
          isOrder: false,
          guId: "",
        },
      ];

      let arr = val.OrderDetails;
      console.log(
        arr,
        "console.log(this.saveSuccessData[i].OrderDetails,'this.saveSuccessData[i].OrderDetails')"
      );
      arr.forEach((el) => {
        el.CheckedList = [];
        if (!el.ChargeItems) {
          el.ChargeItems = [];
        }
        if (!el.ChildItems) {
          el.ChildItems = [];
        }
        el.ChildItems.forEach((a) => {
          el.CheckedList.push(a.DictItemCode);
        });
        el.IsDeleted = false;
      });
      val.TestFormModel.ApplyTime = GetFormatDateTime();
      this.tabls[0].TestApplyMainModel = val.TestFormModel;
      this.tabls[0].TestApplyMainModel.FormId =
        "00000000-0000-0000-0000-000000000000";
      this.tabls[0].TestApplyDetailsModel = arr;
      this.tabls[0].TestApplyMainModel.InHouseId = "";
      this.tabls[0].Name = val.TestFormModel.ApplicationFormName;
      this.tabls[0].requestId = val.TestFormModel.ApplicationFormNo;
      //     // this.newAdviceList=arr
      //     //       this.$set(row, "_isEdit", true);
      //     // this.isEdit = true;
      //     // this.tableRowData = row;
      //     // this.$refs.drops.rowExpansion(row, true);

      this.nowTemp = "newCreateTest";
      this.tablsId = this.tabls[0].Id;
      this.editIndex = Math.random();
    },
    //数据处理
    addData(item, index, str, row) {
      let off = false;
      let on = true;
      // 检验医嘱
      this.$Api
        .getChargeItems({ ClinicItemCode: item.HisMedId })
        .then(async (res) => {
          if (res.Status) {
            let arr = res.Data;
            if (this.oneTabs.isOrder && str === "input") {
              let data =
                index < 0 ? {} : this.oneTabs.TestApplyDetailsModel[index];

              for (
                let i = 0;
                i < this.oneTabs.TestApplyDetailsModel.length;
                i++
              ) {
                if (
                  this.oneTabs.TestApplyDetailsModel[i].DictItemCode ===
                  item.HisMedId
                ) {
                  this.$msg.warning("不允许重复添加相同的检查项");
                  return;
                }
              }
              this.editIndex = Math.random();
              let obj = this.specimenOptions[0] || {};
              let sampleNameList = [];
              if (item.PreSampleCode) {
                for (let i = 0; i < item.PreSampleCode.length; i++) {
                  for (let j = 0; j < this.specimenOptions.length; j++) {
                    if (
                      item.PreSampleCode[i] ===
                      this.specimenOptions[j].SampleCode
                    ) {
                      sampleNameList.push(this.specimenOptions[i].Name);
                    }
                  }
                }
              }
              data["SampleCode"] = item.PreSampleCode || [];
              data["SampleName"] = sampleNameList || [];
              data.DictItemCode = item.HisMedId;
              data.ChargeItems = arr;
              data.CheckedList = [];
              data.ChildItems = [];
              data["NewDepartmentList"] = item.Department
                ? [...new Set(item.Department.split(","))]
                : [];
              data["ParentCategoryCode"] = item.CategoryNo;
              arr.forEach((el) => {
                data.CheckedList.push(el.ChargeItemCode);
                data.ChildItems.push({
                  DictItemCode: el.ChargeItemCode,
                  DictItemName: el.ChargeItemName,
                  IsDeleted: true,
                });
                // data.ChildItems
              });
              data.ItemType = item.OrderItemType;
              data.DictItemName = item.ItemName;
              data.Attention = "";
              data.Price = item.Price;
              data.IsDeleted = false;
              data.InsuranceUseFlag = await this.isMedicalInsuranceMsg({
                HisRegisterId: this.patientMsg.RegistId,
                HisMedId: item.HisMedId,
                OrderType: 8,
              });
              console.log(data.InsuranceUseFlag);
              data._edit = false;

              this.isAdd = this.isEdit;
              if (index < 0) {
                this.oneTabs.TestApplyDetailsModel.push(data);
              }
              return;
            }
            this.$Api
              .getParentCode({ code: item.CategoryNo, type: 8 })
              .then(async (params) => {
                let nameData = params.Data || "";
                let data =
                  index < 0
                    ? {}
                    : this.tabls[this.active].TestApplyDetailsModel[index];

                // let data = {}
                for (var i = 0; i < this.tabls.length; i++) {
                  // if (this.tabls[i].Id === item.Department) {
                  for (
                    var j = 0;
                    j < this.tabls[i].TestApplyDetailsModel.length;
                    j++
                  ) {
                    if (
                      this.tabls[i].TestApplyDetailsModel[j].DictItemCode ===
                        item.HisMedId &&
                      index != j
                    ) {
                      this.$msg.warning("不允许重复添加相同的检验项");
                      if (
                        row &&
                        row.ItemCode ===
                          this.tabls[i].TestApplyDetailsModel[j].DictItemCode
                      ) {
                        row.isCheck = false;
                      }
                      return;
                    }
                  }
                  // }
                }
                // let obj = this.specimenOptions[0] || {};
                this.editIndex = Math.random();
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
                data.DictItemCode = item.HisMedId;
                data.ChargeItems = arr;
                data.CheckedList = [];
                data.ChildItems = [];
                data["NewDepartmentList"] = item.Department
                  ? [...item.Department.split(",")]
                  : [];
                data["ParentCategoryCode"] = item.CategoryNo;
                console.log(arr, "el.ChargeItemCode");
                arr.forEach((el) => {
                  data.CheckedList.push(el.ChargeItemCode);
                  data.ChildItems.push({
                    DictItemCode: el.ChargeItemCode,
                    DictItemName: el.ChargeItemName,
                    IsDeleted: true,
                  });
                  // data.ChildItems
                });
                data.ItemType = item.OrderItemType;
                data.DictItemName = item.ItemName;
                data.Attention = "";
                data.Price = item.Price;
                data.IsDeleted = false;
                data.InsuranceUseFlag = await this.isMedicalInsuranceMsg({
                  HisRegisterId: this.patientMsg.RegistId,
                  HisMedId: item.HisMedId,
                  OrderType: 8,
                });
                data._edit = false;

                this.isAdd = this.isEdit;
                if (this.tabls.length === 1 && this.tabls[0].Id === -1) {
                  this.tabls[0].TestApplyDetailsModel.push(data);
                  this.tabls[0].TestApplyMainModel = {
                    ExcuteDepartment: "",
                    IsEmergency:
                      this.testItemCodeList.includes(item.HisMedId) ||
                      nameData.indexOf("急诊") > -1,
                  };
                  this.tabls[0].Name = nameData || "申请单一";
                  this.tabls[0].Id = this.num++;
                  this.tablsId = this.tabls[0].Id;
                  on = false;
                } else {
                  let obj = this.isBast(item.Department);
                  let isName = this.isName(nameData, data.NewDepartmentList);
                  console.log(this.requestRule, "this.requestRule == 2");
                  if (this.requestRule == 2) {
                    if (
                      index < 0 &&
                      obj &&
                      isName
                      // item.Department.split(",").includes(
                      //   this.tabls[isName["i"]].requestId
                      // )
                    ) {
                      this.tabls[isName["i"]].TestApplyDetailsModel.push(data);
                      // this.tabls[obj["i"]].Id = this.num++;
                      this.tablsId = this.tabls[isName["i"]].Id;
                      on = false;
                    }
                  } else {
                    if (index < 0 && obj) {
                      this.tabls[obj["i"]].TestApplyDetailsModel.push(data);
                      // this.tabls[obj["i"]].Id = this.num++;
                      this.tablsId = this.tabls[obj["i"]].Id;
                      on = false;
                    }
                  }
                }
                if (on && index < 0) {
                  this.tabls.push({
                    TestApplyDetailsModel: [{ ...data }],
                    TestApplyMainModel: {
                      ExcuteDepartment: "",
                      IsEmergency:
                        this.testItemCodeList.includes(item.HisMedId) ||
                        nameData.indexOf("急诊") > -1,
                    },
                    Name:
                      nameData || "申请单" + numTostr(this.tabls.length + 1),
                    Id: this.num++,
                    isOrder: false,
                    guId: "",
                  });
                  this.tablsId = this.tabls[this.tabls.length - 1].Id;
                }
                console.log("this.tabls", this.tabls);
              });
          } else {
            this.$msg.warning(res.Message);
          }
        });
    },
    //选中常用的检验项目
    usedSelect(val, bl) {
      console.log(val);
      this.$Api
        .postUsedDeatil({
          CategoryCode: bl ? val.ParentCode : val.CategoryCode,
          SearchType: 8,
          KeyWord: "",
          DeptCode: "",
          DictItemCode: val.ItemCode,
          HisRegisterId: this.patientMsg.RegistId,
        })
        .then((res) => {
          if (res.Status && res.Data) {
            console.log(res.Data, "wwwwwwww", val);
            res.Data.Test[0] && this.addData(res.Data.Test[0], -1, "", val);
          }
        });
    },
    //筛选申请单的tab切换
    tablsChange(val) {
      for (var i = 0; i < this.tabls.length; i++) {
        if (val === this.tabls[i].Id) {
          this.tabsIndex = i;
          this.oneTabs = this.tabls[i];
        }
      }
    },
    //弹框的返回数据
    alterCallback(bl) {
      console.log(bl);
      if (this.dialogComponent == "declarePatmessage") {
        if (bl) {
          this.$refs.alterComponent.save().then((res) => {
            if (res) {
              this.$store.commit("public/SET_ISSHOW", false);
              this.afterDeclareMessageSubmitAdvice();
            }
          });
        }
      } else {
        console.log(bl, this.nowTemp);
        if (!bl) {
          if (this.nowTemp == "newCreateTest") {
            this.dataToData();
          } else {
            this.$store.commit("public/SET_ISSHOW", false);
          }
        }
      }
    },
    //提交检验的数据
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

      // 新冠肺炎患者申报信息
      // 新冠肺炎 检查检验申报
      let isFind = false;
      this.saveSuccessData.forEach((item) => {
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
        this.dialogComponent = "declarePatmessage";
        (this.dialogWidth = "560px"), (this.dialogTitle = "申报用户信息");
        let obj = documentType.find((item) => {
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
        // this.declareMessage = {};
        this.$store.commit("public/SET_ISSHOW", true);
      } else {
        this.afterDeclareMessageSubmitAdvice();
      }
    },
    afterDeclareMessageSubmitAdvice() {
      if (this.isSignName) {
        let obj = {
          Type: "0",
          Data: [{ Name: "检验申请" }],
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
      let declareParams = [];
      if (this.declareMessage) {
        for (let key in this.declareMessage) {
          let obj = {
            Caption: key,
            CaptionValue: this.declareMessage[key],
          };
          declareParams.push(obj);
        }
      }
      let boj = {
        InHouseId: this.$route.query.id || this.patientMsg.InHouseId,
        OrderList: [],
        HisRegisterId: this.patientMsg.RegistId,

        CASignImg: this.caImgData,
        RegisterInfoList: declareParams,
      };
      for (var i = 0; i < this.saveSuccessData.length; i++) {
        boj.OrderList.push(this.saveSuccessData[i].OrderId);
      }
      this.$Api
        .submitAdvice(boj)
        .then((res) => {
          this.$msg[res.Status ? "success" : "warning"](res.Message);
          console.log(res);
          if (res.Status) {
            this.$store.commit("public/SET_ISSHOW", false);
            this.cancel();
            // 提交检验申请单打印
            let strId = "";
            let ObjectTypes = "";
            let TemplateIds = "";
            let len = boj.OrderList.length;
            boj.OrderList.forEach((item, index) => {
              strId += item;
              if (len - 1 != index) {
                strId += ",";
              }
              ObjectTypes += printObjectType.checkout.objectType + ",";
              TemplateIds += printObjectType.checkout.templateId + ",";
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
              )}&logUserEditTrack=true&documentId=f2f201db-3ca2-47b0-ba81-ab6b0096abd6&mark=true&TemplateIds=${TemplateIds.slice(
                0,
                TemplateIds.length - 1
              )}&templateId=${
                printObjectType.checkout.templateId
              }&ids=${strId}&ismult=true&areaId=${
                this.patientMsg.AreaId
              }&t=${t}`;
              console.log(url);
              this.$store.commit("public/SET_PRINTIFRAMEURL", url);
            }

            this.$store.commit("public/SET_ISSHOW", false);
            console.log("this.nowTemp");
            if (this.nowTemp === "newCreateTest") {
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
    //修改该检验数据
    upData() {
      this.dataToData();
    },
    //数据修改后数据处理
    dataToData() {
      var arr = [];
      for (var i = 0; i < this.saveSuccessData.length; i++) {
        this.saveSuccessData[i].OrderDetails.forEach((el) => {
          el.CheckedList = [];
          if (!el.ChargeItems) {
            el.ChargeItems = [];
          }
          if (!el.ChildItems) {
            el.ChildItems = [];
          }
          el.ChildItems.forEach((a) => {
            el.CheckedList.push(a.DictItemCode);
          });
          el.IsDeleted = false;
        });
        this.saveSuccessData[i].TestFormModel.OrderId = this.saveSuccessData[
          i
        ].OrderId;

        arr.push({
          TestApplyDetailsModel: this.saveSuccessData[i].OrderDetails,
          TestApplyMainModel: this.saveSuccessData[i].TestFormModel,
          Name: this.saveSuccessData[i].TestFormModel.ApplicationFormName,
          requestId: this.saveSuccessData[i].TestFormModel.ApplicationFormNo,
          Id: this.tabls[i].Id,
          isOrder: this.tabls[i].isOrder,
          guId: this.tabls[i].guId,
        });
      }
      this.editIndex = Math.random();
      this.tabls = arr;
      this.tablsId = this.tabls[0].Id;
      this.oneTabs = this.tabls[0];
      this.$store.commit("public/SET_ISSHOW", false);
      this.nowTemp = "newCreateTest";
      console.log(this.tabls);
    },
    //点击一行的数据展示出申请单详情
    selectRow(row) {
      this.saveSuccessData = [
        {
          ...row,
          ApplicationFormName: row.TestFormModel.ApplicationFormName,
          ApplicationFormNo: row.TestFormModel.ApplicationFormNo,
        },
      ];
      this.dialogTitle = "检验申请单";
      this.dialogWidth = "1200px";
      this.dialogComponent = "testDetail";
      this.isFooter = true;
      this.$store.commit("public/SET_ISSHOW", true);
      if (row.Status == 1) {
        this.isFooter = true;
      } else {
        this.isFooter = false;
      }
    },
    //打印申请单
    print(val) {
      clearTimeout(this.timer);
      let t = new Date().getTime();
      let str = window.location.protocol + "\\" + window.location.host;
      let url = `${URLCONFIG.Emr}/Nursing/EditPage.aspx?patientId=${this.patientMsg.PatientId}&originUrl=${str}&inHouseId=${this.patientMsg.InHouseId}&areaType=${this.patientMsg.AreaType}&createUser=940c7df7-a718-e911-80cd-0050568e1b08&objectType=${printObjectType.checkout.objectType}&logUserEditTrack=true&documentId=f2f201db-3ca2-47b0-ba81-ab6b0096abd6&mark=true&templateId=${printObjectType.checkout.templateId}&orderid=${val.OrderId}&areaId=${this.patientMsg.AreaId}&t=${t}`;
      console.log(url);
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

          this.delOldData(this.treeData, data[0].TestApplyDetailsModel);

          // for (let i = 0; i < this.tabls.length; i++) {
          //   this.tabls[i].Name = "申请单" + numTostr(i + 1);
          // }
        })
        .catch(() => {
          this.$msg.info("已取消操作");
        });
    },
    //获取树结构的数据
    getTestTreeData() {
      this.$Api
        .getTestTreeData({ queryKey: this.treeName ? this.treeName : null })
        .then((res) => {
          console.log("data", res);
          if (res.Status) {
            this.treeData = res.Data || [];
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
    delRowTest(row) {
      if (row) {
        console.log(this.oneTabs, row);
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
          if (
            this.tabls[i].TestApplyDetailsModel.length === 0 &&
            this.tabls.length > 1
          ) {
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
    },
    //递归寻找需要删除的数据
    delOldData(treeData, tableList) {
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
    //获取子组件里面选中的科室code
    changrequestId(val, item) {
      console.log(item, val, "111");
      item.requestId = val;
      console.log(this.tabls);
    },
    //判断选中的科室是否是在以前的申请单中
    isBast(val = "") {
      console.log(val, "bvall");
      val = val || "";
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
    isName(name, Department) {
      for (let i = 0; i < this.tabls.length; i++) {
        if (
          this.tabls[i].Name === name &&
          Department.includes(this.tabls[i].requestId)
        ) {
          return { i };
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
  watch: {
    "patientMsg.Status": {
      handler(val) {
        if (val === 8) {
          this.tabsTemp[0].Show = false;
          this.nowTemp = "historyTest";
          this.$Api
            .getTestHistoryList({ patientId: this.patientMsg.PatientId })
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
          this.nowTemp = "newCreateTest";
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
          this.currentObjData.Data[0].Name == "检验申请"
        ) {
          this.caSignOperation.checkData(
            this.user.UserInfo,
            this.currentObjData
          );
        }
      }
    },
  },
  computed: {
    ...mapGetters({
      patientMsg: "public/GET_PATIENTMSG",
      isShow: "public/GET_ISSHOW",
      isRegister: "configuration/GET_ISREGISTER", //是否可挂号
      requestRule: "configuration/GET_TESTRULE",
      signName: "public/GET_SIGNNAME", //签名系统简称
      isSignName: "public/GET_ISSIGNNAME", //是否启用
      isGetCA: "public/GET_ISGETCA", //
      user: "public/GET_USER",
      caImgData: "public/GET_CAIMGDATA", //ca签名图片数据流，医嘱提交处使用
      testItemCodeList: "doctoradvice/GET_TESTITEMCODELIST",
    }),
    active() {
      for (var i = 0; i < this.tabls.length; i++) {
        if (this.tablsId == this.tabls[i].Id) {
          this.tabsIndex = i;
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
  components: {
    startRequest,
    testDoctorAdvice,
    searchDoctorAdvice,
    historyList,
    myAlert,
    testHistory,
    testDetail,
    myTabs,
    medicalNowTree,
    declarePatmessage,
    treeTable,
  },
};
</script>
<style scoped lang='less'>
.check-out {
  padding: 10px 15px;
  height: 100%;
  box-sizing: border-box;
  position: relative;
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
    // height: calc(~"(100% - 40px)");
    position: relative;
    height: calc(~"(100vh - 120px)");
    // overflow: auto;
    .newCreateTest {
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
        min-width: 200px;
        max-width: 500px;
        padding-right: 20px;
        height: 100%;
        //border-right: 1px solid #dfe7f5;

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
    .historyTest {
      height: 100%;
      // display: flex;
      .left {
        width: 130px;
        padding: 0 10px;
        float: left;
        height: 100%;
        border-right: 1px solid #ccc;
        // margin-right: 30px;
      }
      .right {
        // width: 100%;
        height: 100%;
        overflow: hidden;
        padding: 0 10px 0 30px;
        box-sizing: border-box;
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
