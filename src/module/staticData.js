// 前端静态数据
// 过敏信息类型
export const allergyOption = [
  {
    text: "药品过敏信息",
    value: 1
  },
  {
    text: "食物过敏信息",
    value: 2
  },
  {
    text: "造影剂过敏信息",
    value: 3
  },
  {
    text: "其他过敏源过敏信息",
    value: 4
  },
  {
    text: "药物不良反应",
    value: 5
  },
  {
    text: "历史过敏信息",
    value: 6
  }
]
// 检验模板
export const testTree = [{
  Name: 'PCR',
  Id: 1,
},
{
  Name: "分泌物、体液常规",
  Id: 2
},
{
  Name: "粪便常规",
  Id: 3
},
{
  Name: "急诊化验室",
  Id: 4
},
{
  Name: "结核",
  Id: 5
},
{
  Name: "免疫传染病系列及其他",
  Id: 6
},
{
  Name: "免疫化学发光",
  Id: 7
},
{
  Name: "尿常规",
  Id: 8
},
{
  Name: "生化",
  Id: 9
},
{
  Name: "输血",
  Id: 10
},
{
  Name: "外送",
  Id: 11
},
{
  Name: "微生物",
  Id: 12
},
{
  Name: "胃镜室",
  Id: 13
},
{
  Name: "血常规",
  Id: 14
}, {
  Name: "血气分析",
  Id: 15
},
]
// 检查模板
export const inspectTree = [{
  Name: '心电图',
  Id: 1,
  List: [{
    Name: "心功能测定",
    Id: 11
  },
  {
    Name: "肌电图",
    Id: 12
  },
  {
    Name: "常规心电图",
    Id: 13
  },
  {
    Name: "动态心电图",
    Id: 14
  },
  {
    Name: "脑电图",
    Id: 15
  },
  {
    Name: "TCD",
    Id: 16
  },
  ]
},
{
  Name: "内镜",
  Id: 2,
  List: [{
    Name: "胃镜",
    Id: 21
  },
  {
    Name: "胃镜",
    Id: 20
  },
  {
    Name: "肠镜",
    Id: 22
  },
  {
    Name: "乙状结肠检查",
    Id: 23
  },
  {
    Name: "超声内镜",
    Id: 24
  },
  {
    Name: "气管镜",
    Id: 25
  },

  ]
},
{
  Name: "放射",
  Id: 3,
  List: [{
    Name: "CT",
    Id: 31
  },
  {
    Name: "CTA",
    Id: 32
  },
  {
    Name: "CT增强",
    Id: 33
  },
  {
    Name: "RF",
    Id: 34
  },
  ]
},
{
  Name: '病理',
  Id: 4,
  List: [{
    Name: "印记杂交",
    Id: 41
  },
  {
    Name: "TCT",
    Id: 42
  },
  {
    Name: "细胞学",
    Id: 43
  },
  {
    Name: "常规",
    Id: 44
  },
  {
    Name: "肾穿细胞",
    Id: 45
  },
  {
    Name: "宫颈MRNA检测",
    Id: 46
  },
  ]
},
{
  Name: '超声',
  Id: 5,
  List: [{
    Name: "彩超检查",
    Id: 51
  },
  {
    Name: "彩超检查(肿瘤病人)",
    Id: 52
  },
  {
    Name: "彩超检查(自费)",
    Id: 53
  },
  ]
}
]
// 病历插入计算器列表
export const formulaList = [{
  text: "体表面积",
  value: "0"
},
{
  text: "体重指数",
  value: "1"
},
{
  text: "卡帕值",
  value: "2"
},
{
  text: "腰臀比",
  value: "3"
},
{
  text: "血浆渗透压",
  value: "4"
},
{
  text: "血小板CCI",
  value: "5"
},
// {
//   text: "孕周计算",
//   value: "7"
// },
{
  text: "简化MDRD公式",
  value: "6"
},
{
  text: "微糖公式",
  value: "7"
},
{
  text: "校正内生肌酐消除率",
  value: "8"
}
]
// 病历插入表格名列表
export const medicalTableList = [{
  text: '24小时内观察记录',
  value: 'record'
},
{
  text: '病理反射(6项)',
  value: 'pathologicReflex6'
},
{
  text: 'GCS评分2',
  value: 'gcsGrade2'
},
{
  text: '营养评价单',
  value: 'nutritionGrade'
},
]
// 24小时内观察记录
export const recordData = [{},
{},
{},
{},
]
// 病理反射(6项)
export const pathologicReflex6Data = [{
  none: '左侧'
},
{
  none: '右侧'
},
]
// GCS评分2
export const gcsGrade2Data = [{
  grade: 6,
  eyes: '',
  language: '',
  sports: '能按吩咐动作',
  allCount: '——'
},
{
  grade: 5,
  eyes: '',
  language: '回答正确',
  sports: '刺痛时能定位',
  allCount: '——'
},
{
  grade: 4,
  eyes: '正常睁眼',
  language: '回答错乱',
  sports: '刺痛时躲避',
  allCount: '——'
},
{
  grade: 3,
  eyes: '呼唤睁眼',
  language: '语句不清',
  sports: '刺痛时肢体屈曲',
  allCount: '——'
},
{
  grade: 2,
  eyes: '刺痛时睁眼',
  language: '只能发音',
  sports: '刺痛时肢体屈曲',
  allCount: '——'
},
{
  grade: 1,
  eyes: '无反应',
  language: '无反应',
  sports: '无反应',
  allCount: '——'
},
{
  grade: '计分',

},
]
// 营养评价单
export const nutritionGradeData = [{
  items: '身高（cm）',
},
{
  items: '体重 （kg）',
},
{
  items: '体质指数（kg/m2）',
  referenceValue: '18.5-24',
},
{
  items: '皮褶厚度（mm）',
  referenceValue: '男：12.5 女：16.5',
},
{
  items: '上臂围（cm）',
  referenceValue: '男：27.4 女：25.8',
},
{
  items: '臂肌围',
  referenceValue: '男：24.8 女：21.0',
},
{
  items: '血红蛋白（g/L）',
  referenceValue: '110-160',
},
{
  items: '血清前白蛋白（mg/L）',
  referenceValue: '200-500',
},
{
  items: '血清白蛋白（g/L）',
  referenceValue: '35-55',
},
{
  items: '血清总蛋白（g/L）',
  referenceValue: '60-85',
},
{
  items: '血清运铁蛋白（mg/dl）',
  referenceValue: '220-400',
},
{
  items: '淋巴细胞总数（×109/L）',
  referenceValue: '0.8-4.0',
},
{
  items: '其他',
},
{}, {}, {}
]
// 用血申请单
export const bloodData = [{
  text: 'ALT',
  key: 'Alt',
  unit: 'U/L',
  type: 'number'
},
{
  text: 'HBsAg',
  key: 'HbsAg',
  unit: ''
},
{
  text: '抗-HCV',
  key: 'AntiHcv',
  unit: ''
},
{
  text: '血红蛋白',
  key: 'Hemoglobin',
  unit: 'g/dl',
  type: 'number'

},
{
  text: '抗-HIV',
  key: 'AntiHiv',
  unit: ''
},
{
  text: '梅毒实验',
  key: 'Syphilis',
  unit: ''
},
{
  text: 'HBsAb',
  key: 'HbsAb',
  unit: ''
},
{
  text: '白细胞',
  key: 'Leukocyte',
  unit: '10^9g/L',
  type: 'number'

},
{
  text: 'HBcAb',
  key: 'HBcAb',
  unit: ''
},
{
  text: 'HBeAb',
  key: 'HbeAb',
  unit: ''
},
{
  text: 'HBeAg',
  key: 'HbeAg',
  unit: ''
},
{
  text: '血小板',
  key: 'Platelet',
  unit: '10^9g/L',
  type: 'number'

},
]
// 就诊卡片类型
export const cardList = [{
  name: "医保卡",
  value: 1
},
{
  name: "就诊卡",
  value: 2
},
{
  name: "身份证",
  value: 3
}
]
// 绿色通道类型
export const greenChannelData = {
  '胸痛': 'xiong',
  '卒中': "cu",
  '创伤': "chuang",
  '孕产妇': "yun",
  '三无': "wu",
  '中毒': "du",
  '其他': "ta"
}
// 申请单状态
export const statusOptions = [
  // { text: "待提交", value: 0 },
  {
    text: "待提交",
    value: 1
  },
  {
    text: "已提交",
    value: 2
  },
  {
    text: "已审核",
    value: 3
  },
  {
    text: "已退回",
    value: 4
  },
  {
    text: "执行中",
    value: 5
  },
  {
    text: "已执行",
    value: -5
  },
  {
    text: "已停止",
    value: 6
  },
  {
    text: "已作废",
    value: 7
  }
];
// 医生、护士变量名
export const nurseKey = ['InstrumentNurseId', 'CircuitNurseId'];
export const doctorKey = ['MianDoctorId', 'AnesthesiaAssistantId', 'FirstAssistantId',
  'SecondAssistantId', 'InstructDoctorId', 'AnesthesiaDoctorId'
];
export const componentsName = {
  "14": "drugDoctorAdvice",
  "5": "nurseDoctorAdvice",
  "122": "wordDoctorAdvice",
  "3": "mealsDoctorAdvice",
  "0": "treatDoctorAdvice",
  "2": "treatDoctorAdvice",
  "6": "treatDoctorAdvice",
  "11": "treatDoctorAdvice",
  "1": "treatDoctorAdvice",
  "13": "treatDoctorAdvice",
  "12": "treatDoctorAdvice",
  "20": "treatDoctorAdvice",
  "4": "bloodDoctorAdvice",
  "7": "inspectDoctorAdvice",
  "8": "testDoctorAdvice",
  "15": "newOperation",
  "31": "newConsultation"
}; //医嘱组件类型5577767
// 不同医嘱的Id名称
export const adviceId = {
  "14": "HisMedId",
  "5": "DictItemCode",
  "3": "DictItemCode",
  "0": "DictItemCode",
  "13": "DictItemCode",
  "20": "DictItemCode",
  "12": "DictItemCode",
  "15": "DictItemCode",
  "1": "DictItemCode",
  "7": "DictItemCode",
  "4": "ItemCode",
  "8": "DictItemCode",
  "122": "WordsType",
  "31": "DictItemCode"
};
export const nurseName = ["特级护理", "一级护理", "二级护理", "三级护理"];

