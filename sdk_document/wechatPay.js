/**
 * 微信支付组件
 */
// 模块名称
WxPayModule

/**  注册微信支付的Appkey信息(ios平台特有接口)
* @param info 对象
    * @param  wechat_appkey 微信支付Appkey
*/
WxPayModule.registerApp(info);

/**
 * 微信支付
 * @param command 数组
        * @param {} 对象 {String} JSON格式支付信息
 * 回调Promises
 */
WxPayModule.pay(command);

/**
 * 检查应用是否已安装
 * @param callback  () => {} 箭头函数
 */
wechat.checkAppInstalled(callback)