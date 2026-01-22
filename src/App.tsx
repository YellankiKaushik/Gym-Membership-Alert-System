import Setup from './pages/Setup';
import MemberLookup from './pages/MemberLookup';
import AdminPanel from './pages/Adminpanel';
import { useState } from 'react';

export default function App() {
  const [mode, setMode] = useState<'setup' | 'member' | 'admin'>(
    localStorage.getItem('gymApiUrl') ? 'member' : 'setup'
  );

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#020617] text-white flex flex-col">
      
      {/* HEADER */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-white/10">
        <div className="text-xl font-bold tracking-wide">
          FitZone
        </div>

        <div className="text-sm text-purple-300">
          Kiran · <span className="text-emerald-400">Certified Trainer</span>
        </div>
      </header>

      {/* NAV */}
      <nav className="h-14 flex justify-center gap-6 items-center border-b border-white/10 text-sm">
        <button onClick={() => setMode('member')} className="hover:text-purple-300">
          Member Lookup
        </button>
        <button onClick={() => setMode('admin')} className="hover:text-purple-300">
          Admin Panel
        </button>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-hidden">
        {mode === 'setup' && <Setup onComplete={() => setMode('member')} />}
        {mode === 'member' && <MemberLookup />}
        {mode === 'admin' && <AdminPanel />}
      </main>

      {/* FOOTER */}
      <footer className="h-14 flex items-center justify-center border-t border-white/10 text-xs text-purple-300">
        <a
          href="https://share.google/Fu2K81GXoea6KE8AL"
          target="_blank"
          className="hover:text-white"
        >
          📍 Dilsukhnagar Metro Station · Hyderabad
        </a>
      </footer>
    </div>
  );
}
