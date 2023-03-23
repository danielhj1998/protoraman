import React, {useState, useEffect} from 'react';
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
import SerialPort from '@app/modules/NativeSerialPort.ts';
import { NativeEventEmitter } from 'react-native';
import {getDeviceState, States} from '@app/helpers/deviceRequests';
import {siliconSpectrumPoints} from '@app/utils/dummyData';

const SerialPortEmitter = new NativeEventEmitter(SerialPort);

const MainScreen = () => {
  const colors = getColors(useColorScheme() === "dark");
  const styles = dynamicStyles(colors);
  const [spectrumSettings, setSpectrumSettings] = useState(defaultSpectrumSettings(colors));
  const [processState, setProcessState] = useState("iniciando");
  const [isDeviceConnected, setIsDeviceConnected] = useState(true);
  const [data, setData] = useState(siliconSpectrumPoints);
  let eventSubscriptions = [];

  const handleTakeSample = async () => {
    try{
      await SerialPort.deviceWriteString("n");
      const header = await SerialPort.deviceReadString(1);
      const arrayLength = await SerialPort.deviceReadUInt16();
      const array = await SerialPort.deviceReadUInt16Array(arrayLength);
      const wavelengthStep = (598 - 528) / arrayLength;
      const newData = array.map((n, i) => [wavelength2ramanshift(528 + i * wavelengthStep, 520), n / 4095]);
      setData(newData);
    }catch(error){
      console.log(error);
    }
  };

  const wavelength2ramanshift = (wavelength, excitationWavelength) => {
    return 1e7 / excitationWavelength - 1e7 / wavelength;
  };

  const onDataRead = (s) => {
    console.log('DataRead:' + s);
  }

  useEffect(() => {
    const getState = async () => {
      const state = await getDeviceState(SerialPort);
      switch(state) {
        case States.DEVICE_INITIALIZING:
          if (processState !== "iniciando") {
            setProcessState("iniciando");
          }
          break;
        case States.DEVICE_READY:
          if (processState !== "inactivo") {
            setProcessState("inactivo");
          }
          break;
        default:
          break;
      };
    };

    setInterval(getState, 1000);
  }, []);

  useEffect(() => {
    eventSubscriptions.push(SerialPortEmitter.addListener('onDataRead', onDataRead));
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topPanelContainer}>
        <ProcessControlPanel onTakeSamplePress={handleTakeSample} />
        <View style={styles.statusIconsContainer}>
          <StatusPanel isConnected={isDeviceConnected} processState={processState} />
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
          data={data}
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
