import sexFilter from '../filters/sexFilter';
// 合理用药标准接口
class RationalDrugUse {
  constructor(that, type) {
    this.that = that
    this.type = type
    this.init()
  }
  // 初始化函数
  init() {
    if (this.type === '2') {
      this.contentObj = new Pass(this.that)
    } else {
      this.contentObj = {}
    }
    this.contentObj.init && this.contentObj.init()
  }
  // 查询函数
  hisQueryData(data, value) {
    this.contentObj.hisQueryData && this.contentObj.hisQueryData(data, value)
  }
  // *审查函数(给所需对象赋值)
  hisScreenData() {
    if (this.contentObj.hisScreenData) {
      this.contentObj.hisScreenData()
    } else {
      // 不需要前端审查
      console.log('不需要前端审查');
      this.that.submitAdvice()
    }

  }
}
export default RationalDrugUse

class Pass {
  constructor(that) {
    this.that = that
    console.log(6666);
  }
  // 初始化函数
  init() {
    console.log('美康初始化');
    let user = this.that.user
    let department = user.Departments[0] || {}
    var pass = new Params_MC_PASSclient_In();
    pass.HospID = "0"; //医院编码，单医院为"0"。区域医疗为医院编码
    pass.UserID = user.UserInfo.No; //医生工号
    pass.UserName = user.UserInfo.NAme; //医生姓名
    pass.DeptID = department.Code; //科室编码
    pass.DeptName = department.Name; //科室名称
    MCPASSclient = pass; //赋值给全局变量
  }
  // 查询函数
  hisQueryData(data, value) {
    var drug = new Params_MC_queryDrug_In();
    drug.ReferenceCode = data.HisMedId + ''; //查询药品的编码
    drug.CodeName = data.MedicineName; //查询药品的名称              
    MC_global_queryDrug = drug; //赋值给全局变量
    MDC_DoRefDrug(value)
    console.log('美康查询函数', drug, value);

  }
  // *审查函数(给所需对象赋值)
  hisScreenData() {
    console.log("审查函数", this.that.patientMsg, this.that.saveList);
    let patientMsg = this.that.patientMsg
    let adviceList = this.that.saveList
    let RegistObj = {}
    patientMsg.RegisterInfoList.forEach(el => {
      if (el.HisRegistId === patientMsg.RegistId) {
        RegistObj = el
      }
    })
    /***************************************************
     *患者基本信息
     ***************************************************/
    var patient = new Params_MC_Patient_In();
    patient.PatCode = patientMsg.HISPatientId; //编号，不能传空值
    patient.InHospNo = patientMsg.InHouseId; //门诊号/住院号 
    patient.VisitCode = patientMsg.InHouseId; //门诊号/住院次数
    patient.Name = patientMsg.PatientName; //姓名
    patient.Sex = sexFilter(patientMsg.PatGenderCode); //性别
    patient.Birthday = patientMsg.BirthDay ? patientMsg.BirthDay.slice(0, 10) : ''; //出生日期
    patient.HeightCM = patientMsg.Height ? patientMsg.Height + '' :
    ''; //身高（cm）                          
    patient.WeighKG = patientMsg.Weight ? patientMsg.Weight + '' : ''; //体重（kg）
    patient.DeptCode = RegistObj.RegDepartmentCode; //科室编码
    patient.DeptName = RegistObj.RegDepartmentName; //科室
    patient.DoctorCode = patientMsg.FirstDoctorId; //主管医生编码
    patient.DoctorName = patientMsg.FirstDoctor; //主管医生姓名
    patient.PatStatus = 3; //状态 0-出院;1-住院(默认);2-门诊;3-急诊
    patient.IsLactation = -1; //是否哺乳 -1-无法获取(默认)  0-不是 1-是
    patient.IsPregnancy = -1; //是否妊娠 -1-无法获取 (默认) 0-不是 1-是
    patient.PregStartDate = ""; //妊娠开始日期(不为空，则计算妊娠期)否则出全期数据
    patient.HepDamageDegree = -1; //-1-无法获取(默认); 0-无肝损害;1-存在肝损害,但损害程度//不明确;2-轻度肝损害;3-中度肝损害;4-重度肝损害
    patient.RenDamageDegree = -1; //-1-无法获取(默认);0-无肾损害;1-存在肾损害，但损害程度//不明确;2-轻度肾损害;3-中度肾损害;4-重度肾损害
    patient.CheckMode = MC_global_CheckMode; //审查模式,门诊："mz"  住院："zy"与passset.exe中的设置保//持一致
    patient.IsDoSave = 1; //是否采集医嘱/处方数据 0-不采集 1-采集
    patient.MedicareType = 0; //0-非医保病人（默认）  1-医保病人  >1-其它类型（暂未未用）
    patient.PatLevel = patientMsg.IdentityName; //病人身份：军以上干部、工人等
    patient.hospitallevel = "1"; // 所在医院级别：1-三级甲等 2-三级乙等 3-三级丙等 4-二级甲
    //等 5-二级乙等 6-二级丙等 7-一级甲等 8-一级乙等 9-一级丙
    //等 10-其他医院
    patient.Age = `${patientMsg.AgeYear||0}岁`; //年龄
    patient.IDCard = patientMsg.IDNumber; //身份证号
    patient.Telephone = patientMsg.Phone; //电话号码
    patient.PayClass = RegistObj.FeeType; //费别
    patient.InHospDate = patientMsg.InHospTime.slice(0,
    10); //格式：yyyy-mm-dd，门（急）诊为就诊时间，住（出//院）为入院时间
    MCpatientInfo = patient;

    let arrayDrug = new Array();
    let arrayExam = new Array();
    let arrayLab = new Array();
    let drug, exam, lab;
    adviceList.forEach(item => {
      if (item.OrderType === 14) {
        /***************************************************
         *医嘱（处方，病人需要使用的药品）信息
         ***************************************************/
        let durgList = item.OrderDetails
        durgList.forEach(el => {
          drug = new Params_Mc_Drugs_In();
          drug.Index = el.GroupDescription + el.GroupNumber; //药品序号，不能重复
          drug.OrderNo = arrayDrug.length + 1; //医嘱号,此处是数字类型
          drug.DrugUniqueCode = el.HisMedId; //药品编码
          drug.DrugName = el.MedicineName; //药品名称
          drug.DosePerTime = el.Dose + ''; //单次用量
          drug.DoseUnit = el.Unit; //给药单位      
          drug.Frequency = frequencyTable[item.FrequencyText]?frequencyTable[item.FrequencyText]:item.FrequencyText; //用药频次
          drug.RouteCode = item.UsageText; //给药途径编码
          drug.RouteName = item.UsageText; //给药途径名称
          drug.StartTime = item.StartTime.replace('T', " "); //开嘱时间
          drug.EndTime = ""; //停嘱时间。门诊传空，住院未停长嘱传空，住院临时医嘱传开嘱//时间，住院已停止长期医嘱传停嘱时间。
          drug.ExecuteTime = ""; //执行时间
          drug.GroupTag = el.GroupDescription; //成组标记，相同的成组标记表示一组。
          drug.IsTempDrug = item.EffectiveTime === 2 ? 0 : 1; //是否临时医嘱 0-长期 1-临时。门诊都传0。
          //此处是数字类型
          drug.OrderType = 0; //医嘱类别标记 0-在用(默认);1-已作废;2-已停嘱;3-出院带药（重复
          //用药模块不审核）此处是数字
          drug.DeptCode = RegistObj.RegDepartmentCode; //开嘱科室编码
          drug.DeptName = RegistObj.RegDepartmentName; //开嘱科室名称
          drug.DoctorCode = item.CreateUserId; //开嘱医生编码
          drug.DoctorName = item.ExcuteUserName; //开嘱医生姓名
          drug.RecipNo = ""; //处方号，门诊专用，住院传空值。
          drug.Num = el.Dosage; //药品开出数量，门诊专用，住院传空值。
          drug.NumUnit = el.DosageUnit; //药品开出数量单位，门诊专用，住院传空值。
          drug.duration = item.OrderDays ? item.OrderDays : ''; //1712版新增，用药天数。门诊专用，住院传空值。
          //  drug.Purpose = 0;             //此处是数字类型,表示用药目的，传入值定义为：’1’表示可//能预防，’2’表示可能治疗，’3’表示预防，’4’表示治疗，’5’表示预防+治疗, 默认值为’0’。
          drug.OprCode = ""; //手术编号,如对应多手术,用','隔开,表示该药为该编号对应的手术用药
          drug.MediTime = ""; //用药时机(术前,术中,术后)(0-未使用；1- 术前0.5h以内用药；
          //2-术前0.5-2h内；3-术前大于2h用药；4-术中用药；5-术后用药)
          drug.Remark = item.Remark; //医嘱备注 
          drug.driprate = item.DrippingSpeed; //滴速(120滴/分钟)
          drug.driptime = ""; //滴时间(滴100分钟)
          //  drug.IsOtherRecip = 0; // 是否其它科室开具的处方药品 0-不是（默认） 1-是
          //  drug.skintest="0";     //皮试结果 1-阳性；0-阴性 
          //  drug.reciptypecode = "11";
          //  drug.reciptypename = "中药处方";
          //  drug.pharmacycode = "门诊西药房";
          //  drug.pharmacyname = "门诊西药房";
          //  drug.driprange = "";
          //  drug.doctorpriv = "-1";
          arrayDrug.push(drug);
        })
      } else if (item.OrderType === 7) {
        /***************************************************
         *检查信息
         ***************************************************/
        let checkList = item.OrderDetails
        checkList.forEach(el => {
          exam = new Params_Mc_Exam_In(); //检查
          exam.RequestNo = arrayExam.length + 1 + ''; // 检查申请单序号
          exam.LabExamCode = el.DictItemCode; // 检查申请项目编码
          exam.LabExamName = el.DictItemName; //检查申请项目名称
          exam.StartDateTime = item.CheckFormModel.ApplyTime.slice(0, 10); //检查申请单下达时间
          exam.DeptCode = item.CheckFormModel.ExcuteDepartment; // 申请科室
          exam.DeptName = item.CheckFormModel.ExcuteDepartmentName; // 申请科室名称
          exam.DoctorCode = item.CreateUserId; // 申请医生编码
          exam.DoctorName = item.CreateUserName; // 申请医生名称
          arrayExam.push(exam);
        })
      } else if (item.OrderType === 8) {
        /***************************************************
         *检验信息
         ***************************************************/
        let testList = item.OrderDetails
        testList.forEach(el => {
          lab = new Params_Mc_Lab_In(); //检验
          lab.RequestNo = arrayExam.length + 1 + ''; // 检查申请单序号
          lab.LabExamCode = el.DictItemCode; // 检查申请项目编码
          lab.LabExamName = el.DictItemName; //检查申请项目名称
          lab.StartDateTime = item.TestFormModel.ApplyTime.slice(0, 10); //检查申请单下达时间
          lab.DeptCode = item.TestFormModel.ExcuteDepartment; // 申请科室
          lab.DeptName = item.TestFormModel.ExcuteDepartmentName; // 申请科室名称
          lab.DoctorCode = item.CreateUserId; // 申请医生编码
          lab.DoctorName = item.CreateUserName; // 申请医生名称
          arrayLab.push(lab);
        })
      }
    })
    McDrugsArray = arrayDrug;
    if (arrayLab.length) McLabArray = arrayLab;
    if (arrayExam.length) McExamArray = arrayExam;

    /***************************************************
     *病生状态(疾病，诊断)信息
     ***************************************************/
    let diagnoseList = this.that.diagnoseList
    var arrayMedCond = new Array();
    var medcond;
    diagnoseList.forEach(el => {
      medcond = new Params_Mc_MedCond_In();
      medcond.Index = el.DiagnosisCode; //诊断序号，不能重复
      medcond.DiseaseCode = el.DiagnosisCode; //诊断编码
      medcond.DiseaseName = el.DiagnosisName; //诊断名称
      medcond.RecipNo = ""; //处方号
      // medcond.starttime = "";//开始时间
      //  medcond.endtime = ""; //结束时间   
      arrayMedCond.push(medcond)
    })
    if (arrayMedCond.length) McMedCondArray = arrayMedCond;
    //         /***************************************************
    //          *过敏信息
    //          ***************************************************/
    //          var arrayAllergen = new Array();
    //          var allergen = new Params_Mc_Allergen_In();
    //          allergen.Index = "";        //序号  
    //          allergen.AllerCode = "";    //编码
    //          allergen.AllerName = "";    //名称  
    //          allergen.AllerSymptom = ""; //过敏症状    
    //          arrayAllergen[arrayAllergen.length] = allergen;
    //          //以此类推，传入第二个过敏源，第三个过敏源……
    //          McAllergenArray = arrayAllergen;

    //         /***************************************************
    //          *手术信息
    //          ***************************************************/
    //          var arrayoperation = new Array();
    //          var operation = new Params_Mc_Operation_In(); 
    //          operation.Index = "";        //序号
    //          operation.OprCode = "";      //编码
    //          operation.OprName = "";      //名称
    //    operation.IncisionType= "";  //切口类型
    //          operation.OprStartDate = ""; //手术开始时间（YYYY-MM-DD HH:MM:SS)
    //          operation.OprEndDate = "";   //手术结束时间 （YYYY-MM-DD HH:MM:SS)  
    //    operation.OprMediTime = -1; //手术用药时机  0-未使用 1-0.5h以内 2-0.5-2h 3-大于2h
    //          operation.OprTreatTime = 0; //手术预防使用抗菌药物疗程  单位（小时）
    //          arrayoperation[arrayoperation.length] = operation;
    //          //以此类推，传入第二个手术，第三个手术……
    //          McOperationArray = arrayoperation;
    // 回调
    MDC_DoCheck(this.dealwithhis.bind(this), 1)
  }
  dealwithhis(result) {
    /*
         result:审查后严重问题级（-99,-10,....0,1,2,3,4）     
         // 4-关注（黄灯）
         // 3-慎用（橙灯）
         // 2-严重（红灯）
         // 1-禁忌（黑灯）
         // 0-没问题（绿灯）
         // -99-超时（不返灯）
         // -10-服务端异常（不返灯）
         //其他同c/s（不返灯）


         -100：加载客户端DLL失败
         -99： 访问服务端超时
         -10：服务端正常返回[ERROR]
         -9：无开嘱和停嘱时间
         -5：出院带药不参与审查
         -4：已停嘱
         -3：已作废
         -2：医嘱开停嘱时间与审查时间不交叉
         -1：未配对
         0：审查无结果
         1：黑灯结果
         2：红灯结果
         3：橙灯结果
         4：黄灯结果 
         */
    if (result > 0) {
      setTimeout(() => {
        this.that.$confirm(
            "合理用药审查未通过，是否继续提交？",
            "", {
              type: "warning"
            }
          )
          .then(() => {
            this.that.submitAdvice()
          })
          .catch(() => {
          this.that.$store.commit("public/SET_CAREQUESTLOADING", "");

            // this.$msg.info("已取消操作");
          });
      }, 10);

    } else {
      this.that.submitAdvice()
    }

  }
}

