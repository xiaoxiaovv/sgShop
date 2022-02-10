import React, {Component} from 'react'
import {NetInfo} from 'react-native'

const NetInfoDecorator = WrappedComponent => class extends Component {

    state = {
        isConnected: true,
    }

    componentDidMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this._handleNetworkConnectivityChange);
    }

    // componentWillUnmount() {
    //     NetInfo.isConnected.removeEventListener('change');
    // }

    _handleNetworkConnectivityChange = isConnected => {
        console.log('_handleNetworkConnectivityChange isConnected', isConnected)
        this.setState({
            isConnected: isConnected,
        })
    }

    render() {
        return <WrappedComponent {...this.props} {...this.state}/>
    }
}

export default NetInfoDecorator