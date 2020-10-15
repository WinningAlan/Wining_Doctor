<template>
  <div class="operation-deatil">
    <el-form
      :model="commonObj"
      ref="newOperation"
      label-width="100px"
      class="demo-commonObj"
    >
      <div class="content">
        <div class="item">
          <el-form-item label="术前诊断" prop="DiagnosisName">
            <p>{{commonObj.DiagnosisName}}</p>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="拟施手术" prop="OperationName">
            <p>{{commonObj.OperationName}}</p>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="手术等级" prop="OperationLevel">
            <p>{{commonObj.OperationLevel | publicFilter(dictData.OperationLevel)}}</p>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="手术类型" prop="OperationType">
            <p>{{commonObj.OperationType | publicFilter(dictData.OperationType)}}</p>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="手术室" prop="OperationRoom">
            <p>{{commonObj.OperationRoom | publicFilter(dictData.OperationRoom)}}</p>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="手术部位" prop="OperationHumanBody">
            <p>{{commonObj.OperationHumanBody | publicFilter(dictData.OperationHumanBody)}}</p>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="手术台次" prop="OperationCountNo">
            <p>{{commonObj.OperationCountNo}}</p>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="拟手术时间" prop="ExpectOperationTime">
            <p>{{commonObj.ExpectOperationTime | timeFilter}}</p>
          </el-form-item>
        </div>

        <div class="item">
          <el-form-item label="体位" prop="OperationHumanPosition">
            <p>{{commonObj.OperationHumanPosition | publicFilter(dictData.OperationHumanPosition)}}</p>
          </el-form-item>
        </div>

        <div class="item">
          <el-form-item label="切口等级" prop="IncisionLevel">
            <p>{{commonObj.IncisionLevel |  publicFilter(dictData.OperationIncisionLevel)}}</p>
          </el-form-item>
        </div>

        <div class="item">
          <el-form-item label="备血" prop="IsBloodPreparation">
            <p>{{commonObj.IsBloodPreparation?"有":"无"}}</p>
          </el-form-item>
        </div>
        <div class="item bloodTypeName">
          <el-form-item label="血型" prop="BloodTypeCode">
            <p>{{commonObj.BloodTypeCode | publicFilter(dictData.BloodTypeModel)}}</p>
          </el-form-item>
        </div>
        <div class="item">
            <el-form-item label="RH" prop="RH" class="rh">
            <p>{{commonObj.RH}}</p>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="主刀医生" prop="MianDoctorId ">
            <p>{{commonObj.MianDoctorId | userFilter(doctorList)}}</p>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="指导医师" prop="InstructDoctorId ">
            <p>{{commonObj.InstructDoctorId | userFilter(doctorList)}}</p>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="手术一助" prop="FirstAssistantId">
            <p>{{commonObj.FirstAssistantId | userFilter(doctorList)}}</p>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="手术二助" prop="SecondAssistantId">
            <p>{{commonObj.SecondAssistantId | userFilter(doctorList)}}</p>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="麻醉医师" prop="AnesthesiaDoctorId ">
            <p>{{commonObj.AnesthesiaDoctorId | userFilter(doctorList)}}</p>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="麻醉助手" prop="AnesthesiaAssistantId ">
            <p>{{commonObj.AnesthesiaAssistantId | userFilter(doctorList)}}</p>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="麻醉方式" prop="AnesthesiaType">
            <p>{{commonObj.AnesthesiaType | publicFilter(dictData.OperationAnesthesia)}}</p>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="麻醉时间" prop="AnesthesiaTime">
            <p>{{commonObj.AnesthesiaTime | timeFilter}}</p>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="巡回护士" prop="CircuitNurseId">
            <p>{{commonObj.CircuitNurseId | userFilter(nurseList)}}</p>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="机械护士" prop="InstrumentNurseId">
            <p>{{commonObj.InstrumentNurseId | userFilter(nurseList)}}</p>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="异物置入物" prop="ForeignBodyImplants">
            <p>{{commonObj.ForeignBodyImplants}}</p>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="多重耐药菌" prop="MDRO">
            <p>{{commonObj.MDRO}}</p>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="乙肝" prop="HBV">
            <p>{{commonObj.HBV}}</p>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="丙肝" prop="HCV">
            <p>{{commonObj.HCV}}</p>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="梅毒" prop="RPR">
            <p>{{commonObj.RPR}}</p>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="艾滋" prop="HIV">
            <p>{{commonObj.HIV}}</p>
          </el-form-item>
        </div>
        <div class="item">
          <el-form-item label="申请时间" prop="ApplyTime">
            <p>{{commonObj.ApplyTime | timeFilter}}</p>
          </el-form-item>
        </div>
      </div>
      <div class="remark">
        <el-form-item label="说明" prop="Description">
          <p>{{commonObj.Description}}</p>
        </el-form-item>
      </div>
      <div class="remark">
        <el-form-item label="备注" prop="Remark">
          <p>{{commonObj.Remark}}</p>
        </el-form-item>
      </div>
      <slot></slot>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import {nurseKey,doctorKey} from '../../../module/staticData'

