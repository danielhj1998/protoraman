import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, useColorScheme} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getColors} from '@app/utils/colors';
import fonts from '@app/utils/fonts';
import NumberInput from '@app/components/NumberInput';

const RangeSetting = ({range, onChangeRange, rangeSelectionMode, onChangeRangeSelectionMode}) => {
  const colors = getColors(useColorScheme() === "dark");
  const styles = dynamicStyles(colors);
  const pressedButtonStyle = {...styles.buttonIcon, backgroundColor: colors.body + 'A0'};

  const handleOnRangeButtonPress = (mode) => {
    const newMode = mode === rangeSelectionMode ? "none" : mode;
    onChangeRangeSelectionMode(newMode);
  };

  return (
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.body}>Rango</Text>
        <Icon
          name="ray-start-end"
          color={colors.gray}
          size={25}
          style={styles.titleIcon}
        />
      </View>
      <View style={styles.optionContainer}>
        <TouchableOpacity
          style={rangeSelectionMode == "xy" ? pressedButtonStyle : styles.buttonIcon}
          onPress={() => handleOnRangeButtonPress('xy')}>
          <Icon name="arrow-expand" color={colors.body} size={25} />
        </TouchableOpacity>
        <View style={styles.horizontalContainer}>
          <TouchableOpacity
            style={rangeSelectionMode == "x" ? pressedButtonStyle : styles.buttonIcon}
            onPress={() => handleOnRangeButtonPress('x')}>
            <Icon
              name="arrow-expand-horizontal"
              color={colors.body}
              size={25}
            />
          </TouchableOpacity>
          <Text style={[styles.body, styles.leftMargin]}>:</Text>
          <NumberInput
            style={styles.leftMargin}
            value={range.x[0]}
            onChange={v => onChangeRange({...range, x: [v, range.x[1]]})}
          />
          <Text style={[styles.body, styles.leftMargin]}>a</Text>
          <NumberInput
            style={styles.leftMargin}
            value={range.x[1]}
            onChange={v => onChangeRange({...range, x: [range.x[0], v]})}
          />
          <Text style={[styles.body, styles.leftMargin]}>cm</Text>
          <Text style={[styles.body, styles.superscript]}>-1</Text>
        </View>
        <View style={styles.horizontalContainer}>
          <TouchableOpacity
            style={rangeSelectionMode == "y" ? pressedButtonStyle : styles.buttonIcon}
            onPress={() => handleOnRangeButtonPress('y')}>
            <Icon name="arrow-expand-vertical" color={colors.body} size={25} />
          </TouchableOpacity>
          <Text style={[styles.body, styles.leftMargin]}>:</Text>
          <NumberInput
            style={styles.leftMargin}
            value={range.y[0]}
            onChange={v => onChangeRange({...range, y: [v, range.y[1]]})}
          />
          <Text style={[styles.body, styles.leftMargin]}>a</Text>
          <NumberInput
            style={styles.leftMargin}
            value={range.y[1]}
            onChange={v => onChangeRange({...range, y: [range.y[0], v]})}
          />
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
    superscript: {
      fontSize: 10,
      marginBottom: 8,
    },
  });
}

export default RangeSetting;
