# App 打包时配置

1. 修改服务器线上环境配置

```javascript
1. .env 文件
2. src/config/index.js 文件
3. APICloud 的环境文件 service.js
```



2. CodePush 热更新 key 和 热更服务器的 url

安卓

```javascript
测试环境
   new CodePush(
                            "q2m907UvyopaCyuHGR2CXD6RLhAC4ksvOXqog",
                            MainApplication.this,
                            BuildConfig.DEBUG,
                            "http://mobiletest.ehaier.com:3000/"
                    ),

```

iOS

```javascript
    测试环境
	<key>CodePushDeploymentKey</key>
	<string>Pr1ZcVJukH5uqnzmbUD4tKBf3wNe4ksvOXqog</string>
	<key>CodePushServerURL</key>
	<string>http://mobiletest.ehaier.com:3000/</string>

正式环境


```




