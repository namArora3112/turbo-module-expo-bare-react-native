package com.aepturbocore

import com.adobe.marketing.mobile.VisitorID
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap

internal object IdentityDataBridge {
  private const val AUTHENTICATED = "VISITOR_AUTH_STATE_AUTHENTICATED"
  private const val LOGGED_OUT = "VISITOR_AUTH_STATE_LOGGED_OUT"
  private const val UNKNOWN = "VISITOR_AUTH_STATE_UNKNOWN"

  private const val ID_ORIGIN = "idOrigin"
  private const val ID_TYPE = "idType"
  private const val IDENTIFIER = "identifier"
  private const val AUTH_STATE = "authenticationState"

  fun authenticationStateFromString(s: String?): VisitorID.AuthenticationState {
    return when (s) {
      AUTHENTICATED -> VisitorID.AuthenticationState.AUTHENTICATED
      LOGGED_OUT -> VisitorID.AuthenticationState.LOGGED_OUT
      else -> VisitorID.AuthenticationState.UNKNOWN
    }
  }

  fun mapFromVisitorId(visitorID: VisitorID?): WritableMap? {
    if (visitorID == null) return null
    val map = Arguments.createMap()
    map.putString(ID_ORIGIN, visitorID.idOrigin)
    map.putString(ID_TYPE, visitorID.idType)
    map.putString(IDENTIFIER, visitorID.id)
    map.putString(AUTH_STATE, stringFromAuthState(visitorID.authenticationState))
    return map
  }

  private fun stringFromAuthState(state: VisitorID.AuthenticationState?): String {
    return when (state) {
      VisitorID.AuthenticationState.AUTHENTICATED -> AUTHENTICATED
      VisitorID.AuthenticationState.LOGGED_OUT -> LOGGED_OUT
      else -> UNKNOWN
    }
  }
}
