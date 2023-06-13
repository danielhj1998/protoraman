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

export const getSpectrum = async (serial, powerIndex, exposure, readings) => {
  try{
    const arrayLength = 3694;
    const wavelengthStep = (598 - 528) / arrayLength;
    let newData = Array(arrayLength).fill().map((n, i) => [wavelength2ramanshift(528 + i * wavelengthStep, 520),0]);
    for(let i = 0; i < readings; i++) {
      await serial.deviceWriteString(Headers.TAKE_SAMPLE);
      const header = await serial.deviceReadString(1);
      if(header === Headers.TAKE_SAMPLE) {
        await serial.deviceWriteUInt16Array([powerIndex, exposure]);
        const array = await serial.deviceReadUInt16Array(arrayLength);
        array.reverse();
        const lowOffset = 0.13;
        const saturationMax = 0.40;
        newData = array.map((n, i) => [newData[i][0], newData[i][1] + (1 - n / 4095 - lowOffset) / saturationMax]);
      }
    }
    return newData;

  }catch(error){
    console.log(error);
  }
};

export const wavelength2ramanshift = (wavelength, excitationWavelength) => {
  return 1e7 / excitationWavelength - 1e7 / wavelength;
};

