# NavBar 使用

使用先引入路径正确   `import { NavBar } from './path/to/components';` 
## 1. 最基本使用

```JavaScript
<NavBar 
title={'标题标题标题标题标题标题标题'} 
 // titleColor={'blue'} // 标题颜色
 />
```

## 2. 左边返回事件自定义
```JavaScript
<NavBar 
title={'标题标题标题标题标题标题标题'} 
 // titleColor={'blue'} // 标题颜色
defaultBack={false} // 设置 false
leftFun={()=>{alert('leftFun')}} // 就可以在这边写 左边返回事件自定义
/>
```
## 3. 左右边基本信息自定义
```JavaScript
import image1 from './../../../images/arrow_right_w.png'; // 导入本地图片路径
const image2 = {uri: "imageurl"}; // 远程图片对象
const image3 = require('./../../../images/arrow_right_w.png'); // 导入本地图片路径

<NavBar 
title={'标题标题标题标题标题标题标题'} 
defaultBack={false} // 设置 false
leftFun={()=>{alert('leftFun')}} // 就可以在这边写 左边返回事件自定义
leftTitle={'左标题左标题左标题'} // 有 title 就只显示文字,没有图片,需要图文就需要再 leftView 自定义
// leftView={<View><Text>sah</Text></View>}
// leftIcon={image1}  // 图片可以是本地的也可以的线上远程的
// leftIcon={image2} //  导入方式看上面引入
// leftIcon={image3} // 
// leftTitleColor={'lightGray'}
// leftIconStyle={{height: 30, width: 30}} // 图片样式

// rightTitle={'右标题右'}
// rightIcon={location}
// rightTitleColor={'grey'}
// rightIconStyle={{height: 30, width: 30}}
// rightView={<View><Text>sah</Text></View>}
// rightFun={()=>{alert('rightFun')}}
/>
```

## 4. 左右不显示,只显示中间
```JavaScript
<NavBar 
title={'标题标题标题标题标题标题标题'} 
defaultBack={false} // 设置 false
/>
```
## 5. 中间,或者整体导航栏自定义
```JavaScript
<NavBar 
defaultBack={false} // 设置 false
centerView={<View style={{flex: 1, backgroundColor: 'red'}}><Text>sdsf</Text></View>}
/>
```

