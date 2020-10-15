const namespaced = true
const state = {
    caseData:null,
    checkData:null,
    sortShow:false
}
const getters = {
    GET_CASEDATA({caseData}){
        return caseData
    },
    GET_CHECKDATA({ checkData }){
        return checkData
    },
    GET_SORTSHOW({sortShow}){
        return sortShow
    }
}
const mutations = {
   SET_CASEDATA(state,data){
       state.caseData = data
   },
   SET_CHECKDATA(state,data){
       state.checkData = data
   },
   SET_SORTSHOW(state,data){
       state.sortShow = data
   }
}
const actions = {

}
export default {
    namespaced,
    getters,
    mutations,
    actions,
    state
}