
import React, { useEffect, useState } from 'react';
import { api } from '../services/mockApi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Video, StatData, User, UserRole, MenuItem, Branch, ProgramType, SiteSettings, BlogPost, Product, ModuleType, AuditLogEntry, ContactMessage } from '../types';
import { PERMISSION_MATRIX } from '../constants';
import { VideoUploadForm } from '../components/VideoUploadForm';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { 
  LayoutDashboard, Menu as MenuIcon, Video as VideoIcon, Users, Settings, 
  FileText, Database, Plus, Edit, Trash2, CheckCircle, Save, 
  MapPin, Shield, ShieldCheck, X, AlertTriangle, Lock, BookOpen, Upload, 
  Image as ImageIcon, Globe, Monitor, Radio, Server, Palette, Loader2, Eye, Key, Moon, Sun, Smartphone, Download, RefreshCw, FileText as LogIcon, HardDrive, Search, Filter, Mail, Reply, MessageSquare, Send
} from 'lucide-react';

// --- TYPES FOR MODALS ---
type ModalType = 'USER' | 'MENU' | 'BRANCH' | 'PROGRAM' | 'BLOG' | 'PRODUCT' | 'PERMISSIONS' | null;

export const AdminDashboard = () => {
  const { user, can } = useAuth();
  const [activeModule, setActiveModule] = useState<'overview' | 'menus' | 'videos' | 'users' | 'roles' | 'content' | 'master' | 'settings' | 'audit' | 'system' | 'messages'>('overview');
  const [loading, setLoading] = useState(true);

  // Data Stores
  const [stats, setStats] = useState<any>(null);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [programs, setPrograms] = useState<ProgramType[]>([]);
  const [settings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Modal State
  const [modalType, setModalType] = useState<ModalType>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Load Initial Data
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    // Keep loading true only on initial load to prevent flicker, or manage finer grain
    if (!stats) setLoading(true); 
    const [s, m, v, u, b, p, set, logs, msgs] = await Promise.all([
      api.analytics.getStats(),
      api.menus.getAll(),
      api.videos.getAll(),
      api.users.getAll(),
      api.branches.getAll(),
      api.programs.getAll(),
      api.settings.get(),
      api.audit.getAll(),
      api.messages.getAll()
    ]);
    setStats(s);
    setMenus(m);
    setVideos(v);
    setUsers(u);
    setBranches(b);
    setPrograms(p);
    setSiteSettings(set);
    setAuditLogs(logs);
    setMessages(msgs);
    setLoading(false);
  };

  // Generic Create/Update Handler
  const handleSaveItem = async (type: ModalType, data: any) => {
    try {
      if (type === 'USER') {
        if (editingItem) await api.users.update(editingItem.id, data);
        else await api.users.create(data);
      } else if (type === 'MENU') {
        if (editingItem) await api.menus.update(editingItem.id, data);
        else await api.menus.create(data);
      } else if (type === 'BRANCH') {
        if (editingItem) await api.branches.update(editingItem.id, data);
        else await api.branches.create(data);
      } else if (type === 'PROGRAM') {
        if (editingItem) await api.programs.update(editingItem.id, data);
        else await api.programs.create(data);
      } else if (type === 'BLOG') {
         // Blog update logic
         const blogData = {
           ...data,
           author: user?.name || 'Admin', // Force current user as author for new posts if not set
         };
         if (editingItem) await api.blog.update(editingItem.id, data);
         else await api.blog.create(blogData);
      } else if (type === 'PRODUCT') {
         if (editingItem) { /* update logic */ } else await api.store.create(data);
      }
      
      setModalType(null);
      setEditingItem(null);
      loadAllData();
    } catch (e) {
      alert('Operation failed');
      console.error(e);
    }
  };

  const openModal = (type: ModalType, item: any = null) => {
    setModalType(type);
    setEditingItem(item);
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-zinc-950 text-white">Loading Admin System...</div>;

  return (
    <div className="flex h-screen text-white overflow-hidden pt-20" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
      
      {/* Sidebar */}
      <aside className="w-64 border-r flex-shrink-0 flex flex-col" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <div className="p-6">
          <h2 className="text-xl font-bold opacity-90">Admin Console</h2>
          <p className="text-xs opacity-50 mt-1 uppercase tracking-wider">{user?.role || 'User'}</p>
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <SidebarItem icon={<LayoutDashboard size={18} />} label="Overview" active={activeModule === 'overview'} onClick={() => setActiveModule('overview')} />
          {can('messages', 'read') && <SidebarItem icon={<Mail size={18} />} label="Inbox / Requests" active={activeModule === 'messages'} onClick={() => setActiveModule('messages')} />}
          {can('users', 'read') && <SidebarItem icon={<Users size={18} />} label="User Management" active={activeModule === 'users'} onClick={() => setActiveModule('users')} />}
          <SidebarItem icon={<ShieldCheck size={18} />} label="Roles & Permissions" active={activeModule === 'roles'} onClick={() => setActiveModule('roles')} />
          {can('menus', 'read') && <SidebarItem icon={<MenuIcon size={18} />} label="Menu Manager" active={activeModule === 'menus'} onClick={() => setActiveModule('menus')} />}
          {can('videos', 'read') && <SidebarItem icon={<VideoIcon size={18} />} label="Video Library" active={activeModule === 'videos'} onClick={() => setActiveModule('videos')} />}
          {(can('blog', 'read') || can('store', 'read')) && <SidebarItem icon={<FileText size={18} />} label="Content (Blog/Store)" active={activeModule === 'content'} onClick={() => setActiveModule('content')} />}
          {(can('branches', 'read') || can('programs', 'read')) && <SidebarItem icon={<Database size={18} />} label="Master Data" active={activeModule === 'master'} onClick={() => setActiveModule('master')} />}
          {can('audit', 'read') && <SidebarItem icon={<LogIcon size={18} />} label="Audit Logs" active={activeModule === 'audit'} onClick={() => setActiveModule('audit')} />}
          {can('settings', 'read') && <SidebarItem icon={<Settings size={18} />} label="Site Settings" active={activeModule === 'settings'} onClick={() => setActiveModule('settings')} />}
          {can('system', 'backup') && <SidebarItem icon={<HardDrive size={18} />} label="System Tools" active={activeModule === 'system'} onClick={() => setActiveModule('system')} />}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 relative" style={{ backgroundColor: 'var(--bg-main)' }}>
        
        {/* Module: Overview */}
        {activeModule === 'overview' && (
          <div className="animate-fade-in space-y-6">
            <h1 className="text-3xl font-bold mb-6">System Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard label="New Messages" value={messages.filter(m => m.status === 'unread').length} color="red" icon={<Mail />} />
              <StatCard label="Total Videos" value={videos.length} color="blue" icon={<VideoIcon />} />
              <StatCard label="Total Users" value={users.length} color="green" icon={<Users />} />
              <StatCard label="Pending Approval" value={videos.filter(v => !v.approved).length} color="yellow" icon={<CheckCircle />} />
            </div>
            {/* Chart */}
            <div className="p-6 rounded-lg border h-80" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
               <h3 className="text-lg font-semibold mb-4">Weekly Engagement</h3>
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.views}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} />
                    <Bar dataKey="value" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Module: Messages (Inbox) */}
        {activeModule === 'messages' && (
          <InboxManager 
            messages={messages} 
            onRefresh={loadAllData} 
            permissions={{
              canReply: can('messages', 'reply'),
              canDelete: can('messages', 'delete')
            }}
          />
        )}

        {/* Module: Roles & Permissions */}
        {activeModule === 'roles' && <RoleGuide />}

        {/* Module: User Management */}
        {activeModule === 'users' && (
          <UserManager 
            users={users} 
            onEdit={(u: User) => can('users', 'update') && openModal('USER', u)} 
            onDelete={async (id: number) => { if(can('users', 'delete') && confirm('Delete User?')) { await api.users.delete(id); loadAllData(); } }}
            onAdd={() => can('users', 'create') && openModal('USER')}
            onViewPermissions={(u: User) => openModal('PERMISSIONS', u)}
            canEdit={can('users', 'update')}
            canDelete={can('users', 'delete')}
            canCreate={can('users', 'create')}
          />
        )}

        {/* Module: Menu Manager */}
        {activeModule === 'menus' && (
          <MenuManager 
            menus={menus} 
            onEdit={(m: MenuItem) => can('menus', 'update') && openModal('MENU', m)}
            onDelete={async (id: number) => { if(can('menus', 'delete') && confirm('Delete Menu Item?')) { await api.menus.delete(id); loadAllData(); } }}
            onAdd={() => can('menus', 'create') && openModal('MENU')}
            canEdit={can('menus', 'update')}
            canDelete={can('menus', 'delete')}
            canCreate={can('menus', 'create')}
          />
        )}

        {/* Module: Master Data */}
        {activeModule === 'master' && (
          <MasterDataManager 
            branches={branches} 
            programs={programs} 
            onAddBranch={() => openModal('BRANCH')}
            onEditBranch={(b: any) => openModal('BRANCH', b)}
            onDeleteBranch={async (id: number) => { await api.branches.delete(id); loadAllData(); }}
            onAddProgram={() => openModal('PROGRAM')}
            onEditProgram={(p: any) => openModal('PROGRAM', p)}
            onDeleteProgram={async (id: number) => { await api.programs.delete(id); loadAllData(); }}
            permissions={{
              canBranchCreate: can('branches', 'create'),
              canBranchEdit: can('branches', 'update'),
              canBranchDelete: can('branches', 'delete'),
              canProgramCreate: can('programs', 'create'),
              canProgramEdit: can('programs', 'update'),
              canProgramDelete: can('programs', 'delete'),
            }}
          />
        )}

        {/* Module: Audit Logs */}
        {activeModule === 'audit' && <AuditLogViewer logs={auditLogs} />}

        {/* Module: System Tools */}
        {activeModule === 'system' && <SystemToolsManager />}

        {/* Module: Settings */}
        {activeModule === 'settings' && settings && (
          <SettingsManager 
            settings={settings} 
            refresh={loadAllData} 
            canEdit={can('settings', 'update')}
          />
        )}

        {/* Module: Content */}
        {activeModule === 'content' && (
          <ContentManager 
            refresh={loadAllData}
            onAddBlog={() => openModal('BLOG')}
            onEditBlog={(b: any) => openModal('BLOG', b)}
            onAddProduct={() => openModal('PRODUCT')}
            permissions={{
              canBlogCreate: can('blog', 'create'),
              canBlogEdit: can('blog', 'update'),
              canBlogDelete: can('blog', 'delete'),
              canBlogApprove: can('blog', 'approve'),
              canStoreCreate: can('store', 'create'),
              canStoreDelete: can('store', 'delete'),
            }}
          />
        )}

        {/* Module: Videos */}
        {activeModule === 'videos' && (
          <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
               <h1 className="text-2xl font-bold">Video Management</h1>
             </div>
             {can('videos', 'create') && <VideoUploadForm onUploadSuccess={loadAllData} />}
             
             <div className="mt-8">
               <h3 className="text-xl font-bold mb-4">Video Library</h3>
               <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                  <table className="w-full text-left text-sm">
                     <thead className="opacity-70 uppercase bg-black/20">
                       <tr><th className="p-4">Title</th><th className="p-4">Preacher</th><th className="p-4">Status</th><th className="p-4">Streaming</th><th className="p-4">Actions</th></tr>
                     </thead>
                     <tbody className="divide-y divide-[var(--border-color)]">
                       {videos.map(v => (
                         <tr key={v.id} className="hover:bg-white/5">
                           <td className="p-4">
                             <div className="font-bold">{v.title}</div>
                             <div className="text-xs opacity-60">{v.event_name}</div>
                           </td>
                           <td className="p-4 opacity-70">{v.preacher}</td>
                           <td className="p-4">
                              <span className={`px-2 py-1 rounded text-xs ${v.approved ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                                {v.approved ? 'Live' : 'Pending'}
                              </span>
                           </td>
                           <td className="p-4">
                             {can('videos', 'update') ? (
                               <button 
                                 onClick={async () => { await api.videos.toggleStreaming(v.id); loadAllData(); }}
                                 className={`px-2 py-1 rounded text-xs border ${v.streaming_enabled ? 'border-green-800 text-green-400' : 'border-zinc-700 text-gray-500'}`}
                               >
                                 {v.streaming_enabled ? 'Enabled' : 'Disabled'}
                               </button>
                             ) : (
                               <span className={`px-2 py-1 rounded text-xs border ${v.streaming_enabled ? 'border-green-800 text-green-400' : 'border-zinc-700 text-gray-500'}`}>
                                 {v.streaming_enabled ? 'Enabled' : 'Disabled'}
                               </span>
                             )}
                           </td>
                           <td className="p-4 flex gap-3 opacity-60">
                              {can('videos', 'delete') && <button onClick={async () => { if(confirm('Delete Video?')) { await api.videos.delete(v.id); loadAllData(); } }} className="hover:text-red-500"><Trash2 size={16}/></button>}
                              {(!v.approved && can('videos', 'approve')) && (
                                <button onClick={async () => { await api.videos.toggleStatus(v.id); loadAllData(); }} className="hover:text-green-500 text-green-600 font-bold text-xs border border-green-800 px-2 py-1 rounded">Approve</button>
                              )}
                           </td>
                         </tr>
                       ))}
                     </tbody>
                  </table>
               </div>
             </div>
          </div>
        )}

        {/* --- GLOBAL MODAL --- */}
        {modalType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="rounded-xl border w-full max-w-lg shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
               <div className="flex justify-between items-center p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
                  <h3 className="text-lg font-bold">
                    {modalType === 'PERMISSIONS' ? 'Role Permissions' : (editingItem ? 'Edit' : 'Add New')} {modalType === 'USER' ? 'User' : modalType === 'MENU' ? 'Menu Item' : modalType === 'PERMISSIONS' ? '' : modalType?.toLowerCase()}
                  </h3>
                  <button onClick={() => setModalType(null)}><X size={20} className="opacity-60 hover:opacity-100"/></button>
               </div>
               <div className="p-6">
                 {modalType === 'PERMISSIONS' ? (
                   <PermissionsViewer role={editingItem?.role} />
                 ) : (
                   <GenericForm 
                      type={modalType} 
                      initialData={editingItem} 
                      onSubmit={(data: any) => handleSaveItem(modalType, data)} 
                      onCancel={() => setModalType(null)} 
                      isAdmin={user?.role === 'admin' || user?.role === 'super_admin'}
                    />
                 )}
               </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

// --- SUB-COMPONENTS & FORMS ---

const SidebarItem = ({ icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition text-sm font-medium ${active ? 'text-white' : 'opacity-60 hover:opacity-100 hover:bg-white/5'}`}
    style={{ backgroundColor: active ? 'var(--color-primary)' : 'transparent' }}
  >
    {icon} {label}
  </button>
);

const StatCard = ({ label, value, color, icon }: any) => (
  <div className={`p-5 rounded-lg border flex items-center justify-between`} style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
    <div>
      <p className="opacity-60 text-sm">{label}</p>
      <h3 className="text-2xl font-bold mt-1">{value}</h3>
    </div>
    <div className={`p-3 rounded-full bg-${color}-900/20 text-${color}-500`}>{icon}</div>
  </div>
);

// --- INBOX MANAGER (NEW) ---
const InboxManager = ({ messages, onRefresh, permissions }: { messages: ContactMessage[], onRefresh: () => Promise<void>, permissions: any }) => {
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState('all');
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const filteredMessages = messages.filter(m => {
    if (filter === 'unread') return m.status === 'unread';
    if (filter === 'prayer') return m.subject === 'Prayer Request';
    return true;
  });

  const handleSelectMessage = async (msg: ContactMessage) => {
    setSelectedMsg(msg);
    if (msg.status === 'unread') {
      await api.messages.markAsRead(msg.id);
      onRefresh();
    }
  };

  const handleSendReply = async () => {
    if (!selectedMsg || !replyText) return;
    setSendingReply(true);
    try {
      await api.messages.reply(selectedMsg.id, replyText);
      setReplyText('');
      setSelectedMsg(prev => prev ? ({...prev, status: 'replied', reply: replyText}) : null);
      await onRefresh();
      alert('Reply sent successfully');
    } catch (e) {
      alert('Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this message?')) {
      await api.messages.delete(id);
      if (selectedMsg?.id === id) setSelectedMsg(null);
      onRefresh();
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex gap-6 animate-fade-in">
      {/* Message List */}
      <div className="w-1/3 flex flex-col border rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
         <div className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><Mail size={20}/> Inbox</h2>
            <div className="flex gap-2">
               {['all', 'unread', 'prayer'].map(f => (
                 <button 
                   key={f} 
                   onClick={() => setFilter(f)}
                   className={`px-3 py-1 rounded text-xs font-bold capitalize ${filter === f ? 'bg-[var(--color-primary)] text-white' : 'bg-black/20 opacity-60 hover:opacity-100'}`}
                 >
                   {f === 'prayer' ? 'Prayers' : f}
                 </button>
               ))}
            </div>
         </div>
         <div className="flex-1 overflow-y-auto">
            {filteredMessages.length === 0 ? (
              <div className="p-8 text-center opacity-50 text-sm">No messages found.</div>
            ) : (
              filteredMessages.map(msg => (
                <div 
                  key={msg.id} 
                  onClick={() => handleSelectMessage(msg)}
                  className={`p-4 border-b cursor-pointer hover:bg-white/5 transition ${selectedMsg?.id === msg.id ? 'bg-white/10' : ''} ${msg.status === 'unread' ? 'border-l-4 border-l-[var(--color-primary)]' : 'border-l-4 border-l-transparent'}`}
                  style={{ borderColor: 'var(--border-color)' }}
                >
                   <div className="flex justify-between items-start mb-1">
                      <span className={`text-sm font-bold ${msg.status === 'unread' ? 'text-white' : 'opacity-70'}`}>{msg.name}</span>
                      <span className="text-[10px] opacity-50">{new Date(msg.date).toLocaleDateString()}</span>
                   </div>
                   <div className="text-xs font-bold opacity-80 mb-1 truncate">{msg.subject}</div>
                   <div className="text-xs opacity-50 line-clamp-2">{msg.message}</div>
                </div>
              ))
            )}
         </div>
      </div>

      {/* Message Detail View */}
      <div className="flex-1 border rounded-lg overflow-hidden flex flex-col" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
         {selectedMsg ? (
           <>
             <div className="p-6 border-b flex justify-between items-start" style={{ borderColor: 'var(--border-color)' }}>
                <div>
                   <h2 className="text-2xl font-bold mb-1">{selectedMsg.subject}</h2>
                   <div className="flex items-center gap-2 text-sm opacity-60">
                      <span className="font-bold">{selectedMsg.name}</span>
                      <span>&lt;{selectedMsg.email}&gt;</span>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${selectedMsg.status === 'unread' ? 'bg-red-900/30 text-red-400' : selectedMsg.status === 'replied' ? 'bg-green-900/30 text-green-400' : 'bg-zinc-700 text-gray-400'}`}>
                     {selectedMsg.status}
                   </span>
                   {permissions.canDelete && (
                     <button onClick={() => handleDelete(selectedMsg.id)} className="p-2 hover:bg-red-900/20 text-red-500 rounded"><Trash2 size={18}/></button>
                   )}
                </div>
             </div>
             
             <div className="flex-1 p-8 overflow-y-auto whitespace-pre-wrap text-gray-200 leading-relaxed">
                {selectedMsg.message}
             </div>

             {selectedMsg.reply && (
               <div className="bg-zinc-900/50 p-6 border-t border-zinc-800">
                  <div className="text-xs font-bold uppercase opacity-50 mb-2 flex items-center gap-2"><Reply size={12}/> Your Reply</div>
                  <div className="text-sm opacity-80 italic">{selectedMsg.reply}</div>
               </div>
             )}

             {permissions.canReply && selectedMsg.status !== 'replied' && (
               <div className="p-6 border-t bg-black/20" style={{ borderColor: 'var(--border-color)' }}>
                  <textarea 
                    className="w-full bg-input-bg border border-input-border rounded p-3 text-input-text mb-3 focus:outline-none focus:border-[var(--color-primary)]"
                    style={{backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)'}}
                    rows={4}
                    placeholder="Write your reply here..."
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                  />
                  <div className="flex justify-end">
                     <button 
                       onClick={handleSendReply}
                       disabled={!replyText || sendingReply}
                       className="bg-[var(--color-primary)] px-6 py-2 rounded font-bold text-sm flex items-center gap-2 disabled:opacity-50"
                     >
                       {sendingReply ? 'Sending...' : <><Send size={16}/> Send Reply</>}
                     </button>
                  </div>
               </div>
             )}
           </>
         ) : (
           <div className="flex-1 flex flex-col items-center justify-center opacity-30">
              <MessageSquare size={64} />
              <p className="mt-4 text-lg">Select a message to view</p>
           </div>
         )}
      </div>
    </div>
  );
};

// --- AUDIT LOG VIEWER ---
const AuditLogViewer = ({ logs }: { logs: AuditLogEntry[] }) => {
  const [filter, setFilter] = useState('');
  
  const filteredLogs = logs.filter(log => 
    log.userName.toLowerCase().includes(filter.toLowerCase()) ||
    log.action.toLowerCase().includes(filter.toLowerCase()) ||
    log.module.toLowerCase().includes(filter.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ['Timestamp', 'User', 'Role', 'Action', 'Module', 'Details', 'IP'];
    const rows = filteredLogs.map(l => [
      l.timestamp, l.userName, l.userRole, l.action, l.module, `"${l.details}"`, l.ipAddress
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        <button onClick={exportCSV} className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded text-sm font-bold flex items-center gap-2"><Download size={16}/> Export CSV</button>
      </div>
      
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" size={16} />
        <input 
          placeholder="Filter logs..." 
          className="w-full bg-input-bg border border-input-border rounded p-2 pl-9 text-input-text" 
          style={{backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)'}}
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </div>

      <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <table className="w-full text-left text-sm">
          <thead className="opacity-70 uppercase bg-black/20">
             <tr>
               <th className="p-4">Timestamp</th>
               <th className="p-4">User</th>
               <th className="p-4">Module</th>
               <th className="p-4">Action</th>
               <th className="p-4">Details</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
             {filteredLogs.map(log => (
               <tr key={log.id} className="hover:bg-white/5">
                 <td className="p-4 opacity-60 font-mono text-xs">{new Date(log.timestamp).toLocaleString()}</td>
                 <td className="p-4">
                   <div className="font-bold">{log.userName}</div>
                   <div className="text-xs opacity-50">{log.userRole}</div>
                 </td>
                 <td className="p-4 opacity-80">{log.module}</td>
                 <td className="p-4"><span className="bg-black/20 px-2 py-1 rounded text-xs font-bold border border-zinc-700">{log.action}</span></td>
                 <td className="p-4 opacity-70 truncate max-w-md">{log.details}</td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- SYSTEM TOOLS MANAGER ---
const SystemToolsManager = () => {
  const [backupStatus, setBackupStatus] = useState<'idle' | 'processing' | 'ready'>('idle');
  const [backupUrl, setBackupUrl] = useState<string | null>(null);

  const handleCreateBackup = async () => {
    setBackupStatus('processing');
    try {
      const data = await api.system.createBackup();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      setBackupUrl(url);
      setBackupStatus('ready');
    } catch (e) {
      alert('Backup failed');
      setBackupStatus('idle');
    }
  };

  return (
    <div className="animate-fade-in space-y-8 max-w-4xl">
       <h1 className="text-2xl font-bold flex items-center gap-2"><HardDrive size={24}/> System Tools</h1>
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Backup Section */}
         <div className="border rounded-xl p-6" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Download size={20}/> Backup Data</h3>
            <p className="opacity-60 text-sm mb-6">
              Create a full backup of the database, user data, and system configurations. Media files are excluded.
            </p>
            
            {backupStatus === 'idle' && (
              <button onClick={handleCreateBackup} className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-bold transition">
                Start Backup Process
              </button>
            )}
            
            {backupStatus === 'processing' && (
              <button disabled className="w-full bg-zinc-700 py-3 rounded font-bold flex items-center justify-center gap-2 opacity-80 cursor-wait">
                <Loader2 className="animate-spin" /> Generating Backup...
              </button>
            )}

            {backupStatus === 'ready' && backupUrl && (
              <div className="space-y-3">
                 <div className="bg-green-900/20 border border-green-800 p-3 rounded text-green-400 text-center text-sm">Backup Ready for Download</div>
                 <a href={backupUrl} download={`betel-backup-${Date.now()}.json`} className="block w-full text-center bg-green-600 hover:bg-green-700 py-3 rounded font-bold transition">
                    Download File
                 </a>
                 <button onClick={() => setBackupStatus('idle')} className="text-xs text-gray-500 hover:text-white w-full text-center">Create New Backup</button>
              </div>
            )}
         </div>

         {/* Restore Section */}
         <div className="border rounded-xl p-6" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><RefreshCw size={20}/> Restore System</h3>
            <p className="opacity-60 text-sm mb-6">
              Restore the system from a previous backup file. <span className="text-red-400">Warning: This will overwrite current data.</span>
            </p>
            <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center hover:bg-white/5 transition cursor-pointer">
               <Upload className="mx-auto opacity-50 mb-2" />
               <p className="text-sm font-bold">Select Backup File</p>
               <input type="file" className="hidden" accept=".json" onChange={(e) => {
                 if(e.target.files?.[0]) {
                   if(confirm('Are you sure you want to restore? This cannot be undone.')) {
                     api.system.restore(e.target.files[0]);
                     alert('System restoration started in background.');
                   }
                 }
               }}/>
            </div>
         </div>
       </div>
    </div>
  );
};

// --- ROLES & PERMISSIONS GUIDE ---
const RoleGuide = () => (
  <div className="animate-fade-in space-y-6">
    <h1 className="text-3xl font-bold mb-4">Roles & Permissions</h1>
    <p className="opacity-70 max-w-3xl">
      This system uses Role-Based Access Control (RBAC). Below is the breakdown of capabilities for each administrative role.
    </p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
       <RoleCard 
         role="Super Admin" 
         icon={<Shield className="text-red-500" />} 
         desc="Full system access."
         capabilities={["Manage Settings & Branding", "Manage Menus", "Add/Delete Admins", "Master Data Control", "Full Content Control", "Audit Logs", "System Backups"]}
       />
       <RoleCard 
         role="Admin" 
         icon={<ShieldCheck className="text-blue-500" />} 
         desc="High-level operational control."
         capabilities={["Upload & Approve Videos", "Manage Blog & Store", "Manage Lower-level Users", "View Analytics", "Manage Comments"]}
       />
       <RoleCard 
         role="Moderator" 
         icon={<Lock className="text-yellow-500" />} 
         desc="Community & Content Safety."
         capabilities={["Approve/Reject Content", "Review User Comments", "Flag Inappropriate Content", "View Dashboard Stats"]}
       />
       <RoleCard 
         role="Editor" 
         icon={<Edit className="text-green-500" />} 
         desc="Content creator."
         capabilities={["Upload Videos (Needs Approval)", "Create Blog Posts (Draft)", "Edit Own Content"]}
       />
       <RoleCard 
         role="Pastor" 
         icon={<BookOpen className="text-purple-500" />} 
         desc="Ministry Leadership."
         capabilities={["View Video Analytics", "Read-only access to Settings", "View User List"]}
       />
    </div>
  </div>
);

const RoleCard = ({ role, icon, desc, capabilities }: any) => (
  <div className="border rounded-lg p-6" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
     <div className="flex items-center gap-3 mb-3">
       <div className="p-2 rounded-lg bg-black/20">{icon}</div>
       <h3 className="text-xl font-bold">{role}</h3>
     </div>
     <p className="opacity-60 text-sm mb-4">{desc}</p>
     <ul className="space-y-2">
       {capabilities.map((c: string, i: number) => (
         <li key={i} className="flex items-start gap-2 text-sm opacity-80">
           <CheckCircle size={14} className="mt-0.5 opacity-50" /> {c}
         </li>
       ))}
     </ul>
  </div>
);

// --- USER MANAGER ---
const UserManager = ({ users, onEdit, onDelete, onAdd, onViewPermissions, canEdit, canDelete, canCreate }: any) => {
  const [filter, setFilter] = useState('');
  const filteredUsers = users.filter((u: User) => 
    u.name.toLowerCase().includes(filter.toLowerCase()) || 
    u.email.toLowerCase().includes(filter.toLowerCase()) ||
    u.role.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        {canCreate && <button onClick={onAdd} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm font-bold flex items-center gap-2 transition shadow-lg"><Plus size={16}/> Add New User</button>}
      </div>

      <div className="relative">
         <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" size={16} />
         <input 
           value={filter}
           onChange={(e) => setFilter(e.target.value)}
           placeholder="Search users by name, email or role..."
           className="w-full bg-input-bg border border-input-border rounded p-3 pl-10 text-input-text"
           style={{backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)'}}
         />
      </div>

      <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <table className="w-full text-left text-sm">
          <thead className="opacity-70 uppercase bg-black/20">
             <tr><th className="p-4">User</th><th className="p-4">Role</th><th className="p-4">Email</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
             {filteredUsers.map((u: User) => (
               <tr key={u.id} className="hover:bg-white/5">
                 <td className="p-4 flex items-center gap-3">
                   <img src={u.avatar} className="w-8 h-8 rounded-full" />
                   <span className="font-bold">{u.name}</span>
                 </td>
                 <td className="p-4"><span className="bg-black/30 border border-zinc-700 px-2 py-1 rounded text-xs uppercase font-bold opacity-80">{u.role}</span></td>
                 <td className="p-4 opacity-70">{u.email}</td>
                 <td className="p-4">
                   <span className={`px-2 py-1 rounded text-xs uppercase font-bold ${u.status === 'active' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                     {u.status}
                   </span>
                 </td>
                 <td className="p-4 flex gap-3">
                    {canEdit && <button onClick={() => onEdit(u)} className="text-blue-400 hover:text-white" title="Edit User"><Edit size={16}/></button>}
                    {canEdit && <button onClick={() => alert('Password reset link sent (Mock)')} className="text-yellow-400 hover:text-white" title="Reset Password"><Key size={16}/></button>}
                    <button onClick={() => onViewPermissions(u)} className="text-purple-400 hover:text-white" title="View Permissions"><ShieldCheck size={16}/></button>
                    {canDelete && <button onClick={() => onDelete(u.id)} className="text-red-400 hover:text-white" title="Delete User"><Trash2 size={16}/></button>}
                 </td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- PERMISSIONS VIEWER MODAL ---
const PermissionsViewer = ({ role }: { role: UserRole }) => {
  const permissions = PERMISSION_MATRIX[role];
  return (
    <div className="space-y-4">
       <div className="flex items-center gap-3 mb-4">
         <span className="text-2xl font-bold capitalize">{role}</span>
         <span className="bg-zinc-800 px-2 py-1 rounded text-xs">Role Permissions</span>
       </div>
       <div className="grid grid-cols-2 gap-4">
         {Object.entries(permissions).map(([module, actions]) => (
           <div key={module} className="border p-3 rounded bg-black/10">
             <h4 className="font-bold text-sm uppercase opacity-70 mb-2">{module}</h4>
             {(actions as string[]).length > 0 ? (
               <div className="flex flex-wrap gap-2">
                 {(actions as string[]).map(a => (
                   <span key={a} className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded border border-green-900/50">{a}</span>
                 ))}
               </div>
             ) : <span className="text-xs opacity-40 italic">No Access</span>}
           </div>
         ))}
       </div>
    </div>
  );
};

// --- MENU MANAGER ---
const MenuManager = ({ menus, onEdit, onDelete, onAdd, canEdit, canDelete, canCreate }: any) => (
  <div className="space-y-6 animate-fade-in">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Menu Structure</h1>
      {canCreate && <button onClick={onAdd} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-bold flex items-center gap-2"><Plus size={16}/> Add Menu Item</button>}
    </div>
    <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
      <table className="w-full text-left text-sm">
        <thead className="opacity-70 uppercase bg-black/20">
           <tr><th className="p-4">Order</th><th className="p-4">Title</th><th className="p-4">URL</th><th className="p-4">Type</th><th className="p-4">Actions</th></tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-color)]">
           {menus.map(m => (
             <tr key={m.id} className="hover:bg-white/5">
               <td className="p-4 opacity-50">{m.order}</td>
               <td className="p-4 flex items-center gap-2">
                 {m.parentId && <span className="opacity-40 pl-4">↳</span>} 
                 <span className="font-bold">{m.title}</span>
               </td>
               <td className="p-4 opacity-60 font-mono text-xs">{m.url}</td>
               <td className="p-4 text-xs uppercase opacity-50">{m.type}</td>
               <td className="p-4 flex gap-3">
                  {canEdit && <button onClick={() => onEdit(m)} className="text-blue-400 hover:text-white"><Edit size={16}/></button>}
                  {canDelete && <button onClick={() => onDelete(m.id)} className="text-red-400 hover:text-white"><Trash2 size={16}/></button>}
               </td>
             </tr>
           ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- MASTER DATA MANAGER ---
const MasterDataManager = ({ branches, programs, onAddBranch, onEditBranch, onDeleteBranch, onAddProgram, onEditProgram, onDeleteProgram, permissions }: any) => {
  const [tab, setTab] = useState<'branches' | 'programs'>('branches');
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex gap-4 border-b pb-4" style={{ borderColor: 'var(--border-color)' }}>
        <button onClick={() => setTab('branches')} className={`text-lg font-bold ${tab === 'branches' ? 'text-[var(--color-primary)]' : 'opacity-50'}`}>Branches</button>
        <button onClick={() => setTab('programs')} className={`text-lg font-bold ${tab === 'programs' ? 'text-[var(--color-primary)]' : 'opacity-50'}`}>Program Types</button>
      </div>
      
      {tab === 'branches' && (
        <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
           {branches.map((b: Branch) => (
             <div key={b.id} className="flex justify-between items-center p-3 border-b last:border-0 hover:bg-white/5" style={{ borderColor: 'var(--border-color)' }}>
               <div>
                 <h4 className="font-bold">{b.name}</h4>
                 <p className="text-xs opacity-50">{b.location}</p>
               </div>
               <div className="flex gap-2">
                 {permissions.canBranchEdit && <button onClick={() => onEditBranch(b)} className="p-2 hover:bg-white/10 rounded"><Edit size={16}/></button>}
                 {permissions.canBranchDelete && <button onClick={() => onDeleteBranch(b.id)} className="p-2 hover:bg-white/10 rounded text-red-500"><Trash2 size={16}/></button>}
               </div>
             </div>
           ))}
           {permissions.canBranchCreate && <button onClick={onAddBranch} className="mt-4 w-full py-2 border border-dashed opacity-50 hover:opacity-100 hover:border-zinc-500 rounded text-sm" style={{ borderColor: 'var(--border-color)' }}>+ Add New Branch</button>}
        </div>
      )}

      {tab === 'programs' && (
        <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
           {programs.map((p: ProgramType) => (
             <div key={p.id} className="flex justify-between items-center p-3 border-b last:border-0 hover:bg-white/5" style={{ borderColor: 'var(--border-color)' }}>
               <span className="font-medium">{p.name}</span>
               <div className="flex gap-2">
                 {permissions.canProgramEdit && <button onClick={() => onEditProgram(p)} className="p-2 hover:bg-white/10 rounded"><Edit size={16}/></button>}
                 {permissions.canProgramDelete && <button onClick={() => onDeleteProgram(p.id)} className="p-2 hover:bg-white/10 rounded text-red-500"><Trash2 size={16}/></button>}
               </div>
             </div>
           ))}
           {permissions.canProgramCreate && <button onClick={onAddProgram} className="mt-4 w-full py-2 border border-dashed opacity-50 hover:opacity-100 hover:border-zinc-500 rounded text-sm" style={{ borderColor: 'var(--border-color)' }}>+ Add New Program Type</button>}
        </div>
      )}
    </div>
  );
};

// --- ADVANCED SETTINGS MANAGER ---
const SettingsManager = ({ settings, refresh, canEdit }: { settings: SiteSettings, refresh: () => Promise<void>, canEdit: boolean }) => {
  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'streaming' | 'seo' | 'social' | 'system'>('general');
  const [isSaving, setIsSaving] = useState(false);
  const { updateThemePreview } = useTheme();

  // Sync state with props to ensure updates from other sources (or after save) are reflected
  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSave = async () => {
    if (!canEdit) return;
    setIsSaving(true);
    try {
      await api.settings.update(formData);
      await refresh(); // Await the refresh to ensure new data is loaded
      alert('Settings Saved Successfully!');
    } catch (e) {
      console.error(e);
      alert('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNestedChange = (section: keyof SiteSettings, key: string, value: any) => {
    setFormData(prev => {
      const newState = {
        ...prev,
        [section]: {
          ...(prev[section] as any),
          [key]: value
        }
      };
      // Live Preview for Appearance
      if (section === 'appearance') {
        updateThemePreview({ [key]: value });
      }
      return newState;
    });
  };

  return (
    <div className="max-w-4xl animate-fade-in pb-12">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><Settings size={24}/> Global Site Settings</h1>
      
      {/* Settings Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
         {['general', 'appearance', 'streaming', 'seo', 'social', 'system'].map(tab => (
           <button 
             key={tab}
             onClick={() => setActiveTab(tab as any)}
             className={`px-4 py-2 rounded text-sm font-bold capitalize whitespace-nowrap ${activeTab === tab ? 'text-white border' : 'opacity-60 hover:opacity-100'}`}
             style={{ 
               backgroundColor: activeTab === tab ? 'var(--bg-card)' : 'transparent',
               borderColor: activeTab === tab ? 'var(--border-color)' : 'transparent'
             }}
           >
             {tab}
           </button>
         ))}
      </div>

      <div className="rounded-lg border p-8" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
         {/* General Tab */}
         {activeTab === 'general' && (
           <div className="space-y-6">
             <h3 className="text-lg font-bold border-b pb-2 mb-4" style={{ borderColor: 'var(--border-color)' }}>General Info</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm opacity-60 mb-1">Site Name</label>
                   <input disabled={!canEdit} className="w-full bg-input-bg border border-input-border rounded p-2 text-input-text" style={{backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)'}} value={formData.siteName} onChange={e => setFormData({...formData, siteName: e.target.value})} />
                </div>
                <div>
                   <label className="block text-sm opacity-60 mb-1">Contact Email</label>
                   <input disabled={!canEdit} className="w-full bg-input-bg border border-input-border rounded p-2 text-input-text" style={{backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)'}} value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} />
                </div>
             </div>
             <div>
                <label className="block text-sm opacity-60 mb-1">Tagline</label>
                <input disabled={!canEdit} className="w-full bg-input-bg border border-input-border rounded p-2 text-input-text" style={{backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)'}} value={formData.tagline} onChange={e => setFormData({...formData, tagline: e.target.value})} />
             </div>
             <div>
                <label className="block text-sm opacity-60 mb-1">Footer Text</label>
                <textarea disabled={!canEdit} className="w-full bg-input-bg border border-input-border rounded p-2 text-input-text h-24 resize-none" style={{backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)'}} value={formData.footerText} onChange={e => setFormData({...formData, footerText: e.target.value})} />
             </div>
           </div>
         )}

         {/* Appearance Tab */}
         {activeTab === 'appearance' && (
           <div className="space-y-8 max-w-2xl">
             <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg flex items-start gap-3">
               <div className="p-1 bg-yellow-500/20 rounded text-yellow-500 mt-0.5">
                 <Palette size={16} />
               </div>
               <div>
                 <h4 className="text-sm font-bold text-yellow-500 mb-1">Live Preview Active</h4>
                 <p className="text-xs opacity-70">Changes made here are instantly applied to your current view. Click "Save Configuration" to apply them globally.</p>
               </div>
             </div>

             <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-bold opacity-70 mb-3">Interface Theme</label>
                  <div className="grid grid-cols-3 gap-4">
                     {['light', 'dark', 'system'].map(mode => (
                       <label 
                        key={mode} 
                        className={`
                          cursor-pointer relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all
                          ${formData.appearance.theme === mode 
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10' 
                            : 'border-zinc-700 hover:border-zinc-500 bg-black/5'}
                        `}
                       >
                          <input 
                            type="radio" 
                            name="theme" 
                            className="sr-only"
                            checked={formData.appearance.theme === mode} 
                            onChange={() => handleNestedChange('appearance', 'theme', mode)}
                            disabled={!canEdit}
                          />
                          {mode === 'light' && <Sun size={24} className="opacity-70" />}
                          {mode === 'dark' && <Moon size={24} className="opacity-70" />}
                          {mode === 'system' && <Monitor size={24} className="opacity-70" />}
                          
                          <div className={`w-full h-12 rounded-lg shadow-inner mt-2 ${mode === 'light' ? 'bg-zinc-100 border border-zinc-200' : (mode === 'dark' ? 'bg-zinc-900 border border-zinc-800' : 'bg-gradient-to-br from-zinc-100 to-zinc-900 border border-zinc-700')}`}></div>
                          <span className="capitalize font-medium text-sm">{mode} Mode</span>
                       </label>
                     ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                      <label className="block text-sm font-bold opacity-70 mb-3">Accent Color</label>
                      <div className="flex items-center gap-4">
                        <div className="relative overflow-hidden w-16 h-16 rounded-xl shadow-lg ring-2 ring-offset-2 ring-offset-[var(--bg-card)] ring-[var(--color-primary)]">
                           <input 
                              type="color" 
                              value={formData.appearance.accentColor}
                              onChange={e => handleNestedChange('appearance', 'accentColor', e.target.value)}
                              disabled={!canEdit}
                              className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer p-0 border-0"
                           />
                        </div>
                        <div className="flex-1">
                           <p className="text-xs opacity-50 mb-1">Hex Code</p>
                           <div className="font-mono bg-black/20 px-3 py-2 rounded text-sm border border-zinc-700">
                             {formData.appearance.accentColor}
                           </div>
                        </div>
                      </div>
                  </div>
                  
                  <div>
                      <label className="block text-sm font-bold opacity-70 mb-3">Typography</label>
                      <select 
                        value={formData.appearance.fontFamily} 
                        onChange={e => handleNestedChange('appearance', 'fontFamily', e.target.value)}
                        disabled={!canEdit}
                        className="w-full bg-input-bg border border-input-border rounded-lg p-3 text-input-text focus:ring-2 ring-[var(--color-primary)] outline-none transition-all" 
                        style={{backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)'}}
                      >
                        <option value="Inter">Inter (Clean)</option>
                        <option value="Roboto">Roboto (Modern)</option>
                        <option value="Open Sans">Open Sans (Neutral)</option>
                        <option value="Lato">Lato (Friendly)</option>
                      </select>
                      <div className="mt-3 p-3 bg-black/5 rounded border border-dashed border-zinc-700">
                        <p className="text-xs opacity-50 mb-1">Font Preview:</p>
                        <p className="text-sm" style={{ fontFamily: formData.appearance.fontFamily }}>The quick brown fox jumps over the lazy dog.</p>
                      </div>
                  </div>
                </div>
             </div>
           </div>
         )}

         {/* Streaming Tab */}
         {activeTab === 'streaming' && (
           <div className="space-y-6">
             <h3 className="text-lg font-bold border-b pb-2 mb-4 flex items-center gap-2" style={{ borderColor: 'var(--border-color)' }}><Radio size={18}/> Live Streaming Config</h3>
             
             <div className="flex items-center gap-4 p-4 bg-black/10 rounded border border-zinc-700">
               <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.enableLiveStream} 
                    onChange={e => setFormData({...formData, enableLiveStream: e.target.checked})}
                    disabled={!canEdit}
                    className="w-5 h-5 accent-red-600"
                  />
                  <span className="font-bold">Enable Live Stream Module</span>
               </label>
             </div>

             <div>
                <label className="block text-sm opacity-60 mb-1">RTMP Server URL</label>
                <input disabled={!canEdit} className="w-full bg-input-bg border border-input-border rounded p-2 text-input-text font-mono text-sm" style={{backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)'}} value={formData.streaming.serverUrl} onChange={e => handleNestedChange('streaming', 'serverUrl', e.target.value)} />
             </div>
             <div>
                <label className="block text-sm opacity-60 mb-1">Stream Key</label>
                <input type="password" disabled={!canEdit} className="w-full bg-input-bg border border-input-border rounded p-2 text-input-text font-mono text-sm" style={{backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)'}} value={formData.streaming.streamKey} onChange={e => handleNestedChange('streaming', 'streamKey', e.target.value)} />
             </div>
           </div>
         )}

         {/* SEO Tab */}
         {activeTab === 'seo' && (
           <div className="space-y-6">
             <h3 className="text-lg font-bold border-b pb-2 mb-4 flex items-center gap-2" style={{ borderColor: 'var(--border-color)' }}><Globe size={18}/> SEO Settings</h3>
             <div>
                <label className="block text-sm opacity-60 mb-1">Meta Title</label>
                <input disabled={!canEdit} className="w-full bg-input-bg border border-input-border rounded p-2 text-input-text" style={{backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)'}} value={formData.seo.metaTitle} onChange={e => handleNestedChange('seo', 'metaTitle', e.target.value)} />
             </div>
             <div>
                <label className="block text-sm opacity-60 mb-1">Meta Description</label>
                <textarea disabled={!canEdit} className="w-full bg-input-bg border border-input-border rounded p-2 text-input-text h-24 resize-none" style={{backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)'}} value={formData.seo.metaDescription} onChange={e => handleNestedChange('seo', 'metaDescription', e.target.value)} />
             </div>
           </div>
         )}

         {/* Social Tab */}
         {activeTab === 'social' && (
           <div className="space-y-6">
              <h3 className="text-lg font-bold border-b pb-2 mb-4 flex items-center gap-2" style={{ borderColor: 'var(--border-color)' }}><Users size={18}/> Social Links</h3>
              <div>
                <label className="block text-sm opacity-60 mb-1">Facebook URL</label>
                <input disabled={!canEdit} className="w-full bg-input-bg border border-input-border rounded p-2 text-input-text" style={{backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)'}} value={formData.social.facebook} onChange={e => handleNestedChange('social', 'facebook', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm opacity-60 mb-1">YouTube URL</label>
                <input disabled={!canEdit} className="w-full bg-input-bg border border-input-border rounded p-2 text-input-text" style={{backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)'}} value={formData.social.youtube} onChange={e => handleNestedChange('social', 'youtube', e.target.value)} />
              </div>
           </div>
         )}

         {/* System Tab */}
         {activeTab === 'system' && (
           <div className="space-y-6">
             <h3 className="text-lg font-bold border-b pb-2 mb-4 flex items-center gap-2" style={{ borderColor: 'var(--border-color)' }}><Server size={18}/> System Configuration</h3>
             <div>
                <label className="block text-sm opacity-60 mb-1">System Version</label>
                <input disabled className="w-full bg-black/20 border border-zinc-700 rounded p-2 text-gray-500 cursor-not-allowed" value={formData.system.version} />
             </div>
             <div>
               <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.maintenanceMode} 
                    onChange={e => setFormData({...formData, maintenanceMode: e.target.checked})}
                    disabled={!canEdit}
                    className="w-5 h-5 accent-red-600"
                  />
                  <span className="font-bold text-red-500">Enable Maintenance Mode</span>
               </label>
               <p className="text-xs text-gray-500 mt-1 ml-7">Restricts access to admins only.</p>
             </div>
           </div>
         )}
      </div>

      <div className="mt-8 flex justify-end gap-4">
        {canEdit && (
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 shadow-lg disabled:opacity-50 transition"
          >
            {isSaving ? 'Saving...' : <><Save size={20}/> Save Configuration</>}
          </button>
        )}
      </div>
    </div>
  );
};

// --- CONTENT MANAGER ---
const ContentManager = ({ refresh, onAddBlog, onEditBlog, onAddProduct, permissions }: any) => {
  const [tab, setTab] = useState<'blog' | 'store'>('blog');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setBlogPosts(await api.blog.getAll());
      setProducts(await api.store.getAll());
    };
    fetchData();
  }, [refresh]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex gap-4 border-b pb-4" style={{ borderColor: 'var(--border-color)' }}>
        <button onClick={() => setTab('blog')} className={`text-lg font-bold ${tab === 'blog' ? 'text-[var(--color-primary)]' : 'opacity-50'}`}>Blog Posts</button>
        <button onClick={() => setTab('store')} className={`text-lg font-bold ${tab === 'store' ? 'text-[var(--color-primary)]' : 'opacity-50'}`}>Store Products</button>
      </div>

      {tab === 'blog' && (
        <div className="space-y-4">
           {permissions.canBlogCreate && <button onClick={onAddBlog} className="bg-[var(--color-primary)] px-4 py-2 rounded text-white font-bold text-sm">+ Add New Post</button>}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {blogPosts.map(post => (
                 <div key={post.id} className="border rounded-lg p-4 relative group" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded p-1">
                       {permissions.canBlogEdit && <button onClick={() => onEditBlog(post)} className="p-1 hover:text-blue-400"><Edit size={14}/></button>}
                       {permissions.canBlogDelete && <button onClick={async () => { if(confirm('Delete?')) { await api.blog.delete(post.id); refresh(); } }} className="p-1 hover:text-red-400"><Trash2 size={14}/></button>}
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded mb-2 inline-block ${post.status === 'published' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>{post.status}</span>
                    <h3 className="font-bold line-clamp-1">{post.title}</h3>
                    <p className="text-xs opacity-60 mt-1">{post.date} • {post.author}</p>
                 </div>
              ))}
           </div>
        </div>
      )}

      {tab === 'store' && (
        <div className="space-y-4">
           {permissions.canStoreCreate && <button onClick={onAddProduct} className="bg-[var(--color-primary)] px-4 py-2 rounded text-white font-bold text-sm">+ Add Product</button>}
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map(product => (
                 <div key={product.id} className="border rounded-lg p-4 relative group" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded p-1">
                       {permissions.canStoreDelete && <button onClick={async () => { if(confirm('Delete?')) { await api.store.delete(product.id); refresh(); } }} className="p-1 hover:text-red-400"><Trash2 size={14}/></button>}
                    </div>
                    <img src={product.image} className="w-full h-32 object-cover rounded mb-2 bg-black/20"/>
                    <h3 className="font-bold text-sm line-clamp-1">{product.title}</h3>
                    <p className="text-xs font-bold text-[var(--color-primary)]">${product.price}</p>
                 </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

// --- GENERIC FORM (UPDATED FOR USERS) ---
const GenericForm = ({ type, initialData, onSubmit, onCancel, isAdmin }: any) => {
  const [formData, setFormData] = useState<any>(initialData || {});
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || initialData?.thumbnail_url || null);

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e: any) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
       const file = e.target.files[0];
       const url = URL.createObjectURL(file);
       setImagePreview(url);
       setFormData((prev: any) => ({ ...prev, image: url })); // Simulate upload
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {type === 'USER' && (
        <>
          <div>
            <label className="block text-xs font-bold uppercase opacity-60 mb-1">Full Name</label>
            <input required name="name" value={formData.name || ''} onChange={handleChange} className="w-full bg-input-bg border border-input-border rounded p-2 text-input-text" style={{backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)'}}/>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase opacity-60 mb-1">Email</label>
            <input required type="email" name="email" value={formData.email || ''} onChange={handleChange} className="w-full bg-input-bg border border-input-border rounded p-2 text-input-text" style={{backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)'}}/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase opacity-60 mb-1">Role</label>
              <select name="role" value={formData.role || 'member'} onChange={handleChange} disabled={!isAdmin} className="w-full bg-input-bg border border-input-border rounded p-2 text-input-text" style={{backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)'}}>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="moderator">Moderator</option>
                <option value="pastor">Pastor</option>
                <option value="member">Member</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase opacity-60 mb-1">Status</label>
              <select name="status" value={formData.status || 'active'} onChange={handleChange} className="w-full bg-input-bg border border-input-border rounded p-2 text-input-text" style={{backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)'}}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="banned">Banned</option>
              </select>
            </div>
          </div>
          <div>
             <label className="block text-xs font-bold uppercase opacity-60 mb-1">Password {initialData && '(Leave blank to keep current)'}</label>
             <input type="password" name="password" onChange={handleChange} className="w-full bg-input-bg border border-input-border rounded p-2 text-input-text" style={{backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)'}}/>
          </div>
        </>
      )}

      {type === 'MENU' && (
        <>
          <div>
            <label className="block text-xs font-bold uppercase opacity-60 mb-1">Title</label>
            <input required name="title" value={formData.title || ''} onChange={handleChange} className="w-full bg-input-bg border border-input-border rounded p-2 text-input-text" style={{backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)'}}/>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase opacity-60 mb-1">URL</label>
            <input required name="url" value={formData.url || ''} onChange={handleChange} className="w-full bg-input-bg border border-input-border rounded p-2 text-input-text" style={{backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)'}}/>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-xs font-bold uppercase opacity-60 mb-1">Order</label>
               <input type="number" name="order" value={formData.order || 0} onChange={handleChange} className="w-full bg-input-bg border border-input-border rounded p-2 text-input-text" style={{backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)'}}/>
             </div>
             <div>
               <label className="block text-xs font-bold uppercase opacity-60 mb-1">Type</label>
               <select name="type" value={formData.type || 'link'} onChange={handleChange} className="w-full bg-input-bg border border-input-border rounded p-2 text-input-text" style={{backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)'}}>
                  <option value="link">Link</option>
                  <option value="dropdown">Dropdown</option>
                  <option value="mega_menu">Mega Menu</option>
               </select>
             </div>
          </div>
        </>
      )}

      {/* BLOG FORM */}
      {type === 'BLOG' && (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
                <div>
                   <label className="block text-xs font-bold uppercase opacity-60 mb-1">Title</label>
                   <input required name="title" value={formData.title || ''} onChange={handleChange} className="w-full bg-input-bg border border-input-border rounded p-2 text-input-text" style={{backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)'}}/>
                </div>
                <div>
                   <label className="block text-xs font-bold uppercase opacity-60 mb-1">Content</label>
                   <textarea rows={8} name="content" value={formData.content || ''} onChange={handleChange} className="w-full bg-input-bg border border-input-border rounded p-2 text-input-text" style={{backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)'}}/>
                </div>
                <div>
                   <label className="block text-xs font-bold uppercase opacity-60 mb-1">Excerpt</label>
                   <textarea rows={2} name="excerpt" value={formData.excerpt || ''} onChange={handleChange} className="w-full bg-input-bg border border-input-border rounded p-2 text-input-text" style={{backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)'}}/>
                </div>
            </div>
            <div className="space-y-4">
                <div className="border border-dashed border-zinc-700 rounded-lg p-4 text-center">
                   {imagePreview ? (
                      <div className="relative">
                        <img src={imagePreview} className="w-full h-32 object-cover rounded mb-2"/>
                        <button type="button" onClick={() => setImagePreview(null)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"><X size={12}/></button>
                      </div>
                   ) : (
                      <label className="cursor-pointer block p-4 hover:bg-white/5 rounded">
                         <ImageIcon className="mx-auto mb-2 opacity-50"/>
                         <span className="text-xs opacity-60">Upload Featured Image</span>
                         <input type="file" className="hidden" onChange={handleFileChange} accept="image/*"/>
                      </label>
                   )}
                </div>
                <div>
                   <label className="block text-xs font-bold uppercase opacity-60 mb-1">Category</label>
                   <input name="category" value={formData.category || ''} onChange={handleChange} className="w-full bg-input-bg border border-input-border rounded p-2 text-input-text" style={{backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)'}}/>
                </div>
                <div>
                   <label className="block text-xs font-bold uppercase opacity-60 mb-1">Status</label>
                   <select name="status" value={formData.status || 'draft'} onChange={handleChange} className="w-full bg-input-bg border border-input-border rounded p-2 text-input-text" style={{backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)'}}>
                      <option value="draft">Draft</option>
                      <option value="pending">Pending Review</option>
                      <option value="published">Published</option>
                   </select>
                </div>
            </div>
         </div>
      )}

      {/* Fallback for other types */}
      {(type === 'BRANCH' || type === 'PROGRAM' || type === 'PRODUCT') && (
        Object.keys(initialData || {}).map(key => {
           if (key === 'id' || key === 'image' || key === 'thumbnail_url') return null;
           return (
             <div key={key}>
               <label className="block text-xs font-bold uppercase opacity-60 mb-1">{key.replace('_', ' ')}</label>
               <input name={key} value={formData[key] || ''} onChange={handleChange} className="w-full bg-input-bg border border-input-border rounded p-2 text-input-text" style={{backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--input-text)'}}/>
             </div>
           )
        })
      )}
      
      {/* Product Image Specific */}
      {type === 'PRODUCT' && (
         <div className="border border-dashed border-zinc-700 rounded-lg p-4 text-center">
            {imagePreview ? (
               <img src={imagePreview} className="w-full h-32 object-contain rounded mb-2"/>
            ) : (
               <label className="cursor-pointer block p-4 hover:bg-white/5 rounded">
                  <Upload className="mx-auto mb-2 opacity-50"/>
                  <span className="text-xs opacity-60">Upload Product Image</span>
                  <input type="file" className="hidden" onChange={handleFileChange} accept="image/*"/>
               </label>
            )}
         </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded hover:bg-white/10 text-sm font-bold">Cancel</button>
        <button type="submit" className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold">Save Changes</button>
      </div>
    </form>
  );
};
