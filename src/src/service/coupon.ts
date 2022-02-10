import { getAppJSON, postAppJSON } from '../netWork';
import { Alert } from 'react-native';
import { isLogin } from '../utils';
import { Toast } from 'antd-mobile';
import Config from 'react-native-config';
import { getMemberById } from './common';

export async function getCoupon(couponId: string, success?: () => void, failure?: () => void) {
  if (!isLogin()) { return; }
  try {
    const { data } = await getAppJSON(Config.GOODS_RECEIVE_COUPON, { couponId });
    if (data && success) { 
      Toast.info('领取成功', 1);
      success(); 
    }
  } catch (error) {
    failure && failure();
    Log(error);
  }
}

export async function couponGiveOther(memberId: string, couponId, success?: () => void, failure?: () => void) {
  try {
    const { data, success: resultScs, result, message } = await postAppJSON(`${Config.COUPON_GIVE_OTHER}?memberId=${memberId}&id=${couponId}`);
    if (resultScs) {
      if (!result) {
        Toast.show(message);
      } else {
        success && success();
        Toast.show('转赠成功');
      }
    } else {
      failure && failure();
      Toast.show(message);
    }
  } catch (error) {
    failure && failure();
    Log(error);
  }
}
