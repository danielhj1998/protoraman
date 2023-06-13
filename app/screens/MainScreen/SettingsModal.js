import React, {useState} from 'react';
import {View, StyleSheet, Text, Image, useColorScheme, TouchableOpacity, Pressable, Button, Linking} from 'react-native';
import {useWindowDimensions} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Popup} from 'react-native-windows';
import {getColors} from '@app/utils/colors';
import fonts from '@app/utils/fonts';
import ToggleButton from '@app/components/ToggleButton';

const SettingsModal = ({isVisible, onDismiss}) => {
  const [isDarkModeOn, setIsDarkModeOn] = useState(false);
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
            <View style={styles.settingContainer}>
              <View style={styles.label}>
                <Text style={styles.body}>Dark mode</Text>
                <Icon name="circle-half-full" color={colors.gray} size={20} />
              </View>
              <ToggleButton enabled={isDarkModeOn} onChangeEnabled={setIsDarkModeOn}/>
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
    settingContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    card: {
      backgroundColor: colors.background,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'space-around',
      width: width / 6,
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
      marginRight: 5,
    },
    image: {
      width: 200,
      height: 296/624 * 200,
    },
    label: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });
}

export default SettingsModal;
