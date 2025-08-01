interface YouTubeContentProps {
    link: string;
    title: string;
}

export function YouTubeContent({ link, title }: YouTubeContentProps) {
    // Convert YouTube URL to embed format
    const getYouTubeEmbedUrl = (url: string) => {
        // Handle various YouTube URL formats
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/,
            /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/
        ];
        
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) {
                return `https://www.youtube.com/embed/${match[1]}`;
            }
        }
        
        // Fallback: return original URL
        return url;
    };

    return (
        <iframe 
            className="w-full h-48" 
            src={getYouTubeEmbedUrl(link)} 
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerPolicy="strict-origin-when-cross-origin" 
            allowFullScreen
        />
    );
} 