import * as React from 'react';
import {ScrollView, Image} from 'react-native';
import {INavigation} from '../../../interface';
import {List} from 'antd-mobile';
import Header from '../../../components/Header';

const Item = List.Item;
const bankArray = [
    {
        img: require('../../../images/1citic.png'),
        code: '03020000',
        name: '中信银行',
    },
    {
        img: require('../../../images/2abc.png'),
        code: '01030000',
        name: '农业银行',
    },
    {
        img: require('../../../images/3icbc.png'),
        code: '01020000',
        name: '工商银行',
    },
    {
        img: require('../../../images/4ccb.png'),
        code: '01050000',
        name: '建设银行',
    },
    {
        img: require('../../../images/5cbm.png'),
        code: '03080000',
        name: '招商银行',
    },
    {
        img: require('../../../images/6szpab.png'),
        code: '03180000',
        name: '平安银行',
    },
    {
        img: require('../../../images/7boc.png'),
        code: '01040000',
        name: '中国银行',
    },
    {
        img: require('../../../images/8cib.png'),
        code: '03090000',
        name: '兴业银行',
    },
    {
        img: require('../../../images/9spdb.png'),
        code: '03100000',
        name: '浦发银行',
    },
    {
        img: require('../../../images/10cmbc.png'),
        code: '03050000',
        name: '民生银行',
    },
    {
        img: require('../../../images/11hxb.png'),
        code: '03040000',
        name: '华夏银行',
    },
    {
        img: require('../../../images/12ceb1.png'),
        code: '03030000',
        name: '光大银行',
    },
    {
        img: require('../../../images/13psbc.png'),
        code: '01000000',
        name: '邮储银行',
    },
    {
        img: require('../../../images/14comm.png'),
        code: '03010000',
        name: '交通银行',
    },
    {
        img: require('../../../images/15bccb.png'),
        code: '04031000',
        name: '北京银行',
    },
    {
        img: require('../../../images/16gdb.png'),
        code: '03060000',
        name: '广发银行',
    },
    {
        img: require('../../../images/17egbank.png'),
        code: '03110000',
        name: '恒丰银行',
    },
    {
        img: require('../../../images/18hccb.png'),
        code: '04233310',
        name: '杭州银行',
    },
    {
        img: require('../../../images/19nbcb.png'),
        code: '04083320',
        name: '宁波银行',
    },
];

/**
 * 支持银行
 */
export default class SupportingBanks extends React.Component<INavigation> {

    private static navigationOptions = ({navigation}) => {
        return {header: <Header goBack={() => navigation.goBack()} title={"支持银行"}/>};
    };

    public render(): JSX.Element {
        return (
            <ScrollView>
                <List>
                    {
                        bankArray.map((item, index) => {
                            return (
                                <Item thumb={
                                    <Image
                                        style={{height: 20, width: 20, marginRight: 10}}
                                        source={item.img}/>
                                }>
                                    {item.name}
                                </Item>
                            );
                        })
                    }
                </List>
            </ScrollView>
        );
    }
}
