#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/** Bridge for AEP types. Uses only Foundation types in the header so this file can be included from C++ without @import. */
@interface AepTurboCoreDataBridge : NSObject

+ (id _Nullable)eventFromDictionary:(NSDictionary *)dict;
+ (NSDictionary *)dictionaryFromEvent:(id)event;
+ (NSInteger)privacyStatusFromString:(NSString *)statusString;
+ (NSString *)stringFromPrivacyStatusWithRawValue:(NSInteger)rawStatus;
+ (NSInteger)logLevelFromString:(NSString *)logLevelString;
+ (NSString *)stringFromLogLevelWithRawValue:(NSInteger)rawLevel;
+ (NSDictionary<NSString *, NSString *> *)sanitizeStringMap:(NSDictionary *)dict;

@end

NS_ASSUME_NONNULL_END
