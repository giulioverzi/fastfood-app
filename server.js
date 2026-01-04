/**
 * server.js - Entry point dell'applicazione
 * 
 * Configura e avvia il server Express con tutte le route e middleware
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');

// Import routes
const authRoutes = require('./backend/routes/auth');
const restaurantRoutes = require('./backend/routes/restaurants');
const dishRoutes = require('./backend/routes/dishes');
const orderRoutes = require('./backend/routes/orders');
const userRoutes = require('./backend/routes/users');

// Import models
const Restaurant = require('./backend/models/Restaurant');
const Dish = require('./backend/models/Dish');
const User = require('./backend/models/User');

// Import middleware
const { 
  notFound, 
  errorHandler,
  handleMongooseValidationError,
  handleMongoDuplicateKeyError,
  handleMongoCastError
} = require('./backend/middleware/errorHandler');

// Inizializza Express
const app = express();

// Configurazione porta
const PORT = process.env.PORT || 5000;

// Middleware per parsing JSON e URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Serve file statici dalla cartella public
app.use(express.static(path.join(__dirname, 'public')));

// Connessione al Database MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connesso: ${conn.connection.host}`);
    
    // Carica dati iniziali da meal.json se il database è vuoto
    await caricaDatiIniziali();
  } catch (error) {
    console.error(`Errore connessione MongoDB: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Funzione per caricare i dati iniziali da meal.json
 * Viene eseguita solo se il database è vuoto
 */
const caricaDatiIniziali = async () => {
  try {
    // Verifica se esistono già ristoranti nel database
    const conteggioRistoranti = await Restaurant.countDocuments();
    
    if (conteggioRistoranti > 0) {
      console.log('Database già popolato. Salto il caricamento dei dati iniziali.');
      return;
    }
    
    console.log('Database vuoto. Caricamento dati iniziali da meal.json...');
    
    // Leggi il file meal.json
    const mealDataPath = path.join(__dirname, 'data', 'meal.json');
    
    if (!fs.existsSync(mealDataPath)) {
      console.log('File meal.json non trovato. Salto il caricamento dei dati iniziali.');
      return;
    }
    
    const mealData = JSON.parse(fs.readFileSync(mealDataPath, 'utf8'));
    
    // Crea un utente ristoratore di default per i ristoranti
    let utenteRistoratore = await User.findOne({ email: 'ristoratore@example.com' });
    
    if (!utenteRistoratore) {
      utenteRistoratore = await User.create({
        nome: 'Admin',
        cognome: 'Ristorante',
        email: 'ristoratore@example.com',
        password: 'password123',
        ruolo: 'ristoratore',
        telefono: '3331234567',
        indirizzo: {
          via: 'Via Example 1',
          citta: 'Milano',
          cap: '20100'
        }
      });
      console.log('Utente ristoratore di default creato');
    }
    
    // Carica i ristoranti
    const mappaRistoranti = new Map();
    
    for (const ristorante of mealData.ristoranti) {
      const nuovoRistorante = await Restaurant.create({
        nome: ristorante.nome,
        descrizione: ristorante.descrizione,
        indirizzo: ristorante.indirizzo,
        telefono: ristorante.telefono,
        email: ristorante.email,
        categoria: ristorante.categoria,
        orari: ristorante.orari,
        proprietario: utenteRistoratore._id
      });
      
      mappaRistoranti.set(ristorante.nome, nuovoRistorante._id);
      console.log(`Ristorante creato: ${ristorante.nome}`);
    }
    
    // Carica i piatti
    for (const piatto of mealData.piatti) {
      const ristoranteId = mappaRistoranti.get(piatto.ristorante);
      
      if (!ristoranteId) {
        console.log(`Ristorante non trovato per il piatto: ${piatto.nome}`);
        continue;
      }
      
      await Dish.create({
        nome: piatto.nome,
        descrizione: piatto.descrizione,
        prezzoCentesimi: piatto.prezzoCentesimi,
        categoria: piatto.categoria,
        ristorante: ristoranteId,
        ingredienti: piatto.ingredienti,
        allergeni: piatto.allergeni,
        vegetariano: piatto.vegetariano,
        vegano: piatto.vegano,
        disponibile: piatto.disponibile
      });
      
      console.log(`Piatto creato: ${piatto.nome}`);
    }
    
    console.log('Dati iniziali caricati con successo!');
    console.log('Credenziali utente ristoratore:');
    console.log('  Email: ristoratore@example.com');
    console.log('  Password: password123');
    
  } catch (error) {
    console.error('Errore durante il caricamento dei dati iniziali:', error);
  }
};

// Connetti al database
connectDB();

// Swagger Documentation (se il file esiste)
try {
  const swaggerDocument = require('./lib/api/docs/swagger.json');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log('Swagger UI disponibile su /api-docs');
} catch (error) {
  console.log('Swagger documentation non disponibile');
}

// Route di benvenuto API
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Fast Food App API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      restaurants: '/api/restaurants',
      dishes: '/api/dishes',
      orders: '/api/orders',
      users: '/api/users'
    },
    documentation: '/api-docs'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware per API non trovate
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint API non trovato: ${req.originalUrl}`
  });
});

// Serve la homepage per tutte le altre route (per supportare client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});

// Error handling middleware (devono essere gli ultimi)
app.use(handleMongooseValidationError);
app.use(handleMongoDuplicateKeyError);
app.use(handleMongoCastError);
app.use(notFound);
app.use(errorHandler);

// Avvio del server
const server = app.listen(PORT, () => {
  console.log(`Server in esecuzione sulla porta ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API disponibili su http://localhost:${PORT}/api`);
});

// Gestione graceful shutdown
const gracefulShutdown = async () => {
  console.log('\nRicevuto segnale di shutdown. Chiusura connessioni...');
  
  server.close(async () => {
    console.log('Server HTTP chiuso');
    
    try {
      await mongoose.connection.close();
      console.log('Connessione MongoDB chiusa');
      process.exit(0);
    } catch (error) {
      console.error('Errore durante la chiusura:', error);
      process.exit(1);
    }
  });
  
  // Forza la chiusura dopo 10 secondi
  setTimeout(() => {
    console.error('Timeout: chiusura forzata');
    process.exit(1);
  }, 10000);
};

// Gestione segnali di terminazione
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Gestione errori non gestiti
process.on('unhandledRejection', async (err) => {
  console.error('UNHANDLED REJECTION! Arresto...');
  console.error(err.name, err.message);
  
  await gracefulShutdown();
});

module.exports = app;
