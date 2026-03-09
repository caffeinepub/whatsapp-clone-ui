# WhatsApp Clone UI - Stage 5

## Current State
Full WhatsApp clone with 4 stages completed:
- Home/chat list screen with search, filter tabs (All, Unread, Favourites, Groups)
- Chat view with messages, emoji, reactions, reply, voice recording, typing indicator
- Status screen with viewer and posting
- Calls screen with call overlay
- Settings with all sub-panels
- New Group screen
- Dark mode
- Bottom navigation (Chats, Calls, Updates, Tools tabs)

## Requested Changes (Diff)

### Add
- **Home Header fixes**: Exact WhatsApp header layout -- "WhatsApp" title (bold), camera icon, 3-dot menu on right; 1px top margin below status bar using safe-area-inset
- **3-dot Menu (Home)**: Dropdown with exact options from screenshot: Advertise, New group, Business broadcasts, Communities, Labels, Linked devices, Starred, Settings
- **Camera icon click**: Opens a camera/QR scanner modal overlay
- **Pencil/compose icon**: Opens New Chat screen (save contact screen) matching screenshot -- "New chat" header, "To: Search name or number" search field, New group option, New contact option (with QR icon), New business broadcast option, Frequently contacted section with contacts list (selectable with radio circles), Contacts on WhatsApp section
- **Profile avatar click (Home header)**: Opens profile screen/sheet
- **Long press on chat list item**: Shows context menu with options: Archive, Mute notifications, Delete chat, Pin to top, Mark as unread
- **Chat View header options (3-dot)**: Exact WhatsApp chat options -- View contact, Media, links and docs, Search, Mute notifications, Disappearing messages, Clear chat, Export chat, Report, Block
- **Chat View header**: Contact name, online status, video call icon, phone call icon, 3-dot menu
- **Contact info screen**: When tapping contact name or "View contact" -- shows profile photo, name, phone, status/bio, options (message, call, video), shared media grid

### Modify
- Home screen bottom nav tabs to match exact WhatsApp: Chats, Calls, Updates, Tools (with correct icons)
- Home header to have no top tab bar (remove old tab bar if present), just the filter chips row below search
- Filter chips: All, Unread, Favourites, Groups (scrollable horizontal row)
- Chat list items: Show pin icon for pinned chats, mute icon for muted, missed call icon for missed video/call messages

### Remove
- Old 3-dot menu options that don't match WhatsApp exactly
- FAB pencil icon replaced with proper compose/new-chat flow

## Implementation Plan
1. Update HomeScreen header: bold "WhatsApp" title, camera icon opens CameraModal, 3-dot opens exact dropdown menu
2. Build 3-dot dropdown with 8 options (Advertise, New group, Business broadcasts, Communities, Labels, Linked devices, Starred, Settings) -- clicking Settings navigates to settings screen
3. Build NewChatScreen component matching screenshot (New chat header, To: search, New group row, New contact row with QR, New business broadcast, Frequently contacted section, Contacts on WhatsApp section with selectable contacts)
4. Wire pencil/compose FAB to open NewChatScreen
5. Add camera icon click -> CameraModal with camera viewfinder simulation UI
6. Add long-press handler on chat list items -> BottomSheet with Archive, Mute, Delete, Pin, Mark as unread options
7. Update ChatView 3-dot menu with all WhatsApp options: View contact, Media links and docs, Search, Mute notifications, Disappearing messages, Clear chat, Export chat, Report, Block
8. Build ContactInfoScreen: profile photo, name, phone, bio, action buttons (Message/Call/Video), shared media grid thumbnails
9. Wire chat header contact name tap -> ContactInfoScreen
10. Ensure all header safe-area-inset-top padding applied correctly
