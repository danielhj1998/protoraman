import React, {useRef, useCallback} from 'react';
import {View, TouchableOpacity, TextInput, StyleSheet, useColorScheme} from 'react-native';
import {getColors} from '@app/utils/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import fonts from '@app/utils/fonts';

const ToggleButton = ({enabled, onChangeEnabled}) => {
  const colors = getColors(useColorScheme() === "dark");
  const styles = dynamicStyles(colors);

  const handleColor = enabled ? colors.green : colors.gray;
  const position = enabled ? {bottom: 17, left: 20} : {bottom: 17};

  return (
    <TouchableOpacity onPress={() => onChangeEnabled(!enabled)} >
      <View style={styles.slider} />
      <View style={[styles.circle, {backgroundColor: handleColor, ...position}]} />
    </TouchableOpacity>
  );
};

const dynamicStyles = (colors) =>{
  return StyleSheet.create({
    slider: {
      height: 14,
      width: 40,
      borderWidth: 1,
      borderColor: colors.body,
      borderRadius: 7,
      padding: 5,
    },
    circle: {
      width: 20,
      height: 20,
      borderRadius: 13,
      borderWidth: 1,
      borderColor: colors.body,
      marginBottom: -17,
    },
  });
}

export default ToggleButton;
