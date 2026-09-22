import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DiscordModal } from './components/DiscordModal';
import { ScrollToTop } from './components/ScrollToTop';
import { PageTransition } from './components/PageTransition';
import { HomePage } from './pages/HomePage';
import { FeaturesPage } from './pages/FeaturesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { PluginDetailPage } from './pages/PluginDetailPage';
import { LoginPage } from './pages/LoginPage';
import { OwnerPanelPage } from './pages/OwnerPanelPage';
import { NotFoundPage } from './pages/NotFoundPage';

function AppContent() {
  const [discordModalOpen, setDiscordModalOpen] = useState(false);
  const location = useLocation();
  const isAuthOrAdminPage = location.pathname === '/login' || location.pathname === '/owner' || location.pathname === '/admin';

  const handleOpenDiscord = () => {
    setDiscordModalOpen(true);
  };

  const handleCloseDiscord = () => {
    setDiscordModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#FFFFFF] flex flex-col font-sans selection:bg-white/20 selection:text-white relative overflow-x-hidden">
      {/* Fixed Top Navigation Header */}
      <Navbar onOpenDiscord={handleOpenDiscord} />

      {/* Main Content Area with Animated Glow Route Transitions */}
      <main className="flex-1 flex flex-col relative z-10">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <HomePage onOpenDiscord={handleOpenDiscord} />
                </PageTransition>
              }
            />
            <Route
              path="/features"
              element={
                <PageTransition>
                  <FeaturesPage onOpenDiscord={handleOpenDiscord} />
                </PageTransition>
              }
            />
            <Route
              path="/projects"
              element={
                <PageTransition>
                  <ProjectsPage onOpenDiscord={handleOpenDiscord} />
                </PageTransition>
              }
            />
            
            {/* Owner Login & Admin Panel */}
            <Route
              path="/login"
              element={
                <PageTransition>
                  <LoginPage />
                </PageTransition>
              }
            />
            <Route
              path="/owner"
              element={
                <PageTransition>
                  <OwnerPanelPage />
                </PageTransition>
              }
            />
            <Route
              path="/admin"
              element={
                <PageTransition>
                  <OwnerPanelPage />
                </PageTransition>
              }
            />

            {/* Dynamic Plugin Page: e.g. /fluxrecording */}
            <Route
              path="/:slug"
              element={
                <PageTransition>
                  <PluginDetailPage onOpenDiscord={handleOpenDiscord} />
                </PageTransition>
              }
            />

            {/* 404 Fallback */}
            <Route
              path="*"
              element={
                <PageTransition>
                  <NotFoundPage />
                </PageTransition>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Global Footer (rendered on Home page and all public pages) */}
      {!isAuthOrAdminPage && <Footer onOpenDiscord={handleOpenDiscord} />}

      {/* Global Discord Community Modal */}
      <DiscordModal isOpen={discordModalOpen} onClose={handleCloseDiscord} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}
