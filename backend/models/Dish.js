/**
 * Modello Dish - Gestisce i piatti del menu
 * @module backend/models/Dish
 */

const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Il nome del piatto è obbligatorio'],
    trim: true
  },
  descrizione: {
    type: String,
    required: [true, 'La descrizione è obbligatoria'],
    maxlength: [300, 'La descrizione non può superare 300 caratteri']
  },
  ristorante: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  categoria: {
    type: String,
    required: [true, 'La categoria è obbligatoria'],
    enum: ['antipasti', 'primi', 'secondi', 'contorni', 'dessert', 'bevande', 'panini', 'pizze', 'insalate']
  },
  prezzo: {
    type: Number,
    required: [true, 'Il prezzo è obbligatorio'],
    min: [0, 'Il prezzo non può essere negativo']
  },
  ingredienti: [{
    type: String,
    trim: true
  }],
  allergeni: [{
    type: String,
    enum: ['glutine', 'crostacei', 'uova', 'pesce', 'arachidi', 'soia', 'latte', 'frutta_a_guscio', 'sedano', 'senape', 'sesamo', 'solfiti', 'lupini', 'molluschi'],
    trim: true
  }],
  immagine: {
    type: String,
    default: '/images/dish-default.jpg'
  },
  disponibile: {
    type: Boolean,
    default: true
  },
  vegetariano: {
    type: Boolean,
    default: false
  },
  vegano: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indice per migliorare le ricerche per ristorante e categoria
dishSchema.index({ ristorante: 1, categoria: 1 });

module.exports = mongoose.model('Dish', dishSchema);
