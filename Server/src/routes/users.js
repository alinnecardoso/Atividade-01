const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Listar todos
router.get('/', async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// Obter por ID
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'não encontrado' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// Criar (matrícula é gerada automaticamente)
router.post('/', async (req, res, next) => {
  try {
    const { nome, curso, endereco } = req.body || {};
    if (!nome || !String(nome).trim()) {
      return res.status(400).json({ error: 'nome é obrigatório' });
    }
    if (!curso || !String(curso).trim()) {
      return res.status(400).json({ error: 'curso é obrigatório' });
    }
    if (!endereco || !endereco.cep || !endereco.logradouro) {
      return res.status(400).json({ error: 'endereco.cep e endereco.logradouro são obrigatórios' });
    }
    const cepDigits = String(endereco.cep || '').replace(/\D/g, '');
    if (cepDigits.length !== 8) {
      return res.status(400).json({ error: 'cep_invalido', message: 'CEP deve ter 8 dígitos' });
    }
    endereco.cep = cepDigits;
    const user = await User.create({ nome, curso, endereco });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

// Atualizar por ID (parcial) — matrícula não pode ser alterada
router.put('/:id', async (req, res, next) => {
  try {
    const allowed = ['nome', 'curso', 'endereco'];
    const update = {};
    for (const key of allowed) {
      if (key in (req.body || {})) update[key] = req.body[key];
    }
    if (Object.keys(update).length === 0) {
      return res.status(400).json({ error: 'nada para atualizar' });
    }
    if (update.endereco && 'cep' in update.endereco) {
      const cepDigits = String(update.endereco.cep || '').replace(/\D/g, '');
      if (cepDigits.length !== 8) {
        return res.status(400).json({ error: 'cep_invalido', message: 'CEP deve ter 8 dígitos' });
      }
      update.endereco.cep = cepDigits;
    }
    const user = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).json({ error: 'não encontrado' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// Deletar por ID
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'não encontrado' });
    res.json({ status: 'deletado' });
  } catch (err) {
    next(err);
  }
});

// Deletar por nome (opcional, compatibilidade)
router.delete('/', async (req, res, next) => {
  try {
    const value = req.body?.nome ?? req.body?.name;
    if (!value || !String(value).trim()) {
      return res.status(400).json({ error: 'nome é obrigatório' });
    }
    const result = await User.deleteOne({ nome: value });
    res.json({ deletedCount: result.deletedCount });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
