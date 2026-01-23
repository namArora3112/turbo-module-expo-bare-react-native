#import "AepTurboCore.h"

static NSString* const EXTENSION_VERSION = @"1.0.0";

@implementation AepTurboCore
- (NSNumber *)multiply:(double)a b:(double)b {
    NSNumber *result = @(a * b);

    return result;
}

/**
 * Returns the version of the AEP Turbo Core extension
 * @param resolve Promise resolve callback
 * @param reject Promise reject callback
 */
- (void)extensionVersion:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject {
    resolve(EXTENSION_VERSION);
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeAepTurboCoreSpecJSI>(params);
}

+ (NSString *)moduleName
{
  return @"AepTurboCore";
}

@end
