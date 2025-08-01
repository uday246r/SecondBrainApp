import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../Components/Card';
import axios from 'axios';
import { BACKEND_URL } from './config';

interface SharedContent {
  id: string;
  title: string;
  link: string;
  type: "twitter" | "youtube" | "stackoverflow" | "github" | "medium" | "reddit" | "other";
}

export function SharePage() {
  const { hash } = useParams<{ hash: string }>();
  const [contents, setContents] = useState<SharedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [brainTitle, setBrainTitle] = useState<string>('');

  useEffect(() => {
    const fetchSharedBrain = async () => {
      if (!hash) {
        setError('Invalid share link');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/brain/share/${hash}`);
        
        if (response.data.success) {
          setContents(response.data.contents || []);
          setBrainTitle(response.data.brainTitle || 'Shared Brain');
        } else {
          setError('Brain not found or no longer available');
        }
      } catch (err: any) {
        console.error('Error fetching shared brain:', err);
        setError('Failed to load shared brain. It may have been deleted or the link is invalid.');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedBrain();
  }, [hash]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shared brain...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Brain Not Found</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">
              The brain you're looking for may have been deleted or the link is no longer valid.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{brainTitle}</h1>
              <p className="text-gray-600 mt-1">Shared Brain Collection</p>
            </div>
            <div className="text-sm text-gray-500">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {contents.length} items
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {contents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {contents.map((content, index) => (
              <Card 
                key={content.id || index}
                type={content.type} 
                link={content.link} 
                title={content.title}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Content Available</h2>
            <p className="text-gray-600">
              This brain doesn't have any content to display.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>Powered by Brainly - Share your knowledge with the world</p>
            <p className="mt-1">
              Want to create your own brain?{' '}
              <a href="/signup" className="text-blue-600 hover:underline">
                Sign up here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 