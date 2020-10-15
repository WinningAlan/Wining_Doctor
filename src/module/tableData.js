// // 医嘱列表数据
// export const doctorAdviceListData = [
//   {
//     OrderId:'1',
//     Status: 1,
//     EffectiveTime: 2,
//     StartTime:'2019/09/09T09:00',
//     StopTime: '2019/09/19T09:00',
//     ExcuteOrderTime: '2019/09/19T09:00',
//     CreateUserName: '王医生',
//     AdviceType: 14,//医嘱类型
//     UsageText:'口服',//用法
//     FrequencyText:'BID',//频次
//     OrderDays:2,//天数
//     DrippingSpeed: 22,//滴速
//     IsOutHospitalMedicine:false,//是否出院带药
//     AdviceContent: [
//       {
//         MedicineName: '盐酸多奈哌齐片',
//         SpecialName: '普通',
//         SpecificationName: '10mg*20片/盒',
//         Dose: '5ml',//剂量
//         Dosage: '3盒',//数量
//         IsSelfProvided:false,//自备药
//         IsSkinTest: true,//皮试
//         GroupNumber: 201900,//组号
//         Count: 2,//总数
//         Number:1,//序号
//       },
//       {
//         MedicineName: '盐酸多奈哌齐片2',
//         SpecialName: '抗',
//         SpecificationName: '10mg*20片/盒',
//         Dose: '5ml',//剂量
//         Dosage: '4盒',//数量
//         IsSelfProvided:false,//自备药
//         IsSkinTest: false,//皮试
//         GroupNumber: 201900,//组号
//         Count: 2,//总数
//         Number:2,//序号
//       }
//     ]
//   },
//   {
//     OrderId:'2',
//     Status: 1,
//     EffectiveTime: 2,
//     StartTime:'2019/09/09T09:00',
//     StopTime: '2019/09/19T09:00',
//     ExcuteOrderTime: '2019/09/19T09:00',
//     CreateUserName: '王医生',
//     AdviceType: 14,//医嘱类型
//     UsageText:'静滴',//用法
//     FrequencyText:'BID',//频次
//     OrderDays:2,//天数
//     DrippingSpeed: 22,//滴速
//     IsOutHospitalMedicine:false,//是否出院带药
//     AdviceContent: [
//       {
//         MedicineName: '盐酸多奈哌齐片2',
//         SpecialName: '普通',
//         SpecificationName: '10mg*20片/盒',
//         Dose: '15ml',//剂量
//         Dosage: '3盒',//数量
//         IsSelfProvided:false,//自备药
//         IsSkinTest: true,//皮试
//         GroupNumber: 201900,//组号
//         Count: 2,//总数
//         Number:1,//序号
//       },
//       {
//         MedicineName: '盐酸多奈哌齐片3',
//         SpecialName: '抗',
//         SpecificationName: '10mg*20片/盒',
//         Dose: '33ml',//剂量
//         Dosage: '4盒',//数量
//         IsSelfProvided:true,//自备药
//         IsSkinTest: false,//皮试
//         GroupNumber: 201900,//组号
//         Count: 2,//总数
//         Number:2,//序号
//       }
//     ]
//   },
// ]

// // 膳食医嘱表格
// export const mealsDoctorAdviceData = [
//   {
//     MedicineName:'肠内营养--微量元素组件',
//     Price: 19,
//     Frequency: "05",
//     Unit: '',
//     Dose:'',
//     HisMedId:1,
//   }
// ]
// // 护理医嘱表格
// export const nurseDoctorAdviceData = [
//   {
//     MedicineName:'血一（R400',
//     Price: 19,
//     Frequency: "05",
//     HisMedId:1,
//   }
// ]
// // 检查医嘱表格
// export const inspectDoctorAdviceData = [
//   {
//     name: "CT",
//     specimen: 1,
//     remarks: "",
//     cost: 120.0,
//     Id: 1
//   },
//   {
//     name: "B超",
//     specimen: 2,
//     remarks: "",
//     cost: 140.0,
//     Id: 2
//   }
// ]
// // 检验医嘱表格
// export const testDoctorAdviceData = [
//   {
//     children: [
//       {
//         Text: "乙肝表面抗原(HBsAg)",
//         Value: 1,
//         IsChecked: true
//       },
//       {
//         Text: "乙肝表面抗体(抗-HBs)",
//         Value: 2,
//         IsChecked: true
//       },
//       {
//         Text: "乙肝e抗原(HBeAg)",
//         Value: 3,
//         IsChecked: true
//       },
//       {
//         Text: "乙肝e抗体(抗-HBe)",
//         Value: 4,
//         IsChecked: true
//       },
//       {
//         Text: "乙肝核心抗体(抗-HBc)",
//         Value: 5,
//         IsChecked: true
//       }
//     ],
//     checked: [],
//     name: "乙肝五项A",
//     specimen: 1,
//     remarks: "",
//     cost: 120.0,
//     Id: 1
//   },
//   {
//     children: [],
//     checked: [],
//     name: "乙肝五项B",
//     specimen: 2,
//     remarks: "",
//     cost: 140.0,
//     Id: 2
//   }
// ]
// // 检查医嘱表格
// export const treatDoctorAdviceData = [
//   {
//     name: "导尿",
//     specimen: 1,
//     remarks: 1,
//     cost: 120.0,
//     Id: 1
//   },
//   {
//     name: "气管内套管",
//     specimen: 2,
//     remarks: 2,
//     cost: 140.0,
//     Id: 2
//   }
// ]
// // 药品医嘱表格
// export const drugDoctorAdviceData = [
//   {
//     name: "5%葡萄糖注射液",
//     guige: '250ml*1袋/瓶',
//     bisi:'',
//     jl: 1,
//     num: 1,
//     jlUnit: 1,
//     numUnit:1,
//     isChecked: 0,
//     cost: 120.0,
//     Id: 1
//   },
//   {
//     name: "5%葡萄糖注射液",
//     guige: '250ml*1袋/瓶',
//     bisi:'抗',
//     jl: 1,
//     jlUnit: 1,
//     numUnit:1,
//     num:1,
//     isChecked: 1,
//     cost: 190.0,
//     Id: 2
//   }
// ]
// // 用血医嘱表格
// export const bloodDoctorAdviceData = [
//   {
//     way:1,
//     reason: 1,
//     num: 100,
//     numUnit: 1,
//     Id: 1
//   },
//   {
//     way:2,
//     reason: 2,
//     num: 400,
//     numUnit: 2,
//     Id: 2
//   }
// ]