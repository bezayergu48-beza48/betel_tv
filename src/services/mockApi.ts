
import { Video, User, StatData, UserRole, VideoFilterParams, MenuItem, SiteSettings, Branch, ProgramType, BlogPost, Product, AuditLogEntry } from '../types';
import { MOCK_VIDEOS, MOCK_USER, BRANCHES, PROGRAM_TYPES, INITIAL_MENUS, INITIAL_SETTINGS, INITIAL_BLOG_POSTS, INITIAL_PRODUCTS, INITIAL_AUDIT_LOGS } from '../constants';

// Mutable State for Admin Management
let videosState = [...MOCK_VIDEOS];
let usersState: User[] = [
  MOCK_USER,
  { id: 2, name: "Pastor Yohannes", email: "pastor@betel.tv", role: UserRole.PASTOR, avatar: "https://ui-avatars.com/api/?name=Pastor+Yohannes&background=random", status: 'active' },
  { id: 3, name: "Media Editor", email: "editor@betel.tv", role: UserRole.EDITOR, avatar: "https://ui-avatars.com/api/?name=Media+Editor&background=random", status: 'active' },
  { id: 4, name: "John Member", email: "john@example.com", role: UserRole.MEMBER, avatar: "https://ui-avatars.com/api/?name=John+Member&background=random", status: 'active' },
  { id: 5, name: "Site Moderator", email: "mod@betel.tv", role: UserRole.MODERATOR, avatar: "https://ui-avatars.com/api/?name=Moderator&background=random", status: 'active' },
];
let branchesState = [...BRANCHES];
let programsState = [...PROGRAM_TYPES];
let menusState = [...INITIAL_MENUS];
let settingsState = { ...INITIAL_SETTINGS };
let blogState = [...INITIAL_BLOG_POSTS];
let storeState = [...INITIAL_PRODUCTS];
let auditLogsState = [...INITIAL_AUDIT_LOGS];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to log actions
const logAction = (action: string, module: string, details: string, user?: User) => {
  const newLog: AuditLogEntry = {
    id: Date.now(),
    userId: user?.id || 0,
    userName: user?.name || 'System',
    userRole: user?.role || 'system',
    action,
    module,
    details,
    timestamp: new Date().toISOString(),
    ipAddress: '127.0.0.1' // Mock IP
  };
  auditLogsState.unshift(newLog);
};

