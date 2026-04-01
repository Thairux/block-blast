# Contributing

## Workflow
- Work from the repo root: `F:\block-blast`
- The Flutter app lives in `block_blast_app/`
- Use short-lived branches named `codex/<slice-name>` after the initial `main` publish
- Keep commits atomic and scoped to one logical change

## Verification
Run from `block_blast_app/` unless noted otherwise:

```powershell
dart analyze lib\src\app.dart test\widget_test.dart
flutter test test\widget_test.dart --reporter expanded
flutter build web
```

## Platform Notes
- Windows builds require the Visual Studio desktop C++ workload
- Android builds require a valid `JAVA_HOME`

## Quality Bar
- Preserve cross-platform behavior across web, mobile, and desktop
- Keep persistence compatible with both native SQLite and the web store path
- Do not break InstantDB snapshot sync hooks
- Update `README.md`, `CHANGELOG.md`, and relevant `docs/` when behavior changes
