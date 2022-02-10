> 编码规范不该是一种束缚，而是一种便于团队协作沟通的约束。

编码其实很多的时候是一种很自我的一种创造性地表达，为了磨平这种过分的自我，我们采用
互不迁就融入社区的做法。我们使用社区最流行的编码规范来约束彼此。

## The most popular javascript Guide
https://github.com/airbnb/javascript/tree/master/react

## React?

1. 模块的命名以中划线分割，如：user-guide, goods-list，js文件驼峰写法，首字母大写

2. 使用space代替tab，保持缩进为两个空格，代码更紧凑明快

3. 引入模块依赖，尽量使用ES6的import，尤其是引入Dimensions

```js

// 在使用 Dimensions.get('window') 获取屏幕宽高,在横屏下回有问题,所以我们现在统一应用  config/url.js 文件下的 宽高
import URL from './path/to/url.js';
let width = URL.width;
let height = URL.height;

```

4. 尽量使用flex 加百分比适配单位
```javascript
import {px} from "../../../utils";
...
tabItemText: {
color: '#2979FF',
fontSize: px(15),
}
```

5. 引入模块的顺序，先引入系统级别，再引入库级别如：

  ```javascript

  import React from 'react'; //libary
  import {....} from 'react-native'//libary

  import {....} from 'uikit'; // our module
  
  import .... from 'react-native-tabbar'
  ```
6. 在React的component中，在render方法之前都是React的生命周期方法，
在render方法之后才是我们的业务方法，如果是私有方法以下划线开头,
所有的fetch请求不能写在ComponentWillMount中,所有的非生命周期方法需有备注，
状态需有备注

  ```javascript
  import React from 'react-native';

  class User extends React.Component({
    /**
     * 设置默认属性
     */
    static defaultProps{

    },

    /**
     * 初始化状态
     */
    constructor(props){
      super(props)
    },

    /**
     * 组件渲染完成，一般用于监控资源
     */
    componentDidMount(){

    },

    /**
     * 组件更新完成
     */
    componentDidUpdate() {

    },

    /**
     * 组件被从scene中remove了
     */
    componentWillUnmount() {

    },

    /**
     * virtualdom
     */
    render() {

    },

    /**
     * 处理用户登录
     * @private
     */
    _handleUserLogin() {

    },

    /**
     * 处理按钮的点击
     * @private
     */
    _handleBtnTouch() {

    },

    getUserInfo() {

    }
  });

export default User
  ```

7. 数据中心Dva-Store中数据命名与网络请求返回的结果的命名保持一致


