# WhatsApp Clone UI

## Current State
Full mobile-first WhatsApp clone with 7 stages complete:
- Splash, Login (phone/email), OTP, Profile creation screens
- Chat list, Chat view (messages, reactions, voice, attachments)
- Calls screen, Status/Updates screen, Settings screen
- Contact list, Contact info, Media gallery, Starred messages
- Broadcast lists, Group creation, QR code screen
- Sticky nav, dark mode, all menus wired

## Requested Changes (Diff)

### Add
- **Communities screen** -- Full WhatsApp-style Communities tab with community list, create community flow, community detail view with groups inside
- **Message Scheduling** -- Long-press or attachment option to schedule a message; scheduled messages list per chat; date/time picker; scheduled messages shown with clock icon and sent at the right time
- **Channels screen** -- Discover and follow channels (under Updates tab)
- **Tools / Utilities screen** -- Accessible from nav or settings: includes Storage Usage, Auto-Download settings, Disappearing messages toggle

### Modify
- BottomNav: add Communities tab (replace or add alongside existing tabs)
- StatusScreen/Updates: wire up Channels section to a real ChannelsScreen
- ChatViewScreen: add scheduled message option in attachment or long-press menu

### Remove
- Nothing removed

## Implementation Plan
1. Create `CommunitiesScreen.tsx` -- community list with FAB, mock data, create community flow (3-step modal: name, icon, add groups)
2. Create `CommunityDetailScreen.tsx` -- groups inside a community, community info header, settings
3. Create `ScheduleMessageModal.tsx` -- date+time picker, integrates into ChatViewScreen
4. Update `ChatViewScreen.tsx` -- add Schedule option in attachment sheet; render scheduled messages with clock badge; simulate sending at scheduled time
5. Create `ChannelsScreen.tsx` -- discover channels, follow/unfollow, channel detail
6. Update `BottomNav.tsx` -- add Communities tab icon
7. Update `App.tsx` -- add routes for all new screens
