/**
 * Users Routes - Route per la gestione degli utenti
 * 
 * Gestisce profilo utente
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

/**
 * @route   GET /api/users/profile
 * @desc    Ottieni il profilo dell'utente autenticato
 * @access  Private
 */
router.get('/profile', protect, async (req, res) => {
  try {
    const utente = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: utente
    });
  } catch (error) {
    console.error('Errore recupero profilo:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante il recupero del profilo'
    });
  }
});

/**
 * @route   PUT /api/users/profile
 * @desc    Aggiorna il profilo dell'utente autenticato
 * @access  Private
 */
router.put('/profile', [
  protect,
  body('email').optional().isEmail().normalizeEmail().withMessage('Email non valida'),
  body('nome').optional().trim().notEmpty().withMessage('Il nome non può essere vuoto'),
  body('cognome').optional().trim().notEmpty().withMessage('Il cognome non può essere vuoto'),
  handleValidationErrors
], async (req, res) => {
  try {
    // Campi che possono essere aggiornati
    const campiAggiornabili = ['nome', 'cognome', 'email', 'telefono', 'indirizzo'];
    const aggiornamentiPermessi = {};
    
    Object.keys(req.body).forEach(key => {
      if (campiAggiornabili.includes(key)) {
        aggiornamentiPermessi[key] = req.body[key];
      }
    });

    // Verifica che l'email non sia già usata da un altro utente
    if (aggiornamentiPermessi.email) {
      const utenteEsistente = await User.findOne({ 
        email: aggiornamentiPermessi.email,
        _id: { $ne: req.user._id }
      });
      
      if (utenteEsistente) {
        return res.status(400).json({
          success: false,
          message: 'Email già in uso'
        });
      }
    }

    const utente = await User.findByIdAndUpdate(
      req.user._id,
      aggiornamentiPermessi,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Profilo aggiornato con successo',
      data: utente
    });
  } catch (error) {
    console.error('Errore aggiornamento profilo:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante l\'aggiornamento del profilo'
    });
  }
});

/**
 * @route   PUT /api/users/password
 * @desc    Cambia la password dell'utente autenticato
 * @access  Private
 */
router.put('/password', [
  protect,
  body('currentPassword').notEmpty().withMessage('La password attuale è obbligatoria'),
  body('newPassword').isLength({ min: 6 }).withMessage('La nuova password deve essere di almeno 6 caratteri'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Trova l'utente con la password
    const utente = await User.findById(req.user._id).select('+password');

    // Verifica la password attuale
    const passwordCorretta = await utente.verificaPassword(currentPassword);
    
    if (!passwordCorretta) {
      return res.status(401).json({
        success: false,
        message: 'Password attuale non corretta'
      });
    }

    // Aggiorna la password
    utente.password = newPassword;
    await utente.save();

    res.status(200).json({
      success: true,
      message: 'Password aggiornata con successo'
    });
  } catch (error) {
    console.error('Errore cambio password:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante il cambio password'
    });
  }
});

/**
 * @route   DELETE /api/users/account
 * @desc    Elimina l'account dell'utente autenticato
 * @access  Private
 */
router.delete('/account', protect, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Account eliminato con successo'
    });
  } catch (error) {
    console.error('Errore eliminazione account:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante l\'eliminazione dell\'account'
    });
  }
});

module.exports = router;
