/**
 * Script per la pagina menu
 * @module public/js/menu
 */

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let allDishes = [];
let allRestaurants = [];

/**
 * Carica i ristoranti
 */
async function loadRestaurants() {
  try {
    const response = await fetch(`${API_URL}/restaurants`);
    const data = await response.json();
    
    if (data.success) {
      allRestaurants = data.data;
      populateRestaurantFilter();
    }
  } catch (error) {
    console.error('Errore nel caricamento dei ristoranti:', error);
  }
}

/**
 * Popola il filtro ristoranti
 */
function populateRestaurantFilter() {
  const restaurantFilter = document.getElementById('restaurantFilter');
  allRestaurants.forEach(restaurant => {
    const option = document.createElement('option');
    option.value = restaurant._id;
    option.textContent = restaurant.nome;
    restaurantFilter.appendChild(option);
  });
}

/**
 * Carica i piatti
 */
async function loadDishes() {
  const loading = document.getElementById('loading');
  const menuContainer = document.getElementById('menuContainer');
  const emptyMessage = document.getElementById('emptyMessage');

  try {
    loading.classList.remove('hidden');
    menuContainer.innerHTML = '';

    const response = await fetch(`${API_URL}/dishes`);
    const data = await response.json();

    loading.classList.add('hidden');

    if (data.success && data.data.length > 0) {
      allDishes = data.data;
      applyFilters();
    } else {
      menuContainer.classList.add('hidden');
      emptyMessage.classList.remove('hidden');
    }
  } catch (error) {
    console.error('Errore nel caricamento dei piatti:', error);
    loading.classList.add('hidden');
    showAlert('Errore nel caricamento del menu', 'error');
  }
}

/**
 * Applica i filtri ai piatti
 */
function applyFilters() {
  const restaurantId = document.getElementById('restaurantFilter').value;
  const category = document.getElementById('categoryFilter').value;
  const vegetariano = document.getElementById('vegetarianoFilter').checked;
  const vegano = document.getElementById('veganoFilter').checked;

  let filteredDishes = allDishes;

  if (restaurantId) {
    filteredDishes = filteredDishes.filter(dish => 
      dish.ristorante._id === restaurantId
    );
  }

  if (category) {
    filteredDishes = filteredDishes.filter(dish => dish.categoria === category);
  }

  if (vegetariano) {
    filteredDishes = filteredDishes.filter(dish => dish.vegetariano);
  }

  if (vegano) {
    filteredDishes = filteredDishes.filter(dish => dish.vegano);
  }

  displayDishes(filteredDishes);
}

/**
 * Mostra i piatti
 */
function displayDishes(dishes) {
  const menuContainer = document.getElementById('menuContainer');
  const emptyMessage = document.getElementById('emptyMessage');

  if (dishes.length === 0) {
    menuContainer.classList.add('hidden');
    emptyMessage.classList.remove('hidden');
    return;
  }

  menuContainer.classList.remove('hidden');
  emptyMessage.classList.add('hidden');

  menuContainer.innerHTML = dishes.map(dish => `
    <div class="menu-item">
      <img src="${dish.immagine}" alt="${dish.nome}" onerror="this.src='https://via.placeholder.com/300x200?text=Immagine+non+disponibile'">
      <div class="menu-item-content">
        <h3 class="menu-item-title">${dish.nome}</h3>
        <p class="menu-item-description">${dish.descrizione}</p>
        <p style="color: #666; font-size: 0.9rem;">
          <strong>Ristorante:</strong> ${dish.ristorante.nome}
        </p>
        ${dish.ingredienti && dish.ingredienti.length > 0 ? `
          <p style="color: #666; font-size: 0.9rem;">
            <strong>Ingredienti:</strong> ${dish.ingredienti.join(', ')}
          </p>
        ` : ''}
        ${dish.allergeni && dish.allergeni.length > 0 ? `
          <p style="color: #666; font-size: 0.9rem;">
            <strong>Allergeni:</strong> ${dish.allergeni.join(', ')}
          </p>
        ` : ''}
        <div style="margin-bottom: 1rem;">
          ${dish.vegetariano ? '<span class="badge badge-success">Vegetariano</span>' : ''}
          ${dish.vegano ? '<span class="badge badge-success">Vegano</span>' : ''}
          ${!dish.disponibile ? '<span class="badge badge-danger">Non disponibile</span>' : ''}
        </div>
        <div class="menu-item-footer">
          <div class="menu-item-price">€${dish.prezzo.toFixed(2)}</div>
          ${isAuthenticated() && getUser().ruolo === 'cliente' && dish.disponibile ? `
            <button class="btn btn-primary" onclick="addToCart('${dish._id}')">Aggiungi</button>
          ` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Aggiungi al carrello
 */
function addToCart(dishId) {
  const dish = allDishes.find(d => d._id === dishId);
  if (!dish) return;

  const existingItem = cart.find(item => item.piatto === dishId);
  
  if (existingItem) {
    existingItem.quantita++;
  } else {
    cart.push({
      piatto: dishId,
      nome: dish.nome,
      prezzo: dish.prezzo,
      ristorante: dish.ristorante._id,
      ristorante_nome: dish.ristorante.nome,
      quantita: 1
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartSummary();
  showAlert(`${dish.nome} aggiunto al carrello!`, 'success');
}

/**
 * Aggiorna il riepilogo del carrello
 */
function updateCartSummary() {
  const cartSummary = document.getElementById('cartSummary');
  const cartCount = document.getElementById('cartCount');

  if (isAuthenticated() && getUser().ruolo === 'cliente') {
    cartSummary.classList.remove('hidden');
    const totalItems = cart.reduce((sum, item) => sum + item.quantita, 0);
    cartCount.textContent = `${totalItems} piatt${totalItems !== 1 ? 'i' : 'o'}`;
  } else {
    cartSummary.classList.add('hidden');
  }
}

// Setup event listeners
document.addEventListener('DOMContentLoaded', async () => {
  await loadRestaurants();
  await loadDishes();
  updateCartSummary();

  // Aggiungi event listeners ai filtri
  document.getElementById('restaurantFilter').addEventListener('change', applyFilters);
  document.getElementById('categoryFilter').addEventListener('change', applyFilters);
  document.getElementById('vegetarianoFilter').addEventListener('change', applyFilters);
  document.getElementById('veganoFilter').addEventListener('change', applyFilters);
});
