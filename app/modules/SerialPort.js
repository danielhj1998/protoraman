import {NativeModules} from 'react-native';

export const getDevices = NativeModules.SerialPort.getDevices;
