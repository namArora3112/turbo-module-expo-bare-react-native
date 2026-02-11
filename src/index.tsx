import AepTurboCore from './NativeAepTurboCore';

export function multiply(a: number, b: number): number {
  return AepTurboCore.multiply(a, b);
}

/**
 * Returns the version of the AEP Core extension (MobileCore).
 */
export function extensionVersion(): Promise<string> {
  return AepTurboCore.extensionVersion();
}

// --- MobileCore API (mirrors @adobe/react-native-aepcore) ---
export const MobileCore = {
  extensionVersion: () => AepTurboCore.extensionVersion(),
  configureWithAppId: (appId?: string) => AepTurboCore.core_configureWithAppId(appId ?? ''),
  initialize: (initOptions: Record<string, unknown>) => AepTurboCore.core_initialize(initOptions),
  clearUpdatedConfiguration: () => AepTurboCore.core_clearUpdatedConfiguration(),
  updateConfiguration: (configMap?: Record<string, unknown>) =>
    AepTurboCore.core_updateConfiguration(configMap ?? {}),
  setLogLevel: (mode: string) => AepTurboCore.core_setLogLevel(mode),
  getLogLevel: () => AepTurboCore.core_getLogLevel(),
  setPrivacyStatus: (privacyStatus: string) => AepTurboCore.core_setPrivacyStatus(privacyStatus),
  getPrivacyStatus: () => AepTurboCore.core_getPrivacyStatus(),
  getSdkIdentities: () => AepTurboCore.core_getSdkIdentities(),
  dispatchEvent: (event: Record<string, unknown>) => AepTurboCore.core_dispatchEvent(event),
  dispatchEventWithResponseCallback: (event: Record<string, unknown>, timeoutMs: number) =>
    AepTurboCore.core_dispatchEventWithResponseCallback(event, timeoutMs),
  trackAction: (action?: string, contextData?: Record<string, string> | null) =>
    AepTurboCore.core_trackAction(action ?? '', contextData ?? null),
  trackState: (state?: string, contextData?: Record<string, string> | null) =>
    AepTurboCore.core_trackState(state ?? '', contextData ?? null),
  setAdvertisingIdentifier: (advertisingIdentifier?: string | null) =>
    AepTurboCore.core_setAdvertisingIdentifier(advertisingIdentifier ?? null),
  setPushIdentifier: (pushIdentifier?: string | null) =>
    AepTurboCore.core_setPushIdentifier(pushIdentifier ?? null),
  collectPii: (data: Record<string, string>) => AepTurboCore.core_collectPii(data),
  setSmallIconResourceID: (resourceID: number) => AepTurboCore.core_setSmallIconResourceID(resourceID),
  setLargeIconResourceID: (resourceID: number) => AepTurboCore.core_setLargeIconResourceID(resourceID),
  setAppGroup: (appGroup?: string | null) => AepTurboCore.core_setAppGroup(appGroup ?? null),
  resetIdentities: () => AepTurboCore.core_resetIdentities(),
};

// --- Identity API ---
export const Identity = {
  extensionVersion: () => AepTurboCore.identity_extensionVersion(),
  syncIdentifiers: (identifiers?: Record<string, string> | null) =>
    AepTurboCore.identity_syncIdentifiers(identifiers ?? null),
  syncIdentifiersWithAuthState: (
    identifiers: Record<string, string> | null,
    authenticationState: string
  ) => AepTurboCore.identity_syncIdentifiersWithAuthState(identifiers, authenticationState),
  syncIdentifier: (identifierType: string, identifier: string, authenticationState: string) =>
    AepTurboCore.identity_syncIdentifier(identifierType, identifier, authenticationState),
  appendVisitorInfoForURL: (baseURL: string) =>
    AepTurboCore.identity_appendVisitorInfoForURL(baseURL),
  getUrlVariables: () => AepTurboCore.identity_getUrlVariables(),
  getIdentifiers: () => AepTurboCore.identity_getIdentifiers(),
  getExperienceCloudId: () => AepTurboCore.identity_getExperienceCloudId(),
};

// --- Lifecycle API ---
export const Lifecycle = {
  extensionVersion: () => AepTurboCore.lifecycle_extensionVersion(),
};

// --- Signal API ---
export const Signal = {
  extensionVersion: () => AepTurboCore.signal_extensionVersion(),
};

export default AepTurboCore;
