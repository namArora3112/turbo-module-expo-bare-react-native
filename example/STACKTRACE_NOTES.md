# Stack trace / log notes (NPM vs local Core, Assurance, Bridgeless)

## 1. Local aep-turbo-core: “functionality broken” (fixed)

**Symptom:** With local aep-turbo-core, only one EventHub event appeared (“Configure with App ID”), and there are no “ExtensionDiscovery”, “Dispatched Event #1 to extensions”, or further SDK activity.

**Cause:** The example app was calling only `configureWithAppId(appId)`, which in the local turbo module maps to `MobileCore.configureWithAppID(appId)`. That API only updates configuration; it does **not** run `MobileCore.initialize()`, which is what registers extensions and starts the EventHub. The NPM package uses `MobileCore.initializeWithAppId(appId)`, which does full initialization.

**Fix:** When using local core, the adapter now calls `AepTurboCore.initialize({ appId })` instead of `AepTurboCore.configureWithAppId(appId)`. That triggers `MobileCore.initialize(app, options, callback)` on the native side so extensions are registered and the SDK runs as with NPM core.

---

## 2. NPM Core: Non-fatal log lines

- **`ReactNoCrashSoftException: onWindowFocusChange while context is not ready`**  
  Known Bridgeless (New Architecture) timing issue: the activity gets window focus before the React context is ready. It’s a soft exception and does not crash the app.

- **`OpenGLRenderer E - Unable to match the desired swap behavior`**  
  Emulator/GPU warning, not an app bug. Safe to ignore.

- **`MobileCore/MobileCore - collectData: Could not dispatch generic data event, data is null or empty`**  
  Some call (e.g. `collectPii` or similar) is passing empty data. Fix or guard the caller if you want to remove this log.

- **`Edge/NetworkResponseHandler - EXEG-0203-502`**  
  Backend “edge_segmentation” service returned 502. Retries are handled by the SDK; no client change required.

---

## 3. Assurance “not working” / validation URL only

**Symptom:** Assurance logs show something like  
`startSessionURL: "edgetutorialapp://?adb_validation_sessionid=cebcbaf0-..."`  
and later: “Timeout - Assurance did not receive deeplink to start Assurance session within 5 seconds”.

**Cause:** The value you pass (or that appears in logs) is a **validation** URL (`adb_validation_sessionid=...`), not a full **Griffon session** URL. Assurance needs the real session URL from the Assurance UI (e.g. `griffon://...` or the full link from the project). The validation URL is only for validating the app; it does not start a full session.

**What to do:** In the Assurance UI, start a new session and copy the **full session URL** (the one that opens the session in the app). Use that in your app’s Assurance start-session flow and, if needed, configure the app’s deep link scheme so that URL can open your app.

---

## 4. Optional: Back invoker / manifest

- **`OnBackInvokedCallback is not enabled for the application`**  
  To support predictive back (Android 13+), you can set  
  `android:enableOnBackInvokedCallback="true"`  
  in the application manifest. Optional and unrelated to AEP.
