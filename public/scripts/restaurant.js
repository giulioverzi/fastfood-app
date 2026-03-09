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
        window.location.href = '/html/menu.html';
      }, 2000);
    }
  } catch (error) {
    console.error('Errore nel caricamento del ristorante:', error);
    showAlert('Errore nel caricamento del ristorante. Riprova più tardi.', 'error');
    setTimeout(() => {
      window.location.href = '/html/menu.html';
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
  const orarioApertura = currentRestaurant.orarioApertura || '11:00';
  const orarioChiusura = currentRestaurant.orarioChiusura || '23:00';
  const aperto = currentRestaurant.aperto !== undefined ? currentRestaurant.aperto : true;

  header.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: start; flex-wrap: wrap; gap: 1rem;">
      <div style="flex: 1; min-width: 300px;">
        <h1><i class="fas fa-utensils"></i> ${nome}</h1>
        <p>${descrizione}</p>
        <p style="margin-top: 0.5rem;">
          <i class="fas fa-map-marker-alt"></i> ${via}, ${citta}
          ${telefono ? ` | <i class="fas fa-phone"></i> ${telefono}` : ''}
        </p>
        <p style="margin-top: 0.5rem;">
          <i class="fas fa-clock"></i> Orari: ${orarioApertura} - ${orarioChiusura}
        </p>
      </div>
      <div style="text-align: right;">
        <div class="restaurant-status-badge ${aperto ? 'status-open' : 'status-closed'}">
          ${aperto ? '🟢 Aperto Ora' : '🔴 Chiuso'}
        </div>
        <div id="waitingTimeInfo" style="margin-top: 1rem;"></div>
      </div>
    </div>
  `;
  
  // Carica informazioni sul tempo di attesa
  loadWaitingTimeInfo(currentRestaurant._id);
}

/**
 * Carica e visualizza informazioni sul tempo di attesa
 * @param {string} restaurantId - ID del ristorante
 */
async function loadWaitingTimeInfo(restaurantId) {
  try {
    const response = await apiCall(`/orders/restaurant/${restaurantId}/queue`);
    
    if (response.success && response.data) {
      const { numeroPersoneInAttesa, tempoAttesaStimato } = response.data;
      const infoElement = document.getElementById('waitingTimeInfo');
      
      if (infoElement) {
        if (numeroPersoneInAttesa > 0) {
          infoElement.innerHTML = `
            <div class="waiting-time-info">
              <div class="info-item">
                <i class="fas fa-users"></i> 
                <strong>${numeroPersoneInAttesa}</strong> in attesa
              </div>
              <div class="info-item">
                <i class="fas fa-clock"></i> 
                Tempo stimato: <strong>~${tempoAttesaStimato} min</strong>
              </div>
            </div>
          `;
        } else {
          infoElement.innerHTML = `
            <div class="waiting-time-info">
              <div class="info-item success">
                <i class="fas fa-check-circle"></i> 
                Nessuna attesa!
              </div>
            </div>
          `;
        }
      }
    }
  } catch (error) {
    console.error('Errore nel caricamento delle informazioni di attesa:', error);
    // Non mostrare errore all'utente, è solo un'informazione supplementare
  }
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
            <span class="menu-item-price">${formatPrice(dish.prezzoCentesimi)}</span>
            <div class="menu-item-actions">
              <button class="btn btn-secondary btn-sm" onclick="showDishDetails('${dishId}')">
                <i class="fas fa-info-circle"></i> Dettagli
              </button>
              ${isAuthenticated() && getUserData().ruolo === 'cliente' ? 
                `<button class="btn btn-primary" onclick="handleAddToCart('${dishId}')">
                  <i class="fas fa-cart-plus"></i> Aggiungi
                </button>` : 
                !isAuthenticated() ?
                `<a href="/html/login.html" class="btn btn-primary">
                  <i class="fas fa-sign-in-alt"></i> Login
                </a>` :
                `<button class="btn btn-secondary" disabled>
                  Solo per clienti
                </button>`
              }
            </div>
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
async function applyFilters() {
  const categoryFilter = document.getElementById('categoryFilter').value;
  const priceFilter = parseFloat(document.getElementById('priceFilter').value);
  const vegetarianFilter = document.getElementById('vegetarianFilter').checked;
  const veganFilter = document.getElementById('veganFilter').checked;
  const allergenFilter = document.getElementById('allergenFilter');
  const selectedAllergens = Array.from(allergenFilter.selectedOptions).map(option => option.value);
  const ingredientFilter = document.getElementById('ingredientFilter').value.trim();

  let filteredDishes = allDishes;

  // Filtro ingrediente - usa l'API per filtrare i piatti
  if (ingredientFilter) {
    const restaurantId = getRestaurantIdFromUrl();
    try {
      const risposta = await apiCall(`/dishes?ristorante=${restaurantId}&ingredients=${encodeURIComponent(ingredientFilter)}`);
      if (risposta.success) {
        filteredDishes = risposta.data;
      }
    } catch (errore) {
      console.error('Errore nel filtro per ingrediente:', errore);
    }
  }

  // Filtro categoria
  if (categoryFilter) {
    filteredDishes = filteredDishes.filter(dish => dish.categoria === categoryFilter);
  }

  // Filtro prezzo massimo
  if (!isNaN(priceFilter) && priceFilter > 0) {
    const priceFilterCentesimi = euroToCentesimi(priceFilter);
    filteredDishes = filteredDishes.filter(dish => dish.prezzoCentesimi <= priceFilterCentesimi);
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
    prezzoCentesimi: dish.prezzoCentesimi,
    ristorante: currentRestaurant._id,
    ristoranteNome: currentRestaurant.nome,
    immagine: dish.immagine
  };

  addToCart(dishId, dishData);
}

/**
 * Mostra i dettagli completi di un piatto in un modal
 * @param {string} dishId - ID del piatto
 */
function showDishDetails(dishId) {
  const dish = allDishes.find(d => d._id === dishId);
  if (!dish) return;

  const modal = document.getElementById('dishDetailModal');
  const title = document.getElementById('dishDetailTitle');
  const body = document.getElementById('dishDetailBody');
  
  title.textContent = dish.nome;
  
  const badges = [];
  if (dish.vegetariano) badges.push('<span class="badge badge-success"><i class="fas fa-leaf"></i> Vegetariano</span>');
  if (dish.vegano) badges.push('<span class="badge badge-success"><i class="fas fa-seedling"></i> Vegano</span>');
  
  body.innerHTML = `
    <div class="dish-detail-content">
      <img src="${dish.immagine || DEFAULT_DISH_IMAGE}" 
           alt="${escapeHtml(dish.nome)}"
           class="dish-detail-image"
           onerror="this.src='${DEFAULT_DISH_IMAGE}'">
      
      <div class="dish-detail-info">
        <div class="dish-detail-price">
          ${formatPrice(dish.prezzoCentesimi)}
        </div>
        
        ${badges.length > 0 ? `<div style="margin: 1rem 0;">${badges.join(' ')}</div>` : ''}
        
        <div class="dish-detail-section">
          <h4><i class="fas fa-align-left"></i> Descrizione</h4>
          <p>${escapeHtml(dish.descrizione)}</p>
        </div>
        
        <div class="dish-detail-section">
          <h4><i class="fas fa-tag"></i> Categoria</h4>
          <p>${translateCategory(dish.categoria)}</p>
        </div>
        
        ${dish.ingredienti && dish.ingredienti.length > 0 ? `
          <div class="dish-detail-section">
            <h4><i class="fas fa-list-ul"></i> Ingredienti</h4>
            <ul class="ingredient-list">
              ${dish.ingredienti.map(ing => `<li>${escapeHtml(ing)}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        
        ${dish.allergeni && dish.allergeni.length > 0 ? `
          <div class="dish-detail-section">
            <h4><i class="fas fa-exclamation-triangle"></i> Allergeni</h4>
            <div class="allergen-tags">
              ${dish.allergeni.map(all => `<span class="allergen-tag">${translateAllergen(all)}</span>`).join('')}
            </div>
          </div>
        ` : '<div class="dish-detail-section"><p><i class="fas fa-check-circle"></i> Nessun allergene dichiarato</p></div>'}
        
        <div class="dish-detail-actions">
          ${isAuthenticated() && getUserData().ruolo === 'cliente' ? 
            `<button class="btn btn-primary btn-full-width" onclick="handleAddToCart('${dishId}'); closeDishDetailModal();">
              <i class="fas fa-cart-plus"></i> Aggiungi al Carrello
            </button>` : 
            !isAuthenticated() ?
            `<a href="/html/login.html" class="btn btn-primary btn-full-width">
              <i class="fas fa-sign-in-alt"></i> Login per ordinare
            </a>` :
            `<button class="btn btn-secondary btn-full-width" disabled>
              Solo per clienti
            </button>`
          }
        </div>
      </div>
    </div>
  `;
  
  modal.classList.remove('hidden');
  modal.classList.add('active');
}

/**
 * Chiude il modal dei dettagli piatto
 */
function closeDishDetailModal() {
  const modal = document.getElementById('dishDetailModal');
  modal.classList.remove('active');
  setTimeout(() => modal.classList.add('hidden'), 300);
}

/**
 * Traduce un allergene in italiano
 * @param {string} allergen - Nome allergene
 * @returns {string} Nome tradotto
 */
function translateAllergen(allergen) {
  const translations = {
    'glutine': 'Glutine',
    'crostacei': 'Crostacei',
    'uova': 'Uova',
    'pesce': 'Pesce',
    'arachidi': 'Arachidi',
    'soia': 'Soia',
    'latte': 'Latte',
    'frutta_a_guscio': 'Frutta a guscio',
    'sedano': 'Sedano',
    'senape': 'Senape',
    'sesamo': 'Sesamo',
    'solfiti': 'Solfiti',
    'lupini': 'Lupini',
    'molluschi': 'Molluschi'
  };
  return translations[allergen] || allergen;
}

// Inizializzazione della pagina menu ristorante
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Pagina menu ristorante caricata');
  
  // Ottieni l'ID del ristorante dall'URL
  const restaurantId = getRestaurantIdFromUrl();
  
  if (!restaurantId) {
    showAlert('ID ristorante non valido', 'error');
    setTimeout(() => {
      window.location.href = '/html/menu.html';
    }, 2000);
    return;
  }

  // Carica i dati del ristorante e i suoi piatti
  await loadRestaurant(restaurantId);
  await loadDishes(restaurantId);

  // Aggiungi event listeners per i filtri
  document.getElementById('categoryFilter').addEventListener('change', applyFilters);
  document.getElementById('priceFilter').addEventListener('input', applyFilters);
  document.getElementById('ingredientFilter').addEventListener('input', applyFilters);
  document.getElementById('vegetarianFilter').addEventListener('change', applyFilters);
  document.getElementById('veganFilter').addEventListener('change', applyFilters);
  document.getElementById('allergenFilter').addEventListener('change', applyFilters);
  
  // Event listener per chiusura modal dettagli piatto
  document.getElementById('closeDishDetailModal')?.addEventListener('click', closeDishDetailModal);
  
  // Chiudi modal cliccando fuori
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.classList.remove('active');
      setTimeout(() => e.target.classList.add('hidden'), 300);
    }
  });
});
