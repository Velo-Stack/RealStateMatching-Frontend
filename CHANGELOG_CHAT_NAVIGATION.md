# Changelog: Chat Navigation from Offers/Requests & Notifications

## Date: 2026-05-11

## Summary
Implemented automatic conversation opening when navigating to chat from:
1. **Offer/Request Details Modal** - Admin can click chat icon next to creator name
2. **Notifications** - Clicking message notifications opens the conversation

## Changes Made

### 1. ChatPage URL Parameter Handling
**File**: `src/features/chat/components/ChatPage.jsx`

Added `useSearchParams` hook and implemented `useEffect` to handle two URL parameters:

#### `conversationId` Parameter (from notifications)
- Reads `conversationId` from URL query params
- Finds the conversation in `visibleConversations`
- Auto-selects the conversation
- Cleans up URL after opening

#### `userId` Parameter (from offer/request details - admin only)
- Reads `userId` from URL query params
- Searches for existing conversation with that user
- If found: Opens the existing conversation
- If not found and user can create conversations:
  - Creates new conversation with the target user
  - Auto-opens the newly created conversation
- Shows error toast if user not found or no permission
- Cleans up URL after handling

### 2. Offer Details Modal - Chat Icon
**File**: `src/features/offers/components/OfferDetailsModal.jsx`

- Added chat icon (ChatCircle) next to "مقدم العرض" field
- Icon only visible for Admin users
- Clicking navigates to `/app/chat?userId={createdBy.id}`
- Modified `DetailItem` component to support `showChatIcon` and `onChatClick` props

### 3. Request Details Modal - Chat Icon
**File**: `src/features/requests/components/RequestDetailsModal.jsx`

- Added chat icon (ChatCircle) next to "مقدم الطلب" field
- Icon only visible for Admin users
- Clicking navigates to `/app/chat?userId={createdBy.id}`
- Modified `DetailItem` component to support `showChatIcon` and `onChatClick` props

### 4. Notification Click Handler
**File**: `src/features/notifications/components/NotificationItem.jsx`

- Added click handler to notification items
- MATCH notifications navigate to `/app/matches?matchId={id}`
- MESSAGE notifications navigate to `/app/chat?conversationId={id}`
- Auto-marks notification as read on click

## Technical Details

### URL Parameter Flow
1. User clicks chat icon in offer/request modal
2. Navigation to `/app/chat?userId=123`
3. ChatPage reads `userId` from URL
4. Searches for existing conversation with user 123
5. If exists: Opens it
6. If not: Creates new conversation (if permitted)
7. URL cleaned up to `/app/chat`

### Conversation Matching Logic
```javascript
const existingConversation = visibleConversations.find((conv) => {
  const participantIds = extractParticipantUserIds(conv);
  return participantIds.includes(normalizedTargetUserId);
});
```

### Permission Checks
- Only Admin users see the chat icon in offer/request modals
- Only Admin and Manager can create new conversations
- If user lacks permission, shows error toast

## User Experience
1. **Admin viewing offer/request**: Sees chat icon next to creator name
2. **Click chat icon**: Instantly navigates to chat with that user
3. **Existing conversation**: Opens immediately
4. **New conversation**: Creates and opens automatically
5. **Clean URL**: No query parameters remain after opening

## Testing Checklist
- [x] Admin can see chat icon in offer details
- [x] Admin can see chat icon in request details
- [x] Non-admin users don't see chat icon
- [x] Clicking icon navigates to chat page
- [x] Existing conversation opens automatically
- [x] New conversation creates and opens automatically
- [x] URL cleans up after opening
- [x] Error handling for missing users
- [x] Error handling for permission issues
- [x] Notification click opens conversation
- [x] conversationId parameter works correctly

## Notes
- No backend changes required
- Frontend-only implementation
- Uses existing conversation creation API
- Handles both existing and new conversations
- Proper error handling and user feedback
