/**
 * Routes per la gestione dei ristoranti
 * @module routes/restaurants
 */

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Restaurant = require('../models/Restaurant');
const { protect, authorize } = require('../middleware/auth');

/**
 * @route   GET /api/restaurants
 * @desc    Ottieni tutti i ristoranti
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ attivo: true })
      .populate('proprietario', 'nome cognome email');
    
    res.json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero dei ristoranti',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/restaurants/:id
 * @desc    Ottieni un ristorante specifico
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate('proprietario', 'nome cognome email telefono');
    
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Ristorante non trovato'
      });
    }

    // Aggiungi informazione se il ristorante è aperto
    const restaurantData = restaurant.toObject();
    restaurantData.aperto = restaurant.isOpen();

    res.json({
      success: true,
      data: restaurantData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero del ristorante',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/restaurants
 * @desc    Crea un nuovo ristorante
 * @access  Private (solo ristoratori)
 */
router.post('/', [
  protect,
  authorize('ristoratore'),
  body('nome').trim().notEmpty().withMessage('Il nome è obbligatorio'),
  body('descrizione').trim().notEmpty().withMessage('La descrizione è obbligatoria'),
  body('indirizzo.via').trim().notEmpty().withMessage('La via è obbligatoria'),
  body('indirizzo.citta').trim().notEmpty().withMessage('La città è obbligatoria'),
  body('indirizzo.cap').trim().notEmpty().withMessage('Il CAP è obbligatorio'),
  body('telefono').trim().notEmpty().withMessage('Il telefono è obbligatorio')
], async (req, res) => {
  // Validazione
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    // Aggiungi il proprietario
    req.body.proprietario = req.user.id;

    const restaurant = await Restaurant.create(req.body);

    res.status(201).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nella creazione del ristorante',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/restaurants/:id
 * @desc    Aggiorna un ristorante
 * @access  Private (solo proprietario)
 */
router.put('/:id', protect, authorize('ristoratore'), async (req, res) => {
  try {
    let restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Ristorante non trovato'
      });
    }

    // Verifica che l'utente sia il proprietario
    if (restaurant.proprietario.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorizzato a modificare questo ristorante'
      });
    }

    restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nell\'aggiornamento del ristorante',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/restaurants/:id
 * @desc    Elimina un ristorante
 * @access  Private (solo proprietario)
 */
router.delete('/:id', protect, authorize('ristoratore'), async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Ristorante non trovato'
      });
    }

    // Verifica che l'utente sia il proprietario
    if (restaurant.proprietario.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorizzato a eliminare questo ristorante'
      });
    }

    await restaurant.deleteOne();

    res.json({
      success: true,
      message: 'Ristorante eliminato con successo'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nell\'eliminazione del ristorante',
      error: error.message
    });
  }
});

module.exports = router;
