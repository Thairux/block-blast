# Privacy Policy

## Summary
Aether Block Blast stores gameplay state locally so runs can resume. Optional cloud sync can send session snapshots to InstantDB when configured.

## Data Stored Locally
- active run state
- selected board tier
- score and progression metrics
- onboarding and privacy-consent flags
- monetization sandbox state
- diagnostic telemetry events generated on-device

## Optional Cloud Sync
When `INSTANTDB_APP_ID` is configured, the app can sync:
- player identifier
- active run snapshot
- board tier and score state
- progression fields required for restore

## Defaults
- no ad tracking is enabled by default
- no analytics backend beyond the in-app telemetry buffer is configured by default

## User Controls
Current in-app controls include:
- privacy consent gate
- local diagnostics export
- local session snapshot export

Future controls should include account unlinking, export, and reset flows before public launch.
