import React from 'react';
import {View, Text, StyleSheet, useColorScheme} from 'react-native';
import {getColors} from '@app/utils/colors';
import fonts from '@app/utils/fonts';
import Chart from '@app/modules/NativeChart';
import {siliconSpectrumPoints} from '@app/utils/dummyData';

const SpectrumPanel = ({range, intervals, gridEnabled, gridTicks, spectrumColor, graphColor}) => {
  const colors = getColors(useColorScheme() === "dark");
  const styles = dynamicStyles(colors);
  const labelsStyle = {
    edgeLabelsDrawingMode: 'fit',
    color: colors.body,
    ...fonts.body,
    fontSize: 14,
  };

  return (
    <View style={styles.container}>
      <Chart
        style={[styles.chart, {backgroundColor: graphColor}]}
        range={range}
        intervals={intervals}
        labelsStyle={labelsStyle}
        showGridLines={gridEnabled}
        smallTicksPerInterval={gridTicks}
        series={[{data: siliconSpectrumPoints}]}
      />
      <Text style={styles.body}>
        Corrimiento Raman [cm
        <Text style={[styles.body, styles.superscript]}>-1</Text>]
      </Text>
    </View>
  );
};

const dynamicStyles = (colors) =>{
  return StyleSheet.create({
    container: {
      flex: 1,
      height: '100%',
      padding: 20,
      paddingBottom: 10,
      backgroundColor: colors.background,
      alignItems: 'center',
    },
    title: {
      color: colors.body,
      fontSize: 14,
      ...fonts.title,
    },
    body: {
      color: colors.body,
      fontSize: 14,
      ...fonts.body,
    },
    superscript: {
      fontSize: 10,
      marginBottom: 8,
    },
    chart: {
      flex: 1,
      width: '100%',
      borderColor: colors.placeholder,
      borderWidth: 1,
    },
  });
}

export default SpectrumPanel;
