'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, logout } from '../../utils/auth';
import {
  createDepartment,
  createFaculty,
  createProgramme,
  fetchDepartments,
  fetchFaculties,
  fetchProgrammes,
  fetchSchools,
} from '../../utils/api';

export default function UniversityAdminPage() {
  const [schools, setSchools] = useState<any[]>([]);
  const [faculties, setFaculties] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [programmes, setProgrammes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [newFacultyName, setNewFacultyName] = useState('');
  const [newFacultySchool, setNewFacultySchool] = useState('');

  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [newDepartmentFaculty, setNewDepartmentFaculty] = useState('');

  const [newProgrammeName, setNewProgrammeName] = useState('');
  const [newProgrammeCode, setNewProgrammeCode] = useState('');
  const [newProgrammeDepartment, setNewProgrammeDepartment] = useState('');

  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
      return;
    }

    Promise.all([fetchSchools(), fetchFaculties(), fetchDepartments(), fetchProgrammes()])
      .then(([schoolData, facultyData, departmentData, programmeData]) => {
        setSchools(Array.isArray(schoolData) ? schoolData : []);
        setFaculties(Array.isArray(facultyData) ? facultyData : []);
        setDepartments(Array.isArray(departmentData) ? departmentData : []);
        setProgrammes(Array.isArray(programmeData) ? programmeData : []);
      })
      .catch(() => setError('Impossible de charger les données universitaires.'))
      .finally(() => setLoading(false));
  }, [router]);

  const refreshData = async () => {
    try {
      setLoading(true);
      const [schoolData, facultyData, departmentData, programmeData] = await Promise.all([
        fetchSchools(),
        fetchFaculties(),
        fetchDepartments(),
        fetchProgrammes(),
      ]);
      setSchools(Array.isArray(schoolData) ? schoolData : []);
      setFaculties(Array.isArray(facultyData) ? facultyData : []);
      setDepartments(Array.isArray(departmentData) ? departmentData : []);
      setProgrammes(Array.isArray(programmeData) ? programmeData : []);
    } catch (err) {
      setError('Impossible de rafraîchir les données universitaires.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFaculty = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!newFacultyName || !newFacultySchool) {
      setError('Le nom de la faculté et l’école sont requis.');
      return;
    }

    try {
      await createFaculty({ name: newFacultyName, school: newFacultySchool });
      setSuccess('Faculté créée avec succès.');
      setNewFacultyName('');
      setNewFacultySchool('');
      refreshData();
    } catch (err) {
      setError((err as Error).message || 'Impossible de créer la faculté.');
    }
  };

  const handleCreateDepartment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!newDepartmentName || !newDepartmentFaculty) {
      setError('Le nom du département et la faculté sont requis.');
      return;
    }

    try {
      await createDepartment({ name: newDepartmentName, faculty: newDepartmentFaculty });
      setSuccess('Département créé avec succès.');
      setNewDepartmentName('');
      setNewDepartmentFaculty('');
      refreshData();
    } catch (err) {
      setError((err as Error).message || 'Impossible de créer le département.');
    }
  };

  const handleCreateProgramme = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!newProgrammeName || !newProgrammeDepartment) {
      setError('Le nom du programme et le département sont requis.');
      return;
    }

    try {
      await createProgramme({ name: newProgrammeName, code: newProgrammeCode, department: newProgrammeDepartment });
      setSuccess('Programme créé avec succès.');
      setNewProgrammeName('');
      setNewProgrammeCode('');
      setNewProgrammeDepartment('');
      refreshData();
    } catch (err) {
      setError((err as Error).message || 'Impossible de créer le programme.');
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
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Université</p>
                <h1 className="mt-4 text-4xl font-semibold text-white">Administration universitaire</h1>
                <p className="mt-3 max-w-2xl text-slate-400">Gérez les facultés, départements et programmes de l’écosystème universitaire.</p>
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
            <div className="rounded-[2rem] border border-red-700/20 bg-red-950/80 px-6 py-4 text-sm text-red-300">{error}</div>
          )}
          {success && (
            <div className="rounded-[2rem] border border-emerald-700/20 bg-emerald-950/80 px-6 py-4 text-sm text-emerald-300">{success}</div>
          )}

          <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            <div className="space-y-6">
              <section className="rounded-[2rem] border border-slate-800 bg-slate-950/95 p-8 shadow-glow">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-semibold text-white">Ressources universitaires</h2>
                    <p className="mt-2 text-slate-400">Facultés, départements et programmes disponibles.</p>
                  </div>
                  <span className="rounded-full bg-slate-900/80 px-4 py-2 text-sm text-slate-300">{loading ? 'Chargement…' : `${faculties.length} facultés`}</span>
                </div>

                <div className="mt-8 space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                      <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Facultés</p>
                      {faculties.length === 0 ? (
                        <p className="mt-4 text-slate-400">Aucune faculté définie.</p>
                      ) : (
                        <ul className="mt-4 space-y-3 text-slate-300">
                          {faculties.slice(0, 5).map((faculty) => (
                            <li key={faculty.id} className="rounded-2xl bg-slate-950/80 p-4">
                              <div className="flex items-center justify-between gap-3">
                                <span>{faculty.name}</span>
                                <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs text-slate-300">{faculty.school_name}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                      <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Départements</p>
                      {departments.length === 0 ? (
                        <p className="mt-4 text-slate-400">Aucun département défini.</p>
                      ) : (
                        <ul className="mt-4 space-y-3 text-slate-300">
                          {departments.slice(0, 5).map((department) => (
                            <li key={department.id} className="rounded-2xl bg-slate-950/80 p-4">
                              <div className="flex items-center justify-between gap-3">
                                <span>{department.name}</span>
                                <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs text-slate-300">{department.faculty_name}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Programmes</p>
                    {programmes.length === 0 ? (
                      <p className="mt-4 text-slate-400">Aucun programme défini.</p>
                    ) : (
                      <ul className="mt-4 space-y-3 text-slate-300">
                        {programmes.slice(0, 5).map((programme) => (
                          <li key={programme.id} className="rounded-2xl bg-slate-950/80 p-4">
                            <div className="flex items-center justify-between gap-3">
                              <span>{programme.name}</span>
                              <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs text-slate-300">{programme.department_name}</span>
                            </div>
                            {programme.code && <p className="mt-2 text-sm text-slate-500">Code: {programme.code}</p>}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <section className="rounded-[2rem] border border-slate-800 bg-slate-950/95 p-8 shadow-glow">
                <h3 className="text-2xl font-semibold text-white">Créer une faculté</h3>
                <form onSubmit={handleCreateFaculty} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm text-slate-400">Nom de la faculté</label>
                    <input
                      value={newFacultyName}
                      onChange={(event) => setNewFacultyName(event.target.value)}
                      className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-white outline-none focus:border-accent"
                      placeholder="Faculté des sciences"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400">École universitaire</label>
                    <select
                      value={newFacultySchool}
                      onChange={(event) => setNewFacultySchool(event.target.value)}
                      className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-white outline-none focus:border-accent"
                    >
                      <option value="">Sélectionner une école</option>
                      {schools.map((school) => (
                        <option key={school.id} value={school.id}>{school.name}</option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="inline-flex w-full items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-accent/90">
                    Ajouter
                  </button>
                </form>
              </section>

              <section className="rounded-[2rem] border border-slate-800 bg-slate-950/95 p-8 shadow-glow">
                <h3 className="text-2xl font-semibold text-white">Créer un département</h3>
                <form onSubmit={handleCreateDepartment} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm text-slate-400">Nom du département</label>
                    <input
                      value={newDepartmentName}
                      onChange={(event) => setNewDepartmentName(event.target.value)}
                      className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-white outline-none focus:border-accent"
                      placeholder="Informatique"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400">Faculté</label>
                    <select
                      value={newDepartmentFaculty}
                      onChange={(event) => setNewDepartmentFaculty(event.target.value)}
                      className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-white outline-none focus:border-accent"
                    >
                      <option value="">Sélectionner une faculté</option>
                      {faculties.map((faculty) => (
                        <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="inline-flex w-full items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-accent/90">
                    Ajouter
                  </button>
                </form>
              </section>

              <section className="rounded-[2rem] border border-slate-800 bg-slate-950/95 p-8 shadow-glow">
                <h3 className="text-2xl font-semibold text-white">Créer un programme</h3>
                <form onSubmit={handleCreateProgramme} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm text-slate-400">Nom du programme</label>
                    <input
                      value={newProgrammeName}
                      onChange={(event) => setNewProgrammeName(event.target.value)}
                      className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-white outline-none focus:border-accent"
                      placeholder="Licence Mathématiques"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400">Code du programme</label>
                    <input
                      value={newProgrammeCode}
                      onChange={(event) => setNewProgrammeCode(event.target.value)}
                      className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-white outline-none focus:border-accent"
                      placeholder="LMAT-01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400">Département</label>
                    <select
                      value={newProgrammeDepartment}
                      onChange={(event) => setNewProgrammeDepartment(event.target.value)}
                      className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-white outline-none focus:border-accent"
                    >
                      <option value="">Sélectionner un département</option>
                      {departments.map((department) => (
                        <option key={department.id} value={department.id}>{department.name}</option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="inline-flex w-full items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-accent/90">
                    Ajouter
                  </button>
                </form>
              </section>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
