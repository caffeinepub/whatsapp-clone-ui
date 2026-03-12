# WhatsApp Clone UI - Stage 31: Reels & Live Tabs

## Current State
Full WhatsApp clone with 30 stages of features including chat, calls, status, payments, settings, business profile, group tools, etc. Bottom nav has: Chats, Updates, Communities, Calls.

## Requested Changes (Diff)

### Add
- **Reels tab** in bottom navigation (5th tab)
  - Vertical full-screen video scroll (TikTok/Instagram Reels style)
  - Like, Share, Comment, Save buttons on right side
  - Comment sheet with reply, like comment, nested replies
  - 3-dot menu for extra options (report, not interested, save, share to chat)
  - Video progress bar at top
  - Author info overlay at bottom
- **Live tab** in bottom navigation (6th tab or merged with Reels)
  - Live video streaming viewer UI
  - Live chat panel with scrolling comments
  - Like, Share, Comment actions
  - Reply to comments in live chat
  - Viewer count display
  - "Send Live Request" button for users to request to go live
  - Host controls: start live, end live
  - Gift/reaction animations overlay

### Modify
- Bottom navigation: add Reels and Live tabs (adjust layout to fit 5-6 tabs or use icons only)

### Remove
- Nothing removed

## Implementation Plan
1. Add Reels tab with vertical swipe video feed (mock videos using colored placeholders + metadata)
2. Add right-side action buttons: Like (with count), Comment (opens sheet), Share, Save
3. Comment sheet: list of comments, reply button per comment, like comment, nested replies
4. 3-dot extra options menu per reel
5. Add Live tab with live stream viewer screen
6. Live chat panel: scrolling comments, reply, like
7. Live actions: like/share/comment
8. Send Live Request modal
9. Host live start/end flow
10. Update bottom nav to include Reels and Live icons
