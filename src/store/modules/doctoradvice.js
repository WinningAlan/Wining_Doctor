const namespaced=true
const state={
    orderClassification: [],//医嘱类别列表
    testItemCodeList:[],//存放急诊下面的检擦项目的code
}
const getters = {
    GET_ORDERCLASSIFICATION({orderClassification}){
        return orderClassification
    },
    GET_TESTITEMCODELIST({ testItemCodeList }) {
        return testItemCodeList
     },
    
}
const mutations = {
    SET_ORDERCLASSIFICATION(state,data){
        state.orderClassification=data
    },
    SET_TESTITEMCODELIST(state, data) { 
        state.testItemCodeList = data;
    }
}
const actions = {}
export default {
    state,
    namespaced,
    getters,
    actions,
    mutations
}