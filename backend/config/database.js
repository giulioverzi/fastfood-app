/**
 * database.js - Configurazione connessione MongoDB
 * 
 * Modulo per la gestione della connessione al database
 */

const mongoose = require('mongoose');

/**
 * Funzione per connettere al database MongoDB
 * @returns {Promise} Connessione MongoDB
 */
const connettiDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connesso: ${conn.connection.host}`);
    return conn;
  } catch (errore) {
    console.error(`Errore connessione MongoDB: ${errore.message}`);
    process.exit(1);
  }
};

module.exports = { connettiDatabase };
