/**
 * Gestione autenticazione frontend
 * @module public/js/auth
 */

const API_URL = 'http://localhost:3000/api';

/**
 * Ottieni il token JWT dal localStorage
 * @returns {string|null} Token JWT
 */
function getToken() {
  return localStorage.getItem('token');
}

/**
 * Salva il token JWT nel localStorage
 * @param {string} token - Token JWT
 */
function setToken(token) {
  localStorage.setItem('token', token);
}

/**
 * Rimuovi il token JWT dal localStorage
 */
function removeToken() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

/**
 * Ottieni i dati dell'utente dal localStorage
 * @returns {Object|null} Dati utente
 */
function getUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

/**
 * Salva i dati dell'utente nel localStorage
 * @param {Object} user - Dati utente
 */
function setUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

/**
 * Verifica se l'utente è autenticato
 * @returns {boolean}
 */
function isAuthenticated() {
  return !!getToken();
}

/**
 * Effettua il logout
 */
function logout() {
  removeToken();
  window.location.href = '/';
}

/**
 * Configura gli headers per le richieste autenticate
 * @returns {Object} Headers
 */
function getAuthHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
}

/**
 * Aggiorna i link di navigazione in base allo stato di autenticazione
 */
function updateNavLinks() {
  const authLinksContainer = document.getElementById('authLinks');
  if (!authLinksContainer) return;

  if (isAuthenticated()) {
    const user = getUser();
    authLinksContainer.innerHTML = `
      <li><a href="/dashboard.html">Dashboard</a></li>
      <li><a href="#" onclick="logout(); return false;" style="color: var(--secondary-color); font-weight: bold;">Logout (${user.nome})</a></li>
    `;
  } else {
    authLinksContainer.innerHTML = `
      <li><a href="/login.html" class="btn btn-outline" style="border-color: white; color: white;">Login</a></li>
      <li><a href="/register.html" class="btn btn-secondary">Registrati</a></li>
    `;
  }
}

/**
 * Mostra un messaggio di alert
 * @param {string} message - Messaggio
 * @param {string} type - Tipo (success, error, info)
 * @param {string} containerId - ID del container
 */
function showAlert(message, type = 'info', containerId = 'alert') {
  const alertContainer = document.getElementById(containerId);
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

// Aggiorna i link di navigazione al caricamento della pagina
document.addEventListener('DOMContentLoaded', updateNavLinks);
