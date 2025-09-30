import { apiFetch } from './http';

export async function listUsers() {
  const res = await apiFetch('/usuarios');
  if (!res.ok) throw new Error('Falha ao carregar');
  return res.json();
}

export async function createUser(payload) {
  const res = await apiFetch('/usuarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    try {
      const err = await res.json();
      throw new Error(err?.message || 'Falha ao salvar');
    } catch {
      throw new Error('Falha ao salvar');
    }
  }
  return res.json();
}

export async function updateUser(id, payload) {
  const res = await apiFetch(`/usuarios/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    try {
      const err = await res.json();
      throw new Error(err?.message || 'Falha ao atualizar');
    } catch {
      throw new Error('Falha ao atualizar');
    }
  }
  return res.json();
}

export async function deleteUser(id) {
  const res = await apiFetch(`/usuarios/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Falha ao excluir');
  return res.json();
}
