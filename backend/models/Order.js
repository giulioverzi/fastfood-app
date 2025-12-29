/**
 * Modello Order - Gestisce gli ordini dei clienti
 * @module backend/models/Order
 */

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ristorante: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
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
      min: 1,
      default: 1
    },
    prezzo: {
      type: Number,
      required: true
    },
    note: String
  }],
  totale: {
    type: Number,
    required: true,
    min: 0
  },
  stato: {
    type: String,
    enum: ['ordinato', 'in_preparazione', 'pronto', 'in_consegna', 'consegnato', 'completato', 'annullato'],
    default: 'ordinato'
  },
  modalitaConsegna: {
    type: String,
    enum: ['ritiro', 'consegna'],
    required: true,
    default: 'ritiro'
  },
  indirizzoConsegna: {
    via: String,
    citta: String,
    cap: String
  },
  note: {
    type: String,
    maxlength: [200, 'Le note non possono superare 200 caratteri']
  },
  dataOrdine: {
    type: Date,
    default: Date.now
  },
  dataCompletamento: {
    type: Date
  }
});

// Indice per migliorare le ricerche per cliente e ristorante
orderSchema.index({ cliente: 1, dataOrdine: -1 });
orderSchema.index({ ristorante: 1, dataOrdine: -1 });

module.exports = mongoose.model('Order', orderSchema);
