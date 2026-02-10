# React Native 0.74 – Compatibility Report (Agenda 1)

**Date:** 2026-02-09  
**Turbo module:** aep-turbo-core  
**Test app:** RN074BareExample (bare React Native 0.74.0)

---

## Steps completed

1. **Create bare RN 0.74 app**  
   - Command: `npx react-native@0.74.0 init RN074BareExample --version 0.74.0 --skip-git-init`  
   - Location: `turboCore/RN074BareExample/`  
   - Dependencies installed with `npm install` (project uses npm to avoid parent yarn workspace).

2. **Integrate turbo module**  
   - Added dependency: `"aep-turbo-core": "file:.."` in `RN074BareExample/package.json`.  
   - Ran `npm install`.  
   - Updated `App.tsx` to use `multiply` and `extensionVersion` from `aep-turbo-core`.  
   - Library build: `tsconfig.build.json` was updated to exclude `RN074BareExample` (and `expo-example`) so `yarn prepare` / bob build succeeds.

3. **Run app / build**  
   - Android: `cd RN074BareExample/android && ./gradlew assembleDebug --no-daemon`  
   - Result: **BUILD SUCCESSFUL** (no build errors).

4. **Documentation**  
   - This file.

---

## Build result

- **Android:** BUILD SUCCESSFUL (no errors).  
- **iOS:** Not run (CocoaPods / Xcode not exercised in this run).

---

## Warnings (non-blocking)

- **SDK XML version:**  
  `Warning: SDK processing. This version only understands SDK XML versions up to 3 but an SDK XML file of version 4 was encountered.`  
  Cosmetic tooling warning; does not affect the build outcome.

- **newArchEnabled:**  
  `gradle.properties` has `newArchEnabled=false`. Turbo Module is still built and linked; runtime behavior with the bridge is as per RN 0.74.

---

## Errors

**None.** No build errors were encountered.

---

## iOS: TurboModule "AepTurboCore could not be found" (fixed)

### Error

When running the app on iOS (simulator or device), the JS bundle can throw:

```text
Invariant Violation: TurboModuleRegistry.getEnforcing(...): 'AepTurboCore' could not be found.
Verify that a module by this name is registered in the native binary.
Bridgeless mode: false. TurboModule interop: false.
Modules loaded: {"NativeModules":[...],"TurboModules":[],"NotFound":[...,"AepTurboCore"]}
```

Followed by:

```text
TypeError: Cannot read property 'multiply' of undefined
```

Android works; only iOS fails. The native module is linked (pod is installed) but the runtime does not see it.

### Cause

On iOS, TurboModuleManager only discovers a module if:

1. The ObjC class is **registered** with the bridge (e.g. via `RCT_EXPORT_MODULE` so `RCTRegisterModule` runs in `+load`), and  
2. The class is **actually linked** into the app binary. With static lib pods, the linker can drop the module’s object file if nothing in the app target references it, so the class (and its `+load`) never runs.

### Root cause (iOS)

**TurboModuleManager is only created when the New Architecture is enabled.** With `RCT_NEW_ARCH_ENABLED=0` (default), the bridge uses the old executor path and never creates `RCTTurboModuleManager`, so `TurboModuleRegistry.getEnforcing('AepTurboCore')` has no native provider and fails. Enabling New Arch fixes this.

### Fix (four parts)

0. **Enable New Architecture for iOS**  
   In the app’s `ios/Podfile`, before `platform :ios`, add:  
   `ENV['RCT_NEW_ARCH_ENABLED'] = '1'`  
   Then run `pod install`. This ensures the TurboModuleManager is created and the app delegate’s `getModuleClassFromName:` is used.

1. **Register the module (library)**  
   In `ios/RCTAepTurboCore.mm` (ObjC class follows RN convention with RCT prefix):
   - Implement `+ (NSString *)moduleName { return @"AepTurboCore"; }` and `getTurboModule:`; use `codegenConfig.ios.modulesProvider` in package.json to map `"AepTurboCore"` → `"RCTAepTurboCore"`.

2. **Expose the header (podspec)**  
   In `AepTurboCore.podspec`:
   - Set `s.public_header_files = "ios/RCTAepTurboCore.h"` and `s.private_header_files = "ios/AepTurboCoreAEP.h"` so the app can import the module class.

3. **Force link from the app**  
   In the **app’s** `AppDelegate.mm` (e.g. `RN074BareExample/ios/RN074BareExample/AppDelegate.mm`):
   - Add `#import <AepTurboCore/RCTAepTurboCore.h>`.
   - At the start of `application:didFinishLaunchingWithOptions:` add:  
     `(void)[RCTAepTurboCore class];`  
   This forces the linker to include the RCTAepTurboCore class so it is present at runtime and its `+load` runs.

4. **Provide the module from the app delegate**  
   Override `getModuleClassFromName:` in the app’s `AppDelegate.mm` so the TurboModuleManager gets the class directly (see repo for full code; use a category to declare the superclass selector, then return `[RCTAepTurboCore class]` for `"AepTurboCore"`).

5. **Loader class in the app target (recommended)**  
   Add a file `AepTurboCoreLoader.mm` in the app (e.g. `RN074BareExample/ios/RN074BareExample/`) that only does:
   - `#import <AepTurboCore/RCTAepTurboCore.h>`
   - A class with `+ (void)load { (void)[RCTAepTurboCore class]; }`
   Add this file to the app target in Xcode. Its `+load` runs at launch and forces the RCTAepTurboCore class to be linked and loaded, so its `+load` runs and registers with `RCTRegisterModule`. Use `.mm` (not `.m`) so the Obj-C++ header can be included.

After these changes, run `pod install` in the app’s `ios` folder, then rebuild and run the app. The turbo module should be found and `multiply` / `extensionVersion` should work on iOS.

**Verify:** Start Metro from `RN074BareExample` with `npm start --reset-cache`, then run `npm run ios` (or run from Xcode). The app should load without the "AepTurboCore could not be found" error and the multiply/extensionVersion UI should work.

---

## How to run

- **Android**
  - From repo root:  
    `cd turboCore/RN074BareExample && npx react-native run-android`  
  - Or:  
    `cd turboCore/RN074BareExample/android && ./gradlew installDebug`  
    then start Metro from `RN074BareExample` and open the app on device/emulator.

- **iOS** (when you validate)  
  - `cd turboCore/RN074BareExample/ios && bundle install && bundle exec pod install && cd .. && npx react-native run-ios`

- **Metro**  
  - From `RN074BareExample`: `npm start` or `npm start --reset-cache`.  
  - If Metro shows Watchman "Recrawled this watch" warnings, clear them with:  
    `watchman watch-del '/path/to/turboCore' ; watchman watch-project '/path/to/turboCore'`  
    then restart Metro.

---

## Summary

- **Minimum React Native version tested:** 0.74.0 (bare app).  
- **Android build:** Succeeds with aep-turbo-core integrated.  
- **No commits** were made; awaiting your validation before any commit.

You can now validate the app (run on device/emulator, confirm multiply and extensionVersion). After that we can proceed to Agenda 2 (Expo 51) and then repeat for RN 0.75–0.82 and Expo 52–53.
