/**
 * Routes per la gestione dei piatti
 * @module routes/dishes
 */

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Dish = require('../models/Dish');
const Restaurant = require('../models/Restaurant');
const { protect, authorize } = require('../middleware/auth');

/**
 * @route   GET /api/dishes
 * @desc    Ottieni tutti i piatti (con filtri opzionali)
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    let query = { disponibile: true };

    // Filtro per ristorante
    if (req.query.ristorante) {
      query.ristorante = req.query.ristorante;
    }

    // Filtro per categoria
    if (req.query.categoria) {
      query.categoria = req.query.categoria;
    }

    // Filtro per allergeni (escludi piatti con questi allergeni)
    if (req.query.escludiAllergeni) {
      const allergeni = req.query.escludiAllergeni.split(',');
      query.allergeni = { $nin: allergeni };
    }

    // Filtro vegetariano/vegano
    if (req.query.vegetariano === 'true') {
      query.vegetariano = true;
    }
    if (req.query.vegano === 'true') {
      query.vegano = true;
    }

    const dishes = await Dish.find(query)
      .populate('ristorante', 'nome');

    res.json({
      success: true,
      count: dishes.length,
      data: dishes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero dei piatti',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/dishes/:id
 * @desc    Ottieni un piatto specifico
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id)
      .populate('ristorante', 'nome indirizzo telefono');

    if (!dish) {
      return res.status(404).json({
        success: false,
        message: 'Piatto non trovato'
      });
    }

    res.json({
      success: true,
      data: dish
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero del piatto',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/dishes
 * @desc    Crea un nuovo piatto
 * @access  Private (solo ristoratori)
 */
router.post('/', [
  protect,
  authorize('ristoratore'),
  body('nome').trim().notEmpty().withMessage('Il nome è obbligatorio'),
  body('descrizione').trim().notEmpty().withMessage('La descrizione è obbligatoria'),
  body('ristorante').notEmpty().withMessage('Il ristorante è obbligatorio'),
  body('categoria').isIn(['antipasti', 'primi', 'secondi', 'contorni', 'dessert', 'bevande', 'panini', 'pizze', 'insalate']).withMessage('Categoria non valida'),
  body('prezzo').isFloat({ min: 0 }).withMessage('Il prezzo deve essere maggiore di 0')
], async (req, res) => {
  // Validazione
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    // Verifica che il ristorante appartenga all'utente
    const restaurant = await Restaurant.findById(req.body.ristorante);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Ristorante non trovato'
      });
    }

    if (restaurant.proprietario.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorizzato a creare piatti per questo ristorante'
      });
    }

    const dish = await Dish.create(req.body);

    res.status(201).json({
      success: true,
      data: dish
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nella creazione del piatto',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/dishes/:id
 * @desc    Aggiorna un piatto
 * @access  Private (solo proprietario del ristorante)
 */
router.put('/:id', protect, authorize('ristoratore'), async (req, res) => {
  try {
    let dish = await Dish.findById(req.params.id).populate('ristorante');

    if (!dish) {
      return res.status(404).json({
        success: false,
        message: 'Piatto non trovato'
      });
    }

    // Verifica che l'utente sia il proprietario del ristorante
    if (dish.ristorante.proprietario.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorizzato a modificare questo piatto'
      });
    }

    dish = await Dish.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      data: dish
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nell\'aggiornamento del piatto',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/dishes/:id
 * @desc    Elimina un piatto
 * @access  Private (solo proprietario del ristorante)
 */
router.delete('/:id', protect, authorize('ristoratore'), async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id).populate('ristorante');

    if (!dish) {
      return res.status(404).json({
        success: false,
        message: 'Piatto non trovato'
      });
    }

    // Verifica che l'utente sia il proprietario del ristorante
    if (dish.ristorante.proprietario.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorizzato a eliminare questo piatto'
      });
    }

    await dish.deleteOne();

    res.json({
      success: true,
      message: 'Piatto eliminato con successo'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nell\'eliminazione del piatto',
      error: error.message
    });
  }
});

module.exports = router;
