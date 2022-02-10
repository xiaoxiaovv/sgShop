import * as React from 'react';
import { View, Image, StyleSheet, FlatList, Text, TouchableOpacity, TextInput, StatusBar, Platform } from 'react-native';
import { Drawer, List, Grid, Toast } from 'antd-mobile';
import CustomButton from 'rn-custom-btn1';
import EStyleSheet from 'react-native-extended-stylesheet';

import {fetchService} from '../netWork';
import { createAction, iPhoneXMarginTopStyle } from '../utils';
import Config from 'react-native-config';

import { GET } from './../config/Http';
import { connect } from 'react-redux';
import { ICustomContain } from '../interface';

import URL from './../config/url.js';
let width = URL.width;
let height = URL.height;
let deviceWidth = URL.width;
let deviceHeight = URL.height;
let SWidth = URL.width;
let SHeight = URL.height;

interface ISFilterListOption {
    title?: string;
    options: string[];
    selected: number[];
    ids: string[];
}
interface ISFilterList {
    data: ISFilterListOption[];
    minPrice: string;
    maxPrice: string;
    resetFirstOptionFlag?: boolean;
}

interface IFilterList {
    close: (filtersString?: string) => void;
    categoryId?: string;
    attributeId: string;
    keyword?: string;
    hasStock?: number;
}

const initialData = [
  {
    options: ['显示全部商品', '仅看有货'],
    selected: [0],
    ids: ['all', 'hasStock'],
  },
  {
    title: '价格',
    options: [''],
    selected: [0],
    ids: [''],
  },
];

@connect(({store: { hasStock }}) => ({hasStock}))
class FilterList extends React.Component<IFilterList & ICustomContain> {
    public state: ISFilterList;
    private initData: ISFilterListOption[];

    constructor(props) {
        super(props);

        this.state = {
            minPrice: '',
            maxPrice: '',
            data: initialData,
        };
    }

    public async componentWillMount(){
       let hasStock = await global.getItem('hasStock');
       if(hasStock){
           console.log(`-----FilterList-----componentWillMount---设置有货--hasStock${hasStock}--1`);
           this.resetFirstOption(1);
       }else{
           console.log(`-----FilterList-----componentWillMount---设置全部--hasStock${hasStock}--0`);
           this.resetFirstOption(0);
       }

    }
    public async componentWillReceiveProps(nextProps) {
        if (this.props.categoryId !== nextProps.categoryId) {
            let hasStock = await global.getItem('hasStock');
            if(hasStock){
                console.log(`-----FilterList-----componentWillMount---设置有货--hasStock${hasStock}--1`);
                this.resetFirstOption(1);
            }else{
                console.log(`-----FilterList-----componentWillMount---设置全部--hasStock${hasStock}--0`);
                this.resetFirstOption(0);
            }
          this.requestFilter(nextProps.categoryId, nextProps.attributeId);
        }
        if (nextProps.hasStock !== this.props.hasStock) {
          this.resetFirstOption(nextProps.hasStock);
        }
    }

    public componentDidMount() {
        console.log('---FilterList--componentDidMount-------');
        console.log(this.props.categoryId, '-------' , this.props.attributeId);
        this.requestFilter(this.props.categoryId, this.props.attributeId);
    }

