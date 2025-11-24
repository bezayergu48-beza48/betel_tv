import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock } from 'lucide-react';
import { Video } from '../src/types';

interface VideoCardProps {
  video: Video;
  large?: boolean;
  fluid?: boolean;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, large, fluid }) => {
  const widthClass = fluid ? 'w-full' : (large ? 'w-80' : 'w-64');
  const heightClass = fluid ? '' : (large ? 'h-44' : 'h-36');

  return (
    <Link to={`/watch/${video.id}`} className={`group relative block bg-zinc-900 rounded-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:z-10 ${widthClass} flex-shrink-0`}>
      <div className={`relative aspect-video ${heightClass}`}>
        <img 
          src={video.thumbnail_url} 
          alt={video.title} 
          className="w-full h-full object-cover transition-opacity group-hover:opacity-80"
        />
        {/* Play Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-red-600 rounded-full p-3 shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
            <Play fill="white" size={20} />
          </div>
        </div>
        
        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-xs px-1.5 py-0.5 rounded text-white flex items-center gap-1">
          <Clock size={10} />
          {Math.floor(video.duration / 60)}m
        </div>
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-red-500 transition-colors">{video.title}</h3>
        <p className="text-xs text-gray-400 mt-1">{video.preacher}</p>
        <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
          <span className="border border-gray-700 px-1 rounded">{video.event_name}</span>
          <span>•</span>
          <span>{new Date(video.date).getFullYear()}</span>
        </div>
      </div>
    </Link>
  );
};