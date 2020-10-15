
export const navData = [
  {
    "Name": "公共模块",
    "UiRouter": "home",
    "Children": [
      {
        "Name": "诊疗区设置",
        "UiRouter": "district",
        "Children": [],
        "Elements": null,
        "Icon": "district"
      },
      {
        "Name": "去向设置",
        "UiRouter": "goArea",
        "Children": [],
        "Elements": null,
        "Icon": "goArea"
      },
      {
        "Name": "IP地址设置",
        "UiRouter": "ipAdress",
        "Children": [
        ],
        "Elements": null,
        "Icon": "ipAdress"
      },
      {
        "Name": "字典量设置",
        "UiRouter": "dictionaries",
        "Children": [
        ],
        "Elements": null,
        "Icon": "dictionaries"
      }
    ],
    "Elements": null,
    "Icon": "home"
  },
  {
    "Name": "权限管理",
    "UiRouter": "jurisdiction",
    "Children": [
      {
        "Name": "组织管理",
        "UiRouter": "organization",
        "Children": [],
        "Elements": null,
        "Icon": "organization",
      },
      {
        "Name": "菜单管理",
        "UiRouter": "routing",
        "Children": [],
        "Elements": null,
        "Icon": "routing"
      },
      
      {
        "Name": "角色管理",
        "UiRouter": "role",
        "Children": [],
        "Elements": null,
        "Icon": "role"
      },
      {
        "Name":"科室管理",
        "UiRouter": "department",
        "Children": [],
        "Elements": null,
        "Icon": "department"
      },
       {
        "Name":"职位管理",
        "UiRouter": "position",
        "Children": [],
        "Elements": null,
        "Icon": "position"
      },
      {
        "Name":"用户管理",
        "UiRouter": "user",
        "Children": [],
        "Elements": null,
        "Icon": "user"
      }
      // {
      //   "Name":"代教管理",
      //   "UiRouter": "agency",
      //   "Children": [],
      //   "Elements": null,
      //   "Icon": "agency"
      // }
      
    ],
    "Elements": null,
    "Icon": "jurisdiction"
  },
  {
    "Name": "预检系统",
    "UiRouter": "triage",
    "Children": [],
    "Elements": null,
    "Icon": "triage",
    "Children": [
      {
        "Name": "分级设置",
        "UiRouter": "grading",
        "Children": [],
        "Elements": null,
        "Icon": "grading",
      },
      {
        "Name": "规则设置",
        "UiRouter": "signs",
        "Children": [],
        "Elements": null,
        "Icon": "signs",
      },
      // {
      //   "Name":"POCT规则设置",
      //   "UiRouter": "poctrule",
      //   "Children": [],
      //   "Elements": null,
      //   "Icon": "poctrule",
      // },
      
      {
        "Name": "症状知识库设置",
        "UiRouter": "symptom",
        "Children": [],
        "Elements": null,
        "Icon": "symptom",
      },
      {
        "Name": "评分单配置",
        "UiRouter": "scoresheet",
        "Children": [],
        "Elements": null,
        "Icon": "scoresheet",
      },
    ]
  },
  // {
  //   "Name": "医生站点",
  //   "UiRouter": "doctor",
  //   "Children": [],
  //   "Elements": null,
  //   "Icon": "doctor"
  // },
  {
    "Name": "护士站点",
    "UiRouter": "nursing",
    "Children": [
      // {
      //   "Name": "医嘱材料设置",
      //   "UiRouter": "prnConsumable",
      //   "Children": [],
      //   "Elements": null,
      //   "Icon": "prnConsumable"
      // },
      {
        "Name": "医嘱设置",
        "UiRouter": "prnName",
        "Children": [],
        "Elements": null,
        "Icon": "prnName"
      },

      // {
      //   "Name": " 医嘱频次设置",
      //   "UiRouter": "prnFrequency",
      //   "Children": [],
      //   "Elements": null,
      //   "Icon": "prnFrequency"
      // },
      {
        "Name": "医嘱用法设置",
        "UiRouter": "prnUsage",
        "Children": [],
        "Elements": null,
        "Icon": "prnUsage"
      },
      {
        "Name": "医嘱单据设置",
        "UiRouter": "prnReceipts",
        "Children": [],
        "Elements": null,
        "Icon": "prnReceipts"
      },


      {
        "Name": "液体平衡项设置",
        "UiRouter": "waterBalance",
        "Children": [],
        "Elements": null,
        "Icon": "waterBalance"
      },
      {
        "Name": "观察项设置",
        "UiRouter": "observationItem",
        "Children": [],
        "Elements": null,
        "Icon": "observationItem"
      },
      {
        "Name": "计费项设置",
        "UiRouter": "charging",
        "Children": [],
        "Elements": null,
        "Icon": "charging"
      },
      {
        "Name": "导管设置",
        "UiRouter": "conduit",
        "Children": [],
        "Elements": null,
        "Icon": "conduit"
      },
      {
        "Name": "床位设置",
        "UiRouter": "bedSet",
        "Children": [],
        "Elements": null,
        "Icon": "bedSet"
      },
      {
        "Name": "班次设置",
        "UiRouter": "shift",
        "Children": [],
        "Elements": null,
        "Icon": "shift"
      },
  
    ],
    "Elements": null,
    "Icon": "nursing"
  },
  
  {
    "Name": "数据平台",
    "UiRouter": "dataFrom",
    "Children": [
      {
        "Name": "接口列表",
        "UiRouter": "interfaceList",
        "Children": [],
        "Elements": null,
        "Icon": "interfaceList"
      },
      {
        "Name": "任务列表",
        "UiRouter": "dbSynch",
        "Children": [],
        "Elements": null,
        "Icon": "dbSynch"
      },
      {
        "Name": "胸痛中心",
        "UiRouter": "chestPain",
        "Children": [
          {
            "Name": "",
            "UiRouter": "cpBasic",
            "Children": [
              {
                "Name": "任务列表",
                "UiRouter": "dbSynch",
                "Children": [],
                "Elements": null,
                "Icon": "dbSynch"
              }
            ],
            "Elements": null,
            "Icon": "cpBasic"
          },
        ],
        "Elements": null,
        "Icon": "chestPain"
    },  
  // {
  //   "Name": "卒中中心",
  //   "UiRouter": "stroke",
  //   "Children": [],
  //   "Elements": null,
  //   "Icon": "stroke"
  // },
  // {
  //   "Name": "创伤中心",
  //   "UiRouter": "trauma",
  //   "Children": [],
  //   "Elements": null,
  //   "Icon": "trauma"
  // },
  // {
  //   "Name": "科室管理",
  //   "UiRouter": "department",
  //   "Children": [],
  //   "Elements": null,
  //   "Icon": "department"
  // },
  // {
  //   "Name": "质控管理",
  //   "UiRouter": "quality",
  //   "Children": [],
  //   "Elements": null,
  //   "Icon": "quality"
  // }
    {
      "Name": "质控设置",
      "UiRouter": "quality",
      "Children": [
        {
          "Name":"基础配置",
          "UiRouter": "basis",
          "Children": [],
          "Elements": null,
          "Icon": "basis"
        },
        {
          "Name":"指标管理",
          "UiRouter": "target",
          "Children": [],
          "Elements": null,
          "Icon": "target"
        }
      ],
      "Elements": null,
      "Icon": "quality"
    }
    ],
    "Elements": null,
    "Icon": "dataFrom"
  },
];
const getArr = (arr) => {
  let a = [];
  arr.map(item => {
    a.push(item.UiRouter);
    if (!!item.Children.length) {
      a.push(...getArr(item.Children))
    }
  })
  return a;
}
export const permissions=getArr(navData)