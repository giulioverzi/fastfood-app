/**
 * Modello Restaurant - Gestisce le informazioni dei ristoranti
 * @module backend/models/Restaurant
 */

const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Il nome del ristorante è obbligatorio'],
    trim: true,
    unique: true
  },
  descrizione: {
    type: String,
    required: [true, 'La descrizione è obbligatoria'],
    maxlength: [500, 'La descrizione non può superare 500 caratteri']
  },
  proprietario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  indirizzo: {
    via: {
      type: String,
      required: true
    },
    citta: {
      type: String,
      required: true
    },
    cap: {
      type: String,
      required: true
    },
    coordinate: {
      lat: Number,
      lng: Number
    }
  },
  telefono: {
    type: String,
    required: [true, 'Il telefono è obbligatorio']
  },
  orariApertura: {
    type: String,
    default: 'Lun-Dom: 11:00-23:00'
  },
  immagine: {
    type: String,
    default: '/images/restaurant-default.jpg'
  },
  valutazione: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  attivo: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
