package com.aepturbocore

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableMapKeySetIterator
import com.facebook.react.bridge.ReadableType
import com.facebook.react.bridge.WritableMap
import java.util.HashMap

internal object MapUtil {
  fun toMap(readableMap: ReadableMap?): Map<String, Any?>? {
    if (readableMap == null) return null
    val map = HashMap<String, Any?>()
    val iterator = readableMap.keySetIterator()
    while (iterator.hasNextKey()) {
      val key = iterator.nextKey()
      when (readableMap.getType(key)) {
        ReadableType.Null -> map[key] = null
        ReadableType.Boolean -> map[key] = readableMap.getBoolean(key)
        ReadableType.Number -> map[key] = readableMap.getDouble(key)
        ReadableType.String -> map[key] = readableMap.getString(key)
        ReadableType.Map -> map[key] = toMap(readableMap.getMap(key))
        else -> {}
      }
    }
    return map
  }

  fun toStringMap(readableMap: ReadableMap?): Map<String, String>? {
    if (readableMap == null) return null
    val map = HashMap<String, String>()
    val iterator = readableMap.keySetIterator()
    while (iterator.hasNextKey()) {
      val key = iterator.nextKey()
      if (readableMap.getType(key) == ReadableType.String) {
        readableMap.getString(key)?.let { map[key] = it }
      }
    }
    return map
  }

  fun toWritableMap(map: Map<String, Any?>?): WritableMap? {
    if (map == null) return null
    val writableMap = Arguments.createMap()
    for ((key, value) in map) {
      when (value) {
        null -> writableMap.putNull(key)
        is Boolean -> writableMap.putBoolean(key, value)
        is Double -> writableMap.putDouble(key, value)
        is Int -> writableMap.putInt(key, value)
        is String -> writableMap.putString(key, value)
        is Map<*, *> -> writableMap.putMap(key, toWritableMap(value as Map<String, Any?>))
      }
    }
    return writableMap
  }
}
