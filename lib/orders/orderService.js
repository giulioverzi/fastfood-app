/**
 * Servizio per la gestione degli ordini
 * @module lib/orders/orderService
 */

const Order = require('../../models/Order');
const Dish = require('../../models/Dish');
const { ORDER_STATES } = require('../utils/constants');

/**
 * Crea un nuovo ordine
 * @param {Object} orderData - Dati dell'ordine
 * @param {string} userId - ID dell'utente
 * @returns {Promise<Object>} Ordine creato
 */
exports.createOrder = async (orderData, userId) => {
  try {
    // Verifica che tutti i piatti esistano e calcola il totale
    let totale = 0;
    const piattiVerificati = [];

    for (const item of orderData.piatti) {
      const piatto = await Dish.findById(item.piatto);
      
      if (!piatto) {
        throw new Error(`Piatto con ID ${item.piatto} non trovato`);
      }

      if (!piatto.disponibile) {
        throw new Error(`Il piatto ${piatto.nome} non è disponibile`);
      }

      totale += piatto.prezzo * item.quantita;
      piattiVerificati.push({
        piatto: item.piatto,
        quantita: item.quantita,
        prezzo: piatto.prezzo
      });
    }

    const order = await Order.create({
      cliente: userId,
      ristorante: orderData.ristorante,
      piatti: piattiVerificati,
      totale,
      modalita: orderData.modalita,
      indirizzoConsegna: orderData.modalita === 'consegna' ? orderData.indirizzoConsegna : undefined,
      note: orderData.note
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('cliente', 'nome cognome email telefono')
      .populate('ristorante', 'nome indirizzo telefono')
      .populate('piatti.piatto', 'nome categoria prezzo');

    return populatedOrder;
  } catch (error) {
    throw error;
  }
};

/**
 * Ottieni gli ordini di un utente
 * @param {string} userId - ID dell'utente
 * @returns {Promise<Array>} Lista di ordini
 */
exports.getUserOrders = async (userId) => {
  try {
    const orders = await Order.find({ cliente: userId })
      .populate('ristorante', 'nome indirizzo telefono')
      .populate('piatti.piatto', 'nome categoria prezzo immagine')
      .sort('-dataOrdine');

    return orders;
  } catch (error) {
    throw error;
  }
};

/**
 * Ottieni gli ordini di un ristorante
 * @param {string} restaurantId - ID del ristorante
 * @returns {Promise<Array>} Lista di ordini
 */
exports.getRestaurantOrders = async (restaurantId) => {
  try {
    const orders = await Order.find({ ristorante: restaurantId })
      .populate('cliente', 'nome cognome email telefono indirizzo')
      .populate('piatti.piatto', 'nome categoria prezzo')
      .sort('-dataOrdine');

    return orders;
  } catch (error) {
    throw error;
  }
};

/**
 * Ottieni un ordine tramite ID
 * @param {string} orderId - ID dell'ordine
 * @param {string} userId - ID dell'utente richiedente
 * @returns {Promise<Object>} Ordine
 */
exports.getOrderById = async (orderId, userId) => {
  try {
    const order = await Order.findById(orderId)
      .populate('cliente', 'nome cognome email telefono')
      .populate('ristorante', 'nome indirizzo telefono')
      .populate('piatti.piatto', 'nome categoria prezzo');

    if (!order) {
      throw new Error('Ordine non trovato');
    }

    return order;
  } catch (error) {
    throw error;
  }
};

/**
 * Aggiorna lo stato di un ordine
 * @param {string} orderId - ID dell'ordine
 * @param {string} restaurantId - ID del ristorante
 * @param {string} newStatus - Nuovo stato
 * @returns {Promise<Object>} Ordine aggiornato
 */
exports.updateOrderStatus = async (orderId, restaurantId, newStatus) => {
  try {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error('Ordine non trovato');
    }

    // Verifica che l'ordine appartenga al ristorante
    if (order.ristorante.toString() !== restaurantId) {
      throw new Error('Non sei autorizzato a modificare questo ordine');
    }

    // Verifica che lo stato sia valido
    if (!ORDER_STATES.includes(newStatus)) {
      throw new Error('Stato non valido');
    }

    order.stato = newStatus;
    await order.save();

    const updatedOrder = await Order.findById(orderId)
      .populate('cliente', 'nome cognome email telefono')
      .populate('ristorante', 'nome indirizzo telefono')
      .populate('piatti.piatto', 'nome categoria prezzo');

    return updatedOrder;
  } catch (error) {
    throw error;
  }
};

/**
 * Calcola statistiche ordini per un ristorante
 * @param {string} restaurantId - ID del ristorante
 * @returns {Promise<Object>} Statistiche
 */
exports.getRestaurantOrderStats = async (restaurantId) => {
  try {
    const orders = await Order.find({ ristorante: restaurantId });
    
    const stats = {
      totaleOrdini: orders.length,
      ordinati: orders.filter(o => o.stato === 'ordinato').length,
      inPreparazione: orders.filter(o => o.stato === 'in_preparazione').length,
      completati: orders.filter(o => o.stato === 'completato').length,
      annullati: orders.filter(o => o.stato === 'annullato').length,
      ricavoTotale: orders
        .filter(o => o.stato === 'completato')
        .reduce((sum, o) => sum + o.totale, 0)
    };

    return stats;
  } catch (error) {
    throw error;
  }
};
