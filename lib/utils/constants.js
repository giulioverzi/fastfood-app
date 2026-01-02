/**
 * Costanti dell'applicazione
 * @module lib/utils/constants
 */

/**
 * Stati possibili per gli ordini
 */
exports.ORDER_STATES = [
  'ordinato',
  'confermato',
  'in_preparazione',
  'pronto',
  'in_consegna',
  'consegnato',
  'completato',
  'annullato'
];

/**
 * Categorie disponibili per i piatti
 */
exports.DISH_CATEGORIES = [
  'panini',
  'pizze',
  'insalate',
  'antipasti',
  'primi',
  'secondi',
  'contorni',
  'dolci',
  'bevande'
];

/**
 * Allergeni standard riconosciuti
 */
exports.ALLERGENS = [
  'glutine',
  'crostacei',
  'uova',
  'pesce',
  'arachidi',
  'soia',
  'latte',
  'frutta_a_guscio',
  'sedano',
  'senape',
  'sesamo',
  'solfiti',
  'lupini',
  'molluschi'
];

/**
 * Ruoli utente disponibili
 */
exports.USER_ROLES = {
  CLIENTE: 'cliente',
  RISTORATORE: 'ristoratore'
};

/**
 * Campi aggiornabili nel profilo utente
 */
exports.USER_UPDATABLE_FIELDS = ['nome', 'cognome', 'telefono', 'indirizzo'];

/**
 * Modalità di consegna ordine
 */
exports.ORDER_DELIVERY_MODES = {
  RITIRO: 'ritiro',
  CONSEGNA: 'consegna'
};

/**
 * Limiti di validazione
 */
exports.VALIDATION_LIMITS = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_PRICE: 10000,
  MAX_QUANTITY: 100,
  MIN_QUANTITY: 1
};
