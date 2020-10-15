(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-a348dcd4"],{"00e6":function(t,e,a){},"27f5":function(t,e,a){"use strict";var o=a("00e6"),i=a.n(o);i.a},"2db7":function(t,e,a){},3370:function(t,e,a){"use strict";var o=a("2db7"),i=a.n(o);i.a},3450:function(t,e,a){"use strict";var o=a("7105"),i=a.n(o);i.a},3768:function(t,e,a){},"53f1":function(t,e,a){"use strict";var o=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("el-form",{ref:"ruleForm",staticClass:"doctor-advice-form demo-ruleForm",class:{borderStyle:t.isBorder},attrs:{model:t.ruleForm,rules:t.rules,"label-width":"130px"}},[a("el-form-item",{staticClass:"all",attrs:{label:"会诊类别",prop:"TypeCode"}},[a("el-select",{attrs:{placeholder:"请选择","automatic-dropdown":""},on:{change:t.selectConType},model:{value:t.ruleForm.TypeCode,callback:function(e){t.$set(t.ruleForm,"TypeCode",e)},expression:"ruleForm.TypeCode"}},t._l(t.typeData,function(t){return a("el-option",{key:t.key,attrs:{label:t.Value,value:t.Key}})}),1)],1),a("el-form-item",{staticClass:"all",attrs:{label:"会诊项目",prop:"DictItemCode"}},[a("el-select",{attrs:{placeholder:"请选择","automatic-dropdown":""},on:{change:t.selectConFee},model:{value:t.ruleForm.DictItemCode,callback:function(e){t.$set(t.ruleForm,"DictItemCode",e)},expression:"ruleForm.DictItemCode"}},t._l(t.itemFeeList,function(e){return a("el-option",{key:e.Id,attrs:{label:e.ItemName,value:e.ItemCode}},[a("span",{staticStyle:{float:"left"}},[t._v(t._s(e.ItemName))]),a("span",{staticStyle:{float:"right",color:"#8492a6","font-size":"13px"}},[t._v(t._s((+e.Price).toFixed(2))+"/"+t._s(e.Unit))])])}),1)],1),3==t.ruleForm.TypeCode?a("el-form-item",{staticClass:"all",attrs:{label:"拟邀会诊医疗机构",prop:"HospitalCode"}},[a("el-select",{attrs:{placeholder:"请选择","automatic-dropdown":""},model:{value:t.ruleForm.HospitalCode,callback:function(e){t.$set(t.ruleForm,"HospitalCode",e)},expression:"ruleForm.HospitalCode"}},t._l(t.allHospital,function(t){return a("el-option",{key:t.Key,attrs:{label:t.Value,value:t.Key}})}),1)],1):t._e(),a("el-form-item",{staticClass:"all",attrs:{label:"拟邀科室",prop:"ConsultationDetails"}},[a("el-select",{ref:"department",attrs:{multiple:"",placeholder:"请选择",filterable:"",remote:"","remote-method":t.depRemoteMethod},on:{focus:t.depFocus},model:{value:t.ruleForm.ConsultationDetails,callback:function(e){t.$set(t.ruleForm,"ConsultationDetails",e)},expression:"ruleForm.ConsultationDetails"}},t._l(t.allDepartment,function(t){return a("el-option",{key:t.Code,attrs:{label:t.Name,value:t.Code}})}),1)],1),a("el-form-item",{staticClass:"all",attrs:{label:"会诊目的",prop:"Target"}},[a("el-select",{attrs:{filterable:"","allow-create":"","default-first-option":"",placeholder:"请选择"},on:{change:t.selectTarget},model:{value:t.ruleForm.Target,callback:function(e){t.$set(t.ruleForm,"Target",e)},expression:"ruleForm.Target"}},t._l(t.targetData,function(t){return a("el-option",{key:t.Key,attrs:{label:t.Value,value:t.Value}})}),1)],1),a("el-form-item",{attrs:{label:"会诊时间",prop:"StartDate"}},[a("el-date-picker",{attrs:{clearable:!1,"picker-options":t.pickerOptions,type:"datetime",format:"yyyy-MM-dd HH:mm","value-format":"yyyy-MM-dd HH:mm",placeholder:"选择日期时间","default-time":"12:00"},on:{change:t.changeTime},model:{value:t.ruleForm.StartDate,callback:function(e){t.$set(t.ruleForm,"StartDate",e)},expression:"ruleForm.StartDate"}})],1),a("el-form-item",{attrs:{label:"会诊地点",prop:"LocationCode"}},[a("el-select",{attrs:{placeholder:"请选择","automatic-dropdown":""},model:{value:t.ruleForm.LocationCode,callback:function(e){t.$set(t.ruleForm,"LocationCode",e)},expression:"ruleForm.LocationCode"}},t._l(t.siteData,function(t){return a("el-option",{key:t.Key,attrs:{label:t.Value,value:t.Key}})}),1)],1),a("el-form-item",{attrs:{label:"会诊费用",prop:"Fee"}},[a("p",[t._v(t._s(t.feeNow))])]),a("el-form-item",{attrs:{label:"会诊联系人",prop:"ContactName"}},[a("el-select",{attrs:{"default-first-option":"",filterable:"",remote:"","value-key":"DoctorId",placeholder:"请输入姓名","remote-method":t.remoteMethod},on:{change:t.getDoctor,focus:t.focus},model:{value:t.ruleForm.ContactName,callback:function(e){t.$set(t.ruleForm,"ContactName",e)},expression:"ruleForm.ContactName"}},t._l(t.doctorList,function(t,e){return a("el-option",{key:t.DoctorId,attrs:{label:t.DoctorName,value:t}})}),1)],1),a("el-form-item",{attrs:{label:"联系电话",prop:"ContactPhone"}},[a("el-input",{attrs:{placeholder:"请输入联系电话"},model:{value:t.ruleForm.ContactPhone,callback:function(e){t.$set(t.ruleForm,"ContactPhone",e)},expression:"ruleForm.ContactPhone"}})],1),t._t("default",null,{submitForm:t.submitForm})],2)},i=[],n=(a("7514"),a("be94")),s=(a("ac6a"),a("ade3")),l=a("2f62"),r=a("c9b7"),c=(a("5d2d"),{data:function(){return{pickerOptions:{disabledDate:function(t){return t.getTime()<+new Date(Object(r["a"])("yyyy/MM/dd",new Date)+" 00:00:00")}},ruleForm:{InHouseId:"",TypeCode:"",Target:"",TargetCode:"",StartDate:"",LocationCode:"",HospitalCode:"",Fee:0,ConsultationDetails:[],ContactName:"",ContactPhone:"",ContactId:"",DictItemCode:"",ConsultationId:"00000000-0000-0000-0000-000000000000"},rules:Object(s["a"])({DictItemCode:[{required:!0,message:"请选择会诊项目",trigger:"change"}],TypeCode:[{required:!0,message:"请选择会诊类别",trigger:"change"}],Target:[{required:!0,message:"请选择会诊目的",trigger:"change"}],StartDate:[{required:!0,message:"请选择日期",trigger:"change"}],ConsultationDetails:[{required:!0,message:"请选择拟邀科室",trigger:"change"}],LocationCode:[{required:!0,message:"请选择会诊地点",trigger:"change"}]},"DictItemCode",[{required:!0,message:"请选择会诊项目",trigger:"change"}]),siteData:[],typeData:[],targetData:[],allHospital:[],allDepartment:[],nowTime:"",options:[],doctorList:[],itemFeeList:[]}},created:function(){var t=this;console.log("this.user",this.user),this.isVerification||(this.rules={ConsultationDetails:[{required:!0,message:"请选择拟邀科室",trigger:"change"}]}),this.nowTime=this.ruleForm.StartDate=this.ruleForm.StartDate?this.ruleForm.StartDate:Object(r["a"])("yyyy/MM/dd HH:mm",new Date(+new Date+6e5)),this.pickerOptions.disabledDate=function(e){return e.getTime()<+new Date(Object(r["a"])("yyyy/MM/dd",new Date(t.patientMsg.InHospTime))+" 00:00:00")},this.getDictionaries(),this.ruleForm.ContactName&&this.ruleForm.ContactId||(this.ruleForm.ContactName=this.user.UserInfo.Name,this.ruleForm.ContactId=this.user.UserInfo.Id),this.ruleForm.ContactPhone||(this.ruleForm.ContactPhone=this.user.UserInfo.Telphone),this.getFeeByTypeCodeList(),this.depRemoteMethod()},methods:{depFocus:function(){this.depRemoteMethod()},depRemoteMethod:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;this.$Api.getConAllDepartment({KeyWords:""==e?null:e}).then(function(e){e.Status&&(t.allDepartment=e.Data||[])})},selectConFee:function(t){var e=this;this.itemFeeList.forEach(function(a){a.ItemCode===t&&(e.ruleForm.TypeCode=a.ConsultationTypeCode)})},getFeeByTypeCodeList:function(t){var e=this;this.$Api.getFeeByTypeCodeList({typeCode:t||null}).then(function(a){a.Status&&(e.itemFeeList=a.Data||[],t&&(e.ruleForm.DictItemCode=e.itemFeeList[0]?e.itemFeeList[0].ItemCode:""),e.isAdvice&&e.ruleForm.DictItemCode&&(console.log("qqqqqqq"),e.selectConFee(e.ruleForm.DictItemCode)))})},submitForm:function(){var t=this;return new Promise(function(e,a){t.$refs.ruleForm.validate(function(a,o){if(console.log(a),a){var i=Object(n["a"])({},t.ruleForm);i.InHouseId=t.$route.query.id||"00000000-0000-0000-0000-000000000000",e(i)}else e(!1),console.log("error submit!!")})})},resetForm:function(t){this.$refs.ruleForm.resetFields()},getDictionaries:function(){var t=this;this.$Api.getConSite({isJudgeEnable:!0}).then(function(e){e.Status&&(t.siteData=e.Data||[],t.ruleForm.LocationCode=t.ruleForm.LocationCode?t.ruleForm.LocationCode:t.siteData[0].Key)}),this.$Api.getConType({}).then(function(e){e.Status&&(console.log(e,"data"),t.typeData=e.Data||[])}),this.$Api.getConTarget({}).then(function(e){e.Status&&(t.targetData=e.Data||[])}),this.$Api.getConAllHospital().then(function(e){e.Status&&(t.allHospital=e.Data||[])})},changeTime:function(t){+new Date(t)<+new Date(this.patientMsg.InHospTime)&&(this.$msg.info("开始时间不允许早于患者入科时间！"),this.ruleForm.StartDate=Object(r["a"])("yyyy/MM/dd HH:mm",new Date(this.patientMsg.InHospTime)))},selectTarget:function(t){var e=this;t&&this.targetData.forEach(function(a){a.Value==t&&(e.ruleForm.TargetCode=a.Key)})},remoteMethod:function(t){console.log(t),this.getDoctorName(t)},getDoctor:function(t){console.log("val",t),t&&(this.ruleForm.ContactName=t.DoctorName,this.ruleForm.ContactId=t.DoctorId),console.log(this.ruleForm)},focus:function(){this.getDoctorName("")},getDoctorName:function(t){var e=this;this.$Api.searchUser({InHouseId:this.$route.query.id,DoctorName:t}).then(function(t){console.log("res",t),t.Status&&(e.doctorList=t.Data||[])})},selectConType:function(t){this.ruleForm.DictItemCode="",this.getFeeByTypeCodeList(t)}},watch:{commonObj:{handler:function(t,e){for(var a in t)this.ruleForm.hasOwnProperty(a)&&(this.ruleForm[a]=t[a])},immediate:!0,deep:!0}},props:{commonObj:{type:Object,default:function(){return{}}},isBorder:{type:Boolean,default:!0},isVerification:{type:Boolean,default:!0},isAdvice:{type:Boolean,default:!1}},computed:Object(n["a"])({},Object(l["b"])({user:"public/GET_USER",patientMsg:"public/GET_PATIENTMSG",selectArea:"home/GET_SELECTAREA"}),{feeNow:function(){var t=this,e=this.itemFeeList.find(function(e){if(e.ItemCode===t.ruleForm.DictItemCode)return e});if(e)return 1==e.BillingMethod?(this.ruleForm.Fee=(this.ruleForm.ConsultationDetails.length*e.Price).toFixed(2),(this.ruleForm.ConsultationDetails.length*e.Price).toFixed(2)):(this.ruleForm.Fee=e.Price.toFixed(2),e.Price.toFixed(2))}})}),u=c,d=(a("a267"),a("2877")),p=Object(d["a"])(u,o,i,!1,null,"4ddff52a",null);e["a"]=p.exports},"66d5":function(t,e,a){"use strict";var o=a("de19"),i=a.n(o);i.a},6763:function(t,e,a){},7105:function(t,e,a){},a267:function(t,e,a){"use strict";var o=a("3768"),i=a.n(o);i.a},b4b3:function(t,e,a){},b7b2:function(t,e,a){"use strict";a.r(e);var o,i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"consultation"},[a("div",{staticClass:"tabs-temp"},[a("el-radio-group",{attrs:{fill:"#0071e7"},on:{change:t.tapsExamine},model:{value:t.nowTemp,callback:function(e){t.nowTemp=e},expression:"nowTemp"}},t._l(t.tabsTemp,function(e,o){return e.Show?a("el-radio-button",{key:o,attrs:{label:e.Value}},[t._v(t._s(e.Text))]):t._e()}),1),a("div",{directives:[{name:"show",rawName:"v-show",value:1!==t.nowTemp,expression:"nowTemp!==1"}],staticClass:"three"},[a("a",{attrs:{href:t.clienHref,target:"_blank"}},[t._v("受邀会诊")])])],1),1===t.nowTemp?a("div",{staticClass:"new-create"},[a("newCreate",{ref:"newCreate",attrs:{commonObj:t.commonObj,isBorder:!1},scopedSlots:t._u([{key:"default",fn:function(e){var o=e.submitForm;return[a("div",{staticClass:"btn"},[a("el-button",{staticClass:"reset",on:{click:t.reset}},[t._v("取消")]),a("el-button",{staticClass:"save",attrs:{type:"primary"},on:{click:function(e){t.save(o)}}},[t._v("保存")])],1)]}}])})],1):t._e(),2===t.nowTemp?a("div",{staticClass:"his-con"},[a("div",{staticClass:"his-left"},t._l(t.conHisList,function(e,o){return a("div",{key:o,staticClass:"his-item",class:{active:t.hisSelectId==e.InHouseId},on:{click:function(a){t.selectId(e)}}},[a("p",[t._v(t._s(t._f("timeFilter")(e.InHospTime)))]),a("p",[t._v(t._s(e.DepartmentName)+t._s(e.DepartmentTypeName))])])}),0),a("div",{staticClass:"his-right"},[a("conTable",{attrs:{tableData:t.tableData,callback:t.callbackTable}})],1)]):t._e(),a("my-alert",{attrs:{visible:t.isShow,title:t.alterData[t.nowAlter].title,callback:t.alterCallback,isfooter:t.alterData[t.nowAlter].isfooter,width:t.alterData[t.nowAlter].width}},[a(t.nowAlter,{tag:"component",attrs:{detailData:t.deatilData,changData:t.signInData,gradeData:t.gradeData,feedBackData:t.feedBackData}}),"conDeatil"==t.nowAlter&&t.isDeatilFoot&&8!=t.patientMsg.Status?a("div",{staticClass:"btnList"},[a("el-button",{staticClass:"save",on:{click:t.submitData}},[t._v("提交")]),a("el-button",{staticClass:"reset-list",on:{click:t.upData}},[t._v("修改")])],1):t._e(),"signIn"==t.nowAlter?a("div",{staticClass:"btnList"},[a("el-button",{staticClass:"sigInBtn",on:{click:t.sendSignIn}},[t._v("确定签到")])],1):t._e()],1)],1)},n=[],s=a("ade3"),l=(a("ac6a"),a("be94")),r=(a("96cf"),a("1da1")),c=a("53f1"),u=a("98ad"),d=function(t,e){var a=e._c;return a("div",{staticClass:"detail"},[a("div",{staticClass:"content"},[a("div",{staticClass:"type cl"},[a("span",{staticClass:"title"},[e._v("会诊类别")]),a("p",[e._v(e._s(e.props.detailData.TypeName))])]),a("div",{staticClass:"type cl"},[a("span",{staticClass:"title"},[e._v("会诊项目")]),a("p",[e._v(e._s(e.props.detailData.DictItemName))])]),e.props.detailData.HospitalName?a("div",{staticClass:"type cl"},[a("span",{staticClass:"title"},[e._v("医疗机构")]),a("p",[e._v(e._s(e.props.detailData.HospitalName))])]):e._e(),a("div",{staticClass:"type cl"},[a("span",{staticClass:"title"},[e._v("拟邀科室")]),a("p",[e._v(e._s(e.props.detailData.DepartmentNames))])]),a("div",{staticClass:"type cl"},[a("span",{staticClass:"title"},[e._v("会诊地点")]),a("p",[e._v(e._s(e.props.detailData.LocationName))])]),a("div",{staticClass:"type cl"},[a("span",{staticClass:"title"},[e._v("会诊费用")]),a("p",[e._v(e._s((+e.props.detailData.Fee).toFixed(2)))])]),a("div",{staticClass:"type cl"},[a("span",{staticClass:"title"},[e._v("会诊目的")]),a("p",[e._v(e._s(e.props.detailData.Target))])]),a("div",{staticClass:"type cl"},[a("span",{staticClass:"title"},[e._v("会诊时间")]),a("p",[e._v(e._s(e._f("timeFilter")(e.props.detailData.StartDate)))])]),a("div",{staticClass:"type cl"},[a("span",{staticClass:"title"},[e._v("会诊联系人")]),a("p",[e._v(e._s(e.props.detailData.ContactName))])]),a("div",{staticClass:"type cl"},[a("span",{staticClass:"title"},[e._v("联系电话")]),a("p",[e._v(e._s(e.props.detailData.ContactPhone))])])])])},p=[],m=(a("27f5"),a("2877")),h={},f=Object(m["a"])(h,d,p,!0,null,"ef708b5c",null),g=f.exports,D=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("el-table",{staticClass:"clinic-table",attrs:{data:t.tableData,height:"90%"},on:{"row-click":t.handleRow}},[a("el-table-column",{attrs:{prop:"TypeName",label:"会诊类型","min-width":"100"}}),a("el-table-column",{attrs:{prop:"ConsultationDetails",label:"状态","min-width":"80"},scopedSlots:t._u([{key:"default",fn:function(e){return t._l(e.row.ConsultationDetails,function(e,o){return a("p",{key:o,staticClass:"child-item",class:"status"+e.InvitingStatus},[t._v(t._s(e.InvitingStatusName))])})}}])}),a("el-table-column",{attrs:{prop:"HospitalName",label:"受邀会诊医疗机构","min-width":"140"}}),a("el-table-column",{attrs:{prop:"DepartmentName",label:"受邀科室","min-width":"130"},scopedSlots:t._u([{key:"default",fn:function(e){return t._l(e.row.ConsultationDetails,function(e,o){return a("p",{key:o,staticClass:"child-item",staticStyle:{"text-align":"left"}},[t._v(t._s(e.DepartmentName))])})}}])}),a("el-table-column",{attrs:{prop:"DoctorName",label:"会诊医生","min-width":"90"},scopedSlots:t._u([{key:"default",fn:function(e){return t._l(e.row.ConsultationDetails,function(e,o){return a("p",{key:o,staticClass:"child-item",staticStyle:{"text-align":"left"}},[t._v(t._s(e.DoctorName))])})}}])}),a("el-table-column",{attrs:{prop:"CheckInDate",label:"会诊签到时间","min-width":"140"},scopedSlots:t._u([{key:"default",fn:function(e){return t._l(e.row.ConsultationDetails,function(e,o){return a("p",{key:o,staticClass:"child-item",staticStyle:{"text-align":"left"}},[t._v(t._s(t._f("timeFilter")(e.CheckInDate)))])})}}])}),a("el-table-column",{attrs:{prop:"StartDate",label:"拟会诊时间","min-width":"140"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(t._f("timeFilter")(e.row.StartDate)))])]}}])}),a("el-table-column",{attrs:{prop:"ApplyName",label:"申请医师","min-width":"80"}}),a("el-table-column",{attrs:{prop:"ContactName",label:"会诊联系人","min-width":"90"}}),a("el-table-column",{attrs:{prop:"ContactPhone",label:"联系电话","min-width":"90"}}),a("el-table-column",{attrs:{prop:"address",label:"会诊记录","min-width":"80"},scopedSlots:t._u([{key:"default",fn:function(e){return t._l(e.row.ConsultationDetails,function(e,o){return a("p",{key:o,staticClass:"lookHis",on:{click:function(a){a.stopPropagation(),e.IsFeedBack&&t.lookData(e,"look")}}},[t._v(t._s(e.IsFeedBack?"查看":""))])})}}])}),a("el-table-column",{attrs:{label:"操作",width:"80",fixed:"right"},scopedSlots:t._u([{key:"default",fn:function(e){return[8==t.patientMsg.Status?a("div",{staticClass:"list warp"},[a("el-tooltip",{attrs:{effect:"dark",content:"打印",placement:"top-start"}},[a("svg-icon",{staticClass:"styleIcon",attrs:{iconClass:"printlist"},on:{click:function(a){a.stopPropagation(),t.print(e.row,"print")}}})],1)],1):a("div",[8!=e.row.Status||9!=e.row.Status?a("div",{staticClass:"warp"},[a("el-popover",{staticStyle:{padding:"0"},attrs:{placement:"bottom",trigger:"hover","popper-class":"edit-more"}},[2==e.row.Status||3==e.row.Status||4==e.row.Status||5==e.row.Status?a("p",{on:{click:function(a){a.stopPropagation(),t.signIn(e.row,"signIn")}}},[t._v("签到")]):t._e(),2==e.row.Status||3==e.row.Status||4==e.row.Status?a("p",{on:{click:function(a){a.stopPropagation(),t.cancel(e.row,"cancel")}}},[t._v("取消")]):t._e(),6==e.row.Status?a("p",{on:{click:function(a){a.stopPropagation(),t.end(e.row,"end")}}},[t._v("结束")]):t._e(),7==e.row.Status?a("p",{on:{click:function(a){a.stopPropagation(),t.evaluate(e.row,"evaluate")}}},[t._v("评价")]):t._e(),2==e.row.Status||3==e.row.Status||4==e.row.Status||7==e.row.Status||6==e.row.Status?a("p",{on:{click:function(a){a.stopPropagation(),t.print(e.row,"print")}}},[t._v("打印")]):t._e(),1==e.row.Status?a("p",{on:{click:function(a){a.stopPropagation(),t.edit(e.row,"edit")}}},[t._v("编辑")]):t._e(),1==e.row.Status?a("p",{on:{click:function(a){a.stopPropagation(),t.del(e.row,"del")}}},[t._v("删除")]):t._e(),a("span",{staticClass:"more",attrs:{slot:"reference"},slot:"reference"},[t._v("...")])])],1):t._e()])]}}])})],1)},C=[],b=a("2f62"),I={props:{tableData:{type:Array,default:function(){return[]}},callback:{type:Function,default:function(){}}},computed:Object(l["a"])({},Object(b["b"])({patientMsg:"public/GET_PATIENTMSG"})),methods:{handleRow:function(t){this.callback(t,"row")},signIn:function(t,e){this.callback(t,e)},cancel:function(t,e){this.callback(t,e)},end:function(t,e){this.callback(t,e)},evaluate:function(t,e){this.callback(t,e)},print:function(t,e){this.callback(t,e)},edit:function(t,e){this.callback(t,e)},del:function(t,e){this.callback(t,e)},lookData:function(t,e){this.callback(t,e)}}},v=I,S=(a("3450"),Object(m["a"])(v,D,C,!1,null,null,null)),_=S.exports,w=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"sign-in cl"},t._l(t.changData,function(e,o){return a("div",{key:o,staticClass:"item cl"},[a("span",{staticClass:"item-title"},[t._v(t._s(e.DepartmentName))]),a("el-select",{attrs:{"default-first-option":"",filterable:"",remote:"","value-key":"Id",placeholder:"请输入姓名或者工号","remote-method":function(a){return t.remoteMethod(a,e,o)}},on:{change:function(a){t.getDoctor(a,e)},focus:function(a){t.focus(e,o,a)}},model:{value:e.DoctorName,callback:function(a){t.$set(e,"DoctorName",a)},expression:"item.DoctorName"}},t._l(t.options[o],function(t){return a("el-option",{key:t.DoctorId,attrs:{label:t.DoctorName,value:t.DoctorId}})}),1)],1)}),0)},y=[],T=a("2909"),F={props:{changData:{type:Array,default:function(){return[]}}},data:function(){return{options:[]}},methods:{getDoctor:function(t,e){console.log(t,e,"getDoctor"),t&&(e.DoctorId=t)},remoteMethod:function(t,e,a){this.getDoctorName(e,t,a)},focus:function(t,e,a){this.getDoctorName(t,"",e)},getDoctorName:function(t,e,a){var o=this;this.$Api.searchUser({InHouseId:this.$route.query.id,DepartmentCode:t.DepartmentCode,DoctorName:e}).then(function(t){t.Status&&(o.options[a]=t.Data,console.log(o.options),o.options=Object(T["a"])(o.options))})}}},k=F,O=(a("bf95"),Object(m["a"])(k,w,y,!1,null,"f5e15b0c",null)),H=O.exports,$=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"con-grand"},t._l(t.gradeData,function(e,o){return a("div",{key:o,staticClass:"warp"},[a("h3",[t._v(t._s(e.DepartmentName))]),a("div",{staticClass:"grand cl"},[a("span",{staticClass:"title"},[t._v("评分")]),a("el-rate",{attrs:{"show-text":""},model:{value:e.EvaluationGrade,callback:function(a){t.$set(e,"EvaluationGrade",a)},expression:"item.EvaluationGrade"}})],1),a("div",{staticClass:"grop cl"},[a("span",{staticClass:"title"},[t._v("评论")]),a("el-input",{attrs:{type:"textarea",placeholder:"请输入内容"},model:{value:e.EvaluationDesc,callback:function(a){t.$set(e,"EvaluationDesc",a)},expression:"item.EvaluationDesc"}})],1)])}),0)},N=[],A={data:function(){return{}},props:{gradeData:{type:Array,default:function(){return[]}}}},E=A,M=(a("b8f3"),Object(m["a"])(E,$,N,!1,null,"7300ad8a",null)),x=M.exports,L=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"feed-back"},[a("div",{staticClass:"title"},[t._v("反馈内容:")]),a("div",{staticClass:"content"},[t._v(t._s(t.feedBackData.FeedBack))])])},j=[],P={props:{feedBackData:{type:Object,default:function(){return{}}}}},G=P,R=(a("66d5"),Object(m["a"])(G,L,j,!1,null,"9e3be426",null)),B=R.exports,U=a("5d2d"),q=a("d634"),W=a("3943"),V={InHouseId:"",TypeCode:"",Target:"",TargetCode:"",StartDate:"",LocationCode:"",HospitalCode:"",Fee:0,ConsultationDetails:[],DictItemCode:"",ContactName:Object(U["c"])("user").UserInfo.Name,ContactPhone:Object(U["c"])("user").UserInfo.Telphone};console.log("user",Object(U["c"])("user"));var K={name:"consultation",data:function(){return{nowTemp:1,tabsTemp:[{Text:"新建会诊",Value:1,Show:!0},{Text:"会诊记录",Value:2,Show:!0}],commonObj:{},alterData:{conDeatil:{width:"500px",title:"会诊单详情",isfooter:!1},signIn:{width:"400px",title:"签到",isfooter:!1},conGrade:{width:"800px",title:"评价",isfooter:!0},feedBack:{width:"400px",title:"查看反馈",isfooter:!1}},deatilData:{},nowAlter:"conDeatil",tableData:[],hisSelectId:"",consultationId:"",conHisList:[],isDeatilFoot:!0,signInData:[],gradeData:[],feedBackData:{},clienHref:"",timer:null,caSignOperation:{},currentObjData:""}},watch:{"patientMsg.Status":{handler:function(t){var e=this;8==t?(this.tabsTemp[0].Show=!1,this.nowTemp=2,this.$Api.getConHisList({PatientId:this.patientMsg.PatientId}).then(function(t){t.Status&&(e.conHisList=t.Data||[],console.log(t),e.conHisList[0]&&(e.hisSelectId=e.conHisList[0].InHouseId,e.getConHisDetails(e.conHisList[0].InHouseId)))})):(this.tabsTemp[0].Show=!0,this.nowTemp=1)},deep:!0,immediate:!0},isGetCA:function(t){t&&this.currentObjData.Data&&"会诊申请"==this.currentObjData.Data[0].Name&&this.caSignOperation.checkData(this.user.UserInfo,this.currentObjData)}},mounted:function(){this.getFeeByTypeCodeList(),this.clienHref=window.URLCONFIG.Consultation,this.isSignName&&(this.caSignOperation=new W["a"](this,this.signName))},methods:{tapsExamine:function(t){var e=this;console.log(t),1==t?this.isDeatilFoot=!0:(this.commonObj=V,this.$Api.getConHisList({PatientId:this.patientMsg.PatientId}).then(function(t){t.Status&&(e.conHisList=t.Data||[],console.log(t),e.conHisList[0]&&(e.hisSelectId=e.conHisList[0].InHouseId,e.getConHisDetails(e.conHisList[0].InHouseId)))}))},reset:function(){this.$refs.newCreate.resetForm(),this.commonObj=V},save:function(){var t=Object(r["a"])(regeneratorRuntime.mark(function t(e){var a,o,i,n=this;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e();case 2:a=t.sent,o=Object(l["a"])({},a),a&&(i=[],o.ConsultationDetails.forEach(function(t){i.push({DepartmentCode:t})}),o.ConsultationDetails=i,this.$Api.addConsultation(o).then(function(t){n.$msg[t.Status?"success":"warning"](t.Message),t.Status&&(n.consultationId=t.Data,n.getOneDeatil(n.consultationId))}));case 5:case"end":return t.stop()}},t,this)}));function e(e){return t.apply(this,arguments)}return e}(),alterCallback:function(t){var e=this;if(t){if("conDeatil"==this.nowAlter)console.log(this.nowTemp),1==this.nowTemp&&this.upData(),this.$store.commit("public/SET_ISSHOW",!1);else if("conGrade"==this.nowAlter){var a={ConsultationId:this.consultationId,EvaluationDetails:this.gradeData};this.$Api.evaluateCon(a).then(function(t){e.$msg[t.Status?"success":"warning"](t.Message),console.log(t),t.Status&&(e.getConHisDetails(e.hisSelectId),e.$store.commit("public/SET_ISSHOW",!1))})}}else"conDeatil"==this.nowAlter&&(console.log(this.nowTemp),1==this.nowTemp&&this.upData(),this.$store.commit("public/SET_ISSHOW",!1)),this.$store.commit("public/SET_ISSHOW",!1)},getOneDeatil:function(t){var e=this;this.$Api.getConsultationInfo({ConsultationId:t}).then(function(t){var a=t.Data||{};console.log(e.itemFeeList),e.itemFeeList.forEach(function(t){t.ItemCode===a.DictItemCode&&(a.DictItemName=t.ItemName)}),e.deatilData=a,e.nowAlter="conDeatil",e.$store.commit("public/SET_ISSHOW",!0)})},submitData:function(){if(this.patientMsg.RegistId)if(this.isSignName){var t={Type:"0",Data:[{Name:"会诊申请"}],No:this.user.UserInfo.No,UserName:this.user.UserInfo.Name};this.currentObjData=t,this.caSignOperation.KeyVerify()}else this.handleOperation();else if(this.$msg.info("该患者无有效挂号，请先挂号！"),"1"===this.isRegister){var e={title:"患者挂号",width:"800px",component:"registrationAlter",isShowFooter:!0,btn:["挂号","取消"],visible:!0};this.$store.commit("public/SET_DIALOGDATA",e)}},handleOperation:function(){var t=Object(r["a"])(regeneratorRuntime.mark(function t(){var e,a=this;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return console.log(this.deatilData),t.prev=1,t.next=4,this.$IMIS.submmitOrderIMIS([{OrderType:31,OrderId:this.deatilData.DoctorOrderId}],this.patientMsg);case 4:if(e=t.sent,e){t.next=7;break}return t.abrupt("return");case 7:t.next=11;break;case 9:t.prev=9,t.t0=t["catch"](1);case 11:this.$Api.submitAdvice({InHouseId:this.$route.query.id,OrderList:[this.deatilData.DoctorOrderId],HisRegisterId:this.patientMsg.RegistId,CASignImg:this.caImgData}).then(function(t){a.$msg[t.Status?"success":"warning"](t.Message),t.Status?(a.$store.commit("public/SET_ISSHOW",!1),2==a.nowTemp&&a.getConHisDetails(a.hisSelectId),a.$refs.newCreate.resetForm(),a.commonObj=V,a.print()):a.refreshOrderStatus()}).catch(function(t){a.refreshOrderStatus()});case 12:case"end":return t.stop()}},t,this,[[1,9]])}));function e(){return t.apply(this,arguments)}return e}(),upData:function(){console.log(this.deatilData),this.toData()},toData:function(){var t=[];this.deatilData&&this.deatilData.ConsultationDetails&&this.deatilData.ConsultationDetails.forEach(function(e){t.push(e.DepartmentCode)}),this.commonObj=this.deatilData,this.commonObj.ConsultationDetails=t,console.log(this.commonObj),this.$store.commit("public/SET_ISSHOW",!1),this.nowTemp=1},callbackTable:function(t,e){var a=this;this.consultationId=t.ConsultationId,"row"===e&&(this.consultationId=t.ConsultationId,this.getOneDeatil(t.ConsultationId),1!==t.Status?this.isDeatilFoot=!1:this.isDeatilFoot=!0),"signIn"==e&&this.$Api.getSingIn({consultationId:t.ConsultationId}).then(function(t){t.Status&&(a.signInData=t.Data,a.nowAlter="signIn",a.$store.commit("public/SET_ISSHOW",!0),console.log(t.Data))}),"cancel"==e&&this.$confirm("该操作将取消该会诊记录,是否继续?","",{type:"warning"}).then(function(){a.$Api.stopAdvice({opertionType:5,orderIdList:[t.DoctorOrderId]}).then(function(t){a.$msg[t.Status?"success":"warning"](t.Message),t.Status&&a.getConHisDetails(a.hisSelectId)})}).catch(function(){a.$msg.info("已取消操作")}),"evaluate"==e&&(this.$Api.getGradeDetail({consultationId:this.consultationId}).then(function(e){if(e.Status)a.gradeData=e.Data;else{var o=[];t.ConsultationDetails.forEach(function(t){o.push({ConsultationDetailId:t.ConsultationDetailId,DepartmentName:t.DepartmentName,EvaluationGrade:0,EvaluationDesc:""})}),a.gradeData=o}}),this.nowAlter="conGrade",this.$store.commit("public/SET_ISSHOW",!0)),"end"==e&&this.$confirm("该操作将结束本次会诊,是否继续?","",{type:"warning"}).then(function(){a.loadIframe(t.ConsultationId),a.$Api.endCon({consultationId:t.ConsultationId}).then(function(t){a.$msg[t.Status?"success":"warning"](t.Message),t.Status&&a.getConHisDetails(a.hisSelectId)})}).catch(function(){a.$msg.info("已取消操作")}),"edit"==e&&this.$Api.getConsultationInfo({ConsultationId:this.consultationId}).then(function(t){if(t.Status){var e=[];t.Data.ConsultationDetails&&t.Data.ConsultationDetails.forEach(function(t){e.push(t.DepartmentCode)})}a.commonObj=t.Data,a.commonObj.ConsultationDetails=e,a.nowTemp=1}),"del"==e&&this.$confirm("该操作将删除该会诊记录,是否继续?","",{type:"warning"}).then(function(){a.$Api.delCon({consultationId:a.consultationId}).then(function(t){t.Status&&a.getConHisDetails(a.hisSelectId)})}).catch(function(){a.$msg.info("已取消操作")}),"print"==e&&this.print(),"look"==e&&(this.feedBackData={},this.$Api.getConFeedBack({consultationDetailId:t.ConsultationDetailId}).then(function(t){t.Status&&(a.feedBackData=t.Data,a.nowAlter="feedBack",a.$store.commit("public/SET_ISSHOW",!0))}))},print:function(){clearTimeout(this.timer);var t=(new Date).getTime(),e=window.location.protocol+"\\"+window.location.host,a="".concat(URLCONFIG.Emr,"/Nursing/EditPage.aspx?patientId=").concat(this.patientMsg.PatientId,"&inHouseId=").concat(this.patientMsg.InHouseId,"&areaType=").concat(this.patientMsg.AreaType,"&createUser=940c7df7-a718-e911-80cd-0050568e1b08&originUrl=").concat(e,"&objectType=").concat(q["x"].consultation.objectType,"&logUserEditTrack=true&documentId=f2f201db-3ca2-47b0-ba81-ab6b0096abd6&mark=true&templateId=").concat(q["x"].consultation.templateId,"&consultationid=").concat(this.consultationId,"&areaId=").concat(this.patientMsg.AreaId,"&t=").concat(t);console.log(a),this.$store.commit("public/SET_PRINTIFRAMEURL",a)},getConHisDetails:function(t){var e=this;this.$Api.getConHisDetails({InHouseId:t}).then(function(t){t.Status&&(e.tableData=t.Data)})},selectId:function(t){this.hisSelectId=t.InHouseId,this.getConHisDetails(this.hisSelectId)},sendSignIn:function(){var t=this;console.log(this.signInData);for(var e={ConsultationId:this.consultationId,ConsultationDetails:[]},a=!1,o=0;o<this.signInData.length;o++)this.signInData[o].DoctorId&&(a=!0,e.ConsultationDetails.push({ConsultationId:this.consultationId,DoctorId:this.signInData[o].DoctorId,ConsultationDetailId:this.signInData[o].ConsultationDetailId}));if(!a)return this.$msg.info("未选择签到人员！");this.$Api.subSignIn(e).then(function(e){t.$msg[e.Status?"success":"warning"](e.Message),e.Status&&(t.getConHisDetails(t.hisSelectId),t.$store.commit("public/SET_ISSHOW",!1))})},loadIframe:function(t){var e="",a={patientId:this.patientMsg.PatientId,inHospPatId:this.patientMsg.InHouseId,areaType:this.selectArea.DiagnosisAreaType,createUser:this.user.UserInfo.Id,consultationId:t,objectType:14,t:+new Date};for(var o in console.log(!1),a)e+="".concat(o,"=").concat(a[o],"&");e=e.substring(0,e.length-1);var i="".concat(URLCONFIG.Emr,"/Nursing/EditPage.aspx?").concat(e);this.$store.commit("public/SET_PRINTIFRAMEURL",i)},getFeeByTypeCodeList:function(){var t=this;this.$Api.getFeeByTypeCodeList({typeCode:null}).then(function(e){t.itemFeeList=e.Data||[]})},refreshOrderStatus:function(){this.$Api.refreshOrderStatus({inHospitalId:this.$route.query.id||this.patientMsg.InHouseId}).then(function(t){})}},computed:Object(l["a"])({},Object(b["b"])((o={isShow:"public/GET_ISSHOW",patientMsg:"public/GET_PATIENTMSG",user:"public/GET_USER",isRegister:"configuration/GET_ISREGISTER",selectArea:"home/GET_SELECTAREA",signName:"public/GET_SIGNNAME",isSignName:"public/GET_ISSIGNNAME",isGetCA:"public/GET_ISGETCA"},Object(s["a"])(o,"user","public/GET_USER"),Object(s["a"])(o,"caImgData","public/GET_CAIMGDATA"),o))),components:{newCreate:c["a"],myAlert:u["a"],conDeatil:g,conTable:_,signIn:H,conGrade:x,feedBack:B}},J=K,z=(a("3370"),Object(m["a"])(J,i,n,!1,null,"a66fdee2",null));e["default"]=z.exports},b8f3:function(t,e,a){"use strict";var o=a("b4b3"),i=a.n(o);i.a},bf95:function(t,e,a){"use strict";var o=a("6763"),i=a.n(o);i.a},de19:function(t,e,a){}}]);