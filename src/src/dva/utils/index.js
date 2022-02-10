

const createAction = type => payload => ({ type, payload });
const action = (type, payload) => ({ type, payload });
const delay = time => new Promise(resolve => setTimeout(resolve, time));
const getCurrentScreen =  (navigationState)=> {
    if (!navigationState) {
        return null
    }
    const route = navigationState.routes[navigationState.index];
    if (route.routes) {
        return getCurrentScreen(route)
    }
    return route
};

import { default as NavigationUtils } from './NavigationUtils';


import { NavigationActions } from 'react-navigation'

export {
    action,
    createAction,
    NavigationUtils,
    NavigationActions,
    getCurrentScreen,
    delay,
}
