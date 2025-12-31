/**
 * Server principale dell'applicazione Fast Food
 * @module server
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');

// Inizializza l'app Express
const app = express();

// Connetti al database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve i file statici dalla cartella public
app.use(express.static(path.join(__dirname, 'public')));

// Serve anche i file dalla cartella data (per meals 1.json)
app.use('/data', express.static(path.join(__dirname, 'data')));

// Routes API
app.use('/api/auth', require('./backend/routes/auth'));
app.use('/api/users', require('./backend/routes/users'));
app.use('/api/restaurants', require('./backend/routes/restaurants'));
app.use('/api/dishes', require('./backend/routes/dishes'));
app.use('/api/orders', require('./backend/routes/orders'));

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

// Avvia il server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server in esecuzione sulla porta ${PORT} in modalità ${process.env.NODE_ENV || 'development'}`);
});
