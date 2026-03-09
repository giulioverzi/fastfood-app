/**
 * menu.js - Script per la pagina dei ristoranti
 * Carica e visualizza tutti i ristoranti disponibili con filtri
 */

// Immagine di fallback per i ristoranti
const DEFAULT_RESTAURANT_IMAGE = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop';

// Variabili globali per memorizzare i dati
let allRestaurants = [];

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
 * Carica tutti i ristoranti disponibili
 */
async function loadRestaurants() {
  const loading = document.getElementById('restaurantsLoading');
  const container = document.getElementById('restaurantsContainer');
  const empty = document.getElementById('restaurantsEmpty');

  try {
    toggleElement('restaurantsLoading', true);
    toggleElement('restaurantsContainer', false);
    toggleElement('restaurantsEmpty', false);
    
    const response = await apiCall('/restaurants');

    if (response.success && response.data.length > 0) {
      allRestaurants = response.data;
      displayRestaurants(allRestaurants);
    } else {
      toggleElement('restaurantsLoading', false);
      toggleElement('restaurantsEmpty', true);
    }
  } catch (error) {
    console.error('Errore nel caricamento dei ristoranti:', error);
    showAlert('Errore nel caricamento dei ristoranti. Riprova più tardi.', 'error');
    toggleElement('restaurantsLoading', false);
    toggleElement('restaurantsEmpty', true);
  }
}

/**
 * Visualizza i ristoranti nel container
 * @param {Array} restaurants - Array di ristoranti da visualizzare
 */
function displayRestaurants(restaurants) {
  const container = document.getElementById('restaurantsContainer');
  const empty = document.getElementById('restaurantsEmpty');
  const loading = document.getElementById('restaurantsLoading');

  if (restaurants.length === 0) {
    toggleElement('restaurantsLoading', false);
    toggleElement('restaurantsContainer', false);
    toggleElement('restaurantsEmpty', true);
    return;
  }

  container.innerHTML = restaurants.map(restaurant => {
    const nome = escapeHtml(restaurant.nome);
    const via = escapeHtml(restaurant.indirizzo.via);
    const citta = escapeHtml(restaurant.indirizzo.citta);
    const descrizione = escapeHtml(restaurant.descrizione);
    const restaurantId = restaurant._id;
    
    return `
    <div class="restaurant-card" onclick="openRestaurantMenu('${restaurantId}')">
      <img src="${restaurant.immagine || DEFAULT_RESTAURANT_IMAGE}" 
           alt="${nome}"
           onerror="this.src='${DEFAULT_RESTAURANT_IMAGE}'">
      <div class="restaurant-card-content">
        <h3 class="restaurant-card-title">${nome}</h3>
        <p class="restaurant-card-address">
          <i class="fas fa-map-marker-alt"></i> ${via}, ${citta}
        </p>
        <p style="color: #666; font-size: 0.9rem; margin-top: 0.5rem;">${descrizione}</p>
        <div style="margin-top: 1rem;">
          <button class="btn btn-primary" onclick="event.stopPropagation(); openRestaurantMenu('${restaurantId}')">
            <i class="fas fa-utensils"></i> Vedi Menu
          </button>
        </div>
      </div>
    </div>
  `;
  }).join('');

  toggleElement('restaurantsLoading', false);
  toggleElement('restaurantsContainer', true);
  toggleElement('restaurantsEmpty', false);
}

/**
 * Cerca i ristoranti che servono un piatto con il nome indicato
 * @param {string} nomePiatto - Nome del piatto da cercare
 */
async function cercaRistorantiPerPiatto(nomePiatto) {
  try {
    toggleElement('restaurantsLoading', true);
    toggleElement('restaurantsContainer', false);
    toggleElement('restaurantsEmpty', false);

    const risposta = await apiCall('/dishes?name=' + encodeURIComponent(nomePiatto));

    // Aggiorna il messaggio per il caso vuoto
    const emptyEl = document.getElementById('restaurantsEmpty');
    const emptyP = emptyEl ? emptyEl.querySelector('p') : null;
    if (emptyP) emptyP.textContent = 'Nessun ristorante trovato per questo piatto.';

    if (!risposta.success || risposta.data.length === 0) {
      toggleElement('restaurantsLoading', false);
      toggleElement('restaurantsEmpty', true);
      return;
    }

    // De-duplica i ristoranti per _id
    const ristorantiMap = new Map();
    risposta.data.forEach(piatto => {
      if (piatto.ristorante && piatto.ristorante._id) {
        ristorantiMap.set(String(piatto.ristorante._id), piatto.ristorante);
      }
    });

    displayRestaurants(Array.from(ristorantiMap.values()));
  } catch (errore) {
    console.error('Errore nella ricerca per piatto:', errore);
    showAlert('Errore nella ricerca per piatto. Riprova più tardi.', 'error');
    toggleElement('restaurantsLoading', false);
    toggleElement('restaurantsEmpty', true);
  }
}

/**
 * Applica i filtri ai ristoranti
 */
async function applyFilters() {
  const nomePiatto = document.getElementById('dishNameFilter').value.trim();

  // Se l'utente cerca per piatto, ignora gli altri filtri e usa l'API
  if (nomePiatto) {
    await cercaRistorantiPerPiatto(nomePiatto);
    return;
  }

  const nameFilter = document.getElementById('nameFilter').value.toLowerCase();
  const locationFilter = document.getElementById('locationFilter').value.toLowerCase();

  // Ripristina il messaggio vuoto predefinito
  const emptyEl = document.getElementById('restaurantsEmpty');
  const emptyP = emptyEl ? emptyEl.querySelector('p') : null;
  if (emptyP) emptyP.textContent = 'Nessun ristorante disponibile con i filtri selezionati.';

  let filteredRestaurants = allRestaurants;

  // Filtro per nome
  if (nameFilter) {
    filteredRestaurants = filteredRestaurants.filter(restaurant => 
      restaurant.nome.toLowerCase().includes(nameFilter)
    );
  }

  // Filtro per località
  if (locationFilter) {
    filteredRestaurants = filteredRestaurants.filter(restaurant => 
      restaurant.indirizzo.citta.toLowerCase().includes(locationFilter) ||
      restaurant.indirizzo.via.toLowerCase().includes(locationFilter)
    );
  }

  displayRestaurants(filteredRestaurants);
}

/**
 * Apre la pagina del menu di un ristorante specifico
 * @param {string} restaurantId - ID del ristorante
 */
function openRestaurantMenu(restaurantId) {
  // Naviga alla pagina del menu del ristorante utilizzando un parametro URL
  window.location.href = `/html/restaurant.html?id=${restaurantId}`;
}

// Inizializzazione della pagina ristoranti
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Pagina ristoranti caricata');
  
  // Carica i ristoranti
  await loadRestaurants();

  // Aggiungi event listeners per i filtri
  document.getElementById('nameFilter').addEventListener('input', applyFilters);
  document.getElementById('locationFilter').addEventListener('input', applyFilters);
  document.getElementById('dishNameFilter').addEventListener('input', applyFilters);
});
