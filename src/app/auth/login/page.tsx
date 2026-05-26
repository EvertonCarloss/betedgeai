'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (isSignup) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else {
        setSuccess('Conta criada! Entrando...');
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (!loginError) window.location.href = '/dashboard';
        else setError(loginError.message);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setError(error.message);
      else window.location.href = '/dashboard';
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="font-display text-3xl font-black text-white mb-1">
            Bet<span className="text-accent">Edge</span> AI
          </div>
          <div className="text-txt-2 text-xs tracking-widest uppercase">
            análise inteligente de apostas
          </div>
        </div>

        <div className="bg-bg-2 border border-border rounded p-6">
          <h2 className="font-display font-bold text-white mb-5 text-sm">
            {isSignup ? 'Criar conta' : 'Entrar na plataforma'}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-txt-3 text-xs uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-bg border border-border rounded px-3 py-2 text-txt text-sm outline-none focus:border-accent-2 transition-colors font-mono"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label className="block text-txt-3 text-xs uppercase tracking-wider mb-1.5">
                Senha
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-bg border border-border rounded px-3 py-2 text-txt text-sm outline-none focus:border-accent-2 transition-colors font-mono"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-danger text-xs bg-danger/5 border border-danger/20 rounded px-3 py-2">
                {error}
              </div>
            )}
            {success && (
              <div className="text-success text-xs bg-success/5 border border-success/20 rounded px-3 py-2">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-accent text-black font-mono font-medium text-sm rounded py-2 px-4 hover:bg-cyan-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Carregando...' : isSignup ? 'Criar conta' : 'Entrar'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setIsSignup(!isSignup);
                setError('');
                setSuccess('');
              }}
              className="text-txt-2 text-xs hover:text-accent transition-colors"
            >
              {isSignup ? 'Já tem conta? Entrar' : 'Não tem conta? Cadastrar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
