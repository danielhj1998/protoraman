import React, {useState} from 'react';
import {View, StyleSheet, useColorScheme, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SvgXml} from 'react-native-svg';
import svgImage from '@assets/images/settings-48-filled.svg';
import {getColors} from '@app/utils/colors';
import fonts from '@app/utils/fonts';
import ProcessControlPanel from '@app/screens/MainScreen/ProcessControlPanel';
import StatusPanel from '@app/screens/MainScreen/StatusPanel';
import SpectrumPanel from '@app/screens/MainScreen/SpectrumPanel';
import SpectrumSettingsPanel from '@app/screens/MainScreen/SpectrumSettingsPanel';
import {defaultSpectrumSettings} from '@app/utils/defaultValues';

const MainScreen = () => {
  const colors = getColors(useColorScheme() === "dark");
  const styles = dynamicStyles(colors);
  const [spectrumSettings, setSpectrumSettings] = useState(defaultSpectrumSettings(colors));

  return (
    <View style={styles.container}>
      <View style={styles.topPanelContainer}>
        <ProcessControlPanel />
        <View style={styles.statusIconsContainer}>
          <StatusPanel isConnected={true} processState="inactivo" />
          <TouchableOpacity>
            <Icon name="information" color={colors.gray} size={40} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="help-circle" color={colors.gray} size={40} />
          </TouchableOpacity>
          <TouchableOpacity>
            <SvgXml style={styles.svg} width="43" height="43" xml={svgImage} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.spectrumPanel}>
        <SpectrumPanel
          range={spectrumSettings.viewRange}
          intervals={spectrumSettings.tickStep}
          gridEnabled={spectrumSettings.gridEnabled}
          gridTicks={spectrumSettings.gridTicks}
          spectrumColor={spectrumSettings.spectrumColor}
          graphColor={spectrumSettings.graphColor}
        />
        <SpectrumSettingsPanel
          settings={spectrumSettings}
          onChangeSettings={setSpectrumSettings}
        />
      </View>
    </View>
  );
};

const dynamicStyles = (colors) =>{
  return StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      flex: 1,
      padding: 10,
      width: '100%',
    },
    title: {
      color: colors.body,
      fontSize: 14,
      ...fonts.title,
    },
    topPanelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    statusIconsContainer: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    svg: {
      color: colors.gray,
      x: 5,
      y: 4,
    },
    spectrumPanel: {
      borderWidth: 5,
      borderColor: colors.gray,
      borderRadius: 10,
      marginTop: 10,
      flexDirection: 'row',
      flex: 1,
    },
  });
}

export default MainScreen;
