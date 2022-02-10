import React from 'react';
import {View, ART} from 'react-native';
import moment from 'moment';

import {px, width, height} from "../../utils";

const {Surface, Shape, Path, Group, Text} = ART;

const ChartHeight = 180;//chart的高度


const ChartMargin = 40;//左右的间距

const surfaceHMargin = 15;//上下间距

// const v = [0, 0.2, 0.4, 0.6, 0.8, 1];
const vCount = 5;//纵轴节点数

const textColorH = '#ffffff';// 横轴文字颜色
const textColorV = '#ffffff';// 纵轴文字颜色
const pathColor = '#41C0FC';//折线颜色
const colorHV = '#ffffff';//横纵轴颜色
const colorBg = '#208BD5'

export default class Charts extends React.Component {

  surfaceWidth = 375;//整个宽度

  chartItemWidth = 1;//折现点间距

  maxLineValue = 1;//纵向坐标轴最大值

  v = [];//纵向坐标数组

  static defaultProps = {
    lineData: [
      {trendDate: "2018-05-26", orderAmount: "0"},
      {trendDate: "2018-05-25", orderAmount: "7.58"},
      {trendDate: "2018-05-24", orderAmount: "15"},
      {trendDate: "2018-05-23", orderAmount: "14.85"},
      {trendDate: "2018-05-22", orderAmount: "14.4"},
      {trendDate: "2018-05-21", orderAmount: "107.26"},
      {trendDate: "2018-05-20", orderAmount: "0"},
    ].reverse(),
  }

  constructor(props) {
    super(props);
    console.log('constructor', this.props.lineData);
    this.state = {
      lineData: this.props.lineData.reverse(),

    }
    this.fmtLineList(this.props.lineData);
  }


  /**
   * 获取每个折现点的坐标
   * @param index
   * @returns {{x: *, y: *}}
   */

  getPosition = index => {
    const {lineData} = this.state;
    const height = ChartHeight;
    return {
      x: px(this.surfaceWidth - index * this.chartItemWidth - ChartMargin),
      y: px(height - Number(lineData[index].orderAmount) / this.maxLineValue * (height - surfaceHMargin))
    }
  }

  /**
   * 获取纵轴坐标的坐标
   * @param index
   * @returns {{x: *, y: *}}
   */
  getVPosition = index => {
    const height = ChartHeight;
    return {
      x: px(this.surfaceWidth - (this.state.lineData.length - 1) * this.chartItemWidth - ChartMargin),
      y: px(height - index * ((height + surfaceHMargin) / this.v.length))
    }
  }

  /**
   * 根据坐标绘制折现
   */
  getPath = () => {
    const {lineData} = this.state;
    const path = Path();
    lineData.map((line, index) => {
      const {x, y} = this.getPosition(index);
      if (index === 0) {
        path.moveTo(x, y);
      } else {
        path.lineTo(x, y);
      }
    });
    return path;
  }

  /**
   * 画横轴
   */
  getHPath = () => {
    const {lineData} = this.state;
    const HY = px(ChartHeight);
    const path = Path();
    lineData.map((line, index) => {
      const {x, y} = this.getPosition(index);
      if (index === 0) {
        path.moveTo(x, HY);
      } else {
        path.lineTo(x, HY);
      }
    });
    return path;
  }

  /**
   * 画纵轴
   */
  getVPath = () => {
    const path = Path();
    this.v.map((line, index) => {
      const {x, y} = this.getVPosition(index);
      if (index === 0) {
        path.moveTo(x, y);
      } else {
        path.lineTo(x, y);
      }
    });
    return path;
  }

  /**
   * 根据结果计算最大值
   * @param res
   */
  fmtLineList = res => {
    res.map(line => {
      if (line.orderAmount > this.maxLineValue) {
        this.maxLineValue = Number(line.orderAmount);
      }
    });
    this.surfaceWidth = width;
    this.chartItemWidth = width / res.length - ChartMargin /res.length;

    let v = 0;
    for (let i = 0; i < vCount + 1; i++) {
      this.v.push(v);
      v = v + this.maxLineValue / vCount;
    }
  }

  /**
   * 横向坐标线
   */
  _renderVline = () => {
    return this.v.map((line, index) => {
      const path = Path();
      const {x, y} = this.getVPosition(index);
      path.moveTo(x, y);
      path.lineTo(x - px(10), y);
      return (
        <Shape key={index} d={path} stroke={textColorV} strokeWidth={1}/>
      )
    })
  }

  /**
   * 横向文字
   */
  _renderVText = () => {
    const HY = px(ChartHeight);

    return this.state.lineData.map((line, index) => {
      const {lineData} = this.state;
      const {x, y} = this.getPosition(index);
      return (
        <Text
          key={index}
          font={`10px "Helvetica Neue", "Helvetica", Arial`}
          fill={textColorH}
          alignment="center"
          x={x}
          y={HY}
        >{moment(lineData[index].trendDate).format('MM-DD')}</Text>
      )
    })
  }

  /**
   * 纵向文字
   */
  _renderHText = () => {
    return this.v.map((line, index) => {
      const {x, y} = this.getVPosition(index);
      return (
        <Text
          key={index}
          font={`10px "Helvetica Neue", "Helvetica", Arial`}
          fill={textColorV}
          alignment="center"
          x={px(ChartMargin / 2+px(10))}
          y={y - px(15)}
        >{line.toFixed(1) + ''}</Text>
      )
    })
  }


  render() {
    return (
      <View style={{
        width: width,
        height: px(ChartHeight + surfaceHMargin),
        backgroundColor: colorBg,
        alignItems: 'center',
        justifyContent: 'center',
      }}>

        {this.state.lineData ? <Surface
          width={px(width)}
          height={px(ChartHeight + surfaceHMargin)}
        >
          {/*折现*/}
          <Shape d={this.getPath()} stroke={pathColor} strokeWidth={2}/>
          {/*横轴*/}
          <Shape d={this.getHPath()} stroke={colorHV} strokeWidth={1}/>
          {/*纵轴*/}
          <Shape d={this.getVPath()} stroke={colorHV} strokeWidth={1}/>
          {/*横向坐标线*/}
          {this._renderVline()}
          {/*横向文字*/}
          {this._renderVText()}
          {/*纵向文字*/}
          {this._renderHText()}
        </Surface> : null}
      </View>
    )
  }

}
