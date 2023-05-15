import React, {Component} from 'react';
import {UIManager, requireNativeComponent, findNodeHandle} from 'react-native';

const ChartControl = requireNativeComponent('ChartControl');

class Chart extends Component {
  saveChart(suggestedName, extensions) {
    if (this.ref) {
      const tag = findNodeHandle(this.ref);
      UIManager.dispatchViewManagerCommand(
        tag,
        UIManager.getViewManagerConfig('ChartControl').Commands.SaveChart,
        [suggestedName, extensions],
      );
    }
  }

  saveData(suggestedName, extensions) {
    if (this.ref) {
      const tag = findNodeHandle(this.ref);
      UIManager.dispatchViewManagerCommand(
        tag,
        UIManager.getViewManagerConfig('ChartControl').Commands.SaveSeries,
        [suggestedName, extensions],
      );
    }
  }

  render() {
    return (
        <ChartControl {...this.props} ref={(ref) => {this.ref = ref}} />
    );
  }
}

export default Chart;
