import Link from 'next/link';

const cards = [
  {
    title: 'Sécurité renforcée',
    description: 'JWT, API protégée, et architecture conçue pour un usage multi-tenant.',
  },
  {
    title: 'Expérience web-first',
    description: 'Interface moderne responsive pensée pour les écoles et les équipes administratives.',
  },
  {
    title: 'Évolution rapide',
    description: 'Prototype SaaS prêt à iterer vers un produit licorne EdTech.',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen text-slate-100">
      <section className="relative overflow-hidden px-6 py-20 sm:px-8 lg:px-12">
        <div className="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-slate-900/90 to-transparent" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-16">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="max-w-2xl">
              <span className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-4 py-1 text-sm font-semibold uppercase tracking-[0.35em] text-accent">
                V2 · Web-first MVP
              </span>
              <h1 className="mt-8 text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                Plateforme éducative premium pour les écoles ambitieuses.
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-300">
                Une interface pensée pour les directeurs, enseignants et parents, dotée d’un pilotage sécurisé, d’un flux de données clair et d’une expérience fluide, accessible partout.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link href="/login" className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-4 text-base font-semibold text-slate-950 shadow-glow transition hover:bg-accent/90">
                  Se connecter
                </Link>
                <Link href="/dashboard" className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950/70 px-7 py-4 text-base font-semibold text-slate-100 transition hover:border-slate-500">
                  Voir le dashboard
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/50 backdrop-blur-xl">
              <div className="grid gap-6">
                {cards.map((card) => (
                  <div key={card.title} className="rounded-3xl border border-slate-800 bg-slate-950/85 p-6">
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-500">{card.title}</p>
                    <p className="mt-4 text-base leading-7 text-slate-300">{card.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <article className="rounded-[2rem] border border-slate-800 bg-slate-950/90 p-8 shadow-[0_24px_80px_-42px_rgba(15,23,42,0.95)]">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Créer rapidement un MVP</p>
              <h2 className="mt-5 text-2xl font-semibold text-white">Conçu pour les essais pilotes</h2>
              <p className="mt-4 text-slate-400">Mets en place une plateforme de gestion scolaire avec une expérience moderne et une base solide pour la montée en charge.</p>
            </article>
            <article className="rounded-[2rem] border border-slate-800 bg-slate-950/90 p-8 shadow-[0_24px_80px_-42px_rgba(15,23,42,0.95)]">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Performance web</p>
              <h2 className="mt-5 text-2xl font-semibold text-white">Optimisée Next.js + Tailwind</h2>
              <p className="mt-4 text-slate-400">Architecture frontend prête pour la scalabilité, la fluidité mobile et la fiabilité sur des connexions limitées.</p>
            </article>
            <article className="rounded-[2rem] border border-slate-800 bg-slate-950/90 p-8 shadow-[0_24px_80px_-42px_rgba(15,23,42,0.95)]">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Sécurité moderne</p>
              <h2 className="mt-5 text-2xl font-semibold text-white">JWT et API protégée</h2>
              <p className="mt-4 text-slate-400">Authentification robuste, rafraîchissement automatique et logique d’accès claire pour les modules administratifs.</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
