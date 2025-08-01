# Share Brain Functionality

This feature allows users to share their brain collections with others through a public URL.

## Components

### ShareAlert Component
- **Location**: `frontend/src/Components/ShareAlert.tsx`
- **Purpose**: Displays a modal with sharing information and copy-to-clipboard functionality
- **Features**:
  - Shows the share URL in a readable format
  - One-click copy to clipboard with visual feedback
  - Clear instructions for how others can view the brain
  - Important notes about privacy and sharing

### SharePage Component
- **Location**: `frontend/src/Pages/SharePage.tsx`
- **Purpose**: Public page for viewing shared brains
- **Features**:
  - Displays shared brain content without requiring login
  - Responsive grid layout for content cards
  - Loading and error states
  - Call-to-action for creating own brain

## How It Works

### For Brain Owners:
1. Click "Share Brain" button in dashboard
2. Backend generates a unique hash for the brain
3. ShareAlert modal opens with the share URL
4. Click "Copy" to copy URL to clipboard
5. Share the URL with others

### For Viewers:
1. Open the shared URL (e.g., `http://localhost:5173/share/abc123`)
2. View the brain content without any login required
3. All content cards are displayed in a responsive grid
4. Can click on any content to view the original source

## URL Structure
- **Share URL Format**: `http://localhost:5173/share/{hash}`
- **Hash**: Unique identifier generated by backend
- **Public Access**: No authentication required to view

## Features

### ShareAlert Modal
- ✅ Copy-to-clipboard functionality
- ✅ Visual feedback when copied
- ✅ Clear instructions for viewers
- ✅ Privacy warnings
- ✅ Responsive design

### SharePage
- ✅ Public access (no login required)
- ✅ Responsive grid layout
- ✅ Loading states
- ✅ Error handling
- ✅ Call-to-action for signup

## Backend Requirements

The backend should provide these endpoints:

### POST `/api/v1/brain/share`
- **Purpose**: Generate share hash for user's brain
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ share: true }`
- **Response**: `{ hash: "abc123" }`

### GET `/api/v1/brain/share/{hash}`
- **Purpose**: Fetch shared brain content
- **Response**: 
```json
{
  "success": true,
  "brainTitle": "My Brain",
  "contents": [
    {
      "id": "1",
      "title": "Content Title",
      "link": "https://example.com",
      "type": "twitter"
    }
  ]
}
```

## Security Considerations

- Share URLs are permanent and public
- Anyone with the link can view the brain
- No way to revoke access (consider adding unshare functionality)
- Consider adding password protection for sensitive brains 