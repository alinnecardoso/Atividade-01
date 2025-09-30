const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// DB
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/FatecVotorantim';

// Evita que as queries fiquem "presas" quando o MongoDB não está disponível,
// falhando rapidamente para que o cliente receba erro ao invés de timeout.
mongoose.set('bufferCommands', false);
mongoose
  .connect(mongoUrl, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => console.error('Erro na conexão:', err && err.message ? err.message : err));

// Rotas
const usersRouter = require('./routes/users');
const viacepRouter = require('./routes/viacep');
app.use('/usuarios', usersRouter);
app.use('/viacep', viacepRouter);

// Healthcheck
app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

// Tratamento de erro
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'internal_error', message: err.message || 'Erro interno' });
});

module.exports = app;
