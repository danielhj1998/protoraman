import React from 'react';
import {View, StyleSheet, Text, Image, useColorScheme, TouchableOpacity, Pressable, Button, Linking} from 'react-native';
import {useWindowDimensions} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import image from '@assets/images/imago.png';
import {Popup} from 'react-native-windows';
import {getColors} from '@app/utils/colors';
import fonts from '@app/utils/fonts';

const AboutModal = ({isVisible, onDismiss}) => {
  const colors = getColors(useColorScheme() === "dark");
  const styles = dynamicStyles(colors);

  return (
    <Popup
      accessible
      focusable
      isLightDismissEnabled={true}
      onDismiss={onDismiss}
      isOpen={isVisible}>
      <Pressable style={styles.container} onPress={onDismiss}>
        <Pressable>
          <View style={styles.card}>
            <Text style={styles.logoText}>
              <Text style={{color: colors.green}}>Proto</Text>
              <Text style={{color: colors.orange}}>Raman</Text>
            </Text>
            <Image source={image} style={styles.image} resizeMode="contain"/>
            <View style={{height: 20}} />
            <Text style={styles.body}>
              Este software está diseñado para ser utilizado con el prototipo de
              espectrómetro de efecto Raman, hecho como Trabajo Terminal para la
              carrera de ingeniería Mecatrónica en la UPIITA, con número de
              registro:
            </Text>
            <View style={{height: 20}} />
            <Text style={styles.title}>SAC/UPIITA/752/2022</Text>
            <View style={{height: 20}} />
            <View style={styles.personListsContainer}>
              <Text style={styles.body}>Alumnos:</Text>
              <View style={{height: 5}} />
              <Text style={styles.body}>• Daniel Hernandez Jiménez</Text>
              <Text style={styles.body}>• Alberto Rene Romero Rojas</Text>
              <Text style={styles.body}>• Teresa Sandoval Bañuelos</Text>
              <View style={{height: 20}} />
              <Text style={styles.body}>Asesores:</Text>
              <View style={{height: 5}} />
              <Text style={styles.body}>• Alvaro Gordillo Sol</Text>
              <Text style={styles.body}>• Carlos Eduardo Santolalla Vargas</Text>
              <Text style={styles.body}>• Sergio Gonzales Garduza</Text>
            </View>
            <View style={{height: 20}} />
            <Button
              title={'Hecho'}
              color={colors.body}
              onPress={onDismiss}
            />
          </View>
        </Pressable>
      </Pressable>
    </Popup>
  );
};

const dynamicStyles = (colors) =>{
  const {height, width} = useWindowDimensions();
  return StyleSheet.create({
    container: {
      backgroundColor: colors.body + '88',
      width: width,
      height: height,
      alignItems: 'center',
      justifyContent: 'center',
    },
    personListsContainer: {
      width: '60%',
    },
    nameContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    card: {
      backgroundColor: colors.background,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'space-around',
      width: '50%',
      padding: 20,
    },
    logoText: {
      color: colors.body,
      fontSize: 33.5,
      letterSpacing: 10,
      ...fonts.title,
    },
    title: {
      color: colors.body,
      fontSize: 14,
      ...fonts.title,
      fontWeight: 'bold',
    },
    body: {
      color: colors.body,
      fontSize: 14,
      ...fonts.body,
    },
    image: {
      width: 200,
      height: 296/624 * 200,
    },
  });
}

export default AboutModal;