const frequencyTable = {
  'QW_4': 'qw',
  'BIW_4-7': 'biw',
  'QID': 'qid',
  'BID_6-16': 'bid',
  'QD_16': 'qd',
  'BID': 'bid',
  'QD': 'qd',
  'BIW_3-6': 'biw',
  'QH': 'qh',
  'QD_18': 'qd',
  'SOS': 'st',
  'TIW246': 'tiw',
  'BIW_2-5': 'biw',
  'BID_8-12': 'bid',
  'TIW135': 'tiw',
  'Q4H': 'q4h',
  'QD_8': 'qd',
  'Q6H': 'q6h',
  'QW_2': 'qw',
  'TID': 'tid',
  'QW_3': 'qw',
  'QW_1': 'qw',
  'Q12H': 'q12h',
  'Q0.5H': 'qwh',
  'BID_1': 'bid',
  'BID_8-16': 'bid',
  'PRN': 'prn',
  'QD_20': 'qd',
  'BID_2-14': 'bid',
  'Q8H': 'q8h',
  'QW_6': 'qw',
  'QN': 'qn',
  'QW_7': 'qw',
  'BIW_1-4': 'biw',
  'Q2H': 'q2h',
  'ST': 'st',
  'QW_5': 'qw',
  'QOD': 'qod',
  'Q3H': 'q3h'

}
