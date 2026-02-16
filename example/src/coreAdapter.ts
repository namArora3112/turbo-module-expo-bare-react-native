import {AepTurboCore, extensionVersion} from 'aep-turbo-core';

export const CORE_MODE_LABEL = 'aep-turbo-core';

const Core = {
  setLogLevel: (level: string) => AepTurboCore.setLogLevel(level),
  configureWithAppId: (appId: string) =>
    AepTurboCore.initializeWithAppId(appId).catch((e: unknown) =>
      console.error('AEP Core init error', e),
    ),
  trackAction: (action: string, data?: Record<string, string> | null) =>
    AepTurboCore.trackAction(action, data ?? null),
};

function getExtensionVersion(): Promise<string> {
  return extensionVersion();
}

export {Core, getExtensionVersion};
