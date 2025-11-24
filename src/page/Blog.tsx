
import React, { useEffect, useState } from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { api } from '../services/mockApi';
import { BlogPost } from '../src/types';

export const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const allPosts = await api.blog.getAll();
      setPosts(allPosts.filter(p => p.status === 'published'));
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <div className="bg-zinc-950 min-h-screen pt-20 pb-20">
      <div className="bg-zinc-900 border-b border-zinc-800 py-16 mb-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-red-500 font-bold tracking-wider uppercase text-sm mb-2 block">News & Updates</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Betel Ministry Blog</h1>
          <p className="text-gray-400 text-lg">
            Stay updated with the latest news, teachings, and event highlights from our ministry.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        {loading ? (
          <div className="text-center text-gray-500">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-500">No recent news available.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <article key={post.id} className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-zinc-600 transition group flex flex-col h-full">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                    <span className="flex items-center gap-1"><User size={12} /> {post.author}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-100 group-hover:text-red-500 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-6 line-clamp-3 flex-grow">
                    {post.excerpt}
                  </p>
                  <a href="#" className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-red-500 transition mt-auto">
                    Read Article <ArrowRight size={16} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
