# InstantDB Notes

## Runtime Configuration
Pass the app id at runtime:

```powershell
flutter run --dart-define=INSTANTDB_APP_ID=your_app_id
```

Without the define, the app stays local-only and reports sync as not configured.

## Current Sync Model
- player profile document creation
- active run snapshot push
- cloud snapshot restore on startup when no local session exists

## Expected Data
- player id
- board size
- board contents
- offered piece ids
- score, combo, move count
- progression and daily challenge fields
- consent and monetization sandbox fields

## Conflict Policy
Current behavior is snapshot-oriented and effectively last-write-wins.
If this app moves to real accounts and competitive play, stronger conflict handling and server-side validation should be added.
