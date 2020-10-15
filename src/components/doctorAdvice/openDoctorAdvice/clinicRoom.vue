<!--
 * @Author: your name
 * @Date: 2020-09-22 13:05:28
 * @LastEditTime: 2020-09-22 14:02:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \EDIS\Doctor\src\components\doctorAdvice\openDoctorAdvice\clinicRoom.vue
-->
<template>
    <div class="clinic_room">
        <div class="header">
            <!-- <p>结果：</p> -->
            <p>总费用：<span>{{alterData.childData.TotalFee}}{{alterData.childData.TotalFee?'元':''}}</span></p>
            <p>个人费用：<span>{{alterData.childData.PersonalFee}}{{alterData.childData.PersonalFee?'元':''}}</span></p>
        </div>
        <div class="pat_type">
            <p>支付方式：</p>
            <el-radio-group v-model="alterData.childData.PayType">
              <el-radio label="7">微信</el-radio>
              <el-radio label="1">支付宝</el-radio>
            </el-radio-group>
        </div>
        <div class="code_result">
            <span>扫码结果：</span>
            <el-input v-model="alterData.childData.ScanValue" placeholder="请扫码" style="width:200px"></el-input>
        </div>
    </div>
</template>
<script>
export default {
    name:"clinicRoom",
    props:{
        alterData:{
            type:Object,
            default:()=>{
                return {
                    childData:{ }
                }
            }
        }
    }
}
</script>
<style lang="less" scoped>
  .clinic_room{
      height:240px;
      padding:20px;
      box-sizing: content-box;
      .header{
          display: flex;
          justify-content: space-around;
          padding-bottom: 30px;
         
      }
      .pat_type{
          padding-left:55px;
          padding-bottom:40px;
          p{
              padding-bottom:10px;
          }
      }
      .code_result{
         text-align: center;
      }
  }
</style>
