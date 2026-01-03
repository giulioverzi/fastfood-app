/**
 * Configurazione della connessione al database MongoDB
 * @module config/database
 */

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

/**
 * Connette l'applicazione al database MongoDB
 * @async
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;
    
    // In modalità development, usa mongodb-memory-server se MongoDB locale non è disponibile
    if (process.env.NODE_ENV === 'development') {
      try {
        // Prova prima a connetterti a MongoDB locale
        const conn = await mongoose.connect(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          serverSelectionTimeoutMS: 3000,
        });
        console.log(`MongoDB connesso: ${conn.connection.host}`);
        return;
      } catch (localError) {
        console.log('MongoDB locale non disponibile, avvio mongodb-memory-server...');
        
        // Avvia mongodb-memory-server
        mongod = await MongoMemoryServer.create({
          instance: {
            port: 27017,
          },
        });
        
        uri = mongod.getUri();
        console.log('MongoDB in-memory avviato');
      }
    }
    
    const conn = await mongoose.connect(uri, {
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
