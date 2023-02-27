import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, useColorScheme} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getColors} from '@app/utils/colors';
import fonts from '@app/utils/fonts';
import ToggleButton from '@app/components/ToggleButton';
import RangeSetting from '@app/screens/MainScreen/RangeSetting';

const SpectrumSettingsPanel = () => {
  const colors = getColors(useColorScheme() === "dark");
  const styles = dynamicStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.horizontalOption}>
        <View style={styles.titleContainer}>
          <Text style={styles.body}>Mantener</Text>
          <Icon name="chart-multiple" color={colors.gray} size={25} style={styles.titleIcon} />
        </View>
        <ToggleButton enabled={true} />
      </View>
      <View style={styles.separator} />
      <RangeSetting />
    </View>
  );
};

const dynamicStyles = (colors) =>{
  return StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: colors.gray,
      padding: 10,
      left: 1,
      bottom: 1,
      height: '101%',
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
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    titleIcon: {
      marginLeft: 5,
    },
    horizontalOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    separator: {
      backgroundColor: colors.placeholder,
      height: 1,
      width: '100%',
      marginVertical: 10,
    },
    optionContainer: {
      marginLeft: 10,
      alignItems: "flex-start",
    },
    buttonIcon: {
      borderWidth: 1,
      borderColor: colors.body,
      borderRadius: 5,
    },
  });
}

export default SpectrumSettingsPanel;
