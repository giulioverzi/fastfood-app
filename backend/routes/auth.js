/**
 * Routes per l'autenticazione
 * @module backend/routes/auth
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

/**
 * Genera un token JWT
 * @param {string} id - ID dell'utente
 * @returns {string} Token JWT
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Registra un nuovo utente
 * @access  Public
 */
router.post('/register', [
  body('nome').trim().notEmpty().withMessage('Il nome è obbligatorio'),
  body('cognome').trim().notEmpty().withMessage('Il cognome è obbligatorio'),
  body('email').isEmail().withMessage('Inserisci un\'email valida'),
  body('password').isLength({ min: 6 }).withMessage('La password deve contenere almeno 6 caratteri'),
  body('ruolo').isIn(['cliente', 'ristoratore']).withMessage('Ruolo non valido')
], async (req, res) => {
  // Validazione
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { nome, cognome, email, password, ruolo, telefono, indirizzo } = req.body;

    // Verifica se l'utente esiste già
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Email già registrata'
      });
    }

    // Crea l'utente
    const user = await User.create({
      nome,
      cognome,
      email,
      password,
      ruolo,
      telefono,
      indirizzo
    });

    // Genera token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        nome: user.nome,
        cognome: user.cognome,
        email: user.email,
        ruolo: user.ruolo,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nella registrazione',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login utente
 * @access  Public
 */
router.post('/login', [
  body('email').isEmail().withMessage('Inserisci un\'email valida'),
  body('password').notEmpty().withMessage('La password è obbligatoria')
], async (req, res) => {
  // Validazione
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // Verifica se l'utente esiste
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenziali non valide'
      });
    }

    // Verifica la password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenziali non valide'
      });
    }

    // Genera token
    const token = generateToken(user._id);

    res.json({
      success: true,
      data: {
        _id: user._id,
        nome: user.nome,
        cognome: user.cognome,
        email: user.email,
        ruolo: user.ruolo,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nel login',
      error: error.message
    });
  }
});

module.exports = router;
