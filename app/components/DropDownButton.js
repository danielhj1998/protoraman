import React, {useState} from 'react';
import {View, Text, ScrollView, StyleSheet, useColorScheme} from 'react-native';
import {getColors} from '@app/utils/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import fonts from '@app/utils/fonts';
import {Menu, MenuOptions, MenuOption, MenuTrigger, renderers} from 'react-native-popup-menu';

const DropDownButton = ({value, options, onSelect}) => {
  const colors = getColors(useColorScheme() === "dark");
  const styles = dynamicStyles(colors);

  const menuOptions = options.map((value, index) => <MenuOption key={index} onSelect={() => onSelect(value)}>
      <Text style={styles.text}>{value}</Text>
    </MenuOption>);

  return (
    <View style={styles.borderCropper}>
      <Menu renderer={CustomContextMenu}>
        <MenuTrigger style={styles.container}>
          <Text style={styles.text}>{value}</Text>
          <Icon name="menu-down" size={20} color={colors.gray}/>
        </MenuTrigger>
        <MenuOptions customStyles={{optionsContainer: styles.listContainer}}>
          {menuOptions}
        </MenuOptions>
      </Menu>
    </View>
  );
};

const CustomContextMenu = ({style, layouts, children}) => {
  const position = renderers.ContextMenu.computePosition(layouts);
  const width = layouts.triggerLayout.width;

  return (
    <View style={[style, position, {width: width}]}>
      <ScrollView showsVerticalScrollIndicator={false} >
        {children}
      </ScrollView>
    </View>
  );
}

const dynamicStyles = (colors) =>{
  return StyleSheet.create({
    borderCropper: {
      borderRadius: 5,
    },
    container: {
      borderWidth: 1,
      borderColor: colors.gray,
      borderRadius: 5,
      paddingLeft: 10,
      paddingRight: 2,
      paddingVertical: 3,
      flexDirection: 'row',
      alignItems: 'center',
    },
    text: {
      color: colors.body,
      fontSize: 14,
      ...fonts.body,
    },
    listContainer: {
      borderRadius: 5,
      backgroundColor: colors.background,
      borderColor: colors.gray,
      borderWidth: 1,
      alignItems: 'center',
    },
  });
}

export default DropDownButton;
