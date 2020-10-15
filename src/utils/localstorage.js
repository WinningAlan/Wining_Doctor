import { Message } from 'element-ui';
// 增 //改
export const setLocalStorage = (key, value) => {
    if (!key) return false;
    key = 'EDIS.'+key
    if(!window.localStorage){
        // alert("该浏览器不支持localstorage")
        Message({
            message: '该浏览器不支持localstorage',
            type: 'error',
            center: true
        })
        return
    } else {
        let str = JSON.stringify(value)
        localStorage.setItem(key,str)
    }
}
// 删
export const clearLocalStorage = (key=null) => {
    if(!window.localStorage){
        Message({
            message: '该浏览器不支持localstorage',
            type: 'error',
            center: true
        })
        return
    } else {
        let storage = window.localStorage
        if(key===null){
            storage.clear()
        } else {
            key = 'EDIS.'+key
            storage.removeItem(key)
        }
    }
}
//改
// 查
export const getLocalStorage = (key) => {
    if (!key) return false;
    key = 'EDIS.'+key
    if(!window.localStorage){
        Message({
            message: '该浏览器不支持localstorage',
            type: 'error',
            center: true
        })
        return {}
    } else {
        let storage = window.localStorage
        // let str = JSON.stringify(value)
        // storage.setItem(key,str)
        let obj = JSON.parse(storage.getItem(key))
        return obj
    }
}
// localstorage键名获取
export const getLocalStorageKey = () => {
    if(!window.localStorage){
        Message({
            message: '该浏览器不支持localstorage',
            type: 'error',
            center: true
        })
        return {}
    } else {
        let storage = window.localStorage
        let arrKey = []
        for(var i=0;i<storage.length;i++){
            var key=storage.key(i);
            arrKey.push(key)
        }
        return arrKey
    
    }
}