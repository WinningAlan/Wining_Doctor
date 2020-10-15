import {
    ajax as A
  } from '../utils/ajax'
  const apiPrefix = '/api/v1/Order/'
export default {
  getDictData: (params) => A(params, apiPrefix + 'CommonDictDataGet','get','Doctor',true),//根据类型获取字典数据信息
  getFrequency: (params) => A(params, apiPrefix + 'OrderFrequencyInfoGet','get','Doctor',true),//获取频次信息
  searchAdvice: (params) => A(params, apiPrefix + 'OrderItemContentSearchByType', 'post'),//根据医嘱类型搜索相关内容
  searchAdvices: (params) => A(params, apiPrefix + 'OrderItemContentSearchByTypes', 'post'),//根据医嘱类型搜索相关内容
  searchAdvices2: (params) => A(params, apiPrefix + 'OrderItemContentSearchByTypes2', 'post'),//根据医嘱类型搜索相关内容
  getDrugDetails: (params) => A(params, apiPrefix + 'MedicinalInfoByMedicinalIdGet'),//根据药品Id,获取药品名称、规格、单价、最小单位、销售单位、库存
  saveDrugAdvice: (params) => A(params, apiPrefix + 'DoctorMedicalOrderInfoAddOrUpdate','post'),//医嘱下达--药品医嘱新增/修改
  groupDrugAdvice: (params) => A(params, apiPrefix + 'MedicinalOrderOpertionGroup','post'),//医嘱下达--药品医嘱拖拽成组
  saveNursingAdvice: (params) => A(params, apiPrefix + 'NursingOrder','post'),//医嘱下达--护理医嘱新增
  saveWordAdvice: (params) => A(params, apiPrefix + 'WordsOrder','post'),//医嘱下达--文字医嘱新增
  saveMealAdvice: (params) => A(params, apiPrefix + 'MealOrder','post'),//医嘱下达--膳食医嘱新增
  saveTreatAdvice: (params) => A(params, apiPrefix + 'TreatMentOrder','post'),//医嘱下达--治疗医嘱新增
  saveOperationAdvice: (params) => A(params, apiPrefix + 'ClinicsOperationOrder','post'),//医嘱下达--手术项目医嘱新增
  saveInspectAdvice: (params) => A(params, '/api/v1/CheckOrder/CheckOrder','post'),//医嘱下达--检查医嘱新增
  submitAdvice: (params) => A(params, apiPrefix + 'OrderSubmit', 'post', 'Doctor', false, 20000),//医嘱提交
  refreshOrderStatus: (params) => A(params, apiPrefix + 'RefreshOrderStatusToSave', 'post', ),//错误提交重置医嘱状态
  getAdviceList: (params) => A(params, apiPrefix + 'OrderInfoListByInHouseIdGet',),//根据患者在科Id和状态获取医嘱信息列表
  deleteAdviceList: (params) => A(params, apiPrefix + 'OrderOpertionDelete','post'),//删除待提交的医嘱
  getAdviceDetail: (params) => A(params, apiPrefix + 'MedicinalOrderDetailInfoByOrderIdGet'),//获取药品医嘱详细信息
  getDrupNumber: (params) => A(params, apiPrefix + 'MedicinalNumberCalculationByCondition','post'),//根据条件计算药品医嘱数量
  getOperationD:(params)=>A(params,"/api/v1/Operation/OperationGetByContent"),//手术申请单的字典量
  getOperationOtherD:(params)=>A(params,"/api/v1/Operation/OperationOtherDictGet",'get','Doctor',true),//手术申请单字典量
  getDoctorUser:(params)=>A(params,"/api/v1/User/DoctorList","get","Master"), //获取医生字典量
  getNurseList:(params)=>A(params,"/api/v1/User/NurseList",'get',"Master"), //获取护士的字典量
  getHistoryDetail:(params)=>A(params,"/api/v1/Operation/OperationFormDetail","get"),//获取历史数据的表格
  getHistoryOperation:(params)=>A(params,"/api/v1/Operation/OperationFormMaster","get"),//获取手术申请单历史列表
  postOperationData:(params)=>A(params,"/api/v1/Operation/OperationFormSave",'post'), //保存手术申请单/手术医嘱
  submitOperationData: (params) => A(params, "/api/v1/Operation/OperationFormSubmit", "post"), //提交手术申请单
  getOperationOneData:(params)=>A(params,"api/v1/Operation/OperationFormData","get"),
  stopAdvice: (params) => A(params, apiPrefix + 'OrderOpertionStopOrInvalid','post'),//根据医嘱Id操作停止或作废医嘱
  getPrescriptiontree: (params) => A(params, apiPrefix + 'PrescriptionLeftMenuInfoGetByPatientId'),//根据患者Id历史处方菜单
  createdPrescription: (params) => A(params, apiPrefix + 'PrescriptionGenerateAccordToChoice','post'),//生成处方
  getTreatmentList: (params) => A(params, apiPrefix + 'GetTreatmentList'),//获取历史治疗单
  getTreatmentModelsByTime: (params) => A(params, apiPrefix + 'GetTreatmentModelsByTime'),//获取治疗单详情

  getBloodInfo:(params) => A(params,"/api/v1/Blood/AssayBloodInfoGet"),//获取患者输血前检查结果
  saveBloodInfo:(params) => A(params,"/api/v1/Blood/DoctorBloodOrderInfoAdd","POST"),//保存患者输血申请单信息
  updateBloodInfo:(params) => A(params,"/api/v1/Blood/DoctorBloodOrderInfoUpdate","POST"), // 修改患者输血申请单信息
  getDoctorBloodOrderInfo:(params) => A(params,"/api/v1/Blood/DoctorBloodOrderInfoGet"),// 用血申请完整明细获取
  getBloodMasterList:(params) => A(params,"/api/v1/Blood/DoctorBloodOrderMasterListGet"),//左侧患者入区用血记录
  getBloodDetailList:(params) => A(params,"/api/v1/Blood/DoctorBloodOrderDetailListGet"),//右侧患者一次用血详细信息
  getOperationDetail:(params) => A(params,"/api/v1/Operation/OperationFormData"),//获取手术医嘱详情
  getCheckHistory:(params)=>A(params,"/api/v1/CheckOrder/InHouseList",'get'),//回去检查申请单历史数据
  getCheckTableData:(params)=>A(params,"/api/v1/CheckOrder/History",'get'),//获取检查申请单详情
  getTestSampleList:(params) => A(params,"/api/v1/Test/GetTestSampleList",'get','Doctor',true),//获取检验标本信息
  saveTestAdvice:(params) => A(params,"/api/v1/Test/AddOrEditTestApply",'post'),//保存检验医嘱
  getChargeItems:(params) => A(params,"/api/v1/Test/GetChargeItemsByClinicCode"),//根据临床项目获取收费小项目
  getAxamineUsed:(params)=>A(params,"/api/v1/CheckOrder/Top50CheckItems","get"),//获取检查的常用项的top50
  postAxamineAll:(params)=>A(params,"/api/v1/CheckOrder/CheckOrders","post"),//批量保存检查生清单
  postUsedDeatil:(params)=>A(params,"/api/v1/Order/OrderItemContentSearchByType",'post'),//获取单个常用项的详细信息

  getTestHistoryTable:(params)=>A(params,"/api/v1/Test/GetPatientTestOrderHistory","get"),//获取检验历史的表格数据
  getTestHistoryList:(params)=>A(params,"/api/v1/Test/InHouseTestPatient","get"),//获取历史的的列表数据
  getTestUsedList:(params)=>A(params,"/api/v1/Test/Top50TestItems",'get'),//获取检验的常用项

  postTestAll:(params)=>A(params,"/api/v1/Test/AddOrEditTestApplyList",'post'),//批量提交检验申请单
  getPrescriptionList: (params) => A(params, apiPrefix + 'PrescriptionListInfoGetByCondition','post'),//获取处方列表
  getDiagnoseSearchData:(params)=>A(params,"/api/v1/Diagnosis/Search",'get'),//获取诊断搜索的字典量；

  getDiagnoseType:(params)=>A(params,"/api/v1/Diagnosis/DiagnosisTypeGet","get",'Doctor',true),//获取诊断类型的字典量；
  getICDtype:(params)=>A(params,"/api/v1/Diagnosis/DiagnosisICDTypeGet","get"),//获取诊断使用的icd类型如icd10 或者ICD9等
  getHistoryDiagnoseList:(params)=>A(params,"/api/v1/Diagnosis/DiagnosisRecordGetByInHouseId",'get'),//获取患者的历史诊断记录列表;

  submitDiagnoseData:(params)=>A(params,"/api/v1/Diagnosis/DiagnosisRecordSubmit","post"),//提交诊断信息
  delDiagnose:(params,data)=>A(params,`/api/v1/Diagnosis/DiagnosisRecordDelete?Id=${data.id}&registerId=${data.registerId}&userNo=${data.doctorCode}&diagnosisCategory=${data.diagnosisCategory}&diagnosisTypeCode=${data.diagnosisTypeCode}`,"delete"),//删除诊断记录
  getDiagnoseSearchData:(params)=>A(params,"/api/v1/Diagnosis/Search",'get'),//获取收索的字典量
  getDiagnoseList:(params)=>A(params,"/api/v1/Diagnosis/DiagnosisHistoryGet",'get'),//获取诊断的历史列表数据
  getRecommend:(params)=>A(params,"/api/v1/Diagnosis/DiagnosisRecommendGet","get"),//获取主诉推荐诊断
  saveAsOrderPackage:(params) =>A(params,"/api/v1/OrderPackage/SaveOrderPackageQuoteInfo","POST"),//医嘱另存为医嘱套餐
  getDepOrArea:(params)=>A(params,"api/v1/Diagnosis/DiagnosisRecommendByDeptOrArea","get"),//诊断科室推荐
  quoteOrderPackage:(params)=>A(params,"/api/v1/OrderPackage/OrderPackageQuote","POST"),// 套餐引用
  getOrderPackagePersonl:(params)=>A(params,"/api/v1/OrderPackage/PackagePersonlLeftMenuListGet"),// 个人套餐菜单
  getOrderPackageDepartment :(params)=>A(params,"/api/v1/OrderPackage/PackageDepartMentLeftMenuListGet"),// 科室套餐菜单
  // 获取特殊药品以及患者相关信息
  getSpecialDrugMessage:(params)=>A(params,"/api/v1/SpecialMedicinal/MedicinalDetailInfoGet","POST"),
  // 提交特殊药品领取相关信息
  submitSpecialDrugTake:(params)=>A(params,"/api/v1/SpecialMedicinal/SubmitSpecialMedicalRegister","POST"),
  // 历史医嘱列表
  getHistoryList:(params)=>A(params,"/api/v1/Order/HistoryOrderMenuListGetByPatientId"),
  // 根据入科出科时间查询历史医嘱信息
  getHistoryDoctorAdviceDetail:(params)=>A(params,"/api/v1/Order/HistoryOrderListGetByTime"),
  // 引用历史医嘱
  copyHistoryOrder:(params)=>A(params,"/api/v1/Order/OrderInfoQuote","POST"),
  //获取检查列表的树结构数据
  getCheckTreeData:(params)=>A(params,"/api/v1/CheckOrder/CheckCategoryGetAllItem",'get'),
  //获取检验的树结构数据
  getTestTreeData:(params)=>A(params,"/api/v1/Test/TestCategoryGetAllItem",'get'),
  //根据条件获取套餐信息列表
  getSetMealDeatil:(params)=>A(params,"/api/v1/OrderPackage/GetPackageInfoListByCondition",'post'),

  // 获取所有医嘱类别
  getOrderClassification:(params)=>A(params,"/api/v1/Order/DictOrderClassificationGet"),
  
  //退回医嘱处理
  sendBackAdv:(params)=>A(params,"/api/v1/Order/MedicinalOrderAcceptOrReject",'post'),
  //获取检查检验项的父级
  getParentCode:(params)=>A(params,"/api/v1/Order/GetDepartmentNameByCode",'get'),
  //获取检验的标本配置内容
  getSampleSetList:(params)=>A(params,"/api/v1/Test/TestCategoryGetAll",'post'),

  //诊断报告卡的调用
  postDiagCar: (params) => A(params, "http://localhost:10808/api/IDMSReport/CallAllReportCardJsonParams", 'post'),
  // 获取耗材大类
  getGroupList:(params)=>A(params,"/api/v1/AdviceItem/DictAdviceItemGroupListOnlyDoctor"),

    // 获取耗材小类
  getCostItemList: (params) => A(params, "/api/v1/AdviceItem/DictAdviceItemList"),
        // 保存耗材费用
  saveCostItem: (params) => A(params, "/api/v1/AdviceItem/AdviceItemAbout", 'post'),
    // 删除耗材费用
  deleteCostItem: (params) => A({}, `/api/v1/AdviceItem/AdviceItemAbout?materialId=${params.materialId}&DoctorOrderId=${params.DoctorOrderId}${params.hisxh?'&hisxh='+params.hisxh:''}`, 'delete'),
     // 获取计费项目模板    
  getCostTemplate: (params) => A(params, "/api/v1/AdviceItem/AdviceItemTemplateGet"),
            // 获取计费项目模板明细
  getCostTemplateDetails: (params) => A(params, "/api/v1/AdviceItem/AdviceItemTemplateDetailsGet"),
            // 保存计费项模板
    saveCostTemplate:(params)=>A(params,"/api/v1/AdviceItem/AdviceItemTemplateSave","post"),
    getAttention:(params)=>A(params,"/api/v1/ConfigItemEmr/GetConfigDataByInHospPatId",),//获取临床摘要信息
    //诊间结算的读卡功能
   readCarNumber:(params)=>A(params,"http://localhost:10808/api/Card"),
   //诊间结算获取详细信息的费用
   getChargingInfo:(params)=>A(params,"http://localhost:10808/api/ClinicPayment/ClinicPaymentInit",'post'),
   //支付类型去请求支付接口
   postPayTypeSend:(params)=>A(params,"http://localhost:10808/api/ClinicPayment/ClinicPaymentConfirm","post"),
   //医嘱开立验证医保给予提示
   medicalInsuranceMsg:(params)=>A(params,'api/v1/Order/InsuranceDescGet','post')
}
