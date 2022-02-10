/**
 * 友盟社会化插件
 */
// 模块名称
UmengModule

/**  注册Appkey信息(ios平台特有接口)
* @param info 对象
    * @param  openLogEnable {boolean:true/false}  是否打开调试日志
    * @param  umengAppKey {String}  友盟appkey
    * @param  wechatAppKey {String}  微信的appKey
    * @param  wechatAppSecret {String}  微信的appSecret
    * @param  sinaAppKey {String}  微博的AppKey
    * @param  sinaAppSecret {String}  微博的AppSecret
    * @param  qqAppKey {String}  QQ的appID
    * @param  qqAppSecret {String}  QQ的AppSecret
*/
UmengModule.registerAppInfo(info);

/**
 * 分享到微信好友
 * @param command 数组
        * @param title {String} 分享标题
        * @param content {String} 分享内容
        * @param pic {String} 分享图片url
        * @param url {String} 分享内容跳转链接
        * @param type {Integer} 分享类型 0 链接分享 1 多图分享（目前仅支持微信和微博，且无成功回调） 2 单图分享
        * @param qrcodeUrl {String} 分享二维码url 有二维码时需要传递
* 回调Promises
 */
UmengModule.shareToWechatSession(command);

/**
 * 分享到微信朋友圈
 * @param command 数组
        * @param title {String} 分享标题
        * @param content {String} 分享内容
        * @param pic {String} 分享图片url
        * @param url {String} 分享内容跳转链接
        * @param type {Integer} 分享类型 0 链接分享 1 多图分享（目前仅支持微信和微博，且无成功回调） 2 单图分享
        * @param qrcodeUrl {String} 分享二维码url 有二维码时需要传递
 * 回调Promises
    */
UmengModule.shareToWechatTimeline(command);


/**
 * 分享到新浪
 * @param command 数组
        * @param title {String} 分享标题
        * @param content {String} 分享内容
        * @param pic {String} 分享图片url
        * @param url {String} 分享内容跳转链接
        * @param type {Integer} 分享类型 0 链接分享 1 多图分享（目前仅支持微信和微博，且无成功回调） 2 单图分享
        * @param qrcodeUrl {String} 分享二维码url 有二维码时需要传递
* 回调Promises
 */
UmengModule.shareToSina(command);


/**
 * 分享到QQ
 * @param command 数组
    * @param title {String} 分享标题
    * @param content {String} 分享内容
    * @param pic {String} 分享图片url
    * @param url {String} 分享内容跳转链接
    * @param type {Integer} 分享类型 0 链接分享 1 多图分享（目前仅支持微信和微博，且无成功回调） 2 单图分享
    * @param qrcodeUrl {String} 分享二维码url 有二维码时需要传递
* 回调Promises
 */
UmengModule.shareToQQ(command);

/**
 * 分享到QQ空间
 * @param command 数组
    * @param title {String} 分享标题
    * @param content {String} 分享内容
    * @param pic {String} 分享图片url
    * @param url {String} 分享内容跳转链接
    * @param type {Integer} 分享类型 0 链接分享 1 多图分享（目前仅支持微信和微博，且无成功回调） 2 单图分享
    * @param qrcodeUrl {String} 分享二维码url 有二维码时需要传递
* 回调Promises
 */
UmengModule.shareToQzone(command);


/**
 * 第三方登录
 * @param command 数组
    * @param type {String} 平台类型 QQ:qq, 微博:sina, 微信:wechat
 * 回调Promises
    * @param success {Function} 成功回调，返回json字符串{"uid":"uid","name":"name"}
    * @param error {Function} 失败回调，返回错误信息
 */
UmengModule.login(command);

/**
 * 检查应用是否已安装
 * @param command 数组
    * @param type {String} 平台类型 QQ:qq, 微博:sina, 微信:wechat
    * @param callback  () => {} 箭头函数
 */
UmengModule.checkAppInstalled(command,callback);

/**
 * 获取deviceToken (此接口只有在真机设备上有效)
 *  return Promises
    * @param success {Function} 成功回调，返回deviceToken字符串
    * @param error {Function} 失败回调，返回错误信息
 */
UmengModule.getDeviceToken();