export const api = {
  auth: {
    login: async (email: string, password: string): Promise<{ user: User, token: string }> => {
      await delay(500);
      const foundUser = usersState.find(u => u.email === email);
      // For mock, allow any password if user exists, or specific mock password
      if (foundUser && foundUser.status === 'active') {
        logAction('LOGIN', 'AUTH', `User ${foundUser.email} logged in`, foundUser);
        return { user: foundUser, token: "jwt_mock_token_12345" };
      }
      throw new Error("Invalid credentials or inactive account");
    },
    logout: async () => {
      await delay(200);
    }
  },
  
  audit: {
    getAll: async (): Promise<AuditLogEntry[]> => {
      await delay(200);
      return auditLogsState;
    },
    log: async (action: string, module: string, details: string) => {
      logAction(action, module, details); // For manual logging from UI if needed
    }
  },

  system: {
    createBackup: async (): Promise<string> => {
      await delay(2000); // Simulate processing
      logAction('BACKUP', 'SYSTEM', 'Full system backup created');
      // Create a mock JSON blob
      const backupData = {
        timestamp: new Date().toISOString(),
        users: usersState.length,
        videos: videosState.length,
        settings: settingsState,
      };
      return JSON.stringify(backupData, null, 2);
    },
    restore: async (file: File) => {
      await delay(2000);
      logAction('RESTORE', 'SYSTEM', `System restored from backup: ${file.name}`);
    }
  },

  users: {
    getAll: async (): Promise<User[]> => { await delay(400); return usersState; },
    create: async (userData: Partial<User>): Promise<User> => {
      await delay(600);
      const newUser = { 
        id: Math.floor(Math.random() * 10000), 
        avatar: `https://ui-avatars.com/api/?name=${userData.name}`, 
        status: userData.status || 'active',
        role: userData.role || UserRole.MEMBER,
        ...userData 
      } as User;
      usersState = [...usersState, newUser];
      logAction('CREATE', 'USERS', `Created user: ${newUser.email}`);
      return newUser;
    },
    update: async (id: number, userData: Partial<User>): Promise<void> => {
      await delay(500);
      usersState = usersState.map(u => u.id === id ? { ...u, ...userData } : u);
      logAction('UPDATE', 'USERS', `Updated user ID: ${id}`);
    },
    delete: async (id: number): Promise<void> => {
      await delay(500);
      usersState = usersState.filter(u => u.id !== id);
      logAction('DELETE', 'USERS', `Deleted user ID: ${id}`);
    }
  },

  videos: {
    getAll: async (): Promise<Video[]> => { await delay(300); return videosState; },
    getById: async (id: number): Promise<Video | undefined> => { await delay(200); return videosState.find(v => v.id === id); },
    getFeatured: async (): Promise<Video> => { await delay(200); return videosState[0]; },
    filter: async (params: VideoFilterParams): Promise<Video[]> => {
      await delay(400); 
      let result = videosState;
      if (params.search) {
        const q = params.search.toLowerCase();
        result = result.filter(v => v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q) || v.event_name.toLowerCase().includes(q) || v.preacher.toLowerCase().includes(q) || v.tags.some(t => t.toLowerCase().includes(q)));
      }
      if (params.program_type_id) result = result.filter(v => v.program_type_id === params.program_type_id);
      if (params.branch_id) result = result.filter(v => v.branch_id === params.branch_id);
      if (params.preacher && params.preacher !== 'all') result = result.filter(v => v.preacher === params.preacher);
      if (params.year || params.month || params.day || params.dayOfWeek !== undefined) {
         result = result.filter(v => {
           const d = new Date(v.date);
           if (params.year && d.getFullYear() !== params.year) return false;
           if (params.month && (d.getMonth() + 1) !== params.month) return false;
           if (params.day && d.getDate() !== params.day) return false;
           if (params.dayOfWeek !== undefined && params.dayOfWeek !== -1 && d.getDay() !== params.dayOfWeek) return false;
           return true;
         });
      }
      return result;
    },
    upload: async (videoData: Partial<Video>): Promise<Video> => {
      await delay(1000);
      const newVideo: Video = {
        title: 'Untitled Video', program_type_id: 1, event_name: 'General Event', branch_id: 1, preacher: 'Guest Speaker', description: '', video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', thumbnail_url: 'https://picsum.photos/800/450', date: new Date().toISOString().split('T')[0], duration: 0, tags: [], version: 'v01', ...videoData, id: Math.floor(Math.random() * 10000), views: 0, approved: false, streaming_enabled: videoData.streaming_enabled ?? true, uploader_id: 1,
      } as Video;
      videosState = [newVideo, ...videosState];
      logAction('UPLOAD', 'VIDEOS', `Uploaded video: ${newVideo.title}`);
      return newVideo;
    },
    update: async (id: number, videoData: Partial<Video>): Promise<void> => {
      await delay(400);
      videosState = videosState.map(v => v.id === id ? { ...v, ...videoData } : v);
      logAction('UPDATE', 'VIDEOS', `Updated video ID: ${id}`);
    },
    delete: async (id: number) => { 
      await delay(400); 
      videosState = videosState.filter(v => v.id !== id);
      logAction('DELETE', 'VIDEOS', `Deleted video ID: ${id}`);
    },
    toggleStatus: async (id: number) => { 
      await delay(200); 
      videosState = videosState.map(v => v.id === id ? { ...v, approved: !v.approved } : v);
      logAction('APPROVE', 'VIDEOS', `Toggled approval for video ID: ${id}`);
    },
    toggleStreaming: async (id: number) => { 
      await delay(200); 
      videosState = videosState.map(v => v.id === id ? { ...v, streaming_enabled: !v.streaming_enabled } : v);
      logAction('UPDATE', 'VIDEOS', `Toggled streaming for video ID: ${id}`);
    }
  },

  // NEW: Dynamic Menu Management
  menus: {
    getAll: async (): Promise<MenuItem[]> => { await delay(300); return menusState.sort((a,b) => a.order - b.order); },
    create: async (menu: Partial<MenuItem>): Promise<MenuItem> => {
      await delay(400);
      const newItem = { id: Math.floor(Math.random() * 10000), isActive: true, order: menusState.length + 1, type: 'link', ...menu } as MenuItem;
      menusState = [...menusState, newItem];
      logAction('CREATE', 'MENUS', `Created menu item: ${newItem.title}`);
      return newItem;
    },
    update: async (id: number, updates: Partial<MenuItem>): Promise<void> => {
      await delay(300);
      menusState = menusState.map(m => m.id === id ? { ...m, ...updates } : m);
      logAction('UPDATE', 'MENUS', `Updated menu item ID: ${id}`);
    },
    delete: async (id: number): Promise<void> => {
      await delay(300);
      menusState = menusState.filter(m => m.id !== id && m.parentId !== id);
      logAction('DELETE', 'MENUS', `Deleted menu item ID: ${id}`);
    },
    reorder: async (ids: number[]): Promise<void> => {
      await delay(300);
      // Not fully implemented for mock
    }
  },

  // NEW: Master Data Management
  branches: {
    getAll: async (): Promise<Branch[]> => { await delay(200); return branchesState; },
    create: async (branch: Partial<Branch>): Promise<Branch> => {
      await delay(300);
      const newItem = { id: Math.floor(Math.random() * 10000), ...branch } as Branch;
      branchesState = [...branchesState, newItem];
      logAction('CREATE', 'BRANCHES', `Created branch: ${newItem.name}`);
      return newItem;
    },
    update: async (id: number, updates: Partial<Branch>) => { 
      branchesState = branchesState.map(b => b.id === id ? {...b, ...updates} : b); 
      logAction('UPDATE', 'BRANCHES', `Updated branch ID: ${id}`);
    },
    delete: async (id: number) => { 
      branchesState = branchesState.filter(b => b.id !== id); 
      logAction('DELETE', 'BRANCHES', `Deleted branch ID: ${id}`);
    }
  },
  
  programs: {
    getAll: async (): Promise<ProgramType[]> => { await delay(200); return programsState; },
    create: async (program: Partial<ProgramType>): Promise<ProgramType> => {
      await delay(300);
      const newItem = { id: Math.floor(Math.random() * 10000), ...program } as ProgramType;
      programsState = [...programsState, newItem];
      logAction('CREATE', 'PROGRAMS', `Created program: ${newItem.name}`);
      return newItem;
    },
    update: async (id: number, updates: Partial<ProgramType>) => { 
      programsState = programsState.map(p => p.id === id ? {...p, ...updates} : p);
      logAction('UPDATE', 'PROGRAMS', `Updated program ID: ${id}`);
    },
    delete: async (id: number) => { 
      programsState = programsState.filter(p => p.id !== id);
      logAction('DELETE', 'PROGRAMS', `Deleted program ID: ${id}`);
    }
  },

  // NEW: Content Management
  blog: {
    getAll: async () => { await delay(300); return blogState; },
    create: async (post: Partial<BlogPost>) => { 
      await delay(400); 
      const newPost = { id: Date.now(), status: 'pending', ...post } as BlogPost;
      blogState.push(newPost);
      logAction('CREATE', 'BLOG', `Created blog post: ${newPost.title}`);
      return newPost;
    },
    update: async (id: number, updates: Partial<BlogPost>) => { 
      await delay(300); 
      blogState = blogState.map(b => b.id === id ? { ...b, ...updates } : b); 
      logAction('UPDATE', 'BLOG', `Updated blog post ID: ${id}`);
    },
    delete: async (id: number) => { 
      await delay(300); 
      blogState = blogState.filter(p => p.id !== id);
      logAction('DELETE', 'BLOG', `Deleted blog post ID: ${id}`);
    }
  },
  store: {
    getAll: async () => storeState,
    create: async (item: any) => { 
      storeState.push({...item, id: Date.now()}); 
      logAction('CREATE', 'STORE', `Created product: ${item.title}`);
    },
    delete: async (id: number) => { 
      storeState = storeState.filter(i => i.id !== id);
      logAction('DELETE', 'STORE', `Deleted product ID: ${id}`);
    }
  },

  // NEW: Settings
  settings: {
    // Return deep copy to prevent reference issues
    get: async (): Promise<SiteSettings> => { 
      await delay(200); 
      return JSON.parse(JSON.stringify(settingsState)); 
    },
    update: async (updates: Partial<SiteSettings>) => { 
      await delay(400); 
      // Deep merge for nested objects to ensure partial updates don't wipe out other keys
      settingsState = {
        ...settingsState,
        ...updates,
        appearance: { ...settingsState.appearance, ...(updates.appearance || {}) },
        seo: { ...settingsState.seo, ...(updates.seo || {}) },
        social: { ...settingsState.social, ...(updates.social || {}) },
        streaming: { ...settingsState.streaming, ...(updates.streaming || {}) },
        system: { ...settingsState.system, ...(updates.system || {}) },
      };
      logAction('UPDATE', 'SETTINGS', 'Global settings updated');
    }
  },

  analytics: {
    getStats: async (): Promise<{ views: StatData[], devices: StatData[], programStats: StatData[], branchStats: StatData[] }> => {
      await delay(600);
      return {
        views: [{ name: 'Mon', value: 4000 }, { name: 'Tue', value: 3000 }, { name: 'Wed', value: 2000 }, { name: 'Thu', value: 2780 }, { name: 'Fri', value: 1890 }, { name: 'Sat', value: 2390 }, { name: 'Sun', value: 3490 }],
        devices: [{ name: 'Mobile', value: 400 }, { name: 'Desktop', value: 300 }, { name: 'Tablet', value: 300 }],
        programStats: [{ name: 'Sunday Service', value: 45000 }, { name: 'Prophetic Conf', value: 32000 }, { name: 'Youth Ministry', value: 15000 }, { name: 'Worship Night', value: 28000 }],
        branchStats: [{ name: 'Main Sanctuary', value: 65000 }, { name: 'Hawassa Branch', value: 25000 }, { name: 'Adama Branch', value: 12000 }, { name: 'Online', value: 18000 }]
      };
    }
  }
};
