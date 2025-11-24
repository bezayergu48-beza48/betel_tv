
import { Video, User, UserRole, Branch, ProgramType, MenuItem, SiteSettings, BlogPost, Product, RolePermissions, AuditLogEntry, ContactMessage } from './types';

export const MOCK_USER: User = {
  id: 1,
  name: "Super Admin",
  email: "admin@betel.tv",
  role: UserRole.SUPER_ADMIN,
  avatar: "https://ui-avatars.com/api/?name=Super+Admin&background=dc2626&color=fff",
  status: 'active'
};

// Permission Matrix
export const PERMISSION_MATRIX: Record<UserRole, RolePermissions> = {
  [UserRole.SUPER_ADMIN]: {
    menus: ['create', 'read', 'update', 'delete'],
    videos: ['create', 'read', 'update', 'delete', 'approve'],
    blog: ['create', 'read', 'update', 'delete', 'approve'],
    store: ['create', 'read', 'update', 'delete'],
    users: ['create', 'read', 'update', 'delete'],
    settings: ['read', 'update'],
    branches: ['create', 'read', 'update', 'delete'],
    programs: ['create', 'read', 'update', 'delete'],
    audit: ['read', 'export'],
    system: ['backup'],
    messages: ['read', 'reply', 'delete']
  },
  [UserRole.ADMIN]: {
    menus: ['create', 'read', 'update', 'delete'],
    videos: ['create', 'read', 'update', 'delete', 'approve'],
    blog: ['create', 'read', 'update', 'delete', 'approve'],
    store: ['create', 'read', 'update', 'delete'],
    users: ['create', 'read', 'update', 'delete'], 
    settings: ['read', 'update'],
    branches: ['create', 'read', 'update', 'delete'],
    programs: ['create', 'read', 'update', 'delete'],
    audit: ['read'],
    system: ['backup'],
    messages: ['read', 'reply', 'delete']
  },
  [UserRole.EDITOR]: {
    menus: ['read'],
    videos: ['create', 'read', 'update'], // Can upload/edit own
    blog: ['create', 'read', 'update'], // Can write/edit own
    store: ['read'],
    users: [], // Cannot manage users
    settings: [], // Cannot manage settings
    branches: ['read'],
    programs: ['read'],
    audit: [],
    system: [],
    messages: []
  },
  [UserRole.MODERATOR]: {
    menus: ['read'],
    videos: ['read', 'approve'],
    blog: ['read', 'approve'],
    store: ['read'],
    users: ['read'], // Can view list but not edit
    settings: [],
    branches: ['read'],
    programs: ['read'],
    audit: [],
    system: [],
    messages: ['read', 'reply']
  },
  [UserRole.PASTOR]: {
    menus: ['read'],
    videos: ['read'], // Can view analytics/library
    blog: ['read'],
    store: ['read'],
    users: ['read'], 
    settings: ['read'],
    branches: ['read'],
    programs: ['read'],
    audit: [],
    system: [],
    messages: ['read', 'reply']
  },
  [UserRole.MEMBER]: {
    menus: ['read'],
    videos: ['read'],
    blog: ['read'],
    store: ['read'],
    users: [],
    settings: [],
    branches: ['read'],
    programs: ['read'],
    audit: [],
    system: [],
    messages: []
  },
  [UserRole.GUEST]: {
    menus: ['read'],
    videos: ['read'],
    blog: ['read'],
    store: ['read'],
    users: [],
    settings: [],
    branches: ['read'],
    programs: ['read'],
    audit: [],
    system: [],
    messages: []
  }
};

// Initial Data Seeds
export const BRANCHES: Branch[] = [
  { id: 1, name: "Addis Ababa Main", location: "Bole, Addis Ababa" },
  { id: 2, name: "Hawassa Branch", location: "Hawassa City" },
  { id: 3, name: "Adama Branch", location: "Adama City" }
];

export const PROGRAM_TYPES: ProgramType[] = [
  { id: 1, name: "Sermons" },
  { id: 2, name: "Conferences" },
  { id: 3, name: "Youth Ministry" },
  { id: 4, name: "Worship" },
  { id: 5, name: "Testimonies" },
  { id: 6, name: "Deliverance" },
  { id: 7, name: "Miracles" },
  { id: 8, name: "Teaching" },
  { id: 9, name: "Gift of Child" },
  { id: 10, name: "Charity" }
];

