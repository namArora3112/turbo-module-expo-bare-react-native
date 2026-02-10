/*
 * Loader to ensure AepTurboCore is linked and registered before the bridge starts.
 * +load runs at app launch and references the class so the linker includes it;
 * AepTurboCore's +load then runs and registers with RCTRegisterModule.
 */
#import <AepTurboCore/AepTurboCore.h>

@interface AepTurboCoreLoader : NSObject
@end

@implementation AepTurboCoreLoader

+ (void)load
{
  (void)[AepTurboCore class];
}

@end
