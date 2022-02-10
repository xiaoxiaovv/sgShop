/**
 * 图片下载、上传（支持批量上传）
 */
// 模块名称
PhotoModule

/**
 * 上传图片（支持单张/批量上传）
 * @param command 数组  ＊[url,tocken,width,height,ratio,file数组]
 *                url:图片上传地址
 *                tocken:用户tocken
 *                width:图片裁剪宽度  (不需要裁剪传0)
 *                height:图片裁剪高度 (不需要裁剪传0)
 *                ratio:图片压缩比例  (1~100,不需要压缩传100)
 *                files：本地路径数组［file1］或者［file1,file2...］
 */
PhotoModule.uploadImg(command);//需返回给RN界面url数组

/**
 * 下载图片
* @param command 下载地址和图片数组[url,file]
*              url:图片下载地址
*              file: 不传递的话默认进相机目录，也可通过当前字段指定其他目录(该参数仅android有效)
*/
PhotoModule.downloadImg(command);
   

   