import React, {useRef, useState, useEffect} from 'react';
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
import {protoRamanDeviceIdentify, startWatcher, States, getSpectrum} from '@app/helpers/deviceRequests';
import {siliconSpectrumPoints} from '@app/utils/dummyData';

const SerialPortEmitter = new NativeEventEmitter(SerialPort);

const MainScreen = () => {
  const colors = getColors(useColorScheme() === "dark");
  const styles = dynamicStyles(colors);
  const [spectrumSettings, setSpectrumSettings] = useState(defaultSpectrumSettings(colors));
  const [processState, setProcessState] = useState(States.DEVICE_INITIALIZING);
  const [data, setData] = useState(siliconSpectrumPoints);
  const [rangeSelectionMode, setRangeSelectionMode] = useState("none");
  const chartRef = useRef();
  let eventSubscriptions = [];

  const handleTakeSample = async (power, exposure, readings) => {
    const spectrum = await getSpectrum(SerialPort, power / 20 - 1, exposure, readings);
    setData(spectrum);
  };

  const onDeviceConnected = () => {
    setTimeout(async () => {
      const correct = await protoRamanDeviceIdentify(SerialPort);
      if(correct) {
        setProcessState(States.DEVICE_INITIALIZING);
      } else {
        Serial.deviceDispose();
      }
    }, 2000);
  }

  useEffect(() => {
    const addListeners = async () => {
      eventSubscriptions.push(
        SerialPortEmitter.addListener('onConnecting', () =>
          setProcessState(States.DEVICE_CONNECTING),
        ),
      );
      eventSubscriptions.push(
        SerialPortEmitter.addListener('onDeviceConnected', onDeviceConnected),
      );
      eventSubscriptions.push(
        SerialPortEmitter.addListener('onDeviceDisconnected', () => {
          try {
            setProcessState(States.DEVICE_DISCONNECTED);
          } catch(err) {
            console.log(err);
          }
        }),
      );
      eventSubscriptions.push(
        SerialPortEmitter.addListener('onConnectionFailed', () =>
          setProcessState(States.DEVICE_ERROR),
        ),
      );
    };

    startWatcher(SerialPort);
    addListeners();
  }, []);

  //useEffect(() => {
    //const getState = async () => {
      //const state = await getDeviceState(SerialPort);
      //setProcessState(state);
    //};

    //setInterval(getState, 1000);
  //}, []);

  return (
    <View style={styles.container}>
      <View style={styles.topPanelContainer}>
        <ProcessControlPanel onTakeSamplePress={handleTakeSample} />
        <View style={styles.statusIconsContainer}>
          <StatusPanel processState={processState} />
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
          ref={chartRef}
          data={data}
          range={spectrumSettings.viewRange}
          intervals={spectrumSettings.tickStep}
          gridEnabled={spectrumSettings.gridEnabled}
          gridTicks={spectrumSettings.gridTicks}
          spectrumColor={spectrumSettings.spectrumColor}
          graphColor={spectrumSettings.graphColor}
          zoomMode={rangeSelectionMode}
        />
        <SpectrumSettingsPanel
          settings={spectrumSettings}
          onChangeSettings={setSpectrumSettings}
          rangeSelectionMode={rangeSelectionMode}
          onChangeRangeSelectionMode={setRangeSelectionMode}
          onSnapshotSavePress={() => {chartRef.current.saveChart()}}
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
