import React from 'react';
import {View, Text, StyleSheet, useColorScheme, TouchableOpacity} from 'react-native';
import {getColors} from '@app/utils/colors';
import fonts from '@app/utils/fonts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TakeSampleButton = ({onTakeSamplePress}) => {
  const colors = getColors(useColorScheme() === "dark");
  const styles = dynamicStyles(colors);

  return (
    <View style={styles.controlOp}>
      <Text style={styles.body}>Tomar muestra</Text>
      <TouchableOpacity style={styles.buttonContainer} onPress={onTakeSamplePress}>
        <Icon name="play" size={60} color={colors.background}/>
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
      padding: 5,
      flexDirection: 'column',
      alignItems: 'center',
    },
    buttonContainer: {
      backgroundColor: colors.green,
      borderRadius: 10,
      marginTop: 10,
    },
  });
}

export default TakeSampleButton;
