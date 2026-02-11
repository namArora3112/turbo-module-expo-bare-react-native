import NativeAepTurboCore from './NativeAepTurboCore';

export function multiply(a: number, b: number): number {
  return NativeAepTurboCore.multiply(a, b);
}

/**
 * Returns the version of the AEP Core extension.
 */
export function extensionVersion(): Promise<string> {
  return NativeAepTurboCore.extensionVersion();
}

// --- AepTurboCore API (Core / MobileCore surface via NativeAepTurboCore) ---
export const AepTurboCore = {
  extensionVersion: () => NativeAepTurboCore.extensionVersion(),
  configureWithAppId: (appId?: string) =>
    NativeAepTurboCore.core_configureWithAppId(appId ?? ''),
  initialize: (initOptions: Record<string, unknown>) =>
    NativeAepTurboCore.core_initialize(initOptions),
  clearUpdatedConfiguration: () => NativeAepTurboCore.core_clearUpdatedConfiguration(),
  updateConfiguration: (configMap?: Record<string, unknown>) =>
    NativeAepTurboCore.core_updateConfiguration(configMap ?? {}),
  setLogLevel: (mode: string) => NativeAepTurboCore.core_setLogLevel(mode),
  getLogLevel: () => NativeAepTurboCore.core_getLogLevel(),
  setPrivacyStatus: (privacyStatus: string) =>
    NativeAepTurboCore.core_setPrivacyStatus(privacyStatus),
  getPrivacyStatus: () => NativeAepTurboCore.core_getPrivacyStatus(),
  getSdkIdentities: () => NativeAepTurboCore.core_getSdkIdentities(),
  dispatchEvent: (event: Record<string, unknown>) =>
    NativeAepTurboCore.core_dispatchEvent(event),
  dispatchEventWithResponseCallback: (
    event: Record<string, unknown>,
    timeoutMs: number
  ) => NativeAepTurboCore.core_dispatchEventWithResponseCallback(event, timeoutMs),
  trackAction: (action?: string, contextData?: Record<string, string> | null) =>
    NativeAepTurboCore.core_trackAction(action ?? '', contextData ?? null),
  trackState: (state?: string, contextData?: Record<string, string> | null) =>
    NativeAepTurboCore.core_trackState(state ?? '', contextData ?? null),
  setAdvertisingIdentifier: (advertisingIdentifier?: string | null) =>
    NativeAepTurboCore.core_setAdvertisingIdentifier(advertisingIdentifier ?? null),
  setPushIdentifier: (pushIdentifier?: string | null) =>
    NativeAepTurboCore.core_setPushIdentifier(pushIdentifier ?? null),
  collectPii: (data: Record<string, string>) => NativeAepTurboCore.core_collectPii(data),
  setSmallIconResourceID: (resourceID: number) =>
    NativeAepTurboCore.core_setSmallIconResourceID(resourceID),
  setLargeIconResourceID: (resourceID: number) =>
    NativeAepTurboCore.core_setLargeIconResourceID(resourceID),
  setAppGroup: (appGroup?: string | null) =>
    NativeAepTurboCore.core_setAppGroup(appGroup ?? null),
  resetIdentities: () => NativeAepTurboCore.core_resetIdentities(),
};

// --- Identity API ---
export const Identity = {
  extensionVersion: () => NativeAepTurboCore.identity_extensionVersion(),
  syncIdentifiers: (identifiers?: Record<string, string> | null) =>
    NativeAepTurboCore.identity_syncIdentifiers(identifiers ?? null),
  syncIdentifiersWithAuthState: (
    identifiers: Record<string, string> | null,
    authenticationState: string
  ) =>
    NativeAepTurboCore.identity_syncIdentifiersWithAuthState(
      identifiers,
      authenticationState
    ),
  syncIdentifier: (
    identifierType: string,
    identifier: string,
    authenticationState: string
  ) =>
    NativeAepTurboCore.identity_syncIdentifier(
      identifierType,
      identifier,
      authenticationState
    ),
  appendVisitorInfoForURL: (baseURL: string) =>
    NativeAepTurboCore.identity_appendVisitorInfoForURL(baseURL),
  getUrlVariables: () => NativeAepTurboCore.identity_getUrlVariables(),
  getIdentifiers: () => NativeAepTurboCore.identity_getIdentifiers(),
  getExperienceCloudId: () => NativeAepTurboCore.identity_getExperienceCloudId(),
};

// --- Lifecycle API ---
export const Lifecycle = {
  extensionVersion: () => NativeAepTurboCore.lifecycle_extensionVersion(),
};

// --- Signal API ---
export const Signal = {
  extensionVersion: () => NativeAepTurboCore.signal_extensionVersion(),
};

export default NativeAepTurboCore;
