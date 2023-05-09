import React, {useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet, useColorScheme} from 'react-native';
import {getColors} from '@app/utils/colors';
import fonts from '@app/utils/fonts';
import LaserPowerControl from '@app/screens/MainScreen/LaserPowerControl';
import ExposureTimeControl, {exposureTimeOptions} from '@app/screens/MainScreen/ExposureTimeControl';
import SpectrumReadingsControl from '@app/screens/MainScreen/SpectrumReadingsControl';
import ReadingTimeDisplay from '@app/screens/MainScreen/ReadingTimeDisplay';
import { SvgXml } from 'react-native-svg';
import svgImage from '@assets/images/calculator-equal-to.svg';
import TakeSampleButton from '@app/screens/MainScreen/TakeSampleButton';
import NormalizationProcess from '@app/screens/MainScreen/NormalizationProcess';
import FindPeaksProcess from '@app/screens/MainScreen/FindPeaksProcess';

const ProcessControlPanel = ({onTakeSamplePress}) => {
  const colors = getColors(useColorScheme() === 'dark');
  const styles = dynamicStyles(colors);
  const [controlTabActive, setControlTabActive] = useState(true);
  const [laserPower, setLaserPower] = useState(20);
  const [exposureTime, setExposureTime] = useState(100);
  const [spectrumReadings, setSpectrumReadings] = useState(5);
  const [readingTime, setReadingTime] = useState(0.6);

  const handleTimeChangingControl = (exposure, readings) => {
    setExposureTime(exposure);
    setSpectrumReadings(readings);
    setReadingTime((exposure * readings) / 1000);
  };

  const controlTabColor = controlTabActive ? colors.orange : colors.gray;
  const processingTabColor = controlTabActive ? colors.gray : colors.orange;
  const controlTabBorderColor = controlTabActive ? null : colors.gray;
  const processingTabBorderColor = controlTabActive ? colors.gray : null;

  const ControlPanel = () => {
    return (
      <View style={styles.panel}>
        <LaserPowerControl power={laserPower} onPowerSelect={setLaserPower} />
        <View style={styles.separator} />
        <ExposureTimeControl
          exposureTime={exposureTime}
          onExposureTimeChange={t =>
            handleTimeChangingControl(t, spectrumReadings)
          }
        />
        <SpectrumReadingsControl
          number={spectrumReadings}
          onNumberChange={n => handleTimeChangingControl(exposureTime, n)}
        />
        <SvgXml style={styles.icon} width="30" height="30" xml={svgImage} />
        <ReadingTimeDisplay readingTime={readingTime} />
        <View style={styles.separator} />
        <TakeSampleButton
          onTakeSamplePress={() =>
            onTakeSamplePress(laserPower, exposureTime, spectrumReadings)
          }
        />
      </View>
    );
  };

  const ProcessingPanel = () => {
    return (
      <View style={styles.panel}>
        <NormalizationProcess />
        <View style={styles.separator} />
        <FindPeaksProcess />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tabs,
            {borderBottomEndRadius: 10, borderColor: controlTabBorderColor, bottom: 2},
          ]}
          onPress={() => setControlTabActive(true)}>
          <Text style={[styles.title, {color: controlTabColor}]}>Muestreo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabs,
            {borderTopEndRadius: 10, borderColor: processingTabBorderColor, top: 2},
          ]}
          onPress={() => setControlTabActive(false)}>
          <Text style={[styles.title, {color: processingTabColor}]}>
            Procesamiento
          </Text>
        </TouchableOpacity>
      </View>
      {controlTabActive ? <ControlPanel /> : <ProcessingPanel />}
    </View>
  );
};

const dynamicStyles = (colors) => {
  return StyleSheet.create({
    container: {
      borderWidth: 5,
      borderRadius: 10,
      borderColor: colors.gray,
      overflow: 'hidden',
      flexDirection: 'row',
    },
    title: {
      color: colors.body,
      fontSize: 14,
      ...fonts.title,
      paddingVertical: 5,
      paddingHorizontal: 10,
    },
    body: {
      color: colors.body,
      fontSize: 14,
      ...fonts.body,
    },
    tabsContainer: {
      height: "102%",
    },
    tabs: {
      paddingVertical: 5,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      right: 2,
      flex: 1,
    },
    panel: {
      flexDirection: 'row',
      padding: 10,
    },
    separator: {
      backgroundColor: colors.gray,
      width: 1,
      height: "100%",
      marginHorizontal: 5,
    },
    icon: {
      color: colors.gray,
      alignSelf: 'center',
    },
  });
}

export default ProcessControlPanel;
