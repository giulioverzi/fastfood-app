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
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

// Import routes
const authRoutes = require('./backend/routes/auth');
const restaurantRoutes = require('./backend/routes/restaurants');
const dishRoutes = require('./backend/routes/dishes');
const orderRoutes = require('./backend/routes/orders');
const userRoutes = require('./backend/routes/users');

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
  } catch (error) {
    console.error(`Errore connessione MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Connetti al database
connectDB();

// Swagger Documentation (se il file esiste)
try {
  const swaggerDocument = YAML.load('./lib/api/docs/swagger.yaml');
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
app.listen(PORT, () => {
  console.log(`Server in esecuzione sulla porta ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API disponibili su http://localhost:${PORT}/api`);
});

// Gestione errori non gestiti
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Arresto...');
  console.error(err.name, err.message);
  process.exit(1);
});

module.exports = app;
