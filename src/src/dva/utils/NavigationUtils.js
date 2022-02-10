import { NavigationActions } from 'react-navigation';

const navigate = ({ dispatch }, name, params) => {
  dispatch(navigateAction(name, params))
};

const back = ({ dispatch }, params) => {
  dispatch(backAction(params))
};

const backTo = ({ dispatch }, name, params) => {
  dispatch(backToAction(name, params))
};

const goHome = ({ dispatch }) => {
  goHomeAction().forEach(a => dispatch(a))
};

const navigateAction = (name, params) =>{
  return NavigationActions.navigate({ routeName: name, params });
};


const backAction = params =>
  NavigationActions.back({
    params,
  });

const backToAction = (name, params) =>
  NavigationActions.back({
    routeName: name,
    params,
  });

const goHomeAction = () => [
  NavigationActions.back({
    routeName: 'HomeNavigator',
  }),
  NavigationActions.back({
    routeName: 'Home',
  }),
];

export default {
  navigate,
  back,
  backTo,
  goHome,

  navigateAction,
  backAction,
  backToAction,
  goHomeAction,
}
