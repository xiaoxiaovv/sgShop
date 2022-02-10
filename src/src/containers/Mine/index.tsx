import * as React from 'react';
import Detail from './Detail';
import { INavigation } from '../../interface/index';
import { connect } from 'react-redux';

const mapStateToProps
  = ({
       users: {
         userId,
         mid,
       },
     }) => ({
  userId, mid,
});

interface IMine {
    userId: number;
    mid: number;
}

@connect(mapStateToProps)
class Mine extends React.Component<INavigation & IMine> {
    public componentWillReceiveProps(newProps) {
      Log('Mine -> componentWillReceiveProps -> newProps: ', newProps);
    }
    public render(): JSX.Element {
        const { userId, mid, navigation } = this.props;
        // if (!userId && !mid) {
        //   return <TestLogin navigation={navigation}/>;
        // }

        return (
            <Detail  navigation={this.props.navigation}/>
        );
    }
}

export default Mine;
