import { useEffect, useState } from "react";

interface LinkedInContentProps {
    link: string;
    title: string;
}

interface ContentData {
    title?: string;
    description?: string;
    author?: string;
    date?: string;
    content?: string;
    excerpt?: string;
}

export function LinkedInContent({ link, title }: LinkedInContentProps) {
    const [contentData, setContentData] = useState<ContentData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch content from LinkedIn
    const fetchContent = async (url: string) => {
        if (loading) return;
        
        setLoading(true);
        setError(null);
        
        try {
            // Use a CORS proxy to fetch content
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
            const response = await fetch(proxyUrl);
            const data = await response.json();
            
            if (data.contents) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data.contents, 'text/html');
                
                // Extract LinkedIn specific data
                const postTitle = doc.querySelector('h1, .post-title')?.textContent;
                const postContent = doc.querySelector('.post-content, .content')?.textContent;
                const author = doc.querySelector('.author-name, .user-name')?.textContent;
                
                const contentInfo: ContentData = {
                    title: postTitle || title,
                    content: postContent || undefined,
                    author: author || undefined,
                    excerpt: postContent ? postContent.substring(0, 200) + '...' : undefined
                };
                
                setContentData(contentInfo);
            }
        } catch (err) {
            console.error('Error fetching LinkedIn content:', err);
            setError('Failed to load content');
        } finally {
            setLoading(false);
        }
    };

    // Auto-fetch content when component mounts
    useEffect(() => {
        if (!contentData) {
            fetchContent(link);
        }
    }, [link, contentData]);

    if (loading) {
        return (
            <div className="border rounded p-3 bg-gray-50">
                <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-blue-600 rounded mr-2"></div>
                    <span className="font-semibold">LinkedIn</span>
                </div>
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="border rounded p-3 bg-gray-50">
                <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-blue-600 rounded mr-2"></div>
                    <span className="font-semibold">LinkedIn</span>
                </div>
                <div className="text-red-500 text-sm mb-2">{error}</div>
                <a href={link} target="_blank" rel="noopener noreferrer" 
                   className="text-blue-600 hover:underline">
                    {title}
                </a>
            </div>
        );
    }

    if (contentData) {
        return (
            <div className="border rounded p-3 bg-gray-50">
                <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-blue-600 rounded mr-2"></div>
                    <span className="font-semibold">LinkedIn</span>
                </div>
                <div className="mb-2">
                    <h3 className="font-semibold text-sm mb-1">{contentData.title}</h3>
                    {contentData.excerpt && (
                        <p className="text-sm text-gray-600 mb-2">{contentData.excerpt}</p>
                    )}
                    {contentData.author && (
                        <div className="text-xs text-gray-500 mb-2">
                            👤 {contentData.author}
                        </div>
                    )}
                </div>
                <a href={link} target="_blank" rel="noopener noreferrer" 
                   className="text-blue-600 hover:underline text-sm">
                    View full post →
                </a>
            </div>
        );
    }

    // Fallback to basic preview
    return (
        <div className="border rounded p-3 bg-gray-50">
            <div className="flex items-center mb-2">
                <div className="w-6 h-6 bg-blue-600 rounded mr-2"></div>
                <span className="font-semibold">LinkedIn</span>
            </div>
            <a href={link} target="_blank" rel="noopener noreferrer" 
               className="text-blue-600 hover:underline">
                {title}
            </a>
        </div>
    );
} 