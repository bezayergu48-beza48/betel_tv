
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  EDITOR = 'editor',
  MODERATOR = 'moderator',
  PASTOR = 'pastor',
  MEMBER = 'member',
  GUEST = 'guest'
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status: 'active' | 'inactive' | 'banned';
  password?: string; // Only used for creating/updating
}

export interface Branch {
  id: number;
  name: string;
  location: string;
  map_url?: string;
  contact_info?: string;
}

export interface ProgramType {
  id: number;
  name: string;
  description?: string;
}

export interface Video {
  id: number;
  title: string;
  program_type_id: number;
  event_name: string;
  branch_id: number;
  preacher: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  date: string;
  duration: number; // in seconds
  tags: string[];
  uploader_id: number;
  approved: boolean;
  streaming_enabled: boolean;
  views: number;
  version?: string;
}

export interface StatData {
  name: string;
  value: number;
}

export interface VideoFilterParams {
  year?: number;
  month?: number;
  day?: number;
  dayOfWeek?: number;
  program_type_id?: number;
  branch_id?: number;
  search?: string;
  preacher?: string;
}

// --- NEW TYPES FOR ADMIN CMS ---

export interface MenuItem {
  id: number;
  title: string;
  url: string;
  parentId?: number;
  icon?: string; // lucide icon name
  order: number;
  isActive: boolean;
  type: 'link' | 'dropdown' | 'mega_menu';
  children?: MenuItem[];
}

export type BlogPostStatus = 'draft' | 'pending' | 'published' | 'archived';

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  image: string;
  category: string;
  tags: string[];
  status: BlogPostStatus;
}

export interface Product {
  id: number;
  title: string;
  category: 'Books' | 'Media' | 'Apparel';
  price: number;
  image: string;
  rating: number;
  stock?: number;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logoUrl?: string;
  primaryColor: string;
  enableLiveStream: boolean;
  maintenanceMode: boolean;
  contactEmail: string;
  footerText: string;
  // Advanced Modules
  appearance: {
    theme: 'light' | 'dark' | 'system';
    accentColor: string;
    fontFamily: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
  };
  social: {
    facebook: string;
    youtube: string;
    instagram: string;
    twitter: string;
  };
  streaming: {
    serverUrl: string;
    streamKey: string;
    cdnProvider: 'cloudflare' | 'aws' | 'none';
    autoRecord: boolean;
  };
  system: {
    version: string;
    enableRegistration: boolean;
    maxUploadSize: number; // MB
  };
}

export type ModuleType = 'menus' | 'videos' | 'blog' | 'store' | 'users' | 'settings' | 'branches' | 'programs' | 'audit' | 'system';
export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'approve' | 'export' | 'backup';

export interface RolePermissions {
  [module: string]: PermissionAction[];
}

export interface AuditLogEntry {
  id: number;
  userId: number;
  userName: string;
  userRole: string;
  action: string;
  module: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}
