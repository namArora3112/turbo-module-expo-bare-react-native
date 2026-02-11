require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "AepTurboCore"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => min_ios_version_supported }
  s.source       = { :git => "https://github.com/namarora_adobe/aep-turbo-core.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,swift,cpp}"
  s.public_header_files = "ios/RCTAepTurboCore.h"
  s.private_header_files = "ios/AepTurboCoreAEP.h"

  s.dependency "AEPCore", ">= 5.4.0", "< 6.0.0"
  s.dependency "AEPIdentity", ">= 5.4.0", "< 6.0.0"
  s.dependency "AEPLifecycle", ">= 5.4.0", "< 6.0.0"
  s.dependency "AEPSignal", ">= 5.4.0", "< 6.0.0"

  # Required so that @import and AEP types work when compiling .mm (Objective-C++) files
  s.pod_target_xcconfig = {
    "CLANG_ENABLE_MODULES" => "YES",
    "OTHER_CPLUSPLUSFLAGS" => "$(inherited) -fcxx-modules"
  }

  install_modules_dependencies(s)
end
