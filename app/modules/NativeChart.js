import React, {Component} from 'react';
import {UIManager, requireNativeComponent, findNodeHandle} from 'react-native';

const ChartControl = requireNativeComponent('ChartControl');

class Chart extends Component {
  saveChart() {
    if (this.ref) {
      const tag = findNodeHandle(this.ref);
      UIManager.dispatchViewManagerCommand(tag, UIManager.getViewManagerConfig('ChartControl').Commands.SaveChart);
    }
  }

  render() {
    return (
        <ChartControl {...this.props} ref={(ref) => {this.ref = ref}} />
    );
  }
}

export default Chart;
