import React from 'react';
import {View, Text, StyleSheet, useColorScheme} from 'react-native';
import Svg, { SvgXml, Line } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getColors} from '@app/utils/colors';
import fonts from '@app/utils/fonts';

const points = [0, 5, 6, 8, 2, 1, 6, 5, 2, 3];

const SpectrumPanel = () => {
  const colors = getColors(useColorScheme() === "dark");
  const styles = dynamicStyles(colors);
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
  }

  return (
    <View style={styles.container}>
      <Svg height="100%" width="100%">
        <Line x1="0" y1="0" x2="150" y2="520" stroke="red" strokeWidth="2" />
      </Svg>
    </View>
  );
};

const dynamicStyles = (colors) =>{
  return StyleSheet.create({
    container: {
      flex: 1,
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
  });
}

export default SpectrumPanel;
