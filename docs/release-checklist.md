# Release Checklist

## Build
- `dart analyze` passes
- `flutter test` passes
- `flutter build web` succeeds
- Windows build verified on a machine with Visual Studio desktop C++ workload
- Android build verified on a machine with a valid JDK and Android toolchain

## Product
- onboarding, privacy consent, run summary, and daily challenge flows are manually smoke-tested
- audio toggles, rewarded simulation, and revive flow are validated
- resume after restart works on native and web
- InstantDB sync behavior is checked with and without configuration

## Commercial Packaging
- app icons and splash assets are finalized
- screenshots and listing copy are prepared
- privacy, terms, support, and security docs are current
- asset and package redistribution rights are documented

## Operations
- diagnostics export is validated
- crash/analytics plan is defined before launch
- support contact path is documented
- rollback path for a bad web deploy is documented
