/**
 * restaurant.js - Script per la pagina del menu di un singolo ristorante
 * Carica e visualizza i piatti di un ristorante specifico con filtri
 */

// Immagine di fallback per i piatti
const DEFAULT_DISH_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop';

// Variabili globali per memorizzare i dati
let currentRestaurant = null;
let allDishes = [];

/**
 * Ottiene l'ID del ristorante dall'URL
 * @returns {string|null} ID del ristorante o null
 */
function getRestaurantIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

/**
 * Carica i dati del ristorante
 * @param {string} restaurantId - ID del ristorante
 */
async function loadRestaurant(restaurantId) {
  try {
    const response = await apiCall(`/restaurants/${restaurantId}`);

    if (response.success && response.data) {
      currentRestaurant = response.data;
      displayRestaurantHeader();
    } else {
      showAlert('Ristorante non trovato', 'error');
      setTimeout(() => {
        window.location.href = '/menu.html';
      }, 2000);
    }
  } catch (error) {
    console.error('Errore nel caricamento del ristorante:', error);
    showAlert('Errore nel caricamento del ristorante. Riprova più tardi.', 'error');
    setTimeout(() => {
      window.location.href = '/menu.html';
    }, 2000);
  }
}

/**
 * Visualizza l'header del ristorante
 */
function displayRestaurantHeader() {
  const header = document.getElementById('restaurantHeader');
  if (!header || !currentRestaurant) return;

  const nome = escapeHtml(currentRestaurant.nome);
  const descrizione = escapeHtml(currentRestaurant.descrizione);
  const via = escapeHtml(currentRestaurant.indirizzo.via);
  const citta = escapeHtml(currentRestaurant.indirizzo.citta);
  const telefono = currentRestaurant.telefono ? escapeHtml(currentRestaurant.telefono) : '';

  header.innerHTML = `
    <h1><i class="fas fa-utensils"></i> ${nome}</h1>
    <p>${descrizione}</p>
    <p style="margin-top: 0.5rem;">
      <i class="fas fa-map-marker-alt"></i> ${via}, ${citta}
      ${telefono ? ` | <i class="fas fa-phone"></i> ${telefono}` : ''}
    </p>
  `;
}

/**
 * Carica tutti i piatti del ristorante
 * @param {string} restaurantId - ID del ristorante
 */
async function loadDishes(restaurantId) {
  const loading = document.getElementById('menuLoading');
  const container = document.getElementById('menuContainer');
  const empty = document.getElementById('menuEmpty');

  try {
    toggleElement('menuLoading', true);
    toggleElement('menuContainer', false);
    toggleElement('menuEmpty', false);
    
    const response = await apiCall(`/dishes?ristorante=${restaurantId}`);

    if (response.success && response.data.length > 0) {
      allDishes = response.data;
      displayDishes(allDishes);
    } else {
      toggleElement('menuLoading', false);
      toggleElement('menuEmpty', true);
    }
  } catch (error) {
    console.error('Errore nel caricamento dei piatti:', error);
    showAlert('Errore nel caricamento del menu. Riprova più tardi.', 'error');
    toggleElement('menuLoading', false);
    toggleElement('menuEmpty', true);
  }
}

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
 * Visualizza i piatti nel container
 * @param {Array} dishes - Array di piatti da visualizzare
 */
function displayDishes(dishes) {
  const container = document.getElementById('menuContainer');
  const empty = document.getElementById('menuEmpty');
  const loading = document.getElementById('menuLoading');

  if (dishes.length === 0) {
    toggleElement('menuLoading', false);
    toggleElement('menuContainer', false);
    toggleElement('menuEmpty', true);
    return;
  }

  container.innerHTML = dishes.map(dish => {
    const dishName = escapeHtml(dish.nome);
    const dishDescription = escapeHtml(dish.descrizione);
    const dishId = dish._id;
    const badges = [];
    
    if (dish.vegetariano) badges.push('<span class="badge badge-success"><i class="fas fa-leaf"></i> Vegetariano</span>');
    if (dish.vegano) badges.push('<span class="badge badge-success"><i class="fas fa-seedling"></i> Vegano</span>');
    
    return `
      <div class="menu-item">
        <img src="${dish.immagine || DEFAULT_DISH_IMAGE}" 
             alt="${dishName}"
             onerror="this.src='${DEFAULT_DISH_IMAGE}'">
        <div class="menu-item-content">
          <h3 class="menu-item-title">${dishName}</h3>
          <p class="menu-item-description">${dishDescription}</p>
          <p style="color: #666; font-size: 0.9rem; margin-bottom: 0.5rem;">
            <i class="fas fa-tag"></i> ${translateCategory(dish.categoria)}
          </p>
          <div style="margin-bottom: 1rem;">
            ${badges.join(' ')}
          </div>
          <div class="menu-item-footer">
            <span class="menu-item-price">${formatPrice(dish.prezzo)}</span>
            ${isAuthenticated() && getUserData().ruolo === 'cliente' ? 
              `<button class="btn btn-primary" onclick="handleAddToCart('${dishId}')">
                <i class="fas fa-cart-plus"></i> Aggiungi
              </button>` : 
              !isAuthenticated() ?
              `<a href="/login.html" class="btn btn-primary">
                <i class="fas fa-sign-in-alt"></i> Login per ordinare
              </a>` :
              `<button class="btn btn-secondary" disabled>
                Solo per clienti
              </button>`
            }
          </div>
        </div>
      </div>
    `;
  }).join('');

  toggleElement('menuLoading', false);
  toggleElement('menuContainer', true);
  toggleElement('menuEmpty', false);
}

