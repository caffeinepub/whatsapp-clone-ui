# WhatsApp Clone UI

## Current State

A mobile-first WhatsApp-style UI with 5 screens:
- **ChatListScreen**: Shows seed conversations, opens individual chat view. Search bar is read-only (no filter).
- **ChatViewScreen**: Messages from backend or seed data. Send message works via backend. Voice/video call buttons are non-functional.
- **CallsScreen**: Static recent calls list. "New Call" and call-back buttons do nothing.
- **StatusScreen**: Static list of status updates. Status items are not viewable/expandable.
- **SettingsScreen**: Settings menu items don't open sub-panels. No dark mode toggle. Profile name is static.

All screens exist but interactivity is minimal.

## Requested Changes (Diff)

### Add
1. **Live search/filter** on ChatListScreen — typing in the search input filters conversations by contact name in real-time.
2. **Active Call Overlay** — tapping voice or video call buttons (in chat view or calls list) opens a full-screen call UI overlay with contact name, call timer, mute/speaker/end-call buttons. Tapping end-call dismisses it.
3. **Status Viewer** — tapping a status item opens a full-screen story-style viewer with progress bar at top, auto-advance or swipe-dismiss. Shows mock "photo" (gradient) and time label.
4. **My Status Post** — tapping "Tap to add status update" opens a simple text input dialog to type a status. After submitting, it appears at top of Recent Updates.
5. **Dark Mode Toggle** in Appearance settings — toggling adds/removes `.dark` class on `<html>`. State persists in localStorage.
6. **Settings Sub-panels** — Account, Privacy, Notifications, Chats, and Linked Devices open slide-in panels with relevant toggle/option rows (UI only, no backend).
7. **New Call dialog** — tapping "New Call" on CallsScreen opens a contact picker dialog (from seed contacts) with call buttons.
8. **Profile edit** — tapping the profile row in Settings opens an edit panel for name and status text (localStorage persisted).

### Modify
- ChatListScreen search input: make it active (controlled, filters list in real-time).
- CallsScreen call buttons: wire to call overlay.
- ChatViewScreen call/video buttons: wire to call overlay.
- SettingsScreen Appearance row: wire to dark mode toggle.
- StatusScreen items: wire to status viewer.
- StatusScreen "My Status" button: wire to post dialog.

### Remove
- Nothing removed.

## Implementation Plan

1. Create `useAppState.ts` hook for global UI state: activeCall, statusViewerIndex, darkMode, profileName, profileBio.
2. Create `CallOverlay.tsx` — full-screen active call UI with timer, mute, speaker, end-call.
3. Create `StatusViewer.tsx` — full-screen status story viewer with gradient "photo", progress bar, contact name, time.
4. Create `StatusPostDialog.tsx` — simple dialog for posting text status.
5. Create `SettingsPanel.tsx` — generic slide-in panel with sub-settings rows.
6. Update `App.tsx` to include global overlays (CallOverlay, StatusViewer) and pass state/handlers down.
7. Update `ChatListScreen.tsx` — make search input controlled and filter seed/real conversations.
8. Update `CallsScreen.tsx` — wire call buttons to open call overlay.
9. Update `ChatViewScreen.tsx` — wire voice/video buttons to open call overlay.
10. Update `StatusScreen.tsx` — wire status items to viewer, "My Status" to post dialog.
11. Update `SettingsScreen.tsx` — wire Appearance to dark mode, open sub-panels for settings items, profile edit.
