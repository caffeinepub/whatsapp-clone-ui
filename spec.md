# WhatsApp Clone UI

## Current State
SettingsScreen.tsx has: Account, Privacy, Notifications, Storage, Chats, Appearance, Linked Devices, and Help panels. All functional with switches, selects, and sub-screens.

## Requested Changes (Diff)

### Add
- **Theme & Accent Color** panel: 8 accent color swatches (Green, Blue, Purple, Pink, Orange, Teal, Red, Yellow) that change the app's primary color, saved to localStorage
- **Language & Region** panel: language picker (English, Hindi, Spanish, French, Arabic, Chinese), date format (DD/MM/YY, MM/DD/YY, YYYY-MM-DD), time format (12h / 24h)
- **Accessibility** panel: text size live slider (80%–140%), reduce motion toggle, high contrast mode toggle, bold text toggle
- **Shortcuts & Gestures** panel: swipe-left action (Archive/Delete/Mute), swipe-right action (Reply/Mark read), double-tap message action, quick reaction set selector
- **Advanced / Beta** panel: beta features toggle, message preview in notifications toggle, hardware acceleration toggle, app version info with copy
- New settings group row items for each new panel on the main settings list

### Modify
- Main SETTINGS_GROUPS: add new group with 5 new items (Accent Theme, Language, Accessibility, Gestures, Advanced)
- Appearance panel: enhanced with accent color section already in new Theme panel (no duplication)

### Remove
- Nothing removed

## Implementation Plan
1. Add new state variables for all new settings
2. Add 5 new panel items to a new SETTINGS_GROUPS entry
3. Add 5 new SettingsPanel components with full interactive content
4. Wire accent color selection to CSS variable override via inline style on root
