import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { DemoNotice } from './components/common/DemoNotice';
import { Footer } from './components/common/Footer';
import { BookingRequestModal } from './components/modals/BookingRequestModal';
import { AuthModal } from './components/modals/AuthModal';
import { OfflineStatus } from './components/common/OfflineStatus';

// Pages
import { HomePage } from './pages/HomePage';
import { DestinationsPage } from './pages/DestinationsPage';
import { TransportPage } from './pages/TransportPage';
import { HotelsPage } from './pages/HotelsPage';
import { ToursPage } from './pages/ToursPage';
import { GuidesPage } from './pages/GuidesPage';
import { SmartPlannerPage } from './pages/SmartPlannerPage';
import { BudgetCalculatorPage } from './pages/BudgetCalculatorPage';
import { HiddenUzbekistanPage } from './pages/HiddenUzbekistanPage';
import { AboutContactPage } from './pages/AboutContactPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { PartnerDashboardPage } from './pages/PartnerDashboardPage';

export const App: React.FC = () => {
  const { currentPage, toastMessage } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'destinations':
        return <DestinationsPage />;
      case 'transport':
        return <TransportPage />;
      case 'hotels':
        return <HotelsPage />;
      case 'tours':
        return <ToursPage />;
      case 'guides':
        return <GuidesPage />;
      case 'planner':
        return <SmartPlannerPage />;
      case 'budget':
        return <BudgetCalculatorPage />;
      case 'hidden':
        return <HiddenUzbekistanPage />;
      case 'about':
        return <AboutContactPage />;
      case 'dashboard':
        return <UserDashboardPage />;
      case 'admin':
        return <AdminDashboardPage />;
      case 'partner':
        return <PartnerDashboardPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-slate-900">
      {/* Top Navbar */}
      <Navbar />

      {/* Demo Mode Notice */}
      <DemoNotice />

      {/* Main Dynamic View */}
      <main className="flex-1 animate-fade-in">
        {renderPage()}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Booking Request Modal */}
      <BookingRequestModal />

      {/* Global Auth Modal */}
      <AuthModal />

      {/* Offline Status Listener */}
      <OfflineStatus />

      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#124C3A] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#C8A66A]/40 text-xs font-semibold flex items-center gap-3 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-[#C8A66A] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default App;
