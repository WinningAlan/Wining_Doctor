<template>
  <div class="medical-history" ref="medical">
    <el-radio-group v-model="activeName" @change="getMedicalList" fill="#0071E7">
      <el-radio-button :label="1">当前病历</el-radio-button>
      <el-radio-button :label="2">历史病历</el-radio-button>
    </el-radio-group>
    <div class="medical-history-now" v-show="activeName===1">
      <myTabs
        :activeName.sync="activeTab"
        :tabsList="tabsList"
        :tabChange="tabChange"
        class="left-tree"
      >
        <div slot="1">
          <p class="tabs-button">
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="checkAllChange"
            >全选</el-checkbox>
            <el-tooltip
              class="item"
              effect="dark"
              :open-delay="400"
              content="归档"
              placement="top"
              v-if="isFiles"
            >
              <svg-icon iconClass="archive" class="my-icon" @click="putEmrArchiving"></svg-icon>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :open-delay="400" content="打印" placement="top">
              <svg-icon iconClass="print" class="my-icon" @click="print('list')"></svg-icon>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :open-delay="400" content="新增" placement="top">
              <svg-icon
                iconClass="add"
                class="my-icon"
                @click="showAlter('','templateData')"
                v-if="isFiles"
              ></svg-icon>
            </el-tooltip>
          </p>
          <medicalNowTree
            :callBack="nodeClick"
            show-checkbox
            ref="medicalHistoryNow"
            :default-expanded-keys="defaultExpanded.medicalHistoryNow"
            @check-change="checkChange"
            :treeData="medicalNowList"
            children="MedicalRecordInfos"
            type="medicalHistoryNow"
          ></medicalNowTree>
        </div>
        <div slot="2">
          <div class="search">
            <el-input
              placeholder="请输入内容"
              v-model.trim="treeName"
              suffix-icon="el-icon-search"
              @input="searchTreeData"
            ></el-input>
            <!-- <span class="el-icon-search search-button"></span> -->
          </div>
          <div class="tree-paragraph-list cl">
            <el-tooltip class="item" effect="dark" :open-delay="400" content="删除" placement="top">
              <svg-icon iconClass="del" class="my-icon" @click="delParagraph"></svg-icon>
            </el-tooltip>

            <el-popover placement="top" width="160" v-model="visible">
              <p>模板分类名称：</p>
              <el-input v-model="groupName" placeholder="请输入模板分类名称" size="small"></el-input>
              <div style="text-align: right; margin-top: 10px">
                <el-button size="mini" type="text" @click="addGroup(false)">取消</el-button>
                <el-button type="primary" size="mini" @click="addGroup(true)">确定</el-button>
              </div>
              <!-- <el-tooltip placement="top" effect="light" content="新增">
            <span slot="reference" class="icon add" @click="visible=true"></span>
              </el-tooltip>-->
              <!-- <span slot="reference" class="icon add" @click="isGroupAlter"></span> -->
              <el-tooltip
                slot="reference"
                class="item"
                effect="dark"
                :open-delay="400"
                content="新增"
                placement="top"
              >
                <svg-icon iconClass="add" class="my-icon"></svg-icon>
              </el-tooltip>
            </el-popover>
          </div>
          <medicalNowTree
            :default-expanded-keys="defaultExpanded.paragraph"
            ref="paragraph"
            :callBack="nodeClick"
            :treeData="paragraphList"
            children="MedicalRecordInfos"
            type="paragraph"
            class="paragraph"
          ></medicalNowTree>
          <!-- <div class="search">
            <el-input placeholder="请输入内容" v-model.trim="treeName" suffix-icon="el-icon-search"></el-input>
            
          </div>
          <medicalNowTree
            :default-expanded-keys="defaultExpanded.paragraph"
            ref="paragraph"
            :callBack="nodeClick"
            :treeData="paragraphList"
            :filter-node-method="filterNode"
            children="MedicalRecordInfos"
            type="paragraph"
          ></medicalNowTree>-->
        </div>
      </myTabs>
      <div class="medical-history-content">
        <div class="content-top cl">
          <!-- <el-tooltip
            class="item"
            effect="dark"
            :open-delay="400"
            :content="isExamine?'退出留痕模式':'查看书写痕迹'"
            placement="top"
          >
            <svg-icon
              :iconClass="isExamine?'examine':'examineout'"
              class="my-icon"
              @click="activeNodeData.medicalHistoryNow.Status!==3&&medicalOperation(isExamine?'markOut':'PrintTest')"
              :class="{disabled:!(activeNodeData.medicalHistoryNow.Status!==3)}"
            ></svg-icon>
          </el-tooltip>-->
          <el-tooltip class="item" effect="dark" :open-delay="400" content="打印" placement="top">
            <svg-icon
              iconClass="print"
              class="my-icon"
              @click="activeNodeData.medicalHistoryNow.Status!==3&&print('medicalNow',activeNodeData.medicalHistoryNow.Id)"
              :class="{disabled:!(activeNodeData.medicalHistoryNow.Status!==3)}"
            ></svg-icon>
          </el-tooltip>
          <el-tooltip
            class="item"
            :class="{disabled:isDisabled}"
            effect="dark"
            :open-delay="400"
            content="作废"
            placement="top"
            v-show="activeNodeData.medicalHistoryNow.Status===1"
          >
            <svg-icon
              iconClass="cancellation"
              class="my-icon"
              @click="(!isDisabled) && putEmrInvalid()"
              v-if="isFiles"
            ></svg-icon>
          </el-tooltip>
          <el-tooltip
            class="item"
            :class="{disabled:isDisabled}"
            effect="dark"
            :open-delay="400"
            content="取消作废"
            placement="top"
            v-show="activeNodeData.medicalHistoryNow.Status===3"
          >
            <svg-icon
              iconClass="revocation"
              class="my-icon"
              @click="(!isDisabled) && putEmrRestore()"
              v-if="isFiles"
            ></svg-icon>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :open-delay="400" content="保存" placement="top">
            <svg-icon
              v-if="isFiles"
              iconClass="save"
              class="my-icon"
              @click="(activeNodeData.medicalHistoryNow.Status===1 &&!isDisabled)&&medicalOperation('save')"
              :class="{disabled:activeNodeData.medicalHistoryNow.Status!==1 || isDisabled}"
            ></svg-icon>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :open-delay="400" content="另存为模板" placement="top">
            <svg-icon
              @click="activeNodeData.medicalHistoryNow.Status!==3&&medicalOperation('saveTemplate')"
              iconClass="saveAs"
              class="my-icon"
              :class="{disabled:!(activeNodeData.medicalHistoryNow.Status!==3)}"
            ></svg-icon>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :open-delay="400" content="另存为段落" placement="top">
            <svg-icon
              @click="activeNodeData.medicalHistoryNow.Status!==3&&medicalOperation('saveSection')"
              iconClass="paragraph"
              class="my-icon big"
              :class="{disabled:!(activeNodeData.medicalHistoryNow.Status!==3)}"
            ></svg-icon>
          </el-tooltip>

          <mySelect
            v-if="isFiles"
            :selectData="citeData"
            :disabled="activeNodeData.medicalHistoryNow.Status!==1 || isDisabled"
            :itemClick="showAlter"
            type="citeData"
          ></mySelect>
          <mySelect
            v-if="isFiles"
            :disabled="activeNodeData.medicalHistoryNow.Status!==1 || isDisabled"
            :selectData="toolData"
            :itemClick="showAlter"
            type="toolData"
          ></mySelect>
        </div>
        <div
          class="content-center"
          v-loading="showLoading"
          element-loading-text="拼命加载中"
          element-loading-background="rgba(200, 200, 200, .6)"
        >
          <iframe
            ref="iframe"
            class="iframeStyle"
            :src="medicalNow"
            scrolling="yes"
            frameborder="0"
            id="medicalNow"
          ></iframe>
        </div>
        <div class="content-bottom" v-show="activeNodeData.medicalHistoryNow.InHospitalId">
          <p class="right" v-if="activeNodeData.medicalHistoryNow.Status===2">
            归档：
            <span>{{activeNodeData.medicalHistoryNow.UpdateUserName}} {{activeNodeData.medicalHistoryNow.UpdateTime|timeFilter}}</span>
          </p>
          <p class="right">
            最后修改：
            <span>{{activeNodeData.medicalHistoryNow.UpdateUserName ||activeNodeData.medicalHistoryNow.CreateUserName}} {{(activeNodeData.medicalHistoryNow.UpdateTime||activeNodeData.medicalHistoryNow.CreateTime)|timeFilter}}</span>
          </p>
          <p class="right">
            创建：
            <span>{{activeNodeData.medicalHistoryNow.CreateUserName}}</span>
            <el-date-picker
              v-if="activeNodeData.medicalHistoryNow._isEdit"
              :clearable="false"
              v-model="activeNodeData.medicalHistoryNow.CreateTime"
              @change="changeTime"
              class="time"
              type="datetime"
              v-focus="true"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              placeholder="选择日期时间"
              @blur="activeNodeData.medicalHistoryNow._isEdit=false"
              default-time="12:00:00"
            ></el-date-picker>
            <span
              class="time"
              @dblclick="activeNodeData.medicalHistoryNow.Status===1&&!isDisabled&&$set(activeNodeData.medicalHistoryNow,'_isEdit',true)"
              v-else
            >{{activeNodeData.medicalHistoryNow.CreateTime|timeFilter}}</span>
          </p>
          <p class="right">
            状态：
            <span>{{activeNodeData.medicalHistoryNow.Status===1?'已保存':activeNodeData.medicalHistoryNow.Status===2?'已归档':'已作废'}}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="medical-history-now medical-history-old" v-show="activeName===2">
      <div class="left-tree">
        <medicalNowTree
          :callBack="nodeClick"
          :default-expanded-keys="defaultExpanded.medicalHistoryOld"
          show-checkbox
          ref="medicalHistoryOld"
          :treeData="medicalOldList"
          children="MedicalRecordInfos"
          type="medicalHistoryOld"
        >
          <el-tooltip
            slot="medicalHistoryOld"
            slot-scope=" {scope}"
            effect="dark"
            :open-delay="400"
            content="打印"
            placement="top"
          >
            <svg-icon iconClass="print" class="my-icon hidden" @click.stop="print('old',scope)"></svg-icon>
          </el-tooltip>
        </medicalNowTree>
      </div>
      <div class="medical-history-content">
        <div class="content-top cl">
          <el-tooltip class="item" effect="dark" :open-delay="400" content="打印" placement="top">
            <svg-icon
              iconClass="print"
              class="my-icon"
              @click="activeNodeData.medicalHistoryOld.Id&&print('medicalOld',activeNodeData.medicalHistoryOld.Id)"
              :class="{disabled:!activeNodeData.medicalHistoryOld.Id}"
            ></svg-icon>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :open-delay="400" content="另存为模板" placement="top">
            <svg-icon
              iconClass="saveAs"
              @click="activeNodeData.medicalHistoryOld.Id&&medicalOperation('saveTemplate','medicalOld')"
              class="my-icon"
              :class="{disabled:!activeNodeData.medicalHistoryOld.Id}"
            ></svg-icon>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :open-delay="400" content="另存为段落" placement="top">
            <svg-icon
              @click="activeNodeData.medicalHistoryOld.Id&&medicalOperation('saveSection','medicalOld')"
              iconClass="paragraph"
              class="my-icon big"
              :class="{disabled:!activeNodeData.medicalHistoryOld.Id}"
            ></svg-icon>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :open-delay="400" content="复制" placement="top">
            <svg-icon
              v-if="isFiles"
              iconClass="copy"
              class="my-icon"
              @click="activeNodeData.medicalHistoryOld.Id&&copeMedical(activeNodeData.medicalHistoryOld.Id)"
              :class="{disabled:!activeNodeData.medicalHistoryOld.Id}"
            ></svg-icon>
          </el-tooltip>
        </div>
        <div
          class="content-center"
          v-loading="showLoading"
          element-loading-text="拼命加载中"
          element-loading-background="rgba(200, 200, 200, 0.6)"
        >
          <iframe
            ref="iframe"
            class="iframeStyle"
            :src="medicalOld"
            scrolling="yes"
            frameborder="0"
            id="medicalOld"
          ></iframe>
        </div>
        <div class="content-bottom" v-show="activeNodeData.medicalHistoryOld.Id">
          <p class="right" v-if="activeNodeData.medicalHistoryOld.Status===2">
            归档：
            <span>{{activeNodeData.medicalHistoryOld.UpdateUserName}} {{activeNodeData.medicalHistoryOld.UpdateTime|timeFilter}}</span>
          </p>
          <p class="right">
            最后修改：
            <span>{{activeNodeData.medicalHistoryOld.UpdateUserName}} {{activeNodeData.medicalHistoryOld.UpdateTime|timeFilter}}</span>
          </p>
          <p class="right">
            创建：
            <span>{{activeNodeData.medicalHistoryOld.CreateUserName}} {{activeNodeData.medicalHistoryOld.CreateTime|timeFilter}}</span>
          </p>
          <p class="right">
            状态：
            <span>{{activeNodeData.medicalHistoryOld.Status===1?'已保存':activeNodeData.medicalHistoryOld.Status===2?'已归档':'已作废'}}</span>
          </p>
        </div>
      </div>
    </div>
    <myAlter
      :title="this[alterType].name"
      :visible="isShow"
      :width="this[alterType].width"
      :callback="closeAlter"
      :isfooter="!!this[alterType].btn.length"
      :btn="this[alterType].btn"
    >
      <component
        ref="aletrData"
        :is="this[alterType].components"
        :initialize="isShow"
        :alterData="this[alterType]"
        :idList="checkArr"
        :teamplateLeveList="paragraphList"
      >
        <el-button slot="close" @click="closeAlter(false)">取消</el-button>
      </component>
    </myAlter>
  </div>
