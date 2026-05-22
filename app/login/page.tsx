'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, login } from '../../utils/auth';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username.trim(), password);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Impossible de se connecter.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_25%),linear-gradient(180deg,_#020617_0%,_#070b1a_100%)] text-slate-100">
      <section className="relative mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16 sm:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.12),_transparent_18%)]" />
        <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.4em] text-slate-500">SCHOOL229</p>
            <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              Une connexion fluide pour le cockpit scolaire.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-slate-400">
              Rejoins l’espace sécurisé de gestion et pilote l’administration, les notes et la présence depuis un design premium pensé pour le web.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Rapide</p>
                <p className="mt-3 text-base text-slate-300">Authentification instantanée via JWT et mise en produit immédiate.</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Sûr</p>
                <p className="mt-3 text-base text-slate-300">Connexion fiable et API protégée pour les données sensibles.</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/85 p-10 shadow-[0_48px_100px_-40px_rgba(15,23,42,0.92)] backdrop-blur-xl">
            <div className="absolute -right-16 top-8 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Connectez-vous</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">Accès direct aux outils scolaires</h2>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-slate-300">
                  Nom d’utilisateur
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-900 px-5 py-4 text-base text-slate-100 outline-none transition focus:border-accent/80 focus:ring-2 focus:ring-accent/20"
                  placeholder="Entrez votre identifiant"
                  autoComplete="username"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-900 px-5 py-4 text-base text-slate-100 outline-none transition focus:border-accent/80 focus:ring-2 focus:ring-accent/20"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>

              {error && (
                <div className="rounded-3xl border border-red-700/30 bg-red-950/80 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-3xl bg-accent px-5 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-accent/20 transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Connexion…' : 'Se connecter'}
              </button>
            </form>
            <p className="mt-8 text-sm leading-6 text-slate-500">
              Pas encore de compte ? <a href="/register" className="text-white underline decoration-accent/40">Créez un accès administrateur</a> ou <a href="/signup" className="text-white underline decoration-accent/40">inscrivez-vous comme élève</a>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
