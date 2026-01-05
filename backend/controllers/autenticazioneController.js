/**
 * autenticazioneController.js - Controller per l'autenticazione
 * 
 * Gestisce la logica di registrazione e login utenti
 */

const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

/**
 * Registra un nuovo utente
 * @param {Object} datiUtente - Dati dell'utente da registrare
 * @returns {Object} Utente creato e token
 */
const registraUtente = async (datiUtente) => {
  const { nome, cognome, email, password, ruolo, telefono, indirizzo } = datiUtente;

  // Verifica se l'utente esiste gia
  const utenteEsistente = await User.findOne({ email });
  if (utenteEsistente) {
    throw new Error('Email gia registrata');
  }

  // Crea nuovo utente
  const utente = await User.create({
    nome,
    cognome,
    email,
    password,
    ruolo,
    telefono,
    indirizzo
  });

  // Genera token
  const token = generateToken(utente._id);

  return {
    token,
    utente: {
      id: utente._id,
      nome: utente.nome,
      cognome: utente.cognome,
      email: utente.email,
      ruolo: utente.ruolo
    }
  };
};

/**
 * Effettua il login di un utente
 * @param {string} email - Email utente
 * @param {string} password - Password utente
 * @returns {Object} Utente e token
 */
const loginUtente = async (email, password) => {
  // Trova l'utente e includi la password
  const utente = await User.findOne({ email }).select('+password');
  
  if (!utente) {
    throw new Error('Credenziali non valide');
  }

  // Verifica la password
  const passwordCorretta = await utente.verificaPassword(password);
  
  if (!passwordCorretta) {
    throw new Error('Credenziali non valide');
  }

  // Genera token
  const token = generateToken(utente._id);

  return {
    token,
    utente: {
      id: utente._id,
      nome: utente.nome,
      cognome: utente.cognome,
      email: utente.email,
      ruolo: utente.ruolo
    }
  };
};

module.exports = {
  registraUtente,
  loginUtente
};
