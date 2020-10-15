<template>
  <div class="treatmentSingle">
    <p class="treatmentSingle-header">处置单记录</p>
    <div class="treatmentSingle-old">
      <div class="treatmentSingle-old-list">
        <medicalNowTree
          :callBack="handleNodeClick"
          nodeKey="Id"
          ref="treeList"
          :default-expanded-keys="expandedKeys"
          :treeData="treeList"
          children="Content"
          type="treatmentSingle"
        ></medicalNowTree>
      </div>
      <div class="treatmentSingle-old-right" v-if="activePrescription.HisPrescriptionCode">
        <div class="title">
          <p class="title-left">处方单号：{{activePrescription.HisPrescriptionCode}}</p>
          <p class="title-left"  v-if="activePrescription.PrescriptionStatusName">
            处方状态：
            <span class="status">{{activePrescription.PrescriptionStatusName}}</span>
          </p>
          <p class="title-right">总费用： {{cost}}元</p>
        </div>
        <div class="treatmentSingle-table-warp">
          <el-table
            :data="tableData"
            style="width: 100%"
            class="prescription-table"
            row-key="OrderId"
            :row-class-name="rowClass"
          >
            <el-table-column label="治疗项目" :min-width="490" >
              <template slot-scope="scope">
                <p>
                  {{scope.row.Name}}
                  <span class="icon-urgency" v-if="scope.row.IsEmergency"></span>
                  <span class="icon-bed" v-if="scope.row.IsBed"></span>
                </p>
              </template>
            </el-table-column>
            <el-table-column label min-width="110">
              <template slot-scope="scope">{{scope.row.FrequencyText}}</template>
            </el-table-column>
            <el-table-column label min-width="50">
              <template
                slot-scope="scope"
              >{{scope.row.Count}} {{scope.row.Unit}}</template>
            </el-table-column>
            <el-table-column label="开立时间" prop="CreateTime" min-width="90">
              <template slot-scope="scope">{{scope.row.OrderTime |timeFilter}}</template>
            </el-table-column>
            <el-table-column label="开立人" prop="DoctorName" min-width="70"></el-table-column>
          </el-table>
          <div class="print-button" v-show="tableData.length!=0&&activePrescription.PrescriptionStatusName!=='已作废'">
            <p class="treatmentSingle-button" @click="print">打印</p>
          </div>
        </div>
      </div>
    </div>
    <slot name="close"></slot>
  </div>
</template>

<script>
import medicalNowTree from "@/components/doctorAdvice/medicalHistory/medicalNowTree.vue";
import { mapGetters } from "vuex";
import { GetFormatDateTime } from "@/utils/public";
import { printObjectType } from "@/module/staticData.js";