export const INITIAL_SETTINGS: SiteSettings = {
  siteName: "BETEL_TV",
  tagline: "Prophetic Ministry & Global Outreach",
  primaryColor: "#dc2626",
  enableLiveStream: true,
  maintenanceMode: false,
  contactEmail: "info@beteltv.org",
  footerText: "© 2024 Betefage International Church. All rights reserved.",
  // New Advanced Settings
  appearance: {
    theme: 'dark',
    accentColor: '#dc2626',
    fontFamily: 'Inter',
  },
  seo: {
    metaTitle: 'Betel_TV | Betefage International Church',
    metaDescription: 'Watch live sermons, worship, and prophetic ministry from Prophet Mesfin Beshu.',
    keywords: 'church, prophetic, ethiopia, worship, live, miracle',
  },
  social: {
    facebook: 'https://facebook.com/betelfage',
    youtube: 'https://youtube.com/beteltv',
    instagram: 'https://instagram.com/betelfage',
    twitter: 'https://twitter.com/betelfage',
  },
  streaming: {
    serverUrl: 'rtmp://live.betel.tv/app',
    streamKey: 'live_xxxx_yyyy_zzzz',
    cdnProvider: 'cloudflare',
    autoRecord: true,
  },
  system: {
    version: '1.0.0',
    enableRegistration: true,
    maxUploadSize: 500,
  }
};

// Dynamic Menu Structure
export const INITIAL_MENUS: MenuItem[] = [
  { id: 1, title: "Home", url: "/", order: 1, isActive: true, type: 'link' },
  { id: 2, title: "Programs", url: "#", order: 2, isActive: true, type: 'mega_menu' },
  { id: 3, title: "Explore", url: "/", order: 3, isActive: true, type: 'link', icon: 'Search' },
  { id: 4, title: "Ministries", url: "#", order: 4, isActive: true, type: 'dropdown' },
  { id: 5, title: "Branches", url: "#", order: 5, isActive: true, type: 'dropdown' },
  { id: 6, title: "Store", url: "/store", order: 6, isActive: true, type: 'link', icon: 'ShoppingCart' },
  { id: 7, title: "Blog", url: "/blog", order: 7, isActive: true, type: 'link' },
  { id: 8, title: "Contact", url: "/contact", order: 8, isActive: true, type: 'link', icon: 'Mail' },
  
  // Submenus for Programs (ParentId: 2)
  { id: 21, title: "Sermons", url: "/sermons", parentId: 2, order: 1, isActive: true, type: 'link' },
  { id: 22, title: "Conferences", url: "/conferences", parentId: 2, order: 2, isActive: true, type: 'link' },
  { id: 23, title: "Worship", url: "/worship", parentId: 2, order: 3, isActive: true, type: 'link' },
  { id: 24, title: "Deliverance", url: "/deliverance", parentId: 2, order: 4, isActive: true, type: 'link' },
  { id: 25, title: "Miracles", url: "/miracle", parentId: 2, order: 5, isActive: true, type: 'link' },
  { id: 26, title: "Testimonies", url: "/testimony", parentId: 2, order: 6, isActive: true, type: 'link' },
  { id: 27, title: "Teaching", url: "/teaching", parentId: 2, order: 7, isActive: true, type: 'link' },
  { id: 28, title: "Gift of Child", url: "/getchild", parentId: 2, order: 8, isActive: true, type: 'link' },
  { id: 29, title: "Charity", url: "/charity", parentId: 2, order: 9, isActive: true, type: 'link' },

  // Submenus for Ministries (ParentId: 4)
  { id: 41, title: "Charity / Giving", url: "/charity", parentId: 4, order: 1, isActive: true, type: 'link' },
  { id: 42, title: "Prayer Guides", url: "/ministry/prayer-guides", parentId: 4, order: 2, isActive: true, type: 'link' },
  { id: 43, title: "Special Programs", url: "/ministry/special-programs", parentId: 4, order: 3, isActive: true, type: 'link' },

  // Submenus for Branches (ParentId: 5)
  { id: 51, title: "Addis Ababa", url: "/branch/1", parentId: 5, order: 1, isActive: true, type: 'link' },
  { id: 52, title: "Hawassa", url: "/branch/2", parentId: 5, order: 2, isActive: true, type: 'link' },
  { id: 53, title: "Adama", url: "/branch/3", parentId: 5, order: 3, isActive: true, type: 'link' },
];

