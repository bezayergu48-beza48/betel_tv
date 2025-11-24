import React, { useState } from 'react';
import { api } from '../services/mockApi';
import { Upload, FileVideo, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { PROGRAM_TYPES, BRANCHES } from '../constants';
import { Video } from '../src/types';

interface VideoUploadFormProps {
  onUploadSuccess?: () => void;
}

export const VideoUploadForm: React.FC<VideoUploadFormProps> = ({ onUploadSuccess }) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStep, setUploadStep] = useState<'idle' | 'uploading' | 'processing' | 'generating_hls' | 'thumbnail' | 'complete'>('idle');

  const [metadata, setMetadata] = useState<{
    title: string;
    program_type_id: number;
    event_name: string;
    branch_id: number;
    preacher: string;
    description: string;
    tags: string;
    date: string;
    version: string;
    streaming_enabled: boolean;
  }>({
    title: '',
    program_type_id: 1,
    event_name: '',
    branch_id: 1,
    preacher: '',
    description: '',
    tags: '',
    date: new Date().toISOString().split('T')[0],
    version: 'v01',
    streaming_enabled: true
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
        // Auto-fill title from filename if empty
        if (!metadata.title) {
          setMetadata(prev => ({...prev, title: file.name.split('.')[0]}));
        }
      } else {
        alert('Please upload a valid video file (MP4, etc)');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      if (!metadata.title) {
        setMetadata(prev => ({...prev, title: file.name.split('.')[0]}));
      }
    }
  };

  const simulateProgress = async () => {
    setUploadStep('uploading');
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(r => setTimeout(r, 200));
    }
    
    setUploadStep('generating_hls');
    await new Promise(r => setTimeout(r, 1500)); // Simulate ffmpeg processing
    
    setUploadStep('thumbnail');
    await new Promise(r => setTimeout(r, 800)); // Simulate thumbnail gen
    
    setUploadStep('complete');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) return alert("Please select a video file");

    setIsUploading(true);
    
    // Start simulation UI
    simulateProgress();

    try {
      // Actually call the mock API
      await api.videos.upload({
        title: metadata.title,
        program_type_id: Number(metadata.program_type_id),
        event_name: metadata.event_name,
        branch_id: Number(metadata.branch_id),
        preacher: metadata.preacher,
        description: metadata.description,
        tags: metadata.tags.split(',').map(t => t.trim()).filter(t => t),
        date: metadata.date,
        version: metadata.version,
        streaming_enabled: metadata.streaming_enabled,
        duration: 3600 // Mock duration
      });

      // Wait for simulation to catch up if needed
      if (uploadStep !== 'complete') {
        await new Promise(r => setTimeout(r, 500));
      }

      if (onUploadSuccess) onUploadSuccess();
      
      // Reset form
      setVideoFile(null);
      setMetadata({
        title: '',
        program_type_id: 1,
        event_name: '',
        branch_id: 1,
        preacher: '',
        description: '',
        tags: '',
        date: new Date().toISOString().split('T')[0],
        version: 'v01',
        streaming_enabled: true
      });
      setIsUploading(false);
      setUploadStep('idle');
      setUploadProgress(0);
      alert("Video Uploaded Successfully! It is now Pending Approval.");

    } catch (error) {
      console.error(error);
      setIsUploading(false);
      alert("Upload failed. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="bg-zinc-800/50 p-6 border-b border-zinc-700">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Upload className="text-red-600" /> Upload New Video
        </h2>
        <p className="text-gray-400 text-sm mt-1">Upload MP4 files, generate HLS streams, and manage metadata.</p>
      </div>

      <div className="p-6">
        {isUploading && (
          <div className="mb-8 bg-zinc-950 rounded-lg p-6 border border-zinc-800 relative overflow-hidden">
             <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                   {uploadStep === 'uploading' && <><Loader2 className="animate-spin" size={16}/> Uploading to Cloud...</>}
                   {uploadStep === 'generating_hls' && <><Loader2 className="animate-spin" size={16}/> Generating HLS Segments...</>}
                   {uploadStep === 'thumbnail' && <><Loader2 className="animate-spin" size={16}/> Creating Thumbnail...</>}
                   {uploadStep === 'complete' && <><CheckCircle className="text-green-500" size={16}/> Processing Complete!</>}
                </span>
                <span className="text-xs font-mono">{uploadProgress}%</span>
             </div>
             <div className="w-full bg-zinc-800 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
             </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: File Upload */}
          <div className="space-y-6">
            <div 
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer relative h-64 flex flex-col items-center justify-center
                ${isDragOver ? 'border-red-500 bg-red-900/10' : 'border-zinc-700 hover:border-zinc-500 bg-black/20'}
                ${videoFile ? 'border-green-500/50 bg-green-900/5' : ''}
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('video-input')?.click()}
            >
              <input 
                id="video-input" 
                type="file" 
                accept="video/*" 
                className="hidden" 
                onChange={handleFileSelect}
              />
              
              {videoFile ? (
                <div className="animate-fade-in-up">
                  <FileVideo size={48} className="mx-auto text-green-500 mb-3" />
                  <p className="font-bold text-white text-lg truncate max-w-xs">{videoFile.name}</p>
                  <p className="text-sm text-gray-500">{(videoFile.size / (1024*1024)).toFixed(2)} MB</p>
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setVideoFile(null); }}
                    className="mt-4 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-xs text-gray-300 flex items-center gap-1 mx-auto"
                  >
                    <X size={12} /> Remove
                  </button>
                </div>
              ) : (
                <>
                  <Upload size={48} className="mx-auto text-gray-500 mb-3" />
                  <h3 className="font-bold text-gray-300">Drag & Drop Video Here</h3>
                  <p className="text-sm text-gray-500 mt-1">or click to browse files</p>
                  <p className="text-xs text-zinc-600 mt-4">MP4, MOV, MKV (Max 5GB)</p>
                </>
              )}
            </div>

            <div className="bg-yellow-900/10 border border-yellow-900/30 p-4 rounded-lg flex gap-3 text-sm text-yellow-200/80">
               <AlertCircle size={20} className="flex-shrink-0" />
               <p>Videos are automatically converted to HLS format for adaptive streaming. Thumbnails are generated from the 00:10 mark.</p>
            </div>
          </div>

          {/* Right Column: Metadata */}
          <div className="space-y-4">
             <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Video Title <span className="text-red-500">*</span></label>
                <input 
                  required
                  type="text" 
                  value={metadata.title} 
                  onChange={e => setMetadata({...metadata, title: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded p-2.5 text-white focus:border-red-600 outline-none"
                  placeholder="e.g. Sunday Service: The Power of Faith"
                />
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Program Type <span className="text-red-500">*</span></label>
                  <select 
                    required
                    value={metadata.program_type_id}
                    onChange={e => setMetadata({...metadata, program_type_id: Number(e.target.value)})}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded p-2.5 text-white focus:border-red-600 outline-none appearance-none"
                  >
                    {PROGRAM_TYPES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Branch <span className="text-red-500">*</span></label>
                  <select 
                    required
                    value={metadata.branch_id}
                    onChange={e => setMetadata({...metadata, branch_id: Number(e.target.value)})}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded p-2.5 text-white focus:border-red-600 outline-none appearance-none"
                  >
                    {BRANCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Event Name</label>
                  <input 
                    type="text" 
                    value={metadata.event_name} 
                    onChange={e => setMetadata({...metadata, event_name: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded p-2.5 text-white focus:border-red-600 outline-none"
                    placeholder="e.g. Annual Conference"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Preacher</label>
                  <input 
                    type="text" 
                    value={metadata.preacher} 
                    onChange={e => setMetadata({...metadata, preacher: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded p-2.5 text-white focus:border-red-600 outline-none"
                    placeholder="e.g. Prophet Mesfin Beshu"
                  />
                </div>
             </div>

             <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
                <textarea 
                  rows={3}
                  value={metadata.description} 
                  onChange={e => setMetadata({...metadata, description: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded p-2.5 text-white focus:border-red-600 outline-none resize-none"
                />
             </div>

             <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Tags (Comma Separated)</label>
                <input 
                  type="text" 
                  value={metadata.tags} 
                  onChange={e => setMetadata({...metadata, tags: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded p-2.5 text-white focus:border-red-600 outline-none"
                  placeholder="healing, faith, 2024"
                />
             </div>

             <div className="grid grid-cols-3 gap-4">
               <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Date Recorded</label>
                  <input 
                    type="date" 
                    value={metadata.date} 
                    onChange={e => setMetadata({...metadata, date: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded p-2.5 text-white focus:border-red-600 outline-none"
                  />
               </div>
               <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Version</label>
                  <input 
                    type="text" 
                    value={metadata.version} 
                    onChange={e => setMetadata({...metadata, version: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded p-2.5 text-white focus:border-red-600 outline-none"
                  />
               </div>
               <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={metadata.streaming_enabled}
                      onChange={e => setMetadata({...metadata, streaming_enabled: e.target.checked})}
                      className="w-4 h-4 rounded accent-red-600"
                    />
                    <span className="text-sm text-gray-300 select-none">Enable Streaming</span>
                  </label>
               </div>
             </div>

             <div className="pt-4">
               <button 
                type="submit" 
                disabled={isUploading || !videoFile}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-red-900/20"
               >
                 {isUploading ? 'Processing Upload...' : 'Upload Video'}
               </button>
             </div>
          </div>
        </form>
      </div>
    </div>
  );
};