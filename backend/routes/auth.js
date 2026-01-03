/**
 * Auth Routes - Route per autenticazione e registrazione
 * 
 * Gestisce registrazione, login e verifica token
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const User = require('../models/User');
const { generateToken, protect } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

/**
 * @route   POST /api/auth/register
 * @desc    Registra un nuovo utente
 * @access  Public
 */
router.post('/register', [
  body('nome').trim().notEmpty().withMessage('Il nome è obbligatorio'),
  body('cognome').trim().notEmpty().withMessage('Il cognome è obbligatorio'),
  body('email').isEmail().normalizeEmail().withMessage('Email non valida'),
  body('password').isLength({ min: 6 }).withMessage('La password deve essere di almeno 6 caratteri'),
  body('ruolo').isIn(['cliente', 'ristoratore']).withMessage('Il ruolo deve essere cliente o ristoratore'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { nome, cognome, email, password, ruolo, telefono, indirizzo } = req.body;

    // Verifica se l'utente esiste già
    const utenteEsistente = await User.findOne({ email });
    if (utenteEsistente) {
      return res.status(400).json({
        success: false,
        message: 'Email già registrata'
      });
    }

    // Crea nuovo utente
    const utente = await User.create({
      nome,
      cognome,
      email,
      password,
      ruolo,
      telefono,
      indirizzo
    });

    // Genera token
    const token = generateToken(utente._id);

    res.status(201).json({
      success: true,
      message: 'Registrazione completata con successo',
      data: {
        token,
        user: {
          id: utente._id,
          nome: utente.nome,
          cognome: utente.cognome,
          email: utente.email,
          ruolo: utente.ruolo
        }
      }
    });
  } catch (error) {
    console.error('Errore registrazione:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante la registrazione'
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login utente
 * @access  Public
 */
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Email non valida'),
  body('password').notEmpty().withMessage('La password è obbligatoria'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trova l'utente e includi la password
    const utente = await User.findOne({ email }).select('+password');
    
    if (!utente) {
      return res.status(401).json({
        success: false,
        message: 'Credenziali non valide'
      });
    }

    // Verifica la password
    const passwordCorretta = await utente.verificaPassword(password);
    
    if (!passwordCorretta) {
      return res.status(401).json({
        success: false,
        message: 'Credenziali non valide'
      });
    }

    // Genera token
    const token = generateToken(utente._id);

    res.status(200).json({
      success: true,
      message: 'Login effettuato con successo',
      data: {
        token,
        user: {
          id: utente._id,
          nome: utente.nome,
          cognome: utente.cognome,
          email: utente.email,
          ruolo: utente.ruolo
        }
      }
    });
  } catch (error) {
    console.error('Errore login:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante il login'
    });
  }
});

/**
 * @route   GET /api/auth/verify
 * @desc    Verifica token JWT e restituisce utente
 * @access  Private
 */
router.get('/verify', protect, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          nome: req.user.nome,
          cognome: req.user.cognome,
          email: req.user.email,
          ruolo: req.user.ruolo
        }
      }
    });
  } catch (error) {
    console.error('Errore verifica token:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante la verifica del token'
    });
  }
});

module.exports = router;
