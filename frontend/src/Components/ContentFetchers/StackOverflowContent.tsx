import { useEffect, useState } from "react";

interface StackOverflowContentProps {
    link: string;
    title: string;
}

interface ContentData {
    title?: string;
    description?: string;
    author?: string;
    date?: string;
    votes?: number;
    answers?: number;
    views?: number;
    tags?: string[];
    content?: string;
    excerpt?: string;
}

export function StackOverflowContent({ link, title }: StackOverflowContentProps) {
    const [contentData, setContentData] = useState<ContentData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch content from Stack Overflow
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
                
                // Extract Stack Overflow specific data
                const questionTitle = doc.querySelector('.question-hyperlink')?.textContent;
                const questionBody = doc.querySelector('.question .post-text')?.textContent;
                const votes = doc.querySelector('.vote-count-post')?.textContent;
                const answers = doc.querySelector('.answers-subheader h2')?.textContent;
                const tags = Array.from(doc.querySelectorAll('.post-tag'))
                    .map(tag => tag.textContent)
                    .filter((tag): tag is string => tag !== null);
                const author = doc.querySelector('.user-details a')?.textContent;
                
                const contentInfo: ContentData = {
                    title: questionTitle || title,
                    content: questionBody || undefined,
                    votes: votes ? parseInt(votes) : undefined,
                    answers: answers ? parseInt(answers.match(/\d+/)?.[0] || '0') : undefined,
                    tags: tags,
                    author: author || undefined,
                    excerpt: questionBody ? questionBody.substring(0, 200) + '...' : undefined
                };
                
                setContentData(contentInfo);
            }
        } catch (err) {
            console.error('Error fetching Stack Overflow content:', err);
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
                    <div className="w-6 h-6 bg-orange-500 rounded mr-2"></div>
                    <span className="font-semibold">Stack Overflow</span>
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
                    <div className="w-6 h-6 bg-orange-500 rounded mr-2"></div>
                    <span className="font-semibold">Stack Overflow</span>
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
                    <div className="w-6 h-6 bg-orange-500 rounded mr-2"></div>
                    <span className="font-semibold">Stack Overflow</span>
                </div>
                <div className="mb-2">
                    <h3 className="font-semibold text-sm mb-1">{contentData.title}</h3>
                    {contentData.excerpt && (
                        <p className="text-sm text-gray-600 mb-2">{contentData.excerpt}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        {contentData.votes !== undefined && (
                            <span>👍 {contentData.votes}</span>
                        )}
                        {contentData.answers !== undefined && (
                            <span>💬 {contentData.answers} answers</span>
                        )}
                        {contentData.author && (
                            <span>👤 {contentData.author}</span>
                        )}
                    </div>
                    {contentData.tags && contentData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {contentData.tags.slice(0, 3).map((tag, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                <a href={link} target="_blank" rel="noopener noreferrer" 
                   className="text-blue-600 hover:underline text-sm">
                    View full question →
                </a>
            </div>
        );
    }

    // Fallback to basic preview
    return (
        <div className="border rounded p-3 bg-gray-50">
            <div className="flex items-center mb-2">
                <div className="w-6 h-6 bg-orange-500 rounded mr-2"></div>
                <span className="font-semibold">Stack Overflow</span>
            </div>
            <a href={link} target="_blank" rel="noopener noreferrer" 
               className="text-blue-600 hover:underline">
                {title}
            </a>
        </div>
    );
} 