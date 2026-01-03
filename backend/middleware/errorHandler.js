/**
 * Error Handler Middleware - Middleware per la gestione centralizzata degli errori
 * 
 * Gestisce tutti gli errori dell'applicazione e fornisce risposte consistenti
 */

/**
 * Middleware per gestire errori 404 (route non trovate)
 */
const notFound = (req, res, next) => {
  const error = new Error(`Non trovato - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Middleware per gestire tutti gli errori dell'applicazione
 */
const errorHandler = (err, req, res, next) => {
  // Imposta lo status code (usa 500 se non specificato)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Log dell'errore in modalità sviluppo
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }
  
  res.status(statusCode).json({
    success: false,
    message: err.message,
    // Include lo stack trace solo in modalità sviluppo
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * Gestisce gli errori di validazione di Mongoose
 */
const handleMongooseValidationError = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => ({
      field: error.path,
      message: error.message
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Errore di validazione',
      errors
    });
  }
  
  next(err);
};

/**
 * Gestisce gli errori di duplicazione (unique constraint) di MongoDB
 */
const handleMongoDuplicateKeyError = (err, req, res, next) => {
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `Il campo '${field}' esiste già nel database`
    });
  }
  
  next(err);
};

/**
 * Gestisce gli errori di cast di MongoDB (ID non validi)
 */
const handleMongoCastError = (err, req, res, next) => {
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `ID non valido: ${err.value}`
    });
  }
  
  next(err);
};

module.exports = {
  notFound,
  errorHandler,
  handleMongooseValidationError,
  handleMongoDuplicateKeyError,
  handleMongoCastError
};
