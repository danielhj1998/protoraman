import React, {useRef, useState, useEffect} from 'react';
import {View, StyleSheet, useColorScheme, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getColors} from '@app/utils/colors';
import fonts from '@app/utils/fonts';
import ProcessControlPanel from '@app/screens/MainScreen/ProcessControlPanel';
import StatusPanel from '@app/screens/MainScreen/StatusPanel';
import SpectrumPanel from '@app/screens/MainScreen/SpectrumPanel';
import SpectrumSettingsPanel from '@app/screens/MainScreen/SpectrumSettingsPanel';
import {defaultSpectrumSettings} from '@app/utils/defaultValues';
import SerialPort from '@app/modules/NativeSerialPort.ts';
import AboutModal from '@app/screens/MainScreen/AboutModal';
import SettingsModal from '@app/screens/MainScreen/SettingsModal';
import HelpModal from '@app/screens/MainScreen/HelpModal';
import { NativeEventEmitter } from 'react-native';
import {protoRamanDeviceIdentify, startWatcher, States, getSpectrum} from '@app/helpers/deviceRequests';
import {siliconSpectrumPoints, synthetic, linearSpectrum} from '@app/utils/dummyData';
import {w1, w2} from '@app/utils/myspectrum';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']);

const SerialPortEmitter = new NativeEventEmitter(SerialPort);

const MainScreen = () => {
  const colors = getColors(useColorScheme() === "dark");
  const styles = dynamicStyles(colors);
  const [spectrumSettings, setSpectrumSettings] = useState(defaultSpectrumSettings(colors));
  const [processState, setProcessState] = useState(States.DEVICE_READY);
  const [data, setData] = useState([]);
  const [rangeSelectionMode, setRangeSelectionMode] = useState("none");
  const [isAboutPopupVisible, setIsAboutPopupVisible] = useState(false);
  const [isHelpPopupVisible, setIsHelpPopupVisible] = useState(false);
  //const [isSettingsPopupVisible, setIsSettingsPopupVisible] = useState(false);
  const [takeSampleEnabled, setTakeSampleEnabled] = useState(true);
  const [laserPower, setLaserPower] = useState(20);
  const [exposureTime, setExposureTime] = useState(200);
  const [spectrumReadings, setSpectrumReadings] = useState(1);
  const chartRef = useRef();
  let eventSubscriptions = [];

  const handleOnSpectrumSettingsChanged = (settings) => {
    setSpectrumSettings(settings);
    let newData = [...data];
    newData[newData.length - 1].color = settings.spectrumColor;
    setData(newData);
  };

  const handleTakeSample = async (power, exposure, readings) => {
    setTakeSampleEnabled(false);
    const spectrum = await getSpectrum(SerialPort, power / 20 - 1, exposure, readings);
    if(spectrumSettings.holdEnabled === true) {
      setData([...data, {data: spectrum, color: spectrumSettings.spectrumColor}]);
    } else {
      setData([{data: spectrum, color: spectrumSettings.spectrumColor}]);
    }
    setTakeSampleEnabled(true);
  };

  const onDeviceConnected = () => {
    setTimeout(async () => {
      const correct = await protoRamanDeviceIdentify(SerialPort);
      if(correct) {
        setProcessState(States.DEVICE_READY);
        setTakeSampleEnabled(true);
      } else {
        Serial.deviceDispose();
      }
    }, 2000);
  }

  const snapshotSaveHandler = async (format) => {
    const suggestedName = ['espectro', laserPower, 'mW', exposureTime, 'us', spectrumReadings,'veces'].join('-');
    chartRef.current.saveChart(suggestedName, [format]);
  };

  const dataSaveHandler = async (format) => {
    const suggestedName = ['espectro', laserPower, 'mW', exposureTime, 'us', spectrumReadings,'veces'].join('-');
    chartRef.current.saveData(suggestedName, [format]);
  };

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
            setTakeSampleEnabled(false);
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

    //startWatcher(SerialPort);
    //addListeners();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topPanelContainer}>
        <ProcessControlPanel onTakeSamplePress={handleTakeSample} takeSampleEnabled={takeSampleEnabled} laserPower={laserPower} onLaserPowerChange={setLaserPower} exposureTime={exposureTime} onExposureTimeChange={setExposureTime} spectrumReadings={spectrumReadings} onSpectrumReadingsChange={setSpectrumReadings}/>
        <View style={styles.statusIconsContainer}>
          <StatusPanel processState={processState} />
          <TouchableOpacity onPress={() => setIsAboutPopupVisible(true)}>
            <Icon name="information" color={colors.gray} size={40} />
          </TouchableOpacity>
          <AboutModal isVisible={isAboutPopupVisible} onDismiss={() => setIsAboutPopupVisible(false)}/>
          <TouchableOpacity onPress={() => setIsHelpPopupVisible(true)}>
            <Icon name="help-circle" color={colors.gray} size={40} />
          </TouchableOpacity>
          <HelpModal isVisible={isHelpPopupVisible} onDismiss={() => setIsHelpPopupVisible(false)}/>
          {
          //<TouchableOpacity onPress={() => setIsSettingsPopupVisible(true)}>
            //<SvgXml style={styles.svg} width="43" height="43" xml={svgImage} />
          //</TouchableOpacity>
          //<SettingsModal isVisible={isSettingsPopupVisible} onDismiss={() => setIsSettingsPopupVisible(false)}/>
          }
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
          graphColor={spectrumSettings.graphColor}
          zoomMode={rangeSelectionMode}
        />
        <SpectrumSettingsPanel
          settings={spectrumSettings}
          onChangeSettings={handleOnSpectrumSettingsChanged}
          rangeSelectionMode={rangeSelectionMode}
          onChangeRangeSelectionMode={setRangeSelectionMode}
          onSnapshotSavePress={snapshotSaveHandler}
          onDataSavePress={dataSaveHandler}
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
