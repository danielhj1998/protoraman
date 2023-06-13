import React from 'react';
import {View, StyleSheet, Text, Image, useColorScheme, TouchableOpacity, Pressable, Button, Linking} from 'react-native';
import {useWindowDimensions} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import image from '@assets/images/imago.png';
import {Popup} from 'react-native-windows';
import {getColors} from '@app/utils/colors';
import fonts from '@app/utils/fonts';

const HelpModal = ({isVisible, onDismiss}) => {
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
            <Image source={image} style={styles.image} resizeMode="contain" />
            <View style={{height: 20}} />
            <Text style={styles.body}>
              Cualquier duda o sugerencia, favor de comunicarse con los
              siguientes contactos:
            </Text>
            <View style={{height: 20}} />
            <View style={styles.personListsContainer}>
              <View style={styles.nameContainer}>
                <Text style={styles.body}>• Daniel Hernandez Jiménez</Text>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL('mailto:danielhj1998@gmail.com')
                  }>
                  <Icon name="email" color={colors.gray} size={25} />
                </TouchableOpacity>
              </View>
              <View style={styles.nameContainer}>
                <Text style={styles.body}>• Alberto Rene Romero Rojas</Text>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL('mailto:albertorene2009@hotmail.com')
                  }>
                  <Icon name="email" color={colors.gray} size={25} />
                </TouchableOpacity>
              </View>
              <View style={styles.nameContainer}>
                <Text style={styles.body}>• Teresa Sandoval Bañuelos</Text>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL('mailto:banuelos.t16@gmail.com')
                  }>
                  <Icon name="email" color={colors.gray} size={25} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{height: 20}} />
            <Button title={'Hecho'} color={colors.body} onPress={onDismiss} />
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

export default HelpModal;
