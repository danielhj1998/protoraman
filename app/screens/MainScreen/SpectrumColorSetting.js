import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, useColorScheme} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {getColors} from '@app/utils/colors';
import fonts from '@app/utils/fonts';


const ColorSetting = ({title, options, selectedColor, onChangeColor}) => {
  const colors = getColors(useColorScheme() === "dark");
  const styles = dynamicStyles(colors);

  const options = [colors.orange, colors.yellow, colors.green, colors.cyan, colors.blue];
  const dots = options.map((color, index) => {
    const margin = index === 0 ? 0 : 5;
    const style = color === selectedColor ? styles.selectedDot : styles.dot;
    return (
      <TouchableOpacity
        key={index}
        style={[style, {backgroundColor: color, marginLeft: margin}]}
        onPress={() => onChangeColor(color)}
      />
    );
  });

  return (
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.body}>Color del espectro</Text>
        <Icon name="color-lens" color={colors.gray} size={25} style={styles.titleIcon} />
      </View>
      <View style={styles.optionContainer}>
        <View style={styles.horizontalContainer}>
          {dots}
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
      marginRight: 10,
    },
    optionContainer: {
      marginLeft: 10,
      alignItems: "center",
      marginBottom: 8,
    },
    horizontalContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 5,
    },
    dot: {
      width: 15,
      height: 15,
      borderRadius: 7.5,
      borderWidth: 1,
      borderColor: colors.body,
    },
    selectedDot: {
      width: 20,
      height: 20,
      borderRadius: 12.5,
      borderWidth: 1,
      borderColor: colors.body,
    }
  });
}

export default ColorSetting;
