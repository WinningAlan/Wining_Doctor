const namespaced = true
import {
  getNavData,
  getPermissionsName
} from '@/utils/storage';
const state = {
  user: null, //用户信息
  userName: '', //用户名
  userNo: '', //工号
  navList: [], //菜单
  permissions: [], //只有name的权限列表
  isShow: false,
  hospitalAreaId: 'ccec3b76-7e1f-e911-80cd-0050568e1b08', //医院区域Id
  messageCount: 0, //信息数量
  MssageList: [], //信息列表
  messageCheckOpen: "", //信息下拉列表是否显示
  collapse: false, //导航是否展开收起
  isShowList: true, //患者列表是否显示
  dictionaries: {}, //所有字典数据
  dictionariesDefault: {}, //所有字典数据的默认选项
  patientMsg: {}, //患者基本信息
  timeArr: [], //仪器时间范围
  updatePatientList: 0, //用于更新患者列表
  dialogData: {
    title: '',
    width: '',
    component: '',
    visible: false,
    data: {}
  }, //弹窗的打包数据
  inHosPatDep: [], //入院科室
  printIframeUrl: '', // 要打印的url
  patientTableList: [], //患者表格列表
  bloodTypes: [], //血型
  allDepartments: [], //所有执行科室
  defaultTemplent: [], //所有诊疗区默认病历id
  showLoading: false, //都昌模板加载显示loading
  doctorScheduleInfo: [], //医生交班班次
  feeTypeList:[],//所有费别
  userRightList: [],//用户权限
  helperSetMenu:[],//辅助功能列表
  medicalAddEvent:false,//电子病历是否监听都昌事件  true监听  false不监听
  isSignSuccess: false,//是否签名成功  
  isGetCA: false,//检查签名硬件
  isSignName: 0,//是否启用签名系统  0 禁用 1启用
  signName: '',//签名系统简称
  reportConfig:[],//报告调阅配置
  caImgData: '',//ca签名图片数据流，提交医嘱提交
  groupArr:[],//材料大项数组
  caRequestLoading: '',//请求ca loading加载
  allDep: [],//所有院区的科室
  activeRegistId: '',//当前挂号ID
  greenChanneType:{},//绿色通道字典
};

