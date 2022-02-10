import React from 'react';
import {TouchableOpacity} from 'react-native';
import {createAction,connect} from "../utils";

@connect(({users: {isLogin}}) => ({isLogin}))
export default class IsLoginTouchableOpacity extends React.PureComponent {

    lastTime = 0;

    static defaultProps = {
        disable: false,//默认可点击
    };

    componentWillUnmount() {
        this.lastTime = 0;
    }

    render() {
        return (
            <TouchableOpacity
                activeOpacity={this.props.disable ? 1 : this.props.activeOpacity}
                {...this.props}
                style={this.props.style}
                onPress={() => this._onPress()}/>
        )
    }

    _onPress = () => {
        if (this.props.disable) return;

        this.currentTime = Date.now();
        if (this.currentTime - this.lastTime > 1000) {
            this.lastTime = this.currentTime;
            if(this.props.isLogin){
              this.props.onPress()
            }else {
              dvaStore.dispatch(createAction('router/apply')({
                type: 'Navigation/NAVIGATE', routeName: 'Login',
              }));
            }

        }

    }

}
