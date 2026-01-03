/**
 * Auth Middleware - Middleware per l'autenticazione JWT
 * 
 * Verifica la validità del token JWT e autentica l'utente
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware per proteggere le route che richiedono autenticazione
 * Verifica il token JWT e aggiunge l'utente alla request
 */
const protect = async (req, res, next) => {
  let token;

  // Verifica se il token è presente nell'header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Non autorizzato, nessun token fornito'
    });
  }

  try {
    // Verifica il token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Trova l'utente dal token (esclude la password)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Utente non trovato'
      });
    }

    next();
  } catch (error) {
    console.error('Errore autenticazione:', error);
    return res.status(401).json({
      success: false,
      message: 'Non autorizzato, token non valido'
    });
  }
};

/**
 * Middleware per autorizzare solo utenti con ruoli specifici
 * @param {...string} ruoli - Ruoli autorizzati (es: 'cliente', 'ristoratore')
 * @returns {Function} Middleware function
 */
const authorize = (...ruoli) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Utente non autenticato'
      });
    }

    if (!ruoli.includes(req.user.ruolo)) {
      return res.status(403).json({
        success: false,
        message: `Il ruolo '${req.user.ruolo}' non ha i permessi per accedere a questa risorsa`
      });
    }

    next();
  };
};

/**
 * Genera un token JWT per l'utente
 * @param {string} id - ID dell'utente
 * @returns {string} Token JWT
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '24h'
  });
};

module.exports = {
  protect,
  authorize,
  generateToken
};
