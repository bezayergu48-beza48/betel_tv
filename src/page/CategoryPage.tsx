import React, { useEffect, useState } from 'react';
import { api } from '../services/mockApi';
import { Video } from '../src/types';
import { VideoCard } from '../components/VideoCard';
import { Hero } from '../components/Hero';

interface CategoryPageProps {
  title: string;
  programTypeId: number;
  description?: string;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ title, programTypeId, description }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [featured, setFeatured] = useState<Video | null>(null);

  useEffect(() => {
    const loadVideos = async () => {
      setLoading(true);
      // In a real app, this would be a filtered API call
      // e.g., api.videos.getByProgramType(programTypeId)
      const allVideos = await api.videos.getAll();
      const filtered = allVideos.filter(v => v.program_type_id === programTypeId);
      
      setVideos(filtered);
      
      // Select the latest as featured, or random
      if (filtered.length > 0) {
        setFeatured(filtered[0]);
      }
      
      setLoading(false);
    };

    loadVideos();
  }, [programTypeId]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 min-h-screen pb-20">
      {/* Module Hero */}
      {featured ? (
        <Hero video={featured} />
      ) : (
         <div className="h-[40vh] flex items-center justify-center bg-zinc-900 border-b border-zinc-800">
           <div className="text-center">
             <h1 className="text-4xl font-bold mb-2">{title}</h1>
             <p className="text-gray-400">Browse our collection of {title}</p>
           </div>
         </div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-20 relative z-10">
        <div className="flex items-end justify-between mb-8">
           <div>
             <h2 className="text-3xl font-bold">{title} Library</h2>
             {description && <p className="text-gray-400 mt-2">{description}</p>}
           </div>
           <span className="bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full text-sm text-gray-300">
             {videos.length} Videos
           </span>
        </div>

        {videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map(video => (
              <VideoCard key={video.id} video={video} fluid />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-gray-500 bg-zinc-900/50 rounded-lg border border-zinc-800 border-dashed">
            <p className="text-lg">No videos found for this category yet.</p>
            <p className="text-sm mt-2">Check back later for new content.</p>
          </div>
        )}
      </div>
    </div>
  );
};