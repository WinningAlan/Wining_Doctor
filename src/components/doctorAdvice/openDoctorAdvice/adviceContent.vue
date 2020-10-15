<template functional>
  <div class="advice-content">
    <template v-if="props.Isprescription">
      <template v-if=" props.row.prescriptionDetailListInfo.length>1">
        <div class="advice-content-group">
          <p class="item"></p>
        </div>
        <div class="advice-content-name drup">
          <p class="item" v-for="(item, index) in props.row.prescriptionDetailListInfo" :key="index">
            <span
              v-if="item.Insurance"
            >{{item.Insurance}}</span>
            <span
              v-if="item.SpecialName&&item.SpecialName!=='普通'"
            >[{{item.SpecialName}}]</span>
            <span>{{item.MedicineName}}&nbsp;&nbsp;</span>
            <span>{{item.SpecificationName}}&nbsp;&nbsp;{{item.Dose}}{{item.Unit}}&nbsp;&nbsp;</span>
            <!-- <span class="icon-skin" v-if="props.row.prescriptionDetailListInfo[index].IsSkinTest"></span> -->
            <span class="icon-build-in" v-if="item.IsSelfProvided"></span>
          </p>
        </div>
        <!-- <div class="advice-content-name drup">
          <p
            class="item"
            v-for="(item, index) in props.row.prescriptionDetailListInfo"
            :key="index"
          >{{props.row.prescriptionDetailListInfo[index].Dosage}}{{props.row.prescriptionDetailListInfo[index].DosageUnit}}</p>
        </div> -->
        <div class="advice-content-content">
          &nbsp;&nbsp;<span class="icon-dai" v-if="props.row.IsOutHospitalMedicine"></span>
         
        </div>
      </template>
      <template v-else>
        <div class="advice-content-name drup">
          <span v-if="props.row.prescriptionDetailListInfo[0].Insurance">{{props.row.prescriptionDetailListInfo[0].Insurance}}</span>
          <span
            v-if="props.row.prescriptionDetailListInfo[0].SpecialName&&props.row.prescriptionDetailListInfo[0].SpecialName!=='普通'"
          >[{{props.row.prescriptionDetailListInfo[0].SpecialName}}]</span>
          <span>{{props.row.prescriptionDetailListInfo[0].MedicineName}}&nbsp;&nbsp;{{props.row.prescriptionDetailListInfo[0].SpecificationName}}&nbsp;&nbsp;</span>
          <span>{{props.row.prescriptionDetailListInfo[0].Dose}}{{props.row.prescriptionDetailListInfo[0].Unit}}&nbsp;&nbsp;</span>
          <!-- <span class="icon-skin" v-if="props.row.prescriptionDetailListInfo[0].IsSkinTest"></span> -->
          <span class="icon-build-in" v-if="props.row.prescriptionDetailListInfo[0].IsSelfProvided"></span>
          <span class="icon-dai" v-if="props.row.IsOutHospitalMedicine"></span>
        </div>
        <!-- <div
          class="advice-content-name"
        >{{props.row.prescriptionDetailListInfo[0].Dosage}}{{props.row.prescriptionDetailListInfo[0].DosageUnit}}</div> -->
      </template>
    </template>
    <template v-else>
      <div class="advice-content-icon">
        <span class="adviceIcon">{{props.row.OrderClassificationWord}}</span>
        <!-- <span class="icon-drug" v-if="props.row.OrderType===14"></span>
        <span class="icon-nurse" v-else-if="props.row.OrderType===5"></span>
        <span class="icon-meals" v-else-if="props.row.OrderType===3"></span>
        <span class="icon-word" v-else-if="props.row.OrderType===22"></span>
        <span class="icon-treatment" v-else-if="props.row.OrderType===0||props.row.OrderType===1"></span>
        <span class="icon-operation" v-else-if="props.row.OrderType===15"></span>
        <span class="icon-inspect" v-else-if="props.row.OrderType===7"></span>
        <span class="icon-blood" v-else-if="props.row.OrderType===4"></span>
        <span class="icon-test" v-else-if="props.row.OrderType===8"></span>
        <span class="icon-consultation" v-else-if="props.row.OrderType===31"></span> -->
      </div>
      <template v-if="props.row.OrderType===14">
        <template v-if="props.row.OrderDetails.length>1">
          <div class="advice-content-group">
            <div class="item"></div>
          </div>
          <div class="advice-content-name">
            <div class="item" v-for="(item, index) in props.row.OrderDetails" :key="index">
              <p>
                <span
                  v-if="item.Insurance"
                >{{item.Insurance}}</span>
                <span
                  v-if="item.SpecialName&&item.SpecialName!=='普通'"
                >[{{item.SpecialName}}]</span>
                <span>{{item.MedicineName}}&nbsp;</span>
                <span class="icon-skin" v-if="item.IsSkinTest"></span>
                <span class="icon-build-in" v-if="item.IsSelfProvided"></span>
              </p>
              <p>
                {{item.SpecificationName}}&nbsp;&nbsp;{{+(item.Dose.toFixed(4))}}{{item.Unit}}&nbsp;&nbsp;{{props.row.EffectiveTime===1?item.Dosage:''}}{{props.row.EffectiveTime===1?item.DosageUnit:''}}
              </p>
            </div>
          </div>

          <div class="advice-content-content">
            <p>{{props.row.UsageText}}&nbsp;{{props.row.FrequencyText}}&nbsp;&nbsp;{{props.row.OrderDays?props.row.OrderDays+'天':''}} <span class="icon-dai" v-if="props.row.IsOutHospitalMedicine"></span></p>
            <p v-if="props.row.DrippingSpeed">滴速&nbsp;{{props.row.DrippingSpeed}}&nbsp;ml/min</p>
          </div>
        </template>
        <template v-else>
          <div class="advice-content-content">
            <p>
              <span
                v-if="props.row.OrderDetails[0].Insurance"
              >{{props.row.OrderDetails[0].Insurance}}</span>
              <span
                v-if="props.row.OrderDetails[0].SpecialName&&props.row.OrderDetails[0].SpecialName!=='普通'"
              >[{{props.row.OrderDetails[0].SpecialName}}]</span>
              <span>{{props.row.OrderDetails[0].MedicineName}}&nbsp;&nbsp;{{props.row.OrderDetails[0].SpecificationName}}&nbsp;</span>
            </p>
            <p>
              {{+(props.row.OrderDetails[0].Dose.toFixed(4))}}{{props.row.OrderDetails[0].Unit}}&nbsp;&nbsp;{{props.row.EffectiveTime===1?props.row.OrderDetails[0].Dosage:''}}{{props.row.EffectiveTime===1?props.row.OrderDetails[0].DosageUnit:''}}&nbsp;{{props.row.UsageText}}&nbsp;&nbsp;{{props.row.FrequencyText}}&nbsp;&nbsp;{{props.row.OrderDays?props.row.OrderDays+'天':''}}&nbsp;&nbsp;
              <span v-if="props.row.DrippingSpeed">滴速&nbsp;{{props.row.DrippingSpeed}}&nbsp;ml/min&nbsp;&nbsp;</span>
              <span
                class="icon-skin"
                v-if="props.row.OrderDetails[0].IsSkinTest"
              ></span>
              <span class="icon-build-in" v-if="props.row.OrderDetails[0].IsSelfProvided"></span>
              <span class="icon-dai" v-if="props.row.IsOutHospitalMedicine"></span>
            </p>
          </div>
        </template>
      </template>
      <template
        v-else-if="props.row.OrderType===5 ||props.row.OrderType===3||props.row.OrderType===122 || props.row.OrderType===31"
      >
        <div
          class="advice-content-content"
        >{{props.row.OrderContent}}&nbsp;{{props.row.FrequencyText}}</div>
      </template>
      <template v-else-if="props.row.OrderType===0 ||props.row.OrderType===1">
        <div class="advice-content-content">
          <!-- {{props.row.OrderContent}}&nbsp;{{props.row.FrequencyText}}&nbsp;{{props.row.OrderDetails[0].Count}}{{props.row.OrderDetails[0].Unit}}&nbsp; 
          诊间手术和治疗没有row.OrderDetails内容-->
           {{props.row.OrderContent}}&nbsp;&nbsp;{{props.row.EffectiveTime===1?props.row.OrderDetails[0].Count:''}}{{props.row.EffectiveTime===1?props.row.OrderDetails[0].Unit:''}}&nbsp;&nbsp;{{props.row.FrequencyText}}
          <span
            class="icon-urgency"
            v-if="props.row.IsEmergency"
          ></span>
          <span class="icon-bed" v-if="props.row.IsBed"></span>
        </div>
      </template>
      <template v-else-if="props.row.OrderType===15">
        <div class="advice-content-content">{{props.row.OrderContent}}</div>
      </template>
      <template v-else-if="props.row.OrderType===7">
        <div class="advice-content-content">
          <p
            v-for="(item, index) in props.row.OrderDetails"
            :key="index"
          >{{item.DictItemName}}&nbsp;&nbsp;{{item.SampleName}}</p>
        </div>
        <div class="jianca" v-if="props.row.CheckFormModel">
          <span class="icon-bed" v-if="props.row.CheckFormModel.IsBed"></span>
          <span class="icon-urgency" v-if="props.row.CheckFormModel.IsEmergency"></span>
        </div>
      </template>
      <template v-else-if="props.row.OrderType===8">
        <div class="advice-content-content">
          <p v-for="(item, index) in props.row.OrderDetails" :key="index" class="warp">
            {{item.DictItemName}}&nbsp;&nbsp;{{item.SampleName}}
            <template
              v-if="props.row.Status===1&&props.isCheckedCharge"
            >
              <p class="min-item" v-for="el in item.ChildItems" :key="el.Id">{{el.DictItemName}}</p>
            </template>
          </p>
        </div>
        <div class="jianca" v-if="props.row.TestFormModel">
          <span class="icon-out" v-if="props.row.TestFormModel.IsOtherTest"></span>
          <span class="icon-urgency" v-if="props.row.TestFormModel.IsEmergency"></span>
        </div>
      </template>
      <template v-else-if="props.row.OrderType===4">
          <div class="advice-content-blood" v-if="props.row.BloodTypeName">
            <span>{{props.row.BloodTypeName }}&nbsp;&nbsp;</span>
            <span v-if="props.row.RH">RH<sup>{{props.row.RH==='阳性'?'+':'-'}}</sup>&nbsp;&nbsp;</span>
          </div>
          <div class="advice-content-name">
            <div class="item" v-for="(item, index) in props.row.OrderDetails" :key="index">
              {{item.ItemName}}&nbsp;&nbsp;{{item.Count}} {{item.Unit}}
            </div>
          </div>
          <div class="advice-content-content">
            <p>静滴&nbsp;ST</p>
          </div>
      </template>
    </template>
  </div>
</template>

<style scoped lang='less'>
//医嘱内容
.advice-content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  &-group {
    // margin: 5% 0;
    height: 100%;
    width: 13px;

    box-sizing: border-box;
    padding: 15px 5px 15px 0;
    .item {
      width: 8px;
      height: 100%;
      border: 2px solid #979797;
      border-right: none;
    }
  }
  //  .advice-content-content{
  //     flex: 1;
  //   }
  &-name {
    margin-right: 15px;
    padding: 4px 0;
    &.drup {
      margin-right: 7%;
    }
    .item {
      margin-bottom: 14px;
      &:last-child {
        margin: 0;
      }
    }
  }
  .jianca {
    margin-left: 20px;
  }
  .min-item {
    padding-left: 20px;
    font-size: 12px;
    color: rgba(47, 51, 68, 0.7);
  }
}
</style>
