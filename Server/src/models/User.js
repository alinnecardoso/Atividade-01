const mongoose = require('mongoose');
const Counter = require('./Counter');

const EnderecoSchema = new mongoose.Schema(
  {
    cep: {
      type: String,
      required: true,
      trim: true,
      set: (v) => String(v || '').replace(/\D/g, ''),
      validate: {
        validator: (v) => /^[0-9]{8}$/.test(String(v || '')),
        message: 'CEP deve ter 8 dígitos',
      },
    },
    logradouro: { type: String, required: true, trim: true },
    numero: { type: String, trim: true },
    complemento: { type: String, trim: true },
    bairro: { type: String, trim: true },
    cidade: { type: String, trim: true },
    uf: { type: String, trim: true, uppercase: true, minlength: 2, maxlength: 2 },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    matricula: { type: Number, unique: true, index: true },
    nome: { type: String, required: true, trim: true },
    curso: { type: String, required: true, trim: true },
    endereco: { type: EnderecoSchema, required: true },
  },
  { timestamps: true }
);

// Gera matrícula incremental se não fornecida
UserSchema.pre('save', async function genMatricula(next) {
  try {
    if (this.isNew && (this.matricula === undefined || this.matricula === null)) {
      const counter = await Counter.findOneAndUpdate(
        { key: 'usuarios' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.matricula = counter.seq;
    }
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

module.exports = mongoose.model('Usuario', UserSchema);
