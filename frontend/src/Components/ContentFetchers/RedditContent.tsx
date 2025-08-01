interface RedditContentProps {
    link: string;
    title: string;
}

export function RedditContent({ link, title }: RedditContentProps) {
    return (
        <div className="border rounded p-3 bg-gray-50">
            <div className="flex items-center mb-2">
                <div className="w-6 h-6 bg-orange-500 rounded mr-2"></div>
                <span className="font-semibold">Reddit</span>
            </div>
            <a href={link} target="_blank" rel="noopener noreferrer" 
               className="text-blue-600 hover:underline">
                {title}
            </a>
        </div>
    );
} 