/**
 * Servizio per la gestione dei piatti
 * @module lib/dishes/dishService
 */

const Dish = require('../../backend/models/Dish');
const { DISH_CATEGORIES, ALLERGENS } = require('../utils/constants');

/**
 * Ottieni tutti i piatti con filtri opzionali
 * @param {Object} filters - Filtri di ricerca
 * @returns {Promise<Array>} Lista di piatti
 */
exports.getAllDishes = async (filters = {}) => {
  try {
    const query = { disponibile: true };

    // Filtro per ristorante
    if (filters.ristorante) {
      query.ristorante = filters.ristorante;
    }

    // Filtro per categoria
    if (filters.categoria) {
      query.categoria = filters.categoria;
    }

    // Filtro vegetariano
    if (filters.vegetariano === 'true') {
      query.vegetariano = true;
    }

    // Filtro vegano
    if (filters.vegano === 'true') {
      query.vegano = true;
    }

    // Filtro per allergeni (esclusione)
    if (filters.allergeni && typeof filters.allergeni === 'string') {
      const allergeniArray = filters.allergeni.split(',');
      query.allergeni = { $nin: allergeniArray };
    }

    const dishes = await Dish.find(query)
      .populate('ristorante', 'nome indirizzo telefono')
      .sort('categoria nome');

    return dishes;
  } catch (error) {
    throw error;
  }
};

/**
 * Ottieni un piatto tramite ID
 * @param {string} dishId - ID del piatto
 * @returns {Promise<Object>} Piatto
 */
exports.getDishById = async (dishId) => {
  try {
    const dish = await Dish.findById(dishId)
      .populate('ristorante', 'nome indirizzo telefono email');

    if (!dish) {
      throw new Error('Piatto non trovato');
    }

    return dish;
  } catch (error) {
    throw error;
  }
};

/**
 * Crea un nuovo piatto
 * @param {Object} dishData - Dati del piatto
 * @param {string} restaurantId - ID del ristorante
 * @returns {Promise<Object>} Piatto creato
 */
exports.createDish = async (dishData, restaurantId) => {
  try {
    const dish = await Dish.create({
      ...dishData,
      ristorante: restaurantId
    });

    const populatedDish = await Dish.findById(dish._id)
      .populate('ristorante', 'nome');

    return populatedDish;
  } catch (error) {
    throw error;
  }
};

/**
 * Aggiorna un piatto
 * @param {string} dishId - ID del piatto
 * @param {string} restaurantId - ID del ristorante
 * @param {Object} updateData - Dati da aggiornare
 * @returns {Promise<Object>} Piatto aggiornato
 */
exports.updateDish = async (dishId, restaurantId, updateData) => {
  try {
    const dish = await Dish.findById(dishId);

    if (!dish) {
      throw new Error('Piatto non trovato');
    }

    // Verifica che il piatto appartenga al ristorante
    if (dish.ristorante.toString() !== restaurantId) {
      throw new Error('Non sei autorizzato a modificare questo piatto');
    }

    const updatedDish = await Dish.findByIdAndUpdate(
      dishId,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).populate('ristorante', 'nome');

    return updatedDish;
  } catch (error) {
    throw error;
  }
};

/**
 * Elimina un piatto
 * @param {string} dishId - ID del piatto
 * @param {string} restaurantId - ID del ristorante
 * @returns {Promise<Object>} Risultato dell'eliminazione
 */
exports.deleteDish = async (dishId, restaurantId) => {
  try {
    const dish = await Dish.findById(dishId);

    if (!dish) {
      throw new Error('Piatto non trovato');
    }

    // Verifica che il piatto appartenga al ristorante
    if (dish.ristorante.toString() !== restaurantId) {
      throw new Error('Non sei autorizzato a eliminare questo piatto');
    }

    await Dish.findByIdAndDelete(dishId);

    return { success: true, message: 'Piatto eliminato con successo' };
  } catch (error) {
    throw error;
  }
};

/**
 * Ottieni i piatti di un ristorante
 * @param {string} restaurantId - ID del ristorante
 * @returns {Promise<Array>} Lista di piatti
 */
exports.getDishesByRestaurant = async (restaurantId) => {
  try {
    const dishes = await Dish.find({ ristorante: restaurantId })
      .sort('categoria nome');
    return dishes;
  } catch (error) {
    throw error;
  }
};

/**
 * Ottieni le categorie disponibili
 * @returns {Array} Lista delle categorie
 */
exports.getCategories = () => {
  return DISH_CATEGORIES;
};

/**
 * Ottieni gli allergeni standard
 * @returns {Array} Lista degli allergeni
 */
exports.getAllergens = () => {
  return ALLERGENS;
};
