import React from 'react';
import {View, Text, StyleSheet, useColorScheme} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getColors} from '@app/utils/colors';
import fonts from '@app/utils/fonts';
import ToggleButton from '@app/components/ToggleButton';
import RangeSetting from '@app/screens/MainScreen/RangeSetting';
import TickStepSetting from '@app/screens/MainScreen/TickStepSetting';
import GridSetting from '@app/screens/MainScreen/GridSetting';
import ColorSetting from '@app/screens/MainScreen/ColorSetting';
import SaveSetting from '@app/screens/MainScreen/SaveSetting';

const SpectrumSettingsPanel = ({
  settings,
  onChangeSettings,
  onSnapshotSavePress,
  onDataSavePress,
}) => {
  const colors = getColors(useColorScheme() === 'dark');
  const styles = dynamicStyles(colors);
  const spectrumColors = [
    colors.orange,
    colors.yellow,
    colors.green,
    colors.cyan,
    colors.blue,
  ];
  const graphColors = [colors.body, colors.background];

  return (
    <View style={styles.container}>
      <View style={styles.horizontalOption}>
        <View style={styles.titleContainer}>
          <Text style={styles.body}>Mantener</Text>
          <Icon
            name="chart-multiple"
            color={colors.gray}
            size={25}
            style={styles.titleIcon}
          />
        </View>
        <ToggleButton
          enabled={settings.holdEnabled}
          onChangeEnabled={v => onChangeSettings({...settings, holdEnabled: v})}
        />
      </View>
      <View style={styles.separator} />
      <RangeSetting
        range={settings.viewRange}
        onChangeRange={v => onChangeSettings({...settings, viewRange: v})}
      />
      <TickStepSetting
        tickStep={settings.tickStep}
        onChangeTickStep={v => onChangeSettings({...settings, tickStep: v})}
      />
      <GridSetting
        enabled={settings.gridEnabled}
        ticks={settings.gridTicks}
        onChangeEnabled={v => onChangeSettings({...settings, gridEnabled: v})}
        onChangeTicks={v => onChangeSettings({...settings, gridTicks: v})}
      />
      <View style={styles.separator} />
      <ColorSetting
        title="Color del espectro"
        colorOptions={spectrumColors}
        selectedColor={settings.spectrumColor}
        onChangeColor={c => onChangeSettings({...settings, spectrumColor: c})}
      />
      <ColorSetting
        title="Color del fondo"
        colorOptions={graphColors}
        selectedColor={settings.graphColor}
        onChangeColor={c => onChangeSettings({...settings, graphColor: c})}
      />
      <View style={styles.separator} />
      <SaveSetting
        title="Captura"
        iconName="camera"
        formatOptions={['JPG', 'PNG', 'RAW']}
        onSavePress={onSnapshotSavePress}
      />
      <SaveSetting
        title="Guardar datos"
        iconName="content-save"
        style={styles.dataSave}
        formatOptions={['CSV', 'XLS', 'DATA']}
        onSavePress={onDataSavePress}
      />
    </View>
  );
};

const dynamicStyles = (colors) =>{
  return StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: colors.gray,
      padding: 10,
      left: 1,
      bottom: 1,
      height: '101%',
    },
    title: {
      color: colors.body,
      fontSize: 14,
      ...fonts.title,
    },
    body: {
      color: colors.body,
      fontSize: 14,
      ...fonts.body,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    titleIcon: {
      marginLeft: 5,
    },
    horizontalOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    separator: {
      backgroundColor: colors.placeholder,
      height: 1,
      width: '100%',
      marginVertical: 10,
    },
    optionContainer: {
      marginLeft: 10,
      alignItems: "flex-start",
    },
    buttonIcon: {
      borderWidth: 1,
      borderColor: colors.body,
      borderRadius: 5,
    },
    dataSave: {
      marginTop: 10,
    },
  });
}

export default SpectrumSettingsPanel;
