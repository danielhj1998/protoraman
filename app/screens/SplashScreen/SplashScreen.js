import React, {useEffect} from 'react';
import {View, StyleSheet, Text, Image, useColorScheme} from 'react-native';
import {getColors} from '@app/utils/colors';
import fonts from '@app/utils/fonts';
import image from '@assets/images/imago.png';
import {getDevices} from '@app/modules/SerialPort';

const SplashScreen = ({navigation}) => {
  const colors = getColors(useColorScheme() === "dark");
  const styles = dynamicStyles(colors);

  useEffect(() => {
    const isDeviceConnected = async () => {
      const devices = await getDevices('COM7');
      console.log(devices);
      if (devices){
        navigation.navigate('Main');
      } else {
        navigation.navigate('Connection');
      }
    };

    isDeviceConnected();
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

const dynamicStyles = (colors) =>{
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
