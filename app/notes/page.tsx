'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, logout } from '../../utils/auth';

const noteSummaries = [
  {
    title: 'Bulletin primaire - Cycle 2',
    subtitle: '18 classes, 5 matières principales',
    status: 'Publié',
  },
  {
    title: 'Contrôles continus',
    subtitle: 'Résultats en cours de consolidation',
    status: 'En traitement',
  },
  {
    title: 'Synthèse trimestrielle',
    subtitle: 'Analyse de performance par matière',
    status: 'Prêt',
  },
];

export default function NotesPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="relative mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-12">
        <div className="absolute right-1/2 top-0 h-72 w-[88rem] translate-x-1/2 rounded-full bg-slate-700/10 blur-3xl" />
        <div className="relative space-y-8">
          <header className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Notes & bulletins</p>
                <h1 className="mt-4 text-4xl font-semibold text-white">Pilotage pédagogique</h1>
                <p className="mt-3 max-w-2xl text-slate-400">Visualise et prépare les bulletins, les contrôles et les synthèses de performance à destination des enseignants et des familles.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/dashboard" className="rounded-full border border-slate-700 bg-slate-950/80 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-900">
                  Retour au dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    router.push('/login');
                  }}
                  className="rounded-full border border-slate-700 bg-transparent px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-red-500 hover:text-red-300"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </header>

          <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
            <section className="rounded-[2rem] border border-slate-800 bg-slate-950/95 p-8 shadow-glow">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-semibold text-white">Fiches notes récentes</h2>
                  <p className="mt-2 text-slate-400">Une vue claire des bulletins et du statut de publication.</p>
                </div>
                <span className="rounded-full bg-slate-900/80 px-4 py-2 text-sm text-slate-300">{noteSummaries.length} rapports</span>
              </div>

              <div className="mt-8 space-y-4">
                {noteSummaries.map((note) => (
                  <article key={note.title} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 transition hover:border-accent/40 hover:bg-slate-950/90">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-semibold text-white">{note.title}</h3>
                        <p className="mt-3 text-slate-400">{note.subtitle}</p>
                      </div>
                      <span className="rounded-full bg-slate-950/80 px-4 py-2 text-sm font-semibold text-slate-300">{note.status}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <aside className="space-y-6">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/90 p-8 shadow-glow">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Note clé</p>
                <h3 className="mt-4 text-2xl font-semibold text-white">Du contenu prêt à être publié</h3>
                <p className="mt-4 text-slate-400">Prépare des bulletins structurés pour chaque classe et assure la clarté des résultats pour les familles.</p>
              </div>

              <div className="rounded-[2rem] border border-slate-800 bg-slate-950/90 p-8 shadow-glow">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Actions</p>
                <div className="mt-5 grid gap-3">
                  <button className="rounded-3xl border border-slate-700 bg-slate-900/80 px-5 py-4 text-left text-sm text-slate-200 transition hover:border-accent/40 hover:bg-slate-950/90">
                    Créer un nouveau bulletin
                  </button>
                  <button className="rounded-3xl border border-slate-700 bg-slate-900/80 px-5 py-4 text-left text-sm text-slate-200 transition hover:border-accent/40 hover:bg-slate-950/90">
                    Télécharger le rapport trimestriel
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
