// @/utils/permission

import store from '@/store'




/**

 * 判断是否拥有权限

 * @param {Array<string>} name - 要判断的权限路由名称

 */

// export const includePermission = name => permissions.includes(name);
export const includePermission = name => store.getters['public/GET_PERMISSIONS'].includes(name);

// @/utils/permission
/**

 * 创建重定向函数

 * @param {Object} redirect - 重定向对象

 * @param {string} redirect.name - 重定向的组件名称

 * @param {Array<any>} children - 子列表

 */

function createRedirectFn (redirect = {}, children = []) {

    // 避免缓存太大，只保留 children 的 name 
  
  const permissionChildren = children.map(({ name = '' }) => ({ name }))
    return function (to) {
  
      // 这里一定不能在 return 的函数外面筛选，因为权限是异步获取的
  
      const hasPermissionChildren = permissionChildren.filter(item => includePermission(item.name))
      // 默认填写的重定向的 name
  
      const defaultName = redirect.name || ''
  
      // 如果默认重定向没有权限，则从 children 中选择第一个有权限的路由做重定向
  
      const firstPermissionName = (hasPermissionChildren[0] || { name: '' }).name
  
      // 判断是否需要修改默认的重定向
  
      const saveDefaultName = !!hasPermissionChildren.find(item => item.name === defaultName && defaultName)
  
      if (saveDefaultName) return { name: defaultName }
  
      else return firstPermissionName ? { name: firstPermissionName } : redirect
  
    }
  
  }
  // @/utils/permission
  
  /**
  
   * 创建有权限的路由配置（多级）
  
   * @param {Object} config - 路由配置对象
  
   * @param {Object} config.redirect - 必须是 children 中的一个，并且使用 name
  
   */
  
  export const createPermissionRouter= ({ redirect, children = [], ...others }) =>{
    const needRecursion = !!children.length
  
    if (needRecursion) {
  
      return {
  
        ...others,
  
        redirect: createRedirectFn(redirect, children),
  
        children: children.map(item => createPermissionRouter(item))
  
      }
  
    } else {
  
      return {
  
        ...others,
  
        redirect
  
      }
  
    }
  
}
