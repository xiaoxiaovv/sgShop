/**
 * 小能客服组件-V2.6.2.5
 */
// 模块名称
XnengModule

/**
 * 登录小能服务［app登录成功后请求小能的登录服务］
 * @param command 数组
        *  @param userid: 登录用户的id，只能输入数字、英文字母和“@”、“.”、“_”三种字符。长度小于40,并且不能重复,相同的userid会造成会话同步,切记不可重复 【必填】
        *  @param username: 登录用户名，长度小于32,显示于PC客服端，如未填写，系统随机会随机生成一个用户名,，如:客人9527
        *  @param userlevel: 登录用户的等级，普通用户“0”，VIP用户传“1”。默认写 0 【必填】
 */
XnengModule.NTalkerLogin(command);


/**
 * 退出小能服务［app退出后请求小能的退出服务］
 */
XnengModule.NTalkerLogOut();

/**
 * 调起小能客服窗口+展示商品信息功能
 * @param command 数组
        *  @param settingid  有效接待组Id,该组内必须有客服存在,建议使用非管理员客服【必传】
        *  @param groupName  客服组名称，默认的企业客服名称,在异常情况下显示(如网络异常)【建议】(android需要的参数)
        *  @param chatparams  聊天参数体（带子参数,与多个功能有关,不用时填null）
        *         chatparams.startPageTitle = "";  // 咨询发起页标题(必填)
        *         chatparams.startPageUrl = "";//咨询发起页URL，必须以"http://"开头 （必填）
        *         chatparams.matchstr = "";////域名匹配,企业特殊需求,可不传  (android需要的参数)
        *         chatparams.erpParam = "";//erp参数, 被用参数,小能只负责经由SDK传到客服端,不做任何处理
        *         chatparams.kfuid = ""；//传入指定客服的格式：siteid_ISME9754_T2D_指定客服的id
        *         chatparams.clicktoshow_type //点击商品的动作 默认传递1   说明：  0 小能内打开， 1 顺逛内打开
        *         chatparams.goods_id = "";//消息页等其他页面商品id固定传-1  单品页传商品id正常传  订单传商品id正常传
        *         chatparams.clientGoods_type: //传1
        *         0:客服端不展示商品信息;1：客服端以商品ID方式获取商品信息(goods_id:商品ID，clientGoods_type = 1时goods_id参数传值不能为空)
        *         chatparams.appGoods_type://消息页传0  单品页传1  订单传3 并吧三下面的四个参数传递过来
        *                                   0:APP端不展示商品信息;
        *                                   1：APP端以商品ID方式获取商品信息(appGoods=1时goods_id参数传值才生效);
        *                                   3：自定义传入商品数据，展示到APP端,appGoods_type＝3时下面的4参数传值才会生效
        *                                     以下四个参数不需要
        *                                    chatparams.goods_imageURL(商品图片url，订单里面就是订单商品的imageURl ，多个网单取第一个)、
        *                                    chatparams.goodsTitle(商品标题、订单id)、
        *                                    chatparams.goodsPrice(商品价格、订单金额)、
        *                                    chatparams.goods_URL(商品链接 、 订单页面url地址)
        *         chatparams.itemparam (“storeMemberId,street”) storeMemberId+","+street注意此字段事两个拼接在一起的，单品页传递，订单不传递
        *


        ***************************************下面部分是ios需要额外传入的参数*******************************************
        *         chatparams.isSingle：0：请求客服组内客服；1：请求固定客服。(ios请求固定客服要求传入)
        *
 * 回调Promises
*/
XnengModule.NTalkerStartChat(command);

/**
* 商品详情页轨迹标准接口
* @param command 数组
        * @param title 商品详情页的名字
        * @param url 商品详情页的url
        * @param ref 上一页url(可选参数,没有就传"")
        * @param sellerid 商户id
*/
XnengModule.NTalkerGoodsDetailAction(command);

/**
* 订单页轨迹标准接口
* @param command 数组
        * @param title 商品页的名字
        * @param url 商品页的url
        * @param ref 上一页url
        * @param sellerid 商户id
        * @param orderid 订单id
        * @param orderprice 订单价格
*/
XnengModule.NTalkerOrderAction(command);


/**
 * 支付成功页轨迹标准接口
 * @param command 数组
        * @param title 商品页的名字
        * @param url 商品页的url
        * @param ref 上一页url
        * @param orderid 订单id
        * @param orderprice 订单价格
        * @param sellerid 商户id
 */
XnengModule.NTalkerPaySuccessAction(command);


/**
 * 消息中心资询列表返回数据结构
* @param callback 回调函数() => {}
 */
XnengModule.NtalkerMessageList(callback);


/**
 * 消息列表中的数据滑动删除某一列
 * @param command 数组
        * @param settingid 客服组id
 */
XnengModule.NtalkerDeleteItem(command);
