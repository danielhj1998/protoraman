import React from 'react';
import {View, Text, StyleSheet, useColorScheme} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getColors} from '@app/utils/colors';
import fonts from '@app/utils/fonts';

const StatusPanel = ({isConnected, processState}) => {
  const colors = getColors(useColorScheme() === "dark");
  const styles = dynamicStyles(colors);
  const deviceStatusColor = isConnected ? colors.green : colors.gray;
  const deviceState = isConnected ? "Connected" : "Disconnected";
  const processStatusColor = colors.gray;

  return (
    <View style={styles.container}>
      <View style={styles.deviceStatusContainer}>
        <Text style={styles.body}>Dispositivo</Text>
        <Icon name="check-circle" color={deviceStatusColor} size={30} />
        <Text style={styles.body}>{deviceState}</Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.deviceStatusContainer}>
        <Text style={styles.body}>Estado</Text>
        <Icon name="dots-horizontal" color={processStatusColor} size={30} />
        <Text style={[styles.body, {textTransform: "capitalize"}]}>{processState}</Text>
      </View>
      <Text style={[styles.body, styles.description]}>Listo para capturar el espectro</Text>
    </View>
  );
};

const dynamicStyles = (colors) =>{
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderWidth: 5,
      borderRadius: 10,
      borderColor: colors.gray,
      marginRight: 10,
    },
    deviceStatusContainer: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    body: {
      color: colors.body,
      fontSize: 14,
      ...fonts.body,
    },
    description: {
      maxWidth: 210,
      marginLeft: 10,
    },
    separator: {
      backgroundColor: colors.gray,
      width: 1,
      height: 60,
      marginHorizontal: 10,
    },
  });
}

export default StatusPanel;
