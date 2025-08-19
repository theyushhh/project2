
import React, { useEffect, useRef, useState } from 'react';
import { Send, Mic } from 'lucide-react';
import { useSettings } from '../SettingsContext';
import { generateWithGemini } from '../lib.gemini';
import { motion, AnimatePresence } from 'framer-motion';

type Msg = { id: string; role: 'user' | 'model'; text: string; ts: number };

export default function ChatArea({ selectedCategory }: { selectedCategory: string }) {
  const { settings } = useSettings();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.pitch = settings.pitch ?? 1;
    if (settings.voiceURI) {
      const voice = window.speechSynthesis.getVoices().find(v => v.voiceURI === settings.voiceURI);
      if (voice) u.voice = voice;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    if (!settings.apiKey) {
      alert('Please set your Gemini API key in Settings.');
      return;
    }
    try { navigator.vibrate?.([10, 30, 10]); } catch {}
    const userMsg: Msg = { id: crypto.randomUUID(), role: 'user', text: trimmed, ts: Date.now() };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const history = [...messages, userMsg].map(m => ({ role: m.role, parts: m.text }));
      const modelText = await generateWithGemini(settings.apiKey, history as any);
      const modelMsg: Msg = { id: crypto.randomUUID(), role: 'model', text: modelText || '...', ts: Date.now() };
      setMessages(m => [...m, modelMsg]);
      speak(modelMsg.text);
    } catch (e:any) {
      setMessages(m => [...m, { id: crypto.randomUUID(), role: 'model', text: 'Error: ' + e.message, ts: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {messages.map(m => (
            <motion.div
              key={m.id}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`max-w-[80%] p-3 rounded-2xl shadow card ${m.role==='user' ? 'ml-auto' : 'mr-auto'}`}
            >
              <div className="text-xs text-muted mb-1">{new Date(m.ts).toLocaleTimeString()}</div>
              <div className="whitespace-pre-wrap">{m.text}</div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-24 h-10 rounded-xl card flex items-center justify-center text-muted"
          >
            typing…
          </motion.div>
        )}
        <div ref={endRef} />
      </div>

      <div className="p-4">
        <div className="flex gap-2">
          <input
            className="flex-1 p-3 rounded-xl bg-white/10 border border-white/20 outline-none"
            placeholder="Type your message…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKey}
          />
          <button onClick={send} className="btn-primary text-white rounded-xl px-4 py-2 flex items-center gap-2 active:scale-95">
            <Send className="w-4 h-4" /> Send
          </button>
        </div>
        <div className="text-xs text-muted mt-2">Responses will be read aloud. Adjust voice pitch & theme in Settings.</div>
      </div>
    </div>
  );
}
