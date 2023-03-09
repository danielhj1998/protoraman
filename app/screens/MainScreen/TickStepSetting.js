import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, useColorScheme} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getColors} from '@app/utils/colors';
import fonts from '@app/utils/fonts';
import NumberInput from '@app/components/NumberInput';

const TickStepSetting = ({tickStep, onChangeTickStep}) => {
  const colors = getColors(useColorScheme() === "dark");
  const styles = dynamicStyles(colors);

  return (
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.body}>Paso entre marcas</Text>
        <Icon
          name="ray-start-vertex-end"
          color={colors.gray}
          size={25}
          style={styles.titleIcon}
        />
      </View>
      <View style={styles.optionContainer}>
        <View style={styles.horizontalContainer}>
          <Text style={[styles.body, styles.leftMargin]}>x:</Text>
          <NumberInput
            style={styles.leftMargin}
            value={tickStep.x}
            onChange={v => onChangeTickStep({...tickStep, x: v})}
          />
          <Text style={[styles.body, styles.leftMargin]}>cm</Text>
          <Text style={[styles.body, styles.superscript]}>-1</Text>
          <Text style={[styles.body, styles.leftMargin]}>y:</Text>
          <NumberInput
            style={styles.leftMargin}
            value={tickStep.y}
            onChange={v => onChangeTickStep({...tickStep, y: v})}
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
      marginTop: 10,
    },
    titleIcon: {
      marginLeft: 5,
    },
    optionContainer: {
      marginLeft: 10,
      alignItems: "center",
      marginBottom: 6,
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

export default TickStepSetting;
