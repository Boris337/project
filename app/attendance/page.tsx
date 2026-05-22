'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createAttendance, fetchAttendance, fetchClasses, fetchUsers } from '../../utils/api';
import { isAuthenticated, logout } from '../../utils/auth';

const STATUS_OPTIONS = [
  { value: 'PRESENT', label: 'Présent' },
  { value: 'ABSENT', label: 'Absent' },
  { value: 'RETARD', label: 'Retard' },
];

export default function AttendancePage() {
  const [records, setRecords] = useState<any[] | null>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceStatuses, setAttendanceStatuses] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');
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
        const [attendanceData, classesData, usersData] = await Promise.all([
          fetchAttendance(),
          fetchClasses(),
          fetchUsers(),
        ]);
        setRecords(Array.isArray(attendanceData) ? attendanceData : []);
        setClasses(Array.isArray(classesData) ? classesData : []);
        const studentsList = Array.isArray(usersData)
          ? usersData.filter((user) => user.role === 'ELEVE')
          : [];
        setStudents(studentsList);

        const initialClassId = classesData.length ? classesData[0].id : '';
        setSelectedClassId(initialClassId);

        const initialStudents = studentsList.filter(
          (student) => student.school && classesData.some((classe) => classe.id === initialClassId && classe.school === student.school)
        );
        const statusMap = Object.fromEntries(initialStudents.map((student) => [student.id, 'PRESENT']));
        setAttendanceStatuses(statusMap);
      } catch (err) {
        setError('Impossible de charger les présences ou les ressources nécessaires.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  useEffect(() => {
    const selectedClass = classes.find((classe) => classe.id === selectedClassId);
    if (!selectedClass) return;

    const filtered = students.filter((student) => student.school === selectedClass.school);
    setAttendanceStatuses((prev) => {
      const next = { ...prev };
      filtered.forEach((student) => {
        if (!next[student.id]) {
          next[student.id] = 'PRESENT';
        }
      });
      return next;
    });
  }, [selectedClassId, classes, students]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    setSuccess('');
    setSaving(true);

    const selectedClass = classes.find((item) => item.id === selectedClassId);
    if (!selectedClass) {
      setFormError('Veuillez sélectionner une classe valide.');
      setSaving(false);
      return;
    }

    const selectedStudents = students.filter((student) => student.school === selectedClass.school);
    if (!selectedStudents.length) {
      setFormError('Aucun élève trouvé pour la classe sélectionnée.');
      setSaving(false);
      return;
    }

    const attendancePayload = selectedStudents
      .map((student) => ({
        school: selectedClass.school,
        classe: selectedClassId,
        student: student.id,
        date,
        status: attendanceStatuses[student.id] || 'PRESENT',
        note: attendanceStatuses[student.id] === 'JUSTIFIE' ? 'Absence justifiée' : '',
      }))
      .filter((entry) => entry.status !== 'PRESENT');

    if (!attendancePayload.length) {
      setSuccess('Aucun élève absent ou justifié : tous les élèves sont présents.');
      setSaving(false);
      return;
    }

    try {
      const attendance = await createAttendance(attendancePayload as any);
      setRecords((prev) => (prev ? [...(Array.isArray(attendance) ? attendance : [attendance]), ...prev] : (Array.isArray(attendance) ? attendance : [attendance])));
      setSuccess('Présence enregistrée avec succès.');
      setNote('');
    } catch (err: unknown) {
      setFormError((err as Error)?.message || 'Impossible de créer l’enregistrement de présence.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="relative mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-12">
        <div className="absolute right-0 top-0 h-72 w-[88rem] rounded-full bg-slate-700/10 blur-3xl" />
        <div className="relative space-y-8">
          <header className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Présence</p>
                <h1 className="mt-4 text-4xl font-semibold text-white">Suivi de la présence</h1>
                <p className="mt-3 max-w-2xl text-slate-400">Visualisez les présences quotidiennes et identifiez rapidement les retards ou absences.</p>
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
                  <h2 className="text-3xl font-semibold text-white">Derniers enregistrements</h2>
                  <p className="mt-2 text-slate-400">Un résumé rapide des présences enregistrées.</p>
                </div>
                <span className="rounded-full bg-slate-900/80 px-4 py-2 text-sm text-slate-300">{loading ? '...' : Array.isArray(records) ? records.length : 0}</span>
              </div>

              <div className="mt-8 space-y-4">
                {loading ? (
                  <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-slate-400">Chargement des présences…</div>
                ) : Array.isArray(records) && records.length > 0 ? (
                  records.map((record) => (
                    <article key={record.id} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 transition hover:border-accent/40 hover:bg-slate-950/90">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">{record.classe_name ?? record.classe ?? 'Classe'}</p>
                          <h3 className="mt-3 text-2xl font-semibold text-white">{record.student_name ?? record.student ?? 'Étudiant'}</h3>
                        </div>
                        <span className="rounded-full bg-slate-950/80 px-4 py-2 text-sm font-semibold text-slate-300">{record.status}</span>
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-3 text-sm text-slate-400">
                        <span>Date: {record.date}</span>
                        <span>École: {record.school_name ?? record.school ?? 'N/A'}</span>
                        <span>Note: {record.note || 'Aucune'}</span>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-slate-400">Aucun enregistrement de présence disponible.</div>
                )}
              </div>
            </section>

            <aside className="rounded-[2rem] border border-slate-800 bg-slate-950/90 p-8 shadow-glow">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Ajouter une présence</p>
              <h3 className="mt-4 text-2xl font-semibold text-white">Enregistrer un élève</h3>
              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="classe" className="block text-sm font-medium text-slate-300">Classe</label>
                  <select
                    id="classe"
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-900 px-5 py-4 text-base text-slate-100 outline-none transition focus:border-accent/80 focus:ring-2 focus:ring-accent/20"
                  >
                    {classes.map((classe) => (
                      <option key={classe.id} value={classe.id}>
                        {classe.name} — {classe.grade}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-4">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Liste des élèves</p>
                  <div className="mt-4 space-y-3 max-h-72 overflow-y-auto pr-2">
                    {students.filter((student) => student.school === classes.find((classe) => classe.id === selectedClassId)?.school).length === 0 ? (
                      <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-slate-400">Aucun élève trouvé pour cette classe.</div>
                    ) : (
                      students
                        .filter((student) => student.school === classes.find((classe) => classe.id === selectedClassId)?.school)
                        .map((student) => (
                          <div key={student.id} className="flex items-center justify-between gap-3 rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3">
                            <div>
                              <p className="font-semibold text-white">{student.username}</p>
                              <p className="text-sm text-slate-400">{student.email || 'Email non renseigné'}</p>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {STATUS_OPTIONS.map((option) => (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() => setAttendanceStatuses((prev) => ({ ...prev, [student.id]: option.value }))}
                                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${attendanceStatuses[student.id] === option.value ? 'bg-accent text-slate-950' : 'border border-slate-700 bg-slate-900 text-slate-300 hover:border-accent/40 hover:bg-slate-950/90'}`}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-slate-300">Date</label>
                  <input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-900 px-5 py-4 text-base text-slate-100 outline-none transition focus:border-accent/80 focus:ring-2 focus:ring-accent/20"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="note" className="block text-sm font-medium text-slate-300">Commentaire (optionnel)</label>
                  <textarea
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-900 px-5 py-4 text-base text-slate-100 outline-none transition focus:border-accent/80 focus:ring-2 focus:ring-accent/20"
                    rows={4}
                    placeholder="Ajouter un commentaire sur la séance de présence"
                  />
                </div>

                {formError && <div className="rounded-3xl border border-red-700/30 bg-red-950/80 px-4 py-3 text-sm text-red-300">{formError}</div>}
                {success && <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{success}</div>}

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-3xl bg-accent px-5 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-accent/20 transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? 'Enregistrement…' : 'Enregistrer la présence'}
                </button>
              </form>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
