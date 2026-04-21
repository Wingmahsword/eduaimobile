import React, { createContext, useContext, useEffect, useState } from 'react';
import { COURSES, REELS, GENERATED_REELS, API_BASE, CMS_BASE } from '../constants/data';
import { supabase } from '../lib/supabase';

const AppContext = createContext(null);

function mergeReels(primary, generated = []) {
  const byId = new Map();
  [...primary, ...generated].forEach((r) => {
    if (r?.id) byId.set(r.id, r);
  });
  return Array.from(byId.values());
}

export function AppProvider({ children, userId }) {
  const [enrolled, setEnrolled] = useState([]);
  const [likedReels, setLikedReels] = useState([]);
  const [savedReels, setSavedReels] = useState([]);
  const [cmsReels, setCmsReels] = useState(REELS);
  const [coins, setCoins] = useState(100);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hey! I'm your AI learning assistant. Ask me anything about ML, prompt engineering, or deep learning." },
  ]);

  useEffect(() => {
    let mounted = true;
    const canUseSupabase = !!supabase && !!userId && userId !== 'demo-user';

    async function loadRemoteData() {
      try {
        const res = await fetch(`${CMS_BASE}/api/reels`);
        if (!res.ok) throw new Error(`CMS ${res.status}`);
        const data = await res.json();
        if (mounted && Array.isArray(data.reels)) {
          const merged = mergeReels(data.reels, GENERATED_REELS);
          setCmsReels(merged.length ? merged : REELS);
        }
      } catch (_) {
        if (mounted) setCmsReels(mergeReels(REELS, GENERATED_REELS));
      }
    }

    async function loadUserData() {
      if (!canUseSupabase) return;
      const [enrollRes, likeRes, saveRes, profileRes] = await Promise.all([
        supabase.from('enrollments').select('course_id').eq('user_id', userId),
        supabase.from('liked_reels').select('reel_id').eq('user_id', userId),
        supabase.from('saved_reels').select('reel_id').eq('user_id', userId),
        supabase.from('profiles').select('coins').eq('id', userId).single(),
      ]);
      if (mounted) {
        if (enrollRes.data) setEnrolled(enrollRes.data.map((r) => r.course_id));
        if (likeRes.data)   setLikedReels(likeRes.data.map((r) => r.reel_id));
        if (saveRes.data)   setSavedReels(saveRes.data.map((r) => r.reel_id));
        if (profileRes.data) setCoins(profileRes.data.coins);
      }
    }

    loadRemoteData();
    loadUserData();
    return () => { mounted = false; };
  }, [userId]);

  const toggleLike = async (id) => {
    const canUseSupabase = !!supabase && !!userId && userId !== 'demo-user';
    const next = likedReels.includes(id)
      ? likedReels.filter((x) => x !== id)
      : [...likedReels, id];
    setLikedReels(next);
    if (canUseSupabase) {
      if (likedReels.includes(id)) {
        await supabase.from('liked_reels').delete().eq('user_id', userId).eq('reel_id', id);
      } else {
        await supabase.from('liked_reels').upsert({ user_id: userId, reel_id: id });
      }
    }
  };

  const toggleSave = async (id) => {
    const canUseSupabase = !!supabase && !!userId && userId !== 'demo-user';
    const next = savedReels.includes(id)
      ? savedReels.filter((x) => x !== id)
      : [...savedReels, id];
    setSavedReels(next);
    if (canUseSupabase) {
      if (savedReels.includes(id)) {
        await supabase.from('saved_reels').delete().eq('user_id', userId).eq('reel_id', id);
      } else {
        await supabase.from('saved_reels').upsert({ user_id: userId, reel_id: id });
      }
    }
  };

  const enrollCourse = async (id) => {
    const canUseSupabase = !!supabase && !!userId && userId !== 'demo-user';
    if (enrolled.includes(id)) return;
    const newCoins = coins + 50;
    setEnrolled((p) => [...p, id]);
    setCoins(newCoins);
    if (canUseSupabase) {
      await Promise.all([
        supabase.from('enrollments').upsert({ user_id: userId, course_id: id }),
        supabase.from('profiles').update({ coins: newCoins }).eq('id', userId),
      ]);
    }
  };

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
      setMessages((p) => [
        ...p.filter((m) => m.role !== 'thinking'),
        { role: 'assistant', content: data.reply, model: modelId },
      ]);
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
    <AppContext.Provider value={{ courses, reels, coins, messages, enrollCourse, toggleLike, toggleSave, sendMessage }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
