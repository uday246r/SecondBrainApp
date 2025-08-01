import { useEffect, useRef } from "react";

interface TwitterContentProps {
    link: string;
    title: string;
}

export function TwitterContent({ link, title }: TwitterContentProps) {
    const tweetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Load Twitter widget script if not already loaded
        if (!window.twttr) {
            console.log('Loading Twitter widget script...');
            const script = document.createElement('script');
            script.src = 'https://platform.twitter.com/widgets.js';
            script.async = true;
            script.onload = () => console.log('Twitter widget script loaded');
            script.onerror = () => console.error('Failed to load Twitter widget script');
            document.head.appendChild(script);
        }

        // Load Twitter widget after component mounts
        if (tweetRef.current) {
            console.log('Loading Twitter embed for:', link);
            const loadTwitterWidget = () => {
                if (window.twttr) {
                    console.log('Twitter widget available, loading embed...');
                    window.twttr.widgets.load(tweetRef.current);
                } else {
                    console.log('Twitter widget not ready, retrying...');
                    // Retry after a short delay if widget script is still loading
                    setTimeout(loadTwitterWidget, 100);
                }
            };
            loadTwitterWidget();
        }
    }, [link]);

    // Convert Twitter/X URL to proper embed format
    const getTwitterEmbedUrl = (url: string) => {
        // Handle both twitter.com and x.com URLs
        let tweetId = '';
        
        // Extract tweet ID from various URL formats
        const patterns = [
            /(?:twitter\.com|x\.com)\/(?:[^\/]+\/status\/|status\/)(\d+)/,
            /(?:twitter\.com|x\.com)\/([^\/]+\/status\/\d+)/,
            /status\/(\d+)/
        ];
        
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) {
                tweetId = match[1];
                break;
            }
        }
        
        if (tweetId) {
            return `https://twitter.com/i/status/${tweetId}`;
        }
        
        // Fallback: return original URL
        return url;
    };

    return (
        <div ref={tweetRef}>
            <blockquote 
                className="twitter-tweet" 
                data-theme="light"
                data-dnt="true"
            >
                <a href={getTwitterEmbedUrl(link)}></a>
            </blockquote>
            {/* Fallback link if embed doesn't load */}
            <div className="mt-2 text-sm text-gray-500">
                <a 
                    href={link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                >
                    View on Twitter
                </a>
            </div>
        </div>
    );
} 