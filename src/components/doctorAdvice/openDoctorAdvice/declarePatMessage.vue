<template>
  <div class="declear doctor-advice" >
    <el-form :model="declareMessage" :rules="rules" ref="declareForm">
      <el-form-item label="居住地" prop="居住地">
        <el-input v-model="declareMessage['居住地']" placeholder="请输入居住地"></el-input>
      </el-form-item>
      <el-form-item label="证件类型" prop="证件类型">
        <el-select v-model="declareMessage['证件类型']" placeholder="请选择" clearable>
          <el-option
            v-for="item in documentType"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="证件号码" prop="证件号码">
        <el-input v-model="declareMessage['证件号码']" placeholder="请输入证件号码"></el-input>
      </el-form-item>
      <el-form-item label="人员来源" prop="人员来源">
        <el-select v-model="declareMessage['人员来源']" clearable placeholder="请选择">
          <el-option
            v-for="item in sersonnelSource"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="人员身份" prop="人员身份(必填)">
        <el-select v-model="declareMessage['人员身份(必填)']" placeholder="请选择" clearable>
          <el-option
            v-for="item in personnelIdentity"
            :key="item.value"
            :value="item.value"
            :label="item.text"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="14天内境外入境" prop="14天内境外入境(必填)">
        <el-select v-model="declareMessage['14天内境外入境(必填)']" placeholder="请选择" clearable>
          <el-option
            v-for="item in isForeign"
            :key="item.text"
            :label="item.text"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import {
  sersonnelSource,
  isForeign,
  personnelIdentity,
  documentType
} from "@/module/staticData.js";
export default {
  props: {
    declareMessage: Object
  },
  data() {
    return {
      rules: {
        '居住地': [{ required: true, message: "请输入居住地", trigger: "blur" }],
        '证件类型': [
          { required: true, message: "请选择证件类型", trigger: "blur" }
        ],
        '证件号码': [
          { required: true, message: "请输入证件号码", trigger: "blur" }
        ],
        '人员来源': [
          { required: true, message: "请选择人员来源", trigger: "blur" }
        ],
        "人员身份(必填)": [
          { required: true, message: "请选择人员身份", trigger: "blur" }
        ],
        "14天内境外入境(必填)": [
          { required: true, message: "请选择14天内境外入境", trigger: "blur" }
        ]
      },
      //   identityList: [],
      //   certificateTypeList: []
      sersonnelSource: sersonnelSource,
      isForeign: isForeign,
      personnelIdentity: personnelIdentity,
      documentType: documentType
    };
  },
  created() {
    //this.getIdentifyList();
  },
  computed: {
    // ...mapGetters({
    //   dict: "public/GET_DICTIONARIES"
    // })
  },
  methods: {
    save() {
      return new Promise((resolve, reject) => {
        this.$refs.declareForm.validate(valid => {
          if (valid) {
              resolve(true)
          }else{
              reject(false)
          }
        });
      });
    }
    // getIdentifyList() {
    //   this.$Api.getIdentityList().then(res => {
    //     if (res.Status) {
    //       this.identityList = res.Data || [];
    //     }
    //   });
    // },
    // getCertificateTypeList() {
    //   this.$Api.getCertificateTypeList().then(res => {
    //       if(res.Status) {
    //           this.certificateTypeList=res.Data || [];
    //       }
    //   });
    // }
  }
};
</script>
<style lang="less" scoped>
@import url("./adviceStyle.less");
.declear {
  padding: 20px;
      border: none;
    box-shadow: none;
  /deep/.el-input {
    width: 365px;
  }
  /deep/.el-form-item__label {
    width: 130px;
  }
  /deep/.el-form-item__error{
      left:132px;
  }
}
</style>