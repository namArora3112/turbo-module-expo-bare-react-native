import AepTurboCore from './NativeAepTurboCore';

export function multiply(a: number, b: number): number {
  return AepTurboCore.multiply(a, b);
}

/**
 * Returns the version of the AEP Turbo Core extension
 * @return Promise<string> a promise that resolves with the extension version
 */
export function extensionVersion(): Promise<string> {
  return AepTurboCore.extensionVersion();
}
