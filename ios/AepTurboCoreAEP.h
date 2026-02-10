#import <Foundation/Foundation.h>

#ifdef __cplusplus
extern "C" {
#endif

/// Returns AEPMobileCore.extensionVersion (from AEPCore). Obj-C only so @import AEPCore works.
NSString * _Nullable AepTurboCore_ExtensionVersion(void);

#ifdef __cplusplus
}
#endif
