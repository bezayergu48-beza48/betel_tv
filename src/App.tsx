
import React, { PropsWithChildren } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { VideoPage } from './pages/VideoPage';
import { CategoryPage } from './pages/CategoryPage';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { Store } from './pages/Store';
import { Blog } from './pages/Blog';
import { Contact } from './pages/Contact';
import { BranchPage } from './pages/BranchPage';
import { MinistryPage } from './pages/MinistryPage';
import { UserRole } from './types';

// Protected Route wrapper
const ProtectedRoute = ({ children, requireAdmin }: PropsWithChildren<{ requireAdmin?: boolean }>) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return null;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Allow Pastors/Editors/Moderators to access Admin Panel but restrict within it using RBAC
  if (requireAdmin && user.role === UserRole.MEMBER) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        
        {/* Main Pages */}
        <Route path="store" element={<Store />} />
        <Route path="blog" element={<Blog />} />
        <Route path="contact" element={<Contact />} />
        
        {/* Dynamic Pages */}
        <Route path="branch/:id" element={<BranchPage />} />
        <Route path="ministry/:type" element={<MinistryPage />} />

        {/* Module Routes */}
        <Route path="sermons" element={
          <CategoryPage 
            title="Sermons" 
            programTypeId={1} 
            description="Explore deep spiritual teachings and Sunday services from Prophet Mesfin Beshu." 
          />
        } />
        <Route path="conferences" element={
          <CategoryPage 
            title="Conferences" 
            programTypeId={2} 
            description="Experience the power of God in our major prophetic gatherings and events." 
          />
        } />
        <Route path="worship" element={
          <CategoryPage 
            title="Worship" 
            programTypeId={4} 
            description="Immerse yourself in moments of deep worship and praise." 
          />
        } />
        <Route path="testimony" element={
          <CategoryPage 
            title="Testimonies" 
            programTypeId={5} 
            description="Witness the miraculous works of God in the lives of His people." 
          />
        } />
        <Route path="deliverance" element={
          <CategoryPage 
            title="Deliverance" 
            programTypeId={6} 
            description="Powerful deliverance sessions breaking chains and setting captives free." 
          />
        } />
        <Route path="miracle" element={
          <CategoryPage 
            title="Miracles" 
            programTypeId={7} 
            description="Signs and wonders demonstrating the power of the Holy Spirit." 
          />
        } />
        <Route path="teaching" element={
          <CategoryPage 
            title="Bible Teaching" 
            programTypeId={8} 
            description="In-depth biblical exposition and doctrinal foundations." 
          />
        } />
        <Route path="getchild" element={
          <CategoryPage 
            title="Gift of Child" 
            programTypeId={9} 
            description="Prophetic prayers and testimonies for those trusting God for the fruit of the womb." 
          />
        } />
        <Route path="charity" element={
          <CategoryPage 
            title="Charity & Outreach" 
            programTypeId={10} 
            description="Betel's mission to support the needy, orphans, and community development." 
          />
        } />

        <Route path="watch/:id" element={<VideoPage />} />
        
        {/* Admin Routes */}
        <Route path="admin" element={
          <ProtectedRoute requireAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
};

export default function App() {
  return (
    <HashRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </HashRouter>
  );
}
