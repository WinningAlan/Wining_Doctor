(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2c205e56"],{2016:function(e,t,a){},"2e7f":function(e,t,a){"use strict";a.d(t,"b",function(){return l}),a.d(t,"e",function(){return r}),a.d(t,"q",function(){return o}),a.d(t,"d",function(){return s}),a.d(t,"v",function(){return c}),a.d(t,"g",function(){return u}),a.d(t,"o",function(){return d}),a.d(t,"n",function(){return h}),a.d(t,"f",function(){return p}),a.d(t,"m",function(){return f}),a.d(t,"p",function(){return v}),a.d(t,"l",function(){return m}),a.d(t,"i",function(){return x}),a.d(t,"t",function(){return y}),a.d(t,"r",function(){return g}),a.d(t,"w",function(){return w}),a.d(t,"j",function(){return C}),a.d(t,"k",function(){return b}),a.d(t,"h",function(){return k}),a.d(t,"s",function(){return _}),a.d(t,"u",function(){return N}),a.d(t,"c",function(){return T}),a.d(t,"a",function(){return S});var n=a("fccc"),i=a("46a9"),l=[{text:"过敏药物名称",value:"MedicineName"},{text:"皮试日期",value:"SkinTestTime",formatter:i["a"]},{text:"开始时间",value:"StartTime",formatter:i["a"]},{text:"结束时间",value:"EndTime",formatter:i["a"]},{text:"过敏类型",value:"AllergyTypeDesc"}],r=[{text:"过敏食物名称",value:"Name"},{text:"录入日期",value:"InputTime",formatter:i["a"]},{text:"开始日期",value:"StartTime",formatter:i["a"]},{text:"过敏类型",value:"AllergyTypeDesc"}],o=[{text:"过敏造影剂名称",value:"Name"},{text:"录入日期",value:"InputTime",formatter:i["a"]},{text:"开始日期",value:"StartTime",formatter:i["a"]},{text:"过敏类型",value:"AllergyTypeDesc"}],s=[{text:"其他过敏源名称",value:"Name"},{text:"录入日期",value:"InputTime",formatter:i["a"]},{text:"开始日期",value:"StartTime",formatter:i["a"]},{text:"过敏类型",value:"AllergyTypeDesc"}],c=[{text:"IDM",value:"IdmId"},{text:"药品名称",value:"MedicineName"},{text:"症状",value:"Symptom"},{text:"严重程度",value:"SeverityTypeDesc"},{text:"发生日期",value:"StartTime",formatter:i["a"]}],u=[{text:"过敏项目名称",value:"Name"},{text:"皮试日期",value:"SkinTestTime",formatter:i["a"]},{text:"开始日期",value:"StartTime",formatter:i["a"]},{text:"结束日期",value:"EndTime",formatter:i["a"]},{text:"过敏类别",value:"AllergyCategory"},{text:"过敏类型",value:"AllergyType"}],d=[{text:"时间",value:"time"},{text:"体温",value:"T"},{text:"哭声",value:"ku"},{text:"肤色",value:"fuse"},{text:"呼吸",value:"huxi"},{text:"反应",value:"fanyin"},{text:"呕吐",value:"ot"},{text:"脐带",value:"qd"},{text:"小便",value:"xb"},{text:"其他",value:"qt"},{text:"签名",value:"qm"}],h=[{text:"",value:"none"},{text:"Hoffmann",value:"Hoffmann"},{text:"Rossolimo",value:"Rossolimo"},{text:"Babinski",value:"Babinski"},{text:"Chaddock",value:"Chaddock"},{text:"髌阵挛",value:"b"},{text:"踝阵挛",value:"luo"}],p=[{text:"GCS评分",value:"grade"},{text:"睁眼反应",value:"eyes",width:"100px"},{width:"100px",text:"语言反应",value:"language"},{width:"100px",text:"运动反应",value:"sports"},{text:"总分",value:"allCount"}],f=[{width:"100px",text:"项目",value:"items"},{width:"150px",text:"参考值",value:"referenceValue"},{width:"150px",text:"测量值",value:"measuredValue"}],v=[{text:"体征记录",value:"Content",width:"450"},{text:"护士",value:"UpdateUserName"},{text:"记录时间",value:"UpdateTime",formatter:i["a"]}],m=[{text:"护理记录",value:"Content",width:"450"},{text:"护士",value:"护士签名"},{text:"记录时间",value:"Time"}],x=(i["a"],[{text:"报告号",value:"ReportNo"},{text:"检查项目",value:"ReportCategoryName"},{text:"检查结果",value:"Content",width:"250"},{text:"申请人",value:"ApplyName",maxWidth:"80px"},{text:"申请时间",value:"ApplyTime",width:"100",formatter:i["a"]}]),y=[{text:"报告号",value:"ReportNo"},{text:"检验项目",value:"ReportCategoryName"},{text:"标本",value:"Sample"},{text:"申请人",value:"ApplyName",width:"70"},{text:"申请时间",value:"ApplyTime",width:"100",formatter:i["a"]},{text:"危急值",value:"CrisisFlag",maxWidth:"70"}],g=[{text:"项目",value:"ItemName"},{text:"结果",value:"ItemValue"},{text:"提示",value:"Flag",formatter:function(e){return 1===e?"↓":2===e?"↑":""}},{text:"单位",value:"Unit"},{text:"参考范围",value:"Range",maxWidth:"100"},{text:"检测方法",value:"lookOver"},{text:"趋势图",value:"operation"}],w=[{text:"项目",value:"adviceName"},{text:"频次",value:"Frequency"}],C=[{text:"膳食项目",value:"adviceName"},{text:"频次",value:"Frequency"},{text:"剂量",value:"Unit"},{text:"单价",value:"Price",maxWidth:70,formatter:function(e){return(+e).toFixed(2)}}],b=[{text:"护理项目",value:"adviceName"},{text:"频次",value:"Frequency"},{text:"单价",value:"Price",maxWidth:70,formatter:function(e){return(+e).toFixed(2)}}],k=[{text:"检查项目",value:"adviceName"},{text:"是否是医保",value:"InsuranceUseFlag"},{text:"费用",value:"Price",formatter:function(e){return(+e).toFixed(2)}}],_=[{text:"检验项目",value:"adviceName"},{text:"标本",value:"SampleCode"},{text:"标本说明",value:"Attention",editType:"text"},{text:"是否是医保",value:"InsuranceUseFlag"},{text:"费用",value:"Price",maxWidth:70,formatter:function(e){return(+e).toFixed(2)}}],N=[{text:"治疗项目",value:"adviceName"},{text:"频次",value:"Frequency"},{text:"数量",value:"Unit"},{text:"单价",value:"Price",maxWidth:70,formatter:function(e){return(+e).toFixed(2)}}],T=[{text:"药品名称",value:"adviceName",width:180},{text:"剂量",value:"specimen",width:80},{text:"数量",value:"remarks",width:30},{text:"自备药",value:"IsSelfProvided",editType:"switch",width:30},{text:"皮试",value:"IsSkinTest",editType:"switch",width:30},{text:"审",value:"ReimbursementType",editType:"switch",width:30},{text:"单价",value:"Price",maxWidth:80,formatter:function(e){return(+e).toFixed(2)}},{text:"是否是医保",value:"InsuranceUseFlag",maxWidth:100},{text:"医保限制说明",value:"Memo",maxWidth:105}],S=[{text:"用血方式",value:"BloodWay",editType:"select",options:[{Text:"要求1",Value:1},{Text:"要求2",Value:2}]},{text:"用血要求",value:"Alias"},{text:"用量",value:"remarks"}];n["b"]},5657:function(e,t,a){"use strict";a.d(t,"b",function(){return l}),a.d(t,"a",function(){return r});a("0fb7"),a("450d");var n=a("f529"),i=a.n(n),l=function(e,t){if(!e)return!1;if(e="EDIS."+e,window.localStorage){var a=JSON.stringify(t);localStorage.setItem(e,a)}else i()({message:"该浏览器不支持localstorage",type:"error",center:!0})},r=function(e){if(!e)return!1;if(e="EDIS."+e,window.localStorage){var t=window.localStorage,a=JSON.parse(t.getItem(e));return a}return i()({message:"该浏览器不支持localstorage",type:"error",center:!0}),{}}},"6c00":function(e,t,a){},7913:function(e,t,a){"use strict";var n=a("6c00"),i=a.n(n);i.a},"80f2":function(e,t,a){"use strict";var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"start-request"},[a("div",{staticClass:"check-stoke"},[a("h3",[e._v(e._s(e.title))]),a("div",{staticClass:"warp"},e._l(e.usedCheckData,function(t,n){return a("div",{key:n,staticClass:"check-item cl"},[a("span",[e._v(e._s(t.CategoryName)+"：")]),a("div",{staticClass:"box"},e._l(t.Models,function(t,n){return a("el-button",{key:n,staticClass:"item",on:{click:function(a){e.selectData(t)}}},[e._v(e._s(t.ItemName))])}),1)])}),0),a("div",{staticClass:"more",on:{click:e.moreList}},[e.isStr?a("span",[e._v("\n        展开\n        "),a("svg-icon",{staticClass:"styleIcon",attrs:{iconClass:"zhankai"}})],1):a("span",[e._v("\n        收起\n        "),a("svg-icon",{staticClass:"styleIcon",attrs:{iconClass:"shouqi"}})],1)])])])},i=[],l={data:function(){return{isStr:!0}},props:{usedCheckData:{type:Array,default:function(){return[]}},callback:{type:Function,default:function(){}},title:{type:String,default:""}},methods:{moreList:function(){this.isStr=!this.isStr;var e=document.getElementsByClassName("check-stoke")[0],t=document.getElementsByClassName("warp")[0];this.isStr?(e.style.height="185px",t.style.height="110px",t.style.overflow="hidden",t.scrollTop=0):(e.style.height="300px",t.style.overflow="auto",t.style.height="230px")},selectData:function(e){this.callback(e)}}},r=l,o=(a("7913"),a("2877")),s=Object(o["a"])(r,n,i,!1,null,"9aa57162",null);t["a"]=s.exports},"85ea":function(e,t,a){"use strict";var n=a("2016"),i=a.n(n);i.a},d9d3:function(e,t,a){"use strict";var n=a("f4c9"),i=a.n(n);i.a},ea5b:function(e,t,a){"use strict";var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-table",e._g(e._b({staticClass:"tree-table",attrs:{data:e.tableData,"row-style":e.showRow,"show-header":!1,"use-virtual":"","excess-rows":8,"row-height":33,height:e.height},on:{"row-click":e.rowClick}},"el-table",e.$attrs,!1),e.$listeners),[a("el-table-column",{attrs:{"show-overflow-tooltip":""},scopedSlots:e._u([{key:"default",fn:function(t){return[t.row[e.defaultChildren]&&t.row[e.defaultChildren].length?[a("span",{style:{"padding-left":+t.row._level*e.indent+"px"}}),a("span",{directives:[{name:"show",rawName:"v-show",value:e.showSperadIcon(t.row),expression:"showSperadIcon(scope.row)"}],staticClass:"tree-ctrl",on:{click:function(a){a.stopPropagation(),e.toggleExpanded(t.row)}}},[e.isTree?e._e():[t.row._expand?a("i",{staticClass:"el-icon-caret-bottom"}):a("i",{staticClass:"el-icon-caret-right"})]],2)]:[a("el-checkbox",{key:t.row[e.majorKey],style:{"padding-left":+t.row._level*e.indent+"px"},on:{change:function(a){e.handleCheckAllChange(t.row,a)}},nativeOn:{click:function(e){e.stopPropagation()}},model:{value:t.row._select,callback:function(a){e.$set(t.row,"_select",a)},expression:"scope.row._select"}})],[e._v(" "+e._s(t.row.Name))]]}}])},[e._v(";\n  ")])],1)},i=[],l=(a("ac6a"),a("c5f6"),a("2b0e"));function r(e){for(var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"Children",a=[],n=e.length,i=0;i<n;i++){var o=e[i];if(l["default"].set(o,"_index",i),a.push(o),o[t]&&o[t].length>0){var s=r(o[t],t);a=a.concat(s)}}return a}function o(e){for(var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},a=t.parent,n=void 0===a?null:a,i=t.preIndex,r=void 0!==i&&i,s=t.level,c=void 0===s?0:s,u=t.expand,d=void 0!==u&&u,h=t.children,p=void 0===h?"children":h,f=t.show,v=void 0===f||f,m=t.select,x=void 0!==m&&m,y=e.length,g=0;g<y;g++){var w=e[g],C=(r?"".concat(r,"-").concat(g):g)+"";v=!n||d,l["default"].set(w,"_id",C),l["default"].set(w,"_level",c),l["default"].set(w,"_expand",d),l["default"].set(w,"_parent",n),l["default"].set(w,"_show",v),l["default"].set(w,"_select",x),w[p]&&w[p].length>0&&o(w[p],{parent:w,level:c+1,expand:d,preIndex:C,children:p,status:status,select:x})}}var s={name:"TreeTable",props:{data:{type:Array,required:!0,default:function(){return[]}},majorKey:{type:String,default:"Id"},columns:{type:Array,default:function(){return[]}},defaultExpandAll:{type:Boolean,default:!1},defaultChildren:{type:String,default:"Children"},indent:{type:Number,default:20},isTree:{type:Boolean,default:!1},selectCallback:{type:Function,default:function(){}}},data:function(){return{height:330}},created:function(){this.height=document.body.clientHeight-220},computed:{tableData:function(){if(this.isTree)return this.data;var e=this.data;if(0===this.data.length)return[];new Date;o(e,{expand:this.defaultExpandAll,children:this.defaultChildren});var t=r(e,this.defaultChildren);return t}},methods:{getData:function(){return this.tableData},showRow:function(e){var t=e.row,a=t._parent,n=!a||a._expand&&a._show;return n?"animation:treeTableShow 1s;cursor: pointer;":"cursor: pointer;"},showSperadIcon:function(e){return e[this.defaultChildren]&&e[this.defaultChildren].length>0},toggleExpanded:function(e){e._expand=!e._expand,this.tableData.forEach(function(e){var t=e._parent,a=!t||t._expand&&t._show;e._show=a})},handleCheckAllChange:function(e,t){e._select=t,this.selectCallback(t,e)},rowClick:function(e){e[this.defaultChildren]&&e[this.defaultChildren].length?this.toggleExpanded(e):this.handleCheckAllChange(e,!e._select)}}},c=s,u=(a("d9d3"),a("2877")),d=Object(u["a"])(c,n,i,!1,null,null,null);t["a"]=d.exports},f4c9:function(e,t,a){},fdda:function(e,t,a){"use strict";var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-tree",e._g(e._b({ref:e.type,staticClass:"medical-now-tree",class:{paragraph:"paragraph"===e.type},attrs:{data:e.treeData,props:e.defaultProps,"node-key":e.nodeKey,"highlight-current":e.isHig,"default-checked-keys":e.checkList},on:{"current-change":e.currentChange,"check-change":e.checkChange,"node-expand":e.nodeExpand,"node-click":e.leafClick,check:e.checkNode},scopedSlots:e._u([{key:"default",fn:function(t){var n=t.node,i=t.data;return a("span",{},["medicalHistoryNow"===e.type?a("el-tooltip",{attrs:{effect:"light","open-delay":400,placement:"right","popper-class":"paragraph-warp"}},[a("div",{staticClass:"span-ellipsis",attrs:{slot:"content"},slot:"content"},[e._v(e._s(n.label))]),a("div",{staticClass:"warp"},[a("p",{staticClass:"textEllipsis",class:{disabled:n.disabled}},[e._v("\n        "+e._s(n.label)+"\n      ")]),n.disabled?a("span",{staticClass:"icon"},[e._v("废")]):e._e()])]):"paragraph"===e.type?a("el-tooltip",{attrs:{effect:"light","open-delay":400,disabled:!!i.PersonalMedicalRecordSectionModels,placement:"right","popper-class":"paragraph-warp"}},[a("div",{staticStyle:{width:"230px","line-height":"22px",overflow:"auto","max-height":"80vh"},attrs:{slot:"content"},slot:"content"},[e._v(e._s(i.SectionContent))]),a("div",{class:i.PersonalMedicalRecordSectionModels?"":"paragraph-text"},[e._v(e._s(n.label))])]):"examine"===e.type||"checkout"===e.type||"package"===e.type?a("el-tooltip",{attrs:{effect:"light","open-delay":400,placement:"right","popper-class":"paragraph-warp"}},[a("div",{staticClass:"span-ellipsis",attrs:{slot:"content"},slot:"content"},[e._v(e._s(n.label))]),a("span",{class:[n.checked&&0==n.childNodes.length?"selectNode":""]},[e._v(e._s(n.label)+"\n    ")])]):"medicalHistoryOld"===e.type?a("p",[a("span",[e._v(e._s(n.label))]),i.MedicalRecordInfos?e._t("medicalHistoryOld",null,{scope:i}):e._e()],2):"templateAlter"===e.type?a("el-tooltip",{attrs:{effect:"light","open-delay":400,placement:"left",content:n.label}},[a("div",[e._v(e._s(n.label))])]):[e._v(e._s(n.label))]],2)}}])},"el-tree",e.$attrs,!1),e.$listeners))},i=[],l=a("53ca"),r=(a("7514"),a("c9b7")),o={name:"medicalNowTree",props:{treeData:{type:Array,required:!0},children:{type:String},callBack:{type:Function,default:function(){}},type:{type:String},nodeKey:{type:String,default:"Id"},isHig:{type:Boolean,default:!0},selectCallback:{type:Function,default:function(){}}},data:function(){return{checkList:[],ischeck:!0}},watch:{treeData:function(){var e=this;console.log("变化",this.activePrescription,this.treeData),this.$nextTick(function(){e.activePrescription&&e.getNode().setCurrentKey(e.activePrescription[e.nodeKey])})}},mounted:function(){console.log(this.treeData,"s树状列表展示")},computed:{defaultProps:function(){return"medicalHistoryOld"===this.type?{children:"MedicalRecordInfos",label:function(e,t){return e.MedicalRecordInfos?"".concat(Object(r["a"])("yyyy/MM/dd",new Date(e.InHospTime))," ").concat(e.DepartmentName?e.DepartmentName:""):Object(r["a"])("MM/dd HH:mm",new Date(e.CreateTime))+" "+e.TemplateName}}:"medicalHistoryNow"===this.type?{children:"MedicalRecordInfos",label:function(e,t){return e.MedicalRecordInfos?e.AreaName:Object(r["a"])("MM/dd HH:mm",new Date(e.CreateTime))+" "+e.TemplateName},disabled:function(e,t){return!e.MedicalRecordInfos&&3===e.Status}}:"paragraph"===this.type?{children:"PersonalMedicalRecordSectionModels",label:"Name"}:"prescription"===this.type?{children:"MenuContentList",label:function(e,t){return e.MenuContentList?e.Describe:Object(r["a"])("MM/dd HH:mm",new Date(e.PrescriptionCreateTime))+" "+e.PrescriptionTypeName+" "+e.PrescriptionStatusName}}:"templateAlter"===this.type?{children:"MedList",label:function(e){return e.MedList?e.CategoryName:e.TemplateName}}:"orderPackage"===this.type||"package"===this.type?(console.log("treeData",this.treeData),{children:"detailInfoList",label:"Name"}):"historyDoctorAdvice"===this.type?{children:"children",label:"label"}:"examine"===this.type||"checkout"===this.type?(console.log(1111),{children:"ChildCategory",label:"Name"}):"treatmentSingle"===this.type?{children:"Content",label:function(e,t){if(console.log(new Date(e.InHouseTime),e.InHouseTime,9999999999),e.Content){var a=e.OutHospTime?Object(r["a"])("yyyy/MM/dd",new Date(e.OutHospTime)):"至今";return Object(r["a"])("yyyy/MM/dd",new Date(e.InHouseTime))+" - "+a}return Object(r["a"])("MM/dd HH:mm",new Date(e.OrderTime))+" 治疗单 "+e.PrescriptionStatusName}}:{children:"List",label:"Name"}}},methods:{nodeExpand:function(e,t,a){console.log(e,t,a)},checkNode:function(e,t){if(console.log(e,"复选框选中节点",t),"package"!==this.type||!e.detailInfoList){var a=e.Id,n=t.checkedNodes.find(function(e){return e.Id==a});console.log(n),n?this.selectNode(!0,{data:e}):this.selectNode(!1,{data:e})}},leafClick:function(e,t){console.log(e,"选中叶子节点",t,this.children),"package"===this.type&&e.detailInfoList||this.selectNode(t.checked,t)},getNode:function(){return this.$refs[this.type]},checkChange:function(){this.checkList=this.getNode().getCheckedKeys(!0)},currentChange:function(e,t){if(console.log(e,t,"当前选中节点变化时触发的事件",this.type,this.activePrescription),e[this.children]&&0!=e[this.children].length)this.getNode().setCurrentNode(t),this.activePrescription&&this.getNode().setCurrentKey(this.activePrescription[this.nodeKey]);else{var a="object"===Object(l["a"])(t)?t.parent.key:t;(this.activePrescription&&this.activePrescription[this.nodeKey]!==e[this.nodeKey]||!this.activePrescription||"paragraph"===this.type)&&this.callBack(e,this.type,a),this.activePrescription=e}},selectNode:function(e,t){this.selectCallback(e,t.data)}}},s=o,c=(a("85ea"),a("2877")),u=Object(c["a"])(s,n,i,!1,null,null,null);t["a"]=u.exports}}]);