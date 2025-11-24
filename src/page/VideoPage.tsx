import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/mockApi';
import { Video } from '../src/types';
import { Share2, ThumbsUp, Plus, Download } from 'lucide-react';
import { VideoCard } from '../components/VideoCard';

export const VideoPage = () => {
  const { id } = useParams();
  const [video, setVideo] = useState<Video | null>(null);
  const [related, setRelated] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideo = async () => {
      if (!id) return;
      setLoading(true);
      const data = await api.videos.getById(parseInt(id));
      const all = await api.videos.getAll();
      
      if (data) {
        setVideo(data);
        // Mock related logic: same preacher or type
        setRelated(all.filter(v => v.id !== data.id && (v.preacher === data.preacher || v.program_type_id === data.program_type_id)));
      }
      setLoading(false);
    };
    loadVideo();
  }, [id]);

  if (loading) return <div className="h-screen bg-black" />;
  if (!video) return <div className="h-screen flex items-center justify-center text-white">Video not found</div>;

  return (
    <div className="bg-zinc-950 min-h-screen pt-16">
      {/* Player Container */}
      <div className="w-full bg-black aspect-video max-h-[70vh] relative group">
        <video 
          src={video.video_url} 
          poster={video.thumbnail_url} 
          controls 
          autoPlay 
          className="w-full h-full object-contain"
        >
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{video.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
            <span className="text-red-500 font-semibold">{video.event_name}</span>
            <span>•</span>
            <span>{video.views.toLocaleString()} views</span>
            <span>•</span>
            <span>{new Date(video.date).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center gap-6 mb-8 border-b border-zinc-800 pb-8">
            <button className="flex flex-col items-center gap-1 text-gray-300 hover:text-white transition">
              <ThumbsUp size={20} /> <span className="text-xs">Like</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-300 hover:text-white transition">
              <Plus size={20} /> <span className="text-xs">My List</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-300 hover:text-white transition">
              <Share2 size={20} /> <span className="text-xs">Share</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-300 hover:text-white transition">
              <Download size={20} /> <span className="text-xs">Download</span>
            </button>
          </div>

          <div className="bg-zinc-900/50 p-6 rounded-lg mb-8">
            <h3 className="font-semibold text-lg mb-2">Description</h3>
            <p className="text-gray-300 leading-relaxed">{video.description}</p>
            <div className="mt-4 flex gap-2">
              {video.tags.map(tag => (
                <span key={tag} className="text-xs bg-zinc-800 text-gray-400 px-2 py-1 rounded-full">#{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar / Related */}
        <div>
          <h3 className="font-bold text-lg mb-4 text-gray-200">More Like This</h3>
          <div className="flex flex-col gap-4">
            {related.map(r => (
              <Link key={r.id} to={`/watch/${r.id}`} className="flex gap-3 group hover:bg-zinc-900 p-2 rounded transition">
                 <div className="relative w-40 h-24 flex-shrink-0">
                   <img src={r.thumbnail_url} className="w-full h-full object-cover rounded" />
                   <div className="absolute bottom-1 right-1 bg-black/80 text-[10px] px-1 rounded text-white">{Math.floor(r.duration/60)}m</div>
                 </div>
                 <div className="flex flex-col justify-center">
                   <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-red-500 transition">{r.title}</h4>
                   <p className="text-xs text-gray-500 mt-1">{r.preacher}</p>
                   <p className="text-xs text-gray-600 mt-0.5">{new Date(r.date).getFullYear()}</p>
                 </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};