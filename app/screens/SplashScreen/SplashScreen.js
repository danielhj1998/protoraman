import React, {useEffect} from 'react';
import {View, StyleSheet, Text, Image, useColorScheme} from 'react-native';
import {getColors} from '@app/utils/colors';
import fonts from '@app/utils/fonts';
import image from '@assets/images/imago.png';
import SerialPort from '@app/modules/NativeSerialPort';
import {protoRamanDeviceIdentify} from '@app/helpers/deviceRequests';
import { NativeEventEmitter } from 'react-native';

const SerialPortEmitter = new NativeEventEmitter(SerialPort);

const SplashScreen = ({navigation}) => {
  const colors = getColors(useColorScheme() === "dark");
  const styles = dynamicStyles(colors);
  let eventSubscriptions = [];

  const onDeviceConnected = () => {
    setTimeout(() => {
      protoRamanDeviceIdentify(SerialPort).then(correct => {
        if(correct){
          eventSubscriptions.forEach(s => s.remove());
          navigation.navigate('Main');
        } else {
          Serial.deviceDispose();
        }
      });
    }, 2000);
  }

  const onInitialDeviceNotPlugged = () => {
    eventSubscriptions.forEach(s => s.remove());
    navigation.navigate("Connection");
  }

  const onConnectionFailed = (stat) => {
    console.log(stat);
  }

  useEffect(() => {
    const setListeners = async () => {
      SerialPort.createWatcher();
      eventSubscriptions.push(SerialPortEmitter.addListener('onDeviceConnected', onDeviceConnected));
      eventSubscriptions.push(SerialPortEmitter.addListener('onInitialDeviceNotPlugged', onInitialDeviceNotPlugged));
      eventSubscriptions.push(SerialPortEmitter.addListener('onConnectionFailed', onConnectionFailed));
    };

    setTimeout(() => setListeners(), 2000);
  },[]);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>
          <Text style={{color: colors.green}}>Proto</Text>
          <Text style={{color: colors.orange}}>Raman</Text>
        </Text>
        <Image source={image} style={styles.image} resizeMode="contain"/>
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
      justifyContent: 'center',
    },
    title: {
      color: colors.body,
      fontSize: 66,
      letterSpacing: 10,
      ...fonts.title,
    },
    image: {
      width: 400,
      height: 296/624 * 400,
    },
  });
}

export default SplashScreen;
