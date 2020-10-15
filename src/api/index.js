const files = require.context('.', true, /\.js$/);

let allApi = {};
/**
 * inject routers
 */
files.keys().forEach((key) => {
  if (key === './index.js') return;
  allApi = Object.assign(allApi, files(key).default); // 读取出文件中的default模块

});
export default allApi;
