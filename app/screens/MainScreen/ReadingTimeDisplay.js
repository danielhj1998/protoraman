import React from 'react';
import {View, Text, StyleSheet, useColorScheme} from 'react-native';
import {getColors} from '@app/utils/colors';
import fonts from '@app/utils/fonts';
import { SvgXml } from 'react-native-svg';
import laserSvg from '@assets/images/timer-32-filled.svg';

const ReadingTimeDisplay = ({readingTime}) => {
  const colors = getColors(useColorScheme() === "dark");
  const styles = dynamicStyles(colors);

  return (
    <View style={styles.controlOp}>
      <Text style={styles.body}>Tiempo de lectura</Text>
      <SvgXml style={styles.icon} width="30" height="30" xml={laserSvg} />
      <Text style={styles.body}>{readingTime} s</Text>
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

export default ReadingTimeDisplay;
