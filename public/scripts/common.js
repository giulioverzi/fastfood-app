/**
 * common.js - Funzioni condivise per tutte le pagine
 * Include gestione header, controlli autenticazione, e utility comuni
 */

// Costanti API
const API_BASE_URL = '/api';

/**
 * Escape HTML per prevenire attacchi XSS
 * @param {string} unsafe - Stringa non sicura
 * @returns {string} Stringa con escape
 */
function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Ottiene il token JWT dal localStorage
 * Questo permette di mantenere la sessione utente anche dopo il refresh della pagina
 * @returns {string|null} Il token JWT o null se non presente
 */
function getToken() {
  // localStorage.getItem recupera il token JWT salvato precedentemente
  // Questo è necessario per mantenere l'utente autenticato tra le diverse pagine e dopo il refresh
  return localStorage.getItem('token');
}

/**
 * Ottiene i dati dell'utente dal localStorage
 * Permette di accedere alle informazioni utente (nome, ruolo, etc.) senza fare chiamate API
 * @returns {object|null} I dati dell'utente o null se non presente
 */
function getUserData() {
  // localStorage.getItem recupera i dati utente salvati come stringa JSON
  // Questi dati persistono anche dopo il refresh della pagina
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
}

/**
 * Salva il token e i dati utente nel localStorage
 * Questo permette di mantenere l'autenticazione tra le pagine e dopo il refresh del browser
 * @param {string} token - Il token JWT ricevuto dal server dopo login/registrazione
 * @param {object} user - I dati dell'utente (nome, email, ruolo, etc.)
 */
function saveAuthData(token, user) {
  // localStorage.setItem salva il token JWT nel browser
  // Questo permette la persistenza della sessione tra i refresh della pagina
  localStorage.setItem('token', token);
  
  // localStorage.setItem salva i dati utente come stringa JSON nel browser
  // Permette di accedere rapidamente alle informazioni utente senza chiamate API
  localStorage.setItem('user', JSON.stringify(user));
}

/**
 * Rimuove i dati di autenticazione dal localStorage
 * Utilizzato durante il logout per cancellare la sessione utente
 */
function clearAuthData() {
  // localStorage.removeItem rimuove il token JWT salvato
  // Questo invalida la sessione utente nel browser
  localStorage.removeItem('token');
  
  // localStorage.removeItem rimuove i dati utente salvati
  // L'utente dovrà effettuare nuovamente il login per accedere
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
    window.location.href = '/html/login.html';
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
      ? '/html/dashboard-restaurant.html' 
      : '/html/dashboard-customer.html';

    // Rimuovi link Dashboard statico se presente e aggiungi quello dinamico
    const navLinks = document.getElementById('navLinks');
    const existingDashboardLink = navLinks ? navLinks.querySelector('a[href*="dashboard"]') : null;
    if (existingDashboardLink && existingDashboardLink.parentElement) {
      existingDashboardLink.parentElement.remove();
    }

    authLinksContainer.innerHTML = `
      <a href="${dashboardUrl}">Dashboard</a>
      <a href="#" id="logoutBtn" class="btn btn-secondary">Logout</a>
    `;

    // Aggiungi evento logout
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
  } else {
    // Pulsanti Login e Registrati sempre affiancati
    authLinksContainer.innerHTML = `
      <a href="/html/login.html" class="btn btn-primary">Login</a>
      <a href="/html/register.html" class="btn btn-secondary">Registrati</a>
    `;
  }
}

/**
 * Aggiorna l'icona del carrello nell'header
 */
function updateCartIcon() {
  const cartIconContainer = document.getElementById('cartIcon');
  if (!cartIconContainer) return;

  const cart = getCart();
  const itemCount = cart.reduce((total, item) => total + item.quantita, 0);

  cartIconContainer.innerHTML = `
    <a href="#" id="cartBtn" class="cart-link" onclick="toggleCart(); return false;">
      <i class="fas fa-shopping-cart"></i>
      ${itemCount > 0 ? `<span class="cart-badge">${parseInt(itemCount)}</span>` : ''}
    </a>
  `;
}

/**
 * Ottiene il carrello dal localStorage
 * Il carrello persiste anche dopo il refresh della pagina
 * @returns {Array} Array di articoli nel carrello
 */
