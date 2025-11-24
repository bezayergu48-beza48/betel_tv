import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Info } from 'lucide-react';
import { Video } from '../src/types';

interface HeroProps {
  video: Video;
}

export const Hero: React.FC<HeroProps> = ({ video }) => {
  return (
    <div className="relative h-[85vh] w-full">
      {/* Background Image / Video Mock */}
      <div className="absolute inset-0">
        <img 
          src={video.thumbnail_url} 
          alt={video.title} 
          className="w-full h-full object-cover"
        />
        {/* Gradients for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 flex flex-col justify-center pt-16">
        <div className="max-w-2xl animate-fade-in-up">
          <div className="flex items-center gap-2 mb-4">
             <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">FEATURED</span>
             <span className="text-gray-300 text-sm font-semibold tracking-wide uppercase">{video.event_name}</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">{video.title}</h1>
          <p className="text-xl text-gray-200 mb-8 line-clamp-3">{video.description}</p>
          
          <div className="flex items-center gap-4">
            <Link 
              to={`/watch/${video.id}`} 
              className="bg-white text-black hover:bg-gray-200 px-8 py-3 rounded font-bold flex items-center gap-2 transition"
            >
              <Play fill="black" size={24} /> Play Now
            </Link>
            <button className="bg-gray-600/70 hover:bg-gray-600/90 text-white px-8 py-3 rounded font-bold flex items-center gap-2 backdrop-blur-sm transition">
              <Info size={24} /> More Info
            </button>
          </div>

          <div className="mt-8 flex items-center gap-4 text-sm text-gray-400">
             <p>Preacher: <span className="text-white font-medium">{video.preacher}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};