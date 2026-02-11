#import "AepTurboCoreDataBridge.h"
@import AEPCore;
@import AEPServices;

static NSString *const kEventName = @"eventName";
static NSString *const kEventType = @"eventType";
static NSString *const kEventSource = @"eventSource";
static NSString *const kEventData = @"eventData";

static NSString *const kOptIn = @"OPT_IN";
static NSString *const kOptOut = @"OPT_OUT";
static NSString *const kUnknown = @"UNKNOWN";

static NSString *const kError = @"ERROR";
static NSString *const kWarning = @"WARNING";
static NSString *const kDebug = @"DEBUG";
static NSString *const kVerbose = @"VERBOSE";

@implementation AepTurboCoreDataBridge

+ (AEPEvent *)eventFromDictionary:(NSDictionary *)dict {
  NSString *name = dict[kEventName];
  NSString *type = dict[kEventType];
  NSString *source = dict[kEventSource];
  id data = dict[kEventData];
  if (!name || !type || !source) return nil;
  if (data != nil && ![data isKindOfClass:[NSDictionary class]]) return nil;
  return [[AEPEvent alloc] initWithName:name type:type source:source data:data];
}

+ (NSDictionary *)dictionaryFromEvent:(AEPEvent *)event {
  NSMutableDictionary *d = [NSMutableDictionary dictionary];
  d[kEventName] = event.name;
  d[kEventType] = event.type;
  d[kEventSource] = event.source;
  if (event.data) d[kEventData] = event.data;
  return d;
}

+ (NSInteger)privacyStatusFromString:(NSString *)s {
  if ([s isEqualToString:kOptIn]) return (NSInteger)AEPPrivacyStatusOptedIn;
  if ([s isEqualToString:kOptOut]) return (NSInteger)AEPPrivacyStatusOptedOut;
  return (NSInteger)AEPPrivacyStatusUnknown;
}

+ (NSString *)stringFromPrivacyStatusWithRawValue:(NSInteger)rawStatus {
  AEPPrivacyStatus status = (AEPPrivacyStatus)rawStatus;
  switch (status) {
    case AEPPrivacyStatusOptedIn: return kOptIn;
    case AEPPrivacyStatusOptedOut: return kOptOut;
    default: return kUnknown;
  }
}

+ (NSInteger)logLevelFromString:(NSString *)s {
  if ([s isEqualToString:kError]) return (NSInteger)AEPLogLevelError;
  if ([s isEqualToString:kWarning]) return (NSInteger)AEPLogLevelWarning;
  if ([s isEqualToString:kVerbose]) return (NSInteger)AEPLogLevelTrace;
  return (NSInteger)AEPLogLevelDebug;
}

+ (NSString *)stringFromLogLevelWithRawValue:(NSInteger)rawLevel {
  AEPLogLevel level = (AEPLogLevel)rawLevel;
  switch (level) {
    case AEPLogLevelError: return kError;
    case AEPLogLevelWarning: return kWarning;
    case AEPLogLevelTrace: return kVerbose;
    default: return kDebug;
  }
}

+ (NSDictionary<NSString *, NSString *> *)sanitizeStringMap:(NSDictionary *)dict {
  NSMutableDictionary<NSString *, NSString *> *out = [NSMutableDictionary dictionary];
  for (id key in dict) {
    id val = dict[key];
    if ([key isKindOfClass:[NSString class]] && [val isKindOfClass:[NSString class]]) {
      out[(NSString *)key] = (NSString *)val;
    }
  }
  return out;
}

@end
