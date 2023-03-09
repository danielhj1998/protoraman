import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, useColorScheme} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getColors} from '@app/utils/colors';
import fonts from '@app/utils/fonts';
import ToggleButton from '@app/components/ToggleButton';
import NumberInput from '@app/components/NumberInput';

const GridSetting = ({enabled, onChangeEnabled, ticks, onChangeTicks}) => {
  const colors = getColors(useColorScheme() === "dark");
  const styles = dynamicStyles(colors);

  return (
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.body}>Grid</Text>
        <Icon
          name="grid"
          color={colors.gray}
          size={25}
          style={styles.titleIcon}
        />
        <ToggleButton enabled={enabled} onChangeEnabled={onChangeEnabled} />
      </View>
      <View style={styles.optionContainer}>
        <View style={styles.horizontalContainer}>
          <NumberInput value={ticks} onChange={onChangeTicks} />
          <Text style={[styles.body, styles.leftMargin]}>marcas</Text>
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
      marginTop: 10,
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
    leftMargin: {
      marginLeft: 5,
    },
    superscript: {
      fontSize: 10,
      marginBottom: 8,
    },
  });
}

export default GridSetting;
