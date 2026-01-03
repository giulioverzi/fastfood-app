/**
 * Dishes Routes - Route per la gestione dei piatti
 * 
 * Gestisce CRUD dei piatti nel menu
 */

const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const Dish = require('../models/Dish');
const Restaurant = require('../models/Restaurant');
const { protect, authorize } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

/**
 * @route   GET /api/dishes
 * @desc    Ottieni tutti i piatti con filtri opzionali
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { ristorante, categoria, vegetariano, vegano, disponibile } = req.query;
    
    let query = {};
    
    if (ristorante) query.ristorante = ristorante;
    if (categoria) query.categoria = categoria;
    if (vegetariano !== undefined) query.vegetariano = vegetariano === 'true';
    if (vegano !== undefined) query.vegano = vegano === 'true';
    if (disponibile !== undefined) query.disponibile = disponibile === 'true';
    else query.disponibile = true; // Di default mostra solo piatti disponibili
    
    const piatti = await Dish.find(query)
      .populate('ristorante', 'nome indirizzo')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: piatti.length,
      data: piatti
    });
  } catch (error) {
    console.error('Errore recupero piatti:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante il recupero dei piatti'
    });
  }
});

/**
 * @route   GET /api/dishes/restaurant/:restaurantId
 * @desc    Ottieni i piatti di un ristorante specifico
 * @access  Public
 */
router.get('/restaurant/:restaurantId', [
  param('restaurantId').isMongoId().withMessage('ID ristorante non valido'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { categoria, vegetariano, vegano, allergeni } = req.query;
    
    const filtri = {};
    if (categoria) filtri.categoria = categoria;
    if (vegetariano) filtri.vegetariano = vegetariano;
    if (vegano) filtri.vegano = vegano;
    if (allergeni) filtri.allergeni = allergeni.split(',');
    
    const piatti = await Dish.getPiattiPerRistorante(req.params.restaurantId, filtri);

    res.status(200).json({
      success: true,
      count: piatti.length,
      data: piatti
    });
  } catch (error) {
    console.error('Errore recupero piatti ristorante:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante il recupero dei piatti'
    });
  }
});

/**
 * @route   GET /api/dishes/:id
 * @desc    Ottieni un piatto specifico
 * @access  Public
 */
router.get('/:id', [
  param('id').isMongoId().withMessage('ID piatto non valido'),
  handleValidationErrors
], async (req, res) => {
  try {
    const piatto = await Dish.findById(req.params.id)
      .populate('ristorante', 'nome indirizzo telefono');

    if (!piatto) {
      return res.status(404).json({
        success: false,
        message: 'Piatto non trovato'
      });
    }

    res.status(200).json({
      success: true,
      data: piatto
    });
  } catch (error) {
    console.error('Errore recupero piatto:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante il recupero del piatto'
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
  body('nome').trim().notEmpty().withMessage('Il nome del piatto è obbligatorio'),
  body('prezzo').isFloat({ min: 0 }).withMessage('Il prezzo deve essere un numero positivo'),
  body('categoria').isIn(['antipasto', 'primo', 'secondo', 'contorno', 'dolce', 'bevanda', 'panino', 'pizza'])
    .withMessage('Categoria non valida'),
  body('ristorante').isMongoId().withMessage('ID ristorante non valido'),
  handleValidationErrors
], async (req, res) => {
  try {
    // Verifica che il ristorante esista e appartenga all'utente
    const ristorante = await Restaurant.findById(req.body.ristorante);
    
    if (!ristorante) {
      return res.status(404).json({
        success: false,
        message: 'Ristorante non trovato'
      });
    }
    
    if (ristorante.proprietario.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Non sei autorizzato ad aggiungere piatti a questo ristorante'
      });
    }

    const piatto = await Dish.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Piatto creato con successo',
      data: piatto
    });
  } catch (error) {
    console.error('Errore creazione piatto:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante la creazione del piatto'
    });
  }
});

/**
 * @route   PUT /api/dishes/:id
 * @desc    Aggiorna un piatto
 * @access  Private (solo proprietario del ristorante)
 */
router.put('/:id', [
  protect,
  authorize('ristoratore'),
  param('id').isMongoId().withMessage('ID piatto non valido'),
  handleValidationErrors
], async (req, res) => {
  try {
    let piatto = await Dish.findById(req.params.id).populate('ristorante');

    if (!piatto) {
      return res.status(404).json({
        success: false,
        message: 'Piatto non trovato'
      });
    }

    // Verifica che l'utente sia il proprietario del ristorante
    if (piatto.ristorante.proprietario.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Non sei autorizzato a modificare questo piatto'
      });
    }

    // Non permettere di cambiare il ristorante
    delete req.body.ristorante;

    piatto = await Dish.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Piatto aggiornato con successo',
      data: piatto
    });
  } catch (error) {
    console.error('Errore aggiornamento piatto:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante l\'aggiornamento del piatto'
    });
  }
});

/**
 * @route   DELETE /api/dishes/:id
 * @desc    Elimina un piatto
 * @access  Private (solo proprietario del ristorante)
 */
router.delete('/:id', [
  protect,
  authorize('ristoratore'),
  param('id').isMongoId().withMessage('ID piatto non valido'),
  handleValidationErrors
], async (req, res) => {
  try {
    const piatto = await Dish.findById(req.params.id).populate('ristorante');

    if (!piatto) {
      return res.status(404).json({
        success: false,
        message: 'Piatto non trovato'
      });
    }

    // Verifica che l'utente sia il proprietario del ristorante
    if (piatto.ristorante.proprietario.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Non sei autorizzato a eliminare questo piatto'
      });
    }

    await Dish.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Piatto eliminato con successo'
    });
  } catch (error) {
    console.error('Errore eliminazione piatto:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante l\'eliminazione del piatto'
    });
  }
});

module.exports = router;
