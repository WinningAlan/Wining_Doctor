import {ajax} from '../utils/ajax'
export default {
    getOutHosPats:(params)=> ajax(params,'/api/v1/Patient/OutHospitalPatientGet','POST'),//获取出急诊科患者列表
    getDoctorList:(params)=>ajax(params,'/api/v1/User/DoctorList','get','Master')
}