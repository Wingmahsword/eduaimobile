import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!supabase) {
      setSession(null);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session ?? null);
      if (session) fetchProfile(session.user.id);
    }).catch(() => setSession(null));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? null);
      if (session) fetchProfile(session.user.id);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (data) setProfile(data);
  }

  async function signUp({ email, password, displayName }) {
    if (!supabase) return { error: new Error('Supabase not configured') };
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    });
    return { error };
  }

  async function signIn({ email, password }) {
    if (!supabase) return { error: new Error('Supabase not configured') };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
  }

  async function updateCoins(newCoins) {
    if (!supabase || !session) return;
    await supabase
      .from('profiles')
      .update({ coins: newCoins, updated_at: new Date().toISOString() })
      .eq('id', session.user.id);
    setProfile((p) => p ? { ...p, coins: newCoins } : p);
  }

  const loading = session === undefined;

  return (
    <AuthContext.Provider
      value={{ session, profile, loading, signUp, signIn, signOut, updateCoins, fetchProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
