import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function AppLayout() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col text-slate-800">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {!isLanding && <Sidebar />}

        <main className={`flex-1 transition-all p-4 sm:p-6 lg:p-8 ${!isLanding ? 'max-w-5xl' : 'w-full'}`}>
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}

