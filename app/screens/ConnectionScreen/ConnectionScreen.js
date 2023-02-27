import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, useColorScheme} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import disconnectedImage from '@assets/images/pc-raman-not-connected.png';
import {getColors} from '@app/utils/colors';
import fonts from '@app/utils/fonts';
import FadingView from '@app/components/FadingView';
import SerialPort from '@app/modules/NativeSerialPort';
import { NativeEventEmitter } from 'react-native';

const SerialPortEmitter = new NativeEventEmitter(SerialPort);

const ConnectionScreen = ({navigation}) => {
  const colors = getColors(useColorScheme() === "dark");
  const styles = dynamicStyles(colors);
  const [script, setScript] = useState('Dispositivo Raman no detectado');
  const [iconName, setIconName] = useState('close-circle');
  const [iconColor, setIconColor] = useState(colors.gray);
  let eventSubscriptions = [];

  const onConnecting = () => {
    setScript('Conectando...');
    setIconName('dots-circle');
    setIconColor(colors.yellow);
  }

  const onDeviceConnected = () => {
    setScript('Conectado');
    setIconName('check-circle');
    setIconColor(colors.green);
    eventSubscriptions.forEach(s => s.remove());
    setTimeout(() => navigation.navigate("Main"), 1000);
  }

  const onConnectionFailed = (stat) => {
    console.log(stat);
    setScript('Conexión fallida, intente de nuevo');
    setIconName('close-circle');
    setIconColor(colors.red);
  }

  const onDeviceDisconnected = () => {
    setScript('Dispositivo Raman no detectado');
    setIconName('close-circle');
    setIconColor(colors.gray);
  }

  useEffect(() => {
    const addListeners = async () => {
      eventSubscriptions.push(SerialPortEmitter.addListener('onConnecting', onConnecting));
      eventSubscriptions.push(SerialPortEmitter.addListener('onDeviceConnected', onDeviceConnected));
      eventSubscriptions.push(SerialPortEmitter.addListener('onDeviceDisconnected', onDeviceDisconnected));
      eventSubscriptions.push(SerialPortEmitter.addListener('onConnectionFailed', onConnectionFailed));
    };

    addListeners();
  },[]);

  return (
    <View style={styles.container}>
      <View style={styles.fragment}>
        <Text style={styles.body}>{script}</Text>
        <FadingView>
          <Icon name={iconName} size={50} color={iconColor} />
        </FadingView>
      </View>
      <View style={styles.fragment}>
        <Text style={styles.body}>Por favor, conecte el dispositivo por USB para continuar</Text>
        <Image source={disconnectedImage} style={styles.image} resizeMode="contain"/>
      </View>
      <View style={styles.fragment}>
        <Text style={styles.body}>Asegúrese que el dispositivo esté encendido y la barra de estado parpadee</Text>
        <View style={styles.powerImage}>
          <View style={styles.powerbutton}>
            <Icon name="power" size={50} color={colors.gray} />
          </View>
          <View style={styles.statusbar}/>
          <View style={styles.usb}/>
        </View>
      </View>
    </View>
  );
};

const dynamicStyles = (colors) => {
  return StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
    fragment: {
      alignItems: 'center',
    },
    title: {
      color: colors.body,
      fontSize: 66,
      letterSpacing: 10,
      ...fonts.title,
    },
    body: {
      color: colors.body,
      fontSize: 20,
      ...fonts.body,
      marginBottom: 20,
    },
    image: {
      width: 800,
      height: 346/1819 * 800,
    },
    powerImage: {
      backgroundColor: colors.gray,
      paddingVertical: 10,
      paddingHorizontal: 50,
      alignItems: 'center',
      justifyContent: 'space-around',
      height: 150,
    },
    powerbutton: {
      borderRadius: 100,
      backgroundColor: colors.background,
    },
    statusbar: {
      backgroundColor: colors.background,
      borderRadius: 5,
      width: 120,
      height: 10,
    },
    usb: {
      backgroundColor: colors.background,
      borderRadius: 2.5,
      width: 25,
      height: 10,
    },
  });
}

export default ConnectionScreen;
