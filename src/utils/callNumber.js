// import { ajax } from './ajax.js'
import { setSession } from "@/utils/storage";
import { getSession } from './storage.js';
class CallNumber {
    constructor(that, type) {
        this.that = that
        this.type = type
        this.init()
    }
    init() {

        if (this.type == 'yan_tian') {
            this.callNumberOperation = new Yantian(this.that)
        } else {
            // 公版
            this.callNumberOperation = {}
        }
    }
    Login(params) {
        console.log(params, '父类登录')
        this.callNumberOperation.Login && this.callNumberOperation.Login(params)
    }
    CallNextPat(list, index) {
        this.callNumberOperation.CallNextPat && this.callNumberOperation.CallNextPat(list, index)
    }
    ReCall() {
        this.callNumberOperation.ReCall && this.callNumberOperation.ReCall()
    }
    Logout() {
        this.callNumberOperation.Logout && this.callNumberOperation.Logout()
    }
    ChangeZjzt(params) {
        this.callNumberOperation.ChangeZjzt && this.callNumberOperation.ChangeZjzt(params)
    }
    ChangeBrzt(pGhxh, type) {
        this.callNumberOperation.ChangeZjzt && this.callNumberOperation.ChangeBrzt(pGhxh, type)
    }

}
export default CallNumber
class Yantian {
    constructor(that) {
        this.that = that
        this.currentPat = ''
        this.nextPat = ''
        this.init()
    }
    init() {
        this.callNumberUrl = getSession('loginip') && getSession('loginip').loginip
        if (!this.callNumberUrl) {
            this.that.$Api.getLocalhostIp().then(res => {
                let IP = res.Data;
                this.callNumberUrl = IP ? IP : this.callNumberUrl
                IP && setSession("loginip", { loginip: IP });
            }).catch(err => {
                this.that.$msg.info('请检查托盘程序是否启动',5000)
            });
        }
    }
    Login(params) {
        let data = {
            Type: "Login",
            pKsdm: params.selectDep,
            pKsmc: params.selectDepName,
            pYsdm: params.userInfo.No,
            pYsmc: params.userInfo.Name,
            pZjbz: "0",
            pFzjb: "0",
            pSex: params.userInfo.Sex < 2 ? '男' : '女',
            pDlzt: "0"
        };
        console.log('获取医生登录信息', this.callNumberUrl)
        // 登录成功之后
        this.that.$Api
            .readTray({
                LoginIp: this.callNumberUrl,
                Type: "4",
                Token: new Date().getTime(),
                Data: JSON.stringify(data)
            }).then(res => {
                let count = 0
                let readTimer = null
                readTimer = setInterval(() => {
                    this.that.$Api
                        .pollReadTray({ loginip: this.callNumberUrl + "|" + 4 })
                        .then(res => {
                            if (res) {
                                count++;
                                if (res.Msg) {
                                    clearInterval(readTimer);
                                    if (res.Status) {
                                        this.that.$store.commit('home/SET_DOCTORSELECTDEP', data.pKsdm)
                                        setSession('doctorSelectDep', { doctorSelectDep: data.pKsdm })
                                    } else {
                                        this.that.$msg.warning(res.Msg);
                                    }
                                } else {
                                    if (count === 37) {
                                        clearInterval(readTimer);
                                        this.that.$store.commit('home/SET_DOCTORSELECTDEP', '')
                                        setSession('doctorSelectDep', { doctorSelectDep: '' })
                                        this.that.$msg.warning('操作失败');
                                    }
                                }
                            }
                        });
                }, 5000)
            })
    }
    CallNextPat(list, paramsData) {
        if (this.currentPat && this.currentPat != undefined && this.currentPat.ActiveRegistId) {
            this.ChangeBrzt(this.currentPat.ActiveRegistId, 5)
        }
        let params = { "Type": "CallNextPat" }
        console.log('下一位')
        this.that.$Api
            .readTray({
                LoginIp: this.callNumberUrl,
                Type: "5",
                Token: new Date().getTime(),
                Data: JSON.stringify(params)
            }).then(res => {
                // 循环调用托盘程序
                let count = 0
                let readTimer = null
                readTimer = setInterval(() => {
                    this.that.$Api
                        .pollReadTray({ loginip: this.callNumberUrl + "|" + 5 })
                        .then(res => {
                            if (res) {
                                count++;
                                if (res.Msg) {
                                    clearInterval(readTimer);
                                    if (res.Status) {
                                        // 重新请求
                                        let params = {
                                            "ActiveRegistId":res.Data
                                        }
                                        this.that.$Api.getPersonMessageById(params).then(rr=>{
                                            if(rr.Status&&rr.Data&&rr.Data.length) {
                                                this.currentPat=rr.Data[0]
                                                setSession('currentPat', { currentPat: rr.Data[0] })
                                                this.operationPat()
                                                this.ChangeBrzt(res.Data, 2)
                                            } else {
                                                this.currentPat = list.find(item => item.ActiveRegistId == res.Data);
                                                if ( this.currentPat) {
                                                    setSession('currentPat', { currentPat: this.currentPat})
                                                    this.operationPat()
                                                    this.ChangeBrzt(res.Data, 2)
                                                } else {
                                                    setSession('currentPat', { currentPat: {} })
                                                    this.that.$msg.warning(rr.Message);
                                                }
 
                                            }
                                        })
                                    } else {
                                        this.that.$msg.warning(res.Msg);
                                    }
                                } else {
                                    if (count === 37) {
                                        clearInterval(readTimer);
                                        this.that.$msg.warning("叫号失败");
                                    }
                                }
                            }
                        })
                }, 5000)
            })
    }
    operationPat() {
        if (this.currentPat.ReceptionStatus == 0) {
            let params = {
                triageId: this.currentPat.TriageId,
                patientId: this.currentPat.PatientId,
                registerId: this.currentPat.ActiveRegistId,
                departmentCode: this.currentPat.DepartmentCode,
                triageLevel: this.currentPat.TriageLevel
            };
            this.that.$Api.patReceive(params).then(res => {
                if (res.Status&&res.Data) {
                    if (this.that.$route.name == 'home') {
                        this.that.$router.push({
                            name: this.that.clinicPatRouter,
                            query: { id: res.Data, from: 'home' }
                        });
                    } else {
                        this.that.$router.push({
                            name: this.that.$route.name,
                            //query: { id: res.Data }
                            query: { ...this.that.$route.query, id: res.Data }
                        });
                    }

                } else {
                    this.that.$msg.warning(res.Message)
                }
            });
        } else {
            // 3.门急诊就诊中
            //this.goonDoctor(row);
            if (this.that.$route.name == 'home') {
                this.that.$router.push({
                    name: this.that.clinicPatRouter,
                    query: { id: this.currentPat.Id, from: 'home' }
                });
            } else {
                // ...route.query, id: item.InHouseId 
                this.that.$router.push({
                    name: this.that.$route.name,
                    //query: { id: this.currentPat.Id, }
                    query: { ...this.that.$route.query, id: this.currentPat.Id }
                });
            }

        }
    }
    ReCall() {
        this.currentPat = getSession('currentPat').currentPat
        if (this.currentPat && this.currentPat.ActiveRegistId == undefined) {
            this.that.$msg.warning("还没有被叫号的患者");
            return
        }
        console.log('复呼')
        let data = { "Type": "ReCall", "pGhxh": this.currentPat.ActiveRegistId }
        this.that.$Api
            .readTray({
                LoginIp: this.callNumberUrl,
                Type: "6",
                Token: new Date().getTime(),
                Data: JSON.stringify(data)
            }).then(res => {
                this.loopRequest(6)
            })
    }
    Logout() {
        console.log('结束接诊')
        let data = { "Type": "Logout" }
        this.that.$Api
            .readTray({
                LoginIp: this.callNumberUrl,
                Type: "9",
                Token: new Date().getTime(),
                Data: JSON.stringify(data)
            }).then(res => {
                this.loopRequest(9)
            })
    }
    // 暂停或继续接诊
    ChangeZjzt(params) {
        let data = { "Type": "ChangeZjzt", "isZjzt": params.isZjzt }
        this.that.$Api
            .readTray({
                LoginIp: this.callNumberUrl,
                Type: "8",
                Token: new Date().getTime(),
                Data: JSON.stringify(data)
            }).then(res => {
                let count = 0
                let readTimer = null
                readTimer = setInterval(() => {
                    this.that.$Api
                        .pollReadTray({ loginip: this.callNumberUrl + "|" + 8 })
                        .then(res => {
                            if (res) {
                                count++;
                                if (res.Msg) {
                                    clearInterval(readTimer);
                                    if (res.Status) {
                                        this.that.$store.commit('home/SET_ISPAUSEDOCTOR', params.isZjzt)
                                    } else {
                                        this.that.$msg.warning(res.Msg);
                                    }
                                } else {
                                    if (count === 37) {
                                        clearInterval(readTimer);
                                        this.that.$msg.warning('操作失败');
                                    }
                                }
                            }
                        });
                }, 5000)
            })
    }
    ChangeBrzt(pGhxh, type) {
        console.log(pGhxh, 'hhhhhhhhhh', type)
        // // 请求成功之后改变患者状态
        let params2 = { "Type": "ChangeBrzt", "pGhxh": pGhxh, "pBrzt": type }
        this.that.$Api
            .readTray({
                LoginIp: this.callNumberUrl,
                Type: "7",
                Token: new Date().getTime(),
                Data: JSON.stringify(params2)
            }).then(res => {
                this.loopRequest(7)
            })
    }
    
    // 轮询请求托盘程序,data接受参数，type
    loopRequest(type) {
        // 循环调用托盘程序
        let count = 0
        let readTimer = null
        readTimer = setInterval(() => {
            this.that.$Api
                .pollReadTray({ loginip: this.callNumberUrl + "|" + type })
                .then(res => {
                    if (res) {
                        count++;
                        if (res.Msg) {
                            clearInterval(readTimer);
                            if (!res.Status) {
                                this.that.$msg.warning(res.Msg);
                            }
                        } else {
                            if (count === 37) {
                                clearInterval(readTimer);
                                this.that.$msg.warning('操作失败');
                            }
                        }
                    }
                });
        }, 5000)
    }
}