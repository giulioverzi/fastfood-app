/**
 * Routes per la gestione degli utenti
 * @module routes/users
 */

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const { protect } = require('../middleware/auth');

/**
 * @route   GET /api/users/me
 * @desc    Ottieni il profilo dell'utente corrente
 * @access  Private
 */
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero del profilo',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/users/me
 * @desc    Aggiorna il profilo dell'utente corrente
 * @access  Private
 */
router.put('/me', protect, async (req, res) => {
  try {
    const fieldsToUpdate = {
      nome: req.body.nome,
      cognome: req.body.cognome,
      telefono: req.body.telefono,
      indirizzo: req.body.indirizzo
    };

    // Rimuovi campi undefined
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nell\'aggiornamento del profilo',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/users/me
 * @desc    Elimina l'account dell'utente corrente
 * @access  Private
 */
router.delete('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utente non trovato'
      });
    }

    // Se è un ristoratore, verifica che non ci siano ordini pendenti
    if (user.ruolo === 'ristoratore') {
      const restaurants = await Restaurant.find({ proprietario: req.user.id });
      const restaurantIds = restaurants.map(r => r._id);
      
      const pendingOrders = await Order.countDocuments({
        ristorante: { $in: restaurantIds },
        stato: { $in: ['ordinato', 'in_preparazione', 'pronto', 'in_consegna'] }
      });
      
      if (pendingOrders > 0) {
        return res.status(400).json({
          success: false,
          message: 'Non puoi eliminare l\'account mentre hai ordini pendenti. Completa tutti gli ordini prima di procedere.'
        });
      }
    }
    
    // Se è un cliente, verifica che non ci siano ordini in sospeso o da ritirare
    if (user.ruolo === 'cliente') {
      const pendingOrders = await Order.countDocuments({
        cliente: req.user.id,
        stato: { $in: ['ordinato', 'in_preparazione', 'pronto', 'in_consegna'] }
      });
      
      if (pendingOrders > 0) {
        return res.status(400).json({
          success: false,
          message: 'Non puoi eliminare l\'account mentre hai ordini in sospeso o da ritirare. Completa tutti gli ordini prima di procedere.'
        });
      }
    }
    
    await User.findByIdAndDelete(req.user.id);
    res.json({
      success: true,
      message: 'Account eliminato con successo'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nell\'eliminazione dell\'account',
      error: error.message
    });
  }
});

module.exports = router;
