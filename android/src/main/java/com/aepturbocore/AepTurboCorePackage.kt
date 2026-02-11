package com.aepturbocore

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

/**
 * Registers AepTurboCore Turbo Module in the React Native runtime.
 * Follows: https://reactnative.dev/docs/turbo-native-modules-introduction?platforms=android
 *
 * - Extends [BaseReactPackage]
 * - [getModule] returns [AepTurboCoreModule] when name matches [AepTurboCoreModule.NAME]
 * - [getReactModuleInfoProvider] returns [ReactModuleInfo] with isTurboModule = true
 */
class AepTurboCorePackage : BaseReactPackage() {

  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? =
    if (name == AepTurboCoreModule.NAME) {
      AepTurboCoreModule(reactContext)
    } else {
      null
    }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider =
    ReactModuleInfoProvider {
      mapOf(
        AepTurboCoreModule.NAME to ReactModuleInfo(
          name = AepTurboCoreModule.NAME,
          className = AepTurboCoreModule.NAME,
          canOverrideExistingModule = false,
          needsEagerInit = false,
          isCxxModule = false,
          isTurboModule = true
        )
      )
    }
}
