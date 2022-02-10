import { createAction } from '../utils';
import { getAppJSON } from '../netWork';

export default {
  namespace: 'flashsale',
  state: {
    isWd: false,
    dateTabs: [],
    bannerList: [],
    activeTabIndex: 0,
  },
  reducers: {
    loadData(state, { payload }): any {
      return { ...state, ...payload };
    },
  },
  effects: {
    *fetchFlashInfo({ payload }, { call, put, select }) {
      try {
        const locationObj = yield select(({ address }) => address);
        const { provinceId, cityId, areaId: districtId, streetId } = locationObj;
        const { typeNumber } = payload;

        const param = {
          provinceId,
          cityId,
          districtId,
          streetId,
          from: typeNumber,
        };
        const { success, data } = yield call(
          getAppJSON,
          'sg/cms/flashSales/docker.json',
          param,
        );
        if (success && data) {
          const { flashTimeProductMap } = data;
          const dateTabs = [];
          for (const key of Object.keys(flashTimeProductMap)) {
            if (flashTimeProductMap[key]) {
              const flashTimeProduct = flashTimeProductMap[key];

              // 将每一天的几场活动由map转换成array
              // todo 确认是按时间排序
              const flashArrayInOneDay = [];
              for (const k of Object.keys(flashTimeProduct)) {
                if (flashTimeProduct[k]) {
                  const subFlashTimeProduct = flashTimeProduct[k];
                  flashArrayInOneDay.push({
                    time: k,
                    flashArray: subFlashTimeProduct,
                  });
                }
              }

              dateTabs.push({
                localeTime: chineseDateFormating(key),
                slashTime: key,
                differentDayFlashArray: flashArrayInOneDay,
              });
            }
          }

          yield put(createAction('loadData')({
            isWd: data.isWd,
            dateTabs,
            activeTabIndex: 0,
          }));
        }
      } catch (error) {
        Log(error);
      }
    },
    *fetchBanner({ payload }, { call, put }) {
      const { success, data } = yield call(
        getAppJSON,
        'sg/cms/secondPageBanner.json',
        { type: 2 },
      );
      if (success && data) {
        if (data.topBanner) {
          yield put(createAction('loadData')({bannerList: data.topBanner}));
        }
      }
    },
  },
};

const chineseDateFormating = (slashDateStr): string => {
  const dateModuleArray = slashDateStr.split('/');
  if (dateModuleArray.constructor === Array && dateModuleArray.length === 3) {
    return `${dateModuleArray[1]}月${dateModuleArray[2]}日`;
  }
}