</template>

<script>
import myTabs from "../../components/common/my-tabs.vue";
import medicalNowTree from "../../components/doctorAdvice/medicalHistory/medicalNowTree.vue";
import mySelect from "../../components/doctorAdvice/medicalHistory/my-select.vue";
import { mapGetters } from "vuex";
import myAlter from "../../components/common/myAlter.vue";
import dataReferenceAlter from "../../components/doctorAdvice/medicalHistory/dataReferenceAlter.vue";
import templateAlter from "../../components/doctorAdvice/medicalHistory/templateAlter.vue";
import { GetFormatDateTime, getServerTimeRandom } from "@/utils/public";
import assistantAlter from "../../components/doctorAdvice/medicalHistory/assistantAlter.vue";
import bulkPrint from "../../components/doctorAdvice/medicalHistory/bulkPrint.vue";
import { dataReference } from "@/module/alertData.js";
import CASign from "@/utils/caSign.js";
import paragraphAlter from "../../components/doctorAdvice/medicalHistory/paragraphAlter";
const specialControl = ["toothBitmap", "menstrualHistory", "fetalHeartTu"];
export default {
  name: "medicalHistory", //电子病历
  components: {
    myTabs,
    medicalNowTree,
    mySelect,
    myAlter,
    dataReferenceAlter,
    templateAlter,
    assistantAlter,
    bulkPrint,
    paragraphAlter
  },
  computed: {
    ...mapGetters({
      patientMsg: "public/GET_PATIENTMSG",
      user: "public/GET_USER",
      userName: "public/GET_USERNAME",
      showLoading: "public/GET_SHOWLOADING", //模板显示loading
      defaultTemplent: "public/GET_DEFAULTTEMPLENT", //诊疗区对应的默认病历模板
      selectArea: "home/GET_SELECTAREA", //所在区域
      caseData: "case/GET_CASEDATA",
      medicalAddEvent: "public/GET_MEDICALADDEVENT", // 是否监听都昌事件
      signName: "public/GET_SIGNNAME", //签名系统简称
      isSignName: "public/GET_ISSIGNNAME", //是否启用
      isGetCA: "public/GET_ISGETCA", //
      user: "public/GET_USER"
    }),
    userId() {
      return this.user.UserInfo.Id;
    },
    editRole() {
      return this.user.TemplateRole || {};
    }
  },
  created() {
    this.citeData = JSON.parse(JSON.stringify(dataReference));
    this.getMedicalList(1);
    this.$store.commit("public/SET_MEDICALADDEVENT", true);

    this.selectArea.DiagnosisAreaType === 3
      ? this.citeData.list.push({ text: "体征观察", value: 6 })
      : this.citeData.list.push({ text: "护理记录", value: 5 });
    if (this.isSignName) {
      this.caSignOperation = new CASign(this, this.signName);
    }
    this.$Api.getAllMedicalCategories().then(res => {
      if (res.Status) {
        let data = res.Data || [];
        this.paragraphList = data;
        console.log(data, "段落");
      }
    });
  },
  beforeDestroy() {
    clearTimeout(this.timer);
    window.removeEventListener("message", this.loadOver, false);
    this.$store.commit("public/SET_MEDICALADDEVENT", false);
    this.activeNodeData.medicalHistoryNow.Status === 1 &&
      this.isSave &&
      this.medicalOperation("realtimesave");
    this.isShowMsg = false;
  },
  data() {
    this.copeTime=0
    return {
      groupName: "", //段落名称
      visible: false,
      caSignOperation: {}, //
      currentObjData: "",
      isExamine: false, //查看痕迹，退出查看痕迹模式
      checkArr: [], //打印选中的病历
      isShow: false, //是否显示弹窗
      alterType: "templateData", //弹窗类型
      bulkPrintData: {
        name: "批量打印预览",
        width: "1111px",
        btn: [],
        components: "bulkPrint"
      }, //批量打印弹窗
      templateData: {
        name: "新建病历",
        width: "1111px",
        btn: ["引用", "取消"],
        components: "templateAlter"
      }, //新增弹窗
      citeData: {},
      toolData: {
        name: "病历助手",
        activeName: 1,
        width: "1300px",
        components: "assistantAlter",
        btn: [],
        list: [
          {
            text: "计算器",
            value: 1
          },
          {
            text: "特殊符号",
            value: 2
          },
          {
            text: "插入表格",
            value: 4
          },
          {
            text: "高拍仪",
            value: 5
          }
        ]
      },
      medicalOld: "", //历史病历url
      medicalNow: "", //当前病历url
      paragraphList: [], //段落数据tree
      medicalOldList: [], //历史病历tree
      medicalNowList: [], // 当前病历tree
      activeNodeData: {
        medicalHistoryNow: {},
        medicalHistoryOld: {},
        paragraph: {},
        nowDefault: [],
        oldDefault: [],
        paragraphDefault: []
      }, //选中的节点
      defaultExpanded: {
        medicalHistoryNow: [],
        medicalHistoryOld: [],
        paragraph: []
      }, //默认展开的节点
      activeName: 1,
      tabsList: [
        { value: "1", label: "当前病历" },
        { value: "2", label: "段落引用" }
      ],
      treeName: "", //段落搜索
      activeTab: "1",
      isIndeterminate: false, //全选中间状态
      checkAll: false, //是否全选
      isFiles: true,
      isDisabled: false,
      currentType: "",
      currentId: "",
      adviceList: [],
      paragraphData: {
        name: "新建段落",
        width: "400px",
        btn: ["保存", "取消"],
        components: "paragraphAlter"
      },
      cope:{
          name: "cope",
        width: "400px",
        btn: [],
        components: "paragraphAlter"
      }
    };
  },
  watch: {
    treeName(val) {
      this.$refs.paragraph.getNode().filter(val);
    },
    caseData: {
      handler(val) {
        if (val) {
          console.log(val);

          // if(val.Is){}
          if (val.IsHistory) {
            this.activeName = 2;
            this.getMedicalList(2);
          } else {
            this.activeName = 1;
            this.getMedicalList(1);
          }
        }
      },
      deep: true,
      immediate: true
    },
    medicalAddEvent: {
      immediate: true,
      handler: function(val) {
        console.log(val, "是否监听事件");
        if (val) {
          window.removeEventListener("message", this.loadOver, false);
          window.addEventListener("message", this.loadOver, false);
        } else {
          window.removeEventListener("message", this.loadOver, false);
        }
      }
    },
    isGetCA: function(val) {
      if (val) {
        // 验证
        if (
          this.currentObjData.Data &&
          this.currentObjData.Data[0].Name == "病历保存"
        ) {
          this.caSignOperation.checkData(
            this.user.UserInfo,
            this.currentObjData
          );
        }
      }
    }
  },

  methods: {
    addGroup(bl) {
      if (bl) {
        this.$Api
          .addMedicalCategorie({
            //  "MedicalSectionCategoryId": "00000000-0000-0000-0000-000000000000",
            Name: this.groupName,
            CreateUser: this.user.UserInfo.Id
          })
          .then(res => {
            this.$msg[res.Status ? "success" : "warning"](res.Message);
            if (res.Status) {
              this.visible = false;
              this.groupName = "";
              this.tabChange("2");
            }
          });
      } else {
        this.visible = false;
        this.groupName = "";
      }
    },
    //删除段落模板
    delParagraph() {
      // this.activeNodeData
      console.log(this.activeNodeData.paragraph, "this.activeNodeData");
      if (!this.activeNodeData.paragraph.Id)
        return this.$msg.info("请选择需要删除的段落菜单");
      this.$confirm("该操作将删除段落目录,是否继续", "", {
        type: "warning"
      })
        .then(() => {
          let categoryId = "00000000-0000-0000-0000-000000000000";
          let sectionId = "00000000-0000-0000-0000-000000000000";
          if (
            this.activeNodeData.paragraph.PersonalMedicalRecordSectionModels
          ) {
            categoryId = this.activeNodeData.paragraph.Id;
          } else {
            sectionId = this.activeNodeData.paragraph.Id;
          }
          this.$Api.delMedicalCategorie({}, categoryId, sectionId).then(res => {
            this.$msg[res.Status ? "success" : "warning"](res.Message);
            if (res.Status) {
              this.activeNodeData.paragraph = {};
              this.tabChange("2");
            }
          });
        })
        .catch(() => {
          this.$msg.info("已取消操作");
        });
    },
    searchTreeData() {
      this.tabChange("2");
    },
    // 段落搜索
    // filterNode(value, data) {
    //   if (!value) return true;
    //   console.log(data);
    //   // return true
    //   return data.SectionContent.indexOf(value) !== -1;
    // },
    // 病历操作-保存，留痕、另存模板、另存段落
    medicalOperation(type, id = "medicalNow") {
      console.log(this.activeNodeData);
      console.log(type, this.activeNodeData.medicalHistoryNow.Status, 999);
      this.currentType=type
      this.currentId = id
      if (
        (!this.activeNodeData.medicalHistoryNow.Id && id === "medicalNow") ||
        this.showLoading
      )
        return;
      if (type === "save") {
        this.isShowMsg = true;
      }
      if (type === "saveSection") {
        this.alterType = "paragraphData";
        this.isShow = true;
        this.BtnLoading = false;
        this.paragraphType = type;
        this.paragraphId = id;
        return;
      }
      if (type === "PrintTest" || type === "markOut")
        this.isExamine = !this.isExamine;
        if(type==='saveTemplate'&&(id==='medicalNow'&&this.medicalNow.indexOf("mark=true")>-1||id==='medicalOld')){
          // if(id==='medicalNow'&&this.medicalNow.indexOf("mark=true")>-1||id==='medicalOld'){
             document
            .getElementById(id)
            .contentWindow.postMessage('markOut', window.URLCONFIG.Emr);
            setTimeout(() => {
              document.getElementById(id)
            .contentWindow.postMessage(type, window.URLCONFIG.Emr);
            })
            return
          // }
        }
      // if (this.activeNodeData.medicalHistoryNow.Status !== 1) {
      //   if (type === "saveTemplate" || type === "print") {
      //     return this.handleOperation(type, id);
      //   }

      //   let str = type === "PrintTest" ? "PrintTest" : "mark";
      //   type = "markOut";
      //   setTimeout(() => {
      //     document
      //       .getElementById(id)
      //       .contentWindow.postMessage(str, window.URLCONFIG.Emr);
      //   }, 0);
      // }
      console.log(this.activeNodeData.medicalHistoryNow, type, "dfaasfa");
      if (type == "save" && this.isSignName) {
        let obj = {
          Type: "0",
          Data: [{ Name: "病历保存" }],
          No: this.user.UserInfo.No,
          UserName: this.user.UserInfo.Name
        };
        this.currentId=id
        this.currentType=type
        this.currentObjData = obj;
        this.caSignOperation.KeyVerify();
      } else {

        document
        .getElementById(id)
        .contentWindow.postMessage(type, window.URLCONFIG.Emr);
      }
    },
    handleOperation() {
      console.log(this.currentType, this.currentId);
      if (this.alterType === "paragraphData") {
        let data = this.$refs.aletrData.getData();
        console.log(data, "data", this.paragraphType, this.paragraphId);
        if (data.ParentId && data.Name) {
          document.getElementById(this.paragraphId).contentWindow.postMessage(
            {
              type: this.paragraphType,
              msg: {
                categoryid: data.ParentId,
                sectionname: data.Name
              }
            },
            window.URLCONFIG.Emr
          );
        }
      }else if(this.alterType==='cope'){
      this.isShowMsg = false;
      this.isCope = true;
      this.activeNodeData.medicalHistoryNow = {};
      this.loadIframe("cope", this.copeId);
      }else {
        document
          .getElementById(this.currentId)
          .contentWindow.postMessage(this.currentType, window.URLCONFIG.Emr);
          if(this.currentId!=="medicalNow"){
          this.isShow = false;
          this.activeNodeData.medicalHistoryNow = {};
          this.isNewAdd = true;
          this.isShowMsg = true;
          }

      }
    },
    // 模板加载完成
    loadOver(event) {
      // 不处理自身窗口的message

      if (window.parent !== event.source) {
        console.log(event.data, this.checkAll, "模板加载完成");
        let data = event.data;
        // 模板加载完成
        if (data.type === "load") {
          if (this.isFirst) {
            this.isFirst = false;
            console.log("isFirst");
            this.timer = setTimeout(() => {
              this.tabChange("1");
            }, 300);
            return;
          } else if (this.isCope) {
            // 复制病历
            this.isCope = false;
            this.$msg[data.status ? "success" : "warning"](
              data.status
                ? `该模版已复制到“当前病历”里,请切换到“当前病历”进行编辑。`
                : "复制病历失败"
            );
            return;
          }
          this.getAdviceList();
          this.$store.commit("public/SET_SHOWLOADING", false);
          // 病历保存
        } else if (data.type === "save") {
          if (this.isNewAdd) {
            this.timer = setTimeout(() => {
              data.status && this.tabChange("1");
            }, 300);
            this.isNewAdd = false;
            this.$msg[data.status ? "success" : "warning"](
              data.status ? "新增病历成功" : "新增病历失败"
            );
          } else {
            if (data.status) {
              this.activeNodeData.medicalHistoryNow.UpdateTime = GetFormatDateTime();
              this.activeNodeData.medicalHistoryNow.UpdateUserName = this.userName;
            }
            // 保存成功是否显示消息
            if (this.isShowMsg) {
              let str = data.status ? "病历保存成功" : "病历保存失败";
              this.$msg[data.status ? "success" : "warning"](str);
              this.isShowMsg = false;
            }
          }
          // 段落另存为
        } else if (data.type === "saveSection") {
          this.$msg[data.status ? "success" : "warning"](
            data.status ? "段落模板保存成功" : "段落模板保存失败"
          );
          if (data.status) {
            this.isShow = false;
            this.tabChange("2");
            if (this.alterType === "paragraphData") {
              this.$refs.aletrData.clearData();
            }
          }
          // this.$msg[data.status ? "success" : "warning"](
          //   data.status ? "段落模板保存成功" : "段落模板保存失败"
          // );
          // data.status && this.tabChange("2");
          // 模板另存为
        } else if (data.type === "saveTemplate") {
          if(data.status){
          this.$msg[data.status ? "success" : "warning"](
            data.status ? "病历模板保存成功" : "病历模板保存失败"
          );
          }
          if(this.activeName === 1 &&this.medicalNow.indexOf("mark=true")>-1||this.activeName === 2){
           this.medicalOperation("mark",this.activeName === 1 ? "medicalNow" : "medicalOld");
          }
          // 插入数据
        } else if (data.type === "insertData") {
          this.$msg[data.status ? "success" : "warning"](
            data.status ? "引用数据成功" : "引用数据失败"
          );
          // 插入表格
        } else if (data.type === "insertHtml") {
          this.$msg[data.status ? "success" : "warning"](
            data.status ? "插入成功" : "插入失败"
          );
          this.isShow = false;
        } else if (specialControl.includes(data.type)) {
          this.$msg[data.status ? "success" : "warning"](
            data.status ? "插入成功" : "插入失败"
          );
          this.isShow = false;
        } else if (data.type === "ismark") {
          //是否进入预览模式
          if (data.status) {
            this.medicalOperation(
              "print",
              this.activeName === 1 ? "medicalNow" : "medicalOld"
            );
            this.medicalOperation("markOut");
          } else {
            this.timer = setTimeout(() => {
              this.medicalOperation("ismark");
            }, 300);
          }
        } else if (data.type === "realtimesave") {
          console.log(
            "realtimesaverealtimesaverealtimesaverealtimesaverealtimesaverealtimesave"
          );
          this.tabChange("1");
        }
      }
    },
    // 改变病历书写时间
    changeTime(val) {
      this.$Api
        .updateEmrTime({
          id: this.activeNodeData.medicalHistoryNow.Id,
          time: val
        })
        .then(res => {
          this.$msg[res.Status ? "success" : "warning"](res.Message);
          if (res.Status) {
            // this.activeNodeData.medicalHistoryNow._isEdit=true
            this.activeNodeData.medicalHistoryNow.UpdateTime = val;
            this.activeNodeData.medicalHistoryNow.CreateUserName = this.activeNodeData.medicalHistoryNow.UpdateUserName = this.userName;
          }
        });
      console.log(this.activeNodeData.medicalHistoryNow.CreateTime, val);
    },
    // 病历复制
    copeMedical(id) {
      let now =new Date().getTime();
      if(now-this.copeTime>3000){
        this.copeTime=now
      }else{
        return
      }
        let  isDefer = this.activeNodeData.medicalHistoryNow.Status === 1;
        isDefer && this.isSave && this.medicalOperation("realtimesave");
      console.log('dsaadsadsa');
      this.activeNodeData.medicalHistoryNow.Status === 1&&!this.isDisabled &&
        this.medicalOperation("save");
        this.alterType='cope'
        this.copeId=id
        if (this.isSignName) {
          let obj = {
            Type: "0",
            Data: [{ Name: "病历保存" }],
            No: this.user.UserInfo.No,
            UserName: this.user.UserInfo.Name
          };
          this.currentObjData = obj;
          this.caSignOperation.KeyVerify();
        } else {
          this.handleOperation()
        }

    },
    // 打印
    print(type, data) {
      if (type === "list") {
        // 批量打印

        let dom = this.$refs.medicalHistoryNow.getNode();
        let checkArr = dom.getCheckedNodes(true);
        let checkList = this.sortArrList(checkArr);

        console.log("批量打印", checkList);
        if (!checkList.length) return this.$msg.info("未选择打印的病历！");
        this.checkArr = checkList;
        this.alterType = "bulkPrintData";
        this.isShow = true;
      } else if (type === "old") {
        // 历史病历打印
        let dom = this.$refs.medicalHistoryOld.getNode();
        let checkArr = dom.getCheckedNodes(true);
        let checkList = this.sortArrList(checkArr);
        console.log("old", data);
        let arr = [];
        data.MedicalRecordInfos.forEach(item => {
          checkList.includes(item.Id) && arr.push(item.Id);
        });
        console.log(arr, "raar");
        if (!arr.length) return this.$msg.info("未选择打印的病历！");
        this.checkArr = arr;
        this.alterType = "bulkPrintData";
        this.isShow = true;
      } else {
        if (!type) return;
        // 单个打印
        if (
          this.activeNodeData.medicalHistoryNow.Status === 1 &&
          this.activeName === 1&&!this.isDisabled
        ) {
          this.medicalOperation("mark");
          this.medicalOperation("ismark");

          // this.$nextTick(()=>{
          // clearTimeout(this.printTimer);
          // this.printTimer = setTimeout(() => {
          //   this.medicalOperation("print", type);
          //   this.medicalOperation("markOut");
          // }, 2000);
        } else {
          console.log("打印");
          this.medicalOperation("print", type);
        }

        console.log(type, data, "单个打印");
      }
    },
    // 病历作废
    putEmrInvalid() {
      if (this.activeNodeData.medicalHistoryNow.Status !== 1) return;
      this.$confirm("该操作将作废该病历,是否继续", "", {
        type: "warning"
      })
        .then(() => {
          this.$Api
            .putEmrInvalid({ id: this.activeNodeData.medicalHistoryNow.Id })
            .then(res => {
              this.$msg[res.Status ? "success" : "warning"](res.Message);
              if (res.Status) {
                this.activeNodeData.medicalHistoryNow.Status = 3;
                this.$refs.medicalHistoryNow
                  .getNode()
                  .setChecked(this.activeNodeData.medicalHistoryNow, false);
                this.medicalOperation("mark");
                // this.loadIframe('medicalHistoryNow','',+new Date())
              }
            });
        })
        .catch(() => {
          this.$msg.info("已取消操作");
        });
    },
    // 撤销病历作废
    putEmrRestore() {
      // if (!this.activeNodeData.medicalHistoryNow.Id) return;
      this.$Api
        .putEmrRestore({ id: this.activeNodeData.medicalHistoryNow.Id })
        .then(res => {
          this.$msg[res.Status ? "success" : "warning"](res.Message);
          if (res.Status) {
            this.activeNodeData.medicalHistoryNow.Status = 1;
            this.medicalOperation("markOut");

            // this.loadIframe('medicalHistoryNow','',+new Date())
          }
        });
    },
    // 病历归档
    putEmrArchiving() {
      let Ids = [];
      this.medicalNowList.forEach(item => {
        item.MedicalRecordInfos.forEach(el => {
          el.Status === 1 && Ids.push(el.Id);
        });
      });
      if (!Ids.length) return this.$msg.info("没有可归档的病历");
      this.$confirm("该操作将归档所有病历,是否继续？", "", {
        type: "warning"
      })
        .then(() => {
          this.$Api.putEmrArchiving({ Ids }).then(res => {
            this.$msg[res.Status ? "success" : "warning"](res.Message);
            if (res.Status) {
              this.tabChange("1");
              if (this.activeNodeData.medicalHistoryNow.Status === 1) {
                this.activeNodeData.medicalHistoryNow.Status = 2;
                this.activeNodeData.medicalHistoryNow.UpdateTime = GetFormatDateTime();
                this.activeNodeData.medicalHistoryNow.UpdateUserName = this.userName;
                this.medicalOperation("mark");
              }
            }
          });
        })
        .catch(() => {
          this.$msg.info("已取消操作");
        });
    },
    // 选中树节点
    nodeClick(data, type, patientKey) {
      let isDefer = false;
      if (type === "medicalHistoryNow") {
        this.isExamine = false;
        isDefer = this.activeNodeData.medicalHistoryNow.Status === 1;
        isDefer && this.isSave && this.medicalOperation("realtimesave");
        console.log(data, "9999", isDefer && this.isSave);

        this.isShowMsg = false;
      }
      this.activeNodeData[type] = data;
      this.defaultExpanded[type] = [patientKey];
      if (
        type === "paragraph" &&
        this.activeNodeData.medicalHistoryNow.Status === 1
      ) {
        // 段落引用
        if (data.SectionContent) {
          document
            .getElementById("medicalNow")
            .contentWindow.postMessage(
              { type: "insertData", msg: data.SectionContent.replace(/\r\n/g,'<p></p>') },
              window.URLCONFIG.Emr
            );
        }
      }
      if (isDefer) {
        //自动保存成功
        setTimeout(() => {
          type !== "paragraph" && this.loadIframe(type);
        }, 300);
      } else {
        type !== "paragraph" && this.loadIframe(type);
      }
    },
    // 加载iframe
    loadIframe(type, templateId) {
      let keyName = type === "medicalHistoryNow" ? "medicalNow" : "medicalOld";
      let str = "";

      let obj = {
        patientId: this.patientMsg.PatientId,
        inHospPatId: this.patientMsg.InHouseId||this.$route.query.id,
        areaType: this.patientMsg.AreaType||1,
        createUser: this.user.UserInfo.Id,
        originUrl: window.location.protocol + "\\" + window.location.host,
        objectType: 12,
        isSignName:!!this.isSignName,
        UserNo: this.user.UserInfo.No
      };
      console.log("obj", obj);
      // 加载不显示的模板
      if (templateId) {
        if (type === "cope") {
          obj.documentId = templateId;
          obj.isCopy = true;
        } else {
          obj.templateId = templateId;
        }
        obj.isDirectSave = true;
        obj.t = +new Date();
        keyName = type;
      } else {
        // 加载显示的模板
        // 是否留痕模式
        // obj.logUserEditTrack = type === "medicalHistoryNow";
        obj.logUserEditTrack = false;

        obj.documentId = this.activeNodeData[type].Id;
        obj.oriTemplateId = this.activeNodeData[type].OriTemplateId;

        //  if(this.editRole.Person && this.activeNodeData.medicalHistoryNow.CreateUserId !== this.userId){
        //     this.isDisabled = false
        //  }
        // if(this.activeNodeData.medicalHistoryNow.CreateUserId === this.userId){
        //    if(this.editRole.Whole){
        //       this.isDisabled = true;
        //    }
        // }else{

        // }
        if (!this.editRole.Person) {
          if (
            this.activeNodeData.medicalHistoryNow.CreateUserId === this.userId
          ) {
            this.isDisabled = false;
          } else {
            this.isDisabled = true;
          }
        } else {
          this.isDisabled = false;
        }
        obj.mark =
          type === "medicalHistoryNow"
            ? this.activeNodeData.medicalHistoryNow.Status !== 1 ||
              this.isDisabled
            : true;
        this.$store.commit("public/SET_SHOWLOADING", true);
      }
      for (const key in obj) {
        str += `${key}=${obj[key]}&`;
      }
      str = str.substring(0, str.length - 1);
      let url = `${URLCONFIG.Emr}/Nursing/EditPage.aspx?${str}`;
      if (url == this[keyName]) {
        this.$store.commit("public/SET_SHOWLOADING", false);
        return;
      }
      console.log("url", url);
      this.isSetAdvice =
        type === "medicalHistoryNow" && !templateId && !obj.mark ? true : false;
      if (type === "medicalHistoryNow") {
        // 当前病历是否可编辑
        this.isSave = !templateId && !obj.mark ? true : false;
      }
      // if(type === "medicalHistoryNow"&&!templateId&&!obj.mark)
      if (templateId) {
        this.$store.commit("public/SET_PRINTIFRAMEURL", url);
      } else {
        getServerTimeRandom(url).then(res => {
          this[keyName] = res;
        });
      }
    },
    // 关闭弹窗
    closeAlter(bl) {
      // 确定
      if (bl) {
        this.currentType = "save";
        this.currentId = "templateAlter";
        // 新建病历
        let isNewAdd = this.isNewAdd;
        if (this.alterType === "templateData") {
          // if(this.showLoading)return
          this.isNewAdd = true;

          if (isNewAdd) return;
        }
        console.log(this.alterType, "引用数据成功");

        if (this.alterType === "templateData" && this.isSignName) {
          let obj = {
            Type: "0",
            Data: [{ Name: "病历保存" }],
            No: this.user.UserInfo.No,
            UserName: this.user.UserInfo.Name
          };
          this.currentObjData = obj;
          this.caSignOperation.KeyVerify();
        } else {
          this.handleOperation();
        }
      } else {
        if (this.alterType === "paragraphData") {
          this.$refs.aletrData.clearData();
        }
        // 取消
        this.$store.commit("public/SET_SHOWLOADING", false);
        this.isShow = false;
      }
    },
    //显示弹窗
    showAlter(val, type) {
      console.log(val, type);
      if(type==='templateData'){
        let  isDefer = this.activeNodeData.medicalHistoryNow.Status === 1;
        isDefer && this.isSave && this.medicalOperation("realtimesave");
      }
      this.isNewAdd=false
      this.alterType = type;
      this[type].activeName = val;
      this[type].HISPatientId = this.patientMsg.HISPatientId;
      this[type]={...this[type]}
      this.isShow = true;
    },
    // 当前病历、段落引用切换
    tabChange(val) {
      // if(this.patientMsg.Status===8){
      //   return;
      // }
      if (val === "1") {
        this.$Api
          .getEmrNow({ inHospitalId: this.$route.query.id ||this.patientMsg.InHouseId})
          .then(res => {
            this.medicalNowList = res.Data || [];
            let len = this.medicalNowList.length;
            if (len) {
              this.isFiles = true;
              this.medicalNowList.forEach(item => {
                item.MedicalRecordInfos.forEach((data, index) => {
                  if (data.Status == 2) {
                    console.log("data.status", data);
                    this.isFiles = false;
                  }
                });
              });
            } else {
              this.$store.commit("public/SET_SHOWLOADING", false);
              this.isFiles = true;
            }
            if (this.caseData && len) {
              this.medicalNowList.forEach(item => {
                item.MedicalRecordInfos.forEach((data, index) => {
                  if (this.caseData.Id === data.Id) {
                    let arr = item.MedicalRecordInfos;
                    console.log("arr", arr);
                    this.defaultExpanded.medicalHistoryNow = [item.Id];
                    this.$nextTick(() => {
                      this.$refs.medicalHistoryNow.currentChange(
                        arr[index],
                        this.defaultExpanded.medicalHistoryNow[0]
                      );
                    });
                  }
                });
              });
              return;
            }
            console.log(this.patientMsg,'this.patientMsg');
            if (!len && this.patientMsg.Status != 8&&this.patientMsg.AreaType!==3&&this.patientMsg.AreaType) {
              // 自动创建第一个病历
             this.$store.commit("public/SET_SHOWLOADING", true);
              this.isFirst = true;
              let templateId = "";
              console.log("defaultTemplent", this.defaultTemplent);
              this.defaultTemplent.forEach(item => {
                if (item.Id === this.patientMsg.AreaId) {
                  templateId = item.TemplateId;
                }
              });
              templateId && this.loadIframe("iframe", templateId);
              return;
            }
            // 默认展开、选中
            if (
              len &&
              this.medicalNowList[len - 1].MedicalRecordInfos.length &&
              !this.activeNodeData.medicalHistoryNow.Id
            ) {
              let arr = this.medicalNowList[len - 1].MedicalRecordInfos;
              console.log(arr);
              this.defaultExpanded.medicalHistoryNow = [
                this.medicalNowList[len - 1].Id
              ];
              this.$nextTick(() => {
                this.$refs.medicalHistoryNow.currentChange(
                  arr[arr.length - 1],
                  this.defaultExpanded.medicalHistoryNow[0]
                );
              });
            }
            this.medicalNowLength = this.medicalNowList.length;
            this.medicalNowList.forEach(item => {
              this.medicalNowLength += item.MedicalRecordInfos.length;
            });
          });
      } else {
        this.$Api.getParagraphList().then(res => {
          let data = res.Data || [];
          this.paragraphList = data;
          if (
            this.paragraphList.length &&
            this.paragraphList[0].PersonalMedicalRecordSectionModels &&
            this.paragraphList[0].PersonalMedicalRecordSectionModels.length &&
            !this.defaultExpanded.paragraph.length
          ) {
            let arr = this.paragraphList[0].PersonalMedicalRecordSectionModels;
            this.defaultExpanded.paragraph = [this.paragraphList[0].Id];
          }
        });
      }
    },
    // 节点选中变化
    checkChange(a, b, c) {
      console.log(a, b, c);
      let dom = this.$refs.medicalHistoryNow.getNode();
      let checkLength = dom.getCheckedKeys().length;
      console.log(checkLength,this.medicalNowLength,"1111")
      this.isIndeterminate =
        checkLength > 0 && checkLength < this.medicalNowLength;
      this.checkAll = checkLength
        ? checkLength === this.medicalNowLength
        : false;
      console.log("this.checkAll", this.checkAll);
    },
    // 全选、全清
    checkAllChange(el) {
      console.log(el,'12344')
      let dom = this.$refs.medicalHistoryNow.getNode();
      this.medicalNowList.forEach(item => {
        item.MedicalRecordInfos.forEach(data=>{
           dom.setChecked(data, el, true);
        })
       
      });
    },
    // 当前病历、历史病历切换
    getMedicalList(val) {
      if (val === 1) {
        this.tabChange(this.activeTab);
        this.activeTab === "2" && this.tabChange("1");
      } else {
        this.$Api
          .getEmrHistory({ patientId: this.patientMsg.PatientId })
          .then(res => {
            if (res.Status) {
              this.medicalOldList = res.Data || [];
              // 默认展开、选中；
              let len = this.medicalOldList.length;
              if (this.caseData && len) {
                this.medicalOldList.forEach(item => {
                  item.MedicalRecordInfos.forEach((data, index) => {
                    if (this.caseData.Id === data.Id) {
                      let arr = item.MedicalRecordInfos;
                      console.log("arr", arr);
                      this.activeNodeData.medicalHistoryOld = arr[index];
                      this.defaultExpanded.medicalHistoryOld = [item.Id];
                      this.$nextTick(() => {
                        this.$refs.medicalHistoryOld.currentChange(
                          arr[index],
                          this.defaultExpanded.medicalHistoryOld[index]
                        );
                      });
                      return;
                    }
                  });
                });
              }
              if (
                this.medicalOldList.length &&
                this.medicalOldList[0].MedicalRecordInfos.length &&
                !this.activeNodeData.medicalHistoryOld.Id
              ) {
                let arr = this.medicalOldList[0].MedicalRecordInfos;
                this.activeNodeData.medicalHistoryOld = arr[0];
                this.defaultExpanded.medicalHistoryOld = [
                  this.medicalOldList[0].Id
                ];
                this.$nextTick(() => {
                  this.$refs.medicalHistoryOld.currentChange(
                    arr[0],
                    this.defaultExpanded.medicalHistoryOld[0]
                  );
                });
              }
            } else {
              this.$msg.warning(res.Message);
            }
          });
      }
    },
    //按照时间排序返回一个选中的list数组
    sortArrList(arr) {
      let list = [...arr];
      list.sort((a, b) => {
        return (
          new Date(a.CreateTime).getTime() - new Date(b.CreateTime).getTime()
        );
      });
      console.log(list);
      let listId = [];
      for (let i = 0; i < list.length; i++) {
        listId.push(list[i].Id);
      }
      return listId;
    },
    // 获取医嘱并自动引用
    getAdviceList() {
      console.log("自动引用");
      if (this.isSetAdvice) {
        this.$Api
          .getAdviceList({
            inHouseId: this.$route.query.id||this.patientMsg.InHouseId,
            orderStatus: 2
          })
          .then(res => {
            let data = res.Data || [];
            let strObj = this.getAdviceStr(data);
            console.log(strObj,'strObj');
            let obj = {
              'Standard_SJY.231.1000.6596_20200616205819853':'',
              'Standard_SJY.7.1000.7477_20200618104320109':'',
              'Business_SJY.223.4678175835784637066_20200617164346607':'',
              'Standard_SJY.244.1000.38_20200703220656590':this.patientMsg.Diagnosis||''
            };
            let str = "";
            for (const key in strObj) {
              if (strObj[key]) {
                if (key === "checkout") {
                  obj["Standard_SJY.231.1000.6596_20200616205819853"] =
                    "<br/>检查" + strObj[key];
                } else if (key === "examine") {
                  obj["Standard_SJY.7.1000.7477_20200618104320109"] =
                    "<br/>检验" + strObj[key];
                } else {
                  str += `${key === "drug" ? "<br/>药品" : "<br/>治疗"}${
                    strObj[key]
                  }`;
                }
              }
            }
            if (str) {
              obj[
                "Business_SJY.223.4678175835784637066_20200617164346607"
              ] = str;
            }
            // console.log(
            //   obj["Business_SJY.223.4678175835784637066_20200617164346607"]
            // );
            // console.log(
            //   obj["Standard_SJY.231.5262766409850064671_20200616205847850"]
            // );
            console.log(obj);
            document
              .getElementById("medicalNow")
              .contentWindow.postMessage(
                { type: "selfMotionInsertData", data: obj },
                window.URLCONFIG.Emr
              );
          });
      }
    },
    // 拼接医嘱字符串
    getAdviceStr(data) {
      let st = "";
      let [drug, checkout, examine, treatmentSingle] = ["", "", "", ""];

      data.forEach(item => {
        if (item.Status === 7||this.user.UserInfo.No!==item.CreateUserId) return;
        let type = item.OrderType;
        switch (type) {
          // 治疗、
          case 0:
            treatmentSingle += `<br/>${item.OrderContent} ${item.FrequencyText} `;
            break;
          // 检查
          case 7:
            st = "";
            item.OrderDetails.forEach(el => {
              st += `<br/>${el.DictItemName}`;
            });
            // st = st.substring(0, st.length - 4);
            checkout += `${st} `;
            break;
          //检验
          case 8:
            st = "";
            item.OrderDetails.forEach(el => {
              st += `<br/>${el.DictItemName}`;
            });
            // st = st.substring(0, st.length - 4);
            examine += `${st} `;
            break;
          // 药品
          case 14:
            st = "";
            item.OrderDetails.forEach(el => {
              let groupStr = this.getgroupStr(el);

              st += `${groupStr}${el.Insurance}${
                el.SpecialName && el.SpecialName !== "普通"
                  ? "[" + el.SpecialName + "]"
                  : ""
              }${el.MedicineName} ${el.Dose}${el.Unit}`;
            });
            // st = st.substring(0, st.length - 1);
            drug += `${st} ${item.UsageText}  ${item.FrequencyText}${
              item.OrderDays ? " " + item.OrderDays + "天" : ""
            }`;
            break;
        }
      });
      return { drug, checkout, examine};
      // return { drug, checkout, examine, treatmentSingle };
    },
    getgroupStr(item) {
      let str = "<br/>";
      if (item.GroupCount === 1) return str;

      if (item.GroupNumber === 1) {
        str += "┏";
      } else if (item.GroupNumber === item.GroupCount) {
        str += "┗";
      } else {
        str += "│";
      }
      return str;
    }
  },
  destroyed() {
    this.$store.commit("case/SET_CASEDATA", null);
  },
  directives: {
    focus: {
      // 指令的定义
      inserted: function(el) {
        el.querySelector("input").focus();
      }
    }
  }
};
</script>
<style scoped lang='less'>
.medical-history {
  /deep/ .el-radio-group {
    padding: 10px;
    .el-radio-button--small .el-radio-button__inner {
      font-size: 14px;
    }
  }
  &-now {
    .left-tree {
      width: 251px;
      float: left;
      box-sizing: border-box;
      border-right: 1px solid #dfe7f5;
      padding: 0 10px;
      .search {
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
      .medical-now-tree {
        height: calc(100vh - 205px);
        overflow: auto;
      }
      .tabs-button {
        padding: 0px 23px;
        box-shadow: 0 3px 4px 0 rgba(153, 183, 255, 0.6);
        margin-bottom: 5px;
        height: 29px;
        .el-checkbox {
          float: left;
          padding: 6px 0 0 0;
        }
      }
    }
  }
  .medical-history-content {
    overflow: hidden;
    box-sizing: border-box;
    padding: 0 20px;
    .content-top {
      height: 31px;
      box-shadow: 0 3px 4px 0 rgba(153, 183, 255, 0.6);
      padding: 0 40px 10px 0;
    }
    .content-center {
      height: calc(100vh - 205px);
      box-sizing: border-box;
      padding-top: 15px;
      .iframeStyle {
        width: 100%;
        height: 100%;
      }
    }
    .content-bottom {
      height: 44px;
      font-size: 14px;
      color: rgba(0, 6, 16, 0.6);
      padding-right: 40px;
      .right {
        float: right;
        line-height: 32px;
        margin-left: 20px;
        > span {
          color: #000622;
          display: inline-block;
        }
        .time {
          width: 175px;
          margin-left: 5px;
          cursor: pointer;
          /deep/ .el-input__inner {
            background: @controlBg;
          }
        }
      }
    }
  }
  .my-icon {
    color: rgba(0, 113, 231, 0.7);
    font-size: 18px;
    cursor: pointer;
    float: right;
    margin: 6px 0 0 15px;
    &.big {
      font-size: 22px;
    }
    &.disabled {
      cursor: not-allowed;
      color: rgba(25, 137, 250, 0.4);
    }
  }
  .hidden {
    display: none;
  }
  .my-select-button {
    float: right;
    margin: 5px 11px 0;
  }
}
</style>