export const bodySurfaceAreaData = {
  remark: '人体体表面积计算器仅供参考',
  formulaList: {
    BSA: '√(w*h/3600)',
  },

  formulaText: {
    BSA: 'BSA=开平方[体重 (Kg)x身高 (cm)]/3600',
  },
  itemList: [{
    label: '体重 (Kg)',
    type: 'number',
    max: 200,
    min: 0,
    col: 1,

    value: 'w',
  },
  {
    label: '身高 (cm)',
    type: 'number',
    max: 240,
    min: 1,
    value: 'h',
    col: 1,

    precision: 0
  },
  {
    label: '体表面积BSA (㎡)',
    type: 'text',
    value: 'BSA',
    col: 1,

  },
  ]
}

export const bodyMassIndexData = {
  remark: '体重指数计算器仅供参考',
  formulaList: {
    BMI: 'w/(h^2/10000)',

  },
  formulaText: {
    BMI: 'BMI=[体重 (Kg)/身高 (m)²]',
  },
  itemList: [{
    label: '体重 (Kg)',
    type: 'number',
    max: 200,
    min: 0,
    col: 1,

    value: 'w',
  },
  {
    label: '身高 (cm)',
    type: 'number',
    max: 240,
    min: 1,
    value: 'h',
    col: 1,

    precision: 0
  },
  {
    label: '体重指数BMI (Kg/㎡)',
    type: 'text',
    value: 'BMI',
    col: 1,

  },
  ]
}
export const carboplatinValueData = {
  remark: '内生肌酐消除率计算器仅供参考',
  formulaList: {
    Ccr: '(140-age)*w/(0.818*Scr)*(sex===1?1:0.85)',
    Calvert: 'AUC*(Ccr+25)',
  },
  formulaText: {
    Ccr: '内生肌酐消除率Ccr= (140-年龄)x体重 (kg)/ (0.818x血肌酐Scr (μmol/l));女性按计算结果x0.85',
    Calvert: '卡铂剂量 (mg)Calvert=所设定的AUC (mg/ml/min)x (内生肌酐消除率 (ml/min)+25)',
  },
  itemList: [{
    label: '性别',
    type: 'radio',
    col: 2,
    value: 'sex',
  },
  {
    label: '内生肌酐消除率Ccr (ml/min)',
    type: 'text',
    col: 2,
    value: 'Ccr',
  },
  {
    label: '年龄 (岁)',
    type: 'number',
    max: 140,
    col: 2,
    min: 0,
    value: 'age',
  },
  {
    label: '卡铂剂量 (mg)',
    type: 'text',
    col: 2,
    value: 'Calvert',
  },
  {
    label: '体重 (Kg)',
    type: 'number',
    max: 200,
    min: 0,
    col: 2,
    value: 'w',
  },
  {
    type: 'none',
    col: 2,

  },
  {
    label: '血肌酐Scr (μmol/l)',
    type: 'number',
    max: 2000,
    min: 0,
    col: 2,
    value: 'Scr',
  },
  {
    type: 'none',
    col: 2,

  },
  {
    label: 'AUC(mg/ml/min)取值(常取5-7)',
    type: 'number',
    max: 100,
    min: 0,
    col: 2,
    value: 'AUC',
  },
  {
    type: 'none',
    col: 2,

  },
  ]
}


