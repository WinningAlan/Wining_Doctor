<template>
  <div class="bodySurfaceArea">
    <div class="warp">
      <div class="item" v-if="formulaData.colName" style="width:100%">
        <p class="bold" v-for="(item, index) in formulaData.colName" :style="{width:100/formulaData.colName.length+'%'}" :key="index">{{item}}</p>
      </div>
      <div
        class="item"
        v-for="(item, index) in formulaData.itemList"
        :key="index"
        :style="{width:100/item.col+'%'}"
      >
        <p class="label" :style="{width:item.col===3?'140px':''}">{{item.label?item.label+'：':''}}</p>
        <myKeypad
          :value.sync="inputData[item.value]"
          :focusIndex.sync="focusIndex[item.value]"
          v-if="item.type==='number'"
        >
          <el-input-number
            v-model="inputData[item.value]"
            slot="reference"
            @blur="getFocusIndex([item.value],$event)"
            :min="item.min"
            :max="item.max"
            :precision="item.precision"
            :controls="false"
          ></el-input-number>
        </myKeypad>
        <p class="none" v-else-if="item.type==='none'"></p>
        <el-radio-group v-model="inputData[item.value]" v-else-if="item.type==='radio'">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">女</el-radio>
        </el-radio-group>
        <p class="result" v-else>{{resultData[item.value]}}</p>
      </div>
    </div>
    <p class="reset">
      <el-button @click="reset">重置</el-button>
    </p>
    <p class="line"></p>
    <p class="text" v-if="formulaData.remark">注意：{{formulaData.remark}}</p>
    <p class="text" v-if="formulaData.formulaText">
      计算式：
      <span v-for="(item, index) in formulaData.formulaText" :key="index">{{item}}</span>
    </p>
  </div>
</template>

<script>
import myKeypad from "./myKeypad.vue";
import { mapGetters } from "vuex";

let regPow = /[A-Za-z0-9]+[\.]?[A-Za-z0-9]*\^[-]?[\d]+[\.]?[\d]*/g;
let regSqrt = /√\([\S]+\)/g;

