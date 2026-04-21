import React, { createContext, useContext, useEffect, useState } from 'react';

export const DEMO_EMAIL = 'demo@eduai.app';
export const DEMO_PASSWORD = 'demo123';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined);
  const [profile, setProfile] = useState({ id: 'demo-user', display_name: 'Demo User', coins: 100 });

  useEffect(() => {
    setSession(null);
    setProfile({ id: 'demo-user', display_name: 'Demo User', coins: 100 });
    return undefined;
  }, []);

  async function fetchProfile() {
    return { id: 'demo-user', display_name: 'Demo User', coins: 100 };
  }

  async function signUp() {
    return { error: new Error('Demo mode is enabled. Please log in with demo credentials.') };
  }

  async function signIn({ email, password }) {
    const validEmail = email.trim().toLowerCase() === DEMO_EMAIL;
    const validPassword = password === DEMO_PASSWORD;

    if (!validEmail || !validPassword) {
      return { error: new Error('Invalid demo credentials. Use demo@eduai.app / demo123') };
    }

    setProfile({ id: 'demo-user', display_name: 'Demo User', coins: 100 });
    setSession({
      access_token: 'demo-token',
      user: { id: 'demo-user', email: DEMO_EMAIL },
    });
    return { error: null };
  }

  async function signOut() {
    setSession(null);
  }

  async function updateCoins(newCoins) {
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