    public render() {
        return (
            <View style={{backgroundColor: '#fff', height: Platform.OS === 'ios' ? height : height - StatusBar.currentHeight}}>
                <Header
                    close={ () => this.props.close()}
                />
                <FlatList
                    style={{backgroundColor: '#fff', flex: 1}}
                    data={this.state.data}
                    extraData={this.state}
                    keyboardDismissMode={'on-drag'}
                    keyboardShouldPersistTaps={'handled'}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem}
                    ListFooterComponent={<View style={{height: 60}} />}
                />
                <Footer
                    close={ () => { this.handleFilterListClose(); }}
                    reset={ () => {
                        // Log(JSON.stringify(this.initData));
                        this.setState({
                            minPrice: '',
                            maxPrice: '',
                            data: JSON.parse(JSON.stringify(this.initData)),
                        });
                    }}
                />
             </View>
        );
    }

    private keyExtractor = (item, index) => index;

    private renderItem = ({item, index}) => (
        <FilterCategory
            item={item}
            index={index}
            selected={this.state.data[index].selected}
            handleOptionSelecting={ (catIndex, opIndex) => this.handleOptionSelecting(catIndex, opIndex) }
            handlePriceInput={ this.handlePriceInput }
            minPrice={this.state.minPrice}
            maxPrice={this.state.maxPrice}
        />
    )

    private resetFirstOption = (hasStock: number) => {
        const newData = this.state.data.slice();
        newData[0].selected = [hasStock];
        this.setState({data: newData});
    }
    private handleOptionSelecting = (categoryIndex, optionIndex) => {
        const newData = this.state.data.slice();
        const currentSelected = newData[categoryIndex].selected;

        if ( optionIndex !== 0 ) {
            const isAllSelected = currentSelected[0] === 0;
            if (isAllSelected) {
                currentSelected.splice(0, 1);
            }

            const optionIndexInSelection = currentSelected.indexOf(optionIndex);
            if (optionIndexInSelection > -1) {
                currentSelected.splice(optionIndexInSelection, 1);
            } else {
                currentSelected.push(optionIndex);
                currentSelected.sort();
            }

            const total = currentSelected.length;
            if (categoryIndex > 1 && total === this.state.data[categoryIndex].options.length - 1) {
                newData[categoryIndex].selected = [0];
            } else if (total === 0) {
                newData[categoryIndex].selected = [0];
            } else if (categoryIndex < 1 && optionIndex > 0) { // 选择「只看有货」
              newData[categoryIndex].selected = [1];
              console.log('----修改有货--');
              global.setItem('hasStock', '1');
              this.props.dispatch(createAction('store/resetFirstOption')({hasStock: 1}));
            }
        } else {
            if(categoryIndex < 1){
                global.setItem('hasStock', '');
                this.props.dispatch(createAction('store/resetFirstOption')({hasStock: 0}));
            }
            newData[categoryIndex].selected = [0];
        }

        this.setState({
            selected: newData,
        });
    }

    private handleFilterListClose = () => {
        if (this.state.data.length > 2) {
            if (this.state.maxPrice &&
                Number.parseInt(this.state.maxPrice) < Number.parseInt(this.state.minPrice)) {
                Toast.info('最低价不能高于最高价', 3);
                return;
            }

            const filters = this.state.data.map( filter => {
                const conditions = filter.selected.map( selection =>
                    filter.ids[selection]);
                // Log(conditions);
                return conditions;
            });

            console.log(filters[0][0]);
            if(filters[0][0] == "all"){
                // 全部
                global.setItem('hasStock', '');
            }else{
                // 有货
                global.setItem('hasStock', '1');
            }

            let filtersString =
                filters[0] + '@'; // 有无货
            // tslint:disable-next-line:triple-equals
            if (filters[2][0] == '0') {
                filtersString += 'all';
            } else {
                filtersString += filters[2].join(';');
            }
            filtersString += '@'; // 品牌

            // 价格
            if ( Number.parseInt(this.state.minPrice) > 0 ) {
                filtersString += this.state.minPrice + ';';

                if ( this.state.maxPrice ) {
                    filtersString += this.state.maxPrice;
                } else {
                    filtersString += 'Undefined';
                }
            } else if (Number.parseInt(this.state.maxPrice) > 0) {
                filtersString += 'Undefined;' + this.state.maxPrice;
            } else {
                filtersString += '0';
            }

            filtersString += '@';

            // 剩余其他参数
            filters.splice(0, 3);
            filtersString += filters.map( filter => filter.join(';')).join(',');
            // Log(filtersString);

            this.props.close(filtersString);

        } else {
            this.props.close();
        }

    }

    private handlePriceInput = (name, value) => {
        if (/^[0-9]*$/.test(value)) {
            this.setState({
                [name]: value,
              });
        }
    }

    private async requestFilter(categoryId, attributeId = this.props.attributeId) {
      const filterConditions = [...initialData];

      try {

          const ress = await GET(`${URL.filter_data}${categoryId ? '?productCateId=' + categoryId : '0'}`);
            const { success, data } = ress;


        // const resp = await fetchService(
        //   `v3/mstore/sg/wdMarketFiltrate.html` + (categoryId ? `?productCateId=${categoryId}` : ''),
        //   {},
        //   Config.API_SEARCH_URL);
        // // Log(resp);
        // const { success, data} = await resp.json();
        // Log('filterData=========', data);


        const brandsId = data.brandList.map(({id}) => id);
        const brandsName = data.brandList.map(({brandName}) => brandName);
        filterConditions.push({
          title: '品牌',
          options: brandsName,
          ids: brandsId,
          selected: [brandsId.indexOf(Number.parseInt(attributeId)) > 0 ? brandsId.indexOf(Number.parseInt(attributeId)) : 0],
        });
        if (categoryId) {
          data.filterMap.lstAttributes.map(attributeOption => {
            // Log(attributeOption);
            const title = attributeOption.attrName;
            const attributeIdArray = attributeOption.lstAttributeOptions.map(({id}) => id);
            // console.log(attributeIdArray);
            //   console.log('---------requestFilter----------', attributeId);
            // console.log(attributeIdArray.indexOf(Number.parseInt(attributeId)));
            const attributeName = attributeOption.lstAttributeOptions.map(({optionValue}) => optionValue);
            filterConditions.push({
              title,
              options: attributeName,
              ids: attributeIdArray,
              selected: [attributeIdArray.indexOf(Number.parseInt(attributeId)) > 0 ? attributeIdArray.indexOf(Number.parseInt(attributeId)) : 0],
            });
          });
        }
      } catch (err) {
        Log('err', err);
      }

      this.setState({
        data: filterConditions,
      });

      this.initData = JSON.parse(JSON.stringify(filterConditions));
    }
}

