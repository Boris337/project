'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { approveStudentRequest, createUser, fetchAuthUser, fetchSchools, fetchStudentRequests, fetchUsers, rejectStudentRequest } from '../../utils/api';
import { isAuthenticated, logout } from '../../utils/auth';

const roles = [
  { value: 'SUPERADMIN', label: 'Superadmin' },
  { value: 'DIRECTEUR', label: 'Directeur' },
  { value: 'ENSEIGNANT', label: 'Enseignant' },
  { value: 'ELEVE', label: 'Élève' },
];

export default function UsersPage() {
  const [users, setUsers] = useState<any[] | null>(null);
  const [schools, setSchools] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('DIRECTEUR');
  const [matricule, setMatricule] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setError('');

      try {
        const [authUser, usersData, schoolsData, requestsData] = await Promise.all([
          fetchAuthUser(),
          fetchUsers(),
          fetchSchools(),
          fetchStudentRequests(),
        ]);
        setCurrentUser(authUser);
        setUsers(Array.isArray(usersData) ? usersData : []);
        setSchools(Array.isArray(schoolsData) ? schoolsData : []);
        setPendingRequests(Array.isArray(requestsData) ? requestsData : []);
      } catch (err) {
        setError('Impossible de récupérer les données de gestion des utilisateurs.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    setSuccess('');
    setSaving(true);

    if (!username.trim() || !email.trim() || !password.trim()) {
      setFormError('Les champs identifiant, email et mot de passe sont obligatoires.');
      setSaving(false);
      return;
    }

    if (['DIRECTEUR', 'ENSEIGNANT', 'ELEVE'].includes(role) && !schoolId) {
      setFormError('Vous devez sélectionner une école pour ce rôle.');
      setSaving(false);
      return;
    }

    try {
      await createUser({
        username: username.trim(),
        email: email.trim(),
        password,
        role,
        matricule: matricule.trim(),
        school: schoolId || undefined,
      });
      const usersData = await fetchUsers();
      setUsers(Array.isArray(usersData) ? usersData : []);
      setSuccess('Profil utilisateur créé avec succès.');
      setUsername('');
      setEmail('');
      setPassword('');
      setMatricule('');
      setSchoolId('');
    } catch (err: unknown) {
      setFormError((err as Error)?.message || 'Impossible de créer le profil.');
    } finally {
      setSaving(false);
    }
  };

  const refreshRequests = async () => {
    try {
      const requestsData = await fetchStudentRequests();
      setPendingRequests(Array.isArray(requestsData) ? requestsData : []);
    } catch {
      // ignore failure here, keep existing data
    }
  };

  const handleApprove = async (requestId: string) => {
    setError('');
    try {
      await approveStudentRequest(requestId);
      await refreshRequests();
      setSuccess('Demande validée. L’élève est désormais actif.');
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Impossible de valider la demande.');
    }
  };

  const handleReject = async (requestId: string) => {
    setError('');
    try {
      await rejectStudentRequest(requestId);
      await refreshRequests();
      setSuccess('Demande refusée.');
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Impossible de refuser la demande.');
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
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Utilisateurs</p>
                <h1 className="mt-4 text-4xl font-semibold text-white">Gestion des profils</h1>
                <p className="mt-3 max-w-2xl text-slate-400">Liste des comptes de l’établissement et création rapide de nouveaux profils.</p>
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

          <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
            <section className="rounded-[2rem] border border-slate-800 bg-slate-950/95 p-8 shadow-glow">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-semibold text-white">Profils utilisateurs</h2>
                  <p className="mt-2 text-slate-400">Tous les comptes enregistrés dans l’application.</p>
                </div>
                <span className="rounded-full bg-slate-900/80 px-4 py-2 text-sm text-slate-300">{loading ? '...' : Array.isArray(users) ? users.length : 0} profils</span>
              </div>

              <div className="mt-8 space-y-4">
                {loading ? (
                  <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-slate-400">Chargement des profils…</div>
                ) : Array.isArray(users) && users.length > 0 ? (
                  users.map((user) => (
                    <article key={user.id} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 transition hover:border-accent/40 hover:bg-slate-950/90">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-2xl font-semibold text-white">{user.username}</h3>
                          <p className="mt-2 text-slate-400">{user.email || 'Email non renseigné'}</p>
                        </div>
                        <div className="space-y-1 text-sm text-slate-300">
                          <p>Rôle: <span className="font-semibold text-white">{user.role}</span></p>
                          <p>École: <span className="font-semibold text-white">{user.school_name || 'Aucune'}</span></p>
                          <p>Statut: <span className="font-semibold text-white">{user.is_active ? 'Actif' : 'Inactif'}</span></p>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-slate-400">Aucun profil trouvé.</div>
                )}
              </div>
              {currentUser && ['SUPERADMIN', 'DIRECTEUR'].includes(currentUser.role) && (
                <div className="mt-10 rounded-[2rem] border border-slate-800 bg-slate-950/90 p-8 shadow-glow">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-semibold text-white">Demandes d'inscription</h3>
                      <p className="mt-2 text-slate-400">Validez ou refusez les demandes des élèves pour votre établissement.</p>
                    </div>
                    <span className="rounded-full bg-slate-900/80 px-4 py-2 text-sm text-slate-300">{pendingRequests.length} en attente</span>
                  </div>
                  <div className="mt-6 space-y-4">
                    {pendingRequests.length === 0 ? (
                      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-slate-400">Aucune demande en attente.</div>
                    ) : (
                      pendingRequests.map((request) => (
                        <article key={request.id} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 transition hover:border-accent/40 hover:bg-slate-950/90">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <h4 className="text-xl font-semibold text-white">{request.username}</h4>
                              <p className="mt-2 text-slate-400">{request.email}</p>
                              <p className="mt-1 text-sm text-slate-400">École: {request.school_name}</p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                              <button
                                type="button"
                                onClick={() => handleApprove(request.id)}
                                className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                              >
                                Valider
                              </button>
                              <button
                                type="button"
                                onClick={() => handleReject(request.id)}
                                className="rounded-full border border-red-700 bg-transparent px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-700/10"
                              >
                                Refuser
                              </button>
                            </div>
                          </div>
                        </article>
                      ))
                    )}
                  </div>
                </div>
              )}
            </section>

            <aside className="rounded-[2rem] border border-slate-800 bg-slate-950/90 p-8 shadow-glow">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Créer un profil</p>
              <h3 className="mt-4 text-2xl font-semibold text-white">Ajouter un utilisateur</h3>
              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-slate-300">Nom d'utilisateur</label>
                  <input
                    id="username"
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
                  <label htmlFor="role" className="block text-sm font-medium text-slate-300">Rôle</label>
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
                  <label htmlFor="school" className="block text-sm font-medium text-slate-300">École</label>
                  <select
                    id="school"
                    value={schoolId}
                    onChange={(e) => setSchoolId(e.target.value)}
                    className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-900 px-5 py-4 text-base text-slate-100 outline-none transition focus:border-accent/80 focus:ring-2 focus:ring-accent/20"
                  >
                    <option value="">Choisissez une école</option>
                    {Array.isArray(schools) && schools.map((school) => (
                      <option key={school.id} value={school.id}>
                        {school.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="matricule" className="block text-sm font-medium text-slate-300">Matricule</label>
                  <input
                    id="matricule"
                    value={matricule}
                    onChange={(e) => setMatricule(e.target.value)}
                    className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-900 px-5 py-4 text-base text-slate-100 outline-none transition focus:border-accent/80 focus:ring-2 focus:ring-accent/20"
                  />
                </div>
                {formError && <div className="rounded-3xl border border-red-700/30 bg-red-950/80 px-4 py-3 text-sm text-red-300">{formError}</div>}
                {success && <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{success}</div>}
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-3xl bg-accent px-5 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-accent/20 transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? 'Création…' : 'Créer le profil'}
                </button>
              </form>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
