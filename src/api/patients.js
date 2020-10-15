import {
  ajax as A
} from '../utils/ajax'
const apiPrefix = '/api/v1/Patient/'
export default {
  getPatientMsg: (params) => A(params, apiPrefix + 'GetInHospPatEntityById', ), //获取患者基本信息
  getPatientsList: (params) => A(params, apiPrefix + 'GetPatientListInfoWithQuery'), //获取患者列表
  getLiquidBalance: (params) => A(params, apiPrefix + 'GetLiquidBalanceItem'), //获取液体平衡
  getTimerShaft: (params) => A(params, apiPrefix + 'GetPatientInfoTimeAxis'), //获取患者时间轴
  getTimeChoice: (params) => A(params, apiPrefix + 'GetTimeChoiceItem', 'get', 'Doctor',
  true), //获取监护仪时间间隔选项
  getEquipment: (params) => A(params, apiPrefix + 'GetEquipmentMontiorWithImageData'), //获取患者的监护仪器数据
  getMontior: (params) => A(params, apiPrefix + 'GetMontiorEquipmentInfoByPatId'), //获取患者的监护仪器列表
  changeLevel: (params) => A(params, apiPrefix + 'UpdatePatientTriageLevel'), //更改患者等级
  recall: (params) => A(params, apiPrefix + 'UpdatePaientRecall'), //患者召回

  //患者报告调阅
  getInHouseList: (params) => A(params, "/api/v1/Report/InHouseList",
  'get'), //根据patientId获取所有入科信息列表
  getReportNowList: (params) => A(params, "/api/v1/Report/ReportListByInHouseId",
  "get"), //根据InHouseId获取当前检查检验报告列表
  getReportHisList: (params) => A(params, "/api/v1/Report/ReportHistoryByInHouseId",
  'get'), //获取历史的数据
  // 获取报告调阅中，当前报告
  getReportNowListNew:(params)=>A(params,"/api/v1/Report/GetCurrentReportResultsByCondition","POST"),
  // 获取报告调阅中，历史报告一级title
  getReportHisListNew:(params)=>A(params,"/api/v1/Report/GetHistoryInHospitalsByCondition","POST"),
  // 获取报告调阅中，每级阶段下的报告详细报告列表
  getReportHisContentNew:(params)=>A(params,"/api/v1/Report/GetHistoryReportResultsByCondition","POST"),
  // 获取报告调阅中检验详细信息
  getTestResultByReportId:(params)=>A(params,"/api/v1/Test/GetTestResultDetailsByReportNo"),
  // 获取报告调阅中每个检验指标的趋势数据
  getTestItemTrend:(params)=>A(params,"/api/v1/Test/GetTestResultTrendByCondition","POST"),
  // 获取报告调阅中检查详细信息
  getCheckResultByReportId:(params)=>A(params,"/api/v1/CheckOrder/GetCheckResultByReportNo"),
  //患者信息管理
  //患者就诊轨迹
  //获取患者的历史入院的时间数据
  getPatientsTime: (params) => A(params, "/api/v1/Patient/GetInHouseInfoByPatientId", 'get'),
  //获取就诊轨迹的数据
  getDiaTrack: (params) => A(params, "/api/v1/Patient/QueryDiagnosisTrack", 'post'),
  //获取用户自定的表头
  getUserHeaderList: (params) => A(params, "/api/v1/Patient/GetHeaderByUserId", "get"),
  //修改自定义的表头
  upDataUserHeader: (params) => A(params, "/api/v1/Patient/UpdateHeader", 'post'),

  //过敏信息的
  //获取所有的药品
  getAllMedicines: (params) => A(params, "/api/v1/Patient/GetMedicinesByCondition", 'get'),
  //新增药品
  addMedicine: (params) => A(params, "/api/v1/Patient/CreateAllergyMedicine", 'post'),
  //删除过敏药品
  delMedicine: (params,id) => A(params, `/api/v1/Patient/DeleteAllergyMedicine?id=${id}`, "delete"),
  //修改药品的过敏信息
  updataMedicine: (params) => A(params, "/api/v1/Patient/UpdateAllergyMedicine", 'post'),
  //获取药品信息
  getMedicine: (params) => A(params, "/api/v1/Patient/GetAllergyMedicines", 'post'),
  //获取更具code获取字典量
  getSeverity:(params)=>A(params,"/api/v1/DictionariesComm/Select","post","Master"),



  //获取食物过敏的的列表数据
  getFoodAllergy:(params)=>A(params,"/api/v1/Patient/GetAllergyFoods",'post'),
  //删除食物的过敏信息
  delFoodAllergy:(params,id)=>A(params,`/api/v1/Patient/DeleteAllergyFood?id=${id}`,'delete'),
  //新增食物过敏信息
  addFoodAllergy:(params)=>A(params,"/api/v1/Patient/CreateAllergyFood",'post'),
  //修改过敏信息
  upDataFoodAllergy:(params)=>A(params,"/api/v1/Patient/UpdateAllergyFood",'post'),


  //造影剂
  //获取照影剂的过敏信息
  getContrasAllergy:(params)=>A(params,"/api/v1/Patient/GetAllergyContrastMediums",'post'),
  //新增照影剂的过敏信息
  addContrasAllergy:(params)=>A(params,"/api/v1/Patient/CreateAllergyContrastMedium",'post'),
  //修改造影剂过信息
  upDataContrasAllergy:(params)=>A(params,"/api/v1/Patient/UpdateAllergyContrastMedium",'post'),
  //删除造影剂过信息
  delContrasAllergy:(params,id)=>A(params,`/api/v1/Patient/DeleteAllergyContrastMedium?id=${id}`,'delete'),

  //其他过敏信息
  //获取过敏信息的列表
  getOtherAllergy:(params)=>A(params,"/api/v1/Patient/GetAllergyOtherSources","post"),
  //新增其他过敏信息
  addOtherAllergy:(params)=>A(params,"/api/v1/Patient/CreateAllergyOtherSource",'post'),
  //修改其他过敏信息
  upDataOtherAllergy:(params)=>A(params,"/api/v1/Patient/UpdateAllergyOtherSource","post"),
  //删除其他过敏信息
  delOtherAllergy:(params,id)=>A(params,`/api/v1/Patient/DeleteAllergyOtherSource?id=${id}`,'delete'),
  

  //药物不良反应
  //获取药物不良反应的列表
  getDrugList:(params)=>A(params,"/api/v1/Patient/GetDrugAdverseReactions","post"),
  //新增药物不良反应
  addDrug:(params)=>A(params,"/api/v1/Patient/CreateDrugAdverseReaction",'post'),
  //修改药物不良反应
  upDataDrug:(params)=>A(params,"/api/v1/Patient/UpdateDrugAdverseReaction",'post'),
  //删除药品不良反应
  delDrug:(params,id)=>A(params,`/api/v1/Patient/DeleteDrugAdverseReaction?id=${id}`,'delete'),
  //获取历史过敏信息
  getAllergyHistories:(params)=>A(params,'/api/v1/Patient/GetAllergyHistories','get'),


  //获取患者的费用接口
  //获取各项费用的展示信息
  getTotalAmount:(params)=>A(params,"/api/v1/Patient/GetTotalAmount",'get'),
  //获取费用大项信息
  getFeeBigItems:(params)=>A(params,"/api/v1/Patient/GetFeeBigItems",'get'),
  //获取费用小项信息
  getFeeSmallItems:(params)=>A(params,"/api/v1/Patient/GetFeeSmallItems",'get'),
  //费用明细信息
  getFeeDetailItems:(params)=>A(params,"/api/v1/Patient/GetFeeDetailItems",'post'),
  //预交金信息
  getAdvancePayments:(params)=>A(params,"/api/v1/Patient/GetAdvancePayments",'get'),
  //床位信息
  getFeeBeds:(params)=>A(params,"/api/v1/Patient/GetFeeBeds",'get'),
  //手术信息
  getFeeOperations:(params)=>A(params,"/api/v1/Patient/GetFeeOperations",'get'),
  //未记账费用信息
  getFeeUnaccountedInfo:(params)=>A(params,'/api/v1/Patient/GetFeeUnaccountedInfo','get'),
  //药占比信息
  getFeeMedicineRateInfo:(params)=>A(params,"/api/v1/Patient/GetFeeMedicineRateInfo",'get'),
  //导出费用信息
  exportData:(params)=>A(params,"/api/v1/Patient/ExportPatientFee",'get'),
  // 修改患者备注信息
  updatePatRemark:(params)=>A(params,"/api/v1/Patient/UpdatePatientRemark",'get'),
  registerApply:(params)=>A(params,"/api/v1/Patient/RegisterApply",'post','Doctor',false,99999999),//挂号申请
  //获取食物的过敏信息字典量
  getFoodDicList:(params)=>A(params,"/api/v1/Patient/GetAllergyFoodItems",'get'),
  //获取造影剂过敏下拉选项
  getMediumDicList:(params)=>A(params,"/api/v1/Patient/GetAllergyContrastMediumItems",'get'),
  //获取其他过敏源信息下拉选项
  getOtherDicList:(params)=>A(params,"/api/v1/Patient/GetAllergyOtherItems",'get'),


  //托盘读卡的接口
  readTray:(params)=>A(params,"/api/v1/Card/FrontendWrite",'post',"Master"),
  //轮询读取卡信息
  pollReadTray:(params)=>A(params,"/api/v1/Card/FrontendAndTrayRead","get","Master")


}