#import "AepTurboCore.h"
#import "AepTurboCoreAEP.h"
#import <React/RCTBridgeModule.h>

@implementation AepTurboCore

RCT_EXPORT_MODULE(AepTurboCore)

- (NSNumber *)multiply:(double)a b:(double)b {
    NSNumber *result = @(a * b);

    return result;
}

/**
 * Returns the version of the AEP Turbo Core extension (from AEPMobileCore.extensionVersion).
 * @param resolve Promise resolve callback
 * @param reject Promise reject callback
 */
- (void)extensionVersion:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject {
    NSString *version = AepTurboCore_ExtensionVersion();
    resolve(version ?: @"0.0.0");
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeAepTurboCoreSpecJSI>(params);
}

@end
