import { getAppJSON } from '../netWork';

export async function queryProjectNotice() {
  return getAppJSON('/api/project/notice');
}
