/**
 * Restaurant Routes - Route per la gestione dei ristoranti
 * 
 * Gestisce CRUD dei ristoranti
 */

const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const Restaurant = require('../models/Restaurant');
const { protect, authorize } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

/**
 * @route   GET /api/restaurants
 * @desc    Ottieni tutti i ristoranti
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { citta, categoria } = req.query;
    
    let query = {};
    if (citta) query['indirizzo.citta'] = new RegExp(citta, 'i');
    if (categoria) query.categoria = new RegExp(categoria, 'i');
    
    const ristoranti = await Restaurant.find(query)
      .populate('proprietario', 'nome cognome email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: ristoranti.length,
      data: ristoranti
    });
  } catch (error) {
    console.error('Errore recupero ristoranti:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante il recupero dei ristoranti'
    });
  }
});

/**
 * @route   GET /api/restaurants/:id
 * @desc    Ottieni un ristorante specifico
 * @access  Public
 */
router.get('/:id', [
  param('id').isMongoId().withMessage('ID ristorante non valido'),
  handleValidationErrors
], async (req, res) => {
  try {
    const ristorante = await Restaurant.findById(req.params.id)
      .populate('proprietario', 'nome cognome email telefono');

    if (!ristorante) {
      return res.status(404).json({
        success: false,
        message: 'Ristorante non trovato'
      });
    }

    res.status(200).json({
      success: true,
      data: ristorante
    });
  } catch (error) {
    console.error('Errore recupero ristorante:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante il recupero del ristorante'
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
  body('nome').trim().notEmpty().withMessage('Il nome del ristorante è obbligatorio'),
  body('indirizzo.via').trim().notEmpty().withMessage('La via è obbligatoria'),
  body('indirizzo.citta').trim().notEmpty().withMessage('La città è obbligatoria'),
  body('indirizzo.cap').trim().notEmpty().withMessage('Il CAP è obbligatorio'),
  handleValidationErrors
], async (req, res) => {
  try {
    // Aggiungi l'ID del proprietario (utente autenticato)
    req.body.proprietario = req.user._id;

    const ristorante = await Restaurant.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Ristorante creato con successo',
      data: ristorante
    });
  } catch (error) {
    console.error('Errore creazione ristorante:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante la creazione del ristorante'
    });
  }
});

/**
 * @route   PUT /api/restaurants/:id
 * @desc    Aggiorna un ristorante
 * @access  Private (solo proprietario)
 */
router.put('/:id', [
  protect,
  authorize('ristoratore'),
  param('id').isMongoId().withMessage('ID ristorante non valido'),
  handleValidationErrors
], async (req, res) => {
  try {
    let ristorante = await Restaurant.findById(req.params.id);

    if (!ristorante) {
      return res.status(404).json({
        success: false,
        message: 'Ristorante non trovato'
      });
    }

    // Verifica che l'utente sia il proprietario
    if (ristorante.proprietario.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Non sei autorizzato a modificare questo ristorante'
      });
    }

    // Non permettere di cambiare il proprietario
    delete req.body.proprietario;

    ristorante = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Ristorante aggiornato con successo',
      data: ristorante
    });
  } catch (error) {
    console.error('Errore aggiornamento ristorante:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante l\'aggiornamento del ristorante'
    });
  }
});

/**
 * @route   DELETE /api/restaurants/:id
 * @desc    Elimina un ristorante
 * @access  Private (solo proprietario)
 */
router.delete('/:id', [
  protect,
  authorize('ristoratore'),
  param('id').isMongoId().withMessage('ID ristorante non valido'),
  handleValidationErrors
], async (req, res) => {
  try {
    const ristorante = await Restaurant.findById(req.params.id);

    if (!ristorante) {
      return res.status(404).json({
        success: false,
        message: 'Ristorante non trovato'
      });
    }

    // Verifica che l'utente sia il proprietario
    if (ristorante.proprietario.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Non sei autorizzato a eliminare questo ristorante'
      });
    }

    await Restaurant.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Ristorante eliminato con successo'
    });
  } catch (error) {
    console.error('Errore eliminazione ristorante:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante l\'eliminazione del ristorante'
    });
  }
});

/**
 * @route   GET /api/restaurants/user/my-restaurants
 * @desc    Ottieni i ristoranti dell'utente autenticato
 * @access  Private (solo ristoratori)
 */
router.get('/user/my-restaurants', [
  protect,
  authorize('ristoratore')
], async (req, res) => {
  try {
    const ristoranti = await Restaurant.find({ proprietario: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: ristoranti.length,
      data: ristoranti
    });
  } catch (error) {
    console.error('Errore recupero ristoranti utente:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante il recupero dei ristoranti'
    });
  }
});

module.exports = router;
