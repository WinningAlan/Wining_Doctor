import {
  ajax as A
} from '../utils/ajax'
const apiPrefix = '/api/v1/Account/'
export default {
  login: (params) => A(params, apiPrefix + 'Login', 'post', "Master"),
  changePwd: (params) => A(params, apiPrefix + 'ChangePwd', 'post', 'Master'),
  logout: (params) => A(params, apiPrefix + 'Logout', 'get', 'Master'),
  getUserHistoryMessage: (params) => A(params, '/api/v1/Message/GetUserHistoryMessage', 'get', 'Master'),
  getNotReadMessageList: (params) => A(params, '/api/v1/Message/GetNotReadMessageList', 'get', 'Master'),
  updateUserMessageStatus: (params) => A(params, '/api/v1/Message/UpdateUserMessageStatus', 'post', 'Master'),
  getMessage: (params) => A(params, '/api/v1/Message/GetMessage', 'get', 'Master'),
  getDictionarry: (params) => A(params, 'api/v1/Dictionary/GetDictList', 'get', 'Master'),
  getTableData: (params) => A(params, "/api/v1/DictionariesComm/Select", "post",'Master'),
  getDoctorConfig: (params) => A(params,"/api/v1/SysConfig/SystemConfig","get","Master",true),
  getFeeTypeList: (params) => A(params,"/api/v1/Dictionary/FeeTypeList","get","Master",true),
  getEmergencyDepment: (params) => A(params,"/api/v1/Dictionary/GetEmergencyDepment","get","Master",true),
  getTimerArr: (params) => A({},"/api/v1/InHospital?inHospPatId="+params.id,"post","Master"),
}
