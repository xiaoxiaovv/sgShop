'use strict';

import React, {Component} from 'react';
import { View, Modal, Dimensions, TouchableOpacity, Image, Text, TextInput, NativeModules, Clipboard } from 'react-native';


export default class CModal extends Component {
    static defaultProps = {

    };
    static propTypes = {
    };


    render() {
        return (
            <Modal
                animationType='fade'
                transparent={true}
                visible={this.state.visible}
            >

            </Modal>
        );
    }


    /**
     * 增加 onConfirm 属性
     * @type {Confirm}
     */
    static confirm = class Confirm extends React.Component {
        render = ()=> {
            return <CModal {...this.props} >
            </CModal>
        };

        onConfirm = (e)=> {
            if (this.props.onConfirm) {
                this.props.onConfirm();
            }
        };

        cancel = (e)=> {
            if (this.props.onClose) {
                this.props.onClose();
            }
        };
    };
}