/**
 * common.js - Funzioni condivise per tutte le pagine
 * Include gestione header, controlli autenticazione, e utility comuni
 */

// Costanti API
const API_BASE_URL = '/api';

/**
 * Ottiene il token JWT dal localStorage
 * @returns {string|null} Il token JWT o null se non presente
 */
function getToken() {
  return localStorage.getItem('token');
}

/**
 * Ottiene i dati dell'utente dal localStorage
 * @returns {object|null} I dati dell'utente o null se non presente
 */
function getUserData() {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
}

/**
 * Salva il token e i dati utente nel localStorage
 * @param {string} token - Il token JWT
 * @param {object} user - I dati dell'utente
 */
function saveAuthData(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

/**
 * Rimuove i dati di autenticazione dal localStorage
 */
function clearAuthData() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

/**
 * Verifica se l'utente è autenticato
 * @returns {boolean} true se autenticato, false altrimenti
 */
function isAuthenticated() {
  return !!getToken();
}

/**
 * Controlla l'autenticazione e reindirizza se necessario
 * @param {string} requiredRole - Ruolo richiesto (opzionale)
 */
function checkAuth(requiredRole = null) {
  if (!isAuthenticated()) {
    window.location.href = '/login.html';
    return false;
  }

  const user = getUserData();
  if (requiredRole && user.ruolo !== requiredRole) {
    showAlert('Non hai i permessi per accedere a questa pagina', 'error');
    window.location.href = '/';
    return false;
  }

  return true;
}

/**
 * Aggiorna i link di navigazione in base allo stato di autenticazione
 */
function updateNavLinks() {
  const authLinksContainer = document.getElementById('authLinks');
  if (!authLinksContainer) return;

  if (isAuthenticated()) {
    const user = getUserData();
    const dashboardUrl = user.ruolo === 'ristoratore' 
      ? '/dashboard-restaurant.html' 
      : '/dashboard-customer.html';

    authLinksContainer.innerHTML = `
      <li><a href="${dashboardUrl}">Dashboard</a></li>
      <li><a href="#" id="logoutBtn" class="btn btn-secondary">Logout</a></li>
    `;

    // Aggiungi evento logout
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
  } else {
    authLinksContainer.innerHTML = `
      <li><a href="/login.html" class="btn btn-primary">Login</a></li>
      <li><a href="/register.html" class="btn btn-secondary">Registrati</a></li>
    `;
  }
}

/**
 * Gestisce il logout dell'utente
 * @param {Event} e - L'evento click
 */
function handleLogout(e) {
  e.preventDefault();
  clearAuthData();
  showAlert('Logout effettuato con successo', 'success');
  setTimeout(() => {
    window.location.href = '/';
  }, 1000);
}

/**
 * Mostra un messaggio di alert
 * @param {string} message - Il messaggio da mostrare
 * @param {string} type - Il tipo di alert (success, error, info)
 */
function showAlert(message, type = 'info') {
  const alertContainer = document.getElementById('alert');
  if (!alertContainer) return;

  const alertClass = type === 'error' ? 'alert-error' : 
                     type === 'success' ? 'alert-success' : 'alert-info';
  
  alertContainer.innerHTML = `
    <div class="alert ${alertClass}">
      ${message}
    </div>
  `;

  // Rimuovi l'alert dopo 5 secondi
  setTimeout(() => {
    alertContainer.innerHTML = '';
  }, 5000);
}

/**
 * Effettua una chiamata API con autenticazione
 * @param {string} endpoint - L'endpoint API
 * @param {object} options - Opzioni fetch (metodo, body, ecc.)
 * @returns {Promise} La risposta della chiamata API
 */
async function apiCall(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Errore nella richiesta');
    }

    return data;
  } catch (error) {
    console.error('Errore API:', error);
    throw error;
  }
}

/**
 * Formatta una data in formato italiano
 * @param {string|Date} date - La data da formattare
 * @returns {string} La data formattata
 */
function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Formatta un prezzo in euro
 * @param {number} price - Il prezzo da formattare
 * @returns {string} Il prezzo formattato
 */
function formatPrice(price) {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
}

/**
 * Mostra/nasconde un elemento
 * @param {string} elementId - L'ID dell'elemento
 * @param {boolean} show - true per mostrare, false per nascondere
 */
function toggleElement(elementId, show) {
  const element = document.getElementById(elementId);
  if (element) {
    if (show) {
      element.classList.remove('hidden');
    } else {
      element.classList.add('hidden');
    }
  }
}

/**
 * Traduce lo stato dell'ordine in italiano
 * @param {string} status - Lo stato dell'ordine
 * @returns {string} Lo stato tradotto
 */
function translateOrderStatus(status) {
  const translations = {
    'ordinato': 'Ordinato',
    'in_preparazione': 'In Preparazione',
    'pronto': 'Pronto',
    'in_consegna': 'In Consegna',
    'consegnato': 'Consegnato',
    'completato': 'Completato',
    'annullato': 'Annullato'
  };
  return translations[status] || status;
}

// Inizializza i link di navigazione quando il DOM è caricato
document.addEventListener('DOMContentLoaded', () => {
  updateNavLinks();
});
