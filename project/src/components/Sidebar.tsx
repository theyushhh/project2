
import React from 'react';
import { Sparkles, Settings } from 'lucide-react';

export default function Sidebar({ onOpenSettings }: { onOpenSettings: () => void }) {
  return (
    <aside className="h-screen p-4 card border-r border-white/10 sticky top-0">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-xl btn-primary" />
        <div>
          <div className="font-semibold">Nova</div>
          <div className="text-xs text-muted">Futuristic Chat</div>
        </div>
      </div>

      <nav className="space-y-2">
        {[
          'General',
          'Coding',
          'Content',
          'Research',
          'Translate'
        ].map(item => (
          <button
            key={item}
            className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {item}
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6">
        <button
          onClick={onOpenSettings}
          className="w-full p-3 rounded-xl border border-white/10 hover:bg-white/10 flex items-center gap-2"
        >
          <Settings className="w-4 h-4" /> Settings
        </button>
      </div>
    </aside>
  );
}
