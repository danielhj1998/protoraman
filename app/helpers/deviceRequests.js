const Headers = {
  DEVICE_IDENTIFY: 'i',
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