function getCart() {
  // localStorage.getItem recupera il carrello salvato come stringa JSON
  // Questo permette di mantenere gli articoli nel carrello tra i refresh
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

/**
 * Salva il carrello nel localStorage
 * Permette di mantenere il carrello anche dopo il refresh della pagina
 * @param {Array} cart - Array di articoli del carrello
 */
function saveCart(cart) {
  // localStorage.setItem salva il carrello come stringa JSON nel browser
  // Gli articoli nel carrello persistono tra i refresh della pagina
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartIcon();
}

/**
 * Aggiunge un piatto al carrello
 * @param {string} dishId - ID del piatto
 * @param {object} dishData - Dati del piatto
 */
function addToCart(dishId, dishData) {
  let cart = getCart();
  
  // Verifica se ci sono già piatti da un altro ristorante
  if (cart.length > 0 && cart[0].ristorante !== dishData.ristorante) {
    const previousRestaurant = cart[0].ristoranteNome;
    const currentRestaurant = dishData.ristoranteNome;
    
    // Mostra avviso e chiedi conferma
    const message = `Hai già piatti nel carrello dal ristorante "${previousRestaurant}".\n\nAggiungendo piatti da "${currentRestaurant}", il carrello precedente verrà svuotato.\n\nVuoi continuare?`;
    
    if (!confirm(message)) {
      return; // L'utente ha annullato
    }
    
    // Svuota il carrello precedente e ottieni il nuovo carrello vuoto
    // localStorage.removeItem cancella il carrello precedente dal browser
    // Necessario perché non si possono ordinare piatti da ristoranti diversi
    localStorage.removeItem('cart');
    cart = [];
  }
  
  const existingItem = cart.find(item => item.piatto === dishId);

  if (existingItem) {
    existingItem.quantita += 1;
  } else {
    cart.push({
      piatto: dishId,
      nome: dishData.nome,
      prezzo: dishData.prezzo,
      ristorante: dishData.ristorante,
      ristoranteNome: dishData.ristoranteNome,
      immagine: dishData.immagine,
      quantita: 1
    });
  }

  saveCart(cart);
  showAlert('Piatto aggiunto al carrello!', 'success');
}

/**
 * Rimuove un piatto dal carrello
 * @param {string} dishId - ID del piatto
 */
function removeFromCart(dishId) {
  let cart = getCart();
  cart = cart.filter(item => item.piatto !== dishId);
  saveCart(cart);
}

/**
 * Aggiorna la quantità di un piatto nel carrello
 * @param {string} dishId - ID del piatto
 * @param {number} newQuantity - Nuova quantità
 */
function updateCartQuantity(dishId, newQuantity) {
  const cart = getCart();
  const item = cart.find(item => item.piatto === dishId);
  
  if (item) {
    if (newQuantity <= 0) {
      removeFromCart(dishId);
    } else {
      item.quantita = newQuantity;
      saveCart(cart);
    }
  }
}

/**
 * Svuota completamente il carrello
 * Rimuove tutti gli articoli dal carrello e dal localStorage
 */
function clearCart() {
  // localStorage.removeItem cancella il carrello dal browser
  // Utilizzato dopo aver completato un ordine o per svuotare manualmente
  localStorage.removeItem('cart');
  updateCartIcon();
}

/**
 * Mostra/nasconde il modale del carrello
 */
function toggleCart() {
  const modal = document.getElementById('cartModal');
  if (!modal) {
    createCartModal();
  } else {
    modal.classList.toggle('hidden');
  }
  renderCart();
}

/**
 * Crea il modale del carrello se non esiste
 */
function createCartModal() {
  const modalHtml = `
    <div id="cartModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2><i class="fas fa-shopping-cart"></i> Carrello</h2>
          <button class="modal-close" onclick="toggleCart()">&times;</button>
        </div>
        <div id="cartContent" class="modal-body"></div>
        <div class="modal-footer" id="cartFooter"></div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

/**
 * Renderizza il contenuto del carrello
 */
function renderCart() {
  const cartContent = document.getElementById('cartContent');
  const cartFooter = document.getElementById('cartFooter');
  
  if (!cartContent || !cartFooter) return;

  const cart = getCart();

  if (cart.length === 0) {
    cartContent.innerHTML = '<p class="text-center">Il carrello è vuoto</p>';
    cartFooter.innerHTML = '';
    return;
  }

  const totale = cart.reduce((sum, item) => sum + (item.prezzo * item.quantita), 0);

  cartContent.innerHTML = cart.map(item => {
    const nome = escapeHtml(item.nome);
    const ristoranteNome = escapeHtml(item.ristoranteNome);
    const piattoId = item.piatto;
    const immagine = escapeHtml(item.immagine || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=80&h=80&fit=crop');
    
    return `
    <div class="cart-item">
      <img src="${immagine}" 
           alt="${nome}" class="cart-item-image">
      <div class="cart-item-details">
        <h4>${nome}</h4>
        <p class="cart-item-restaurant">${ristoranteNome}</p>
        <p class="cart-item-price">${formatPrice(item.prezzo)}</p>
      </div>
      <div class="cart-item-controls">
        <button onclick="updateCartQuantity('${piattoId}', ${parseInt(item.quantita - 1)})" class="btn-quantity">-</button>
        <span class="cart-item-quantity">${parseInt(item.quantita)}</span>
        <button onclick="updateCartQuantity('${piattoId}', ${parseInt(item.quantita + 1)})" class="btn-quantity">+</button>
        <button onclick="removeFromCart('${piattoId}'); renderCart();" class="btn-remove">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `;
  }).join('');

  cartFooter.innerHTML = `
    <div class="cart-total">
      <strong>Totale:</strong> ${formatPrice(totale)}
    </div>
    <button onclick="proceedToCheckout()" class="btn btn-primary btn-full-width">
      <i class="fas fa-credit-card"></i> Procedi all'ordine
    </button>
  `;
}

/**
 * Procedi al checkout
 */
function proceedToCheckout() {
  if (!isAuthenticated()) {
    showAlert('Devi effettuare il login per procedere con l\'ordine', 'error');
    setTimeout(() => {
      window.location.href = '/html/login.html';
    }, 1500);
    return;
  }

  const cart = getCart();
  if (cart.length === 0) {
    showAlert('Il carrello è vuoto', 'error');
    return;
  }

  // Verifica che tutti gli articoli siano dello stesso ristorante
  const restaurantIds = [...new Set(cart.map(item => item.ristorante))];
  if (restaurantIds.length > 1) {
    showAlert('Puoi ordinare solo da un ristorante alla volta. Svuota il carrello e riprova.', 'error');
    return;
  }

  // Salva il carrello e vai alla pagina di checkout
  window.location.href = '/html/checkout.html';
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
    
    // Verifica se la risposta è JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('La risposta non è in formato JSON');
    }

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

// Inizializza i link di navigazione e il carrello quando il DOM è caricato
document.addEventListener('DOMContentLoaded', () => {
  updateNavLinks();
  updateCartIcon();
});
