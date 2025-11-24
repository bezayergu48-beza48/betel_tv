
import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/mockApi';
import { MenuItem, SiteSettings } from '../src/types';
import { 
  Menu, X, ChevronDown, Shield, LogOut,
} from 'lucide-react';
import * as Icons from 'lucide-react';

const DynamicIcon = ({ name, size = 16, className }: { name?: string, size?: number, className?: string }) => {
  if (!name) return null;
  const IconComponent = (Icons as any)[name];
  return IconComponent ? <IconComponent size={size} className={className} /> : null;
};

export const Layout = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme(); // Use theme context
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [menus, siteSettings] = await Promise.all([
        api.menus.getAll(),
        api.settings.get()
      ]);
      setMenuItems(menus);
      setSettings(siteSettings);
    };
    fetchData();

    const handleScroll = () => { setIsScrolled(window.scrollY > 50); };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const rootMenuItems = menuItems.filter(m => !m.parentId && m.isActive).sort((a,b) => a.order - b.order);
  const getChildren = (parentId: number) => menuItems.filter(m => m.parentId === parentId && m.isActive).sort((a,b) => a.order - b.order);

  return (
    <div 
      className="min-h-screen flex flex-col font-sans transition-colors duration-300"
      style={{
        backgroundColor: 'var(--bg-main)',
        color: 'var(--text-main)',
        fontFamily: 'var(--font-main)'
      }}
    >
      {/* Dynamic Navigation */}
      <nav 
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled || isMobileMenuOpen ? 'backdrop-blur-sm shadow-lg border-b' : 'bg-gradient-to-b from-black/90 to-transparent'
        }`}
        style={{
          backgroundColor: isScrolled || isMobileMenuOpen ? 'var(--bg-main)' : 'transparent',
          borderColor: isScrolled ? 'var(--border-color)' : 'transparent'
        }}
      >
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div className="flex items-center gap-8 xl:gap-12 flex-1">
              <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
                 <div 
                   className="w-9 h-9 rounded flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-105 transition-transform text-white"
                   style={{ backgroundColor: 'var(--color-primary)' }}
                 >
                   {settings?.siteName.charAt(0) || 'B'}
                 </div>
                 <span className="text-xl md:text-2xl font-bold tracking-wider hidden sm:block">
                   {settings?.siteName || 'BETEL_TV'}
                 </span>
              </Link>

              {/* Dynamic Desktop Links */}
              <div className="hidden lg:flex items-center space-x-1">
                {rootMenuItems.map(item => {
                  const children = getChildren(item.id);
                  const hasChildren = children.length > 0;
                  const isMegaMenu = item.type === 'mega_menu';

                  return (
                    <div key={item.id} className="group relative px-3 py-6">
                      <Link 
                        to={!hasChildren ? item.url : '#'} 
                        className="flex items-center gap-1 text-sm font-medium transition-colors opacity-80 hover:opacity-100 hover:text-[var(--color-primary)]"
                      >
                        <DynamicIcon name={item.icon} />
                        {item.title} 
                        {hasChildren && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />}
                      </Link>
                      
                      {hasChildren && (
                        isMegaMenu ? (
                           <div className="absolute top-full left-0 w-[600px] border rounded-lg shadow-2xl p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 grid grid-cols-3 gap-6 z-50"
                             style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                           >
                              <div className="col-span-3 grid grid-cols-3 gap-6">
                                {children.map(child => (
                                  <Link key={child.id} to={child.url} className="block text-sm opacity-70 hover:opacity-100 hover:translate-x-1 transition-transform mb-2 hover:text-[var(--color-primary)]">
                                    {child.title}
                                  </Link>
                                ))}
                              </div>
                           </div>
                        ) : (
                          <div className="absolute top-full left-0 w-56 border rounded-lg shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50"
                             style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                          >
                             {children.map(child => (
                               <Link key={child.id} to={child.url} className="block px-4 py-2 text-sm opacity-70 hover:opacity-100 hover:bg-[var(--bg-main)]">
                                 {child.title}
                               </Link>
                             ))}
                          </div>
                        )
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Actions: Auth */}
            <div className="hidden lg:flex items-center gap-5 xl:gap-7 flex-shrink-0">
              {user ? (
                <div className="group relative flex items-center gap-3">
                  <div className="text-right hidden xl:block">
                     <p className="text-sm font-bold leading-none">{user.name}</p>
                     <p className="text-[10px] opacity-60 uppercase tracking-wide mt-1">{user.role}</p>
                  </div>
                  <img src={user.avatar} alt="Profile" className="w-9 h-9 rounded-full border border-zinc-700 cursor-pointer hover:border-[var(--color-primary)] transition" />
                  
                  {/* Auth Dropdown */}
                  <div className="absolute top-full right-0 mt-4 w-56 rounded-lg shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border z-50"
                     style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                  >
                    {['admin', 'super_admin', 'editor', 'moderator', 'pastor'].includes(user.role) && (
                      <Link to="/admin" className="block px-4 py-2 text-sm opacity-80 hover:opacity-100 hover:bg-[var(--bg-main)] flex items-center gap-2">
                        <Shield size={16} style={{ color: 'var(--color-primary)' }} /> Admin Dashboard
                      </Link>
                    )}
                    <button onClick={logout} className="w-full text-left px-4 py-2 text-sm opacity-80 hover:opacity-100 hover:bg-[var(--bg-main)] flex items-center gap-2 mt-1">
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="px-5 py-2 rounded-full text-sm font-bold transition text-white"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Toggle */}
            <div className="lg:hidden flex items-center gap-4">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="opacity-80 hover:opacity-100 p-1">
                {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t p-4 max-h-[85vh] overflow-y-auto"
               style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}
          >
             {rootMenuItems.map(item => {
               const children = getChildren(item.id);
               if (children.length > 0) {
                 return (
                   <div key={item.id} className="mb-4">
                      <div className="font-bold opacity-90 mb-2">{item.title}</div>
                      <div className="pl-4 space-y-2 border-l" style={{ borderColor: 'var(--border-color)' }}>
                        {children.map(child => (
                           <Link key={child.id} to={child.url} className="block opacity-70 py-1" onClick={() => setIsMobileMenuOpen(false)}>
                             {child.title}
                           </Link>
                        ))}
                      </div>
                   </div>
                 );
               }
               return (
                 <Link key={item.id} to={item.url} className="block text-lg font-medium opacity-90 py-3 border-b" 
                       style={{ borderColor: 'var(--border-color)' }}
                       onClick={() => setIsMobileMenuOpen(false)}>
                   {item.title}
                 </Link>
               );
             })}
          </div>
        )}
      </nav>

      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="py-12 border-t" style={{ backgroundColor: '#000', borderColor: 'var(--border-color)' }}>
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
           <div className="flex justify-center items-center gap-2 mb-4">
             <div className="w-8 h-8 rounded flex items-center justify-center font-bold text-white" style={{ backgroundColor: 'var(--color-primary)' }}>B</div>
             <span className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>{settings?.siteName}</span>
           </div>
           <p className="mb-4">{settings?.tagline}</p>
           <p>{settings?.footerText}</p>
        </div>
      </footer>
    </div>
  );
};