export const waistHipRatioData = {
  remark: '腰臀比计算器仅供参考',
  formulaList: {
    WRH: 'W/H',

  },
  formulaText: {
    WRH: '腰臀比WRH=腰围/臀围',
  },
  itemList: [{
    label: '腰围 (cm)',
    type: 'number',
    max: 300,
    min: 0,
    col: 1,
    value: 'W',
  },
  {
    label: '臀围 (cm)',
    type: 'number',
    max: 300,
    col: 1,

    min: 1,
    value: 'H',
    precision: 0
  },
  {
    label: '腰臀比WRH',
    type: 'text',
    col: 1,

    value: 'WRH',
  },
  ]
}
export const plasmaOsmoticPressureData = {
  remark: '血浆渗透压计算器仅供参考',
  formulaList: {
    POP: '2*(Na+K)+urea+sugar',
    YPOP: '2*(Na+K)+sugar',
  },
  formulaText: {
    POP: '血浆渗透压=2* (血钠+血钾)+血糖+尿素',
    YPOP: '有效血浆渗透压=2* (血钠+血钾)+血糖',
  },
  itemList: [{
    label: '血钠 (mmol/L)',
    type: 'number',
    max: 300,
    col: 2,
    min: 0,
    value: 'Na',
  },
  {
    label: '血浆渗透压 (mmol/L)',
    type: 'text',
    col: 2,
    value: 'POP',
  },
  {
    label: '血钾 (mmol/L)',
    type: 'number',
    max: 300,
    col: 2,
    min: 0,
    value: 'K',
  },
  {
    label: '有效血浆渗透压 (mmol/L)',
    type: 'text',
    col: 2,
    value: 'YPOP',
  },
  {
    label: '血糖 (mmol/L)',
    type: 'number',
    max: 300,
    min: 0,
    col: 2,
    value: 'sugar',
  },
  {
    type: 'none',
    col: 2,

  },
  {
    label: '尿素 (mmol/L)',
    type: 'number',
    max: 300,
    min: 0,
    col: 2,
    value: 'urea',
  },
  {
    type: 'none',
    col: 2,

  },

  ]
}
export const thrombocyteData = {
  remark: '血小板CCI计算器仅供参考',
  title: '输血后24h CCI<4.5x10^9/L 或 1h的CCT<7.5x10^9/L为无效',
  formulaList: {
    BSA: '0.0061*h+0.0128*w-0.01529',
    diff: 'after-before',
    CCI: 'diff*BSA/(count*2.5)',
  },
  formulaText: {
    BSA: '体表面积 (㎡)=0.0061x身高 (cm)+0.0128x体重 (Kg)-0.01529',
    CCI: '血小板输入差值x体表面积 (㎡)/ (采血小板x2.5)',
  },
  itemList: [{
    label: '身高 (cm)',
    type: 'number',
    max: 240,
    col: 2,
    min: 0,
    value: 'h',
  },
  {
    label: '体表面积 (㎡)',
    type: 'text',
    col: 2,
    value: 'BSA',
  },
  {
    label: '体重 (Kg)',
    type: 'number',
    max: 200,
    col: 2,
    min: 0,
    value: 'w',
  },
  {
    label: '血小板输入差值 (10^9/L)',
    type: 'text',
    col: 2,
    value: 'diff',
  },
  {
    label: '血小板输入前 (10^9/L)',
    type: 'number',
    max: 500,
    min: 1,
    col: 2,
    value: 'before',
  },
  {
    label: '血小板CCI值',
    type: 'text',
    col: 2,
    value: 'CCI',
  },
  {
    label: '血小板输入后 (10^9/L)',
    type: 'number',
    max: 500,
    min: 1,
    col: 2,
    value: 'after',
  },
  {
    type: 'none',
    col: 2,

  },
  {
    label: '采血小板数 (单位)',
    type: 'number',
    max: 10,
    min: 1,
    col: 2,
    value: 'count',
  },
  {
    type: 'none',
    col: 2,

  },

  ]
}
export const mdrdData = {
  remark: '肾小球过滤计算器仅供参考',
  formulaList: {
    GFR: '186*(Scr^-1.154)/(88.4^-1.154)*(age^-0.203)*(sex===1?1:0.742)',
  },
  formulaText: {
    GFR: 'GFR(ml/min 1.73㎡)= 186x((Scr/88.4)^-1.154)x(年龄^-0.203)x(0.742女性)',
  },
  itemList: [{
    label: '性别',
    type: 'radio',
    col: 1,
    value: 'sex',
  },

  {
    label: '年龄 (岁)',
    type: 'number',
    max: 140,
    col: 1,
    min: 0,
    value: 'age',
  },
  {
    label: '血清肌酐Scr (μmol/l)',
    type: 'number',
    max: 2000,
    min: 0,
    col: 1,
    value: 'Scr',
  },
  {
    label: '肾小球过滤GFR(ml/min 1.73㎡)',
    type: 'text',
    col: 1,
    value: 'GFR',
  },
  ]
}

