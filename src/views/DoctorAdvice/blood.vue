<template>
  <div class="blood" ref="blood">
    <div class="tabs-temp">
      <el-radio-group v-model="nowTemp" @change="tapsExamine" fill="#0071e7">
        <el-radio-button
          :label="item.Value"
          v-for="(item,index) in tabsTemp"
          v-if="item.Show"
          :key="index"
        >{{item.Text}}</el-radio-button>
      </el-radio-group>
    </div>
    <div class="content">
      <div class="newBlood" v-if="nowTemp=='newBlood'">
        <div class="newBloodContent">
          <bloodDoctorAdvice :commonObj="commonObj" :tableData="tableData" v-if="isShow">
            <searchDoctorAdvice
              :callBack="addBloodDoctorAdvice"
              :adviceName="4"
              slot="search"
              :departmentCode="departmentCode"
              slot-scope="{departmentCode}"
            ></searchDoctorAdvice>
            <searchDoctorAdvice
              slot="change"
              :adviceName="4"
              slot-scope="{index,itemName,departmentCode}"
              :callBack="addBloodDoctorAdvice"
              :index="index"
              :itemName="itemName"
              :departmentCode="departmentCode"
            ></searchDoctorAdvice>
            <div class="btnStyle" slot-scope="{submitForm}">
              <el-button @click="cancle">取消</el-button>
              <el-button type="primary" @click="save(submitForm)">保存</el-button>
            </div>
          </bloodDoctorAdvice>
        </div>
      </div>
      <div v-else>
        <div class="bloodRecord">
          <div class="left">
            <historyList
              :historyListData="patBloodRecordList"
              :callback="handleSelect"
              ref="historyList"
            ></historyList>
          </div>
          <div class="right">
            <bloodRecord
              :handleRow="getDetail"
              :bloodDetailData="bloodDetailData"
              ref="bloodDetailTable"
            >
              <div slot="handle" slot-scope="{scope,viewRecord}">
                <!-- <el-tooltip effect="dark" content="查看记录" placement="top-start">
                  <svg-icon
                    iconClass="viewreport"
                    class="styleIcon"
                    @click.stop="viewRecord(scope.row)"
                  ></svg-icon>
                </el-tooltip>-->
                <el-tooltip effect="dark" content="引用" placement="top-start" >
                  <svg-icon
                    iconClass="quote"
                    class="styleIcon"
                    @click.stop="copyData(scope.row)"
                    v-if="patientMsg.Status!=8"
                  ></svg-icon>
                </el-tooltip>
                <el-tooltip effect="dark" content="打印" placement="top-start" v-if="scope.row.Status!==1&&scope.row.Status!==7">
                  <svg-icon iconClass="printlist" class="styleIcon" @click.stop="print(scope.row)"></svg-icon>
                </el-tooltip>
              </div>
              <div slot="expand">备注备注xxxxxx备注</div>
            </bloodRecord>
          </div>
        </div>
      </div>
    </div>
    <my-alter
      title="用血申请"
      :visible="dialogVisible"
      :isfooter="false"
      :width="dialogWidth"
      :callback="closeDialog"
    >
      <viewBloodRecord :commonObj="commonObj" :tableData="tableData"></viewBloodRecord>
      <div
        style="text-align:right;margin-bottom:10px"
        v-show="doctorOrder.Status==1 && patientMsg.Status!=8"
      >
        <el-button @click="modify">修改</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </my-alter>
  </div>