const renderOption = (catIndex, option, index, selected, handleOptionSelecting, handlePriceInput, min, max) => {
    // Log(selected, index);
    const isSelected = selected.some( item => item === index );
    // Log(isSelected);
    return (
        <View>
        {catIndex !== 1 ?
            <TouchableOpacity
                activeOpacity={1}
                style={[styles.option, isSelected && styles.selected]}
                onPress={ () => handleOptionSelecting(catIndex, index) }
            >
                <Text style={{fontSize: 12}}> {option ? option : null} </Text>
                { isSelected && <Image
                    style={{width: 15, height: 15, position: 'absolute', right: 0, bottom: 0}}
                    source={require('../images/ic_other_x.png')}
                />}
            </TouchableOpacity>
            :
            <View style={{flexDirection: 'row'}}>
                <TextInput
                    style={styles.priceInput} placeholder='最低价'
                    underlineColorAndroid='transparent'
                    value={`${min}`}
                    onChangeText={ (text) => handlePriceInput('minPrice', text) }/>
                <View style={styles.priceSeparator}/>
                <TextInput
                    style={styles.priceInput} placeholder='最高价'
                    underlineColorAndroid='transparent'
                    value={`${max}`}
                    onChangeText={ (text) => handlePriceInput('maxPrice', text) }/>
            </View>
        }
        </View>
    );
};

interface IFilterCategory {
    item: any;
    index: number;
    selected: any;
    handleOptionSelecting: any;
    handlePriceInput: any;
    minPrice: string;
    maxPrice: string;
}

interface ISFilterCategory {
    isChildrenShown: boolean;
}

// tslint:disable-next-line:max-classes-per-file
class FilterCategory extends React.Component<IFilterCategory> {
    public state: ISFilterCategory;
    constructor(props) {
        super(props);
        this.state = {
            isChildrenShown: true,
        };
    }

    public render() {
        const options = this.props.item.options;
        const optionsLength = options.length;
        return (
            <View style={{marginTop: 10, marginBottom: 5}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{paddingLeft: 10}}>{this.props.item.title}</Text>
                    { this.props.index > 0 && <TouchableOpacity
                        onPress={ () => this.showChildren() }
                    >
                        <Image
                            style={[{width: 12, height: 12, marginRight: 20},
                                    !this.state.isChildrenShown && styles.showChildren]}
                            source={require('../images/ic_other_arrow.png')}
                        />
                    </TouchableOpacity>}
                </View>
                { this.state.isChildrenShown && <Grid
                    data={options}
                    columnNum={ optionsLength > 2 ? 3 : optionsLength }
                    hasLine={false}
                    renderItem={
                        (option, index) =>
                            renderOption(this.props.index, option, index, this.props.selected,
                                (catIndex, opIndex) => this.props.handleOptionSelecting(catIndex, opIndex),
                                this.props.handlePriceInput, this.props.minPrice, this.props.maxPrice )
                    }
                    itemStyle={{height: 50}}
                />}
            </View>
        );
    }

    private showChildren = () => {
        this.setState({
            isChildrenShown: !this.state.isChildrenShown,
        });
    }
}

const Header = (props) => {
    return (
        <View style={[styles.header, iPhoneXMarginTopStyle]}>
            <CustomButton
                style={{ width: 20, height: 20}}
                imageStyle={{ width: 20, height: 20, resizeMode: 'contain' }}
                image={require('../images/left.png')}
                onPress= {() => { props.close(); }}
            />
            <View
                style={{alignItems: 'center', flexGrow: 1}}>
                <Text
                    style={{fontSize: 18, fontWeight: '500'}}>
                    筛选
                </Text>
            </View>
        </View>
    );
};

const FilterButton = ({text, bgColor, textColor, onPress}) => (
    <TouchableOpacity style={{flex: 1}} onPress={onPress}>
        <View style={{backgroundColor: bgColor, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: textColor}}>{text}</Text>
        </View>
    </TouchableOpacity>
);

const Footer = (props) => (
    <View
        style={styles.footer}
    >
       <FilterButton
        text='重置' bgColor='#fff' textColor='#333' onPress={() => {
            props.reset(); }}/>
       <FilterButton
        text='确定' bgColor='#2979FF' textColor='#fff' onPress={() => { props.close(); }}/>
    </View>
);

const styles = EStyleSheet.create({
    footer: {
        height: 40,
        flexDirection: 'row',
        width: '100%',
        borderTopColor: '#EEE',
        borderTopWidth: 1,
        marginBottom: '$xBottom',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        // paddingBottom: 10,
        height: 40,
        // paddingTop: 10,
        backgroundColor: '#fff',
    },
    option: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
        margin: 5,
        backgroundColor: '#F5F5F5',
        borderRadius: 4,
    },
    selected: {
        borderColor: '#2979FF',
        borderWidth: 1,
    },
    priceInput: {
        height: 30,
        // borderColor: 'gray',
        // borderWidth: 1,
        flexGrow: 1,
        fontSize: 12,
        backgroundColor: '#F5F5F5',
        borderRadius: 4,
        padding: 0,
        // margin: 10,
        textAlign: 'center',
    },
    priceSeparator: {
        alignSelf: 'center',
        height: 1,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        width: 10,
        margin: 5,
    },
    showChildren: {
        transform: ([{ rotate: '-90deg'}]),
    },
});

export default FilterList;
