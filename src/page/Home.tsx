import React, { useEffect, useState } from 'react';
import { Hero } from '../components/Hero';
import { VideoCard } from '../components/VideoCard';
import { api } from '../services/mockApi';
import { Video, VideoFilterParams } from '../src/types';
import { BRANCHES, PROGRAM_TYPES } from '../constants';
import { Search, Filter, X, Calendar, MapPin, User, ChevronDown, Clock } from 'lucide-react';

export const Home = () => {
  const [featured, setFeatured] = useState<Video | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Filter State
  const [filters, setFilters] = useState<VideoFilterParams>({
    search: '',
    program_type_id: undefined,
    branch_id: undefined,
    preacher: undefined,
    year: undefined,
    month: undefined,
    day: undefined,
    dayOfWeek: undefined
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [preachers, setPreachers] = useState<string[]>([]);
  
  // Date Filter UI State
  const [dateFilterMode, setDateFilterMode] = useState<'year' | 'month' | 'date'>('year');

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [feat, all] = await Promise.all([
        api.videos.getFeatured(),
        api.videos.getAll()
      ]);
      setFeatured(feat);
      setVideos(all);
      
      // Extract unique preachers for filter dropdown
      const uniquePreachers = Array.from(new Set(all.map(v => v.preacher)));
      setPreachers(uniquePreachers);
      
      setLoading(false);
    };
    loadData();
  }, []);

  // Handle Filtering
  const applyFilters = async () => {
    setIsSearching(true);
    setIsFiltering(true);
    const results = await api.videos.filter(filters);
    setFilteredVideos(results);
    setIsSearching(false);
  };

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      // Check if any filter is active
      const hasActiveFilters = 
        filters.search || 
        filters.program_type_id || 
        filters.branch_id || 
        (filters.preacher && filters.preacher !== 'all') || 
        filters.year || 
        filters.month || 
        filters.day || 
        (filters.dayOfWeek !== undefined && filters.dayOfWeek !== -1);

      if (hasActiveFilters) {
        applyFilters();
      } else {
        setIsFiltering(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [filters]);

  const clearFilters = () => {
    setFilters({
      search: '',
      program_type_id: undefined,
      branch_id: undefined,
      preacher: undefined,
      year: undefined,
      month: undefined,
      day: undefined,
      dayOfWeek: undefined
    });
    setIsFiltering(false);
    setDateFilterMode('year');
  };

  const handleInputChange = (field: keyof VideoFilterParams, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value === 'all' || value === '' ? undefined : value
    }));
  };

  const handleDateModeChange = (mode: 'year' | 'month' | 'date') => {
    setDateFilterMode(mode);
    // Clear date filters when switching modes to prevent inconsistent state
    setFilters(prev => ({ ...prev, year: undefined, month: undefined, day: undefined }));
  };

  const handleDateValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) {
      setFilters(prev => ({ ...prev, year: undefined, month: undefined, day: undefined }));
      return;
    }

    if (dateFilterMode === 'year') {
      // Input type="number", val = "2023"
      handleInputChange('year', parseInt(val));
    } else if (dateFilterMode === 'month') {
      // Input type="month", val = "2023-10"
      const [y, m] = val.split('-');
      setFilters(prev => ({ ...prev, year: parseInt(y), month: parseInt(m), day: undefined }));
    } else if (dateFilterMode === 'date') {
      // Input type="date", val = "2023-10-15"
      const [y, m, d] = val.split('-');
      setFilters(prev => ({ ...prev, year: parseInt(y), month: parseInt(m), day: parseInt(d) }));
    }
  };

  // Compute current value string for the date input
  const getDateInputValue = () => {
    if (!filters.year) return '';
    
    if (dateFilterMode === 'year') {
      return filters.year.toString();
    }
    if (dateFilterMode === 'month' && filters.month) {
      return `${filters.year}-${filters.month.toString().padStart(2, '0')}`;
    }
    if (dateFilterMode === 'date' && filters.month && filters.day) {
      return `${filters.year}-${filters.month.toString().padStart(2, '0')}-${filters.day.toString().padStart(2, '0')}`;
    }
    return '';
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // Pre-calculated categories for non-filtered view
  const sermons = videos.filter(v => v.program_type_id === 1);
  const conferences = videos.filter(v => v.program_type_id === 2);
  const worship = videos.filter(v => v.program_type_id === 4);
  const testimonies = videos.filter(v => v.program_type_id === 5);

  return (
    <div className="pb-20 bg-zinc-950 min-h-screen">
      {/* Hero Section - Hide when filtering to focus on results */}
      {!isFiltering && featured && <Hero video={featured} />}
      
      {/* Search & Filter Bar */}
      <div className={`relative z-20 px-4 md:px-12 transition-all duration-300 ${!isFiltering ? '-mt-16' : 'pt-24'}`}>
        
        <div className="bg-zinc-900/95 backdrop-blur-md rounded-xl p-4 md:p-6 border border-zinc-800 shadow-2xl mb-12">
           <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              {/* Search Input */}
              <div className="relative w-full md:flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors" size={20} />
                <input 
                  type="text"
                  placeholder="Search event name, preacher, title..."
                  value={filters.search || ''}
                  onChange={(e) => handleInputChange('search', e.target.value)}
                  className="w-full bg-black/50 border border-zinc-700 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition text-white placeholder-gray-500"
                />
                {filters.search && (
                  <button onClick={() => handleInputChange('search', '')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition">
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Filter Toggle Button */}
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition whitespace-nowrap border ${showFilters || isFiltering ? 'bg-red-600 border-red-600 text-white' : 'bg-zinc-800 border-zinc-700 text-gray-300 hover:bg-zinc-700 hover:border-zinc-600'}`}
              >
                <Filter size={18} />
                <span>Filters</span>
                {isFiltering && !filters.search && (
                   <span className="flex h-2 w-2 relative">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                   </span>
                )}
              </button>
           </div>

           {/* Advanced Filter Options Panel */}
           {showFilters && (
             <div className="mt-6 pt-6 border-t border-zinc-800 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Column 1: Core Categories */}
                  <div className="space-y-4">
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2"><Calendar size={12}/> Program</label>
                        <div className="relative">
                          <select 
                            value={filters.program_type_id || 'all'}
                            onChange={(e) => handleInputChange('program_type_id', e.target.value === 'all' ? undefined : Number(e.target.value))}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-sm focus:border-red-600 outline-none text-white appearance-none cursor-pointer"
                          >
                            <option value="all">All Programs</option>
                            {PROGRAM_TYPES.map(p => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" size={14} />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2"><MapPin size={12}/> Branch</label>
                        <div className="relative">
                          <select 
                            value={filters.branch_id || 'all'}
                            onChange={(e) => handleInputChange('branch_id', e.target.value === 'all' ? undefined : Number(e.target.value))}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-sm focus:border-red-600 outline-none text-white appearance-none cursor-pointer"
                          >
                            <option value="all">All Branches</option>
                            {BRANCHES.map(b => (
                              <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" size={14} />
                        </div>
                     </div>
                  </div>

                  {/* Column 2: People */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2"><User size={12}/> Preacher</label>
                        <div className="relative">
                          <select 
                            value={filters.preacher || 'all'}
                            onChange={(e) => handleInputChange('preacher', e.target.value === 'all' ? undefined : e.target.value)}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-sm focus:border-red-600 outline-none text-white appearance-none cursor-pointer"
                          >
                            <option value="all">All Preachers</option>
                            {preachers.map(p => (
                              <option key={p} value={p}>{p}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" size={14} />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Day of Week</label>
                        <div className="relative">
                          <select 
                            value={filters.dayOfWeek !== undefined ? filters.dayOfWeek : -1}
                            onChange={(e) => handleInputChange('dayOfWeek', Number(e.target.value) === -1 ? undefined : Number(e.target.value))}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-sm focus:border-red-600 outline-none text-white appearance-none cursor-pointer"
                          >
                            <option value={-1}>Any Day</option>
                            <option value={0}>Sunday</option>
                            <option value={1}>Monday</option>
                            <option value={2}>Tuesday</option>
                            <option value={3}>Wednesday</option>
                            <option value={4}>Thursday</option>
                            <option value={5}>Friday</option>
                            <option value={6}>Saturday</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" size={14} />
                        </div>
                     </div>
                  </div>

                  {/* Column 3: Calendar Date Filters */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2"><Clock size={12}/> Date Filter</label>
                       
                       {/* Precision Toggle */}
                       <div className="flex bg-zinc-800 rounded p-1">
                          <button 
                             onClick={() => handleDateModeChange('year')}
                             className={`px-3 py-1 text-xs rounded transition ${dateFilterMode === 'year' ? 'bg-zinc-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                          >
                            Year
                          </button>
                          <button 
                             onClick={() => handleDateModeChange('month')}
                             className={`px-3 py-1 text-xs rounded transition ${dateFilterMode === 'month' ? 'bg-zinc-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                          >
                            Month
                          </button>
                          <button 
                             onClick={() => handleDateModeChange('date')}
                             className={`px-3 py-1 text-xs rounded transition ${dateFilterMode === 'date' ? 'bg-zinc-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                          >
                            Date
                          </button>
                       </div>
                    </div>

                    <div>
                      {dateFilterMode === 'year' && (
                        <input 
                          type="number" 
                          min="2000" max="2099" 
                          placeholder="YYYY"
                          value={getDateInputValue()}
                          onChange={handleDateValueChange}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-sm focus:border-red-600 outline-none text-white transition placeholder-gray-500"
                        />
                      )}
                      {dateFilterMode === 'month' && (
                        <input 
                          type="month"
                          value={getDateInputValue()}
                          onChange={handleDateValueChange}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-sm focus:border-red-600 outline-none text-white transition calendar-picker-indicator-white"
                        />
                      )}
                      {dateFilterMode === 'date' && (
                        <input 
                          type="date"
                          value={getDateInputValue()}
                          onChange={handleDateValueChange}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-sm focus:border-red-600 outline-none text-white transition calendar-picker-indicator-white"
                        />
                      )}
                      <p className="text-[10px] text-gray-500 mt-2">
                        {dateFilterMode === 'year' && "Filter videos by a specific year."}
                        {dateFilterMode === 'month' && "Filter videos by month and year."}
                        {dateFilterMode === 'date' && "Filter videos by a precise broadcast date."}
                      </p>
                    </div>

                    <div className="flex justify-end mt-2">
                       <button 
                         onClick={clearFilters}
                         className="text-xs text-red-400 hover:text-red-300 hover:underline transition"
                       >
                         Reset All Filters
                       </button>
                    </div>
                  </div>
                </div>
             </div>
           )}
        </div>

        {/* Content Section: Filtered Grid OR Categories */}
        {isFiltering ? (
           <div className="animate-fade-in min-h-[50vh]">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                   Filtered Results 
                   <span className="text-gray-500 font-normal text-base bg-zinc-900 px-2 py-1 rounded-full">{filteredVideos.length}</span>
                </h2>
                {isSearching && <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full"></div>}
              </div>
              
              {filteredVideos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredVideos.map(video => (
                    <div key={video.id} className="w-full">
                       <VideoCard video={video} fluid />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/30 rounded-lg border border-zinc-800 border-dashed">
                   <Search size={48} className="text-gray-600 mb-4" />
                   <div className="text-gray-400 text-lg mb-2">No videos match your current criteria.</div>
                   <p className="text-gray-500 text-sm mb-6">Try adjusting your filters or search terms.</p>
                   <button 
                     onClick={clearFilters}
                     className="bg-red-600 hover:bg-red-700 text-white px-8 py-2.5 rounded-full font-medium transition transform hover:scale-105"
                   >
                     Clear All Filters
                   </button>
                </div>
              )}
           </div>
        ) : (
          <div className="space-y-12 pb-12">
            <CategoryRow title="Trending Sermons" videos={sermons} />
            <CategoryRow title="Prophetic Conferences" videos={conferences} />
            <CategoryRow title="Worship Moments" videos={worship} />
            <CategoryRow title="Miraculous Testimonies" videos={testimonies} />
            <CategoryRow title="New Releases" videos={videos.slice().reverse()} />
          </div>
        )}
      </div>
      
      {/* Inject custom styles for calendar indicators */}
      <style>{`
        .calendar-picker-indicator-white::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

const CategoryRow = ({ title, videos }: { title: string, videos: Video[] }) => {
  if (videos.length === 0) return null;
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-100 hover:text-white transition cursor-pointer flex items-center gap-2">
        {title} <span className="text-red-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">Explore &gt;</span>
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar scroll-smooth">
        {videos.map(video => (
          <VideoCard key={video.id} video={video} large />
        ))}
      </div>
    </div>
  );
};