</template>
<script>
import bloodRecord from "@/components/doctorAdvice/blood/bloodRecord";
import bloodDoctorAdvice from "../../components/doctorAdvice/openDoctorAdvice/bloodDoctorAdvice";
import searchDoctorAdvice from "../../components/doctorAdvice/openDoctorAdvice/searchDoctorAdvice.vue";
import viewBloodRecord from "@/components/doctorAdvice/blood/viewBloodRecord";
import myAlter from "@/components/common/myAlter";
import historyList from "@/components/doctorAdvice/requestCommon/historyList";
import { mapGetters } from "vuex";
import { GetFormatDateTime } from "@/utils/public";
import {printObjectType} from '@/module/staticData.js'
import CASign from '@/utils/caSign.js'
export default {
  components: {
    bloodDoctorAdvice,
    searchDoctorAdvice,
    bloodRecord,
    myAlter,
    viewBloodRecord,
    historyList
  },
  data() {
    return {
      nowTemp: "newBlood", //当前模板显示，是新建用血和用血记录
      tabsTemp: [
        {
          Text: "新建用血",
          Value: "newBlood",
          Show: true
        },
        {
          Text: "用血记录",
          Value: "bloodRecord",
          Show: true
        }
      ],
      commonObj: {}, //血液信息
      tableData: [], //医嘱表格数据
      dialogVisible: false, //弹窗显示状态
      dialogWidth: "800px", //弹窗宽度
      isChange: true, //用血申请是否是修改状态
      patBloodRecordList: [], //用血记录主列表
      doctorOrder: {}, //医嘱信息
      bloodDetailData: [], //用血记录详细信息
      timer:null,
      caSignOperation:{},//
      currentObjData:'',
      isShow:true,//取消时卸载组件
    };
  },
  created() {
    this.getBloodInfoByPat();
    if(this.isSignName) {
      this.caSignOperation = new CASign(this,this.signName)
    }
  },
  // mounted() {
  //   let dom = this.$refs.blood
  //   dom.addEventListener("message", this.load, false)
  // },
  watch: {
    "patientMsg.Status": {
      handler(val) {
        if (val === 8) {
          this.tabsTemp[0].Show = false;
          this.nowTemp = "bloodRecord";
          this.getPatBloodRecordList();
        } else {
          this.tabsTemp[0].Show = true;
          this.nowTemp = "newBlood";
        }
      },
      deep: true,
      immediate: true
    },
    isGetCA:function(val){
      if(val) {
        // 验证
        if(this.currentObjData.Data&&this.currentObjData.Data[0].Name=='用血申请') {
          this.caSignOperation.checkData(this.user.UserInfo,this.currentObjData)
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      patientMsg: "public/GET_PATIENTMSG",
      selectArea: "home/GET_SELECTAREA",
      isRegister: "configuration/GET_ISREGISTER", //是否可挂号
      signName:"public/GET_SIGNNAME",//签名系统简称
      isSignName:'public/GET_ISSIGNNAME',//是否启用
      isGetCA:"public/GET_ISGETCA",// 
      user:'public/GET_USER',
      caImgData:"public/GET_CAIMGDATA",//ca签名图片数据流，医嘱提交处使用
    })
  },
  methods: {
    // 用血打印
    print(row) {
      clearTimeout(this.timer);
      let t = new Date().getTime()
      let str = window.location.protocol + "\\" + window.location.host;
      let url = `${URLCONFIG.Emr}/Nursing/EditPage.aspx?patientId=${this.patientMsg.PatientId}&inHouseId=${this.patientMsg.InHouseId}&areaType=${this.patientMsg.AreaType}&createUser=940c7df7-a718-e911-80cd-0050568e1b08&originUrl=${str}&objectType=${printObjectType.blood.objectType}&logUserEditTrack=true&documentId=f2f201db-3ca2-47b0-ba81-ab6b0096abd6&mark=true&templateId=${printObjectType.blood.templateId}&bloodid=${row.BloodFormId}&areaId=${this.patientMsg.AreaId}&t=${t}`;
      console.log(url);
      this.$store.commit("public/SET_PRINTIFRAMEURL", url);
    },
    // 引用
    copyData(row) {
      this.nowTemp = "newBlood";
      let params = {
        BloodFormId: row.BloodFormId
      };
      this.$Api.getDoctorBloodOrderInfo(params).then(res => {
        if (res.Status) {
          let data=res.Data.DoctorBloodFormEntity
          data.Id="00000000-0000-0000-0000-000000000000"
          data.ApplyTime=GetFormatDateTime()
          data.UseTime=GetFormatDateTime()
          this.commonObj = data;
          this.tableData = res.Data.DoctorBloodFormDetailsList;
        }
      });
    },
    closeDialog(value) {
      this.dialogVisible = false;
      // if(!value) {
      //   this.cancle()
      // }
    },
    // 提交
    submit() {
      if (!this.patientMsg.RegistId) {
        this.$msg.info("该患者无有效挂号，请先挂号！");
        if (this.isRegister === "1") {
          let obj = {
            title: "患者挂号",
            width: "800px",
            component: "registrationAlter",
            isShowFooter: true,
            btn: ["挂号", "取消"],
            visible: true
          };
          this.$store.commit("public/SET_DIALOGDATA", obj);
        }
        return;
      }
      if(this.isSignName) {
        let obj =  { Type: "0", Data: [{Name:'用血申请'}], No: this.user.UserInfo.No, 
UserName: this.user.UserInfo.Name };
        this.currentObjData = obj
        this.caSignOperation.KeyVerify()
      }else{
        this.handleOperation()
      }
      
    },
 async  handleOperation() {
   try {
     let isPassIMIS=await this.$IMIS.submmitOrderIMIS([{OrderType:this.doctorOrder.OrderType,OrderId:this.doctorOrder.Id}],this.patientMsg)
       if(!isPassIMIS)return
   } catch (error) {
     
   }
      let params = {
        InHouseId: this.patientMsg.InHouseId,
        OrderList: [this.doctorOrder.Id],
        HisRegisterId: this.patientMsg.RegistId,
        CASignImg:this.caImgData
      };
      this.$Api.submitAdvice(params).then(res => {
          this.$msg[res.Status ? "success" : "warning"](res.Message);
        if (res.Status) {
          // 打印
          console.log(this.tableData);
          this.print(this.tableData[0]); //
          this.nowTemp = "bloodRecord";
          this.getPatBloodRecordList();
          this.dialogVisible = false;
        } else {
          this.refreshOrderStatus()
        }
      }).catch(err=>{
        this.refreshOrderStatus()
      });
    },
    // 修改
    modify() {
      this.dialogVisible = false;
      this.nowTemp = "newBlood";
    },
    // 查看记录
    getDetail(row) {
      // 获取所有信息
      let params = {
        BloodFormId: row.BloodFormId
      };
      this.$Api.getDoctorBloodOrderInfo(params).then(res => {
        if (res.Status) {
          this.commonObj = res.Data.DoctorBloodFormEntity;
          this.tableData = res.Data.DoctorBloodFormDetailsList;
          this.doctorOrder = res.Data.DoctorOrderEntity;
          // 弹窗
          this.dialogVisible = true;
        }
      });
    },
    async save(fn) {
      let res = await fn();
      if (!res) {
        this.$msg.warning("请把信息填写完全");
        return;
      }
      console.log(res);
      let result = {};
      //result = await this.$Api.saveBloodInfo(res);
      if (
        res.BloodForm.Id &&
        res.BloodForm.Id != "00000000-0000-0000-0000-000000000000"
      ) {
        result = await this.$Api.updateBloodInfo(res);
        if (result.Status) {
          this.$msg.success("操作成功");
          let obj = {
            BloodFormId: res.BloodForm.Id
          };
          this.getDetail(obj);
        }
      } else {
        result = await this.$Api.saveBloodInfo(res);
        if (result.Status) {
          this.$msg.success("操作成功");
          let obj = {
            BloodFormId: result.Data
          };
          this.getDetail(obj);
        }
      }
    },
    cancle() {
      // 清空数据
      this.isShow=false
      this.commonObj={}
      setTimeout(()=>{
        this.isShow=true
      },0)
      this.getBloodInfoByPat();
      this.tableData = [];
    },
    //增加用血医嘱
    addBloodDoctorAdvice(el, index) {
      this.commonObj = { ExcuteDepartment: el.Department };
      let obj = this.tableData.find(item => {
        if (item.ItemCode == el.HisMedId) {
          return item;
        }
      });
      if (obj) {
        this.$msg.warning("改输血医嘱已存在");
        return;
      }
      if (index < 0) {
        // 新增
        let obj = {
          Id: "00000000-0000-0000-0000-000000000000",
          BloodFormId: "00000000-0000-0000-0000-000000000000",
          ItemName: el.ItemName,
          ItemCode: el.HisMedId,
          ItemType: el.OrderItemType,
          Count: 1,
          Price: parseFloat(el.Price),
          Unit: el.DrugStoreUnit,
          _edit: false,
          BloodWay: ""
        };
        this.tableData.push(obj);
      } else {
        // 修改
        let obj = this.tableData[index];
        obj["ItemName"] = el.ItemName;
        obj["ItemCode"] = el.HisMedId;
        obj["ItemType"] = el.OrderItemType;
        obj["Count"] = 1;
        obj["Price"] = parseFloat(el.Price);
        (obj["Unit"] = el.DrugStoreUnit),
          (obj["_edit"] = false),
          (obj["BloodWay"] = "");
        this.tableData[index] = obj;
      }
    },
    tapsExamine(val) {
      console.log(val);
      if (val == "bloodRecord") {
        this.getPatBloodRecordList();
      } else {
        //this.cancle();
      }
    },
    getBloodInfoByPat() {
      let params = {
        hisPatientId: this.patientMsg.HISPatientId,
        RecordNumber: this.patientMsg.RecordNumber
      };
      this.$Api.getBloodInfo(params).then(res => {
        if (res.Status) {
          this.commonObj = res.Data;
        }
      });
    },
    // 用血记录相关
    getPatBloodRecordList() {
      console.log(this.patientMsg);
      let params = {
        PatientId: this.patientMsg.PatientId
      };
      this.$Api.getBloodMasterList(params).then(res => {
        this.patBloodRecordList = res.Data;
        if (this.patBloodRecordList.length != 0) {
          this.$refs.historyList.selectId = this.patBloodRecordList[0].InHospitalId;
          this.handleSelect(this.patBloodRecordList[0].InHospitalId);
        }
      });
    },
    // 用血记录左侧列表
    handleSelect(value) {
      let obj = {
        InHospitalId: value
      };
      this.getBloodDetail(obj);
    },
    // 用血记录详细信息
    getBloodDetail(item) {
      let params = {
        inHouseId: item.InHospitalId
      };
      this.$Api.getBloodDetailList(params).then(res => {
        if (res.Status) {
          this.bloodDetailData = res.Data;
        }
      });
    },
            // 重置医嘱提交错误时的医嘱状态
    refreshOrderStatus(){
       this.$Api.refreshOrderStatus({inHospitalId:this.$route.query.id}).then(res=>{
       })
    },
  }
};
</script>
<style lang="less" scoped>
.blood {
  padding: 10px 15px;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  .doctor-advice {
    border: none;
    box-shadow: none;
    margin-top: 0;
  }
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
    margin-top: 20px;
    height: 100%;
    overflow: auto;
    > div {
      height: calc(~"(100% - 60px)");
    }
    .newBlood {
      .newBloodContent {
        position: relative;
        overflow: auto;
        height: 100%;
        .bloodDoctorAdvice.doctor-advice {
          padding-top: 0;
        }
        .btnStyle {
          text-align: center;
          // position: absolute;
          // left: 0;
          // right: 0;
          // bottom: 10px;
          .el-button {
            width: 86px;
          }
        }
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
    .bloodRecord {
      display: flex;
      height: 100%;
      .left {
        min-width: 150px;
        padding-right: 20px;
        // width: 120px;
        height: 100%;
        overflow-y: auto;
      }
      .right {
        padding: 0 20px;
        margin-top: -15px;
        border-left: 1px solid #dfe7f5;
        flex: 1;
        height: 100%;
        overflow-y: auto;
      }
    }
  }
}
</style>