# WhatsApp Clone UI - Stage 27

## Current State
Full WhatsApp-style mobile app with 26 stages of features including: auth flow, chat system, group chats, status/stories, channels, calls, business profile, reactions, reply threading, group admin tools, secret chats, marketplace, live streaming, event scheduling, AI assistant, WhatsApp Pay, and all previous UX polish.

## Requested Changes (Diff)

### Add
- **Channel Management Improvements**: Channel admin panel with subscriber count, post analytics, mute/unmute channel, delete channel, channel link sharing, pin posts in channel
- **Disappearing Messages Enhancements**: Per-chat disappearing message timer selector (24h/7d/90d), visual countdown on messages near expiry, "disappearing messages on" banner in chat, auto-clear on timer
- **Advanced Call Features**: Call waiting indicator, call recording simulation ("Recording" badge), add participants during call, call notes (post-call memo screen), call quality indicator (signal bars)

### Modify
- Existing channel viewer to show admin controls when user is channel owner
- Existing call screen to include new controls
- Chat info screen to include disappearing message setting

### Remove
- Nothing removed

## Implementation Plan
1. Add ChannelAdminPanel component with analytics, pin post, share link, delete channel
2. Add DisappearingMessagesBanner in chat header when enabled
3. Add disappearing timer selector in chat info/settings
4. Add visual expiry indicator on messages with disappearing mode active
5. Enhance CallScreen with call waiting, add participant, recording badge, signal bars, post-call notes modal
6. Wire all new UI into existing navigation without breaking any existing routes
