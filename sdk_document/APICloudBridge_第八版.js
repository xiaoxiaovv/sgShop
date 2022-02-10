info : {
	type:  1,        //1. 代表跳转界面功能 2.获取tocken功能    3.代表分享功能   4. 代表上传图片功能(正反向调用都是必传字段) 5.代表APICloud自己的界面跳转 6.APICloud顶层界面要返回RN界面 
	                 //7、android专用，是否可在返回 ，addview显示空白问题 8、跳指定详情（android） 9,权限管理(android)  10: 横竖屏 11、点击tabbar 12、android跳转浏览器 13,APICloud刷新tag字段标识的界面
	tag: '', // 由api人订制，原值传出不做处理,RN端在右回调时,原样回传该字段即可
	isShowTabBar: 1,       //当type值为5时,当前字段毕传,表示是否显示tabBar,0:隐藏tabBar,1:显示Tabbar
	canCallBack:  1,     //1.需要回调   0.不需要回调(必传字段)
	toPageName:  ‘Login’,     //要跳转到的页面路由名称,在type为1时必传,type为其他值不用传
	toPageParams: {
			// 这里传递的是跳转界面如果需要传递参数,放在这里,没有可不传
	},
	command: [],       //当type等于3或者4或者10时,需要传递的参数放在command里面
	// 注意: APICloud调用原生方法不需要传递下面四个参数
 	success:   1,          //当type等于3或者4时,原生需要回调APICloud方法,此时success字段标识成功的回调还是失败的回调,
				      		//其中success=0标识失败的回调,1标识成功的回调
 	data: data,             //当success为1时,该字段里面就是操作成功后的回调数据
	message:  ‘分享失败’,           //当 success为0时,该字段有数据,标识失败的信息,前端可用于提示用户
    errorCode: 错误码,                        //当success为0时,该字段有数据,标识失败的错误码
}  

info里面的command参数分析:
当info的type等于3时,代表分享功能,command参数传值如下:
* @param command 数组
        * @param title {String} 分享标题
        * @param content {String} 分享内容
        * @param pic {String} 分享图片url
        * @param url {String} 分享内容跳转链接
        * @param type {Integer} 分享类型 0 链接分享 1 多图分享（目前仅支持微信和微博，且无成功回调） 2 单图分享
        * @param platformType 0:微信好友,1:微信朋友圈,2:新浪,3:QQ好友,4:QQ空间


当info的type等于4时,代表上传图片功能,command参数传值如下:
 * @param command 数组  ＊[url,tocken,width,height,ratio,file数组]
 *                url:图片上传地址
 *                tocken:用户tocken
 *                width:图片裁剪宽度  (不需要裁剪传0)
 *                height:图片裁剪高度 (不需要裁剪传0)
 *                ratio:图片压缩比例  (1~100,不需要压缩传100)
 *                files：本地路径数组［file1］或者［file1,file2...］
 * 
 * 
 
 当info的type等于10时,代表横竖屏功能,command参数传值如下:
 * @param command 数组  ＊[type]
 *                type: 字符串类型, '1':表示竖屏  '2': 表示横屏
 
APICloudCallNaviteMethod(info)      : APICloud调用原生方法

NaviteCallRNMethod(info)                : 原生调用RN方法

RNCallNaviteMethod(info)		  : RN调用原生方法

NaviteCallAPICloudMethod(info)       : 原生调用APICloud方法



RN跳转到社群首页:
//通过tabBar界面跳转APICloud的首页
this.props.navigation.navigate('Community',{
	url: '/html/index.html',   // 去社区首页,直接这样跳转即可,不用穿其他参数
	}
);

RN跳转到社群非首页的其他页面:
 //通过新界面跳转APICloud的二级界面
 // param
 // type 1是简单图文  2是图文混排 3是视频 4是商学院
 this.props.navigation.navigate('SuperSecondView',{
	url: '/html/mine/mine.html',   //去社群的页面路径,该参数为必传参数
	param1: 'hahafhah',            //下面param1,param2,param3,param4,param5是其他参数,可自定义,可传可不传
	param2: 1.5,
	param3: 1222,
	param4: true,
	param5: 'ETSEuddd',
	}
);