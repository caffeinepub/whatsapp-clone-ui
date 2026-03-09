# WhatsApp Clone UI

## Current State
Stage 5 is live with: chat list, chat view, calls, status/updates, settings, emoji picker, voice recording, reactions, in-chat search, attachment sheet, long-press menus, contact info screen, camera modal, new group flow, and all settings sub-panels.

Bottom nav is NOT sticky (missing `sticky bottom-0 z-50`), header may not have consistent sticky positioning, and the chat messages area doesn't use smooth scrolling.

## Requested Changes (Diff)

### Add
- **Media Gallery screen**: "Media, Links & Docs" tab view accessible from Contact Info (3 tabs: Media grid, Links list, Docs list) with images displayed in 3-col grid
- **Starred Messages screen**: accessible from home 3-dot menu "Starred" option -- shows all starred messages with contact name, timestamp, and message content
- **Broadcast Lists screen**: accessible from home 3-dot menu "Business broadcasts" -- shows list of broadcast lists with create new option
- **Profile image upload**: tap the camera icon on the profile avatar in Settings/Edit Profile to open file picker and update profile photo (stored in useState, shown as img src)
- **Cover/banner image upload**: tap camera icon on banner in Edit Profile screen to upload cover photo
- **Updates screen 3-dot menu**: Advertise, Create channel, Status privacy, Starred, Status archive settings, Settings -- all shown in dropdown, "Starred" opens starred messages
- **Calls screen 3-dot menu**: Advertise, Clear call log (with confirm dialog), Scheduled calls, Settings -- all functional
- **QR Code screen**: tapping the QR grid icon in Settings profile header opens "Short link QR" screen with MY CODE / SCAN CODE tabs, shows QR code card with "Share code" button
- **Account settings screen**: Security notifications, Passkeys, Email address, Two-step verification, Business Platform, Change phone number, Request account info, Delete account
- **Privacy settings screen**: Privacy checkup banner, Last seen/online, Profile picture, About, Status, Read receipts toggle, Default message timer
- **Notifications settings screen**: Conversation tones toggle, Reminders toggle, Messages section (Notification tone, Vibrate, Light, Use high priority, Reaction notifications)
- **Chats settings screen**: Display section (Theme, Default chat theme), Chat settings (Enter is send toggle, Media visibility toggle, Font size), Archived chats (Keep chats archived toggle), Chat backup

### Modify
- **Bottom navbar**: add `sticky bottom-0 z-50` so it stays pinned at all times
- **All screen headers**: ensure `sticky top-0 z-50` with backdrop so they pin to top on scroll
- **Chat view messages area**: use `overflow-y-auto scroll-smooth` with `-webkit-overflow-scrolling: touch` for smooth momentum scrolling on mobile; messages list scrolls independently between sticky header and sticky input bar
- **Chat input bar**: sticky at bottom of chat view (`sticky bottom-0`)
- **Attachment sheet icons**: all 11 attachment options (Document, Camera, Gallery, Audio, Catalogue, Quick Reply, Location, Contact, Poll, Event, Share UPI QR) open toast confirmation on click
- **Settings profile section**: tapping avatar opens Edit Profile screen with photo upload; QR grid icon opens QR code screen
- **BottomNav tabs**: rename "Status" tab to "Updates" with camera icon (matches screenshots showing Chats/Calls/Updates/Tools layout)

### Remove
- Nothing removed

## Implementation Plan
1. Fix BottomNav: sticky bottom-0, rename tabs to match WhatsApp Business style (Chats, Calls, Updates, Tools)
2. Fix all headers to sticky top-0 z-50
3. Fix ChatViewScreen: messages container = flex-1 overflow-y-auto scroll-smooth, input bar sticky bottom-0
4. Add MediaGalleryScreen component (Media/Links/Docs tabs, image grid)
5. Add StarredMessagesScreen component
6. Add BroadcastListsScreen component
7. Add QRCodeScreen component
8. Expand SettingsPanel: Account sub-screen, Privacy sub-screen (full options), Notifications sub-screen (full), Chats sub-screen (full)
9. Add profile photo upload (file input hidden, triggered by camera icon on avatar)
10. Add cover photo upload on Edit Profile screen
11. Wire Updates 3-dot menu: Advertise, Create channel, Status privacy, Starred, Status archive settings, Settings
12. Wire Calls 3-dot menu: Advertise, Clear call log, Scheduled calls, Settings
13. Make all attachment sheet buttons show toast on tap
14. Connect MediaGalleryScreen from Contact Info "Media links and docs" option
