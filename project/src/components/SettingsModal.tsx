
import React, { useEffect, useMemo, useState } from 'react';
import { useSettings } from '../SettingsContext';
import { X } from 'lucide-react';

const themes: Array<{id: 'midnight' | 'neon' | 'solar' | 'pastel', name: string}> = [
  { id: 'midnight', name: 'Midnight (Dark)' },
  { id: 'neon', name: 'Neon (Cyber)' },
  { id: 'solar', name: 'Solar (Warm)' },
  { id: 'pastel', name: 'Pastel (Soft)' },
];

type Props = { open: boolean; onClose: () => void };

export default function SettingsModal({ open, onClose }: Props) {
  const { settings, setSettings } = useSettings();
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [theme, setTheme] = useState(settings.theme);
  const [pitch, setPitch] = useState(settings.pitch);
  const [voiceURI, setVoiceURI] = useState(settings.voiceURI || '');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const updateVoices = () => setVoices(window.speechSynthesis.getVoices());
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }, []);

  useEffect(() => {
    if (!open) return;
    setApiKey(settings.apiKey);
    setTheme(settings.theme);
    setPitch(settings.pitch);
    setVoiceURI(settings.voiceURI || '');
  }, [open]);

  const save = () => {
    setSettings({ apiKey, theme, pitch, voiceURI });
    try { navigator.vibrate?.(20); } catch {}
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-lg rounded-2xl p-6 card shadow-xl">
        <button onClick={onClose} className="absolute right-4 top-4 opacity-70 hover:opacity-100">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-semibold mb-4">Settings</h2>

        <label className="block text-sm mb-2">Gemini API Key</label>
        <input
          type="password"
          className="w-full mb-4 p-3 rounded-lg bg-white/10 border border-white/20 outline-none"
          placeholder="Paste your API key"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
        />

        <label className="block text-sm mb-2">Theme</label>
        <select
          className="w-full mb-4 p-3 rounded-lg bg-white/10 border border-white/20"
          value={theme}
          onChange={e => setTheme(e.target.value as any)}
        >
          {themes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>

        <label className="block text-sm mb-2">Voice</label>
        <select
          className="w-full mb-4 p-3 rounded-lg bg-white/10 border border-white/20"
          value={voiceURI}
          onChange={e => setVoiceURI(e.target.value)}
        >
          <option value="">Default</option>
          {voices.map(v => <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>)}
        </select>

        <label className="block text-sm mb-2">Voice Pitch: {pitch.toFixed(2)}</label>
        <input
          type="range" min={0} max={2} step={0.01} value={pitch}
          onChange={e => setPitch(parseFloat(e.target.value))}
          className="w-full mb-6"
        />

        <button onClick={save} className="btn-primary text-white px-4 py-2 rounded-xl shadow hover:scale-[1.02] active:scale-95">
          Save
        </button>
      </div>
    </div>
  );
}
