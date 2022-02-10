/**
 * 其他工具类组件
 */
// 模块名称
ToolsModule

/**
 * 模态弹出EMC界面
 * @param command 数组
        * @param1 isOffical {Integer} （1:正式环境；0:测试环境）
        * @param2 access_token {String} 用户中心返回的access_token
        * @param3 entryPoint {String} 进入EMC后直接进入某功能，例如“OldforNew”,可传空字符串""
                     
    * 无回调
 */
ToolsModule.presentEmcView(command);

/**
 * open海尔洗衣机应用
 * @param command 数组
        * @param userAccount {String} 用户名
        * @param passWord {String} 密码
        * @param access_token    用户tocken   
    * 无回调
 */
ToolsModule.presentWashView(command);

/**
 * 跳转原生webView页面
 * @param command 数组
        * @param resultUrl {String} 链接url
        * @param title {String} 标题
        * @param callBackStatus {int} 1、白条
    * 当callBackStatus为1时,通过Promises回调
 */
ToolsModule.presentH5View(command);

/**
 * 设置－缓存(获取/清空缓存的方法)
 * @param command 数组
        * @param type {String} {type = "getCacheSize" 得到缓存大小}{type = "clearCache" 清除缓存}
*   @param callback  () => {} 箭头函数
 */
ToolsModule.actionCache(command, callback);

/**
 * 调取通讯录
 * 请求参数无
 * 回调Promises
    * @param success {Function} 成功回调，返回json字符串{"name":"zhangsan","number":"1888888888"}
    * @param error {Function} 失败回调，返回错误信息
 */
ToolsModule.getPhoneContacts();

/**
 * 获取经纬度
 * 请求参数无
 * 回调Promises
 *                   
    * @param success  {json}
    *   //城市名称 cityName
        //城市编码 cityCode
        //省份编码 provinceName
        //地区 districtName
        //路或街道 roadName
        //纬度 latitude
        //经度 longitude
    * @param error  失败回调，返回错误信息 string
 */
ToolsModule.location();

/**
 * 停止获取经纬度（暂时不需要调用这个）
 * 请求参数无
 *  无回调
 */
ToolsModule.stop();

/**
 * 地理编码（通过地址获取经纬度）
 * @param address string地址信息 例如北京市海淀区银网中心
 * 回调Promises
 *                   
    * @param success  回调数组［经度，纬度］
    * @param error  失败回调，返回错误信息 string
 */
ToolsModule.getGeocode();