/**
 * Traduce la categoria in italiano leggibile
 * @param {string} category - Categoria del piatto
 * @returns {string} Categoria tradotta
 */
function translateCategory(category) {
  const translations = {
    'antipasti': 'Antipasti',
    'primi': 'Primi Piatti',
    'secondi': 'Secondi Piatti',
    'contorni': 'Contorni',
    'dessert': 'Dessert',
    'bevande': 'Bevande',
    'panini': 'Panini',
    'pizze': 'Pizze',
    'insalate': 'Insalate'
  };
  return translations[category] || category;
}

/**
 * Applica i filtri ai piatti
 */
function applyFilters() {
  const categoryFilter = document.getElementById('categoryFilter').value;
  const priceFilter = parseFloat(document.getElementById('priceFilter').value);
  const vegetarianFilter = document.getElementById('vegetarianFilter').checked;
  const veganFilter = document.getElementById('veganFilter').checked;
  const allergenFilter = document.getElementById('allergenFilter');
  const selectedAllergens = Array.from(allergenFilter.selectedOptions).map(option => option.value);

  let filteredDishes = allDishes;

  // Filtro categoria
  if (categoryFilter) {
    filteredDishes = filteredDishes.filter(dish => dish.categoria === categoryFilter);
  }

  // Filtro prezzo massimo
  if (!isNaN(priceFilter) && priceFilter > 0) {
    filteredDishes = filteredDishes.filter(dish => dish.prezzo <= priceFilter);
  }

  // Filtro vegetariano
  if (vegetarianFilter) {
    filteredDishes = filteredDishes.filter(dish => dish.vegetariano);
  }

  // Filtro vegano
  if (veganFilter) {
    filteredDishes = filteredDishes.filter(dish => dish.vegano);
  }

  // Filtro allergeni - esclude piatti che contengono gli allergeni selezionati
  if (selectedAllergens.length > 0) {
    filteredDishes = filteredDishes.filter(dish => {
      // Se il piatto non ha allergeni definiti, lo includiamo
      if (!dish.allergeni || dish.allergeni.length === 0) {
        return true;
      }
      // Escludi il piatto se contiene almeno uno degli allergeni selezionati
      return !dish.allergeni.some(allergen => selectedAllergens.includes(allergen));
    });
  }

  displayDishes(filteredDishes);
}

/**
 * Gestisce l'aggiunta di un piatto al carrello
 * @param {string} dishId - ID del piatto
 */
function handleAddToCart(dishId) {
  const dish = allDishes.find(d => d._id === dishId);
  if (!dish) return;

  const dishData = {
    nome: dish.nome,
    prezzo: dish.prezzo,
    ristorante: currentRestaurant._id,
    ristoranteNome: currentRestaurant.nome,
    immagine: dish.immagine
  };

  addToCart(dishId, dishData);
}

// Inizializzazione della pagina menu ristorante
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Pagina menu ristorante caricata');
  
  // Ottieni l'ID del ristorante dall'URL
  const restaurantId = getRestaurantIdFromUrl();
  
  if (!restaurantId) {
    showAlert('ID ristorante non valido', 'error');
    setTimeout(() => {
      window.location.href = '/menu.html';
    }, 2000);
    return;
  }

  // Carica i dati del ristorante e i suoi piatti
  await loadRestaurant(restaurantId);
  await loadDishes(restaurantId);

  // Aggiungi event listeners per i filtri
  document.getElementById('categoryFilter').addEventListener('change', applyFilters);
  document.getElementById('priceFilter').addEventListener('input', applyFilters);
  document.getElementById('vegetarianFilter').addEventListener('change', applyFilters);
  document.getElementById('veganFilter').addEventListener('change', applyFilters);
  document.getElementById('allergenFilter').addEventListener('change', applyFilters);
});
