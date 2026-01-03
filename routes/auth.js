/**
 * Routes per l'autenticazione
 * @module routes/auth
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
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrazione nuovo utente
 *     description: Crea un nuovo account utente nel sistema (cliente o ristoratore)
 *     tags: [Autenticazione]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - cognome
 *               - email
 *               - password
 *               - ruolo
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Mario
 *               cognome:
 *                 type: string
 *                 example: Rossi
 *               email:
 *                 type: string
 *                 format: email
 *                 example: mario@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: password123
 *               ruolo:
 *                 type: string
 *                 enum: [cliente, ristoratore]
 *                 example: cliente
 *               telefono:
 *                 type: string
 *                 example: "+39 123 456 7890"
 *               indirizzo:
 *                 type: object
 *                 properties:
 *                   via:
 *                     type: string
 *                     example: Via Roma 1
 *                   citta:
 *                     type: string
 *                     example: Milano
 *                   cap:
 *                     type: string
 *                     example: "20100"
 *     responses:
 *       201:
 *         description: Utente registrato con successo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     nome:
 *                       type: string
 *                     cognome:
 *                       type: string
 *                     email:
 *                       type: string
 *                     ruolo:
 *                       type: string
 *                     token:
 *                       type: string
 *                       description: Token JWT per l'autenticazione
 *       400:
 *         description: Dati non validi o email già esistente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Errore del server
 */
router.post('/register', [
  body('nome').trim().notEmpty().withMessage('Il nome è obbligatorio'),
  body('cognome').trim().notEmpty().withMessage('Il cognome è obbligatorio'),
  body('email').isEmail().withMessage('Inserisci un\'email valida'),
  body('password').isLength({ min: 6 }).withMessage('La password deve contenere almeno 6 caratteri'),
  body('ruolo').isIn(['cliente', 'ristoratore']).withMessage('Ruolo non valido'),
  body('partitaIVA').custom((value, { req }) => {
    // Partita IVA obbligatoria solo per ristoratori
    if (req.body.ruolo === 'ristoratore') {
      if (!value || value.trim().length === 0) {
        throw new Error('La Partita IVA è obbligatoria per i ristoratori');
      }
      if (!/^\d{11}$/.test(value)) {
        throw new Error('La Partita IVA deve essere di 11 cifre');
      }
    }
    return true;
  })
], async (req, res) => {
  // Validazione
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { nome, cognome, email, password, ruolo, telefono, indirizzo, partitaIVA } = req.body;

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
      indirizzo,
      partitaIVA: ruolo === 'ristoratore' ? partitaIVA : undefined
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
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login utente
 *     description: Autentica un utente esistente e restituisce un token JWT
 *     tags: [Autenticazione]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: mario@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login effettuato con successo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     nome:
 *                       type: string
 *                     cognome:
 *                       type: string
 *                     email:
 *                       type: string
 *                     ruolo:
 *                       type: string
 *                     token:
 *                       type: string
 *                       description: Token JWT per l'autenticazione
 *       401:
 *         description: Credenziali non valide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Errore del server
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
