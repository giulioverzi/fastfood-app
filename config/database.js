/**
 * Configurazione della connessione al database MongoDB
 * @module config/database
 */

const mongoose = require('mongoose');

/**
 * Connette l'applicazione al database MongoDB
 * @async
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB connesso: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Errore connessione MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
