package com.aepturbocore

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

/**
 * Registers AepTurboCore Turbo Module in the React Native runtime (per Turbo Native Modules doc).
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
          AepTurboCoreModule.NAME,       // name
          AepTurboCoreModule.NAME,       // className
          false,                         // canOverrideExistingModule
          false,                         // needsEagerInit
          false,                         // isCxxModule
          true                           // isTurboModule
        )
      )
    }
}
