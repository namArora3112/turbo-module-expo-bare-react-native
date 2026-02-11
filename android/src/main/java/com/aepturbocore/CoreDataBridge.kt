package com.aepturbocore

import com.adobe.marketing.mobile.Event
import com.adobe.marketing.mobile.InitOptions
import com.adobe.marketing.mobile.LoggingMode
import com.adobe.marketing.mobile.MobilePrivacyStatus
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableMapKeySetIterator
import com.facebook.react.bridge.WritableMap

internal object CoreDataBridge {
  private const val APP_ID_KEY = "appId"
  private const val LIFECYCLE_ADDITIONAL_CONTEXT_DATA = "lifecycleAdditionalContextData"
  private const val LIFECYCLE_AUTOMATIC_TRACKING_ENABLED = "lifecycleAutomaticTrackingEnabled"

  private const val EVENT_NAME_KEY = "eventName"
  private const val EVENT_TYPE_KEY = "eventType"
  private const val EVENT_SOURCE_KEY = "eventSource"
  private const val EVENT_DATA_KEY = "eventData"

  private const val ERROR = "ERROR"
  private const val WARNING = "WARNING"
  private const val DEBUG = "DEBUG"
  private const val VERBOSE = "VERBOSE"

  private const val OPT_IN = "OPT_IN"
  private const val OPT_OUT = "OPT_OUT"
  private const val UNKNOWN = "UNKNOWN"

  fun eventFromReadableMap(map: ReadableMap?): Event? {
    if (map == null) return null
    val name = getNullableString(map, EVENT_NAME_KEY)
    val type = getNullableString(map, EVENT_TYPE_KEY)
    val source = getNullableString(map, EVENT_SOURCE_KEY)
    val data = map.getMap(EVENT_DATA_KEY)?.let { MapUtil.toMap(it) }
    return Event.Builder(name, type, source).setEventData(data).build()
  }

  fun readableMapFromEvent(event: Event?): WritableMap? {
    if (event == null) return null
    val map = Arguments.createMap()
    map.putString(EVENT_NAME_KEY, event.name)
    map.putString(EVENT_TYPE_KEY, event.type)
    map.putString(EVENT_SOURCE_KEY, event.source)
    event.eventData?.let { map.putMap(EVENT_DATA_KEY, MapUtil.toWritableMap(it)) }
    return map
  }

  fun loggingModeFromString(mode: String?): LoggingMode {
    return when (mode) {
      ERROR -> LoggingMode.ERROR
      WARNING -> LoggingMode.WARNING
      VERBOSE -> LoggingMode.VERBOSE
      else -> LoggingMode.DEBUG
    }
  }

  fun stringFromLoggingMode(mode: LoggingMode?): String {
    return when (mode) {
      LoggingMode.ERROR -> ERROR
      LoggingMode.WARNING -> WARNING
      LoggingMode.VERBOSE -> VERBOSE
      else -> DEBUG
    }
  }

  fun privacyStatusFromString(s: String?): MobilePrivacyStatus {
    return when (s) {
      OPT_IN -> MobilePrivacyStatus.OPT_IN
      OPT_OUT -> MobilePrivacyStatus.OPT_OUT
      else -> MobilePrivacyStatus.UNKNOWN
    }
  }

  fun stringFromPrivacyStatus(status: MobilePrivacyStatus?): String {
    return when (status) {
      MobilePrivacyStatus.OPT_IN -> OPT_IN
      MobilePrivacyStatus.OPT_OUT -> OPT_OUT
      else -> UNKNOWN
    }
  }

  fun getNullableString(data: ReadableMap, key: String): String? {
    return if (data.hasKey(key)) data.getString(key) else null
  }

  fun initOptionsFromReadableMap(map: ReadableMap?): InitOptions? {
    if (map == null) return null
    return try {
      val appId = getNullableString(map, APP_ID_KEY)
      if (appId != null) InitOptions.configureWithAppID(appId) else InitOptions()
      // Note: lifecycleAutomaticTrackingEnabled and lifecycleAdditionalContextData are supported
      // in @adobe/react-native-aepcore; add setters here when your AEP SDK InitOptions exposes them.
    } catch (_: Exception) {
      null
    }
  }
}
