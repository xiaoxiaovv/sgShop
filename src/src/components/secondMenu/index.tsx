import * as React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {BUTTON_TYPE, MenuItem} from './MenuItem';
import CustomButton from 'rn-custom-btn1';
import {Color, Font} from 'consts';

const arrowImages: object[] = [
    require('../../images/arrow_state_normal.png'),
    require('../../images/arrow_state_descend.png'),
    require('../../images/arrow_state_ascend.png'),
];

const comprehensive: MenuItem = new MenuItem('综合', BUTTON_TYPE.SINGLE,
                                [
                                    require('../../images/comprehensive_normal.png'),
                                    require('../../images/comprehensive_descend.png'),
                                ]);

const commission: MenuItem = new MenuItem('佣金', BUTTON_TYPE.DOUBLE, arrowImages);
const sales: MenuItem = new MenuItem('销量', BUTTON_TYPE.NONE);
const price: MenuItem = new MenuItem('价格', BUTTON_TYPE.DOUBLE, arrowImages);
const filter: MenuItem = new MenuItem('筛选', BUTTON_TYPE.SINGLE,
                                [
                                    require('../../images/filter_state_normal.png'),
                                    require('../../images/filter_state_select.png'),
                                ]);

let conditions: MenuItem[] = [];

interface ISecondMenu {
    handleFilterDataUpdate: (filterData: string) => void;
    handleDrawerOpen: () => void;
    attributeId: string;
}
interface ISecondMenuState {
    selectedItem: number;
}
class SecondMenu extends React.Component<ISecondMenu> {
    public state: ISecondMenuState;

    constructor(props) {
        super(props);
        this.state = {
            // selectedItem: this.props.attributeId ? 4 : 0,
            selectedItem: 0,
            // selectedItem: (dvaStore.getState().users.isHost === 1 && dvaStore.getState().users.CommissionNotice) ? 4 : 3,
        };
        conditions = (dvaStore.getState().users.isHost === 1 && dvaStore.getState().users.CommissionNotice) ?
            [comprehensive, commission, sales, price, filter] : [comprehensive, sales, price, filter];
        conditions[0].nextState();
    }

    componentWillUnmount() {
        conditions[this.state.selectedItem].resetState();
        this.state = {
            selectedItem: 0,
        };
    }

    public render(): JSX.Element {
        const selectedItem = this.state.selectedItem;
        const { attributeId } = this.props;
        return (
         <View style={styles.container}>
           {
               conditions.map((item, index) => {
                   const isSelected: boolean = index === selectedItem;
                //    return <Text>{item.getTitle()}</Text>;
                   return <CustomButton
                        key={index}
                        title={item.getTitle()}
                        innerStyle={{flexDirection: 'row-reverse'}}
                        textStyle={[{ fontSize: Font.NORMAL_1 }, isSelected ? { color: Color.BLUE_1 } : {color: Color.GREY_1}]}
                        imageStyle={{ marginLeft: -2, width: 10, height: 10, resizeMode: 'contain' }}
                        image={ item.getImage()}
                        onPress= { () => this.handleMenuItemClicked(index) }
                    />;
               })
           }
        </View>);
    }

    private handleMenuItemClicked = (index) => {
        const currentItem = this.state.selectedItem;
        if (index !== currentItem) {
            conditions[this.state.selectedItem].resetState();
        }

        this.setState({
            selectedItem: index,
        });

        if (index === conditions.length - 1) {
            this.props.handleDrawerOpen();
        }

        const condition = conditions[index];
        condition.nextState();

        let filterData;

        if (conditions.length > 4) {
            switch (index) {
                case 0:
                    filterData = 'isHotDesc';
                    break;
                case 1:
                    filterData = condition.getState() > 1 ? 'commission' : 'commissionDesc';
                    break;
                case 2:
                    filterData = 'saleDesc';
                    break;
                case 3:
                    filterData = condition.getState() > 1 ? 'price' : 'priceDesc';
                    break;
            }
        } else {
          switch (index) {
            case 0:
              filterData = 'isHotDesc';
              break;
            case 1:
              filterData = 'saleDesc';
              break;
            case 2:
              filterData = condition.getState() > 1 ? 'price' : 'priceDesc';
              break;
          }

        }
        if (filterData) {
            this.props.handleFilterDataUpdate(filterData);
        }
    }
}

const styles = EStyleSheet.create({
   container: {
       height: 44,
       flexDirection: 'row',
       justifyContent: 'space-around',
       alignItems: 'center',
       backgroundColor: 'white',
       borderBottomWidth: 1,
       borderBottomColor: Color.GREY_6,
   },
});
export default SecondMenu;
