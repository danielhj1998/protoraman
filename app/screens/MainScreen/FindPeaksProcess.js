import React from 'react';
import {View, Text, StyleSheet, useColorScheme, TouchableOpacity} from 'react-native';
import {getColors} from '@app/utils/colors';
import fonts from '@app/utils/fonts';
import { SvgXml } from 'react-native-svg';
import imageSvg from '@assets/images/chart-maximum.svg';

const FindPeaksProcess = ({onPress}) => {
  const colors = getColors(useColorScheme() === "dark");
  const styles = dynamicStyles(colors);

  return (
    <View style={styles.controlOp}>
      <Text style={styles.body}>Encontrar picos</Text>
      <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
        <SvgXml style={styles.icon} width="30" height="30" xml={imageSvg} />
      </TouchableOpacity>
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
      padding: 8.5,
      flexDirection: 'column',
      alignItems: 'center',
      height: "100%",
    },
    icon: {
      marginVertical: 10,
      color: colors.background,
    },
    buttonContainer: {
      backgroundColor: colors.body,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: 15,
      paddingRight: 9,
      paddingTop: 5,
      paddingBottom: 1,
      marginTop: 10,
    }
  });
}

export default FindPeaksProcess;
