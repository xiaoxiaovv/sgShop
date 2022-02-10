import * as React from 'react';
import { View, Image, Text } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Button from 'rn-custom-btn1';
import { List } from 'immutable';

interface IEvaluateHeaderProps {
  contentArr: Array<{ title: string, image?: any, key: string }>;
  selectItem?: string|number;
  onPress?: any;
  disable?: boolean;
  positiveRate: number;
  evaluateImpression: List<{ title: string }>;
}

export interface IEvaluateHeaderState {
  expand: boolean;
}

class EvaluateHeader extends React.PureComponent<IEvaluateHeaderProps, IEvaluateHeaderState> {
  constructor(props: IEvaluateHeaderProps) {
    super(props);

    this.state = {
      expand: false,
    };
  }

  public render(): JSX.Element {
    const { contentArr, positiveRate, evaluateImpression, selectItem, onPress } = this.props;
    return (
      <View style={{ backgroundColor: 'white' }}>
        <View  style={styles.container}>
          <Image style={styles.image} source={require('../../../images/bqkiss.png')} />
          <Text style={styles.positiveRate}>{`${positiveRate}%`}</Text>
          <Text style={styles.evaluate}>好评</Text>
        </View>
        <View style={styles.btnContainer} >
          {contentArr.map(({ title, image, key }, index) => (
            <Button
              key={`keys${index}`}
              selected={ typeof selectItem === 'number' ? selectItem === index : selectItem === key}
              style={(typeof selectItem === 'number' ? selectItem === index : selectItem === key) ?
                      [styles.btn, styles.selectBtn] :
                      styles.btn
                    }
              selectedTextS={styles.selectBtnText}
              textStyle={styles.btnText}
              title={title}
              image={image}
              onPress={() => onPress && onPress(index, key)}
              local={{ selectedBG: 'rgba(255, 68, 0, 0.05)' }}
            />
          ))}
        </View>
        {this.state.expand &&
          <View style={[styles.btnContainer, styles.impression]} >
            {evaluateImpression && evaluateImpression.toJS().map(({ title }, index) => (
              <Button
                key={`keys${index}`}
                style={styles.btn}
                textStyle={styles.btnText}
                title={title}
                disable
              />
            ))}
          </View>
        }
        {evaluateImpression && evaluateImpression.size > 0 &&
          <Button
            style={styles.expandBtn}
            imageStyle={styles.expandImge}
            image={this.state.expand ? require('../../../images/arrowup.png') : require('../../../images/arrowdown.png')}
            onPress={() => this.setState({ expand: !this.state.expand })}
          />
        }
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: '375rem',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 16,
  },
  image: {
    width: '32rem',
    height: '35rem',
    resizeMode: 'contain',
    margin: 4,
  },
  positiveRate: {
    fontSize: '30rem',
    color: '$darkblack',
    fontWeight: 'bold',
    margin: 4,
  },
  evaluate: {
    fontSize: '$fontSize4',
    color: '$darkblack',
    margin: 4,
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  btnContainer: {
    width: '375rem',
    padding: '12rem',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  impression: {
    borderTopColor: '$lightgray',
    borderTopWidth: 8,
    overflow: 'hidden',
  },
  btn: {
    minWidth: '108.5rem',
    height: '32rem',
    margin: '4rem',
    borderRadius: '4rem',
    borderWidth: 1,
    borderColor: '$lightgray',
    backgroundColor: 'white',
    padding: 0,
  },
  btnText: {
    fontSize: '$fontSize2',
    color: '$black',
  },
  selectBtn: {
    borderColor: '$darkred',
  },
  selectBtnText: {
    color: '$darkred',
  },
  expandBtn: {
    width: '375rem',
    height: 44,
    // backgroundColor: 'red',
    marginTop: -16,
  },
  expandImge: {
    width: 50,
    height: 30,
    resizeMode: 'contain',
  },
});
export default EvaluateHeader;
