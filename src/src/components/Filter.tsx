import * as React from 'react';
import { View, Text } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Button from 'rn-custom-btn1';
import PropTypes from 'prop-types';

interface IFilterProps {
  title?: string;
  contentArr?: any;
  onPress?: (beSelected: boolean, name: any,) => void;
  selectItem?: number|string;
  style?: object;
  local?: { titleStyle?: object, btnStyle?: object, btnLocal?: object };
  disableFun?: (item: any,) => boolean;
}

// interface IFilterState {
//   selectItem?: any;
// }

export default class Filter extends React.Component<IFilterProps> {
  constructor(props: IFilterProps) {
    super(props);

    this.state = {
    };
  }

  public render(): JSX.Element {
    const { title, contentArr, selectItem, onPress, style, local, disableFun } = this.props;
    const btnLocal = local ? local.btnLocal : {};
    return (
      <View style={[styles.container, style]}>
        {title && <Text style={[styles.title, local && local.titleStyle]}>{title}</Text>}
        <View style={styles.btnContain}>
          {contentArr.toJS().map((item, index) => {
            const disable = disableFun && disableFun(item);
            return (
              <Button
                key={`keys${index}`}
                selected={item.id === selectItem}
                style={[styles.btn, local && local.btnStyle]}
                selectedTextS={{ color: 'white'}}
                textStyle={[{ fontSize: 11, color: '#333333' }, disable && styles.disableBtnText]}
                disable={disable}
                title={item.attrValueName}
                onPress={() => onPress && onPress((item.id === selectItem), item)}
                local={{
                  selectedBG: '#2979FF',
                  disableBG: '#F5F5F5',
                  ...btnLocal,
                }}
              />
            );
          })}
        </View>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: '375rem',
  },
  title: {
    margin: 8,
    marginBottom: 4,
    fontSize: '13rem',
  },
  btnContain: {
    flexDirection: 'row',
    padding: 4,
    // height:40,
    flexWrap: 'wrap',
  },
  btn: {
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    margin: 4,
  },
  disableBtn: {
    backgroundColor: 'red',
  },
  disableBtnText: {
    color: '$gray',
  },
});
