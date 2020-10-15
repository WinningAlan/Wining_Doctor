const namespaced = true
const state = {
    pw:'',
    selectPatList:[],//选择的患者列表
}
const getters = {
    GET_PW({pw}) {
        return pw
    },
    GET_SELECTPATLIST({selectPatList}) {
        return selectPatList
    }
}
const mutations = {
    SET_PW(state,data) {
        state.pw = data
    },
    SET_SELECTPATLIST(state,data) {
        state.selectPatList = data
    }
}
const actions = {}
export default {
    namespaced,
    getters,
    mutations,
    actions
}