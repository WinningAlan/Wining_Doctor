import {ajax} from '../utils/ajax'
export default {
    getOrderPackageList:(params) => ajax(params,'/api/v1/OrderPackage/PersonalCenterPackageListGet',"POST"),//个人中心医嘱套餐列表
    opertionOrderPackage:(params) => ajax(params,"/api/v1/OrderPackage/PersonalCenterPackageOpertion","POST"),//个人中心套餐列表操作，
    getOrderPackageDetail:(params) => ajax(params,"/api/v1/OrderPackage/PersonalCenterDetailPackageInfoGet"),//根据套餐id获取详细信息,表格信息
    getOrderPackageMainInfo:(params) => ajax(params,"/api/v1/OrderPackage/PackageMainInfoGetById"),//根据套餐id获取套餐主要信息
    saveOrUpdateDrugAdvicePackage:({OrderPackageId},params) => ajax(params,"/api/v1/OrderPackage/MedicalPackageInfoAddOrUpdate/"+OrderPackageId,"POST"),//药品医嘱套餐医嘱的新增或修改
    saveOrUpdateCheckAdvicePackage:({OrderPackageId},params) => ajax(params,"/api/v1/OrderPackage/CheckOrderPackageAddOrUpdate/"+OrderPackageId,"POST"),//检查医嘱套餐医嘱的新增或修改
    saveOrUpdateTestAdvicePackage:({OrderPackageId},params) => ajax(params,"/api/v1/OrderPackage/TestOrderPackageAddOrUpdate/"+OrderPackageId,"POST"),//检验医嘱套餐医嘱的新增或修改
    saveOrUpdateBloodAdvicePackage:({OrderPackageId},params) => ajax(params,"/api/v1/OrderPackage/BloodOrderPackageInfoAddOrUpdate/"+OrderPackageId,"POST"),//用血医嘱套餐医嘱的新增或修改
    saveOrUpdateOperationAdvicePackage:({OrderPackageId},params) => ajax(params,"/api/v1/OrderPackage/OperationFormSave/"+OrderPackageId,"POST"),//手术医嘱套餐医嘱的新增或修改
    saveOrUpdateWordsAdvicePackage:({OrderPackageId},params) => ajax(params,"/api/v1/OrderPackage/WordsOrder/"+OrderPackageId,"POST"),//文字医嘱套餐医嘱的新增或修改
    saveOrUpdateNursingAdvicePackage:({OrderPackageId},params) => ajax(params,"/api/v1/OrderPackage/NursingPackageOrderAddOrEdit/"+OrderPackageId,"POST"),//护理医嘱套餐医嘱的新增或修改
    saveOrUpdateMealAdvicePackage:({OrderPackageId},params) => ajax(params,"/api/v1/OrderPackage/MealPackageOrderAddOrUpdate/"+OrderPackageId,"POST"),//膳食医嘱套餐医嘱的新增或修改
    saveOrUpdateTreatAdvicePackage:({OrderPackageId},params) => ajax(params,"/api/v1/OrderPackage/TreatMentPackageAddOrUpdate/"+OrderPackageId,"POST"),//治疗医嘱套餐医嘱的新增或修改
    saveOrUpdateClinicsAdvicePackage:({OrderPackageId},params) => ajax(params,"/api/v1/OrderPackage/ClinicsOperationPackageAddOrUpdate/"+OrderPackageId,"POST"),//诊间手术医嘱套餐医嘱的新增或修改
    saveOrUpdateConsultationPackage:({OrderPackageId},params) => ajax(params,"/api/v1/OrderPackage/CreateOrUpdateConsultation/"+OrderPackageId,"POST"),//会诊医嘱套餐医嘱的新增或修改
    getPackageAdviceDetail:(params) => ajax(params,"/api/v1/OrderPackage/MedicinalOrderDetailInfoByOrderIdGet"),//根据医嘱orderId获取医嘱详细信息
    getPackageOperationFormData: (params) => ajax(params, "/api/v1/OrderPackage/OperationFormData"),//获取手术申请单数据
    gettPackageConsultationInfo:(params)=>ajax(params,"/api/v1/OrderPackage/ObtainConsultationInfo",'post'),//获取会诊的单条信息
    getPackageBloodData:(params) => ajax(params,"/api/v1/OrderPackage/DoctorBloodOrderInfoGet"),//用血申请完整明细获取
    saveOrderPackage:(params) => ajax(params,"/api/v1/OrderPackage/SaveOrderPackageInfo","post"),//保存医嘱套餐信息
    cancelOrderPackage:(params) => ajax(params,"/api/v1/OrderPackage/CanclePackageSave","post"),//取消医嘱套餐信息
    deleteOrderPackageItem:(params) => ajax(params,"/api/v1/OrderPackage/PackageItemOpertionDelete","DELETE"),//删除套餐医嘱列表
    PackageGroupDrugAdvice:(params) => ajax(params,"/api/v1/OrderPackage/MedicinalPackageOrderOpertionGroup","post"),//药品拖动成组
    
}
// addConsultation:(params)=>A(params,"/api/v1/Consultation/CreateOrUpdateConsultation","post"),
