/**
 * AepTurboCore Turbo Native Module implementation (iOS).
 * Follows: https://reactnative.dev/docs/turbo-native-modules-introduction?platforms=ios
 * - Conforms to Codegen-generated NativeAepTurboCoreSpec protocol
 * - Implements getTurboModule: (returns NativeAepTurboCoreSpecJSI)
 * - Implements + (NSString *)moduleName
 */
#import "RCTAepTurboCore.h"
#import "AepTurboCoreDataBridge.h"
@import AEPCore;
@import AEPIdentity;
@import AEPLifecycle;
@import AEPSignal;
@import AEPServices;

static NSString *const kAppId = @"appId";
static NSString *const kLifecycleAutomaticTrackingEnabled = @"lifecycleAutomaticTrackingEnabled";
static NSString *const kLifecycleAdditionalContextData = @"lifecycleAdditionalContextData";
static NSString *const kAppGroupIOS = @"appGroupIOS";
static NSString *const kFailedToConvertEvent = @"Failed to convert map to Event";

// Identity auth state
static NSString *const kAuthAuthenticated = @"VISITOR_AUTH_STATE_AUTHENTICATED";
static NSString *const kAuthLoggedOut = @"VISITOR_AUTH_STATE_LOGGED_OUT";
static NSString *const kAuthUnknown = @"VISITOR_AUTH_STATE_UNKNOWN";

static AEPMobileVisitorAuthState authStateFromString(NSString *s) {
  if ([s isEqualToString:kAuthAuthenticated]) return AEPMobileVisitorAuthStateAuthenticated;
  if ([s isEqualToString:kAuthLoggedOut]) return AEPMobileVisitorAuthStateLoggedOut;
  return AEPMobileVisitorAuthStateUnknown;
}

static NSString *stringFromAuthState(AEPMobileVisitorAuthState s) {
  switch (s) {
    case AEPMobileVisitorAuthStateAuthenticated: return kAuthAuthenticated;
    case AEPMobileVisitorAuthStateLoggedOut: return kAuthLoggedOut;
    default: return kAuthUnknown;
  }
}

// Visitor ID keys
static NSString *const kIdOrigin = @"idOrigin";
static NSString *const kIdType = @"idType";
static NSString *const kIdentifier = @"identifier";
static NSString *const kAuthenticationState = @"authenticationState";

@implementation RCTAepTurboCore

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeAepTurboCoreSpecJSI>(params);
}

- (NSNumber *)multiply:(double)a b:(double)b {
  return @(a * b);
}

- (void)extensionVersion:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
  resolve([AEPMobileCore extensionVersion]);
}

#pragma mark - MobileCore
- (void)core_configureWithAppId:(NSString *)appId {
  [AEPMobileCore configureWithAppId:appId];
}

- (void)core_initialize:(NSDictionary *)initOptions resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
  if (!initOptions || ![initOptions isKindOfClass:[NSDictionary class]]) {
    reject(@"AepTurboCore", @"InitOptions must be a valid dictionary.", nil);
    return;
  }
  NSString *appId = initOptions[kAppId];
  AEPInitOptions *options = (appId && [appId isKindOfClass:[NSString class]])
    ? [[AEPInitOptions alloc] initWithAppId:appId]
    : [[AEPInitOptions alloc] init];
  NSNumber *tracking = initOptions[kLifecycleAutomaticTrackingEnabled];
  if ([tracking isKindOfClass:[NSNumber class]]) {
    options.lifecycleAutomaticTrackingEnabled = [tracking boolValue];
  }
  NSDictionary *contextData = initOptions[kLifecycleAdditionalContextData];
  if ([contextData isKindOfClass:[NSDictionary class]]) {
    [options setLifecycleAdditionalContextData:[AepTurboCoreDataBridge sanitizeStringMap:contextData]];
  }
  NSString *appGroup = initOptions[kAppGroupIOS];
  if ([appGroup isKindOfClass:[NSString class]]) {
    options.appGroup = appGroup;
  }
  [AEPMobileCore initializeWithOptions:options completion:^{ resolve(nil); }];
}

- (void)core_clearUpdatedConfiguration {
  [AEPMobileCore clearUpdatedConfiguration];
}

- (void)core_updateConfiguration:(NSDictionary *)configMap {
  [AEPMobileCore updateConfiguration:configMap];
}

- (void)core_setLogLevel:(NSString *)mode {
  [AEPMobileCore setLogLevel:(AEPLogLevel)[AepTurboCoreDataBridge logLevelFromString:mode]];
}

- (void)core_getLogLevel:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
  resolve([AepTurboCoreDataBridge stringFromLogLevelWithRawValue:(NSInteger)[AEPLog logFilter]]);
}

- (void)core_setPrivacyStatus:(NSString *)status {
  [AEPMobileCore setPrivacyStatus:(AEPPrivacyStatus)[AepTurboCoreDataBridge privacyStatusFromString:status]];
}

- (void)core_getPrivacyStatus:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
  [AEPMobileCore getPrivacyStatus:^(AEPPrivacyStatus status) {
    resolve([AepTurboCoreDataBridge stringFromPrivacyStatusWithRawValue:(NSInteger)status]);
  }];
}

- (void)core_getSdkIdentities:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
  [AEPMobileCore getSdkIdentities:^(NSString *content, NSError *error) {
    if (error) {
      reject(@"AepTurboCore", error.localizedDescription ?: @"getSdkIdentities error", error);
    } else {
      resolve(content);
    }
  }];
}

- (void)core_dispatchEvent:(NSDictionary *)eventMap resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
  AEPEvent *event = (AEPEvent *)[AepTurboCoreDataBridge eventFromDictionary:eventMap];
  if (!event) {
    reject(@"AepTurboCore", kFailedToConvertEvent, nil);
    return;
  }
  [AEPMobileCore dispatch:event];
  resolve(nil);
}

