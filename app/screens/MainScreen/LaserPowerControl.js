import React from 'react';
import {View, Text, StyleSheet, useColorScheme} from 'react-native';
import {getColors} from '@app/utils/colors';
import fonts from '@app/utils/fonts';
import { SvgXml } from 'react-native-svg';
import laserSvg from '@assets/images/laser-tool-20-filled.svg';
import DropDownButton from '@app/components/DropDownButton';

const laserPowerOptions = ["20 mW", "40 mW", "60 mW", "80 mW", "100 mW", "120 mW"];

const LaserPowerControl = ({power, onPowerSelect}) => {
  const colors = getColors(useColorScheme() === "dark");
  const styles = dynamicStyles(colors);
  const value = String(power) + " mW";

  const onSelect = (value) => {
    onPowerSelect(Number(value.slice(0,3)));
  };

  return (
    <View style={styles.controlOp}>
      <Text style={styles.body}>Potencia del láser</Text>
      <SvgXml style={styles.icon} width="30" height="30" xml={laserSvg} />
      <DropDownButton value={value} options={laserPowerOptions} onSelect={v => onSelect(v)}/>
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

export default LaserPowerControl;
