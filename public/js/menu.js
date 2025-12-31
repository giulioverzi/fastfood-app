/**
 * menu.js - Script per la pagina del menu
 * Carica e visualizza tutti i piatti disponibili con filtri
 */

// Immagine di fallback per i piatti
const DEFAULT_DISH_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop';

// Variabili globali per memorizzare i dati
let allDishes = [];
let allRestaurants = [];

/**
 * Carica tutti i ristoranti per il filtro
 */
async function loadRestaurants() {
  try {
    const response = await apiCall('/restaurants');
    if (response.success && response.data.length > 0) {
      allRestaurants = response.data;
      
      // Popola il filtro ristoranti
      const restaurantFilter = document.getElementById('restaurantFilter');
      allRestaurants.forEach(restaurant => {
        const option = document.createElement('option');
        option.value = restaurant._id;
        option.textContent = restaurant.nome;
        restaurantFilter.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Errore nel caricamento dei ristoranti:', error);
  }
}

/**
 * Carica tutti i piatti disponibili
 */
async function loadDishes() {
  const loading = document.getElementById('menuLoading');
  const container = document.getElementById('menuContainer');
  const empty = document.getElementById('menuEmpty');

  try {
    toggleElement('menuLoading', true);
    toggleElement('menuContainer', false);
    toggleElement('menuEmpty', false);
    
    const response = await apiCall('/dishes');

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
 * Escape HTML to prevent XSS attacks
 * @param {string} unsafe - Unsafe string
 * @returns {string} Escaped string
 */
function escapeHtml(unsafe) {
  return unsafe
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
    const restaurantName = escapeHtml(dish.ristorante?.nome || 'Ristorante');
    const dishName = escapeHtml(dish.nome);
    const dishDescription = escapeHtml(dish.descrizione);
    const dishId = escapeHtml(dish._id);
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
            <i class="fas fa-store"></i> ${restaurantName}
          </p>
          <p style="color: #666; font-size: 0.9rem; margin-bottom: 0.5rem;">
            <i class="fas fa-tag"></i> ${translateCategory(dish.categoria)}
          </p>
          <div style="margin-bottom: 1rem;">
            ${badges.join(' ')}
          </div>
          <div class="menu-item-footer">
            <span class="menu-item-price">${formatPrice(dish.prezzo)}</span>
            ${isAuthenticated() ? 
              `<button class="btn btn-primary" onclick="addToCart('${dishId}')">
                <i class="fas fa-cart-plus"></i> Aggiungi
              </button>` : 
              `<a href="/login.html" class="btn btn-primary">
                <i class="fas fa-sign-in-alt"></i> Login per ordinare
              </a>`
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
  const restaurantFilter = document.getElementById('restaurantFilter').value;
  const vegetarianFilter = document.getElementById('vegetarianFilter').checked;
  const veganFilter = document.getElementById('veganFilter').checked;

  let filteredDishes = allDishes;

  // Filtro categoria
  if (categoryFilter) {
    filteredDishes = filteredDishes.filter(dish => dish.categoria === categoryFilter);
  }

  // Filtro ristorante
  if (restaurantFilter) {
    filteredDishes = filteredDishes.filter(dish => 
      dish.ristorante?._id === restaurantFilter || dish.ristorante === restaurantFilter
    );
  }

  // Filtro vegetariano
  if (vegetarianFilter) {
    filteredDishes = filteredDishes.filter(dish => dish.vegetariano);
  }

  // Filtro vegano
  if (veganFilter) {
    filteredDishes = filteredDishes.filter(dish => dish.vegano);
  }

  displayDishes(filteredDishes);
}

/**
 * Aggiungi piatto al carrello
 * NOTA: Questa è una funzionalità placeholder. Per creare ordini completi,
 * gli utenti devono usare la dashboard cliente che supporta la selezione
 * multipla di piatti e la creazione di ordini completi.
 * 
 * @param {string} dishId - ID del piatto
 */
function addToCart(dishId) {
  // TODO: Implementare logica carrello completa in una futura versione
  showAlert('Per effettuare ordini, vai alla Dashboard Cliente dove puoi selezionare più piatti e creare un ordine completo.', 'info');
  console.log('Piatto selezionato:', dishId);
}

// Inizializzazione della pagina menu
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Pagina menu caricata');
  
  // Carica ristoranti e piatti
  await loadRestaurants();
  await loadDishes();

  // Aggiungi event listeners per i filtri
  document.getElementById('categoryFilter').addEventListener('change', applyFilters);
  document.getElementById('restaurantFilter').addEventListener('change', applyFilters);
  document.getElementById('vegetarianFilter').addEventListener('change', applyFilters);
  document.getElementById('veganFilter').addEventListener('change', applyFilters);
});
