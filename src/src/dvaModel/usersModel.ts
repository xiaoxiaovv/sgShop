import { Iusers } from '../interface';
import { createAction, isLogin, IS_NOTNIL } from '../utils';
import { fetchUnread } from './homeModel';
import {homeDressService} from '../dva/service';
import {action} from '../dva/utils';

const initialState = {
  CommissionNotice: true,
  ReflectedNotice: true,
  mobile : '',
  rankName : '',
  cartNumber : '',
  sessionKey : '',
  userId : '',
  token : '',
  userName : '',
  mid : '',
  avatarImageFileId : '',
  nickName : '',
  gender : '',
  email : '',
  birthday : '',
  sessionValue : '',
  loginName : '',
  ucId : '',
  accessToken : '',
  // userToken: '2e630712-3ae9-4e25-be38-013ba7092986293',
  userToken: '',
  isLogin: false,
  isHost: -1, // 是否是微店主 -1:未登录 0:普通用户 1:微店主
  unread: 0,
  userCount: -1, // 用户名 默认是 -1
  password: '', // 密码
};
export default {
  namespace: 'users',
  state: initialState,
  reducers: {
      changeReflectedNotice(state, { payload }): any {
          const { ReflectedNotice } = payload;
          return { ...state, ReflectedNotice};
      },
      saveUsersMsg(state, { payload }): Iusers {
          if(payload.mid){
            return { ...state, ...payload, userId: payload.mid }; 
          }else{
            return { ...state, ...payload };
          }
      },
      clearUserLoginInfo(): Iusers {
        // global.removeItem('userToken');
        return initialState;
      },
      stateChange(state, { payload }) {
        return { ...state, ...payload };
      },
      updateAvatarImageFileId(state, { payload }) {
        return { ...state, ...payload };
      },
      save(state, {payload}): any {
          return {...state, ...payload};
      },
  },
  effects: {
        *getUnreadMessage({ payload }, { call, put }) {
            try {
                if (isLogin(() => Log('====☹️☹️没登录☹️☹️====='))) {
                    const unread = yield call(fetchUnread);
                    if (IS_NOTNIL(unread)) {
                        yield put(createAction('stateChange')({ unread }));
                    }
                }
            } catch (error) {
                Log(error);
            }
        },
        //变更是否显示佣金 value true:显示佣金，false：不显示佣金
      * changeCommission({payload: {CommissionNotice}}, {call, put, select}) {
          try {
              console.log('changeCommission CommissionNotice',CommissionNotice)
              yield put(action("save", {CommissionNotice: CommissionNotice}));
              if(CommissionNotice){//显示佣金
                  global.setItem('CommissionNotice','a');
              }else {//不显示佣金
                  global.setItem('CommissionNotice','b');
              }
          } catch (e) {
              console.log(e)
          }
      },
  },
};
