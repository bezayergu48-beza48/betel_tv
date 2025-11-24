import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Clock, Users } from 'lucide-react';
import { api } from '../services/mockApi';
import { VideoCard } from '../components/VideoCard';
import { Video, Branch } from '../src/types';
import { BRANCHES } from '../constants';

export const BranchPage = () => {
  const { id } = useParams();
  const [branch, setBranch] = useState<Branch | undefined>(undefined);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setLoading(true);
      
      const foundBranch = BRANCHES.find(b => b.id === Number(id));
      setBranch(foundBranch);
      
      const allVideos = await api.videos.getAll();
      const branchVideos = allVideos.filter(v => v.branch_id === Number(id));
      setVideos(branchVideos);
      
      setLoading(false);
    };
    loadData();
  }, [id]);

  if (loading) return <div className="h-screen bg-zinc-950 flex items-center justify-center"><div className="animate-spin h-10 w-10 border-2 border-red-600 rounded-full border-t-transparent"></div></div>;
  if (!branch) return <div className="h-screen bg-zinc-950 flex items-center justify-center text-white">Branch Not Found</div>;

  return (
    <div className="bg-zinc-950 min-h-screen pb-20">
      {/* Branch Hero */}
      <div className="h-[50vh] relative">
         <img 
            src={`https://picsum.photos/seed/${branch.id}/1920/800`} 
            className="w-full h-full object-cover" 
            alt={branch.name}
         />
         <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent"></div>
         <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
            <div className="max-w-7xl mx-auto">
               <span className="bg-red-600 text-white px-3 py-1 text-xs font-bold rounded uppercase mb-4 inline-block">Official Branch</span>
               <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{branch.name}</h1>
               <div className="flex flex-wrap gap-6 text-gray-300">
                  <div className="flex items-center gap-2">
                     <MapPin size={20} className="text-red-500" />
                     {branch.location}
                  </div>
                  <div className="flex items-center gap-2">
                     <Clock size={20} className="text-red-500" />
                     Services: Sun 9AM & 4PM
                  </div>
                  <div className="flex items-center gap-2">
                     <Users size={20} className="text-red-500" />
                     Lead Pastor: Pst. Yohannes
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12">
        <h2 className="text-2xl font-bold mb-8 border-b border-zinc-800 pb-4">Latest from {branch.name}</h2>
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map(video => (
              <VideoCard key={video.id} video={video} fluid />
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-20 bg-zinc-900 rounded-lg">
             No videos uploaded from this branch yet.
          </div>
        )}
      </div>
    </div>
  );
};
