const filterData = function (val, arr) {
  let str = '';
  arr && arr.forEach(item => {
    if (val == item.Value) {
      str = item.Text;
    }
  })
  return str
}
import timeFilter from "../filters/timeFilter.js"
import costFilter from "../filters/costFilter.js"
export const drugColumns = [{
    text: "过敏药物名称",
    value: "HisMedId",
    editType: "select"
  },
  {
    text: "皮试日期",
    value: "SkinTestTime",
    editType: "time",
    formatter: timeFilter
  },
  {
    text: "开始时间",
    value: "StartTime",
    editType: "time",
    formatter: timeFilter
  },
  {
    text: "结束时间",
    value: "EndTime",
    editType: "time",
    formatter: timeFilter
  },
  {
    text: "过敏类型",
    value: "AllergyType",
    editType: "select",
    options: [],
    formatter: filterData
  },
  {
    text: "操作",
    value: "dd",
    width: '50'
  }
];
export const foodColumns = [{
    text: "过敏食物名称",
    value: "Code",
    editType: "select",

  },
  {
    text: "录入日期",
    value: "InputTime",
    editType: "time",
    formatter: timeFilter
  },
  {
    text: "开始日期",
    value: "StartTime",
    editType: "time",
    formatter: timeFilter
  },
  {
    text: "过敏类型",
    value: "AllergyType",
    editType: "select",
    options: [],
    formatter: filterData
  },
  {
    text: "操作",
    value: "dd",
    width: '50'
  }
];
export const takeColumns = [{
    text: "过敏造影剂名称",
    value: "Code",
    editType: "select",

  },
  {
    text: "录入日期",
    value: "InputTime",
    editType: "time",
    formatter: timeFilter
  },
  {
    text: "开始日期",
    value: "StartTime",
    editType: "time",
    formatter: timeFilter
  },
  {
    text: "过敏类型",
    value: "AllergyType",
    editType: "select",
    options: [],
    formatter: filterData
  },
  {
    text: "操作",
    value: "dd",
    width: '50'
  }
];
export const elseColumns = [{
    text: "其他过敏源名称",
    value: "Code",
    editType: "select"
  },
  {
    text: "录入日期",
    value: "InputTime",
    editType: "time",
    formatter: timeFilter
  },
  {
    text: "开始日期",
    value: "StartTime",
    editType: "time",
    formatter: timeFilter

  },
  {
    text: "过敏类型",
    value: "AllergyType",
    editType: "select",
    options: [],
    formatter: filterData
  },
  {
    text: "操作",
    value: "dd",
    width: '50'
  }
];
export const untowardColumns = [{
    text: "IDM",
    value: "IdmId"
  },
  {
    text: "药品名称",
    value: "HisMedId",
    editType: "select",
  },
  {
    text: "症状",
    value: "Symptom",
    editType:'input'
  },
  {
    text: "严重程度",
    value: "SeverityType",
    editType: "select",
    options: [],
    formatter: filterData
  },
  {
    text: "发生日期",
    value: "StartTime",
    editType: "time",
    formatter: timeFilter
  },
  {
    text: "操作",
    value: "dd",
    width: '50'
  }
]
export const historyColumns = [{
    text: "过敏项目名称",
    value: "Name",
  },
  {
    text: "皮试日期",
    value: "SkinTestTime",
    formatter: timeFilter
  },
  {
    text: "开始日期",
    value: "StartTime",
    formatter: timeFilter
  },
  {
    text: "结束日期",
    value: "EndTime",
    formatter: timeFilter,
  },
  {
    text: "过敏类别",
    value: "AllergyCategory",
  },
  {
    text: "过敏类型",
    value: "AllergyType",
  }
]
//费用的表头信息
//费用大项
export const categoriesColumns = [
  {
    text:"项目名称",
    value:"ItemName"
  },
  {
    text:"项目金额",
    value:"ItemAmount",
    formatter: costFilter
  },
  // {
  //   text:"分类支付金额",
  //   value:"PayAmount",
  //   formatter: costFilter
  // },
  {
    text:"自费金额",
    value:"OwnExpense",
    formatter: costFilter
  },
  {
    text:"可报金额",
    value:"ReimbursementAmount",
    formatter: costFilter
  },
  {
    text:"减免金额",
    value:"ReductionAmount",
    formatter: costFilter
  },
  // {
  //   text:"婴儿金额",
  //   value:"BabyAmount",
  //   formatter: costFilter
  // }
]
//费用小项
export const subentryColumns = [
  {
    text:"项目代码",
    value: "ItemCode",
    width:'70px'
    
  },
  {
    text:"项目名称内容",
    value: "ItemName",
    width:'100px'
  },
  {
    text:"单位",
    value: "Unit",
    width:'60px'
    
  },
  {
    text:"数量",
    value: "Count",
    width:'60px'
    
  },
  {
    text:"单价",
    value:"Price",
    formatter: costFilter
  },
  {
    text:"金额",
    value:"Amount",
    formatter: costFilter
  },
  {
    text:"申请科室",
    value:"ApplyDepartment"
  },
  {
    text:"执行科室",
    value:"ExecuteDepartment"
  },
  // {
  //   text:"分类支付金额",
  //   value:"PayAmount"
  // },
  {
    text:"大项目代码",
    value:"BigItemCode"
  },
  // {
  //   text:"结算序号",
  //   value:"SettlementNumber"
  // },
  // {
  //   text:"可报金额",
  //   value:"ReimbursementAmount"
  // },
  // {
  //   text:"自费金额",
  //   value:"OwnExpense"
  // }
]
//费用详情
export const detailColumns = [
  {
    text:"请求日期",
    value:'RequestDateTime',
    formatter: timeFilter,
    width:'100px'
  },
  {
    text:"收费日期",
    value:'ChargeDateTime',
    formatter: timeFilter,
    width:'100px'
  },
  {
    text:"项目代码",
    value:'ItemCode'
  },
  {
    text:"项目名称规格",
    value: 'ItemName',
    width:'100px'
  },
  {
    text:"单位",
    value: 'Unit',
    width:'60px'
    
  },
  {
    text:"数量",
    value: 'Count',
    width:'60px'
    
  },
  {
    text:"单价",
    value:'Price',
    formatter: costFilter,
  },
  {
    text:"金额",
    value:'Amount',
    formatter: costFilter,
  },
  {
    text:"开方科室",
    value:'PrescriptionDepartment'
  },
  {
    text:"执行科室",
    value:'ExecuteDepartment'
  },
  // {
  //   text:"分类支付金额",
  //   value:'PayAmount',
  //   formatter: costFilter,
  // },
  // {
  //   text:"自费金额",
  //   value:'OwnExpense',
  //   formatter: costFilter,
  // }
]
//预交金信息
export const prepayColumns = [
  {
    text:"日期",
    value:"StartTime",
    formatter: timeFilter,
  },
  {
    text:"操作员",
    value:'Operator'
  },
  {
    text:"收",
    value:'Income',
    formatter: costFilter,
  },
  {
    text:"支",
    value:'Pay',
    formatter: costFilter
  },
  {
    text:"余额",
    value:'Balance',
    formatter: costFilter
  },
  {
    text:"收费方式",
    value:'ChargeMode'
  },
  {
    text:"支票号",
    value:'CheckNumber'
  },
  {
    text:"操作类别",
    value:'OperateType'
  },
  {
    text:"发票号",
    value:'InvoiceNumber'
  },
]
//床位信息
export const bedColumns = [
  {
    text:"项目名称",
    value:"ItemName"
  },
  {
    text:"项目代码",
    value:"ItemCode"
  },
  {
    text:"项目费用",
    value:"ItemAmount",
    formatter: costFilter
  },
  {
    text:"单价",
    value:"Price",
    formatter: costFilter
  },
  {
    text:"请求日期",
    value:'RequestDateTime',
    formatter: timeFilter,
  },
  {
    text:"结算时间",
    value:'ChargeDateTime',
    formatter: timeFilter,
  }
]
//手术信息
export const operationColumns =  [
  {
    text:"手术名称",
    value:"Name"
  },
  {
    text:"手术日期",
    value:'OperationDate',
    formatter: timeFilter,
  },
  {
    text:"主刀医生",
    value:'DoctorName'
  },
  {
    text:"麻醉名称",
    value:'AnaesthesiaName'
  },
  {
    text:"术前诊断",
    value:'PreoperativeDiagnosis'
  },
  {
    text:"术后诊断",
    value: 'PostoperativeDiagnosis',
    formatter: (val)=>{return val?val:''},
  },
  {
    text:"病理诊断",
    value:'PathologicDiagnosis'
  },
  {
    text:"金额",
    value:'Amount',
    formatter: costFilter,
  },
  // {
  //   text:"结果",
  //   value:'b'
  // },
  {
    text:"记录状态",
    value:'Status'
  }
]
//未记账的费用
export const tallyColumns = [
  {
    text:"名称",
    value: "Name",
    width:'100px'
    
  },
  {
    text:"数量",
    value: "Count",
    width:'60px'
    
  },
  {
    text:"单位",
    value: "Unit",
    width:'60px'
    
  },
  {
    text:"单价",
    value:"Price"
  },
  // {
  //   text:"次数",
  //   value:"Times"
  // },
  {
    text:"总金额",
    value:"TotalAmount"
  },
  {
    text:"执行科室",
    value:"ExecuteDepartment"
  },
  // {
  //   text:"医嘱状态",
  //   value:"EntrustStatus"
  // },
  {
    text:"录入日期",
    value:"InputTime",
    formatter: timeFilter,
  }
]
//药占比信息
export const medicinColumns = [
  {
    text:"项目代码",
    value:'ItemCode'
  },
  {
    text:"项目名称",
    value:'ItemName'
  },
  {
    text:"项目金额",
    value:'Amount',
    formatter: costFilter
  },
  {
    text:"占总费用比例(%)",
    value: 'Rate',
    formatter: (str) => {
      return (+str).toFixed(2)
    }
  
  }
]

