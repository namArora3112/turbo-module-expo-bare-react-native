package com.aepturbocore

import com.adobe.marketing.mobile.MobileCore
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext

/**
 * Turbo Native Module implementing NativeAepTurboCoreSpec.
 * Registered via AepTurboCorePackage (no @ReactModule; see Turbo Native Modules doc).
 */
class AepTurboCoreModule(reactContext: ReactApplicationContext) :
  NativeAepTurboCoreSpec(reactContext) {

  override fun getName(): String = NAME

  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }

  /**
   * Returns the version of the AEP Turbo Core extension (from MobileCore.extensionVersion()).
   * @param promise Promise that resolves with the extension version
   */
  override fun extensionVersion(promise: Promise) {
    promise.resolve(MobileCore.extensionVersion())
  }

  companion object {
    const val NAME = "AepTurboCore"
  }
}
