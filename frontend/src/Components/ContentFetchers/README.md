# Content Fetcher Components

This directory contains specialized components for fetching and displaying content from different platforms. Each component handles the specific requirements and display logic for its respective platform.

## Components

### TwitterContent
- Handles Twitter/X post embeds
- Loads Twitter widget script dynamically
- Supports both twitter.com and x.com URLs
- Provides fallback link if embed fails to load

### YouTubeContent
- Handles YouTube video embeds
- Converts various YouTube URL formats to embed URLs
- Supports youtube.com and youtu.be links

### StackOverflowContent
- Fetches and displays Stack Overflow question content
- Shows question title, excerpt, votes, answers, tags, and author
- Uses CORS proxy to fetch content
- Displays loading and error states

### GitHubContent
- Simple preview for GitHub repositories and content
- Shows platform branding and link

### MediumContent
- Simple preview for Medium articles
- Shows platform branding and link

### RedditContent
- Simple preview for Reddit posts
- Shows platform branding and link

### LinkedInContent
- Fetches and displays LinkedIn post content
- Shows post title, excerpt, and author
- Uses CORS proxy to fetch content
- Displays loading and error states

### GenericContent
- Fallback component for any other platform
- Shows generic external link preview

## Usage

The components are used in the main `Card` component based on the content type:

```tsx
{type === 'youtube' && (
  <YouTubeContent link={link} title={title} />
)}

{type === 'twitter' && (
  <TwitterContent link={link} title={title} />
)}

{type === 'stackoverflow' && (
  <StackOverflowContent link={link} title={title} />
)}
```

## Benefits

1. **Separation of Concerns**: Each platform has its own component with specific logic
2. **Maintainability**: Easy to update or add new platform support
3. **Reusability**: Components can be used independently
4. **Type Safety**: Each component has its own TypeScript interface
5. **Error Handling**: Individual components handle their own loading and error states

## Adding New Platforms

To add support for a new platform:

1. Create a new component in this directory
2. Define the component's interface
3. Implement the platform-specific logic
4. Export it from `index.ts`
5. Add the condition in the main `Card` component 