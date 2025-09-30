const express = require('express');

const router = express.Router();

// Util simples de timeout para fetch
async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const id = setTimeout(() => controller && controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...(options || {}), signal: controller ? controller.signal : undefined });
    return res;
  } finally {
    clearTimeout(id);
  }
}

// GET /viacep/:cep — proxy para ViaCEP com mapeamento de campos
router.get('/:cep', async (req, res, next) => {
  try {
    const cepRaw = String(req.params.cep || '').replace(/\D/g, '');
    if (!cepRaw || cepRaw.length !== 8) {
      return res.status(400).json({ error: 'cep_invalido', message: 'CEP deve ter 8 dígitos' });
    }

    const url = `https://viacep.com.br/ws/${cepRaw}/json/`;
    const response = await fetchWithTimeout(url, {}, 8000);
    if (!response.ok) {
      return res.status(502).json({ error: 'via_cep_falhou', status: response.status });
    }
    const data = await response.json();
    if (data.erro) {
      return res.status(404).json({ error: 'cep_nao_encontrado' });
    }

    // Mapeia para os campos do nosso schema
    const mapped = {
      cep: data.cep || cepRaw,
      logradouro: data.logradouro || '',
      complemento: data.complemento || '',
      bairro: data.bairro || '',
      cidade: data.localidade || '',
      uf: (data.uf || '').toUpperCase(),
    };

    res.json(mapped);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

