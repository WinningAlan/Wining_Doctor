const namespaced = true
const state = {
    orderPackageRange:[],//开套餐范围
    orderPackageType:[],//开套餐类型
};

const getters = {
    GET_ORDERPACKAGERANGE({orderPackageRange}) {
        return orderPackageRange
    },
    GET_ORDERPACKAGETYPE({orderPackageType}) {
        return orderPackageType
    },
}
// 同步操作
const mutations = {
    SET_ORDERPACKAGERANGE(state,data){
        state.orderPackageRange=data
    },
    SET_ORDERPACKAGETYPE(state,data) {1
        state.orderPackageType=data
    },
}
// 异步操作
const actions = {
}
export default {
    state,
    namespaced,
    getters,
    mutations,
    actions
}
