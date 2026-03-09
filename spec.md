# WhatsApp Clone UI

## Current State
New project. No existing frontend or backend code.

## Requested Changes (Diff)

### Add
- Mobile-first WhatsApp-style messaging app UI
- Bottom navigation with 4 tabs: Chats, Status, Calls, Settings
- Chat list screen: list of conversations with avatar, name, last message, timestamp, unread count badge
- Individual chat screen: message bubbles (sent/received), text input with send button, back button
- Basic in-memory data model: contacts, conversations, messages

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Backend: Define data types for Contact, Conversation, Message. Expose query/update functions for listing chats, getting messages, sending a message.
2. Frontend: 
   - App shell with bottom navigation (Chats, Status, Calls, Settings tabs)
   - ChatList page: scrollable list of conversations
   - ChatView page: individual chat with message bubbles and input
   - Placeholder pages for Status, Calls, Settings
   - Mobile viewport, fixed bottom nav
