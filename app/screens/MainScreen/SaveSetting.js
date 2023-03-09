import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, useColorScheme} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getColors} from '@app/utils/colors';
import fonts from '@app/utils/fonts';
import DropDownButton from '@app/components/DropDownButton';

const SaveSetting = ({style, title, iconName, formatOptions, onSavePress}) => {
  const colors = getColors(useColorScheme() === "dark");
  const styles = dynamicStyles(colors);
  const [format, setFormat] = useState(formatOptions[0]);

  return (
    <View style={style}>
      <View style={styles.titleContainer}>
        <Text style={styles.body}>{title}</Text>
        <Icon
          name={iconName}
          color={colors.gray}
          size={25}
          style={styles.titleIcon}
        />
      </View>
      <View style={styles.optionContainer}>
        <View style={styles.horizontalContainer}>
          <Text style={styles.body}>Formato</Text>
          <DropDownButton
            value={format}
            options={formatOptions}
            onSelect={setFormat}
          />
          <TouchableOpacity style={styles.saveButton} onPress={() => onSavePress(format)}>
            <Text style={styles.body}>Guardar</Text>
          </TouchableOpacity>
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
    saveButton: {
      marginLeft: 5,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: colors.body,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
  });
}

export default SaveSetting;
