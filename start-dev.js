/**
 * Script per avviare il server in modalità sviluppo con MongoDB in-memory
 */

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { spawn } = require('child_process');

async function startDevelopmentServer() {
  try {
    console.log('Avvio MongoDB in-memory server...');
    
    // Avvia MongoDB in-memory
    const mongod = await MongoMemoryServer.create({
      instance: {
        port: 27017,
      },
    });
    
    const uri = mongod.getUri();
    console.log(`MongoDB in-memory avviato su: ${uri}`);
    
    // Connetti a MongoDB
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connesso a MongoDB');
    
    // Esegui il seeding del database
    console.log('Popolamento database...');
    await require('./seed-data-inline')();
    
    console.log('Database popolato con successo!');
    
    // Avvia il server Express
    console.log('Avvio server Express...');
    require('./server');
    
  } catch (error) {
    console.error('Errore durante l\'avvio:', error);
    process.exit(1);
  }
}

startDevelopmentServer();