const getters = {
  GET_USER({
    user
  }) {
    return user;
  },
  GET_USERNAME({
    userName
  }) {
    return userName;
  },
  GET_NAVLIST({
    navList
  }) {
    return navList;
  },
  GET_USERNO({
    userNo
  }) {
    return userNo;
  },
  GET_PERMISSIONS({
    permissions
  }) {
    return permissions;
  },
  GET_ISSHOW({
    isShow
  }) {
    return isShow
  },
  GET_MESSAGECOUNT({
    messageCount
  }) {
    return messageCount;
  },
  GET_MESSAGELIST({
    MssageList
  }) {
    return MssageList;
  },
  GET_MESSAGECHECKOPEN({
    messageCheckOpen
  }) {
    return messageCheckOpen;
  },


  GET_HOSPITALAREAID({
    hospitalAreaId
  }) {
    return hospitalAreaId;
  },
  GET_COLLAPSE({
    collapse
  }) {
    return collapse;
  },
  GET_ISSHOWLIST({
    isShowList
  }) {
    return isShowList;
  },
  GET_DICTIONARIES({
    dictionaries
  }) {
    return dictionaries
  },
  GET_DICTIONARIESDEFAULT({
    dictionariesDefault
  }) {
    return dictionariesDefault
  },
  // 根据type值获取对应的字典数据
  // 调用方法为this.$store.getters['public/getDic']("InHospWay")
  getDic: ({
    dictionaries
  }) => (type) => {
    return dictionaries[type]
  },
  // 根据type值获取对应的字典数据默认值

  getDefault: ({
    dictionariesDefault
  }) => (type) => {
    return dictionariesDefault[type]
  },
  GET_PATIENTMSG({
    patientMsg
  }) {
    return patientMsg
  },
  GET_TIMEARR({
    timeArr
  }) {
    return timeArr
  },
  GET_UPDATEPATIENTLIST({
    updatePatientList
  }) {
    return updatePatientList
  },

  GET_DIALOGDATA({
    dialogData
  }) {
    return dialogData
  },
  //inHosPatDep
  GET_INHOSPATDEP({
    inHosPatDep
  }) {
    return inHosPatDep
  },
  // printIframeUrl
  GET_PRINTIFRAMEURL({
    printIframeUrl
  }) {
    return printIframeUrl
  },
  GET_PATIENTTABLELIST({
    patientTableList
  }) {
    return patientTableList;
  },
  GET_BLOODTYPES({
    bloodTypes
  }) {
    return bloodTypes
  },
  GET_ALLDEPARTMENTS({
    allDepartments
  }) {
    return allDepartments
  },


  // 获取各区默认病历模板id
  GET_DEFAULTTEMPLENT({
    defaultTemplent
  }) {
    return defaultTemplent
  },
  GET_SHOWLOADING({
    showLoading
  }) {
    return showLoading
  },
  // 医生交班班次
  GET_DOCTORSCHEDULEINFO({
    doctorScheduleInfo
  }) {
    return doctorScheduleInfo
  },
  GET_FEETYPELIST({
    feeTypeList
  }) {
    return feeTypeList
  },
  GET_USERRIGHTLIST({userRightList}){
    return userRightList
  },
  GET_HELPERSETMENU({helperSetMenu}){
    return helperSetMenu
  },
  GET_MEDICALADDEVENT({medicalAddEvent}) {
    return medicalAddEvent
  },
  // 是否签名成功
  GET_ISSIGNSUCCESS({ isSignSuccess }) {
    return isSignSuccess
  },
  GET_ISGETCA({ isGetCA }) {
    return isGetCA
  },
  GET_SIGNNAME({ signName }) {
    return signName
  },
  GET_ISSIGNNAME({ isSignName }) {
    return isSignName
  },
  GET_REPORTCONFIG({reportConfig}){
    return reportConfig
  },
  GET_CAIMGDATA({caImgData}){
    return caImgData
  },
  GET_GROUPARR({groupArr}){
    return groupArr
  },
  GET_CAREQUESTLOADING({caRequestLoading}) {
    return caRequestLoading
  },
  GET_ALLDEP({allDep}) {
    return allDep
  },
  GET_ACTIVEREGISTID({activeRegistId}) {
    return activeRegistId
  },
  GET_GREENCHANNETYPE(
    {greenChanneType}
  ){
    return greenChanneType
  },
}
// 同步操作
const mutations = {
  SET_USER(state, data) {
    state.user = data;
    if (data) {
      state.user.DiagnosisAreas.sort(function (a, b) {
        return a.DiagnosisAreaType - b.DiagnosisAreaType
      })
      state.userName = data.UserInfo.Name;
      state.userNo = data.UserInfo.No;
      state.navList = getNavData('Doctor');
      state.permissions = getPermissionsName(state.navList);
    } else {
      state.userName = '';
      state.userNo = '';
      state.navList = [];
      state.permissions = [];
    }
  },
  SET_ISSHOW(state, data) {
    state.isShow = data
  },
  SET_MESSAGECOUNT(state, data) {
    state.messageCount = data;
  },
  SET_MESSAGELIST(state, data) {
    state.MssageList = data;
  },
  SET_MESSAGECHECKOPEN(state, data) {
    state.messageCheckOpen = data;
  },
  SET_HOSPITALAREAID(state, data) {

    state.hospitalAreaId = data
  },
  SET_COLLAPSE(state, data) {
    if (!data) {
      state.isShowList = !data

    }
    state.collapse = data
  },
  SET_ISSHOWLIST(state, data) {
    if (!data) {
      state.collapse = !data

    }


    state.isShowList = data
  },
  SET_DICTIONARIES(state, data) {
    state.dictionaries = data

  },
  SET_DICTIONARIESDEFAULT(state, data) {
    state.dictionariesDefault = data
  },
  SET_PATIENTMSG(state, data) {
    state.patientMsg = data
  },
  SET_TIMEARR(state, data) {
    state.timeArr = data
  },
  SET_UPDATEPATIENTLIST(state, data) {
    state.updatePatientList = data
  },

  SET_DIALOGDATA(state, data) {
    state.dialogData = data
  },
  SET_INHOSPATDEP(state, data) {
    state.inHosPatDep = data
  },
  SET_PRINTIFRAMEURL(state, data) {
    state.printIframeUrl = data
  },
  SET_PATIENTTABLELIST(state, data) {
    state.patientTableList = data
  },
  SET_BLOODTYPES(state, data) {
    state.bloodTypes = data
  },
  SET_ALLDEPARTMENTS(state, data) {
    state.allDepartments = data
  },
 
  SET_DEFAULTTEMPLENT(state, data) {
    state.defaultTemplent = data
  },
  SET_SHOWLOADING(state, data) {
    state.showLoading = data
  },
  // 医生交班班次
  SET_DOCTORSCHEDULEINFO(state, data) {
    state.doctorScheduleInfo = data
  },
  SET_FEETYPELIST(state, data) {
    state.feeTypeList = data
  },
  SET_USERRIGHTLIST(state,data) {
    console.log(data,"用户权限提交")
    state.userRightList = data
  },
  SET_HELPERSETMENU(state, data) {
    state.helperSetMenu = data
  },
  SET_MEDICALADDEVENT(state, data) {
    state.medicalAddEvent = data
  },
  // 是否签名成功
  SET_ISSIGNSUCCESS(state, data) {
    state.isSignSuccess = data
  },
  SET_SIGNNAME(state, data) {
    state.signName = data
  },
  SET_ISGETCA(state, data) {
    state.isGetCA = data
  },
  SET_ISSIGNNAME(state, data) {
    state.isSignName = data
  },
  SET_REPORTCONFIG(state,data){
    state.reportConfig = data
  },
  SET_CAIMGDATA(state,data){
    state.caImgData=data
  },
  SET_GROUPARR( state, data ) {
    state.groupArr=data
  },
  SET_CAREQUESTLOADING(state,data) {
    state.caRequestLoading=data
  },
  SET_ALLDEP(state, data) {
    state.allDep=data
  },
  SET_ACTIVEREGISTID(state, data) {
    state.activeRegistId=data
  },
  SET_GREENCHANNETYPE(state,data){
    state.greenChanneType = data;
  },
}
// 异步操作
const actions = {
  async getPatientMsg({
    commit,
    state
  }, {
    that,
    data,
  }) {
    try {
      let res = await that.$Api.getPatientMsg(data);
      // let res = {"Status":true,"Message":"获取患者信息成功！","Count":0,"Data":{"TriageId":"8f122fd4-096c-408e-8ebb-ac3e01259c86","InHouseId":"2e391842-de18-4971-8154-ac3e0125aff2","ActiveRegistId":null,"BedId":"99a31b5c-7f1f-e911-80cd-0050568e1b08","PatientId":"45b9074e-18e8-4758-b856-ac1d00f0da2d","AreaId":"979319b6-7e1f-e911-80cd-0050568e1b08","AreaType":1,"Department":"1301","PatGenderCode":1,"PatientName":"小田","Age":"31岁10月24日","AgeYear":31,"AgeMonth":"10*24/30","SocialSecurityCode":"1","FeeType":"自费","IDType":"0","IDTypeName":"身份证","IDNumber":"421126198810292557","SocialSecurityNumber":"888","HISPatientId":"56595889","CurrentAreaName":"抢救区","BedNo":"A006","Diagnosis":null,"DiagnosisCode":null,"TriageLevel":2,"GreenChannelText":"","IsGroupInjury":false,"IsAllergy":false,"AttentionTag":0,"IsOpenGreenChannel":false,"ReceptionStatus":1,"InHospTime":"2020-09-22T17:49:00","Symptom":null,"DoctorName":null,"IsNew":false,"IsOperation":false,"IsDangerous":false,"IsPeril":false,"IsHeavy":false,"Remark":null,"RegisterInfoList":[],"IsRegister":false,"IsAdverseEventReport":false,"IsNosocomialInfectionReport":false,"IsDrgsReport":false,"RecordNumber":"56595889","FirstDoctorId":null,"FirstDoctor":null,"Height":null,"Weight":null,"IdentityCode":null,"IdentityName":null,"Phone":"13245678901","Address":"","HealthCardNumber":"","CardNumber":"888","BirthDay":"1988-10-29T00:00:00","Profession":"","WorkUnit":"","MaritalStatus":"","Status":4,"IsRecall":false}}
      if (res.Status && res.Data) {
        
        res.Data.TriageLevel=res.Data.TriageLevel ||null
        res.Data.TriageLevel=res.Data.TriageLevel===99?null:res.Data.TriageLevel
        res.Data.SocialSecurityCode_default = res.Data.SocialSecurityCode
        commit('SET_PATIENTMSG', res.Data);
        
        return true
      } else {
        that.$msg.warning(res.Message)
        return false
      }
    } catch (error) {
      return false
    }
    // that.$Api.getPatientMsg(data).then(res => {
    //   if (res.Status && res.Data) {
    //     commit('SET_PATIENTMSG', res.Data)
    //   } else {
    //     that.$msg.warning(res.Message)
    //   }
    // })
  }
}
export default {
  state,
  namespaced,
  getters,
  mutations,
  actions
}
