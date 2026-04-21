import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'eduai_dm_store_v1';

const DEFAULT_STORE = {
  threads: [
    { id: 'dm1', name: 'krish_ai', last: 'Bro check this ML roadmap reel', time: '2m', unread: 2 },
    { id: 'dm2', name: 'anna.ml', last: 'Shared a CS229 note PDF', time: '8m', unread: 0 },
    { id: 'dm3', name: 'micro_ai', last: "Let's collab on your reel draft", time: '21m', unread: 1 },
    { id: 'dm4', name: 'hf_user', last: 'Tokenizer bug fixed ✅', time: '1h', unread: 0 },
    { id: 'dm5', name: 'su_dev', last: 'Drop your project link', time: '3h', unread: 0 },
  ],
  messagesByThread: {
    dm1: [
      { id: 'dm1-m1', fromMe: false, text: 'Yo! saw your latest AI reel 🔥' },
      { id: 'dm1-m2', fromMe: true, text: 'Thanks! Working on part 2 now.' },
      { id: 'dm1-m3', fromMe: false, text: 'Send it when done, I will repost.' },
      { id: 'dm1-m4', fromMe: true, text: 'Deal 🤝' },
    ],
    dm2: [{ id: 'dm2-m1', fromMe: false, text: 'Shared a CS229 note PDF' }],
    dm3: [{ id: 'dm3-m1', fromMe: false, text: "Let's collab on your reel draft" }],
    dm4: [{ id: 'dm4-m1', fromMe: false, text: 'Tokenizer bug fixed ✅' }],
    dm5: [{ id: 'dm5-m1', fromMe: false, text: 'Drop your project link' }],
  },
};

const DMContext = createContext(null);

export function DMProvider({ children }) {
  const [store, setStore] = useState(DEFAULT_STORE);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!mounted || !raw) return;
        const parsed = JSON.parse(raw);
        if (!parsed?.threads || !parsed?.messagesByThread) return;
        setStore(parsed);
      })
      .catch(() => {});

    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(store)).catch(() => {});
  }, [store]);

  const actions = useMemo(() => ({
    getThreadMessages(threadId) {
      return store.messagesByThread[threadId] || [];
    },

    markThreadRead(threadId) {
      setStore((prev) => ({
        ...prev,
        threads: prev.threads.map((t) => (t.id === threadId ? { ...t, unread: 0 } : t)),
      }));
    },

    sendMessage(threadId, text) {
      const body = text.trim();
      if (!body) return;

      setStore((prev) => {
        const list = prev.messagesByThread[threadId] || [];
        const nextMessage = {
          id: `${threadId}-${Date.now()}`,
          fromMe: true,
          text: body,
        };

        const updatedThreads = prev.threads.map((t) => (
          t.id === threadId ? { ...t, last: body, time: 'now', unread: 0 } : t
        ));

        return {
          threads: updatedThreads,
          messagesByThread: {
            ...prev.messagesByThread,
            [threadId]: [...list, nextMessage],
          },
        };
      });
    },
  }), [store.messagesByThread]);

  return (
    <DMContext.Provider value={{ threads: store.threads, ...actions }}>
      {children}
    </DMContext.Provider>
  );
}

export const useDM = () => useContext(DMContext);
