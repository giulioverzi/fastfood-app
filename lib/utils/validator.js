/**
 * Utility per la validazione dei dati
 * @module lib/utils/validator
 */

const { VALIDATION_LIMITS } = require('./constants');

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
  // Supporta formati: 
  // Mobile: +39 3xx xxxxxxx, 3xx xxxxxxx (10 cifre totali)
  // Fisso: +39 0x xxxx xxxx, 0x xxxx xxxx
  const phoneRegex = /^(\+39\s?)?((3[0-9]{2}\s?[0-9]{7})|(0[0-9]{2,4}\s?[0-9]{6,8}))$/;
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

  if (password.length < VALIDATION_LIMITS.MIN_PASSWORD_LENGTH) {
    result.isValid = false;
    result.errors.push(`La password deve essere di almeno ${VALIDATION_LIMITS.MIN_PASSWORD_LENGTH} caratteri`);
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
 * Sanitizza una stringa rimuovendo caratteri pericolosi
 * Nota: Per protezione XSS completa in produzione, usare librerie come DOMPurify
 * @param {string} str - Stringa da sanitizzare
 * @returns {string} Stringa sanitizzata
 */
exports.sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  
  // Trim e rimuovi caratteri HTML pericolosi
  // IMPORTANTE: & deve essere sostituito per primo per evitare doppia codifica
  return str
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
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
  return typeof price === 'number' && price >= 0 && price <= VALIDATION_LIMITS.MAX_PRICE;
};

/**
 * Valida una quantità
 * @param {number} quantity - Quantità da validare
 * @returns {boolean} True se valida
 */
exports.isValidQuantity = (quantity) => {
  return Number.isInteger(quantity) && 
         quantity >= VALIDATION_LIMITS.MIN_QUANTITY && 
         quantity <= VALIDATION_LIMITS.MAX_QUANTITY;
};