- (void)core_dispatchEventWithResponseCallback:(NSDictionary *)eventMap timeoutMs:(double)timeoutMs resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
  AEPEvent *event = (AEPEvent *)[AepTurboCoreDataBridge eventFromDictionary:eventMap];
  if (!event) {
    reject(@"AepTurboCore", kFailedToConvertEvent, nil);
    return;
  }
  double timeoutSec = timeoutMs / 1000.0;
  [AEPMobileCore dispatch:event timeout:timeoutSec responseCallback:^(AEPEvent *responseEvent) {
    if (responseEvent) {
      resolve([AepTurboCoreDataBridge dictionaryFromEvent:responseEvent]);
    } else {
      reject(@"AepTurboCore", @"dispatchEventWithResponseCallback timeout", nil);
    }
  }];
}

- (void)core_trackAction:(NSString *)action contextData:(NSDictionary *)contextData {
  [AEPMobileCore trackAction:action data:[AepTurboCoreDataBridge sanitizeStringMap:contextData]];
}

- (void)core_trackState:(NSString *)state contextData:(NSDictionary *)contextData {
  [AEPMobileCore trackState:state data:[AepTurboCoreDataBridge sanitizeStringMap:contextData]];
}

- (void)core_setAdvertisingIdentifier:(NSString *)advertisingIdentifier {
  [AEPMobileCore setAdvertisingIdentifier:advertisingIdentifier];
}

- (void)core_setPushIdentifier:(NSString *)pushIdentifier {
  if (pushIdentifier.length > 0) {
    NSMutableData *data = [NSMutableData data];
    for (NSUInteger i = 0; i + 2 <= pushIdentifier.length; i += 2) {
      unsigned int byte;
      [[NSScanner scannerWithString:[pushIdentifier substringWithRange:NSMakeRange(i, 2)]] scanHexInt:&byte];
      uint8_t b = (uint8_t)byte;
      [data appendBytes:&b length:1];
    }
    [AEPMobileCore setPushIdentifier:data];
  }
}

- (void)core_collectPii:(NSDictionary *)data {
  [AEPMobileCore collectPii:[AepTurboCoreDataBridge sanitizeStringMap:data]];
}

- (void)core_setSmallIconResourceID:(double)resourceID {
  // no-op on iOS
}

- (void)core_setLargeIconResourceID:(double)resourceID {
  // no-op on iOS
}

- (void)core_setAppGroup:(NSString *)appGroup {
  [AEPMobileCore setAppGroup:appGroup];
}

- (void)core_resetIdentities {
  [AEPMobileCore resetIdentities];
}

#pragma mark - Identity
- (void)identity_extensionVersion:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
  resolve([AEPMobileIdentity extensionVersion]);
}

- (void)identity_syncIdentifiers:(NSDictionary *)identifiers {
  [AEPMobileIdentity syncIdentifiers:identifiers];
}

- (void)identity_syncIdentifiersWithAuthState:(NSDictionary *)identifiers authenticationState:(NSString *)authenticationState {
  [AEPMobileIdentity syncIdentifiers:identifiers authenticationState:authStateFromString(authenticationState)];
}

- (void)identity_syncIdentifier:(NSString *)identifierType identifier:(NSString *)identifier authenticationState:(NSString *)authenticationState {
  [AEPMobileIdentity syncIdentifierWithType:identifierType identifier:identifier authenticationState:authStateFromString(authenticationState)];
}

- (void)identity_appendVisitorInfoForURL:(NSString *)baseURL resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
  [AEPMobileIdentity appendToUrl:[NSURL URLWithString:baseURL] completion:^(NSURL *url, NSError *error) {
    if (error) {
      reject(@"AepTurboCore", error.localizedDescription ?: @"appendVisitorInfoForURL error", error);
    } else {
      resolve(url.absoluteString);
    }
  }];
}

- (void)identity_getUrlVariables:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
  [AEPMobileIdentity getUrlVariables:^(NSString *variables, NSError *error) {
    if (error) {
      reject(@"AepTurboCore", error.localizedDescription ?: @"getUrlVariables error", error);
    } else {
      resolve(variables);
    }
  }];
}

- (void)identity_getIdentifiers:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
  [AEPMobileIdentity getIdentifiers:^(NSArray<id<AEPIdentifiable>> *visitorIDs, NSError *error) {
    if (error) {
      reject(@"AepTurboCore", error.localizedDescription ?: @"getIdentifiers error", error);
    } else {
      NSMutableArray *arr = [NSMutableArray array];
      for (id<AEPIdentifiable> vid in visitorIDs) {
        NSMutableDictionary *d = [NSMutableDictionary dictionary];
        d[kIdOrigin] = vid.origin;
        d[kIdType] = vid.type;
        d[kIdentifier] = vid.identifier;
        d[kAuthenticationState] = stringFromAuthState(vid.authenticationState);
        [arr addObject:d];
      }
      resolve(arr);
    }
  }];
}

- (void)identity_getExperienceCloudId:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
  [AEPMobileIdentity getExperienceCloudId:^(NSString *ecid, NSError *error) {
    if (error) {
      reject(@"AepTurboCore", error.localizedDescription ?: @"getExperienceCloudId error", error);
    } else {
      resolve(ecid);
    }
  }];
}

#pragma mark - Lifecycle
- (void)lifecycle_extensionVersion:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
  resolve([AEPMobileLifecycle extensionVersion]);
}

#pragma mark - Signal
- (void)signal_extensionVersion:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
  resolve([AEPMobileSignal extensionVersion]);
}

+ (NSString *)moduleName {
  return @"NativeAepTurboCore";
}

@end
