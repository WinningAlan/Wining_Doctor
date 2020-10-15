import {ajax} from '../utils/ajax'
export default {
    getTableColConfig:(params) => ajax(params,'/api/v1/TableColumnItemConfig/TableColumnItemConfigGet','get','Master'),// 获取用户自定义表格配置
    setTableColConfig:({tableCode},ColumnCode) => ajax(ColumnCode,'/api/v1/TableColumnItemConfig/TableColumnItemConfigUpdate?tableCode='+tableCode,'PUT','Master'),// 设置用户自定义表格配置
    getInPatDepartment:(params) => ajax(params,'/api/v1/Dictionary/GetInpatientDepment','get','Master'),// 入院科室
    applyPatInHos:(params) =>ajax(params,'/api/v1/Patient/PatientInHospitalApply','POST'),//住院申请
    getEmergencyDepment:(params) =>ajax(params,'/api/v1/Dictionary/GetEmergencyDepment','get','Master'),//获取急诊科室
    applyPatTransferHos:(params) => ajax(params,'/api/v1/Patient/PatientTransferHospitalApply',"POST"),//转院申请
    patPrognosis:({inHospitalId,turnedTo,transferTo}) => ajax({},`/api/v1/Patient/PatientPrognosis?inHospitalId=${inHospitalId}&turnedTo=${turnedTo}&transferTo=${transferTo}`,"PUT"),//普通转归
    getBloodType:(params) => ajax(params,"/api/v1/Blood/DictBloodTypeGet",'get','Doctor',true),//血型字典
    getAllDepartment:(params) => ajax(params,"/api/v1/Department",'get','Master',true),// 执行科室
    getAllDep:(params) => ajax(params,"/api/v1/Department/GetDepartments",'get','Master',true),// 所有院区执行科室
    getOrderPackageRange:(params) => ajax(params,"/api/v1/OrderPackage/OpenOrderPackageRangeGetByUserId"),//获取登录用户开套餐范围
    getOrderPackageType:(params) => ajax(params,"/api/v1/OrderPackage/OrderPackageCategoryGet"),//获取医嘱套餐类型
    // 获取医生站交班类型
    getDoctorScheduleInfo:(params) => ajax(params,"/api/v1/ChangeShifts/DoctorScheduleInfoGet"),
    // 获取当前登录账号是否有科室套餐权限和处方权限
    getUserRight: (params) => ajax(params, "/api/v1/OrderPackage/PackageDepartmentRightGet"),
    getLocalhostIp: (params) => ajax(params, "http://localhost:10808/api/Tools?Type=GetIP&str="),//获取本地IP
    getLocalhostTime: (params) => ajax(params, "http://localhost:10808/api/Tools?Type=GetTime&str="),//获取本地时间
    openIE: (params) => ajax({}, "http://localhost:10808/api/Tools/IEOpen?urlStr="+params),//打开IE
    //身份字典表
    getIdentityList:(params)=>ajax(params,'/api/v1/Dictionary/IdentityList','get','Master',true),
    // 证件类型/api/v1/Dictionary/CertificateTypeList
    getCertificateTypeList:(params)=>ajax(params,"/api/v1/Dictionary/CertificateTypeList",'get','Master',true),
    getWardByDepartment:(params)=>ajax(params,"/api/v1/Dictionary/GetWardByDepartment",'get','Master'),
    // 根据患者挂号序号/预检号获取患者基本信息
    getPersonMessageById:(params)=>ajax(params,'/api/v1/Patient/ClinicPatientGetSingle','POST')
}