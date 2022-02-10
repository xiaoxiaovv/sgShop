/**
 * 封装了所有第三方统计的模块(包含友盟统计+GrowingIO)
 */
// 模块名称
StatisticsModule

// 注意事项: 所有json对象中的非必传字段,如果无数据,则设置为null, 如argument ={nickname: null}

/**
 * 页面跳转统计(友盟)
 * @param argument json对象 
        * @param pageviewid {String} 统计的页面名称 (必传)
        * @param actiontype {String} 页面动作类型  进入页面传:in ,  离开页面传:out (必传)
 */
StatisticsModule.statisticsPageViewAction(argument);


/**
 * 设置登录用户ID(GrowingIO)
 * @param userId {String} 登录用户ID (必传)
 */
StatisticsModule.setUserId(userId);

/**
 * 清除登录用户ID(GrowingIO)
 */
StatisticsModule.clearUserId();

/**
 * 页面浏览事件(GrowingIO)
 * @param page {String} 页面名称 (必传)
 */
StatisticsModule.page(page);

/**
 * 设置页面级变量(GrowingIO)
 * @param page {String} 页面名称 (必传)
 * @param pageLevelVariables {JSON对象} 页面级变量, 变量不能为nil
 */
StatisticsModule.setPageVariable(page,pageLevelVariables);

/**
 * 设置转化变量(GrowingIO)
 * @param conversionVariables {JSON对象} 转化变量, 变量不能为nil
 */
StatisticsModule.setEvar(conversionVariables);

/**
 * 设置用户变量(GrowingIO)
 * @param peopleVariables {JSON对象}  用户变量, 变量不能为nil
 */
StatisticsModule.setPeopleVariable(peopleVariables);

/**
 * 自定义事件（计数器类型）(GrowingIO)
 * @param eventId {String} 事件Id, Id为正常英文数字组合的字符串, 长度<=1000, 请不要含有 "'|\*&$@/', 等特殊字符
 * @param eventLevelVariable {JSON对象}  事件变量, 变量不能为nil
 */
StatisticsModule.track(eventId,eventLevelVariable);

/**
 * 自定义事件（数值类型）(GrowingIO)
 * @param eventId {String} 事件Id, Id为正常英文数字组合的字符串, 长度<=1000, 请不要含有 "'|\*&$@/', 等特殊字符
 * @param number {number} 数值类型变量, number为正的整数或者浮点数
 * @param eventLevelVariable {JSON对象}   事件变量, 变量不能为nil
 */
StatisticsModule.trackWithNumber(eventId,number,eventLevelVariable);