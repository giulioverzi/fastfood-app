/**
 * Utility per la validazione dei dati
 * @module lib/utils/validator
 */

/**
 * Valida un indirizzo email
 * @param {string} email - Email da validare
 * @returns {boolean} True se valida
 */
exports.isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida un numero di telefono italiano
 * @param {string} phone - Numero di telefono
 * @returns {boolean} True se valido
 */
exports.isValidItalianPhone = (phone) => {
  const phoneRegex = /^(\+39)?[\s]?([0-9]{9,10})$/;
  return phoneRegex.test(phone);
};

/**
 * Valida un CAP italiano
 * @param {string} cap - Codice di Avviamento Postale
 * @returns {boolean} True se valido
 */
exports.isValidItalianCAP = (cap) => {
  const capRegex = /^[0-9]{5}$/;
  return capRegex.test(cap);
};

/**
 * Valida la forza di una password
 * @param {string} password - Password da validare
 * @returns {Object} Risultato validazione con dettagli
 */
exports.validatePasswordStrength = (password) => {
  const result = {
    isValid: true,
    errors: []
  };

  if (password.length < 6) {
    result.isValid = false;
    result.errors.push('La password deve essere di almeno 6 caratteri');
  }

  if (!/[a-z]/.test(password)) {
    result.isValid = false;
    result.errors.push('La password deve contenere almeno una lettera minuscola');
  }

  if (!/[A-Z]/.test(password)) {
    result.isValid = false;
    result.errors.push('La password deve contenere almeno una lettera maiuscola');
  }

  if (!/[0-9]/.test(password)) {
    result.isValid = false;
    result.errors.push('La password deve contenere almeno un numero');
  }

  return result;
};

/**
 * Sanitizza una stringa rimuovendo caratteri speciali
 * @param {string} str - Stringa da sanitizzare
 * @returns {string} Stringa sanitizzata
 */
exports.sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/[<>]/g, '');
};

/**
 * Valida un oggetto indirizzo
 * @param {Object} address - Oggetto indirizzo
 * @returns {Object} Risultato validazione
 */
exports.validateAddress = (address) => {
  const result = {
    isValid: true,
    errors: []
  };

  if (!address.via || address.via.trim().length === 0) {
    result.isValid = false;
    result.errors.push('La via è obbligatoria');
  }

  if (!address.citta || address.citta.trim().length === 0) {
    result.isValid = false;
    result.errors.push('La città è obbligatoria');
  }

  if (!address.cap || !exports.isValidItalianCAP(address.cap)) {
    result.isValid = false;
    result.errors.push('Il CAP non è valido');
  }

  return result;
};

/**
 * Valida un prezzo
 * @param {number} price - Prezzo da validare
 * @returns {boolean} True se valido
 */
exports.isValidPrice = (price) => {
  return typeof price === 'number' && price >= 0 && price <= 10000;
};

/**
 * Valida una quantità
 * @param {number} quantity - Quantità da validare
 * @returns {boolean} True se valida
 */
exports.isValidQuantity = (quantity) => {
  return Number.isInteger(quantity) && quantity > 0 && quantity <= 100;
};
