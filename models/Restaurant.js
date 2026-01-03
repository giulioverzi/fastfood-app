/**
 * Modello Restaurant - Gestisce le informazioni dei ristoranti
 * @module models/Restaurant
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
  orarioApertura: {
    type: String,
    default: '11:00'
  },
  orarioChiusura: {
    type: String,
    default: '23:00'
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

/**
 * Verifica se il ristorante è attualmente aperto
 * @returns {boolean} true se il ristorante è aperto
 */
restaurantSchema.methods.isOpen = function() {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const [openHour, openMinute] = this.orarioApertura.split(':').map(Number);
  const [closeHour, closeMinute] = this.orarioChiusura.split(':').map(Number);
  
  const openTime = openHour * 60 + openMinute;
  const closeTime = closeHour * 60 + closeMinute;
  
  // Gestisce il caso in cui il ristorante è aperto oltre la mezzanotte
  // Es: 22:00 - 02:00 (closeTime < openTime)
  if (closeTime < openTime) {
    // Il ristorante è aperto se l'ora corrente è >= orario apertura O < orario chiusura
    return currentTime >= openTime || currentTime <= closeTime;
  }
  
  // Caso normale: aperto nello stesso giorno
  return currentTime >= openTime && currentTime <= closeTime;
};

module.exports = mongoose.model('Restaurant', restaurantSchema);