export default {
  name: "bodySurfaceArea", //体表面积
  components: {
    myKeypad
  },
  props: {
    // 基础数据
    formulaData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      // 输入数据
      inputData: {},
      //输入框失去焦点的位置
      focusIndex: {}
    };
  },
  created() {
  
    
    // this.formulaData.itemList.forEach(item=>{
    //   if (item.value) {
    //     this.inputData[item.value]=item.value==='sex'?1:undefined;
    //   }
    // })
  },
  mounted() {
      this.inputData.sex = this.patientMsg.PatGenderCode ||1;
    this.inputData.age =this.patientMsg.Age?parseFloat( this.patientMsg.Age):1;
    this.inputData={... this.inputData}
  },
  computed: {
        ...mapGetters({
      patientMsg: "public/GET_PATIENTMSG",
    }),
    // 结果数据

    resultData() {
      let obj = {};
      let rulsData = this.formulaData.formulaList;
      for (const r in rulsData) {
        let ruls = rulsData[r];
        this.inputData[r] = this.inputData[r] ? this.inputData[r] : undefined;

        let off = true;
        for (const key in this.inputData) {
          //   if (this.inputData[key]===undefined) return obj;
          off = false;
          ruls = ruls.replace(
            new RegExp(key, "g"),
            this.inputData[key] === undefined ? NaN : this.inputData[key]
          );
          // console.log(ruls, "90");
        }
        // console.log(off,'off');
        if (off) return obj;
        // console.log(ruls, "now");

        ruls = ruls.replace(/[a-zA-Z]+/g, NaN);
        // console.log(ruls, "NaN");
        if (ruls.indexOf("√") > -1) {
          let sqrtArr = this.getStr(ruls, regSqrt);
          sqrtArr.forEach(e => {
                   try {
               let r = e.replace("√", "");
               r=eval(r)
            let n = Math.sqrt(r);
            // console.log(r,n,'nr');
            ruls = ruls.replace(e, n);
          } catch (error) {
            // console.log(ruls,'计算公式格式错误，请重新设置！');
            this.$msg.warning("计算公式格式错误，请重新设置！");
          }
       
          });
          // console.log(ruls,'sqrt');
          // ruls = ruls.replace("√", "");
          // try {
          //   obj[r] = eval(ruls);
          // this.inputData[r]=  obj[r] = isNaN(obj[r])
          //     ? undefined
          //     : parseFloat(Math.sqrt(obj[r]).toFixed(3));
          // } catch (error) {
          //   console.log(ruls,'计算公式格式错误，请重新设置！');
          //   this.$msg.warning("计算公式格式错误，请重新设置！");
          // }
        }
        if (ruls.indexOf("^") > -1) {
          let powArr = this.getStr(ruls, regPow);
          powArr.forEach(el => {
            let base = el.slice(0, el.indexOf("^"));
            let exponent = el.slice(el.indexOf("^") + 1);
            console.log(base,exponent,'exponent');
            let num = Math.pow(base, exponent);
            ruls = ruls.replace(el, num);
          });
          // let num=ruls.slice(ruls.indexOf('^') + 1,ruls.indexOf('^') +2)
          // let s=ruls.slice(ruls.indexOf('^') -1 ,ruls.indexOf('^') )
          // let str=''
          // for (let index = 0; index < num-1; index++) {
          //     str+=`*${s}`
          // }
          // ruls= ruls.replace("^"+num, str)
          console.log(ruls, "ruls");
        }
        try {
          obj[r] = eval(ruls);
          this.inputData[r] = obj[r] = isNaN(obj[r])
            ? undefined
            : parseFloat(obj[r].toFixed(3));
        } catch (error) {
          this.$msg.warning("计算公式格式错误，请重新设置！");
          console.log(ruls, "计算公式格式错误，请重新设置！");
        }
      }
      console.log(obj);
      return obj;
    }
  },
  methods: {
    getResult(){
      let off=true;
      let str=''
      Object.keys(this.resultData).forEach(key=>{
        let value=this.resultData[key]
        if (!value) return off=false
        this.formulaData.itemList.forEach(item=>{
          if (item.value===key) {
            str+=`${item.label}：${value},`
          }
        })
      })
      if (!off) {
        this.$msg.warning('无可插入的数据！');
        return false
      } else {
        return str.substring(0, str.length - 1)
      }
    },
    // 重置
    reset(){
      for (const key in this.inputData) {
        if (this.inputData.hasOwnProperty(key)&&key!=='age'&&key!=='sex') {
          this.inputData[key]=undefined
        }
      }
          this.inputData.sex = this.patientMsg.PatGenderCode||1;
    this.inputData.age =this.patientMsg.Age?parseFloat( this.patientMsg.Age):1;
    },
    getFocusIndex(type, el) {
      console.log(el.target.selectionStart);
      this.focusIndex[type] = el.target.selectionStart;
      this.focusIndex={...this.focusIndex}
      console.log(this.focusIndex[type],type);
    },
    getStr(str, reg,arr=[]) {
      // let arr = [];
      // console.log(str, reg,arr,'str, reg,arr');
      let text = reg.exec(str);
      if (text) {
        arr.push(text[0]);
        return this.getStr(str, reg,arr);
      } else {
        // console.log("object,", arr);
        return arr;
      }
    }
  }
};
</script>
<style scoped lang='less'>
.bodySurfaceArea {
  /deep/ .el-input-number {
    //   float: left;
    .el-input__inner {
      background: @controlBg;
      border: none;
      width: 155px;
    }
  }
  
  .warp {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
  }
  .item {
    height: 32px;
    margin-bottom: 10px;
    // flex: 1;
    line-height: 32px;
    display: flex;
    justify-content: center;
    > span {
      width: 155px;
    }
    .bold{
      font-weight: bold;
      font-size: 16px;
text-align: center;
    }
    .label {
      //   float: left;
      width: 220px;
      text-align: right;
      color: #606266;
    }
    .result {
      width: 155px;
      height: 32px;
      background: @controlBg;
      border-radius: 5px;
      text-align: center;
    }
    .none {
      width: 155px;
      height: 32px;
    }
    .el-radio-group {
      width: 155px;
      .el-radio {
        // height: 32px;
        padding: 8px 0;
      }
    }
  }
  .reset{
    height: 32px;
    margin: 40px 0 0;
    padding-bottom: 10px;
    border-bottom:1px solid  @controlBg;
    .el-button{
      float: right;
    }
  }
  // .line {
  //   height: 1px;
  //   margin: 40px 0 10px;
  //   background: @controlBg;
  // }
  .text {
    line-height: 32px;
    text-align: center;
    > span:nth-child(n + 2) {
      display: block;
      padding-left: 60px;
    }
  }
}
</style>
