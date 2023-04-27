const Headers = {
  DEVICE_IDENTIFY: 'i',
  DEVICE_STATE: 's',
  TAKE_SAMPLE: 'S',
};

export const States = {
  DEVICE_ERROR: '-1',
  DEVICE_CONNECTING: '1',
  DEVICE_INITIALIZING: '2',
  DEVICE_READY: '3',
  DEVICE_DISCONNECTED: '4',
};

export const protoRamanDeviceIdentify = async (serial) => {
  await serial.deviceWriteString(Headers.DEVICE_IDENTIFY);
  const header = await serial.deviceReadString(1);
  if(header === Headers.DEVICE_IDENTIFY) {
    return true;
  }
  return false;
};

export const startWatcher = async (serial) => {
  const stat = await serial.getWatcherStatus();
  if (stat === "Stopped") {
    serial.startWatcher();
    return true;
  }
  return false;
};

export const getDeviceState = async (serial) => {
  serial.deviceWriteString(Headers.DEVICE_STATE);
  const header = await serial.deviceReadString(1);
  if(header === Headers.DEVICE_STATE) {
    const state = await serial.deviceReadString(1);
    return state;
  }
  return null;
};
