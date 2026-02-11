package com.aepturbocore

import android.app.Application
import com.adobe.marketing.mobile.AdobeCallback
import com.adobe.marketing.mobile.AdobeCallbackWithError
import com.adobe.marketing.mobile.AdobeError
import com.adobe.marketing.mobile.Event
import com.adobe.marketing.mobile.Identity
import com.adobe.marketing.mobile.Lifecycle
import com.adobe.marketing.mobile.MobileCore
import com.adobe.marketing.mobile.Signal
import com.adobe.marketing.mobile.VisitorID
import com.adobe.marketing.mobile.WrapperType
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap

/**
 * AepTurboCore Turbo Native Module (Android).
 * Structure follows the official guide:
 * https://reactnative.dev/docs/turbo-native-modules-introduction?platforms=android
 *
 * - Extends Codegen-generated [NativeAepTurboCoreSpec]
 * - Implements [getName] returning [NAME]
 * - All spec methods implemented below.
 */
class AepTurboCoreModule(reactContext: ReactApplicationContext) :
  NativeAepTurboCoreSpec(reactContext) {

  init {
    MobileCore.setWrapperType(WrapperType.REACT_NATIVE)
  }

  override fun getName(): String = NAME

  override fun multiply(a: Double, b: Double): Double = a * b

  override fun extensionVersion(promise: Promise) {
    promise.resolve(MobileCore.extensionVersion())
  }

  // --- MobileCore ---
  override fun core_configureWithAppId(appId: String) {
    MobileCore.configureWithAppID(appId)
  }

  override fun core_initialize(initOptions: ReadableMap?, promise: Promise) {
    val options = CoreDataBridge.initOptionsFromReadableMap(initOptions)
    if (options == null) {
      promise.reject(NAME, "InitOptions is null or invalid.")
      return
    }
    val app = reactApplicationContext.applicationContext as? Application
    if (app == null) {
      promise.reject(NAME, "Application context not available.")
      return
    }
    MobileCore.initialize(app, options, object : AdobeCallback<Boolean> {
      override fun call(value: Boolean) {
        promise.resolve(null)
      }
    })
  }

  override fun core_clearUpdatedConfiguration() {
    MobileCore.clearUpdatedConfiguration()
  }

  override fun core_updateConfiguration(configMap: ReadableMap?) {
    MobileCore.updateConfiguration(MapUtil.toMap(configMap) ?: emptyMap())
  }

  override fun core_setLogLevel(mode: String) {
    MobileCore.setLogLevel(CoreDataBridge.loggingModeFromString(mode))
  }

  override fun core_getLogLevel(promise: Promise) {
    promise.resolve(CoreDataBridge.stringFromLoggingMode(MobileCore.getLogLevel()))
  }

  override fun core_setPrivacyStatus(privacyStatus: String) {
    MobileCore.setPrivacyStatus(CoreDataBridge.privacyStatusFromString(privacyStatus))
  }

  override fun core_getPrivacyStatus(promise: Promise) {
    MobileCore.getPrivacyStatus(object : AdobeCallbackWithError<com.adobe.marketing.mobile.MobilePrivacyStatus> {
      override fun fail(adobeError: AdobeError) {
        promise.reject(NAME, adobeError.errorName, Throwable(adobeError.errorName))
      }
      override fun call(status: com.adobe.marketing.mobile.MobilePrivacyStatus) {
        promise.resolve(CoreDataBridge.stringFromPrivacyStatus(status))
      }
    })
  }

  override fun core_getSdkIdentities(promise: Promise) {
    MobileCore.getSdkIdentities(object : AdobeCallbackWithError<String> {
      override fun fail(adobeError: AdobeError) {
        promise.reject(NAME, adobeError.errorName, Throwable(adobeError.errorName))
      }
      override fun call(value: String) {
        promise.resolve(value)
      }
    })
  }

  override fun core_dispatchEvent(eventMap: ReadableMap?, promise: Promise) {
    val event = CoreDataBridge.eventFromReadableMap(eventMap)
    if (event == null) {
      promise.reject(NAME, "Failed to convert map to Event", Throwable("Invalid event"))
      return
    }
    MobileCore.dispatchEvent(event)
    promise.resolve(null)
  }

  override fun core_dispatchEventWithResponseCallback(eventMap: ReadableMap?, timeoutMs: Double, promise: Promise) {
    val event = CoreDataBridge.eventFromReadableMap(eventMap)
    if (event == null) {
      promise.reject(NAME, "Failed to convert map to Event", Throwable("Invalid event"))
      return
    }
    MobileCore.dispatchEventWithResponseCallback(event, timeoutMs.toLong(), object : AdobeCallbackWithError<Event> {
      override fun fail(adobeError: AdobeError) {
        promise.reject(NAME, adobeError.errorName, Throwable(adobeError.errorName))
      }
      override fun call(responseEvent: Event) {
        promise.resolve(CoreDataBridge.readableMapFromEvent(responseEvent))
      }
    })
  }

  override fun core_trackAction(action: String, contextData: ReadableMap?) {
    MobileCore.trackAction(action, MapUtil.toStringMap(contextData) ?: emptyMap())
  }

  override fun core_trackState(state: String, contextData: ReadableMap?) {
    MobileCore.trackState(state, MapUtil.toStringMap(contextData) ?: emptyMap())
  }

  override fun core_setAdvertisingIdentifier(advertisingIdentifier: String?) {
    MobileCore.setAdvertisingIdentifier(advertisingIdentifier)
  }

  override fun core_setPushIdentifier(pushIdentifier: String?) {
    MobileCore.setPushIdentifier(pushIdentifier)
  }

  override fun core_collectPii(data: ReadableMap?) {
    MobileCore.collectPii(MapUtil.toStringMap(data) ?: emptyMap())
  }

  override fun core_setSmallIconResourceID(resourceID: Double) {
    MobileCore.setSmallIconResourceID(resourceID.toInt())
  }

  override fun core_setLargeIconResourceID(resourceID: Double) {
    MobileCore.setLargeIconResourceID(resourceID.toInt())
  }

  override fun core_setAppGroup(appGroup: String?) {
    // Android: no-op
  }

  override fun core_resetIdentities() {
    MobileCore.resetIdentities()
  }

  // --- Identity ---
  override fun identity_extensionVersion(promise: Promise) {
    promise.resolve(Identity.extensionVersion())
  }

  override fun identity_syncIdentifiers(identifiers: ReadableMap?) {
    Identity.syncIdentifiers(MapUtil.toStringMap(identifiers) ?: emptyMap())
  }

  override fun identity_syncIdentifiersWithAuthState(identifiers: ReadableMap?, authenticationState: String) {
    val authState = IdentityDataBridge.authenticationStateFromString(authenticationState)
    Identity.syncIdentifiers(MapUtil.toStringMap(identifiers) ?: emptyMap(), authState)
  }

  override fun identity_syncIdentifier(identifierType: String, identifier: String, authenticationState: String) {
    Identity.syncIdentifier(identifierType, identifier, IdentityDataBridge.authenticationStateFromString(authenticationState))
  }

  override fun identity_appendVisitorInfoForURL(baseURL: String, promise: Promise) {
    Identity.appendVisitorInfoForURL(baseURL, object : AdobeCallbackWithError<String> {
      override fun fail(adobeError: AdobeError) {
        promise.reject(NAME, adobeError.errorName, Throwable(adobeError.errorName))
      }
      override fun call(url: String) {
        promise.resolve(url)
      }
    })
  }

  override fun identity_getUrlVariables(promise: Promise) {
    Identity.getUrlVariables(object : AdobeCallbackWithError<String> {
      override fun fail(adobeError: AdobeError) {
        promise.reject(NAME, adobeError.errorName, Throwable(adobeError.errorName))
      }
      override fun call(value: String) {
        promise.resolve(value)
      }
    })
  }

  override fun identity_getIdentifiers(promise: Promise) {
    Identity.getIdentifiers(object : AdobeCallbackWithError<List<VisitorID>> {
      override fun fail(adobeError: AdobeError) {
        promise.reject(NAME, adobeError.errorName, Throwable(adobeError.errorName))
      }
      override fun call(visitorIds: List<VisitorID>) {
        val arr = Arguments.createArray()
        visitorIds?.forEach { arr.pushMap(IdentityDataBridge.mapFromVisitorId(it)) }
        promise.resolve(arr)
      }
    })
  }

  override fun identity_getExperienceCloudId(promise: Promise) {
    Identity.getExperienceCloudId(object : AdobeCallbackWithError<String> {
      override fun fail(adobeError: AdobeError) {
        promise.reject(NAME, adobeError.errorName, Throwable(adobeError.errorName))
      }
      override fun call(value: String) {
        promise.resolve(value)
      }
    })
  }

  // --- Lifecycle ---
  override fun lifecycle_extensionVersion(promise: Promise) {
    promise.resolve(Lifecycle.extensionVersion())
  }

  // --- Signal ---
  override fun signal_extensionVersion(promise: Promise) {
    promise.resolve(Signal.extensionVersion())
  }

  companion object {
    const val NAME = "AepTurboCore"
  }
}
