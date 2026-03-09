# WhatsApp Clone UI

## Current State
- Full mobile WhatsApp clone with Chat List, Chat View, Status, Calls, Settings screens
- Settings screen has working panels: Account, Privacy, Notifications, Storage, Chats, Appearance, Linked Devices, Help
- SettingsPanel component slides in from right with a header (ArrowLeft + title)
- All screen headers use `pt-12` for top spacing (approx 48px)
- ChatViewScreen header at line 817: `pt-12 pb-2` with fixed height
- SettingsPanel header: `pt-12 pb-2`
- ChatListScreen header: `pt-12 pb-3`
- StatusScreen, CallsScreen, SettingsScreen all use `pt-12`
- Settings panels have working content but some placeholders (Storage shows empty state)

## Requested Changes (Diff)

### Add
- **Storage & Data panel**: Add real content - auto-download toggles (photos, videos, documents over WiFi/mobile), network usage section, clear chat cache button
- **Help panel**: Add FAQ items with chevrons (FAQ, Contact us, Privacy policy, Terms of service, App info with version)
- **Account panel**: Add "Delete my account" button in red at the bottom, "Request account info" row, "Add account" row
- **Linked Devices panel**: Add a "Link a Device" button (green outlined button) + description
- **All screen headers**: Add `safe-area` top padding using `env(safe-area-inset-top, 44px)` for proper mobile notch spacing -- replace hardcoded `pt-12` with dynamic top-safe padding to ensure header content is BELOW the status bar on all mobile devices
- **Settings flash modals**: When tapping "Delete my account" show an AlertDialog confirmation modal. When tapping "Logout" (from Account panel) show a confirmation modal. When tapping "Clear cache" show confirmation.
- **Logout option**: Add a "Log out" option at the bottom of the Settings main screen (red text, full-width button) with confirmation modal
- **SettingsPanel header top margin**: Fix the header to use `pt-safe` or inline style with `paddingTop: 'env(safe-area-inset-top, 44px)'` so the back arrow doesn't sit under the phone's status bar

### Modify
- **All headers** (ChatListScreen, ChatViewScreen, StatusScreen, CallsScreen, SettingsScreen, SettingsPanel, ProfileEditPanel, NewGroupScreen): Replace `pt-12` with dynamic safe-area top padding `style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 44px)' }}` on the header element, so it works on notched phones AND non-notched phones
- **Storage panel**: Replace empty placeholder with real toggle rows for auto-download settings
- **Help panel**: Replace 3 basic rows with 5 rows including app version info at the bottom
- **SettingsPanel**: The header element should use `style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 44px)' }}` instead of `pt-12`

### Remove
- None

## Implementation Plan
1. Update `SettingsPanel.tsx` header to use safe-area paddingTop inline style (remove pt-12, add dynamic padding)
2. Update `ProfileEditPanel.tsx` header similarly  
3. Update all page headers in `ChatListScreen.tsx`, `ChatViewScreen.tsx`, `StatusScreen.tsx`, `CallsScreen.tsx`, `SettingsScreen.tsx`, `NewGroupScreen.tsx` -- replace `pt-12` with inline `paddingTop: 'max(env(safe-area-inset-top, 0px), 44px)'`
4. Expand Storage panel content in `SettingsScreen.tsx` with auto-download toggles
5. Expand Help panel content with 5 items + version string  
6. Expand Account panel with "Request account info", "Add account", and "Delete my account" (red) rows
7. Add "Link a Device" CTA button in Linked Devices panel
8. Add Logout button at bottom of main Settings screen
9. Add AlertDialog modals for: Delete account confirmation, Logout confirmation, Clear cache confirmation
