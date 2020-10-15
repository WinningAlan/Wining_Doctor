import { ajax } from './ajax.js'
import { getSession } from "./storage";
import Base64 from './base64'
let time = 0;
class CASign {
    constructor(that, type) {
        this.that = that
        this.type = type
        this.init()
    }
    init() {
        if (this.type == 'yan_tian_CA') {
            this.caSign = new CAy(this.that)
        }else{
            this.caSign = {}
        }
    }
    KeyVerify() {
        let now = new Date().getTime();
        let con= now-time
        if (con > 800) {
            time = now;
            this.caSign.KeyVerify && this.caSign.KeyVerify();
        } 
        
    }
    LoginByCA() {
        this.caSign.LoginByCA && this.caSign.LoginByCA()
    }
    CALoginVerify(data1,data2) {
        this.caSign.CALoginVerify && this.caSign.CALoginVerify(data1,data2)
    }
    checkData(UserInfo,currentObjData) {
        this.caSign.checkData && this.caSign.checkData(UserInfo,currentObjData)
    }
    GetYsImg() {
        this.caSign.GetYsImg && this.caSign.GetYsImg()
    }
}
export default CASign
class CAy {
    constructor(that) {
        this.that = that
        this.CA_BASE_URL = 'http://localhost:10808/api/CA'
        this.Api = (params,type='post')=> ajax(params,this.CA_BASE_URL,type)
    }
    KeyVerify() {
        let params = { "Type": "KeyVerify", "Data": "" }
        let type = 'post'
        this.Api(params,type).then(res => {
            // 检测到有没有硬件 
            if(res.Status) {
                this.LoginByCA()
            }else{
                this.that.$msg.warning(res.Message)
                this.that.$store.commit('public/SET_ISGETCA', false)
                this.that.$store.commit('public/SET_CAREQUESTLOADING','')
            }
        }).catch(err => {
            this.that.$msg.warning('请检查是否插入CA',3000)
            this.that.$store.commit('public/SET_CAREQUESTLOADING','')
        })
    }
    LoginByCA() {
        let params = { "Type": "LoginByCA", "Data": "" }
        let type ='post'
        this.Api(params,type).then(res => {
            if (res.Status) {
                this.that.$store.commit('public/SET_ISGETCA', true)
            }else{
                this.that.$msg.warning(res.Message)
                this.that.$store.commit('public/SET_ISGETCA', false)
                this.that.$store.commit('public/SET_CAREQUESTLOADING','')
            }
        }).catch(err => {
            this.that.$store.commit('public/SET_CAREQUESTLOADING','')
        })
    }
    CALoginVerify(data1,data2) {
        this.that.$store.commit('public/SET_ISGETCA', false)
        console.log(data1,'登录，，，，',data2)
        let base64 = new Base64()
        let params = { "Type": "CALoginVerify", "Data": base64.encode(data1) }
        let type ='post'
        this.Api(params,type).then(res => {
            if(res.Status) {
                ///////
                this.GetYsgh(data1,data2)
            }else{
                this.that.$msg.warning(res.Message)
                this.that.$store.commit('public/SET_CAREQUESTLOADING','')
            }
        }).catch(err => {
            this.that.$store.commit('public/SET_CAREQUESTLOADING','')
        })
    }
    RunCASignEx(data) {
        this.GetYsImg()
        console.log(data,'数字签名')
        data.Data=JSON.stringify(data.Data)
        let params = { "Type": "RunCASignEx", "Data": JSON.stringify(data) }
        let type ='post'
        this.Api(params,type).then(res => {
            this.that.$store.commit('public/SET_ISGETCA', false)
            if(res.Status) {
                this.that.handleOperation()
                this.that.$store.commit('public/SET_ISSIGNSUCCESS',true)
            }else{
                this.that.$store.commit('public/SET_ISSIGNSUCCESS',false)
                this.that.$msg.warning(res.Message)
                this.that.$store.commit('public/SET_CAREQUESTLOADING','')
            }
        }).catch(err => {
            this.that.$store.commit('public/SET_CAREQUESTLOADING','')
        })
    }
    GetYsgh(data1,data2) {
        console.log(data1,data2,'账号验证')
        let params = { "Type": "GetYsgh", "Data": '' }
        let type ='post'
        this.Api(params,type).then(res => {
            if(res.Status) {
                if(res.Data==data1.No) {
                    // 验证成功失败
                    this.RunCASignEx(data2)
                } else {
                    this.that.$msg.warning('当前CA与系统登录人不符，请重新登录',3000)
                    this.that.isNewAdd = false
                    this.that.$store.commit('public/SET_ISGETCA', false)
                    this.that.$store.commit('public/SET_CAREQUESTLOADING','')
                }
            }else{
                this.that.$msg.warning(res.Message)
                this.that.$store.commit('public/SET_ISGETCA', false)
                this.that.$store.commit('public/SET_CAREQUESTLOADING','')
            }
        }).catch(err => {
            this.that.$store.commit('public/SET_CAREQUESTLOADING','')
        })
    }
    // 验证相关数据
    checkData(UserInfo,currentObjData) {
        console.log(UserInfo,currentObjData,'数据包检验')
        this.that.$store.commit('public/SET_ISGETCA', false)
        if (getSession("caLogin") && getSession("caLogin").caLogin) {
            // 已经登录
            this.GetYsgh(UserInfo, currentObjData);
          } else {
            this.that.$store.commit('public/SET_CAREQUESTLOADING','ca数据包检验')
            // 重新登录出现弹窗
            this.that.$prompt("请输入CA签名密码", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              inputPattern: "",
              inputErrorMessage: "",
              inputType:'password'
            })
              .then(({ value }) => {
                console.log(value,currentObjData)
                this.CALoginVerify(value, currentObjData);
              })
                .catch(err => {
                this.that.isNewAdd = false
                this.that.$msg.info('取消输入')
                this.that.$store.commit('public/SET_CAREQUESTLOADING','')
              });
          }
    }
    // 获取ca签名数据流
    GetYsImg() {
        let params = { "Type": "GetYsImg", "Data": '' }
        let type ='post'
        this.Api(params,type).then(res => {
            if(res.Status) {
                this.that.$store.commit('public/SET_CAIMGDATA',res.Data)
            }else{
                this.that.$msg.warning(res.Message)
                this.that.$store.commit('public/SET_CAREQUESTLOADING','')
            }
        }).catch(err => {
            this.that.$store.commit('public/SET_CAREQUESTLOADING','')
        })
    }
}
