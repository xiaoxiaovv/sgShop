import { ViewStyle, TextStyle } from 'react-native';

export interface IRadioStyle {
  wrapper: ViewStyle;
  icon: ViewStyle;
  radioItem: ViewStyle;
  radioItemRadio: ViewStyle;
  radioItemContent: TextStyle;
  radioItemContentDisable: TextStyle;
}

export default {
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 15,
    height: 15 ,
      backgroundColor:'transparent'
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioItemRadio: {
    marginLeft: 15,
    marginRight: 8,
  },
  radioItemContent: {
    color: '#000',
    fontSize: 17,
  },
  radioItemContentDisable: {
    color: '#bbbbbb',
  },
};
