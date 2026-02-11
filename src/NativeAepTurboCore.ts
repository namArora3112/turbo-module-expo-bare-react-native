import { TurboModuleRegistry, type TurboModule } from 'react-native';

export interface Spec extends TurboModule {
  // Example
  multiply(a: number, b: number): number;

  // MobileCore
  extensionVersion(): Promise<string>;
  core_configureWithAppId(appId: string): void;
  core_initialize(initOptions: Object): Promise<void>;
  core_clearUpdatedConfiguration(): void;
  core_updateConfiguration(configMap: Object): void;
  core_setLogLevel(mode: string): void;
  core_getLogLevel(): Promise<string>;
  core_setPrivacyStatus(privacyStatus: string): void;
  core_getPrivacyStatus(): Promise<string>;
  core_getSdkIdentities(): Promise<string>;
  core_dispatchEvent(eventMap: Object): Promise<void>;
  core_dispatchEventWithResponseCallback(eventMap: Object, timeoutMs: number): Promise<Object>;
  core_trackAction(action: string, contextData: Object | null): void;
  core_trackState(state: string, contextData: Object | null): void;
  core_setAdvertisingIdentifier(advertisingIdentifier: string | null): void;
  core_setPushIdentifier(pushIdentifier: string | null): void;
  core_collectPii(data: Object): void;
  core_setSmallIconResourceID(resourceID: number): void;
  core_setLargeIconResourceID(resourceID: number): void;
  core_setAppGroup(appGroup: string | null): void;
  core_resetIdentities(): void;

  // Identity
  identity_extensionVersion(): Promise<string>;
  identity_syncIdentifiers(identifiers: Object | null): void;
  identity_syncIdentifiersWithAuthState(identifiers: Object | null, authenticationState: string): void;
  identity_syncIdentifier(identifierType: string, identifier: string, authenticationState: string): void;
  identity_appendVisitorInfoForURL(baseURL: string): Promise<string>;
  identity_getUrlVariables(): Promise<string>;
  identity_getIdentifiers(): Promise<Object[]>;
  identity_getExperienceCloudId(): Promise<string>;

  // Lifecycle
  lifecycle_extensionVersion(): Promise<string>;

  // Signal
  signal_extensionVersion(): Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('AepTurboCore');
