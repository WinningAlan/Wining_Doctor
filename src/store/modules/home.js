import {
  getSession,
  setSession
} from '../../utils/storage';
const state = {
  
  selectArea:{},//选择的区域对象
  
  cards:[],//所有卡片选项
  reportShow: false,//显示辅助模块
  dialogData:{
    component: "readReport",
    width: "1366px",
    title: '报告调阅'
  },
  doctorSelectDep:'',//开始接诊选择科室
  isPauseDoctor:1,//是否暂停接诊 0 暂停接诊  1 继续接诊
  callNumberList:[],//叫号队列
  searchSelectDep: ['0'],//根据科室过滤筛选的
  justMe: false,//仅看我
  selectDep: ['0'],//急门诊科室
  cardContent: {},//当前选中的卡片
}
const namespaced = true
const getters = {
  GET_SELECTAREA({ selectArea }) {
    if (!selectArea.DiagnosisAreaType) {
      return getSession('selectArea') ||selectArea
    }
    return selectArea || getSession('selectArea')
  },
  
  GET_CARDS({cards}) {
    return cards
  },
  GET_REPORTSHOW({reportShow}){
    return reportShow
  },
  GET_DIALOGDATA({
    dialogData
  }) {
    return dialogData
  },
  GET_DOCTORSELECTDEP({doctorSelectDep}){
    return doctorSelectDep
  },
  GET_ISPAUSEDOCTOR({isPauseDoctor}) {
    return isPauseDoctor
  },
  GET_CALLNUMBERLIST({callNumberList}) {
    return callNumberList
  },
  GET_SEARCHSELECTDEP({searchSelectDep}) {
    return searchSelectDep
  },
  GET_JUSTME({justMe}) {
    return justMe
  },
  GET_SELECTDEP({selectDep}) {
    return selectDep
  },
  GET_CARDCONTENT({ cardContent }) {
    return cardContent
  },

}
// 同步操作
const mutations = {
  SET_SELECTAREA(state, data) {
    setSession('selectArea',data)
    state.selectArea = data
  },
  
  SET_CARDS(state,data) {
    state.cards = data
  },
  SET_REPORTSHOW(state,data){
    state.reportShow = data;
  },
  SET_DIALOGDATA(state, data) {
    state.dialogData = data
  },
  SET_DOCTORSELECTDEP(state,data){
    state.doctorSelectDep = data
  },
  SET_ISPAUSEDOCTOR(state,data) {
    state.isPauseDoctor = data
  },
  SET_CALLNUMBERLIST(state,data) {
    state.callNumberList = data
  },
  SET_SEARCHSELECTDEP(state,data) {
    state.searchSelectDep=data
  },
  SET_JUSTME(state, data) {
    state.justMe=data
  },
  SET_SELECTDEP(state, data) {
    state.selectDep=data
  },
  SET_CARDCONTENT(state, data) {
    state.cardContent=data
  },

}
// 异步操作
const actions = {
  // 获取 所有的卡片概览信息
  getPatSummary({commit},{that,params}){
    that.$Api.getPatientSummary(params).then(res => {
      if(res.Status) {
        commit("SET_CARDS", res.Data);
      }
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions,
  namespaced
}
