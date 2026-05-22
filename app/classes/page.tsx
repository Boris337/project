'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClass, fetchClasses, fetchSchools, fetchUsers } from '../../utils/api';
import { isAuthenticated, logout } from '../../utils/auth';

export default function ClassesPage() {
  const [classes, setClasses] = useState<any[] | null>(null);
  const [schools, setSchools] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  const [newName, setNewName] = useState('');
  const [newGrade, setNewGrade] = useState('');
  const [newCapacity, setNewCapacity] = useState(30);
  const [newSchoolId, setNewSchoolId] = useState('');
  const [newTeacherId, setNewTeacherId] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
      return;
    }

    async function loadData() {
      setLoading(true);
      setError('');

      try {
        const [classesData, schoolsData, usersData] = await Promise.all([
          fetchClasses(),
          fetchSchools(),
          fetchUsers(),
        ]);
        setClasses(Array.isArray(classesData) ? classesData : []);
        setSchools(Array.isArray(schoolsData) ? schoolsData : []);
        const teachersList = Array.isArray(usersData)
          ? usersData.filter((user) => ['ENSEIGNANT', 'DIRECTEUR'].includes(user.role))
          : [];
        setTeachers(teachersList);

        if (schoolsData.length && !newSchoolId) {
          setNewSchoolId(schoolsData[0].id);
        }
        if (teachersList.length && !newTeacherId) {
          setNewTeacherId(teachersList[0].id);
        }
      } catch (err) {
        setError('Impossible de charger les classes ou les ressources nécessaires.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    setSuccess('');
    setSaving(true);

    if (!newName || !newGrade || !newSchoolId || !newTeacherId) {
      setFormError('Tous les champs sont requis.');
      setSaving(false);
      return;
    }

    try {
      const newClass = await createClass({
        school: newSchoolId,
        name: newName,
        grade: newGrade,
        teacher: newTeacherId,
        capacity: newCapacity,
      });
      setClasses((prev) => (prev ? [newClass, ...prev] : [newClass]));
      setSuccess('Classe créée avec succès.');
      setNewName('');
      setNewGrade('');
      setNewCapacity(30);
    } catch (err: unknown) {
      setFormError((err as Error)?.message || 'Impossible de créer la classe.');
    } finally {
      setSaving(false);
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
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Classes</p>
                <h1 className="mt-4 text-4xl font-semibold text-white">Vue des classes</h1>
                <p className="mt-3 max-w-2xl text-slate-400">Gérez les effectifs, les professeurs et les groupes avec un tableau clair.</p>
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

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-[2rem] border border-slate-800 bg-slate-950/95 p-8 shadow-glow">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-semibold text-white">Classes actives</h2>
                  <p className="mt-2 text-slate-400">Liste des salles et des enseignants responsables.</p>
                </div>
                <span className="rounded-full bg-slate-900/80 px-4 py-2 text-sm text-slate-300">{loading ? '...' : Array.isArray(classes) ? classes.length : 0} classes</span>
              </div>

              <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-900/80">
                <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] gap-0 border-b border-slate-800 bg-slate-950/90 px-6 py-4 text-sm uppercase tracking-[0.3em] text-slate-500">
                  <div>Classe</div>
                  <div>Niveau</div>
                  <div>Enseignant</div>
                  <div>Capacité</div>
                </div>
                {loading ? (
                  <div className="p-8 text-slate-400">Chargement des classes…</div>
                ) : Array.isArray(classes) && classes.length > 0 ? (
                  classes.map((classe) => (
                    <div key={classe.id} className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] gap-0 border-b border-slate-800 px-6 py-5 text-sm text-slate-200 transition hover:bg-slate-950/80">
                      <div>{classe.name}</div>
                      <div>{classe.grade}</div>
                      <div>{classe.teacher_name || classe.teacher || 'N/A'}</div>
                      <div>{classe.capacity}</div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-slate-400">Aucune classe disponible pour le moment.</div>
                )}
              </div>
            </section>

            <aside className="rounded-[2rem] border border-slate-800 bg-slate-950/90 p-8 shadow-glow">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Créer une classe</p>
              <h3 className="mt-4 text-2xl font-semibold text-white">Ajouter un groupe rapidement</h3>
              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="school" className="block text-sm font-medium text-slate-300">École</label>
                  <select
                    id="school"
                    value={newSchoolId}
                    onChange={(e) => setNewSchoolId(e.target.value)}
                    className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-900 px-5 py-4 text-base text-slate-100 outline-none transition focus:border-accent/80 focus:ring-2 focus:ring-accent/20"
                  >
                    {schools.map((school) => (
                      <option key={school.id} value={school.id}>
                        {school.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="teacher" className="block text-sm font-medium text-slate-300">Enseignant</label>
                  <select
                    id="teacher"
                    value={newTeacherId}
                    onChange={(e) => setNewTeacherId(e.target.value)}
                    className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-900 px-5 py-4 text-base text-slate-100 outline-none transition focus:border-accent/80 focus:ring-2 focus:ring-accent/20"
                  >
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.username}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300">Nom de la classe</label>
                  <input
                    id="name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-900 px-5 py-4 text-base text-slate-100 outline-none transition focus:border-accent/80 focus:ring-2 focus:ring-accent/20"
                    placeholder="Ex. 6ème A"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="grade" className="block text-sm font-medium text-slate-300">Niveau</label>
                  <input
                    id="grade"
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-900 px-5 py-4 text-base text-slate-100 outline-none transition focus:border-accent/80 focus:ring-2 focus:ring-accent/20"
                    placeholder="Ex. Cycle 3"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="capacity" className="block text-sm font-medium text-slate-300">Capacité</label>
                  <input
                    id="capacity"
                    type="number"
                    min={1}
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(Number(e.target.value))}
                    className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-900 px-5 py-4 text-base text-slate-100 outline-none transition focus:border-accent/80 focus:ring-2 focus:ring-accent/20"
                    required
                  />
                </div>
                {formError && <div className="rounded-3xl border border-red-700/30 bg-red-950/80 px-4 py-3 text-sm text-red-300">{formError}</div>}
                {success && <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{success}</div>}
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-3xl bg-accent px-5 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-accent/20 transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? 'Enregistrement…' : 'Créer la classe'}
                </button>
              </form>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
