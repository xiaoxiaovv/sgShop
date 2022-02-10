import * as React from 'react';
import { View, Text, Image, Modal, ScrollView } from 'react-native';
import Button from 'rn-custom-btn1';
import ImageViewer from 'react-native-image-zoom-viewer';
import ExpandText from '../../../components/ExpandText';
import EStyleSheet from 'react-native-extended-stylesheet';
import moment from 'moment';
import { IEvaluateProps } from '../../../interface';

const RowItem: React.SFC<IEvaluateProps & { style?: object }> = ({
  commentContent, memberName, memberPic, createTime, commentPics, serviceCommentReplies,
  experienceContent, experienceTime, experiencePics, storeCommentReplies,
  userCommentContent, userCommentCreateTime, userCommentPics, style,
}) => {
  const evaluateArr = [
    { name: memberName, icon: memberPic, content: commentContent, time: createTime, pics: commentPics },
    { title: '追评', content: experienceContent, time: experienceTime, pics: experiencePics },
    { title: '产品使用心得', content: userCommentContent, time: userCommentCreateTime, pics: userCommentPics },
  ];
  return (
    <View style={[styles.rowContain, style]}>
      {evaluateArr.map((item, index) =>
        (item.content && item.time) ? <EvaluateItem key={`keys${index}`} {...item} /> : null,
      )}
      {serviceCommentReplies && serviceCommentReplies.map(({ replyContent }, index) => (
        <View key={`keys${index}`} style={[styles.reply, { marginTop: 0 }]}>
          {/* <View style={styles.triangle} /> */}
          <ExpandText style={styles.replyText} title={`小海回复：${replyContent}`} />
        </View>
      ))}
      {storeCommentReplies && storeCommentReplies.map(({ replyContent }, index) => (
        <View key={`index${index}`} style={[styles.reply, { marginTop: 0 }]}>
          {/* <View style={styles.triangle} /> */}
          <ExpandText  key={`keys${index}`} style={styles.replyText} title={`商家回复：${replyContent}`} />
        </View>
      ))}
    </View>
  );
};

interface IEvaluateItemProps {
  name?: string;
  icon?: string;
  content?: string;
  time?: number;
  pics?: Array<{ picUrl: string }>;
  title?: string;
}

interface IEvaluateItemState {
  showImageViewer: boolean;
  showIndex: number;
}
class EvaluateItem extends React.PureComponent<IEvaluateItemProps, IEvaluateItemState> {
  // private static state: IEvaluateItemState = {
  //   showImageViewer: false,
  // };
  constructor(props) {
    super(props);
    this.state = {
      showImageViewer: false,
      showIndex: 0,
    };
  }
  public render(): JSX.Element {
    const { name, icon, content, time, pics, title } = this.props;
    const imageSource = icon ? { uri: cutImgUrl(icon, 50, 50, true) } : require('../../../images/default_icon.png');
    return (
      <View>
        <View style={styles.itemContain}>
          <View style={styles.userTime}>
            {name ?
              <View style={styles.userContain}>
                <Image
                  style={styles.icon}
                  source={imageSource}
                  defaultSource={require('../../../images/default_icon.png')}
                />
                <Text style={styles.name}>{name}</Text>
              </View> :
              <Text style={styles.zhuiPinNam}>{title}</Text>
            }
            <Text style={styles.time}>{moment(time).format('YYYY-MM-DD')}</Text>
          </View>
          <ExpandText style={styles.content} titleStyle={styles.contentText} title={content} />
          <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={styles.showPicView}>
            {pics && pics.map(({ picUrl }, index) =>
              <Button
                key={`keys${index}`}
                style={styles.showPicContain}
                imageStyle={styles.showPic}
                image={{ uri: cutImgUrl(picUrl, 100, 100, false) }}
                onPress={() => this.setState({ showImageViewer: true, showIndex: index })}
              />,
            )}
          </ScrollView>
        </View>
        <Modal visible={this.state.showImageViewer} transparent={true}>
          <ImageViewer
            imageUrls={pics.map(({ picUrl: url }) => ({ url })) }
            index={this.state.showIndex}
            onClick={() => this.setState({ showImageViewer: false })}
          />
        </Modal>
      </View>
    );
  }
}

export default RowItem;

const styles = EStyleSheet.create({
  rowContain: {
    borderTopWidth: 8,
    borderColor: '$lightgray',
    paddingTop: 0,
    backgroundColor: 'white',
  },
  itemContain: {
    width: '375rem',
  },
  userTime: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 16,
    marginTop: 12,
    marginBottom: 0,
  },
  userContain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: '32rem',
    height: '32rem',
    borderRadius: '16rem',
  },
  name: {
    fontSize: '$fontSize2',
    marginLeft: '8rem',
    color: '$darkblack',
  },
  zhuiPinNam: {
    fontSize: '$fontSize2',
    color: '$darkred',
  },
  content: {
    marginTop: 0,
    marginLeft: 4,
    marginBottom: -4,
    // padding: 12,
    // paddingBottom: 12,
  },
  showPicView: {
    flexDirection: 'row',
    padding: '7.5rem',
    width: '375rem',
  },
  showPicContain: {
    padding: 0,
  },
  showPic: {
    width: '75rem',
    height: '75rem',
    margin: '7.5rem',
    resizeMode: 'cover',
  },
  contentText: {
    color: '$darkblack',
  },
  time: {
    fontSize: '$fontSize2',
    color: '#565D69',
  },
  reply: {
    margin: 12,
    marginTop: -4,
  },
  triangle: {
    width: 0,
    height: 0,
    marginLeft: 32,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderColor: '$lightgray',
  },
  replyText: {
    backgroundColor: '$lightgray',
    padding: 12,
  },
});
