# WhatsApp Clone UI -- Stage 40: Real Backend Integration

## Current State
The app is a fully-featured frontend-only WhatsApp clone with 39 stages of UI features. All data is stored in localStorage/in-memory state. The Motoko backend has minimal functionality (contacts, conversations, messages). Authentication is simulated with no real OTP.

## Requested Changes (Diff)

### Add
- Real ICP authorization (Internet Identity based auth)
- Extended Motoko backend: user profiles, real message storage with edit/delete/reactions, call records, status posts, file metadata
- Blob storage for image/file/video sharing in chat
- WebRTC frontend for real voice + video calls with ringing sound (Web Audio API)
- Real-time message polling (2s interval) for live updates
- Real profile editing persisted to backend
- OTP authentication flow (6-digit code displayed in app since email/SMS not available on platform)
- In-app notification sound for new messages
- Real message reactions stored in backend
- Real message edit + delete stored in backend
- Real online/typing status via backend polling

### Modify
- ChatViewScreen: wire to real backend messages, use blob-storage for media upload
- LoginScreen/OTPScreen: integrate real auth flow
- ProfileCreationScreen/SettingsScreen: save profile to backend
- CallOverlay: add WebRTC peer connection + ringtone with Web Audio API
- App.tsx: use authorization hooks for real user session

### Remove
- Nothing removed -- all 39 stages of UI features preserved

## Implementation Plan
1. Select components: authorization, blob-storage
2. Generate Motoko backend with: UserProfile, Message (with reactions/edits/deletes), Conversation, StatusPost, CallRecord, FileMetadata
3. Build real auth flow with Internet Identity + OTP code display
4. Wire ChatViewScreen to real backend messages + blob upload
5. Add WebRTC call logic with ringing sound
6. Add message polling for real-time updates
7. Wire profile editing to backend
8. Add notification sound on new messages
