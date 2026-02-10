/*
 * Loader to ensure AepTurboCore is linked and registered before the bridge starts.
 * +load runs at app launch and references the class so the linker includes it;
 * RCTAepTurboCore's +load then runs and registers with RCTRegisterModule.
 */
#import <AepTurboCore/RCTAepTurboCore.h>

@interface AepTurboCoreLoader : NSObject
@end

@implementation AepTurboCoreLoader

+ (void)load
{
  (void)[RCTAepTurboCore class];
}

@end
