import * as React from 'react';
import { View, Text } from 'react-native';
import Button from 'rn-custom-btn1';
import EStyleSheet from 'react-native-extended-stylesheet';

export interface IExpandTextProps {
  style: object;
  titleStyle?: object;
  expandBtn?: any;
  title: string;
}

export interface IExpandTextState {
  expand: boolean;
  canExpand: boolean;
}

export default class ExpandText extends React.Component<IExpandTextProps, IExpandTextState> {
  constructor(props: IExpandTextProps) {
    super(props);

    this.state = {
      expand: true,
      canExpand: true,
    }
  }

  private firstLoading: boolean = false;

  render() {
    const { style, titleStyle, title, expandBtn } = this.props;
    const lines = this.state.expand ? 0 : 2;
    return (
      <View style={[style, { padding: 12 }]}>
        <Text
          {...this.props}
          numberOfLines={lines}
          onLayout={({ nativeEvent: { layout: {x, y, width, height }} }) => {
            if (this.firstLoading) return;
            this.firstLoading = true;
            if (height > (20 * rem + 1) * 2) {
              this.setState({ expand: false, canExpand: true })
            } else {
              this.setState({ expand: true, canExpand: false })
            } 
          }}
          style={[titleStyle, styles.title, { marginBottom: this.state.canExpand ? 16 : 0 }]}
        >
          {title}
        </Text>
        {this.state.canExpand && (
          // expandBtn ||
          <Button
            title={this.state.expand ? '收起' : '展开'}
            style={styles.expand}
            textStyle={styles.expandText}
            onPress={() => this.setState({ expand: !this.state.expand })}
          />
        )}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  expand: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  title: {
    lineHeight: '20rem',
    backgroundColor: 'transparent',
    fontSize: '$fontSize3',
    color: '$black',
  },
  expandText: {
    color: '$darkblue',
    fontSize: '$fontSize2',
  },
})
