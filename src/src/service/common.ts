import { getAppJSON } from '../netWork';
import { Toast } from 'antd-mobile';
import Config from 'react-native-config';

export async function getMemberById(memberId: string, success?: (data: any) => void, failure?: (data: any) => void) {
  try {
    const data = await getAppJSON(Config.COUPON_GETMEMBERBYID, { id: memberId });
    if (data && data.success) {
      success && success(data);
    } else {
      failure && failure(data);
    }
  } catch (error) {
    Log(error);
  }
}