export default {
  data() {
    return {
      planData: [], //拟施数据
    
      dictData: {
        BloodTypeModel: [], //血型
        OperationAnesthesia: [], //麻醉方式
        OperationHumanBody: [], //手术部位
        OperationHumanPosition: [], //体位
        OperationIncisionLevel: [], //切口等级
        OperationLevel: [], //手术等级
        OperationRoom: [], //手术室
        OperationType: [] //手术类型
      }, //其他字典量
      doctorList: [], //所有医生的列表
      nurseList: [], //所有护士的列表

    };
  },
  props: {
    commonObj: {
      type: Object,
      required: true
    },
    // // 是否修改
    // isChange: {
    //   type: Boolean,
    //   default: false
    // }
  },

  watch: {
    commonObj: {
      handler: function(val, oldVal) {
          console.log(val)
  this.getKeyName(1)
  this.getKeyName(2)
      },
      immediate: true,
      deep:true
    }
  },
  created() {
    //获取拟定手术的字典量
    this.$Api.getOperationD({}).then(res => {
      console.log(res);
      if (res.Status) {
        this.planData = res.Data;
      }
    });
    //其他字典量
    this.$Api.getOperationOtherD({}).then(res => {
      if (res.Status) {
        this.dictData = res.Data;
        console.log(res.Data);
      }
    });

  },
  methods: {
        getKeyName(type){
      // type=1,医生，2是护士
      let keyArr=type===1?doctorKey:nurseKey;
      let arr=[];
      keyArr.forEach(el=>{
        if (this.commonObj[el]&&!arr.includes(this.commonObj[el])) {
          arr.push(this.commonObj[el])
        }
      })
      arr.forEach(item=>{
        this[type===1?'getDoctorUser':"getNurseList"](item,2)
      })
    },
        getDoctorUser(val) {
      //医生字典量
      val = val ? { content: val ,t:+new Date()} : {};
      this.$Api.getDoctorUser(val).then(res => {
        if (res.Status) {
          let data=res.Data||[]
          this.doctorList.push(...data)
        }
      });
    },
    //获取护士成员列表
    getNurseList(val) {
      val = val ? { content: val } : {};
      this.$Api.getNurseList(val).then(res => {

        if (res.Status) {
              let data=res.Data||[]
          this.nurseList.push(...data)
        }
      });
    },
  }
};
</script>
<style lang="less" scoped>
.operation-deatil {
  max-height: 88vh;
  box-sizing: border-box;
  padding: 20px;
  overflow-y: auto;
  .el-form-item{
    margin-bottom: 5px;
  }
  h3 {
    text-align: center;
    font-size: 20px;
  }
  .content {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .item {
      width: 300px;

    }
    .bloodTypeName {
      display: flex;
      .rh {
        /deep/.el-form-item__label {
          width: 50px !important;
        }
        /deep/ .el-form-item__content {
          margin-left: 50px !important;
        }
      }
    }
  }
}
</style>