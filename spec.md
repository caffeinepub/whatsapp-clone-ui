# WhatsApp Clone UI - Stage 41: Motoko Backend Integration

## Current State
Full WhatsApp-style mobile UI (Stages 1-40) with all features running on localStorage/in-memory state. No persistent backend. Real-time via BroadcastChannel only.

## Requested Changes (Diff)

### Add
- Motoko backend: User, Chat, Message, Group canister actors with persistent on-chain storage
- Authorization component: session-based auth with simulated OTP (code shown on screen)
- Blob Storage component: file/image/video/audio uploads returning cloud URLs
- Frontend hooks: useBackend, useAuth, useMessages, useFileUpload wrapping canister calls
- Polling layer: setInterval-based message polling (2s) to simulate real-time
- Auth flow: OTP displayed on screen for user to copy/enter, JWT-equivalent session token stored in localStorage

### Modify
- Auth screens: wire OTP request + verification to backend
- Chat screen: send/receive messages via canister, fallback to localStorage if canister unavailable
- Profile edit: persist name/about/photo to backend User record
- File/media send: upload via blob storage, store URL in message content

### Remove
- Nothing removed from existing UI

## Implementation Plan
1. Select authorization + blob-storage components
2. Generate Motoko backend (User, Message, Chat actors)
3. Wire frontend auth flow to backend OTP simulation
4. Wire chat message send/receive to canister with localStorage fallback
5. Wire file upload to blob storage component
6. Wire profile updates to backend User actor
