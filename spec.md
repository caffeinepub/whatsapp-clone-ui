# WhatsApp Clone UI

## Current State
- Stage 1 & 2 already deployed. Core screens exist: ChatListScreen, ChatViewScreen, StatusScreen, CallsScreen, SettingsScreen.
- Chat list with search, seed data, navigation, unread badges.
- Chat view with message bubbles, send message, voice/video call overlay triggers.
- Status viewer with progress bar, post text status.
- Calls screen with call overlay (timer, mute/speaker/end).
- Settings with all panels: account, privacy, notifications, appearance, chats, storage, linked devices, help.
- Dark mode toggle (persists in localStorage).
- Profile edit panel (name, bio).
- Bottom navigation with 4 tabs.
- WhatsApp color palette with OKLCH tokens.

## Requested Changes (Diff)

### Add
- **Emoji picker panel** in ChatViewScreen: clicking the Smile icon opens a bottom sheet with emoji grid (common emojis), clicking an emoji appends it to the input.
- **Message reactions**: long-press (or hold) on any message bubble shows a reaction bar with 6 emoji reactions (❤️ 👍 😂 😮 😢 🙏). Tapping a reaction shows a small badge under the bubble.
- **Reply to message**: tap a message to show reply options, or swipe right on a message to quote-reply. Shows a quoted preview above the message input bar.
- **Voice message UI**: holding the mic button shows a recording indicator with a waveform animation and elapsed timer. Releasing sends the voice note as a bubble with waveform + duration.
- **Message context menu** (long press): shows Delete, Copy, Forward, Reply actions in a bottom sheet.
- **Message search inside chat**: a search icon in the ChatViewScreen header opens a search bar that highlights matching messages.
- **Group Chat screen**: tapping "Team Design Sprint" (conversation id 2) renders a group-aware chat with member avatars in header, "Group Info" accessible via header tap.
- **Media message**: tapping the paperclip opens an attachment sheet with Image, Video, Document options. Tapping Image lets user pick (or shows a placeholder image thumbnail in the bubble).
- **Typing indicator**: shows animated 3-dot typing indicator bubble below messages (simulated after user sends a message, disappears after 2 seconds).
- **Seen/delivered ticks**: sent messages show a single gray tick, then double gray tick after 1s, then double green tick after 2s (simulated).
- **Message timestamps**: messages grouped by date with a date separator pill (e.g. "TODAY", "YESTERDAY").
- **Chat wallpaper picker** in Settings > Chats > Chat background: shows 4 preset wallpaper options that update the chat background.
- **New Group screen**: tapping the FAB in chat list shows options including "New Group" which opens a new group creation flow (contact list with checkboxes, then group name input).

### Modify
- ChatViewScreen: add emoji picker, reactions, reply preview, voice message recording UI, typing indicator, seen ticks, message context menu, media attach sheet, in-chat search.
- ChatListScreen FAB: opens a bottom sheet with "New Chat" and "New Group" options.
- App.tsx: handle group info panel state, new group flow, wallpaper preference.
- useAppState: add wallpaper state, reply state, reactions state.

### Remove
- Nothing removed.

## Implementation Plan
1. Add emoji picker panel component (EmojiPicker.tsx) with 80 common emojis in a scrollable grid.
2. Update ChatViewScreen with: emoji picker toggle, reply-to preview bar, voice message recording state, typing indicator bubble, seen ticks on sent messages, in-chat search bar, message context menu bottom sheet, reactions overlay.
3. Add AttachmentSheet component (image/video/document options).
4. Add date separator component for message grouping.
5. Update ChatListScreen FAB to open BottomSheet with New Chat / New Group options.
6. Add NewGroupScreen page (contact picker + group name).
7. Add wallpaper picker in SettingsScreen > Chats panel.
8. Update useAppState with wallpaper, replyTo, and reactions state.
9. Keep all changes self-contained in frontend only (no backend changes needed).
