(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-94895c56"],{c9bd:function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"reportCards"},[a("textareaSelsect",{staticStyle:{width:"150px"},attrs:{selectList:e.selectList},model:{value:e.something,callback:function(t){e.something=t},expression:"something"}})],1)},l=[],i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"textareaSelsect"},[a("el-popover",{ref:"popover",attrs:{placement:"bottom-start","popper-class":"textarea-warp",trigger:"manual","visible-arrow":!1,width:e.width},model:{value:e.isShow,callback:function(t){e.isShow=t},expression:"isShow"}},[a("ul",{staticClass:"el-scrollbar__view el-select-dropdown__list",on:{click:e.select}},e._l(e.selectList,function(t){return a("li",{key:t.value,staticClass:"el-select-dropdown__item",class:{selected:t.value==e.value},attrs:{"data-id":t.value}},[e._v(e._s(t.text))])}),0)]),a("el-input",{directives:[{name:"popover",rawName:"v-popover:popover",arg:"popover"}],ref:"textarea",attrs:{type:"textarea",autosize:"",resize:"none",placeholder:"请输入内容",value:e.value},on:{focus:function(t){e.isShow=!0},blur:function(t){e.isShow=!1},input:function(t){e.$emit("input",t)}}})],1)},n=[],o={name:"textareaSelsect",props:{selectList:{type:Array,default:function(){return[]}},value:""},data:function(){return{width:"",isShow:!1}},mounted:function(){this.width=this.$refs.textarea.$el.offsetWidth,console.log(this.$refs.textarea.$el.offsetWidth)},methods:{select:function(e){var t=e.target;"LI"===t.tagName&&this.$emit("input",t.dataset.id)}}},r=o,c=(a("e02d"),a("2877")),u=Object(c["a"])(r,i,n,!1,null,null,null),p=u.exports,d={name:"reportCards",components:{textareaSelsect:p},data:function(){return{something:"",selectList:[{text:"待提交",value:1},{text:"已提交",value:2},{text:"已审核",value:3},{text:"已退回",value:4},{text:"执行中",value:5},{text:"已停止",value:6},{text:"已作废",value:7}]}},methods:{}},v=d,f=Object(c["a"])(v,s,l,!1,null,"452cf94e",null);t["default"]=f.exports},e02d:function(e,t,a){"use strict";var s=a("f72b"),l=a.n(s);l.a},f72b:function(e,t,a){}}]);