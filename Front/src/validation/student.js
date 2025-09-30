export function validateCreate(values) {
  const { nome = '', curso = '', cep = '', logradouro = '', uf = '' } = values || {};
  const errors = { nome: '', curso: '', cep: '', logradouro: '', uf: '' };
  const nomeT = String(nome).trim();
  const cursoT = String(curso).trim();
  const cepDigits = String(cep).replace(/\D/g, '');
  const logT = String(logradouro).trim();
  const ufT = String(uf).trim();
  if (!nomeT) errors.nome = 'Nome é obrigatório';
  else if (nomeT.length < 2) errors.nome = 'Informe ao menos 2 caracteres';
  if (!cursoT) errors.curso = 'Curso é obrigatório';
  if (!cepDigits) errors.cep = 'CEP é obrigatório';
  else if (cepDigits.length !== 8) errors.cep = 'CEP deve ter 8 dígitos';
  if (!logT) errors.logradouro = 'Logradouro é obrigatório';
  if (ufT && !/^[A-Za-z]{2}$/.test(ufT)) errors.uf = 'UF deve ter 2 letras';
  return errors;
}

export function isValid(errors) {
  return Object.values(errors).every((e) => !e);
}

export function validateEdit(editing) {
  const e = editing || {};
  const endereco = e.endereco || {};
  const errors = {
    nome: !String(e.nome || '').trim() ? 'Nome é obrigatório' : '',
    curso: !String(e.curso || '').trim() ? 'Curso é obrigatório' : '',
    cep: (() => {
      const d = String(endereco.cep || '').replace(/\D/g, '');
      if (!d) return 'CEP é obrigatório';
      if (d.length !== 8) return 'CEP deve ter 8 dígitos';
      return '';
    })(),
    logradouro: !String(endereco.logradouro || '').trim() ? 'Logradouro é obrigatório' : '',
    uf: (() => {
      const t = String(endereco.uf || '').trim();
      if (t && !/^[A-Za-z]{2}$/.test(t)) return 'UF deve ter 2 letras';
      return '';
    })(),
  };
  return errors;
}

