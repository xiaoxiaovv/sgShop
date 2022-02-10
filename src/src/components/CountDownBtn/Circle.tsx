import * as React from 'react';
import { ART } from 'react-native';

const { Surface, Shape, Path } = ART;

export default class Circle extends React.Component< { percent: number } > {
  constructor(props) {
    super(props);
  }
  public render(): JSX.Element {
    const size = 30;
    const width = 2;
    const arcSweepAngle = 360;
    const percent = this.props.percent;
    const circlePath = this.circlePath(size / 2, size / 2, size / 2 - width / 2, 0, (arcSweepAngle * .9999) * percent);
    return (
      <Surface width={30} height={30} style={{}}>
          <Shape d={circlePath} stroke='#FF6026' strokeWidth={width}/>
        </Surface>
    );
  }

  private circlePath(cx, cy, r, startDegree, endDegree) {
    const p = Path();
    p.path.push(0, cx + r, cy);
    p.path.push(4, cx, cy, r, startDegree * Math.PI / 180, endDegree * Math.PI / 180, 1);
    return p;
  }
}