export const MOCK_VIDEOS: Video[] = [
  {
    id: 101,
    title: "The Power of Faith - Special Sunday",
    program_type_id: 1,
    event_name: "Weekly Service",
    branch_id: 1,
    preacher: "Prophet Mesfin Beshu",
    description: "An inspiring message about holding onto faith during difficult times. Prophet Mesfin explores the depths of spiritual endurance.",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnail_url: "https://picsum.photos/id/1015/800/450",
    date: "2023-10-15",
    duration: 5400,
    tags: ["faith", "healing", "sunday"],
    uploader_id: 1,
    approved: true,
    streaming_enabled: true,
    views: 12500
  },
  {
    id: 102,
    title: "Prophetic Impartation Night",
    program_type_id: 2,
    event_name: "Annual Conference",
    branch_id: 1,
    preacher: "Prophet Mesfin Beshu",
    description: "A powerful night of deliverance and prophetic declaration.",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnail_url: "https://picsum.photos/id/1016/800/450",
    date: "2023-11-02",
    duration: 7200,
    tags: ["prophecy", "miracle", "night"],
    uploader_id: 1,
    approved: true,
    streaming_enabled: true,
    views: 34000
  },
  {
    id: 103,
    title: "Worship & Praise Experience",
    program_type_id: 4,
    event_name: "Friday Worship",
    branch_id: 2,
    preacher: "Betel Worship Team",
    description: "Deep worship session led by the Betefage choir.",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnail_url: "https://picsum.photos/id/1025/800/450",
    date: "2023-10-20",
    duration: 3600,
    tags: ["worship", "music", "praise"],
    uploader_id: 2,
    approved: true,
    streaming_enabled: true,
    views: 8900
  },
  {
    id: 106,
    title: "Miraculous Healing from Cancer",
    program_type_id: 7,
    event_name: "Miracle Service",
    branch_id: 1,
    preacher: "Sister Sarah",
    description: "A touching testimony of how God moved in a mighty way.",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    thumbnail_url: "https://picsum.photos/id/1062/800/450",
    date: "2024-01-10",
    duration: 1200,
    tags: ["miracle", "healing", "cancer"],
    uploader_id: 1,
    approved: true,
    streaming_enabled: true,
    views: 45000
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "Upcoming Prophetic Conference 2024",
    excerpt: "Join us for 3 days of powerful impartation with Prophet Mesfin Beshu. Registration details inside.",
    content: "Full details about the conference will be posted soon...",
    date: "Mar 15, 2024",
    author: "Admin",
    image: "https://picsum.photos/id/1018/800/400",
    category: "Events",
    tags: ["conference", "prophetic"],
    status: 'published'
  },
  {
    id: 2,
    title: "5 Keys to Spiritual Breakthrough",
    excerpt: "Discover the biblical principles that unlock heavens gates over your life and family.",
    content: "Full teaching content goes here...",
    date: "Mar 10, 2024",
    author: "Pastor Yohannes",
    image: "https://picsum.photos/id/1015/800/400",
    category: "Teaching",
    tags: ["teaching", "faith"],
    status: 'published'
  },
  {
    id: 3,
    title: "Charity Drive Success",
    excerpt: "We fed over 500 families.",
    content: "Report on the charity event...",
    date: "Feb 28, 2024",
    author: "Editor",
    image: "https://picsum.photos/id/1060/800/400",
    category: "Charity",
    tags: ["charity"],
    status: 'pending' // pending approval
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    title: "The Power of Prophecy",
    category: "Books",
    price: 19.99,
    image: "https://picsum.photos/id/24/400/500",
    rating: 5,
    stock: 50
  },
  {
    id: 2,
    title: "Worship Anthem Vol. 1",
    category: "Media",
    price: 14.99,
    image: "https://picsum.photos/id/39/400/500",
    rating: 4,
    stock: 100
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  { id: 1, userId: 1, userName: 'Super Admin', userRole: 'super_admin', action: 'LOGIN', module: 'AUTH', details: 'User logged in successfully', timestamp: new Date(Date.now() - 86400000).toISOString(), ipAddress: '192.168.1.1' },
  { id: 2, userId: 1, userName: 'Super Admin', userRole: 'super_admin', action: 'UPDATE', module: 'SETTINGS', details: 'Updated Site Appearance Theme to Dark', timestamp: new Date(Date.now() - 85000000).toISOString(), ipAddress: '192.168.1.1' },
  { id: 3, userId: 3, userName: 'Media Editor', userRole: 'editor', action: 'UPLOAD', module: 'VIDEOS', details: 'Uploaded new video: "Sunday Service"', timestamp: new Date(Date.now() - 40000000).toISOString(), ipAddress: '192.168.1.45' },
];

export const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    subject: "Prayer Request",
    message: "Please pray for my mother who is battling sickness. We are believing for a miracle.",
    status: "unread",
    date: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 2,
    name: "David Abate",
    email: "david.a@email.com",
    subject: "Testimony",
    message: "I wanted to share that after the last conference, I received a job offer I have been praying for!",
    status: "read",
    date: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 3,
    name: "Michael Kebede",
    email: "mike@email.com",
    subject: "General Inquiry",
    message: "What time does the youth service start on Saturdays?",
    status: "replied",
    date: new Date(Date.now() - 259200000).toISOString(),
    reply: "Hi Michael, Youth service starts at 3:00 PM every Saturday."
  }
];
