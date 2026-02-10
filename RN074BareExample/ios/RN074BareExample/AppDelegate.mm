#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <AepTurboCore/RCTAepTurboCore.h>

// Declare so we can override and call super (method exists on RCTAppDelegate but is not in public header)
@interface RCTAppDelegate (AepTurboCoreModuleProvider)
- (Class)getModuleClassFromName:(const char *)name;
@end

@implementation AppDelegate

#pragma mark - RCTTurboModuleManagerDelegate

- (Class)getModuleClassFromName:(const char *)name
{
  if ([[NSString stringWithUTF8String:name] isEqualToString:@"AepTurboCore"]) {
    return [RCTAepTurboCore class];
  }
  return [super getModuleClassFromName:name];
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // Force AepTurboCore to be linked so TurboModuleRegistry can find it on iOS
  (void)[RCTAepTurboCore class];

  self.moduleName = @"RN074BareExample";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
