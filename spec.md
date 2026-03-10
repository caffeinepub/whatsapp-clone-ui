# WhatsApp Clone UI - Stage 12

## Current State
Stage 11 is live with: message reactions, dark mode, notification badges, voice/video call UI, read receipts, typing indicator, chat wallpaper, inline message search, group creation flow. All navigation, auth flow, communities, scheduling, media gallery, broadcast lists, starred messages, and all screens are working.

## Requested Changes (Diff)

### Add
- **Sticker packs**: Sticker panel in chat (tab alongside emoji), categorized: Recent, Smileys, Animals, Food. Tap sticker to send as message.
- **Message forwarding**: Long-press a message → Forward option → contact picker sheet → forward to selected contact.
- **Link previews**: When a message contains a URL, render a preview card (title, description, favicon placeholder) below the message bubble.
- **Pinned messages**: Long-press → Pin. Pinned banner at top of chat showing pinned message text, tap to scroll to it.
- **Poll creation**: In group chats, via attachment (+) menu → Create Poll. Modal with question + up to 4 options. Poll renders as special bubble with vote counts, tap option to vote.
- **Storage usage screen**: Settings → Storage and Data → shows total used + per-chat breakdown as list with progress bars.
- **Archive chats**: Swipe left on chat list item → Archive action. Archived chats moved to "Archived" collapsible section at top of chat list.
- **Payment/Money tab**: New tab in bottom nav (between Calls and Settings) labeled "Payments". Shows balance card, Send/Receive buttons, recent transactions list.
- **Contact sharing**: Attachment (+) menu → Contact → opens contact picker, sends a contact card bubble in chat.
- **Chat lock**: Settings → Privacy → Chat Lock. Toggle with simulated PIN entry (4-digit). Locked chats show lock icon in list and require PIN to open.

### Modify
- Bottom nav: add Payments tab (6th tab) between Calls and Settings.
- ChatViewScreen: add sticker tab, link preview rendering, pinned message banner, poll bubble rendering.
- ChatListScreen: add swipe-to-archive, archived section, chat lock icon.
- SettingsScreen: add Storage and Data item, Chat Lock under Privacy.
- MessageContextMenu / ChatLongPressSheet: add Forward and Pin options.
- Attachment sheet: add Contact and Create Poll options.

### Remove
- Nothing removed.

## Implementation Plan
1. Create `PaymentsScreen.tsx` with balance card, send/receive, transactions.
2. Create `StorageScreen.tsx` with per-chat storage usage bars.
3. Create `ForwardMessageSheet.tsx` contact picker for forwarding.
4. Create `PollCreationModal.tsx` and poll bubble renderer.
5. Create `ContactShareModal.tsx` for picking and sending contact card.
6. Create `ChatLockScreen.tsx` PIN setup/entry modal.
7. Update `ChatViewScreen.tsx`: sticker tab in emoji panel, link preview cards, pinned message banner, poll bubbles, pin action.
8. Update `ChatListScreen.tsx`: swipe-to-archive gesture, archived section, lock icon on locked chats.
9. Update `BottomNav.tsx`: add Payments tab.
10. Update `App.tsx`: route for Payments tab.
11. Update `SettingsScreen.tsx`: Storage entry, Chat Lock under Privacy.
12. Update attachment sheet: Contact and Create Poll items.
