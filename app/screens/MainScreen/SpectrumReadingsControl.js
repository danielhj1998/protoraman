import React from 'react';
import {View, Text, StyleSheet, useColorScheme} from 'react-native';
import {getColors} from '@app/utils/colors';
import fonts from '@app/utils/fonts';
import { SvgXml } from 'react-native-svg';
import laserSvg from '@assets/images/number-symbol-square-24-filled.svg';
import NumberInput from '@app/components/NumberInput';

const SpectrumReadingsControl = ({number, onNumberChange}) => {
  const colors = getColors(useColorScheme() === "dark");
  const styles = dynamicStyles(colors);

  return (
    <View style={styles.controlOp}>
      <Text style={styles.body}>Lecturas por espectro</Text>
      <SvgXml style={styles.icon} width="30" height="30" xml={laserSvg} />
      <NumberInput value={number} onChange={onNumberChange} hasPlusMinusButtons />
    </View>
  );
};

const dynamicStyles = (colors) =>{
  return StyleSheet.create({
    body: {
      color: colors.body,
      fontSize: 14,
      ...fonts.body,
    },
    controlOp: {
      padding: 5,
      marginLeft: 5,
      flexDirection: 'column',
      alignItems: 'center',
    },
    icon: {
      x: 2.5,
      y: 2.5,
      color: colors.gray,
      marginVertical: 5,
    },
  });
}

export default SpectrumReadingsControl;
