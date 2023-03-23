import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  getDevices(): Promise<object>;
  createWatcher() : void;
  deviceDispose(): void;
  deviceWriteString(message: string): Promise<bool>;
  deviceWriteUInt16(number: number): Promise<bool>;
  deviceReadString(stringLength: number): Promise<string>;
  deviceReadUInt16(): Promise<number>;
  deviceReadUInt16Array(arrayLength: number): Promise<Array<Number>>;
}

export default TurboModuleRegistry.get<Spec>(
  'SerialPort'
) as Spec | null;
