'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerUser } from '../../utils/api';

const roles = [
  { value: 'DIRECTEUR', label: 'Directeur' },
  { value: 'ENSEIGNANT', label: 'Enseignant' },
];

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('DIRECTEUR');
  const [matricule, setMatricule] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await registerUser(username.trim(), email.trim(), password, role, matricule.trim());
      router.push('/login');
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Erreur lors de la création du compte.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.15),_transparent_26%),linear-gradient(180deg,_#020617_0%,_#070b1a_100%)] text-slate-100">
      <section className="relative mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16 sm:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(96,165,250,0.12),_transparent_18%)]" />
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.4em] text-slate-500">SCHOOL229</p>
            <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              Créez un compte administrateur ou pédagogique en quelques secondes.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-slate-400">
              Configurez votre cockpit scolaire, gérez les classes et suivez la présence avec une interface professionnelle adaptée aux établissements modernes.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Directeur</p>
                <p className="mt-3 text-base text-slate-300">Créez un compte pour piloter l’établissement et gérer les flux pédagogiques.</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Enseignant</p>
                <p className="mt-3 text-base text-slate-300">Accédez aux notes, aux classes et au suivi des effectifs.</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/85 p-10 shadow-[0_48px_100px_-40px_rgba(15,23,42,0.92)] backdrop-blur-xl">
            <div className="absolute -right-16 top-8 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Créer un compte</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">Accès administrateur sécurisé</h2>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-slate-300">
                  Identifiant
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-900 px-5 py-4 text-base text-slate-100 outline-none transition focus:border-accent/80 focus:ring-2 focus:ring-accent/20"
                  placeholder="Votre identifiant"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-900 px-5 py-4 text-base text-slate-100 outline-none transition focus:border-accent/80 focus:ring-2 focus:ring-accent/20"
                  placeholder="admin@ecole.bj"
                  required
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
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-slate-300">
                    Rôle
                  </label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-900 px-5 py-4 text-base text-slate-100 outline-none transition focus:border-accent/80 focus:ring-2 focus:ring-accent/20"
                  >
                    {roles.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="matricule" className="block text-sm font-medium text-slate-300">
                    Matricule
                  </label>
                  <input
                    id="matricule"
                    type="text"
                    value={matricule}
                    onChange={(e) => setMatricule(e.target.value)}
                    className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-900 px-5 py-4 text-base text-slate-100 outline-none transition focus:border-accent/80 focus:ring-2 focus:ring-accent/20"
                    placeholder="Optionnel"
                  />
                </div>
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
                {loading ? 'Création…' : 'Créer un compte'}
              </button>
            </form>

            <p className="mt-8 text-sm leading-6 text-slate-500">
              Déjà inscrit ? <Link href="/login" className="text-white underline decoration-accent/40">Connectez-vous</Link>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
