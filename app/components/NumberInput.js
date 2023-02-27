import React, {useRef, useCallback} from 'react';
import {View, TouchableOpacity, TextInput, StyleSheet, useColorScheme} from 'react-native';
import {getColors} from '@app/utils/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import fonts from '@app/utils/fonts';

const NumberInput = ({value = "", onChange, hasPlusMinusButtons = false, style}) => {
  const colors = getColors(useColorScheme() === "dark");
  const styles = dynamicStyles(colors);
  const inputRef = useRef(null);

  const handleInputSubmit = useCallback((ev) => {
    const input =  ev.nativeEvent.text;
    if(!isNaN(Number(input))){
      onChange && onChange(Number(input))
    }
  }, [onChange]);

  const inputStyle = hasPlusMinusButtons ? {marginLeft: -15, marginBottom: -15} : {paddingTop: 4};
  const containerStyle = hasPlusMinusButtons ? {} : {paddingTop: 10, paddingLeft: 0, marginBottom: -4.5};

  return (
    <View style={[styles.container, containerStyle, style]}>
      {hasPlusMinusButtons && <TouchableOpacity onPress={() => onChange(value - 1)}>
        <Icon name="minus-circle" size={20} color={colors.body} />
      </TouchableOpacity>}
      <TextInput
        ref={inputRef}
        style={[styles.text, inputStyle]}
        keyboardType="numeric"
        onEndEditing={handleInputSubmit}
        defaultValue={String(value)}
      />
      {hasPlusMinusButtons && <TouchableOpacity onPress={() => onChange(value + 1)}>
        <Icon name="plus-circle" size={20} color={colors.body} />
      </TouchableOpacity>}
    </View>
  );
};

const dynamicStyles = (colors) =>{
  return StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: colors.gray,
      borderRadius: 5,
      padding: 3,
      flexDirection: 'row',
      alignItems: "center",
    },
    text: {
      color: colors.body,
      fontSize: 14,
      ...fonts.body,
      margin: -10,
      textAlign: "center",
      backgroundColor: colors.background,
      zIndex: -1,
    },
  });
}

export default NumberInput;
