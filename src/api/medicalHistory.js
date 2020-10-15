import {
    ajax as A
  } from '../utils/ajax'
const apiPrefix = '/api/v1/Emr/'
  // 电子病历接口
export default {
  getEmrHistory: (params) => A(params, apiPrefix + 'EmrHistoryGetByPatientId'),//根据患者Id获取历史病历
  getEmrNow: (params) => A(params, apiPrefix + 'MedicalRecordListByInHospitalId'),//根据在科ID获取当前病历列表
  getParagraphList: (params) => A(params, apiPrefix + 'PersonalMedicalRecordSection'),//获取个人存储段落
  getTemplateList: (params) => A(params, apiPrefix + 'PersonalMedicalRecordTemplate'),//获取模板
  putEmrInvalid: (params) => A({}, apiPrefix + 'EmrInvalid?id='+params.id,'put'),//作废
  putEmrRestore: (params) => A({}, apiPrefix + 'EmrRestore?id='+params.id,'put'),//恢复作废
  putEmrArchiving: (params) => A(params, apiPrefix + 'EmrArchiving','put'),//归档
  updateEmrTime: (params) => A({}, apiPrefix + `EmrTimeUpdate?id=${params.id}&time=${params.time}`,'put'),//修改病历时间
  getDiagnosisArea: (params) => A(params, apiPrefix + 'GetDiagnosisAreaEntityById',),//获取诊疗区信息
  getNursingRecord: (params) => A(params, apiPrefix + 'GetNursingSheetModels',),//获取护理记录
  getTrigeRecord: (params) => A(params, apiPrefix + 'GetVitalSignByInHouseId',),//获取观察项记录
  getEvaluList: (params) => A(params, apiPrefix + 'GetNursingAssessmentByPat',),//获取护理评估
  getDocList: (params) => A(params, apiPrefix + 'GetNursingDocumentsByPat',),//获取护理文书
  // 获取检查检验报告
  getReportResultList:(params)=>A(params,'api/v1/Report/ReportResultListByInHouseId','POST'),
  //获取段落引用的树结构
  getAllMedicalCategories:(params)=>A(params,apiPrefix+"GetAllMedicalCategories"),
  //新增模板
  addMedicalCategorie:(params)=>A(params,apiPrefix+"CreateOrUpdateMedicalCategory",'post'),
  delTemplate:(params)=>A({},apiPrefix+"PersonalMedicalRecordTemplateDeleteById?templateId="+params.templateId,'delete'),//删除个人模板
  //删除段落
  delMedicalCategorie:(params,id,sectionId)=>A(params,`/api/v1/Emr/DeleteMedicalCategory?categoryId=${id}&sectionId=${sectionId}`,"delete")
}