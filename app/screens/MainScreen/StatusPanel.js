import React from 'react';
import {View, Text, StyleSheet, useColorScheme} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getColors} from '@app/utils/colors';
import fonts from '@app/utils/fonts';
import {States} from '@app/helpers/deviceRequests';

const StatusPanel = ({processState}) => {
  const colors = getColors(useColorScheme() === "dark");
  const styles = dynamicStyles(colors);
  let iconName = "check-circle";
  let deviceStatusColor = colors.green;
  let deviceState = "Conectado";
  let processStateName = " ";
  let processStatusColor = colors.gray;
  let processDescription = " ";

  switch (processState) {
    case States.DEVICE_CONNECTING:
      iconName = "dots-horizontal-circle";
      deviceStatusColor = colors.yellow;
      deviceState = "Conectando";
      processStateName = "Conectando";
      processStatusColor = colors.yellow;
      processDescription = "Estableciendo conexión"
      break;
    case States.DEVICE_INITIALIZING:
      deviceStatusColor = colors.green;
      deviceState = "Conectado";
      processStateName = "Iniciando";
      processStatusColor = colors.yellow;
      processDescription = "Verificando estado del dispositivo"
      break;
    case States.DEVICE_READY:
      deviceStatusColor = colors.green;
      deviceState = "Conectado";
      processStateName = "Listo";
      processStatusColor = colors.gray;
      processDescription = "Listo para capturar el espectro"
      break;
    case States.DEVICE_DISCONNECTED:
      iconName = "close-circle";
      deviceStatusColor = colors.gray;
      deviceState = "Desconectado";
      processStateName = "Desconectado";
      processStatusColor = colors.gray;
      processDescription = "Por favor, conecte el dispositivo"
      break;
    case States.DEVICE_ERROR:
      iconName = "close-circle";
      deviceStatusColor = colors.green;
      deviceState = "Conectado";
      processStateName = "Error";
      processStatusColor = colors.red;
      processDescription = "Ocurrió un error"
      break;
    default:
      processStatusColor = colors.red;
      processDescription = "Error al leer el estado del dispositivo";
      break;
  };

  return (
    <View style={styles.container}>
      <View style={styles.deviceStatusContainer}>
        <Text style={styles.body}>Dispositivo</Text>
        <Icon name={iconName} color={deviceStatusColor} size={30} />
        <Text style={styles.body}>{deviceState}</Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.deviceStatusContainer}>
        <Text style={styles.body}>Estado</Text>
        <Icon name="dots-horizontal" color={processStatusColor} size={30} />
        <Text style={styles.body}>{processStateName}</Text>
      </View>
      <Text style={[styles.body, styles.description]}>{processDescription}</Text>
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
