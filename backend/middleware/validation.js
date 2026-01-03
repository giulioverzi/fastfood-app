/**
 * Validation Middleware - Middleware per la validazione degli input
 * 
 * Utilizza express-validator per validare e sanitizzare i dati in input
 */

const { validationResult } = require('express-validator');

/**
 * Middleware per gestire gli errori di validazione
 * Controlla i risultati della validazione e restituisce errori se presenti
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errori di validazione',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  
  next();
};

module.exports = {
  handleValidationErrors
};
