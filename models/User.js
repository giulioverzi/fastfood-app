/**
 * Modello User - Gestisce utenti (Clienti e Ristoratori)
 * @module models/User
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Il nome è obbligatorio'],
    trim: true
  },
  cognome: {
    type: String,
    required: [true, 'Il cognome è obbligatorio'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'L\'email è obbligatoria'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Inserisci un\'email valida']
  },
  password: {
    type: String,
    required: [true, 'La password è obbligatoria'],
    minlength: [6, 'La password deve contenere almeno 6 caratteri'],
    select: false
  },
  ruolo: {
    type: String,
    enum: ['cliente', 'ristoratore'],
    default: 'cliente',
    required: true
  },
  telefono: {
    type: String,
    trim: true
  },
  indirizzo: {
    via: String,
    citta: String,
    cap: String
  },
  partitaIVA: {
    type: String,
    trim: true,
    // Partita IVA è obbligatoria solo per ristoratori, verrà validata a livello di route
    validate: {
      validator: function(v) {
        // Se è presente, deve essere 11 cifre
        if (v && v.length > 0) {
          return /^\d{11}$/.test(v);
        }
        return true;
      },
      message: 'La Partita IVA deve essere di 11 cifre'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Cripta la password prima di salvare
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Metodo per confrontare le password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
