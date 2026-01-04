/**
 * Order Model - Modello Mongoose per gli ordini
 * 
 * Definisce lo schema per gli ordini effettuati dai clienti
 */

const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Il cliente è obbligatorio']
  },
  ristorante: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: [true, 'Il ristorante è obbligatorio']
  },
  piatti: [{
    piatto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dish',
      required: true
    },
    quantita: {
      type: Number,
      required: true,
      min: [1, 'La quantità deve essere almeno 1']
    },
    prezzoCentesimi: {
      type: Number,
      required: true,
      min: [0, 'Il prezzo non può essere negativo'],
      validate: {
        validator: Number.isInteger,
        message: 'Il prezzo deve essere un numero intero (centesimi)'
      }
    }
  }],
  totaleCentesimi: {
    type: Number,
    required: [true, 'Il totale è obbligatorio'],
    min: [0, 'Il totale non può essere negativo'],
    validate: {
      validator: Number.isInteger,
      message: 'Il totale deve essere un numero intero (centesimi)'
    }
  },
  stato: {
    type: String,
    enum: ['ordinato', 'in preparazione', 'pronto', 'in consegna', 'consegnato', 'completato', 'annullato'],
    default: 'ordinato'
  },
  modalita: {
    type: String,
    enum: ['ritiro', 'consegna'],
    required: [true, 'La modalità è obbligatoria'],
    default: 'ritiro'
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
  note: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indici per ottimizzare le ricerche
OrderSchema.index({ cliente: 1 });
OrderSchema.index({ ristorante: 1 });
OrderSchema.index({ stato: 1 });
OrderSchema.index({ createdAt: -1 });

/**
 * Middleware pre-save per calcolare il totale automaticamente
 */
OrderSchema.pre('save', function(next) {
  if (this.piatti && this.piatti.length > 0) {
    this.totaleCentesimi = this.piatti.reduce((sum, item) => {
      return sum + (item.prezzoCentesimi * item.quantita);
    }, 0);
  }
  next();
});

/**
 * Middleware pre-save per validare l'indirizzo quando modalità è 'consegna'
 */
OrderSchema.pre('save', function(next) {
  if (this.modalita === 'consegna') {
    if (!this.indirizzo || !this.indirizzo.via || !this.indirizzo.citta || !this.indirizzo.cap) {
      return next(new Error('L\'indirizzo completo è obbligatorio per la consegna'));
    }
  }
  next();
});

/**
 * Metodo statico per ottenere gli ordini di un cliente
 * @param {string} clienteId - ID del cliente
 * @param {object} filtri - Filtri opzionali (stato)
 * @returns {Promise<Array>} Array di ordini
 */
OrderSchema.statics.getOrdiniCliente = async function(clienteId, filtri = {}) {
  let query = { cliente: clienteId };
  
  if (filtri.stato) {
    query.stato = filtri.stato;
  }
  
  return await this.find(query)
    .populate('ristorante', 'nome indirizzo')
    .populate('piatti.piatto', 'nome immagine')
    .sort({ createdAt: -1 });
};

/**
 * Metodo statico per ottenere gli ordini di un ristorante
 * @param {string} ristoranteId - ID del ristorante
 * @param {object} filtri - Filtri opzionali (stato)
 * @returns {Promise<Array>} Array di ordini
 */
OrderSchema.statics.getOrdiniRistorante = async function(ristoranteId, filtri = {}) {
  let query = { ristorante: ristoranteId };
  
  if (filtri.stato) {
    query.stato = filtri.stato;
  }
  
  return await this.find(query)
    .populate('cliente', 'nome cognome telefono indirizzo')
    .populate('piatti.piatto', 'nome')
    .sort({ createdAt: -1 });
};

module.exports = mongoose.model('Order', OrderSchema);
