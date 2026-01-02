/**
 * Utility per la gestione delle risposte API
 * @module lib/utils/responseHandler
 */

/**
 * Invia una risposta di successo
 * @param {Object} res - Response object Express
 * @param {number} statusCode - Codice di stato HTTP
 * @param {Object} data - Dati da restituire
 * @param {string} message - Messaggio opzionale
 */
exports.sendSuccess = (res, statusCode = 200, data = null, message = null) => {
  const response = {
    success: true
  };

  if (message) {
    response.message = message;
  }

  if (data !== null) {
    if (Array.isArray(data)) {
      response.count = data.length;
      response.data = data;
    } else {
      response.data = data;
    }
  }

  return res.status(statusCode).json(response);
};

/**
 * Invia una risposta di errore
 * @param {Object} res - Response object Express
 * @param {number} statusCode - Codice di stato HTTP
 * @param {string} message - Messaggio di errore
 * @param {Object} error - Dettagli errore opzionali
 */
exports.sendError = (res, statusCode = 500, message = 'Errore del server', error = null) => {
  const response = {
    success: false,
    message
  };

  // Include dettagli dell'errore solo in development
  if (process.env.NODE_ENV === 'development' && error) {
    response.error = error.message || error;
  }

  return res.status(statusCode).json(response);
};

/**
 * Handler per errori di validazione
 * @param {Object} res - Response object Express
 * @param {Array} errors - Array di errori di validazione
 */
exports.sendValidationError = (res, errors) => {
  return res.status(400).json({
    success: false,
    message: 'Errori di validazione',
    errors: errors.map(error => ({
      field: error.param,
      message: error.msg
    }))
  });
};

/**
 * Handler per risorse non trovate
 * @param {Object} res - Response object Express
 * @param {string} resourceName - Nome della risorsa
 */
exports.sendNotFound = (res, resourceName = 'Risorsa') => {
  return res.status(404).json({
    success: false,
    message: `${resourceName} non trovata`
  });
};

/**
 * Handler per errori di autorizzazione
 * @param {Object} res - Response object Express
 * @param {string} message - Messaggio personalizzato
 */
exports.sendUnauthorized = (res, message = 'Non autorizzato') => {
  return res.status(401).json({
    success: false,
    message
  });
};

/**
 * Handler per errori di permessi
 * @param {Object} res - Response object Express
 * @param {string} message - Messaggio personalizzato
 */
exports.sendForbidden = (res, message = 'Accesso negato') => {
  return res.status(403).json({
    success: false,
    message
  });
};
