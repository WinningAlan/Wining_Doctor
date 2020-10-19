import * as regex from './regex';
import timeFilter from '@/filters/timeFilter.js';
export const drugColumns = [{
  text: "过敏药物名称",
  value: "MedicineName",
},
{
  text: "皮试日期",
  value: "SkinTestTime",
  formatter: timeFilter
},
{
  text: "开始时间",
  value: "StartTime",
  formatter: timeFilter
},
{
  text: "结束时间",
  value: "EndTime",
  formatter: timeFilter
},
{
  text: "过敏类型",
  value: "AllergyTypeDesc",
}
];
export const foodColumns = [{
  text: "过敏食物名称",
  value: "Name",
},
{
  text: "录入日期",
  value: "InputTime",
  formatter: timeFilter
},
{
  text: "开始日期",
  value: "StartTime",
  formatter: timeFilter
},
{
  text: "过敏类型",
  value: "AllergyTypeDesc",

},

];
export const takeColumns = [{
  text: "过敏造影剂名称",
  value: "Name",

},
{
  text: "录入日期",
  value: "InputTime",
  formatter: timeFilter
},
{
  text: "开始日期",
  value: "StartTime",
  formatter: timeFilter
},
{
  text: "过敏类型",
  value: "AllergyTypeDesc",

},

];
export const elseColumns = [{
  text: "其他过敏源名称",
  value: "Name",
},
{
  text: "录入日期",
  value: "InputTime",
  formatter: timeFilter
},
{
  text: "开始日期",
  value: "StartTime",
  formatter: timeFilter

},
{
  text: "过敏类型",
  value: "AllergyTypeDesc",

},

];
export const untowardColumns = [{
  text: "IDM",
  value: "IdmId"
},
{
  text: "药品名称",
  value: "MedicineName",
},
{
  text: "症状",
  value: "Symptom",
},
{
  text: "严重程度",
  value: "SeverityTypeDesc",

},
{
  text: "发生日期",
  value: "StartTime",
  formatter: timeFilter
},

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
// 24小时内观察记录
export const recordColumns = [{
  text: '时间',
  value: 'time'
},
{
  text: '体温',
  value: 'T'
},
{
  text: '哭声',
  value: 'ku'
},
{
  text: '肤色',
  value: 'fuse'
},
{
  text: '呼吸',
  value: 'huxi'
},
{
  text: '反应',
  value: 'fanyin'
},
{
  text: '呕吐',
  value: 'ot'
},
{
  text: '脐带',
  value: 'qd'
}, {
  text: '小便',
  value: 'xb'
}, {
  text: '其他',
  value: 'qt'
}, {
  text: '签名',
  value: 'qm'
},
]
// 病理反射(6项)
export const pathologicReflex6Columns = [{
  text: '',
  value: 'none'
},
{
  text: 'Hoffmann',
  value: 'Hoffmann'
},
{
  text: 'Rossolimo',
  value: 'Rossolimo'
},
{
  text: 'Babinski',
  value: 'Babinski'
},
{
  text: 'Chaddock',
  value: 'Chaddock'
},
{
  text: '髌阵挛',
  value: 'b'
},
{
  text: '踝阵挛',
  value: 'luo'
},
]
// GCS评分2
export const gcsGrade2Columns = [{
  text: 'GCS评分',
  value: 'grade'
},
{
  text: '睁眼反应',
  value: 'eyes',
  width: '100px',
},
{
  width: '100px',

  text: '语言反应',
  value: 'language'
},
{
  width: '100px',

  text: '运动反应',
  value: 'sports'
},
{
  text: '总分',
  value: 'allCount'
},
]
// 营养评价单
export const nutritionGradeColumns = [{
  width: '100px',

  text: '项目',
  value: 'items'

},
{
  width: '150px',

  text: '参考值',
  value: 'referenceValue'
},
{
  width: '150px',

  text: '测量值',
  value: 'measuredValue'
},
]
// 体征记录
export const signsRecordColumns = [{
  text: "体征记录",
  value: "Content",
  width: '450'

},
{
  text: "护士",
  value: "UpdateUserName",
},
{
  text: "记录时间",
  value: "UpdateTime",
  formatter: timeFilter
},
]
// 护理记录
export const nursingRecordColumns = [{
  text: "护理记录",
  value: "Content",
  width: '450'

},
{
  text: "护士",
  value: "护士签名",
},
{
  text: "记录时间",
  value: "Time",
},
]
// 诊断记录
export const diagnosticRecordsColumns = [{
  text: "状态",
  value: "Status",
  maxWidth: '80'
},
{
  text: "主/次",
  value: "details",
},
{
  text: "诊断内容",
  value: "result",
  width: '150'

},
{
  text: "ICD10",
  value: "result",
  width: '150'
},
{
  text: "类型",
  value: "result",
},
{
  text: "开立医生",
  value: "CreateUserName",
  width: '70',
},
{
  text: "开立时间",
  value: "StartTime",
  width: '100',
  formatter: timeFilter
},
]
// 检查结果
export const inspectionResultColumns = [
  {
    text: "报告号",
    value: "ReportNo",
  },
  {
    text: "检查项目",
    value: "ReportCategoryName",
  },
  {
    text: "检查结果",
    value: "Content",
    width: '250'

  },
  {
    text: "申请人",
    value: "ApplyName",
    maxWidth: '80px'

  },
  {
    text: "申请时间",
    value: "ApplyTime",
    width: '100',
    formatter: timeFilter
  },
]
// 检验结果
export const testResultColumns = [
  {
    text: "报告号",
    value: "ReportNo",
  },
  {
    text: "检验项目",
    value: "ReportCategoryName",
  },
  {
    text: "标本",
    value: "Sample",
  },
  {
    text: "申请人",
    value: "ApplyName",
    width: '70',
  },
  {
    text: "申请时间",
    value: "ApplyTime",
    width: '100',
    formatter: timeFilter
  },
  {
    text: "危急值",
    value: "CrisisFlag",
    maxWidth: '70',

  },

]

// 检验详情
export const testDetailColumns = [
  {
    text: "项目",
    value: "ItemName",
  },
  {
    text: "结果",
    value: "ItemValue",
  },
  {
    text: "提示",
    value: "Flag",
    formatter(val) {
      if (val === 1) {
        return '↓';
      } else if (val === 2) {
        return '↑';
      } else {
        return '';
      }
    }
  },
  {
    text: "单位",
    value: "Unit",
  },
  {
    text: "参考范围",
    value: "Range",
    maxWidth: '100',

  },
  {
    text: "检测方法",
    value: "lookOver",
  },
  {
    text: "趋势图",
    value: "operation",
  },
]
// 文字医嘱表格
export const wordDoctorAdviceColumns = [{
  text: "项目",
  value: "adviceName",
},
{
  text: "频次",
  value: "Frequency",
},

]
// 膳食医嘱表格
export const mealsDoctorAdviceColumns = [{
  text: "膳食项目",
  value: "adviceName",
},
{
  text: "频次",
  value: "Frequency",
},
{
  text: "剂量",
  value: "Unit",
},
{
  text: "单价",
  value: "Price",
  maxWidth: 70,
  formatter(val) {
    return (+val).toFixed(2)
  }
}
]
// 护理医嘱表格
export const nurseDoctorAdviceColumns = [{
  text: "护理项目",
  value: "adviceName",
},
{
  text: "频次",
  value: "Frequency",
},
{
  text: "单价",
  value: "Price",
  maxWidth: 70,
  formatter(val) {
    return (+val).toFixed(2)
  }
}
]
// 检查医嘱表格
export const inspectDoctorAdviceColumns = [{
  text: "检查项目",
  value: "adviceName",
},
{
  text: '是否使用医保',
  value: 'InsuranceUseFlag',
},
{
  text: "费用",
  value: "Price",
  // maxWidth:70,
  formatter(val) {
    return (+val).toFixed(2)
  }
}
]
// 检验医嘱表格
export const testDoctorAdviceColumns = [{
  text: "检验项目",
  value: "adviceName",
},
{
  text: "标本",
  value: "SampleCode",
},
{
  text: "标本说明",
  value: "Attention",
  editType: "text",
},
{
  text: '是否使用医保',
  value: 'InsuranceUseFlag',
},
{
  text: "费用",
  value: "Price",
  maxWidth: 70,
  formatter(val) {
    return (+val).toFixed(2)
  }
}
]

// 治疗医嘱表格
export const treatDoctorAdviceColumns = [{
  text: "治疗项目",
  value: "adviceName",
},
{
  text: "频次",
  value: "Frequency",
},
{
  text: "数量",
  value: "Unit",
},
{
  text: '是否使用医保',
  value: 'InsuranceUseFlag',
},
{
  text: "单价",
  value: "Price",
  maxWidth: 70,
  formatter(val) {
    return (+val).toFixed(2)
  }
}
]
// 药品医嘱表格
export const drugDoctorAdviceColumns = [{
  text: "药品名称",
  value: "adviceName",
  width: 180,
},
{
  text: "剂量",
  value: "specimen",
  width: 80,

},
{
  text: "数量",
  value: "remarks",
  width: 30,

},
{
  text: "自备药",
  value: "IsSelfProvided",
  editType: "switch",
  width: 30,
},
{
  text: "皮试",
  value: "IsSkinTest",
  editType: "switch",
  width: 30,
},
{
  text: "审",
  value: "ReimbursementType",
  editType: "switch",
  width: 30,
},
{
  text: "单价",
  value: "Price",
  maxWidth: 80,
  formatter(val) {
    return (+val).toFixed(2)
  }
},
{
  text: '是否使用医保',
  value: 'InsuranceUseFlag',
  maxWidth: 100,
},
{
  text: "医保限制说明",
  value: "Memo",
  maxWidth: 105,
}
]
// 用血医嘱表格
export const bloodDoctorAdviceColumns = [{
  text: "用血方式",
  value: "BloodWay",
  editType: "select",
  options: [{
    Text: "要求1",
    Value: 1
  },
  {
    Text: "要求2",
    Value: 2
  }
  ]
},
{
  text: "用血要求",
  value: "Alias",
},
{
  text: "用量",
  value: "remarks",
},
]
// 读卡配置
export const readCardColumns = [{
  text: "分级",
  value: "Name",
  editType: "text",
  rules: [regex.required]

},
{
  text: "Code",
  value: "Code",
  editType: "select",
  key: 'Value',
  label: 'Text',
  options: [{
    Value: 'medicalCard',
    Text: "medicalCard"
  }, {
    Value: 'socialSecurityCards',
    Text: "socialSecurityCards"
  }, {
    Value: 'identityCard ',
    Text: "identityCard"
  },
  {
    Value: 'scanCode ',
    Text: "scanCode"
  },
  {
    Value: 'threePersons ',
    Text: "threePersons"
  }
  ]
},
{
  text: "类型",
  value: "CardType",
  editType: "select",
  key: 'Value',
  label: 'Text',
  // isClear: true,

  options: [{
    Value: 'IDNumber',
    Text: "身份证"
  }, {
    Value: 'MagCard',
    Text: "磁卡"
  }, {
    Value: 'ICCard',
    Text: "IC卡"
  },
  {
    Value: 'Other',
    Text: "扫码"
  },
  {
    Value: 'ThreePersons',
    Text: "三无"
  }
  ],
  formatter(val, arr) {
    for (var i = 0; i < arr.length; i++) {
      if (val == arr[i].Value) {
        return arr[i].Text;
      }
    }
  }
},
{
  text: '状态',
  value: 'Enable',
  editType: "switch",
  formatter(val) {
    return val == 1 ? " 在用" : "停用"
  },
  width: '130px'

},
{
  text: '排序',
  value: 'SortIndex',
  editType: "number",
  width: '70px'
},
{
  text: "操作",
  value: "dd"
}
]
