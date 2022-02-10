/**
 *  视频录制、选择、压缩、播放、下载、上传
 */
// 模块名称
VedioModule

 /**
 * 录制 选择 压缩
 * @param command 数组［最小录制时间,最大录制时间,压缩后的阀值,相册选择最大值］
 *  @params success: 例如：{"videoFile":"视频路径","imageFile":"视频缩略图路径"}
 */
VedioModule.recordVideo(command);//返回视频file

/**
* 视频下载
* @param command [url,mark]
*              url:视频下载地址
*              mark: 标示  启动页播放时传递1，其余为0或不传
*/
VedioModule.downloadVideo(command);

/**
* 上传视频文件
* @param command ［filePath, url, token］
*              filePath 视频地址
*              url:上传服务器url
*              token    token
*/
VedioModule.uploadVideo(command);//返回视频url

/**
* 播放视频文件
* @param command ［videoUrl, imgUrl］
*              videoUrlStr: 播放视频的地址
*              imgUrlStr: 第一帧图片的地址 (进android使用这个参数)
*/
VedioModule.playVideo(command);
   

   