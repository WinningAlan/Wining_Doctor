import {ajax} from '../utils/ajax'
export default {
    getPatientSummary: (params) => ajax(params,'/api/v1/Patient/PatientSummary','POST','Doctor' ),//获取卡片概览
    patientSummaryConfig: (params) => ajax(params,'/api/v1/Patient/PatientSummaryConfig','PUT','Doctor'),//设置概览卡片
    getInHospitalPatient:(params) => ajax(params,'/api/v1/Patient/InHospitalPatientGet','POST'),//获取抢救留观患者列表
    getClinicPatient:(params) => ajax(params,'/api/v1/Patient/ClinicPatientGet','POST'),//获取急门诊患者列表
    patReceive:(params) => ajax(params,'/api/v1/Patient/PatientReceive','PUT'),
    // ajax({},`/api/v1/Patient/PatientReceive?triageId=${triageId||''}&patientId=${patientId||''}&registerId=${registerId||''}&departmentCode=${departmentCode}&triageLevel=${triageLevel}`,'PUT'),//接诊
    patEndReceive:({id}) => ajax({},'/api/v1/Patient/PatientEndReceive?id='+id,'PUT'),//结束接诊
    //patRecall:({id}) => ajax({},'/api/v1/Patient/PatientRecall?id='+id,'PUT'),//召回
    getBedCardConfig:(params) => ajax(params,'/api/v1/Patient/BedCardItemConfigGet'),//获取配置项
    setBedCardConfig:(params) => ajax(params,'/api/v1/Patient/BedCardItemConfigUpdate','PUT'),//修改配置项
    exportInHospitalPatient:(params) => ajax(params,'/api/v1/Patient/InHospitalPatientExport'),// 抢救/留观患者导出
    exportClinicPatient:(params) => ajax(params,'/api/v1/Patient/ClinicPatientExport'),// 门急诊患者导出
    // 设置患者重点关注或取消
    setAttentionTag:(params) => ajax(params,"/api/v1/Patient/SetPatientAttentionTag","PUT"),
    // 患者召回
    patCallback:(params)=>ajax(params,"/api/v1/Patient/PatRecall","PUT"),
    // 召回可用床位列表
    getBedList:()=>ajax({},"/api/v1/Patient/ActiveBedList","PUT"),
    cancelReceive:(params)=>ajax({},"/api/v1/Patient/PatientCancelReceive?id="+params.id,"PUT"),//取消接诊
}
