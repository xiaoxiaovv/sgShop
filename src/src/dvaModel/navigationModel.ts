// import { routerReducer, conditionNavigate, loginSuccess } from './navigationHelper';
import { routerReducer, conditionNavigate, getCurrentScreen } from './navigationHelper';
import { Platform, StatusBar } from 'react-native';
import { addNavigationHelpers, StackNavigator, NavigationActions } from 'react-navigation';
import Orientation from 'react-native-orientation';


const delay = time => new Promise(resolve => setTimeout(resolve, time));
const actions = [
  NavigationActions.BACK,
  NavigationActions.INIT,
  NavigationActions.NAVIGATE,
  NavigationActions.RESET,
  NavigationActions.SET_PARAMS,
  NavigationActions.URI,
];

const android = Platform.OS == 'android';

let beNavigate = false;
export default {
  namespace: 'router',
  state: {
    ...routerReducer(),
  },
  reducers: {
    apply(state, { payload: action }) {
      return routerReducer(state, action);
    },
    backTo(state, { payload: key }) {
      return routerReducer(state, { type: 'backTo', key });
    },
    conditionNavigate(state, { payload: key }) {
      return conditionNavigate(state, { type: 'navigateWith', key });
    },
    // loginSuccess(state, { payload }) {
    //   return loginSuccess( state, payload );
    // },
  },
  effects: {
    // 每次自动调用
    watch: [
      function* watch({ take, call, put, select }) {
        const loop = true;
        while (loop) {
          const payload = yield take(actions);
          
          yield put({
            type: 'apply',
            payload,
          });

          const nextRouter = yield select(state => state.router);
          let next = getCurrentScreen(nextRouter);
          
          if (next == 'ScenePage') {
            // 只允许横屏
            StatusBar.setHidden(true, 'fade');
            if (android) {
              Orientation.lockToLandscape();
            } else {
              // Orientation.lockToPortrait();
              // Orientation.lockToLandscape();
              Orientation.lockToLandscapeRight();
            }
          } else {
            // 只允许竖屏
            StatusBar.setHidden(false, 'fade');
            Orientation.getOrientation((err, orientation) => {
              if (orientation !== 'PORTRAIT') {
                // Orientation.lockToLandscape();
                Orientation.lockToPortrait();
              }
              // console.log(`Current Device Orientation: ${orientation}`);
            });
          }
          // // debounce, see https://github.com/react-community/react-navigation/issues/271
          // if (payload.type === 'Navigation/NAVIGATE') {
          //   beNavigate = true;
          //   setTimeout(() => beNavigate = false, 500);
          //   // yield call(delay, 500);
          // }
        }
      },
      { type: 'watcher' },
    ],
  },
};
