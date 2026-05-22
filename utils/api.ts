import { fetchWithAuth } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchSchools() {
  const res = await fetchWithAuth(`${API_URL}/api/schools/`);
  if (!res.ok) throw new Error('Failed to fetch schools');
  return res.json();
}

export async function createSchool(payload: {
  name: string;
  type: string;
  plan: string;
  city: string;
  commune?: string;
  department?: string;
  country?: string;
  address?: string;
  website_url?: string;
  description?: string;
  ads_enabled?: boolean;
  is_active?: boolean;
}) {
  const res = await fetchWithAuth(`${API_URL}/api/schools/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.detail || 'Impossible de créer l’école.');
  }
  return res.json();
}

export async function updateSchool(id: string, payload: {
  name?: string;
  type?: string;
  plan?: string;
  city?: string;
  commune?: string;
  department?: string;
  country?: string;
  address?: string;
  website_url?: string;
  description?: string;
  ads_enabled?: boolean;
  is_active?: boolean;
}) {
  const res = await fetchWithAuth(`${API_URL}/api/schools/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.detail || 'Impossible de mettre à jour l’école.');
  }
  return res.json();
}

export async function deleteSchool(id: string) {
  const res = await fetchWithAuth(`${API_URL}/api/schools/${id}/`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.detail || 'Impossible de supprimer l’école.');
  }

  return true;
}

export async function fetchUsers() {
  const res = await fetchWithAuth(`${API_URL}/api/users/`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function fetchAuthUser() {
  const res = await fetchWithAuth(`${API_URL}/api/auth/me/`);
  if (!res.ok) throw new Error('Failed to fetch current user');
  return res.json();
}

export async function fetchFaculties() {
  const res = await fetchWithAuth(`${API_URL}/api/faculties/`);
  if (!res.ok) throw new Error('Failed to fetch faculties');
  return res.json();
}

export async function createFaculty(payload: { name: string; school: string }) {
  const res = await fetchWithAuth(`${API_URL}/api/faculties/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.detail || 'Impossible de créer la faculté.');
  }
  return res.json();
}

export async function fetchDepartments() {
  const res = await fetchWithAuth(`${API_URL}/api/departments/`);
  if (!res.ok) throw new Error('Failed to fetch departments');
  return res.json();
}

export async function createDepartment(payload: { name: string; faculty: string }) {
  const res = await fetchWithAuth(`${API_URL}/api/departments/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.detail || 'Impossible de créer le département.');
  }
  return res.json();
}

export async function fetchProgrammes() {
  const res = await fetchWithAuth(`${API_URL}/api/programmes/`);
  if (!res.ok) throw new Error('Failed to fetch programmes');
  return res.json();
}

export async function createProgramme(payload: { name: string; code?: string; department: string }) {
  const res = await fetchWithAuth(`${API_URL}/api/programmes/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.detail || 'Impossible de créer le programme.');
  }
  return res.json();
}

export async function createStudentRequest(payload: { username: string; email: string; password: string; phone?: string; school: string }) {
  const response = await fetch(`${API_URL}/api/student-requests/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail || 'Impossible de soumettre la demande d’inscription.');
  }

  return response.json();
}

export async function fetchStudentRequests() {
  const res = await fetchWithAuth(`${API_URL}/api/student-requests/`);
  if (!res.ok) throw new Error('Failed to fetch student requests');
  return res.json();
}

export async function approveStudentRequest(requestId: string, comment?: string) {
  const res = await fetchWithAuth(`${API_URL}/api/student-requests/${requestId}/approve/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ comment }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.detail || 'Impossible de valider la demande.');
  }
  return res.json();
}

export async function rejectStudentRequest(requestId: string, comment?: string) {
  const res = await fetchWithAuth(`${API_URL}/api/student-requests/${requestId}/reject/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ comment }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.detail || 'Impossible de refuser la demande.');
  }
  return res.json();
}

export async function registerUser(username: string, email: string, password: string, role: string, matricule: string) {
  const response = await fetch(`${API_URL}/api/auth/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password, role, matricule }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail || 'Impossible de créer le compte.');
  }

  return response.json();
}

export async function createUser(payload: { username: string; email: string; password: string; role: string; matricule: string; school?: string }) {
  const response = await fetchWithAuth(`${API_URL}/api/users/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail || 'Impossible de créer le compte.');
  }

  return response.json();
}

export async function fetchClasses() {
  const res = await fetchWithAuth(`${API_URL}/api/classes/`);
  if (!res.ok) throw new Error('Failed to fetch classes');
  return res.json();
}

export async function createClass(payload: { school: string; name: string; grade: string; teacher: string; capacity: number }) {
  const res = await fetchWithAuth(`${API_URL}/api/classes/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.detail || 'Impossible de créer la classe.');
  }
  return res.json();
}

export async function fetchAttendance() {
  const res = await fetchWithAuth(`${API_URL}/api/attendance/`);
  if (!res.ok) throw new Error('Failed to fetch attendance');
  return res.json();
}

export async function createAttendance(payload: { school: string; classe: string; student: string; date: string; status: string; note: string }) {
  const res = await fetchWithAuth(`${API_URL}/api/attendance/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.detail || 'Impossible de créer l’enregistrement de présence.');
  }
  return res.json();
}
