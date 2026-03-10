# WhatsApp Clone UI

## Current State
App has 6 stages built: chat list, chat view, calls, status, settings, media gallery, starred messages, broadcast lists, QR code, new group, contact info screens. Missing: splash/flash screen, login (phone/email), OTP verification, profile creation flow. Status screen needs completion, contact list needs full implementation.

## Requested Changes (Diff)

### Add
- SplashScreen: WhatsApp green animated logo + 'WhatsApp' text, auto-advances after 2s
- LoginScreen: toggle between Phone and Email tabs; phone tab has country code picker + number field; email tab has email field; 'Next' button advances to OTP
- OTPScreen: 6-digit OTP input (InputOTP), resend timer countdown 30s, verify button
- ProfileCreationScreen: avatar upload (camera icon), name field (required), bio/about field, 'Done' button saves profile and enters main app
- ContactListScreen (full page): alphabetical list of all contacts with search bar, each contact has avatar + name + phone; tap opens new chat; floating 'add contact' button
- Full auth flow in App.tsx: splash → login → otp → profile-creation → main app (persisted via localStorage)

### Modify
- StatusScreen: add 'My Status' section with proper upload button (image/video/text); 'Recent updates' section with full status cards; 'Viewed updates' section; proper WhatsApp status layout matching real app
- App.tsx: add auth flow state machine (splash | login | otp | create-profile | app); wrap main app content conditionally
- ChatListScreen: ensure contact list accessible via pencil/FAB and also as standalone screen
- BottomNav: ensure sticky, safe-area aware
- All headers: sticky with safe-area-inset-top padding

### Remove
- Nothing removed

## Implementation Plan
1. Create SplashScreen.tsx -- animated logo, 2s auto-advance
2. Create LoginScreen.tsx -- phone/email tabs, country code selector, next button
3. Create OTPScreen.tsx -- 6-box OTP input, 30s resend countdown, verify
4. Create ProfileCreationScreen.tsx -- avatar upload, name, about, done
5. Create ContactListScreen.tsx -- full alphabetical contact list with search
6. Update StatusScreen.tsx -- My Status section, Recent Updates, Viewed Updates layout
7. Update App.tsx -- auth flow state machine with localStorage persistence
8. Verify all headers sticky, bottom nav sticky, safe-area insets applied
