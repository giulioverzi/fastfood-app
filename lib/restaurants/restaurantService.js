/**
 * Servizio per la gestione dei ristoranti
 * @module lib/restaurants/restaurantService
 */

const Restaurant = require('../../backend/models/Restaurant');

/**
 * Ottieni tutti i ristoranti attivi
 * @returns {Promise<Array>} Lista di ristoranti
 */
exports.getAllRestaurants = async () => {
  try {
    const restaurants = await Restaurant.find({ attivo: true })
      .populate('proprietario', 'nome cognome email');
    return restaurants;
  } catch (error) {
    throw error;
  }
};

/**
 * Ottieni un ristorante tramite ID
 * @param {string} restaurantId - ID del ristorante
 * @returns {Promise<Object>} Ristorante
 */
exports.getRestaurantById = async (restaurantId) => {
  try {
    const restaurant = await Restaurant.findById(restaurantId)
      .populate('proprietario', 'nome cognome email telefono');
    
    if (!restaurant) {
      throw new Error('Ristorante non trovato');
    }

    return restaurant;
  } catch (error) {
    throw error;
  }
};

/**
 * Crea un nuovo ristorante
 * @param {Object} restaurantData - Dati del ristorante
 * @param {string} ownerId - ID del proprietario
 * @returns {Promise<Object>} Ristorante creato
 */
exports.createRestaurant = async (restaurantData, ownerId) => {
  try {
    // Verifica che il proprietario non abbia già un ristorante
    const existingRestaurant = await Restaurant.findOne({ proprietario: ownerId });
    if (existingRestaurant) {
      throw new Error('Hai già un ristorante registrato');
    }

    const restaurant = await Restaurant.create({
      ...restaurantData,
      proprietario: ownerId
    });

    return restaurant;
  } catch (error) {
    throw error;
  }
};

/**
 * Aggiorna un ristorante
 * @param {string} restaurantId - ID del ristorante
 * @param {string} ownerId - ID del proprietario
 * @param {Object} updateData - Dati da aggiornare
 * @returns {Promise<Object>} Ristorante aggiornato
 */
exports.updateRestaurant = async (restaurantId, ownerId, updateData) => {
  try {
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      throw new Error('Ristorante non trovato');
    }

    // Verifica che l'utente sia il proprietario
    if (restaurant.proprietario.toString() !== ownerId) {
      throw new Error('Non sei autorizzato a modificare questo ristorante');
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    return updatedRestaurant;
  } catch (error) {
    throw error;
  }
};

/**
 * Elimina un ristorante
 * @param {string} restaurantId - ID del ristorante
 * @param {string} ownerId - ID del proprietario
 * @returns {Promise<Object>} Risultato dell'eliminazione
 */
exports.deleteRestaurant = async (restaurantId, ownerId) => {
  try {
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      throw new Error('Ristorante non trovato');
    }

    // Verifica che l'utente sia il proprietario
    if (restaurant.proprietario.toString() !== ownerId) {
      throw new Error('Non sei autorizzato a eliminare questo ristorante');
    }

    await Restaurant.findByIdAndDelete(restaurantId);

    return { success: true, message: 'Ristorante eliminato con successo' };
  } catch (error) {
    throw error;
  }
};

/**
 * Ottieni i ristoranti di un proprietario
 * @param {string} ownerId - ID del proprietario
 * @returns {Promise<Array>} Lista di ristoranti
 */
exports.getRestaurantsByOwner = async (ownerId) => {
  try {
    const restaurants = await Restaurant.find({ proprietario: ownerId });
    return restaurants;
  } catch (error) {
    throw error;
  }
};
