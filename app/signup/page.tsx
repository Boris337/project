'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createStudentRequest, fetchSchools } from '../../utils/api';

export default function SignupPage() {
  const [schools, setSchools] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadSchools = async () => {
      setSearching(true);
      try {
        const schoolsData = await fetchSchools();
        setSchools(Array.isArray(schoolsData) ? schoolsData : []);
      } catch {
        setError('Impossible de récupérer la liste des établissements.');
      } finally {
        setSearching(false);
      }
    };
    loadSchools();
  }, []);

  const filteredSchools = useMemo(() => {
    if (!query.trim()) return schools;
    const normalized = query.trim().toLowerCase();
    return schools.filter((school) => {
      const labels = [school.name, school.city, school.commune, school.department].filter(Boolean);
      return labels.some((value) => value.toLowerCase().includes(normalized));
    });
  }, [query, schools]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!username.trim() || !email.trim() || !password.trim() || !schoolId) {
      setError('Tous les champs obligatoires doivent être remplis.');
      setLoading(false);
      return;
    }

    try {
      await createStudentRequest({
        username: username.trim(),
        email: email.trim(),
        password,
        phone: phone.trim(),
        school: schoolId,
      });
      setSuccess('Demande envoyée. Le directeur validera votre inscription prochainement.');
      setUsername('');
      setEmail('');
      setPassword('');
      setPhone('');
      setSchoolId('');
      setQuery('');
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Impossible d’envoyer la demande.');
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
              Demande d’inscription élève
            </h1>
            <p className="max-w-xl text-lg leading-8 text-slate-400">
              Trouvez votre école par commune ou département, puis envoyez une demande qui sera validée par le directeur.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Recherche</p>
                <p className="mt-3 text-base text-slate-300">Entrez le nom de l’école, la commune ou le département pour trouver votre établissement.</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Suivi</p>
                <p className="mt-3 text-base text-slate-300">Le directeur recevra votre demande et pourra la valider ou la rejeter.</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/85 p-10 shadow-[0_48px_100px_-40px_rgba(15,23,42,0.92)] backdrop-blur-xl">
            <div className="absolute -right-16 top-8 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Inscription élève</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">Recherche l’école et envoie ta demande</h2>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-slate-300">Nom d’utilisateur</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-900 px-5 py-4 text-base text-slate-100 outline-none transition focus:border-accent/80 focus:ring-2 focus:ring-accent/20"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-900 px-5 py-4 text-base text-slate-100 outline-none transition focus:border-accent/80 focus:ring-2 focus:ring-accent/20"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300">Mot de passe</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-900 px-5 py-4 text-base text-slate-100 outline-none transition focus:border-accent/80 focus:ring-2 focus:ring-accent/20"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-300">Téléphone (optionnel)</label>
                <input
                  id="phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-900 px-5 py-4 text-base text-slate-100 outline-none transition focus:border-accent/80 focus:ring-2 focus:ring-accent/20"
                />
              </div>

              <div>
                <label htmlFor="query" className="block text-sm font-medium text-slate-300">Recherche d’école</label>
                <input
                  id="query"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-900 px-5 py-4 text-base text-slate-100 outline-none transition focus:border-accent/80 focus:ring-2 focus:ring-accent/20"
                  placeholder="Nom, commune ou département"
                />
              </div>

              <div>
                <label htmlFor="school" className="block text-sm font-medium text-slate-300">École</label>
                <select
                  id="school"
                  value={schoolId}
                  onChange={(e) => setSchoolId(e.target.value)}
                  className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-900 px-5 py-4 text-base text-slate-100 outline-none transition focus:border-accent/80 focus:ring-2 focus:ring-accent/20"
                  required
                >
                  <option value="">Choisissez votre école</option>
                  {filteredSchools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name} — {school.commune || school.city || 'N/A'} / {school.department || school.country}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="rounded-3xl border border-red-700/30 bg-red-950/80 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-3xl bg-accent px-5 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-accent/20 transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Envoi…' : 'Envoyer la demande'}
              </button>
            </form>

            <p className="mt-8 text-sm leading-6 text-slate-500">
              Déjà inscrit ? <Link href="/login" className="text-white underline decoration-accent/40">Connectez-vous</Link>.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-500">Si vous êtes déjà inscrit par le directeur, attendez la validation ou demandez-lui de créer votre compte directement.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
