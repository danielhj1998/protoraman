import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, useColorScheme} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getColors} from '@app/utils/colors';
import fonts from '@app/utils/fonts';
import ToggleButton from '@app/components/ToggleButton';
import NumberInput from '@app/components/NumberInput';

const SpectrumSettingsPanel = () => {
  const colors = getColors(useColorScheme() === "dark");
  const styles = dynamicStyles(colors);

  return (
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.body}>Rango</Text>
        <Icon name="ray-start-end" color={colors.gray} size={25} style={styles.titleIcon} />
      </View>
      <View style={styles.optionContainer}>
        <TouchableOpacity style={styles.buttonIcon}>
          <Icon name="arrow-expand" color={colors.body} size={25} />
        </TouchableOpacity>
        <View style={styles.horizontalContainer}>
          <TouchableOpacity style={styles.buttonIcon}>
            <Icon name="arrow-expand-horizontal" color={colors.body} size={25} />
          </TouchableOpacity>
          <Text style={[styles.body, styles.leftMargin]}>:</Text>
          <NumberInput style={styles.leftMargin}/>
        </View>
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
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    titleIcon: {
      marginLeft: 5,
    },
    optionContainer: {
      marginLeft: 10,
      alignItems: "flex-start",
    },
    buttonIcon: {
      borderWidth: 1,
      borderColor: colors.body,
      borderRadius: 5,
      marginTop: 5,
    },
    horizontalContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    leftMargin: {
      marginLeft: 5,
    },
  });
}

export default SpectrumSettingsPanel;
