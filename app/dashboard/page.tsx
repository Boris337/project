'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchSchools } from '../../utils/api';
import { isAuthenticated, logout } from '../../utils/auth';

export default function Dashboard() {
  const [schools, setSchools] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
      return;
    }

    fetchSchools()
      .then((data) => setSchools(Array.isArray(data) ? data : []))
      .catch(() => setError('Impossible de charger les écoles.'))
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="relative overflow-hidden px-6 py-10 sm:px-8 lg:px-12">
        <div className="absolute left-1/2 top-0 h-80 w-[90rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl space-y-8">
          <div className="flex flex-col gap-6 rounded-[2rem] border border-slate-800 bg-slate-950/85 px-6 py-6 shadow-[0_40px_120px_-48px_rgba(15,23,42,0.9)] sm:px-10 sm:py-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Tableau de bord</p>
              <h1 className="mt-4 text-4xl font-semibold text-white">Pilotage intelligent de votre établissement</h1>
              <p className="mt-3 max-w-2xl text-slate-400">Accédez rapidement aux indicateurs clés et aux opérations quotidiennes de gestion scolaire.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/schools" className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950/90 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-900">
                Écoles
              </Link>
              <Link href="/notes" className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950/90 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-900">
                Notes
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push('/login');
                }}
                className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-transparent px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-red-500 hover:text-red-300"
              >
                Déconnexion
              </button>
            </div>
          </div>

          {error && <div className="rounded-[2rem] border border-red-700/20 bg-red-950/80 px-6 py-4 text-sm text-red-300">{error}</div>}

          <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
            <div className="space-y-6">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/90 p-8 shadow-glow">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Résumé</p>
                    <h2 className="mt-4 text-3xl font-semibold text-white">Vue d'ensemble en un coup d'œil</h2>
                  </div>
                  <div className="rounded-3xl bg-slate-900/75 px-4 py-2 text-sm text-slate-300">Live</div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-3xl bg-slate-950/80 p-5 ring-1 ring-slate-800">
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Écoles</p>
                    <p className="mt-4 text-4xl font-semibold text-white">{loading ? '...' : Array.isArray(schools) ? schools.length : 0}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950/80 p-5 ring-1 ring-slate-800">
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Bulletins</p>
                    <p className="mt-4 text-4xl font-semibold text-white">42</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950/80 p-5 ring-1 ring-slate-800">
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Présence</p>
                    <p className="mt-4 text-4xl font-semibold text-white">98%</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/90 p-8 shadow-glow">
                <h3 className="text-xl font-semibold text-white">Actions prioritaires</h3>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Link href="/schools" className="rounded-3xl border border-slate-700 bg-slate-900/80 px-5 py-4 text-left text-sm text-slate-200 transition hover:border-accent/40 hover:bg-slate-950/90">
                    Gérer les écoles
                  </Link>
                  <Link href="/notes" className="rounded-3xl border border-slate-700 bg-slate-900/80 px-5 py-4 text-left text-sm text-slate-200 transition hover:border-accent/40 hover:bg-slate-950/90">
                    Consulter les notes récentes
                  </Link>
                  <Link href="/university" className="rounded-3xl border border-slate-700 bg-slate-900/80 px-5 py-4 text-left text-sm text-slate-200 transition hover:border-accent/40 hover:bg-slate-950/90">
                    Administration université
                  </Link>
                  <Link href="/users" className="rounded-3xl border border-slate-700 bg-slate-900/80 px-5 py-4 text-left text-sm text-slate-200 transition hover:border-accent/40 hover:bg-slate-950/90">
                    Gérer les utilisateurs
                  </Link>
                  <Link href="/attendance" className="rounded-3xl border border-slate-700 bg-slate-900/80 px-5 py-4 text-left text-sm text-slate-200 transition hover:border-accent/40 hover:bg-slate-950/90">
                    Voir la présence
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/90 p-8 shadow-glow">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Notifications</p>
                <div className="mt-6 space-y-4">
                  <div className="rounded-3xl border border-slate-800 bg-slate-900/80 px-5 py-4 text-sm text-slate-300">
                    <p className="font-semibold text-white">Aucun incident critique</p>
                    <p className="mt-2 leading-6">Tous les systèmes sont opérationnels pour aujourd'hui.</p>
                  </div>
                  <div className="rounded-3xl border border-slate-800 bg-slate-900/80 px-5 py-4 text-sm text-slate-300">
                    <p className="font-semibold text-white">Évolution produit</p>
                    <p className="mt-2 leading-6">Préparer la prochaine version mobile PWA après validation du MVP web.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/90 p-8 shadow-glow">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Bilan</p>
                <h3 className="mt-4 text-2xl font-semibold text-white">Interface conçue pour l'échelle</h3>
                <p className="mt-4 text-slate-400">Ensemble de composants visuels, roadmap produit et parcours utilisateur pensé pour un usage B2B + écosystème scolaire.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
