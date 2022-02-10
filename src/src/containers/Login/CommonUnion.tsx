import * as React from 'react';
import { View, ScrollView } from 'react-native';
import { getAppJSON } from '../../netWork';
import Config from 'react-native-config';
import { INavigation } from '../../interface';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import EStyleSheet from 'react-native-extended-stylesheet';

interface IState {
    unionList: string[];
    selectValue: number;
}
export default class CommonUnion extends React.Component<INavigation, IState> {

    constructor(props) {
        super(props);
        this.state = {
            unionList: [],
            selectValue: -1,
        };
    }

    public render() {
        return <ScrollView>
            <RadioForm formHorizontal={false} animation={true}
                style={{ alignItems: 'flex-start', backgroundColor: 'white' }}>
                {this.state.unionList.map((obj, i) => {
                    return (<RadioButton labelHorizontal={true} key={i}
                        style={styles.radioButton}>
                        <RadioButtonInput
                            obj={obj}
                            index={i}
                            isSelected={this.state.selectValue === i}
                            onPress={() => this.selectItem(obj, i)}
                            borderWidth={1}
                            buttonInnerColor={'#2196f3'}
                            buttonOuterColor={this.state.selectValue === i ? '#2196f3' : '#ddd'}
                            buttonSize={24}
                            buttonOuterSize={28}
                            buttonStyle={{}}
                            buttonWrapStyle={{ marginLeft: 10 }}
                        />
                        <RadioButtonLabel
                            obj={obj}
                            index={i}
                            labelHorizontal={true}
                            onPress={() => this.selectItem(obj, i)}
                            labelStyle={{ fontSize: 16, color: '#666' }}
                            labelWrapStyle={{ flex: 1 }}
                        />
                    </RadioButton>);
                })}
            </RadioForm>
        </ScrollView>;
    }
    public async getUnionList() {
        try {
            const response = await getAppJSON(Config.COMMON_UNION, {});
            const tmepUnionList = response.data.map((item) => {
                const unionInfo = {
                    label: item.dictionary_display_value,
                    value: item.dictionary_db_value,
                };
                return unionInfo;
            });
            this.setState({
                unionList: tmepUnionList,
            });
        } catch (error) {
            Log(error);
        }
    }
    public componentDidMount() {
        this.getUnionList();
    }
    public selectItem(unionObj, index) {
        const { navigate, goBack, state } = this.props.navigation;
        this.setState({ selectValue: index });
        state.params.callback(unionObj); goBack();
    }
}
const styles = EStyleSheet.create({
    radioButton: {
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: '$lightgray',
    },
});
