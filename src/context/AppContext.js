import React, { createContext, useContext, useEffect, useState } from 'react';
import { COURSES, REELS, API_BASE, CMS_BASE } from '../constants/data';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [enrolled, setEnrolled] = useState([]);
  const [likedReels, setLikedReels] = useState([]);
  const [savedReels, setSavedReels] = useState([]);
  const [cmsReels, setCmsReels] = useState(REELS);
  const [coins, setCoins] = useState(100);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hey! I'm your AI learning assistant. Ask me anything about ML, prompt engineering, or deep learning." },
  ]);

  const toggleLike = (id) => setLikedReels((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const toggleSave = (id) => setSavedReels((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const enrollCourse = (id) => {
    if (enrolled.includes(id)) return;
    setEnrolled((p) => [...p, id]);
    setCoins((c) => c + 50);
  };

  useEffect(() => {
    let mounted = true;

    async function loadReelsFromCms() {
      try {
        const res = await fetch(`${CMS_BASE}/api/reels`);
        if (!res.ok) throw new Error(`CMS responded ${res.status}`);
        const data = await res.json();
        if (mounted && Array.isArray(data.reels) && data.reels.length) {
          setCmsReels(data.reels);
        }
      } catch (_error) {
        if (mounted) setCmsReels(REELS);
      }
    }

    loadReelsFromCms();
    return () => {
      mounted = false;
    };
  }, []);

  const sendMessage = async (text, modelId = 'gpt4o') => {
    setMessages((p) => [...p, { role: 'user', content: text }, { role: 'thinking' }]);
    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, modelId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Request failed');
      setMessages((p) => [...p.filter((m) => m.role !== 'thinking'), { role: 'assistant', content: data.reply, model: modelId }]);
    } catch (e) {
      setMessages((p) => [
        ...p.filter((m) => m.role !== 'thinking'),
        { role: 'assistant', content: `Live AI unavailable (${e.message}). Try again.`, model: modelId },
      ]);
    }
  };

  const courses = COURSES.map((c) => ({ ...c, enrolled: enrolled.includes(c.id) }));
  const reels = cmsReels.map((r) => ({ ...r, liked: likedReels.includes(r.id), saved: savedReels.includes(r.id) }));

  return (
    <AppContext.Provider
      value={{ courses, reels, coins, messages, enrollCourse, toggleLike, toggleSave, sendMessage }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
