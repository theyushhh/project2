
import React, { useState } from 'react';
import ChatArea from './components/ChatArea';
import Sidebar from './components/Sidebar';
import SettingsModal from './components/SettingsModal';
import { SettingsProvider } from './SettingsContext';
import { Settings } from 'lucide-react';

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('General');
  const [openSettings, setOpenSettings] = useState(false);

  return (
    <SettingsProvider>
      <div className="min-h-screen grid grid-cols-12">
        <div className="col-span-3 hidden md:block">
          <Sidebar onOpenSettings={() => setOpenSettings(true)} />
        </div>
        <div className="col-span-12 md:col-span-9">
          <div className="flex items-center justify-between p-4 sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/30 border-b border-white/10">
            <h1 className="text-xl font-semibold">Nova — AI Chat</h1>
            <button
              onClick={() => setOpenSettings(true)}
              className="px-3 py-2 rounded-xl btn-primary text-white flex items-center gap-2"
            >
              <Settings className="w-4 h-4" /> Settings
            </button>
          </div>
          <ChatArea selectedCategory={selectedCategory} />
        </div>
      </div>
      <SettingsModal open={openSettings} onClose={() => setOpenSettings(false)} />
    </SettingsProvider>
  );
}

export default App;
