/**
 * User Model - Modello Mongoose per gli utenti
 * 
 * Definisce lo schema per gli utenti del sistema (clienti e ristoratori)
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
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
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email non valida']
  },
  password: {
    type: String,
    required: [true, 'La password è obbligatoria'],
    minlength: [6, 'La password deve essere di almeno 6 caratteri'],
    select: false // Non includere la password nelle query di default
  },
  ruolo: {
    type: String,
    enum: ['cliente', 'ristoratore'],
    default: 'cliente',
    required: [true, 'Il ruolo è obbligatorio']
  },
  telefono: {
    type: String,
    trim: true
  },
  partitaIVA: {
    type: String,
    trim: true
  },
  indirizzo: {
    via: {
      type: String,
      trim: true
    },
    citta: {
      type: String,
      trim: true
    },
    cap: {
      type: String,
      trim: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indice per ottimizzare le ricerche per email
UserSchema.index({ email: 1 });

/**
 * Middleware pre-save per hashare la password
 */
UserSchema.pre('save', async function(next) {
  // Esegui l'hash solo se la password è stata modificata
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    // Genera salt e hash della password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Metodo per confrontare la password fornita con quella hashata
 * @param {string} passwordInserita - Password in chiaro da verificare
 * @returns {Promise<boolean>} True se la password corrisponde
 */
UserSchema.methods.verificaPassword = async function(passwordInserita) {
  return await bcrypt.compare(passwordInserita, this.password);
};

/**
 * Metodo per ottenere l'oggetto utente senza dati sensibili
 * @returns {object} Oggetto utente pubblico
 */
UserSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);
