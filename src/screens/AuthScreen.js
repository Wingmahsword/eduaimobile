import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, Pressable,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { MotiView } from 'moti';
import { useAuth } from '../context/AuthContext';
import { spacing, radius, typography } from '../constants/theme';

function SpringButton({ onPress, loading, children, style }) {
  const sv = useSharedValue(1);
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: sv.value }] }));
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => { sv.value = withSpring(0.96, { damping: 14, stiffness: 400 }); }}
      onPressOut={() => { sv.value = withSpring(1, { damping: 10, stiffness: 280 }); }}
      disabled={loading}
    >
      <Animated.View style={[style, aStyle, loading && { opacity: 0.65 }]}>
        {loading ? <ActivityIndicator color="#000" /> : children}
      </Animated.View>
    </Pressable>
  );
}

function GlassInput({ icon, value, onChangeText, placeholder, secureTextEntry, keyboardType, autoCapitalize }) {
  const [focused, setFocused] = useState(false);
  return (
    <MotiView
      animate={{ borderColor: focused ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.12)' }}
      transition={{ type: 'timing', duration: 200 }}
      style={styles.inputWrap}
    >
      <Ionicons name={icon} size={18} color={focused ? '#fff' : 'rgba(255,255,255,0.4)'} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.3)"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType ?? 'default'}
        autoCapitalize={autoCapitalize ?? 'none'}
        autoCorrect={false}
        style={styles.input}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </MotiView>
  );
}

export default function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const isLogin = mode === 'login';

  const switchMode = (next) => {
    setMode(next);
    setError('');
    setPassword('');
  };

  const handleSubmit = async () => {
    setError('');
    if (!email.trim() || !password.trim()) { setError('Email and password are required.'); return; }
    if (!isLogin && !displayName.trim()) { setError('Please enter your name.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    const { error: err } = isLogin
      ? await signIn({ email: email.trim(), password })
      : await signUp({ email: email.trim(), password, displayName: displayName.trim() });
    setLoading(false);

    if (err) {
      setError(err.message.replace('AuthApiError: ', ''));
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <LinearGradient
        colors={['#000000', '#0a0010', '#000000']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 16, stiffness: 200 }}
            style={styles.logoWrap}
          >
            <LinearGradient colors={['#06B6D4', '#8B5CF6', '#EC4899']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.logoGrad}>
              <Ionicons name="sparkles" size={28} color="#fff" />
            </LinearGradient>
            <Text style={styles.logoText}>EduAI</Text>
            <Text style={styles.logoSub}>Learn · Watch · Chat</Text>
          </MotiView>

          {/* Mode toggle */}
          <MotiView
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', damping: 16, delay: 60 }}
            style={styles.toggleRow}
          >
            {['login', 'register'].map((m) => (
              <Pressable key={m} onPress={() => switchMode(m)} style={styles.toggleBtn}>
                <Text style={[styles.toggleText, mode === m && styles.toggleTextActive]}>
                  {m === 'login' ? 'Log in' : 'Sign up'}
                </Text>
                {mode === m && (
                  <MotiView
                    from={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ type: 'spring', damping: 16, stiffness: 300 }}
                    style={styles.toggleUnderline}
                  />
                )}
              </Pressable>
            ))}
          </MotiView>

          {/* Form */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', damping: 16, delay: 100 }}
            style={styles.form}
          >
            {!isLogin && (
              <MotiView
                from={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 56 }}
                transition={{ type: 'spring', damping: 18, stiffness: 280 }}
                style={{ overflow: 'hidden' }}
              >
                <GlassInput
                  icon="person-outline"
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="Your name"
                  autoCapitalize="words"
                />
              </MotiView>
            )}

            <GlassInput
              icon="mail-outline"
              value={email}
              onChangeText={setEmail}
              placeholder="Email address"
              keyboardType="email-address"
            />

            <View>
              <GlassInput
                icon="lock-closed-outline"
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry={!showPass}
              />
              <Pressable onPress={() => setShowPass((v) => !v)} style={styles.showPassBtn} hitSlop={10}>
                <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color="rgba(255,255,255,0.4)" />
              </Pressable>
            </View>

            {/* Error */}
            {!!error && (
              <MotiView
                from={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={styles.errorBox}
              >
                <Ionicons name="alert-circle-outline" size={15} color="#FF3B6B" />
                <Text style={styles.errorText}>{error}</Text>
              </MotiView>
            )}

            {/* CTA */}
            <SpringButton onPress={handleSubmit} loading={loading} style={styles.ctaBtn}>
              <Text style={styles.ctaText}>{isLogin ? 'Log in' : 'Create account'}</Text>
            </SpringButton>

            {isLogin && (
              <Text style={styles.forgotText}>Forgot password? Contact support.</Text>
            )}
          </MotiView>

          {/* Footer */}
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 400 }}
            style={styles.footer}
          >
            <Text style={styles.footerText}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
            </Text>
            <Pressable onPress={() => switchMode(isLogin ? 'register' : 'login')}>
              <Text style={styles.footerLink}>{isLogin ? 'Sign up' : 'Log in'}</Text>
            </Pressable>
          </MotiView>

          <Text style={styles.termsText}>
            By continuing, you agree to EduAI's Terms of Service and Privacy Policy.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  scroll: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingTop: 40, paddingBottom: 32 },

  logoWrap: { alignItems: 'center', gap: 12, marginBottom: 40 },
  logoGrad: { width: 72, height: 72, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  logoText: { color: '#fff', fontSize: 34, fontWeight: '800', letterSpacing: -1.5, fontFamily: typography.family },
  logoSub: { color: 'rgba(255,255,255,0.4)', fontSize: 13, letterSpacing: 1 },

  toggleRow: { flexDirection: 'row', gap: 32, justifyContent: 'center', marginBottom: 32 },
  toggleBtn: { alignItems: 'center', paddingBottom: 8, gap: 6 },
  toggleText: { color: 'rgba(255,255,255,0.4)', fontSize: 16, fontWeight: '700' },
  toggleTextActive: { color: '#fff' },
  toggleUnderline: { height: 2, width: '100%', borderRadius: 1, backgroundColor: '#fff' },

  form: { gap: 14 },

  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: radius.lg, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1 },
  input: { flex: 1, color: '#fff', fontSize: 15, outlineStyle: 'none' },

  showPassBtn: { position: 'absolute', right: 16, top: 15 },

  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,59,107,0.1)', borderRadius: radius.md, padding: 12, borderWidth: 1, borderColor: 'rgba(255,59,107,0.3)' },
  errorText: { color: '#FF3B6B', fontSize: 13, flex: 1 },

  ctaBtn: { backgroundColor: '#fff', borderRadius: radius.lg, paddingVertical: 16, alignItems: 'center', marginTop: 4 },
  ctaText: { color: '#000', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },

  forgotText: { color: 'rgba(255,255,255,0.3)', fontSize: 12, textAlign: 'center', marginTop: 4 },

  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32 },
  footerText: { color: 'rgba(255,255,255,0.45)', fontSize: 13 },
  footerLink: { color: '#fff', fontSize: 13, fontWeight: '700' },

  termsText: { color: 'rgba(255,255,255,0.2)', fontSize: 11, textAlign: 'center', marginTop: 24, lineHeight: 16 },
});
