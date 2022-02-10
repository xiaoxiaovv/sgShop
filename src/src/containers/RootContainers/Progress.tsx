import * as React from 'react';
import { View, StyleSheet} from 'react-native';
// import LottieView from 'lottie-react-native';

class Progress extends React.Component {
    public componentDidMount() {
        this.animation.play();
    }
    public render(): JSX.Element {
        return (
         <View style={styles.container}>
           <View style={{backgroundColor: 'transparent'}}>
               {/* <LottieView
                ref={animation => {
                    this.animation = animation;
                    }}
                 style={{width: 100, height: 100}}
                 source={require('../../common/animations/sprint.json')}
                 loop
               /> */}
           </View>
        </View>);
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        top: 0,
        left: 0,
        position: 'absolute',
    },
});
export default Progress;
