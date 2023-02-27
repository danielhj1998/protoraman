import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  getDevices(): Promise<object>
  createWatcher() : void;
}

export default TurboModuleRegistry.get<Spec>(
  'SerialPort'
) as Spec | null;
