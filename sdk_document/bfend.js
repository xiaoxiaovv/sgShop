/**
 * 百分点
 */
// 模块名称
BfendModule
 /**
     * 添加商品信息
     * @param itemId 商品id
     * @param data {} 商品信息json数据，可参照对接文档
     *             uid：用户id
     *             del：false
     *             name：商品名称productFullName
     *             seller_lnk："/"+$scope.productId+"/"+$scope.o2oType+"/"+$scope.fromType+"/"+$scope.storeId+"/",
     *             cmp：促销活动productActivityInfo 或''
     *             typ:'shop',
     *             img:大图片urlproduct.defaultImageUrl,
     *             memp:actualPrice,
     *             ratecnt:评论人数totalNum,
     *             cat:类目名称re.data,
     *             brd: 品牌名称,brandName,
     *             stk: 库存stockNumber+''
     *
     */
    BfendModule .onAddItem(itemId, data);

    /**
     * 用户登录。用户登录成功时调用
     * @param userId 用户标识
     * @param data {}扩展属性信息json数据，可参照对接文档
     *             name：用户名
     *             cp：手机号
     */
    BfendModule.onAddUser(userId, data);

    /**
     * 用于BRE统计用户的浏览行为，在点击某个信息条目时触发。
     * @param itemId 商品唯一标识符
     * @param data {}扩展属性信息json数据，可参照对接文档
     *             uid：用户登录id
     */
    BfendModule.onVisit(itemId, data);
    /**
     * 添加自定义事件
     * @param method 方法名称 例如收藏onAddFav
     * @param data {}扩展属性信息json数据，可参照对接文档
     *             uid：用户登录id（如未登录传空值）,string类型 (必选字段)
     *             iid: 商品id,string类型 (必选字段) ,必选
     */
    BfendModule.onEvent(method, data);

    /**
     * 添加购物车行为统计
     * @param array [itemId 商品唯一标识符,price 商品价格,quantity 商品数量]
     * @param data {}扩展属性信息json数据，可参照对接文档
     *             uid：用户登录id（如未登录传空值）,string类型 (必选字段)
     */
    BfendModule.onAddCart(array, data);

    /**
     * 移除购物车
     * @param itemId 商品唯一标识符
     * @param data {}扩展属性信息json数据，可参照对接文档
     *             uid：用户登录id（如未登录传空值）,string类型 (必选字段)
     */
    BfendModule.onRmCart(itemId, data);

    /**
     * 用户下定单，生成订单号页面提交
     * @param goods  商品信息二维数组
     *               ［'订单ID',［'itemid商品唯一标识符'］,［商品价格Double］,［商品数量int］,订单总价Double］
     * @param data (ios平台total放在params里面){}扩展属性信息json数据，可参照对接文档
     *             uid：用户登录id（如未登录传空值）,string类型 (必选字段)
     */
    BfendModule.onOrder(goods, data); 
       
    /**
     * 用户支付成功时提交
     * @param goods  商品信息二维数组
     *               ［'userId','订单ID',［'itemid商品唯一标识符'］,［商品价格Double］,［商品数量int］,订单总价Double］
     * @param data {}扩展属性信息json数据，可参照对接文档
     *             uid：用户登录id（如未登录传空值）,string类型 (必选字段)
     */
    BfendModule.onPay(goods, data);  

    /**
     * 输入搜索关键词并点击搜索的时候调用
     * @param args [isEmpty,queryString]
     *             isEmpty:是否无结果， 无结果则为true，有结果则为false
     *             queryString 搜索关键词
     * @param data 扩展属性信息json数据，可参照对接文档
     *             uid：用户登录id（如未登录传空值）,string类型 (必选字段)
     */
    BfendModule.onSearch(args, data);  

    /**
     * onPosition()只有android有这个接口 暂时不需要调用
     * @param args [经度，纬度]
     * @param data 扩展属性信息json数据，可参照对接文档
     *             uid：用户登录id（如未登录传空值）,string类型 (必选字段)
     */
    BfendModule.onPosition(args, data); 

    /**
     * 请求返回推荐结果
     * @param recommendId, 推荐请求标识，由百分点提供, string类型 
     * @param data 扩展属性信息json数据，可参照对接文档
     *             uid：用户登录id（如未登录传空值）,string类型 (必选字段)
     *             iid: 商品唯一标识符，注：仅在单品页传iid（必选）
     *             loc: 当前所属地域（与上商品信息传值保持一致）,必选
     */
    BfendModule.recommend(recommendId, data); //需要rn界面接收json｛｝结果

    /**
     * 请求热搜词推荐结果
     * @param recommendId 推荐请求标识，由百分点提供
     * @param data 扩展属性信息json数据，可参照对接文档
     *             uid: 用户登录id（如未登录传空值）,string类型,必选
     */
    BfendModule.recommendSearch(recommendId , data,);  //需要rn界面接收json｛｝结果

    /**
     * 推荐结果反馈 
     * @param args [rid,itemId]
     *             rid: 由具体的服务生成，在recommend方法的返回值中可以获取,必选见4.3.1示例
     *             itemId: 商品唯一标识符，表示该请求涉及到的商品,必选
     * @param data 扩展属性信息json数据，可参照对接文档
     *             uid: 用户登录id（如未登录传空值）,string类型,必选
     *             iids: 商品唯一标识集合,中间用竖线|隔开,.例如12344|21345|2356,必选
     *             rid: 由具体的服务生成，recommend方法返回的recommendRequestId,必选
     *
     */
    BfendModule.onFeedback(args,data);

    /**
     * 推荐曝光率统计 ios专用
     * @param args [rid,itemId]
     *             rid: 由具体的服务生成，在recommend方法的返回值中可以获取,必选见4.3.1示例
     *             itemId: 商品唯一标识符，表示该请求涉及到的商品,必选
     * @param data 扩展属性信息json数据，可参照对接文档
     *             uid: 用户登录id（如未登录传空值）,string类型,必选
     *             iids: 商品唯一标识集合,中间用竖线|隔开,.例如12344|21345|2356,必选
     *             rid: 由具体的服务生成，recommend方法返回的recommendRequestId,必选
     *
     */
    BfendModule.dFeedback(args,data);
