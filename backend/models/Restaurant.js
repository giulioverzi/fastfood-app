/**
 * Restaurant Model - Modello Mongoose per i ristoranti
 * 
 * Definisce lo schema per i ristoranti gestiti dai ristoratori
 */

const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Il nome del ristorante è obbligatorio'],
    trim: true
  },
  descrizione: {
    type: String,
    trim: true
  },
  proprietario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Il proprietario è obbligatorio']
  },
  indirizzo: {
    via: {
      type: String,
      trim: true,
      required: [true, 'La via è obbligatoria']
    },
    citta: {
      type: String,
      trim: true,
      required: [true, 'La città è obbligatoria']
    },
    cap: {
      type: String,
      trim: true,
      required: [true, 'Il CAP è obbligatorio']
    }
  },
  telefono: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email non valida']
  },
  orari: {
    lunedi: { type: String, default: 'Chiuso' },
    martedi: { type: String, default: 'Chiuso' },
    mercoledi: { type: String, default: 'Chiuso' },
    giovedi: { type: String, default: 'Chiuso' },
    venerdi: { type: String, default: 'Chiuso' },
    sabato: { type: String, default: 'Chiuso' },
    domenica: { type: String, default: 'Chiuso' }
  },
  immagine: {
    type: String,
    default: '/images/restaurant-default.jpg'
  },
  categoria: {
    type: String,
    trim: true,
    default: 'Fast Food'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indici per ottimizzare le ricerche
RestaurantSchema.index({ proprietario: 1 });
RestaurantSchema.index({ nome: 1 });
RestaurantSchema.index({ 'indirizzo.citta': 1 });

/**
 * Middleware pre-remove per eliminare tutti i piatti associati
 */
RestaurantSchema.pre('remove', async function(next) {
  try {
    // Elimina tutti i piatti associati al ristorante
    await this.model('Dish').deleteMany({ ristorante: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);
