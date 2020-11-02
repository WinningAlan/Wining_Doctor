// 收集session的key，便于后期clearAll
window.StoreKeys = window.StoreKeys || [];
//存储sessionStorage
export const setSession = (name, content) => {
    if (!name) return false;
    name = 'EDIS.'+name
    if (typeof content !=='string') {
        try {
            content = JSON.stringify(content)
        } catch (error) {
            return false;
        }
    }
    window.sessionStorage.setItem(name, content);
    if (window.StoreKeys.indexOf(name) < 0) window.StoreKeys.push(name)
    return true
}
//获取sessionStorage
export const getSession = name => {
    if (!name) return null;
    name = 'EDIS.'+name
    const content = window.sessionStorage.getItem(name)
    try {
        return JSON.parse(content)
    } catch (error) {
        return null
    }

}
//删除sessionStorage
export const removeSession = name => {
    if (!name) return false;
    name = 'EDIS.'+name
    window.sessionStorage.removeItem(name)
    return true;
}
// clearAll sessionStorage 
export const clearAllSession = () => {
        window.StoreKeys.forEach(val => {
            window.sessionStorage.removeItem(val)
        });
    return true
}
// 根据系统名称 获取路由
export const getNavData = (name) => {
    if (!name) return [];
    let user = getSession("user")
    let navData = []
    if (user) {
    let arr = user.UiRouterModel.Children[0].Children
    arr.forEach(item=>{
    if(item.UiRouter===name){
      navData=item.Children
    }
  })
    }
    return navData
}
// 获取路由name
export const getPermissionsName = (arr) => {
    let a = [];
    arr.forEach(item => {
      a.push(item.UiRouter);
      if (!!item.Children.length) {
        a.push(...getPermissionsName(item.Children))
      }
    })
    return a;
  }