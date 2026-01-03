/**
 * Server principale dell'applicazione Fast Food
 * @module server
 */

require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

// Connetti al database
connectDB();

// Avvia il server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server in esecuzione sulla porta ${PORT} in modalità ${process.env.NODE_ENV || 'development'}`);
  console.log(`Documentazione API disponibile su: http://localhost:${PORT}/api-docs`);
});