export default {
  name: "treatmentSingle", //治疗单记录
  components: {
    medicalNowTree
  },
  data() {
    return {
      expandedKeys: [], //tree默认展开的项
      activePrescription: {}, //当前治疗单基本信息
      columns: [],
      tableData: [],
      treeList: [],
    };
  },
  computed: {
    ...mapGetters({
      patientMsg: "public/GET_PATIENTMSG",
      user: "public/GET_USER"
    }),
    cost(){
      let str=0;
      this.tableData.forEach(el=>{
        if (el.Status!==7) {
          str+=el.Price*el.Count
        }
      })
      return str.toFixed(2)
    }
  },
  created() {
          this.getTreeData();

  },
  methods: {
    rowClass({ row }) {
      return row.Status === 7 ? "red" : "";
    }, //行class
    // 打印治疗单处方
    print() {
      let orderIds = this.activePrescription.HisPrescriptionCode;
      // this.tableData.forEach(item => {
      //   if (item.Status!==7) {
      //   orderIds += item.Id + "*";
      //   }
      // });
      if(!orderIds)return this.$msg.warning('该治疗单无有效治疗项目可打印！')
      let t = new Date().getTime();
      let url = `${URLCONFIG.Emr}/Nursing/EditPage.aspx?patientId=${
        this.patientMsg.PatientId
      }&inHouseId=${this.patientMsg.InHouseId}&areaType=${
        this.patientMsg.AreaType
      }&createUser=940c7df7-a718-e911-80cd-0050568e1b08&objectType=${
        printObjectType.specialDrugBatch.objectType
      }&logUserEditTrack=true&documentId=f2f201db-3ca2-47b0-ba81-ab6b0096abd6&mark=true&templateId=C16DA3C4-D502-4082-AEC8-AB7C00F17C78&ids=${orderIds}&ObjectTypes=${
        printObjectType["treatDoctorAdvice"].objectType
      }&TemplateIds=${
        printObjectType["treatDoctorAdvice"].templateId
      }&ismult=true&areaId=${this.patientMsg.AreaId}&t=${t}`;
      this.$store.commit("public/SET_PRINTIFRAMEURL", url);
    },
    // 获取历史治疗单列表
    getTreeData() {
      this.$Api
        .getTreatmentList({ patientId: this.patientMsg.PatientId })
        .then(res => {
          if (res.Status) {
            let data = res.Data || [];
            this.treeList = data;
            if (!this.activePrescription.Id && data.length) {
              this.$nextTick(() => {
                this.$refs.treeList.currentChange(
                  data[0].Content[0],
                  data[0].Id
                );
              });
            } else if (this.activePrescription.Id) {
              this.getPrescriptionList();
            }
          } else {
            this.$msg.warning(res.Message);
          }
        });
    },
    // 点击树形节点
    handleNodeClick(data, type, parentId) {
      // console.log(data, type, parentId);
      this.activePrescription = data;
      this.activePrescription.patientId = parentId;
      this.expandedKeys = [parentId];
      console.log(this.activePrescription,'this.activePrescription');
      this.getPrescriptionList();
    },
    //获取治疗单详情
    getPrescriptionList() {
      let data = {
        inHouseId: this.activePrescription.patientId,
        HisPrescriptionCode:this.activePrescription.HisPrescriptionCode
      };
      this.$Api.getTreatmentModelsByTime(data).then(res => {
        if (res.Status) {
          this.tableData = res.Data || [];
        } else {
          this.$msg.warning(res.Message);
        }
      });
    }
  }
};
</script>
<style scoped lang='less'>
.treatmentSingle {
  width: 100%;
  height: 100%;
  background: #ffffff;

  box-sizing: border-box;
  position: relative;
  padding-top: 10px;
  .treatmentSingle-header {
    padding-left: 20px;
  }
  .close {
    position: absolute;
    right: 15px;
    top: 5px;
    font-size: 30px;
    cursor: pointer;
    color: @blueMain;
  }
  > .el-radio-group {
    padding-left: 19px;
    /deep/ .el-radio-button__inner {
      padding: 0;
      text-align: center;
      line-height: 32px;
      width: 98px;
      height: 32px;
      display: inline-block;
    }
  }
  .treatmentSingle-button {
    float: right;
    width: 90px;
    height: 30px;
    right: 10px;
    background: #ffffff;
    border: 1px solid #0071e7;
    border-radius: 3px;
    font-size: 14px;
    color: #0071e7;
    cursor: pointer;
    text-align: center;
    line-height: 32px;
    margin-right: 40px;
  }
  .treatmentSingle-table-warp {
    width: 100%;
    height: calc(100vh - 208px);
    overflow-y: auto;
    box-sizing: border-box;
    // padding: 0 19px;
  }
  &-old {
    width: 100%;
    height: calc(100vh - 120px);
    box-sizing: border-box;
    padding-top: 25px;
    overflow: hidden;
    &-list {
      float: left;
      width: 270px;
      padding: 0 15px 20px 19px;
      height: 100%;
      box-sizing: border-box;
      border-right: 1px solid rgba(47, 51, 68, 0.4);
      .medical-now-tree {
        height: calc(100vh - 165px);
        overflow: auto;
      }
    }
    &-right {
      overflow: hidden;
      box-sizing: border-box;
      padding: 0 19px;
      height: 100%;
      .title {
        height: 24px;
        font-size: 15px;
        line-height: 24px;
        padding-bottom: 20px;
        &-left {
          float: left;
          margin-right: 40px;
          .status {
            color: #ffffff;
            background: #0071e7;
            padding: 0 20px;
            border-radius: 10px;
          }
        }
        &-right {
          float: right;
        }
      }
      .treatmentSingle-table-warp {
        height: calc(100vh - 181px);
      }
      .print-button {
        margin-top: 20px;
        height: 48px;
        padding: 8px 0;
        box-sizing: border-box;
        .count {
          float: left;
          line-height: 32px;
          color: rgba(47, 51, 68, 0.4);
        }
      }
    }
  }
}
</style>
