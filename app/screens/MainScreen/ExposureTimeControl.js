import React from 'react';
import {View, Text, StyleSheet, useColorScheme} from 'react-native';
import {getColors} from '@app/utils/colors';
import fonts from '@app/utils/fonts';
import { SvgXml } from 'react-native-svg';
import laserSvg from '@assets/images/time-and-weather-24-filled.svg';
import DropDownButton from '@app/components/DropDownButton';

export const exposureTimeOptions = ["32 µs", "40 µs", "64 µs", "80 µs", "128 µs", "160 µs", "200 µs", "256 µs", "320 µs", "400 µs", "640 µs", "800 µs", "1000 µs", "1280 µs", "1600 µs", "2000 µs", "3200 µs", "4000 µs", "5000 µs", "6400 µs", "8000 µs", "10 ms", "16 ms", "20 ms", "32 ms", "40 ms", "80 ms", "160 ms"];

const ExposureTimeControl = ({exposureTime, onExposureTimeChange}) => {
  const colors = getColors(useColorScheme() === "dark");
  const styles = dynamicStyles(colors);
  const value = String(exposureTime) + " µs";

  return (
    <View style={styles.controlOp}>
      <Text style={styles.body}>Tiempo de exposición</Text>
      <SvgXml style={styles.icon} width="30" height="30" xml={laserSvg} />
      <View style={styles.quantity}>
        <DropDownButton value={value} options={exposureTimeOptions} onSelect={v => onExposureTimeChange(Number(v.slice(0,-2)))}/>
      </View>
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
    quantity: {
      flexDirection: "row",
      alignItems: 'center',
    } 
  });
}

export default ExposureTimeControl;
