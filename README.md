# Aether Block Blast Workspace

Aether Block Blast is a cross-platform Flutter puzzle game built for web, mobile, and desktop from a shared codebase.

The playable app lives in `block_blast_app/`.

## Current Scope
- Endless puzzle play with adaptive board sizes from `8x8` to `32x32`
- Fixed-orientation pieces, including diagonal tip-linked shapes
- Fair offer generation that always preserves at least one legal move
- Rows, columns, `2x2` clears, full-board wipes, combo scoring, and run summaries
- Daily challenge and streak tracking
- Native SQLite persistence and web persistence fallback
- InstantDB snapshot sync hooks for cloud restore
- Audio, onboarding, privacy consent, telemetry diagnostics, and monetization sandbox controls

## Repo Layout
- `block_blast_app/`
  - Flutter client and gameplay engine
- `docs/release-checklist.md`
  - Commercial release checklist
- `docs/instantdb.md`
  - Sync/runtime expectations
- `docs/qa-matrix.md`
  - Verification matrix
- `COPILOT_HANDOFF.md`
  - Resume context for future agents

## Local Run
From `block_blast_app/`:

```powershell
flutter run -d chrome
```

Useful verification commands:

```powershell
dart analyze lib\src\app.dart test\widget_test.dart
flutter test test\widget_test.dart --reporter expanded
flutter build web
```

## Known Environment Blockers
- Windows desktop builds require the Visual Studio desktop C++ workload.
- Android builds require a valid `JAVA_HOME` pointing to a JDK 17+ install.

## Shipping Priorities
1. Publish the repository and push `main` to `thairux/block-blast`.
2. Keep CI green for analyze, tests, and web builds.
3. Continue product hardening around identity, leaderboards, progression depth, and live-ops readiness.
