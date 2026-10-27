import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { RoomStudioPage } from './pages/RoomStudioPage';
import { SavedDesignsPage } from './pages/SavedDesignsPage';
import { ProjectBriefFormPage } from './pages/ProjectBriefFormPage';
import { ClientDashboardPage } from './pages/ClientDashboardPage';
import { DesignerDashboardPage } from './pages/DesignerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Scroll to top helper on navigation (including query param transitions)
const ScrollToTop = () => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, search]);
  return null;
};

// 404 Page
const NotFound = () => (
  <div className="py-32 text-center max-w-md mx-auto px-4 space-y-4">
    <span className="text-[10px] uppercase font-bold tracking-widest text-terracotta">404 Error</span>
    <h1 className="font-editorial text-4xl text-charcoal-900 font-bold">Space Not Found</h1>
    <p className="text-xs text-charcoal-700 leading-relaxed font-light">
      The architectural room or page you are looking for has been moved or does not exist.
    </p>
    <a
      href="/"
      className="inline-block px-5 py-2.5 bg-charcoal-900 text-ivory-100 rounded-sm text-xs font-semibold uppercase tracking-wider"
    >
      Return to Studio
    </a>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-ivory-100 text-charcoal-900 font-sans selection:bg-terracotta/20">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/concept/:slug" element={<RoomStudioPage />} />
              <Route path="/saved-designs" element={<SavedDesignsPage />} />
              <Route path="/project-brief" element={<ProjectBriefFormPage />} />
              <Route path="/client/dashboard" element={<ClientDashboardPage />} />
              <Route path="/designer/dashboard" element={<DesignerDashboardPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
