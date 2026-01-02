/**
 * Servizio per la gestione degli utenti
 * @module lib/users/userService
 */

const User = require('../../backend/models/User');

/**
 * Ottieni il profilo di un utente tramite ID
 * @param {string} userId - ID dell'utente
 * @returns {Promise<Object>} Profilo utente
 */
exports.getUserProfile = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Utente non trovato');
    }
    return user;
  } catch (error) {
    throw error;
  }
};

/**
 * Aggiorna il profilo di un utente
 * @param {string} userId - ID dell'utente
 * @param {Object} updateData - Dati da aggiornare
 * @returns {Promise<Object>} Utente aggiornato
 */
exports.updateUserProfile = async (userId, updateData) => {
  try {
    const fieldsToUpdate = {};
    
    // Campi aggiornabili
    const allowedFields = ['nome', 'cognome', 'telefono', 'indirizzo'];
    
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        fieldsToUpdate[field] = updateData[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      userId,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    );

    if (!user) {
      throw new Error('Utente non trovato');
    }

    return user;
  } catch (error) {
    throw error;
  }
};

/**
 * Elimina un utente
 * @param {string} userId - ID dell'utente
 * @returns {Promise<Object>} Risultato dell'eliminazione
 */
exports.deleteUser = async (userId) => {
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw new Error('Utente non trovato');
    }
    return { success: true, message: 'Account eliminato con successo' };
  } catch (error) {
    throw error;
  }
};

/**
 * Verifica se un utente esiste tramite email
 * @param {string} email - Email dell'utente
 * @returns {Promise<boolean>} True se l'utente esiste
 */
exports.userExistsByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    return !!user;
  } catch (error) {
    throw error;
  }
};
