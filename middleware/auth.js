/**
 * Middleware di autenticazione JWT
 * @module middleware/auth
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protegge le route verificando il token JWT
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware
 */
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Non autorizzato ad accedere a questa risorsa'
    });
  }

  try {
    // Verifica il token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ottieni l'utente dal token
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Utente non trovato'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token non valido'
    });
  }
};

/**
 * Verifica che l'utente abbia un ruolo specifico
 * @param {...string} ruoli - Ruoli permessi
 */
exports.authorize = (...ruoli) => {
  return (req, res, next) => {
    if (!ruoli.includes(req.user.ruolo)) {
      return res.status(403).json({
        success: false,
        message: `Il ruolo ${req.user.ruolo} non è autorizzato ad accedere a questa risorsa`
      });
    }
    next();
  };
};
