import React, { createContext, useContext, useEffect, useState } from 'react';
import { COURSES, REELS, GENERATED_REELS } from '../constants/data';
import { supabase } from '../lib/supabase';
import { fetchReels } from '../services/reelsService';
import { chatStream, chatOnce } from '../services/aiService';

const AppContext = createContext(null);

export function AppProvider({ children, userId }) {
  const [enrolled, setEnrolled] = useState([]);
  const [likedReels, setLikedReels] = useState([]);
  const [savedReels, setSavedReels] = useState([]);
  const [cmsReels, setCmsReels] = useState(REELS);
  const [reelsStatus, setReelsStatus] = useState('loading'); // loading | ready | error
  const [coins, setCoins] = useState(100);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hey! I'm your AI learning assistant. Ask me anything about ML, prompt engineering, or deep learning." },
  ]);

  useEffect(() => {
    let mounted = true;
    const canUseSupabase = !!supabase && !!userId && userId !== 'demo-user';

    async function loadRemoteData() {
      const { reels, error } = await fetchReels();
      if (!mounted) return;
      setCmsReels(reels && reels.length ? reels : [...REELS, ...GENERATED_REELS]);
      setReelsStatus(error ? 'error' : 'ready');
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

  const sendMessage = async (text, modelId) => {
    // Build the transcript BEFORE updating state so the network call sees it.
    const priorMessages = messages.filter((m) => m.role === 'user' || m.role === 'assistant');
    const transcript = [...priorMessages, { role: 'user', content: text }];

    // Insert user msg + an empty streaming assistant placeholder
    setMessages((p) => [
      ...p.filter((m) => m.role !== 'thinking'),
      { role: 'user', content: text },
      { role: 'assistant', content: '', model: modelId, streaming: true },
    ]);

    const appendToLastAssistant = (delta) => {
      setMessages((p) => {
        const copy = [...p];
        for (let i = copy.length - 1; i >= 0; i--) {
          if (copy[i].role === 'assistant' && copy[i].streaming) {
            copy[i] = { ...copy[i], content: copy[i].content + delta };
            break;
          }
        }
        return copy;
      });
    };

    const finalise = (patch) => {
      setMessages((p) => {
        const copy = [...p];
        for (let i = copy.length - 1; i >= 0; i--) {
          if (copy[i].role === 'assistant' && copy[i].streaming) {
            copy[i] = { ...copy[i], streaming: false, ...patch };
            break;
          }
        }
        return copy;
      });
    };

    // Try streaming first
    const stream = await chatStream(transcript, modelId, appendToLastAssistant);
    if (stream.ok) {
      finalise({
        model: stream.model || modelId,
        fallbackUsed: Boolean(stream.fallbackUsed),
      });
      return;
    }

    if (stream.missingKey) {
      finalise({
        content: '⚠️ AI is not configured yet. Ask the admin to set `OPENROUTER_KEY` in Vercel.',
        error: true,
      });
      return;
    }

    if (stream.rateLimited) {
      finalise({
        content: '⏱️ This free model is rate-limited right now. Try another agent, or wait a minute and retry.',
        error: true,
      });
      return;
    }

    // Fallback to non-streaming
    const once = await chatOnce(transcript, modelId);
    if (once.reply) {
      finalise({
        content: once.reply,
        model: once.model || modelId,
        fallbackUsed: Boolean(once.fallbackUsed),
      });
    } else if (once.rateLimited) {
      finalise({
        content: '⏱️ This free model is rate-limited right now. Try another agent, or wait a minute and retry.',
        error: true,
      });
    } else {
      finalise({
        content: `Live AI unavailable${once.error ? ` (${once.error})` : ''}. Try again.`,
        error: true,
      });
    }
  };

  const courses = COURSES.map((c) => ({ ...c, enrolled: enrolled.includes(c.id) }));
  const reels = cmsReels.map((r) => ({ ...r, liked: likedReels.includes(r.id), saved: savedReels.includes(r.id) }));

  return (
    <AppContext.Provider value={{ courses, reels, reelsStatus, coins, messages, enrollCourse, toggleLike, toggleSave, sendMessage }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
