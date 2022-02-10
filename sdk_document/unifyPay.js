/**
 * 银联全民付支付组件
 */
// 模块名称
UnifyPayModule

/**
 * 银联全民付支付
 * @param PayChannel {String} 指定的支付渠道 '01':微信支付 '02':支付宝支付  '03':银商钱包
 * @param payData {String}下单成功后获取的支付数据的json字符串（只需要appPayRequest键值对应的json字符串）
 * 回调Promises(银联全民付支付宝渠道无回调)
 * 注：支付宝渠道如果支付请求发送成功，则会跳转至支付宝APP
 * 并且支付完成后会停留在支付宝，因此商户 APP无法通过callbackBlock收到支付结果，请以后台的支付结果为准。
 * 
 * 回调Promises
 */
UnifyPayModule.pay(PayChannel, payDataStr);
