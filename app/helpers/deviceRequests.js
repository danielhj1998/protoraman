const Headers = {
  DEVICE_IDENTIFY: 'i',
  DEVICE_STATE: 's',
};

export const States = {
  DEVICE_INITIALIZING: '1',
  DEVICE_READY: '2',
};

export const protoRamanDeviceIdentify = async (serial) => {
  let isDeviceIdentified = false;
  await serial.deviceWriteString(Headers.DEVICE_IDENTIFY + 'proto');
  const header = await serial.deviceReadString(1);
  if(header === Headers.DEVICE_IDENTIFY) {
    const handshakeHalf = 'raman';
    const word = await serial.deviceReadString(handshakeHalf.length);
    if(word === handshakeHalf){
      isDeviceIdentified = true;
    }
  }
  return isDeviceIdentified;
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
