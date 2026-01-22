import { useEffect, useState } from 'react';
import Setup from './pages/Setup';
import MemberLookup from './pages/MemberLookup';
import AdminPanel from './pages/AdminPanel';
import { getApiUrl } from './api/gymApi';

type Page = 'setup' | 'lookup' | 'admin';

export default function App() {
  const [page, setPage] = useState<Page>('setup');

  useEffect(() => {
    const apiUrl = getApiUrl();
    if (apiUrl) {
      setPage('lookup');
    }
  }, []);

  // 🔹 SETUP PAGE
  if (page === 'setup') {
    return <Setup onComplete={() => setPage('lookup')} />;
  }

  return (
    <>
      {/* 🔹 Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-white font-semibold tracking-wide">
            Gym Membership System
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setPage('lookup')}
              className={`px-4 py-2 rounded-xl text-sm transition-all ${
                page === 'lookup'
                  ? 'bg-white/20 text-white'
                  : 'bg-white/5 text-purple-300 hover:bg-white/10'
              }`}
            >
              Member Lookup
            </button>
            <button
              onClick={() => setPage('admin')}
              className={`px-4 py-2 rounded-xl text-sm transition-all ${
                page === 'admin'
                  ? 'bg-white/20 text-white'
                  : 'bg-white/5 text-purple-300 hover:bg-white/10'
              }`}
            >
              Admin Panel
            </button>
          </div>
        </div>
      </nav>

      {/* 🔹 PAGE CONTENT */}
      <div className="pt-16">
        {page === 'lookup' && <MemberLookup />}
        {page === 'admin' && <AdminPanel />}
      </div>
    </>
  );
}
