import {ajax} from '../utils/ajax'
export default {
    //交接班时获取右侧患者列表
    getShiftDutyPatList:(params)=>ajax(params,'/api/v1/ChangeShifts/GetPatientListInfoWithQuery',"POST"),
    // 获取医生列表
    getShiftDutyDoctorList:(params)=>ajax(params,"/api/v1/ChangeShifts/DoctorList"),
    // 获取交班患者列表
    getHandoverPatList:(params)=>ajax(params,"/api/v1/ChangeShifts/GetHandoverPatList"),
    // 获取接班患者列表
    getTakeoverPatList:(params)=>ajax(params,"/api/v1/ChangeShifts/GetShiftPatList","POST"),
    // 接班操作
    takeoverPatList:(params)=>ajax(params,"/api/v1/ChangeShifts/ShiftPat","PUT"),
    // 接班撤销
    cancelTakeover:({handoverShiftId})=>ajax({},"/api/v1/ChangeShifts/ShiftCancel?handoverShiftId="+handoverShiftId,"PUT"),
    // 交班操作
    handoverPatList:(params)=>ajax(params,"/api/v1/ChangeShifts/HandoverFinish","PUT"),
    // 交班撤销
    cancelHandover:({handoverShiftId})=>ajax({},"/api/v1/ChangeShifts/HandoverCancel?handoverShiftId="+handoverShiftId,"PUT"),
    // 从右侧患者列表添加到交班列表
    addToHandoverPatList:(params)=>ajax(params,"/api/v1/ChangeShifts/PatientInfoAdd","POST"),
    // 从交班列表种移除
    removeFromHancoverPatList:({inHosPatId})=>ajax({},"/api/v1/ChangeShifts/PatientInfoRemove?inHosPatId="+inHosPatId,"POST"),
    // 保存重点交班内容
    saveImportantHandover:(params)=>ajax(params,"/api/v1/ChangeShifts/SaveHandOverContent","POST"),
    // 保存重点接班内容
    saveImportantTakeover:(params)=>ajax(params,"/api/v1/ChangeShifts/SaveShiftContent","POST"),
    // 获取晨交班的统计信息
    getMorningPatTotal:(params)=>ajax(params,"/api/v1/ChangeShifts/GetPatientTotal"),
    // 床旁交班查询
    getHandoverShiftQuery:(params)=>ajax(params,"/api/v1/ChangeShifts/HandoverShiftQuery","POST"),
    // 床旁交班查看班次详细信息
    getHandoverShiftDetail:(params)=>ajax(params,"/api/v1/ChangeShifts/HandoverShiftQueryDetail"),
    // 晨交班查询
    getMorningShiftQuery:(params)=>ajax(params,"/api/v1/ChangeShifts/GetMorningHandoverPatList","POST"),
    // 获取晨交班详细信息
    getMorningShiftDetail:(params)=>ajax(params,"/api/v1/ChangeShifts/MorningShiftQueryDetail"),
    // 保存或提交晨交班信息
    saveOrSubmitMorningShift:(params)=>ajax(params,"/api/v1/ChangeShifts/SaveMorningHandoverPatList","POST"),
    // 获取保存或初始晨交班的内容
    getMorningShiftContent:(params)=>ajax(params,"/api/v1/ChangeShifts/GetSaveMorningList"),
    // 导出患者交接数据
    exportHandoverShift:(params)=>ajax(params,"/api/v1/ChangeShifts/HandoverShiftExport"),
    // 导出患者交接明细信息
    exportHandoverDetail:(params)=>ajax(params,"/api/v1/ChangeShifts/HandOverDetailInfoExport"),
    // 获取交班医生列表
    getHandoverDoctorList:(params)=>ajax(params,"/api/v1/ChangeShifts/HandOverDoctorListGet"),
    //晨交班配置项获取列表
    getSetList:(params)=>ajax(params,"/api/v1/TableColumnItemConfig/TableColumnItemConfigGet?tableCode=MorningHandOvers",'get',"Master"),
    //更新成家班配置列表
    upSetList:(params,str)=>ajax(params,`api/v1/TableColumnItemConfig/TableColumnItemConfigUpdate?tableCode=MorningHandOvers`,'put',"Master")
}