import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Platform, BackHandler,  TouchableOpacity, Modal } from 'react-native';
import { ICustomContain } from '../../../interface/index';
import { createAction } from '../../../utils';


class AuthenticationModal extends React.Component<ICustomContain>{
    constructor(props) {
        super(props);
    }
    public render(): JSX.Element{
        
        return (
            dvaStore.getState().mainReducer.isTrueAuthentication ?
             <View style={{flex: 1,backgroundColor:'rgba(0,0,0,0.5)',alignItems:'center',justifyContent:'center',position:'absolute',left:0,right:0,top:0,bottom:0}}>

                 <View style={{alignSelf:'flex-end', marginRight: 30}}>
                     <TouchableOpacity onPress={()=>{dvaStore.dispatch(createAction('mainReducer/stateChange')({isTrueAuthentication: false}))}}>
                         <Image
                             style={{width:28,height:28}}
                             source={require('../../../images/hisclose.png')}/>
                     </TouchableOpacity>
                     <View style={{width:1,height:26,backgroundColor:'#fff',marginLeft:12}} />
                 </View>
                 <View style={{ width: '90%',backgroundColor:'#fff',borderRadius:10,position:'relative'}}>
                <View style={{padding:14}}>
                    <Text style={{fontSize:14}}> 亲，为了遵守相关法律法规，配合监管要求，确保您享有安全，便捷的平台服务，信息不全的微店主，统一要求完成身份认证，系统会进行提示和引导。</Text>
                    <Text style={{marginTop:10,marginBottom:10}}>未认证的微店主无法正常使用App，谢谢配合！</Text>
                </View>
                <View style={{width:'100%',alignItems:'center',justifyContent:'center',marginBottom:16,borderRadius:10,}}>
                    <TouchableOpacity 
                         onPress={()=>{
                             dvaStore.dispatch(createAction('router/apply')({ type: 'Navigation/NAVIGATE', routeName: 'IdentityAuthentication' }));
                             dvaStore.dispatch(createAction('mainReducer/stateChange')({isTrueAuthentication: false}))
                            }
                            }
                         style={{width:'80%',borderRadius:10,height:44,backgroundColor:'#2464E6'}}>
                        <Text style={{textAlign:'center',width:'100%',height:44,color:'#fff',fontSize:14,lineHeight:44,borderRadius:10,}}>开始认证</Text>
                    </TouchableOpacity>
                </View>
            </View>  
          
        </View>
        :
        null
        );

    }   
}

export default AuthenticationModal;

