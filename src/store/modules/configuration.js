const namespaced = true
// 配置项管理
const state = {
  isCheckedCharge: true, //检验医嘱是否可选小项目
  drugUnit: '0', //抢救留观药品数量单位
  inHosPatDataRouter: "", //抢救留观数据跳转
  clinicPatDataRouter: "", // 急门诊数据跳转
  isRegister: '0', //是否启用医生站挂号功能
  isQueueNumber: '0', //是否启用排队叫号系统
  docMedicalCar: '1',
  inHosCost: '0', //是否启用诊间结算 0 禁用 1启用
  callNumber: '', //叫号系统第三方厂商简称
  signName: '', //签名系统第三方厂商简称
  IsValidateMedicine: '0', //合理用药接入厂商类型
  isTray:"2", //医生站挂号收费是否调用托盘程序：1调用托盘程序，2不调用托盘程序 
  // requestRule:"2",//是否根据项目分组进行检查/检验申请单分单：1、否 2、是,
  testRule:"2", //是否根据项目分组进行检验申请单分单：1、否 2、是,
  ckeckRule: "2" ,//是否根据项目分组进行检查申请单分单：1、否 2、是,
  medicareList: [],//医保限制用药需要审核的费别代码
  isIMIS:'0',//医生站是否启用医保控费:0为不启用；1为启用卫宁医保控费；
  isReportCard:'1',//是否启动报卡系统
  shaoXingTwoHospital:0,
  isMalignantFlag:0,//检查是否展示出恶性肿瘤的勾选框 1为展示，0为不展示
}

const getters = {
  GET_ISMALIGNANTFLAG({isMalignantFlag}){
    return isMalignantFlag
  },
  GET_shaoXingTwoHospital({
    shaoXingTwoHospital
  }){
    return shaoXingTwoHospital
  },
  GET_REQUESTRULE({requestRule}){
    return requestRule
  },
  GET_TESTRULE({testRule}){
    return testRule
  },
  GET_CHECKRULE({ckeckRule}){
    return ckeckRule
  },
  GET_ISTRAY({isTray}){
    return isTray
  },
  GET_DOCMEDICALCAR({
    docMedicalCar
  }) {
    return docMedicalCar
  },
  GET_ISCHECKEDCHARGE({
    isCheckedCharge
  }) {
    return isCheckedCharge
  },
  GET_DRUPUNIT({
    drugUnit
  }) {
    return drugUnit
  },
  GET_INHOSPATDATAROUTER({
    inHosPatDataRouter
  }) {
    return inHosPatDataRouter
  },
  GET_CLINICPATDATAROUTER({
    clinicPatDataRouter
  }) {
    return clinicPatDataRouter
  },
  GET_ISREGISTER({
    isRegister
  }) {
    return isRegister
  },
  GET_ISQUEUENUMBER({
    isQueueNumber
  }) {
    return isQueueNumber
  },
  GET_INHOSCOST({
    inHosCost
  }) {
    return inHosCost
  },
  GET_CALLNUMBER({
    callNumber
  }) {
    return callNumber
  },
  GET_SIGNNAME({
    signName
  }) {
    return signName
  },
  GET_ISVALIDATEMEDICINE({
    IsValidateMedicine
  }) {
    return IsValidateMedicine
  },
  GET_MEDICARELIST({
    medicareList
  }) {
    return medicareList
  },
  GET_ISIMIS({
    isIMIS
  }) {
    return isIMIS
  },
  GET_ISREPORTCARD({
    isReportCard
  }) {
    return isReportCard
  },
  
}
// 同步操作
const mutations = {
  // 设置配置项
  setConfiguration(state, data) {
    console.log(data,"dsofhed foeh")
    data.forEach(item => {
      let type = item.Code;
      switch (type) {
        case 'isCheckedCharge':
          state.isCheckedCharge = item.Value > 0 ? true : false;
          break;
          case 'medicareReimbursement':
            state.medicareList = item.Value.split(',');
            break;
        case 'drugUnit':
        case 'isRegister':
        case 'inHosCost':
        case 'docMedicalCar':
        case 'callNumber':
        case 'signName':
        case 'isQueueNumber':
        case 'IsValidateMedicine':
        case 'isTray':
        case 'requestRule':
        case 'testRule':
        case 'checkRule':
        case 'isIMIS':
        case 'isReportCard':
        case 'isMalignantFlag':
        case 'shaoXingTwoHospital':
          state[type] = item.Value
          break;
        case 'patDataRouter':
          let inHosPat = item.Value.slice(0, 1);
          let clinicPat = item.Value.slice(1, 2);
          state.inHosPatDataRouter = getRouter(inHosPat)
          state.clinicPatDataRouter = getRouter(clinicPat)
          break;
      }
    })
  },
}
// 异步操作
const actions = {}
export default {
  state,
  namespaced,
  getters,
  mutations,
  actions
}
let getRouter = (val) => {
  switch (val) {
    case '1':
      return 'patients';
    case '2':
      return 'medicalHistory';
    case '3':
      return 'openDoctorAdvice';
    case '4':
      return 'diagnose';
  }
}