export const theSugarData = {
  remark: '微糖计算器仅供参考',
  formulaList: {
    dosage: '(bloodGlucose-5.6)*w*0.6/11.1',
    exponent: 'bloodGlucose*insulin/22.5',
    revise: 'serumSodium+0.016*(glucose-100)',
  },
  formulaText: {
    dosage: '日胰岛素用量(U)= (空腹血糖(mmol/L)-5.6))x体重(Kg)x0.6/11.1',
    exponent: '胰岛素抵抗指数=空腹血糖(mmol/L)x空腹胰岛素/22.5',
    revise: '高血糖的钠校正= 血清钠+0.016x(血清葡萄糖-100)',
  },
  colName: [
    '日胰岛素用量(U)',
    '胰岛素抵抗指数',
    '高血糖的钠校正'
  ],
  itemList: [

    {
      label: '空腹血糖(mmol/L)',
      type: 'number',
      max: 140,
      col: 3,
      min: 0,
      value: 'bloodGlucose',
    },
    {
      label: '空腹血糖(mmol/L)',
      type: 'number',
      max: 140,
      col: 3,
      min: 0,
      value: 'bloodGlucose',
    },
    {
      label: '血清钠',
      type: 'number',
      max: 140,
      col: 3,
      min: 0,
      value: 'serumSodium',
    },
    {
      label: '体重 (Kg)',
      type: 'number',
      max: 200,
      col: 3,
      min: 0,
      value: 'w',
    },
    {
      label: '空腹胰岛素',
      type: 'number',
      max: 140,
      col: 3,
      min: 0,
      value: 'insulin',
    },
    {
      label: '血清葡萄糖',
      type: 'number',
      max: 140,
      col: 3,
      min: 0,
      value: 'glucose',
    },
    {
      label: '日用量(U)',
      type: 'text',
      col: 3,
      value: 'dosage',
    },
    {
      label: '抵抗指数',
      type: 'text',
      col: 3,
      value: 'exponent',
    },
    {
      label: '校正钠',
      type: 'text',
      col: 3,
      value: 'revise',
    },
  ]
}
export const reviseCcrData = {
  remark: '计算结果仅供参考',
  formulaList: {
    rCcr: 'Ccr*1.73/BSA',
  },
  formulaText: {
    rCcr: 'Ccr Correction= 24小时内生肌酐清除率(ml/min)x1.73(㎡)/体表面积(㎡)',
  },
  itemList: [

    {
      label: '24小时内生肌酐清除率(ml/min)',
      type: 'number',
      max: 140,
      col: 1,
      min: 0,
      value: 'Ccr',
    },
    {
      label: '体表面积(㎡)',
      type: 'number',
      max: 140,
      col: 1,
      min: 0,
      value: 'BSA',
    },
    {
      label: '校正内生肌酐清除率',
      type: 'text',
      col: 1,
      value: 'rCcr',
    },
  ]
}
// 都昌那个打印不同类型对应objectType
export const printObjectType =
{
  // 麻醉
  'Anaesthesia': {
    'objectType': '25',
    'templateId': '6D64A870-38A6-4DF5-BB86-AB82010167BC'
  },
  // 精二
  'EssenceTwo': {
    'objectType': '27',
    'templateId': 'BB56EBC8-4AA1-4103-B86F-AB82010167B3'
  },
  // 精一
  'EssenceOne': {
    'objectType': '26',
    'templateId': '23E248B9-35F8-4079-8048-AB82010167A9'
  },
  // 毒
  'Poison': {
    'objectType': '28',
    'templateId': 'F60F7665-0DA3-4991-AB2B-AB820101679E'
  },
  // 长期医嘱
  'longAdvice': {
    'objectType': '29',
    'templateId': '0E140837-4F41-4E16-B745-AB820101678C',
    'reportType':2,
  },
  // 临时医嘱
  'tempAdvice': {
    'objectType': '29',
    'templateId': '7FA5B443-8CEF-4F81-8267-AB8201016774',
    'reportType':1,
  },
  // 长期/临时医嘱
  'longTempAdvice': {
    'objectType': '29',
    'templateId': '87799D23-822C-4B9A-8DC9-AB8201016784',
    'reportType':0,
  },
  // 部分医嘱
  'otherAdvice': {
    'objectType': '29',
    'templateId': '35159C4A-0175-45BB-877E-AB820101677D',
    'reportType':3,
  },
  // 检查
  'examine': {
    'objectType': '20',
    'templateId': 'ABC24F32-BD6B-4E4C-8FEC-AB82010167E4'
  },
  // 检验
  'checkout': {
    'objectType': '21',
    'templateId': '97E5EEAA-CFDB-4FC5-AF1E-AB82010167F3'
  },
  // 用血
  'blood': {
    'objectType': '19',
    'templateId': '12AC9536-2B1F-4A2D-A8C2-AB8201016802'
  },
  // 手术
  'operation': {
    'objectType': '22',
    'templateId': 'CDF92DC3-1BA5-42EC-899F-AB82010167DB'
  },
  // 会诊
  'consultation': {
    'objectType': '23',
    'templateId': 'F8556916-BDA2-4AB6-AF5F-AB82010167CA'
  },
  // 普通处方
  'prescription': {
    'objectType': '24',
    'templateId': '2EBB3C2B-AD18-4D93-A7D9-AB8201016797'
  },
    // 治疗
    'treatDoctorAdvice': {
      'objectType': '33',
      'templateId': '9AC5C5F3-64CB-4CB4-B68A-ABD700F85948'
  },
        // 大型设备
  'CheckLargeEquipment': {
    'objectType': '36',
    'templateId': '9AC5C5F3-64CB-4CB4-B68A-ABD700F85948'
    },
  'specialDrugBatch':{
    'objectType': '30',
    'templateId': ''
  },
  "infusionOrder":{
    'objectType': '35',
    'templateId': '1CC6615C-3106-4D55-8318-ABD8013F1125',
    'reportType':3
  }

}
// 特殊符号
export const specificSymbolData = [{
  groupName: "肺癌TNM分期",
  itemList: ["T<sub>0</sub>", "T<sub>2</sub>", "T<sub>3</sub>", "N<sub>x</sub>",
    "N<sub>0</sub>", "M<sub>0</sub>", "N<sub>2</sub>", "N<sub>3</sub>", "M<sub>x</sub>",
    "M<sub>1</sub>( )", "T<sub>x</sub>", "N<sub>1</sub>", "T<sub>9</sub>"
  ]
},
{
  groupName: "肺癌的临床分期",
  itemList: ["Ⅳ", "R2", "ⅠA", "ⅠB", "ⅡA", "ⅡB", "ⅢA", "ⅢB", "R1", "R0"]
},
{
  groupName: "数字序号",
  itemList: ["Ⅰ", "√", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "Ⅵ", "Ⅶ", "Ⅷ", "Ⅸ", "Ⅹ", "Ⅺ", "Ⅻ", "一"]
},
{
  groupName: "单位",
  itemList: ["X10<sup>9</sup>/L", "℃", "X10<sup>12</sup>/L", "X", "fl", "α", "mv/L", "mmol/L",
    "nmol/L", "μmol/L", "Pmol/L", "ng/L", "g/L", "ng/ml", "mg/㎡", "/L", "/ml", "%", "㎡", "c㎡",
    "Ag", "β", "μ/ml"
  ]
},
{
  groupName: "其他",
  itemList: ["牙位图", "月经史", "胎心"]
},
]
// 人员来源
export const  sersonnelSource=[
  {
  text:'1.集中留观',
  value:'1.集中留观'
},
      {
  text:'2.密切接触者',
  value:'2.密切接触者'
  },
  {
    text:'3.交通检疫',
    value:'3.交通检疫'
  },
  {
    text:'4.社区排查',
    value:'4.社区排查'
  },
  {
    text:'5.发热门诊',
    value:'5.发热门诊'
  },
  {
    text:'6.其他门（急）诊',
    value:'6.其他门（急）诊'
  },
  {
    text:'7.住院患者',
    value:'7.住院患者'
  },
  {
    text:'8.住院患者陪护人员',
    value:'8.住院患者陪护人员'
  },
  {
    text:'99.其它采样点',
    value:'99.其它采样点'
  },
]
// 证件类型
export const documentType = [
  {
    text:'居民身份证',
    value:'居民身份证'
  },  {
    text:'军人证',
    value:'军人证'
  },  {
    text:'护照',
    value:'护照'
  },  {
    text:'港澳台身份证',
    value:'港澳台身份证'
  },  {
    text:'港澳台居民居住证',
    value:'港澳台居民居住证'
  },  {
    text:'港澳人员回乡证',
    value:'港澳人员回乡证'
  },  {
    text:'港澳台居民来往内地通行证',
    value:'港澳台居民来往内地通行证'
  }, {
    text:'出生医学证明',
    value:'出生医学证明'
  }, {
    text:'其他',
    value:'其他'
  },
]
// 人员身份(必填)
export const personnelIdentity = [
  {
    text:'1.外国籍留学生',
    value:'1.外国籍留学生'
  },  {
    text:'2.复工复产人员',
    value:'2.复工复产人员'
  },  {
    text:'3.返校老师',
    value:'3.返校老师'
  },  {
    text:'4.返校学生',
    value:'4.返校学生'
  },  {
    text:'5.医疗机构工作人员',
    value:'5.医疗机构工作人员'
  },  {
    text:'6.口岸检疫和边防检查人员',
    value:'6.口岸检疫和边防检查人员'
  },  {
    text:'7.监所工作人员',
    value:'7.监所工作人员'
  }, {
    text:'8.社会福利养老机构工作人员',
    value:'8.社会福利养老机构工作人员'
  }, {
    text:'9.孕产妇',
    value:'9.孕产妇'
  }, {
    text:'10.新生儿',
    value:'10.新生儿'
  }, {
    text:'11.母婴服务类机构人员',
    value:'11.母婴服务类机构人员'
  }, {
    text:'99.其它人群',
    value:'99.其它人群'
  },
]
// 14天内境外入境(必填)
export const isForeign = [
  {
    text:'是',
    value:'是'
  },  {
    text:'否',
    value:'否'
  },
]
export const needDeclarePatmessage = [
  '134309',
  '136091',
  '136092',
  '136094'
  // {
  //   type: 7,
  //   item: [
  //     {
  //       code: "",
  //       isNeedDeclare: true
  //     },
  //     {
  //       code: "",
  //       isNeedDeclare: true
  //     }
  //   ]
  // }
] //新冠肺炎需要补充申报用户信息的检查/检验/临床项目
export const tableItemWidth={
  'Department':{
    width:'80',
    minWidth:'',
  },
  'FirstDoctor':{
    width:'80',
    minWidth:'',
  },
  
  'Diet':{
    width:'',
    minWidth:'',
  },
  'ResidenceTime':{
    width:'',
    minWidth:'',
  },
  'Fee':{
    width:'',
    minWidth:'',
  },
  'FeeType':{
    width:'',
    minWidth:'60',
  },
  TriageTo: {
    width:'80',
    minWidth:'',
  },
  'Remainder':{
    width:'70',
    minWidth:'',
  },
  'Identity':{
    width:'70',
    minWidth:'',
  },
  'Doctor':{
    width:'',
    minWidth:'70',
  },
  'Nurse':{
    width:'',
    minWidth:'70',
  },
  'Diagnosis':{
    width:'',
    minWidth:'',
  },
  'Remark':{
    width:'70',
    minWidth:'',
  },
  CaseStatus: {
    width:'70',
    minWidth:'',
  },
  'AdvancePayment':{
    width:'80',
    minWidth:'',
  },
  'CardNumber':{
    width:'',
    minWidth:'',
  },
  'HISPatientId':{
    width:'80',
    minWidth:'',
  },
  'NursingLevel':{
    width:'80',
    minWidth:'',
  },
  'RecordNumber':{
    width:'',
    minWidth:'90',
  },

  'RegisterNo':{
    width:'70',
    minWidth:'',
  },
  'ActiveRegistId':{
    width:'',
    minWidth:'',
  },
  'WaitingTime':{
    width:'',
    minWidth:'',
  },
  'RegisterTime':{
    width:'',
    minWidth:'130',
  },
  Diagnosis: {
    width:'',
    minWidth:'120',
  },
  CardNumber: {
    width:'',
    minWidth:'90',
  },
}
// 药品处方模板名称集合
export const recipeTemp = ['Ordinary','Anaesthesia','EssenceOne','EssenceTwo','Poison','Danger','ChemicalTest','Insulin','Antibiotics','Vaccine','Pregnancy']
/*  /// <summary>
        /// 普通
        /// </summary>
        [Description("普通")]
        Ordinary = 0,
        /// <summary>
        /// 麻醉
        /// </summary>
        [Description("麻醉")]
        Anaesthesia = 1,
        /// <summary>
        /// 精一
        /// </summary>
        [Description("精一")]
        EssenceOne = 2,
        /// <summary>
        /// 精二
        /// </summary>
        [Description("精二")]
        EssenceTwo = 7,
        /// <summary>
        /// 毒
        /// </summary>
        [Description("毒")]
        Poison = 3,
        /// <summary>
        /// 危险
        /// </summary>
        [Description("危险")]
        Danger = 4,
        /// <summary>
        /// 化试
        /// </summary>
        [Description("化试")]
        ChemicalTest = 5,

        /// <summary>
        /// 胰岛素
        /// </summary>
        [Description("胰岛素")]
        Insulin = 6,

        /// <summary>
        /// 抗菌素
        /// </summary>
        [Description("抗菌素")]
        Antibiotics = 9,

        /// <summary>
        /// 疫苗
        /// </summary>
        [Description("疫苗")]
        Vaccine = 10,

        /// <summary>
        /// 妊娠
        /// </summary>
        [Description("妊娠")]
        Pregnancy = 11
  */