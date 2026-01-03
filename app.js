/**
 * Configurazione dell'applicazione Express
 * @module app
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

// Inizializza l'app Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve i file statici dalla cartella public
app.use(express.static(path.join(__dirname, 'public')));

// Swagger UI - Documentazione API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Fast Food App API Docs',
  customfavIcon: '/favicon.ico'
}));

// Endpoint per scaricare le specifiche OpenAPI in formato JSON
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Routes API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/dishes', require('./routes/dishes'));
app.use('/api/orders', require('./routes/orders'));

// Route di default - serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Gestione degli errori 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Risorsa non trovata' });
});

// Gestione generale degli errori
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Errore interno del server',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;
