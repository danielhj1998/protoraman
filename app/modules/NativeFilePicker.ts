import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  pickDirectory(): Promise<object>;
}

export default TurboModuleRegistry.get<Spec>(
  'FilePicker'
) as Spec | null;
