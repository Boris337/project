'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSchool, deleteSchool, fetchSchools, updateSchool } from '../../utils/api';
import { isAuthenticated, logout } from '../../utils/auth';

const SCHOOL_TYPES = [
  { value: 'PRIVE', label: 'Privé' },
  { value: 'PUBLIC', label: 'Public' },
  { value: 'UNIVERSITE', label: 'Université' },
  { value: 'GRANDE_ECOLE', label: 'Grande école' },
];

const PLAN_OPTIONS = [
  { value: 'STARTER', label: 'Starter' },
  { value: 'STANDARD', label: 'Standard' },
  { value: 'PREMIUM', label: 'Premium' },
  { value: 'UNIVERSITE', label: 'Université' },
];

export default function SchoolsPage() {
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newSchool, setNewSchool] = useState({
    name: '',
    type: 'PRIVE',
    plan: 'STARTER',
    city: '',
    commune: '',
    department: '',
    country: 'BJ',
    address: '',
    website_url: '',
    description: '',
  });
  const [editSchool, setEditSchool] = useState<any | null>(null);
  const [editSchoolData, setEditSchoolData] = useState({
    name: '',
    type: 'PRIVE',
    plan: 'STARTER',
    city: '',
    commune: '',
    department: '',
    country: 'BJ',
    address: '',
    website_url: '',
    description: '',
  });
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
      return;
    }

    loadSchools();
  }, [router]);

  const loadSchools = async () => {
    setError('');
    setLoading(true);
    try {
      const data = await fetchSchools();
      setSchools(Array.isArray(data) ? data : []);
    } catch {
      setError('Impossible de charger les écoles pour le moment.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setNewSchool((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditInputChange = (field: string, value: string) => {
    setEditSchoolData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStartEditSchool = (school: any) => {
    setEditSchool(school);
    setEditSchoolData({
      name: school.name || '',
      type: school.type || 'PRIVE',
      plan: school.plan || 'STARTER',
      city: school.city || '',
      commune: school.commune || '',
      department: school.department || '',
      country: school.country || 'BJ',
      address: school.address || '',
      website_url: school.website_url || '',
      description: school.description || '',
    });
    setError('');
    setSuccess('');
  };

  const handleCancelEdit = () => {
    setEditSchool(null);
    setEditSchoolData({
      name: '',
      type: 'PRIVE',
      plan: 'STARTER',
      city: '',
      commune: '',
      department: '',
      country: 'BJ',
      address: '',
      website_url: '',
      description: '',
    });
  };

  const activeForm = editSchool ? editSchoolData : newSchool;
  const handleFormChange = editSchool ? handleEditInputChange : handleInputChange;

  const handleUpdateSchool = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editSchool) return;

    setError('');
    setSuccess('');

    if (!editSchoolData.name || !editSchoolData.city || !editSchoolData.department) {
      setError('Le nom, la ville et le département sont requis pour la mise à jour.');
      return;
    }

    try {
      await updateSchool(editSchool.id, {
        ...editSchoolData,
      });
      setSuccess('École mise à jour avec succès.');
      handleCancelEdit();
      loadSchools();
    } catch (err) {
      setError((err as Error).message || 'Impossible de mettre à jour l’école.');
    }
  };

  const handleDeleteSchool = async (schoolId: string) => {
    setError('');
    setSuccess('');

    if (!window.confirm('Confirmer la suppression de cet établissement ? Cette action est irréversible.')) {
      return;
    }

    try {
      await deleteSchool(schoolId);
      setSuccess('École supprimée avec succès.');
      if (editSchool?.id === schoolId) {
        handleCancelEdit();
      }
      loadSchools();
    } catch (err) {
      setError((err as Error).message || 'Impossible de supprimer l’école.');
    }
  };

  const handleCreateSchool = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!newSchool.name || !newSchool.city || !newSchool.department) {
      setError('Le nom, la ville et le département sont requis.');
      return;
    }

    try {
      await createSchool({
        ...newSchool,
        ads_enabled: false,
        is_active: true,
      });
      setSuccess('École créée avec succès.');
      setNewSchool({
        name: '',
        type: 'PRIVE',
        plan: 'STARTER',
        city: '',
        commune: '',
        department: '',
        country: 'BJ',
        address: '',
        website_url: '',
        description: '',
      });
      loadSchools();
    } catch (err) {
      setError((err as Error).message || 'Impossible de créer l’école.');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="relative mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-12">
        <div className="absolute left-1/2 top-0 h-72 w-[88rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative space-y-8">
          <header className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Écoles</p>
                <h1 className="mt-4 text-4xl font-semibold text-white">Gestion des établissements</h1>
                <p className="mt-3 max-w-2xl text-slate-400">Accédez aux profils de vos écoles, à l’état de leurs classes et aux actions clés en un seul endroit.</p>
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

          {error && (
            <div className="rounded-[2rem] border border-red-700/20 bg-red-950/80 px-6 py-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-[2rem] border border-emerald-700/20 bg-emerald-950/80 px-6 py-4 text-sm text-emerald-300">
              {success}
            </div>
          )}

          <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
            <section className="rounded-[2rem] border border-slate-800 bg-slate-950/95 p-8 shadow-glow">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-semibold text-white">Vos établissements</h2>
                  <p className="mt-2 text-slate-400">Liste des écoles administrées et leurs informations complètes.</p>
                </div>
                <span className="rounded-full bg-slate-900/80 px-4 py-2 text-sm text-slate-300">{loading ? '...' : `${schools.length} établissements`}</span>
              </div>

              <div className="mt-8 space-y-4">
                {loading ? (
                  <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-slate-400">Chargement des établissements…</div>
                ) : schools.length > 0 ? (
                  schools.map((school) => (
                    <div key={school.id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 transition hover:border-accent/40 hover:bg-slate-900/95">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">{school.type || 'Établissement'}</p>
                          <h3 className="mt-3 text-2xl font-semibold text-white">{school.name}</h3>
                        </div>
                        <div className="flex flex-wrap gap-2 text-sm text-slate-300">
                          <span className="rounded-full bg-slate-900/80 px-3 py-1">{school.plan}</span>
                          <span className="rounded-full bg-slate-900/80 px-3 py-1">{school.is_active ? 'Actif' : 'Inactif'}</span>
                        </div>
                      </div>
                      <p className="mt-4 text-slate-400">{school.description || 'Aucune description disponible pour cet établissement.'}</p>
                      <div className="mt-6 grid gap-3 sm:grid-cols-2 text-sm text-slate-400">
                        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
                          <p className="font-semibold text-white">Localisation</p>
                          <p className="mt-2">{school.address || `${school.city}, ${school.department}`}</p>
                          {school.commune && <p>{school.commune}</p>}
                        </div>
                        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4">
                          <p className="font-semibold text-white">Contact</p>
                          <p className="mt-2">
                            {school.website_url ? (
                              <a href={school.website_url} className="text-accent hover:underline" target="_blank" rel="noreferrer">
                                {school.website_url}
                              </a>
                            ) : (
                              'Pas de site renseigné'
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => handleStartEditSchool(school)}
                          className="rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-accent/40 hover:bg-slate-950/90"
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSchool(school.id)}
                          className="rounded-full border border-red-700 bg-red-950/80 px-4 py-2 text-sm font-semibold text-red-300 transition hover:border-red-500 hover:bg-red-900/90"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-slate-400">Aucun établissement trouvé pour le moment.</div>
                )}
              </div>
            </section>

            <aside className="space-y-6">
              <section className="rounded-[2rem] border border-slate-800 bg-slate-950/95 p-8 shadow-glow">
                <h3 className="text-2xl font-semibold text-white">{editSchool ? 'Modifier l’établissement' : 'Créer un établissement'}</h3>
                <form onSubmit={editSchool ? handleUpdateSchool : handleCreateSchool} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm text-slate-400">Nom</label>
                    <input
                      value={activeForm.name}
                      onChange={(event) => handleFormChange('name', event.target.value)}
                      className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-white outline-none focus:border-accent"
                      placeholder="École Sainte-Marie"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400">Type</label>
                    <select
                      value={activeForm.type}
                      onChange={(event) => handleFormChange('type', event.target.value)}
                      className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-white outline-none focus:border-accent"
                    >
                      {SCHOOL_TYPES.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400">Plan</label>
                    <select
                      value={activeForm.plan}
                      onChange={(event) => handleFormChange('plan', event.target.value)}
                      className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-white outline-none focus:border-accent"
                    >
                      {PLAN_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400">Ville</label>
                    <input
                      value={activeForm.city}
                      onChange={(event) => handleFormChange('city', event.target.value)}
                      className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-white outline-none focus:border-accent"
                      placeholder="Cotonou"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400">Département</label>
                    <input
                      value={activeForm.department}
                      onChange={(event) => handleFormChange('department', event.target.value)}
                      className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-white outline-none focus:border-accent"
                      placeholder="Atlantique"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400">Commune</label>
                    <input
                      value={activeForm.commune}
                      onChange={(event) => handleFormChange('commune', event.target.value)}
                      className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-white outline-none focus:border-accent"
                      placeholder="Godomey"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400">Adresse</label>
                    <input
                      value={activeForm.address}
                      onChange={(event) => handleFormChange('address', event.target.value)}
                      className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-white outline-none focus:border-accent"
                      placeholder="Rue des Écoles"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400">Site web</label>
                    <input
                      value={activeForm.website_url}
                      onChange={(event) => handleFormChange('website_url', event.target.value)}
                      className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-white outline-none focus:border-accent"
                      placeholder="https://sainte-marie.edu"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400">Description</label>
                    <textarea
                      value={activeForm.description}
                      onChange={(event) => handleFormChange('description', event.target.value)}
                      className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-white outline-none focus:border-accent"
                      rows={4}
                      placeholder="Description de l'établissement"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button type="submit" className="inline-flex flex-1 items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-accent/90">
                      {editSchool ? 'Enregistrer la mise à jour' : 'Créer l’établissement'}
                    </button>
                    {editSchool && (
                      <button type="button" onClick={handleCancelEdit} className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-red-500 hover:bg-slate-950/90">
                        Annuler
                      </button>
                    )}
                  </div>
                </form>
              </section>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
