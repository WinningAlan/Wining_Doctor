import { ajax } from './ajax.js'
import { getSession } from "./storage";
let time = 0;
// 医保控费
class IMIS {
    constructor() {
        this.IMIS = {}
    }
    init(that, type=this.type) {
        this.that = that
        this.type = type
        if (type === '1') {
            this.IMIS = new IMISYT(this.that)
        }else{
            this.IMIS = {}
        }
    }
    loginIMIS() {
        this.IMIS.loginIMIS && this.IMIS.loginIMIS()
    }
    // 加载患者提醒信息
    async loadPatientInfoIMIS(data) {
        return new Promise(async (resolve, reject) => { 
            if (this.IMIS.loadPatientInfoIMIS) {
                let now = new Date().getTime();
                let con= now-time
                if (con > 800) {
                    time = now;
                    let bl = await this.IMIS.loadPatientInfoIMIS(data)
                    resolve(bl)
                } 
            } else {
                resolve(true) 
            }
        })
    }
    //医嘱提交医保控费信息
    async submmitOrderIMIS(orderList, data) {
        return new Promise(async (resolve, reject) => { 
            if (this.IMIS.submmitOrderIMIS) {
                let now = new Date().getTime();
                let con= now-time
                if (con > 800) {
                    time = now;
                    let bl = await this.IMIS.submmitOrderIMIS(orderList, data)
                    resolve(bl)
                } 
            } else {
                resolve(true) 
            }
         
        })

    }
}
export default IMIS
class IMISYT {
    constructor(that) {
        this.that = that
        this.loginStr =''
        this.CA_BASE_URL = 'http://localhost:10808/api/IMIS'
        this.Api = (params,type='post')=> ajax(params,this.CA_BASE_URL,type,'',false,3600000)
    }
    loginIMIS() {
        let {UserInfo,Departments} = getSession('user') || {UserInfo:{},Departments:[]};
        let params = {
            Type: "IMISLogin",
            Data:{
                zgdm: UserInfo.No,
                zgxm: UserInfo.Name,
                ksdm:Departments[0]? Departments[0].Code:"",
                ksmc:Departments[0]? Departments[0].Name:''
            }
        }
        console.log(params,'loginIMIS');
        this.Api(params).then(res => {
            if (res.Status) {
                this.loginStr =res.Data
            }else{
                this.that.$msg.warning(res.Message)
                this.loginStr =''
            }
        }).catch(err => {
            this.loginStr = '';
            console.log(err,'loginIMIS');
        })
    }
    async  loadPatientInfoIMIS(data) {
        let params={
                Type: "IMISLoadPatientInfo",
            Data: {
                    xtbz:'0',// 系统标志（0：门诊 1：住院 2：住院护士站 3：医技确费 4：手术系统）
                    patid: data.HISPatientId,// HIS患者id
                    ghxh: data.RegistId,//挂号序号
                    ybdm: data.SocialSecurityCode,// 医保编码
                    loginStr: this.loginStr
                }
            
        }
        console.log(params, 'loadPatientInfoIMIS');
        return new Promise((resolve, reject) => { 
            this.Api(params).then(res => {
                resolve(res.Status)
                // !res.Status&&this.that.$msg.warning(res.Message)
            }).catch(err => {
                resolve(res.Status)
         })
        })

    }
    async submmitOrderIMIS(orderList, data) {
      return new Promise((resolve, reject) => { 

        let OrderInfo = []
        orderList.forEach(item => {
            OrderInfo.push({
                OrderId:item.OrderId,
                OrderType: item.OrderType
            })  
        })
        let params={
                Type: "IMISSubmitOrder",
                Data: {
                    InHouseId: data.InHouseId,
                    OrderInfo,
                    HisPatientId: data.HISPatientId,
                    HisRegisterId: data.RegistId,
                    ybdm:data.SocialSecurityCode,
                    loginStr: this.loginStr
                }
            
          }
          console.log(params,'submmitOrderIMIS');
          this.Api(params).then(res => {
            resolve(res.Status)
            if(res.Status) {
                console.log(res,'submmitOrderIMIS');
            }else{
                this.that.$msg.warning(res.Message)
                this.that.$store.commit('public/SET_CAREQUESTLOADING','')
            }
          }).catch(err => {
            this.that.$msg.warning(err||'医保控费接口调用失败，请重试')
            resolve(false)
            this.that.$store.commit('public/SET_CAREQUESTLOADING','')
        })
    })
    }

}
