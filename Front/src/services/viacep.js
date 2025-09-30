import { apiFetch } from './http';

export async function fetchCep(cep) {
  const digits = String(cep || '').replace(/\D/g, '');
  if (digits.length !== 8) throw new Error('CEP inválido');
  const res = await apiFetch(`/viacep/${digits}`);
  if (!res.ok) throw new Error('Não foi possível consultar o CEP');
  const data = await res.json();
  if (data.error) throw new Error('CEP não encontrado');
  return {
    cep: String(data.cep || digits).replace(/\D/g, ''),
    logradouro: data.logradouro || '',
    complemento: data.complemento || '',
    bairro: data.bairro || '',
    cidade: data.cidade || '',
    uf: (data.uf || '').toUpperCase(),
  };
}

