/**
 * Dish Model - Modello Mongoose per i piatti
 * 
 * Definisce lo schema per i piatti nel menu dei ristoranti
 */

const mongoose = require('mongoose');

const DishSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Il nome del piatto è obbligatorio'],
    trim: true
  },
  descrizione: {
    type: String,
    trim: true
  },
  prezzo: {
    type: Number,
    required: [true, 'Il prezzo è obbligatorio'],
    min: [0, 'Il prezzo non può essere negativo']
  },
  categoria: {
    type: String,
    required: [true, 'La categoria è obbligatoria'],
    enum: ['antipasto', 'primo', 'secondo', 'contorno', 'dolce', 'bevanda', 'panino', 'pizza'],
    default: 'panino'
  },
  ristorante: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: [true, 'Il ristorante è obbligatorio']
  },
  immagine: {
    type: String,
    default: '/images/dish-default.jpg'
  },
  ingredienti: [{
    type: String,
    trim: true
  }],
  allergeni: [{
    type: String,
    trim: true
  }],
  vegetariano: {
    type: Boolean,
    default: false
  },
  vegano: {
    type: Boolean,
    default: false
  },
  disponibile: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indici per ottimizzare le ricerche
DishSchema.index({ ristorante: 1 });
DishSchema.index({ categoria: 1 });
DishSchema.index({ disponibile: 1 });
DishSchema.index({ vegetariano: 1 });
DishSchema.index({ vegano: 1 });

/**
 * Metodo statico per ottenere i piatti di un ristorante con filtri
 * @param {string} ristoranteId - ID del ristorante
 * @param {object} filtri - Filtri opzionali (categoria, vegetariano, vegano, allergeni)
 * @returns {Promise<Array>} Array di piatti filtrati
 */
DishSchema.statics.getPiattiPerRistorante = async function(ristoranteId, filtri = {}) {
  let query = { ristorante: ristoranteId, disponibile: true };
  
  // Applica filtri opzionali
  if (filtri.categoria) {
    query.categoria = filtri.categoria;
  }
  
  if (filtri.vegetariano === true || filtri.vegetariano === 'true') {
    query.vegetariano = true;
  }
  
  if (filtri.vegano === true || filtri.vegano === 'true') {
    query.vegano = true;
  }
  
  if (filtri.allergeni && filtri.allergeni.length > 0) {
    // Esclude piatti che contengono gli allergeni specificati
    query.allergeni = { $nin: filtri.allergeni };
  }
  
  return await this.find(query).populate('ristorante', 'nome');
};

module.exports = mongoose.model('Dish', DishSchema);
