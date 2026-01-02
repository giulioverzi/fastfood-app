/**
 * restaurant.js - Logica per la dashboard del ristoratore
 * Gestisce il ristorante, il menu (con caricamento da meals 1.json), e gli ordini ricevuti
 */

// Costanti
const MIN_DISH_PRICE = 5;
const MAX_DISH_PRICE = 20;

// Variabili globali
let restaurant = null;
let menuDishes = [];
let availableMeals = [];
let selectedMeals = [];
let receivedOrders = [];
let currentFilter = 'all';

/**
 * Inizializza la dashboard ristoratore
 */
async function initRestaurantDashboard() {
  // Verifica autenticazione
  if (!checkAuth('ristoratore')) {
    return;
  }

  // Imposta messaggio di benvenuto
  const user = getUserData();
  const welcomeMessage = document.getElementById('welcomeMessage');
  if (welcomeMessage) {
    welcomeMessage.textContent = `Benvenuto, ${user.nome} ${user.cognome}!`;
  }

  // Carica dati del ristorante
  await loadRestaurant();

  // Carica menu se il ristorante esiste
  if (restaurant) {
    await loadMenu();
    await loadOrders();
    await loadStatistics();
  }

  // Setup event listeners
  setupEventListeners();
  setupFilterButtons();
}

/**
 * Carica i dati del ristorante del proprietario
 */
async function loadRestaurant() {
  try {
    toggleElement('restaurantLoading', true);
    toggleElement('restaurantContainer', false);
    toggleElement('restaurantEmpty', false);

    const user = getUserData();
    const response = await apiCall(`/restaurants?proprietario=${user._id}`);

    if (response.success && response.data.length > 0) {
      restaurant = response.data[0];
      renderRestaurant();
      toggleElement('restaurantLoading', false);
      toggleElement('restaurantContainer', true);
      
      // Abilita i pulsanti per aggiungere piatti
      document.getElementById('btnAddDishes').disabled = false;
      document.getElementById('btnAddCustomDish').disabled = false;
    } else {
      toggleElement('restaurantLoading', false);
      toggleElement('restaurantEmpty', true);
    }
  } catch (error) {
    console.error('Errore caricamento ristorante:', error);
    showAlert('Errore nel caricamento del ristorante', 'error');
    toggleElement('restaurantLoading', false);
    toggleElement('restaurantEmpty', true);
  }
}

/**
 * Renderizza i dati del ristorante
 */
function renderRestaurant() {
  const container = document.getElementById('restaurantContainer');
  if (!container || !restaurant) return;

  const imageSrc = restaurant.immagine || '/images/restaurant-default.jpg';
  const orarioApertura = restaurant.orarioApertura || '11:00';
  const orarioChiusura = restaurant.orarioChiusura || '23:00';
  const aperto = restaurant.aperto !== undefined ? restaurant.aperto : true;

  container.innerHTML = `
    <div class="restaurant-card">
      <div class="restaurant-header">
        <img src="${imageSrc}" alt="${restaurant.nome}" class="restaurant-image" onerror="this.src='/images/restaurant-default.jpg'">
        <div class="restaurant-header-info">
          <h3 style="color: var(--primary-color); margin-bottom: 0.5rem;">${restaurant.nome}</h3>
          <div class="restaurant-status">
            <span class="badge ${aperto ? 'badge-success' : 'badge-danger'}">
              ${aperto ? '🟢 Aperto' : '🔴 Chiuso'}
            </span>
            <span class="info-text">Orari: ${orarioApertura} - ${orarioChiusura}</span>
          </div>
        </div>
      </div>
      <div class="restaurant-info">
        <div class="info-item">
          <span class="info-label">Descrizione</span>
          <span class="info-value">${restaurant.descrizione}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Telefono</span>
          <span class="info-value">${restaurant.telefono}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Indirizzo</span>
          <span class="info-value">
            ${restaurant.indirizzo.via}, ${restaurant.indirizzo.citta} ${restaurant.indirizzo.cap}
          </span>
        </div>
        <div class="info-item">
          <span class="info-label">Stato Ristorante</span>
          <span class="info-value">
            <span class="badge ${restaurant.attivo ? 'badge-success' : 'badge-danger'}">
              ${restaurant.attivo ? 'Attivo' : 'Non Attivo'}
            </span>
          </span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Carica il menu del ristorante
 */
async function loadMenu() {
  try {
    toggleElement('menuLoading', true);
    toggleElement('menuContainer', false);
    toggleElement('menuEmpty', false);

    const response = await apiCall(`/dishes?ristorante=${restaurant._id}`);

    if (response.success && response.data.length > 0) {
      menuDishes = response.data;
      renderMenu();
      toggleElement('menuLoading', false);
      toggleElement('menuContainer', true);
    } else {
      toggleElement('menuLoading', false);
      toggleElement('menuEmpty', true);
    }
  } catch (error) {
    console.error('Errore caricamento menu:', error);
    showAlert('Errore nel caricamento del menu', 'error');
    toggleElement('menuLoading', false);
    toggleElement('menuEmpty', true);
  }
}

/**
 * Renderizza il menu del ristorante
 */
function renderMenu() {
  const container = document.getElementById('menuContainer');
  if (!container) return;

  container.innerHTML = menuDishes.map(dish => `
    <div class="menu-item-card" data-dish-id="${dish._id}">
      <img src="${dish.immagine || 'https://via.placeholder.com/400x300?text=Piatto'}" 
           alt="${dish.nome}" 
           class="menu-item-image"
           onerror="this.src='https://via.placeholder.com/400x300?text=Piatto'">
      <div class="menu-item-content">
        <div class="menu-item-header">
          <h4 class="menu-item-name">${dish.nome}</h4>
          <span class="menu-item-category">${dish.categoria || 'Generale'}</span>
        </div>
        <p style="color: #666; font-size: 0.9rem; margin: 0.5rem 0;">
          ${dish.descrizione ? dish.descrizione.substring(0, 100) + (dish.descrizione.length > 100 ? '...' : '') : 'Nessuna descrizione'}
        </p>
        <div class="menu-item-details">
          ${dish.ingredienti && dish.ingredienti.length > 0 ? `
            <div class="detail-item">
              <small><strong>Ingredienti:</strong> ${dish.ingredienti.slice(0, 3).join(', ')}${dish.ingredienti.length > 3 ? '...' : ''}</small>
            </div>
          ` : ''}
          ${dish.allergeni && dish.allergeni.length > 0 ? `
            <div class="detail-item">
              <small><strong>Allergeni:</strong> ${dish.allergeni.slice(0, 3).join(', ')}${dish.allergeni.length > 3 ? '...' : ''}</small>
            </div>
          ` : ''}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
          <span style="font-size: 1.3rem; font-weight: bold; color: var(--primary-color);">
            ${formatPrice(dish.prezzo)}
          </span>
          <div class="menu-item-actions">
            <button class="btn btn-sm btn-secondary" onclick="editDish('${dish._id}')" title="Modifica piatto">
              <i class="fas fa-edit"></i> Modifica
            </button>
            <button class="btn btn-sm btn-danger" onclick="removeDish('${dish._id}')" title="Rimuovi piatto">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Carica gli ordini ricevuti dal ristorante
 */
async function loadOrders() {
  try {
    toggleElement('ordersLoading', true);
    toggleElement('ordersContainer', false);
    toggleElement('ordersEmpty', false);

    const response = await apiCall(`/orders?ristorante=${restaurant._id}`);

    if (response.success && response.data.length > 0) {
      receivedOrders = response.data;
      renderOrders();
      toggleElement('ordersLoading', false);
      toggleElement('ordersContainer', true);
    } else {
      toggleElement('ordersLoading', false);
      toggleElement('ordersEmpty', true);
    }
  } catch (error) {
    console.error('Errore caricamento ordini:', error);
    showAlert('Errore nel caricamento degli ordini', 'error');
    toggleElement('ordersLoading', false);
    toggleElement('ordersEmpty', true);
  }
}

/**
 * Renderizza gli ordini ricevuti
 */
function renderOrders() {
  const container = document.getElementById('ordersContainer');
  if (!container) return;

  // Filtra ordini in base al filtro selezionato
  let filteredOrders = receivedOrders;
  if (currentFilter !== 'all') {
    filteredOrders = receivedOrders.filter(order => order.stato === currentFilter);
  }

  if (filteredOrders.length === 0) {
    container.innerHTML = '<div class="text-center"><p>Nessun ordine trovato per questo filtro.</p></div>';
    return;
  }

  container.innerHTML = filteredOrders.map(order => `
    <div class="order-card" data-order-id="${order._id}">
      <div class="order-header">
        <div>
          <div class="order-number">Ordine #${order._id.slice(-6).toUpperCase()}</div>
          <div class="order-date">${formatDate(order.dataOrdine)}</div>
        </div>
        <span class="order-status ${order.stato}">${translateOrderStatus(order.stato)}</span>
      </div>
      
      <div style="margin: 1rem 0;">
        <strong>Cliente:</strong> ${order.cliente?.nome || 'N/A'} ${order.cliente?.cognome || ''}
        ${order.cliente?.telefono ? `<br><strong>Tel:</strong> ${order.cliente.telefono}` : ''}
      </div>

      <div class="order-items">
        ${order.piatti.map(item => `
          <div class="order-item">
            <span class="item-name">
              ${item.piatto?.nome || 'Piatto'} 
              <span class="item-quantity">x${item.quantita}</span>
            </span>
            <span class="item-price">${formatPrice(item.prezzo * item.quantita)}</span>
          </div>
        `).join('')}
      </div>

      <div class="order-total">
        <span>Totale:</span>
        <span>${formatPrice(order.totale)}</span>
      </div>

      <div style="margin-top: 1rem;">
        <strong>Modalità:</strong> ${order.modalitaConsegna === 'consegna' ? '🚚 Consegna' : '🏪 Ritiro'}
        ${order.indirizzoConsegna && order.modalitaConsegna === 'consegna' ? 
          `<br><strong>Indirizzo:</strong> ${order.indirizzoConsegna.via}, ${order.indirizzoConsegna.citta}` : ''}
      </div>

      ${order.note ? `<div style="margin-top: 0.5rem;"><strong>Note:</strong> ${order.note}</div>` : ''}

      <div class="order-actions">
        ${order.stato === 'ordinato' ? `
          <button class="btn btn-primary" onclick="updateOrderStatus('${order._id}', 'in_preparazione')">
            🍳 Inizia Preparazione
          </button>
        ` : ''}
        ${order.stato === 'in_preparazione' ? `
          <button class="btn btn-success" onclick="updateOrderStatus('${order._id}', 'pronto')">
            ✅ Segna come Pronto
          </button>
        ` : ''}
        ${order.stato === 'pronto' && order.modalitaConsegna === 'consegna' ? `
          <button class="btn btn-primary" onclick="updateOrderStatus('${order._id}', 'in_consegna')">
            🚚 In Consegna
          </button>
        ` : ''}
        ${(order.stato === 'pronto' && order.modalitaConsegna === 'ritiro') || order.stato === 'in_consegna' ? `
          <button class="btn btn-success" onclick="updateOrderStatus('${order._id}', 'completato')">
            ✔️ Completa Ordine
          </button>
        ` : ''}
        ${!['completato', 'annullato'].includes(order.stato) ? `
          <button class="btn btn-outline" onclick="updateOrderStatus('${order._id}', 'annullato')" 
                  style="background: var(--danger-color); color: white; border-color: var(--danger-color);">
            ❌ Annulla
          </button>
        ` : ''}
      </div>
    </div>
  `).join('');
}

/**
 * Aggiorna lo stato di un ordine
 * @param {string} orderId - ID dell'ordine
 * @param {string} newStatus - Nuovo stato
 */
async function updateOrderStatus(orderId, newStatus) {
  try {
    const response = await apiCall(`/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify({ stato: newStatus })
    });

    if (response.success) {
      showAlert('Stato ordine aggiornato con successo', 'success');
      await loadOrders();
    }
  } catch (error) {
    console.error('Errore aggiornamento stato ordine:', error);
    showAlert(error.message || 'Errore nell\'aggiornamento dello stato', 'error');
  }
}

/**
 * Carica i piatti disponibili da meals 1.json
 */
async function loadAvailableMeals() {
  try {
    toggleElement('dishesLoading', true);
    
    const response = await fetch('/data/meals 1.json');
    const meals = await response.json();
    
    availableMeals = meals;
    renderAvailableMeals(meals);
    
    toggleElement('dishesLoading', false);
  } catch (error) {
    console.error('Errore caricamento catalogo piatti:', error);
    showAlert('Errore nel caricamento del catalogo piatti', 'error');
  }
}

/**
 * Renderizza i piatti disponibili per la selezione
 * @param {Array} meals - Array dei piatti da visualizzare
 */
function renderAvailableMeals(meals) {
  const container = document.getElementById('availableDishes');
  if (!container) return;

  container.innerHTML = meals.map((meal, index) => `
    <div class="dish-select-card" data-meal-index="${index}" onclick="toggleMealSelection(${index})">
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="dish-image">
      <div class="dish-name">${meal.strMeal}</div>
      <span class="dish-category">${meal.strCategory}</span>
      <div class="dish-area">${meal.strArea}</div>
    </div>
  `).join('');
}

/**
 * Toggle selezione di un piatto
 * @param {number} index - Indice del piatto nell'array availableMeals
 */
function toggleMealSelection(index) {
  const card = document.querySelector(`[data-meal-index="${index}"]`);
  
  if (selectedMeals.includes(index)) {
    // Rimuovi dalla selezione
    selectedMeals = selectedMeals.filter(i => i !== index);
    card.classList.remove('selected');
  } else {
    // Aggiungi alla selezione
    selectedMeals.push(index);
    card.classList.add('selected');
  }

  // Aggiorna contatore e stato pulsante
  document.getElementById('selectedCount').textContent = selectedMeals.length;
  document.getElementById('addSelectedDishes').disabled = selectedMeals.length === 0;
}

/**
 * Aggiunge i piatti selezionati al menu del ristorante
 */
async function addSelectedDishesToMenu() {
  if (selectedMeals.length === 0) return;

  try {
    // Mostra loader
    const btn = document.getElementById('addSelectedDishes');
    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ Aggiunta in corso...';
    btn.disabled = true;

    // Crea i piatti per ogni meal selezionato
    for (const index of selectedMeals) {
      const meal = availableMeals[index];
      
      const dishData = {
        nome: meal.strMeal,
        descrizione: meal.strInstructions ? meal.strInstructions.substring(0, 200) : 'Delizioso piatto',
        prezzo: Math.floor(Math.random() * (MAX_DISH_PRICE - MIN_DISH_PRICE + 1)) + MIN_DISH_PRICE,
        categoria: meal.strCategory,
        ristorante: restaurant._id,
        disponibile: true,
        immagine: meal.strMealThumb
      };

      await apiCall('/dishes', {
        method: 'POST',
        body: JSON.stringify(dishData)
      });
    }

    showAlert(`${selectedMeals.length} piatti aggiunti con successo!`, 'success');
    
    // Resetta selezione
    selectedMeals = [];
    document.getElementById('selectedCount').textContent = '0';
    
    // Chiudi modal
    closeDishesModal();
    
    // Ricarica menu
    await loadMenu();
    
  } catch (error) {
    console.error('Errore aggiunta piatti:', error);
    showAlert(error.message || 'Errore nell\'aggiunta dei piatti', 'error');
  }
}

/**
 * Rimuove un piatto dal menu
 * @param {string} dishId - ID del piatto da rimuovere
 */
async function removeDish(dishId) {
  if (!confirm('Sei sicuro di voler rimuovere questo piatto dal menu?')) {
    return;
  }

  try {
    await apiCall(`/dishes/${dishId}`, {
      method: 'DELETE'
    });

    showAlert('Piatto rimosso con successo', 'success');
    await loadMenu();
  } catch (error) {
    console.error('Errore rimozione piatto:', error);
    showAlert(error.message || 'Errore nella rimozione del piatto', 'error');
  }
}

/**
 * Apre il modal per modificare un piatto
 * @param {string} dishId - ID del piatto da modificare
 */
async function editDish(dishId) {
  try {
    const response = await apiCall(`/dishes/${dishId}`);
    if (response.success) {
      openCustomDishModal(response.data);
    }
  } catch (error) {
    console.error('Errore caricamento piatto:', error);
    showAlert(error.message || 'Errore nel caricamento del piatto', 'error');
  }
}

/**
 * Apre il modal per la gestione del ristorante
 * @param {boolean} isEdit - true se è una modifica, false se è creazione
 */
function openRestaurantModal(isEdit = false) {
  const modal = document.getElementById('restaurantModal');
  const modalTitle = document.getElementById('modalTitle');
  const form = document.getElementById('restaurantForm');

  modalTitle.textContent = isEdit ? 'Modifica Ristorante' : 'Crea Nuovo Ristorante';

  if (isEdit && restaurant) {
    // Popola il form con i dati esistenti
    document.getElementById('nome').value = restaurant.nome;
    document.getElementById('descrizione').value = restaurant.descrizione;
    document.getElementById('telefono').value = restaurant.telefono;
    document.getElementById('immagine').value = restaurant.immagine || '';
    document.getElementById('orarioApertura').value = restaurant.orarioApertura || '11:00';
    document.getElementById('orarioChiusura').value = restaurant.orarioChiusura || '23:00';
    document.getElementById('via').value = restaurant.indirizzo.via;
    document.getElementById('citta').value = restaurant.indirizzo.citta;
    document.getElementById('cap').value = restaurant.indirizzo.cap;
  } else {
    form.reset();
    document.getElementById('orarioApertura').value = '11:00';
    document.getElementById('orarioChiusura').value = '23:00';
  }

  modal.classList.remove('hidden');
  modal.classList.add('active');
}

/**
 * Chiude il modal del ristorante
 */
function closeRestaurantModal() {
  const modal = document.getElementById('restaurantModal');
  modal.classList.remove('active');
  setTimeout(() => modal.classList.add('hidden'), 300);
}

/**
 * Apre il modal per la selezione piatti
 */
async function openDishesModal() {
  const modal = document.getElementById('dishesModal');
  modal.classList.remove('hidden');
  modal.classList.add('active');
  
  // Carica i piatti disponibili se non già caricati
  if (availableMeals.length === 0) {
    await loadAvailableMeals();
  }

  // Setup ricerca
  setupDishSearch();
}

/**
 * Chiude il modal dei piatti
 */
function closeDishesModal() {
  const modal = document.getElementById('dishesModal');
  modal.classList.remove('active');
  setTimeout(() => modal.classList.add('hidden'), 300);
  
  // Reset selezione
  selectedMeals = [];
  document.querySelectorAll('.dish-select-card.selected').forEach(card => {
    card.classList.remove('selected');
  });
  document.getElementById('selectedCount').textContent = '0';
  document.getElementById('addSelectedDishes').disabled = true;
}

/**
 * Apre il modal per creare/modificare un piatto personalizzato
 * @param {Object} dish - Il piatto da modificare (opzionale)
 */
function openCustomDishModal(dish = null) {
  const modal = document.getElementById('customDishModal');
  const modalTitle = document.getElementById('customDishModalTitle');
  const form = document.getElementById('customDishForm');
  
  modalTitle.textContent = dish ? 'Modifica Piatto' : 'Crea Piatto Personalizzato';
  
  if (dish) {
    // Popola il form con i dati del piatto esistente
    document.getElementById('dishNome').value = dish.nome;
    document.getElementById('dishDescrizione').value = dish.descrizione;
    document.getElementById('dishCategoria').value = dish.categoria;
    document.getElementById('dishPrezzo').value = dish.prezzo;
    document.getElementById('dishIngredienti').value = dish.ingredienti ? dish.ingredienti.join(', ') : '';
    document.getElementById('dishImmagine').value = dish.immagine || '';
    document.getElementById('dishVegetariano').checked = dish.vegetariano || false;
    document.getElementById('dishVegano').checked = dish.vegano || false;
    document.getElementById('dishDisponibile').checked = dish.disponibile !== false;
    
    // Seleziona gli allergeni
    document.querySelectorAll('.checkbox-group input[type="checkbox"]').forEach(cb => {
      cb.checked = dish.allergeni && dish.allergeni.includes(cb.value);
    });
    
    // Salva l'ID del piatto per l'aggiornamento
    form.dataset.dishId = dish._id;
  } else {
    form.reset();
    delete form.dataset.dishId;
    document.getElementById('dishDisponibile').checked = true;
  }
  
  modal.classList.remove('hidden');
  modal.classList.add('active');
}

/**
 * Chiude il modal del piatto personalizzato
 */
function closeCustomDishModal() {
  const modal = document.getElementById('customDishModal');
  modal.classList.remove('active');
  setTimeout(() => modal.classList.add('hidden'), 300);
  
  // Reset form
  document.getElementById('customDishForm').reset();
  delete document.getElementById('customDishForm').dataset.dishId;
}

/**
 * Salva il piatto personalizzato (crea o aggiorna)
 * @param {Event} e - L'evento submit del form
 */
async function saveCustomDish(e) {
  e.preventDefault();
  
  const form = e.target;
  const dishId = form.dataset.dishId;
  
  // Raccogli gli allergeni selezionati
  const allergeni = Array.from(document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked'))
    .map(cb => cb.value);
  
  // Converti gli ingredienti da stringa a array
  const ingredientiString = document.getElementById('dishIngredienti').value;
  const ingredienti = ingredientiString ? ingredientiString.split(',').map(i => i.trim()).filter(i => i) : [];
  
  const formData = {
    nome: document.getElementById('dishNome').value,
    descrizione: document.getElementById('dishDescrizione').value,
    ristorante: restaurant._id,
    categoria: document.getElementById('dishCategoria').value,
    prezzo: parseFloat(document.getElementById('dishPrezzo').value),
    ingredienti: ingredienti,
    allergeni: allergeni,
    immagine: document.getElementById('dishImmagine').value || undefined,
    vegetariano: document.getElementById('dishVegetariano').checked,
    vegano: document.getElementById('dishVegano').checked,
    disponibile: document.getElementById('dishDisponibile').checked
  };
  
  try {
    let response;
    if (dishId) {
      // Aggiorna piatto esistente
      response = await apiCall(`/dishes/${dishId}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
    } else {
      // Crea nuovo piatto
      response = await apiCall('/dishes', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
    }
    
    if (response.success) {
      showAlert(
        dishId ? 'Piatto aggiornato con successo' : 'Piatto creato con successo',
        'success'
      );
      closeCustomDishModal();
      await loadMenu();
    }
  } catch (error) {
    console.error('Errore salvataggio piatto:', error);
    showAlert(error.message || 'Errore nel salvataggio del piatto', 'error');
  }
}

/**
 * Setup della ricerca piatti
 */
function setupDishSearch() {
  const searchInput = document.getElementById('searchDishes');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    if (searchTerm === '') {
      renderAvailableMeals(availableMeals);
    } else {
      const filtered = availableMeals.filter(meal => 
        meal.strMeal.toLowerCase().includes(searchTerm) ||
        meal.strCategory.toLowerCase().includes(searchTerm) ||
        meal.strArea.toLowerCase().includes(searchTerm)
      );
      renderAvailableMeals(filtered);
    }
    
    // Reset selezione quando si filtra
    selectedMeals = [];
    document.getElementById('selectedCount').textContent = '0';
    document.getElementById('addSelectedDishes').disabled = true;
  });
}

/**
 * Salva i dati del ristorante (crea o aggiorna)
 * @param {Event} e - L'evento submit del form
 */
async function saveRestaurant(e) {
  e.preventDefault();

  const formData = {
    nome: document.getElementById('nome').value,
    descrizione: document.getElementById('descrizione').value,
    telefono: document.getElementById('telefono').value,
    immagine: document.getElementById('immagine').value || undefined,
    orarioApertura: document.getElementById('orarioApertura').value,
    orarioChiusura: document.getElementById('orarioChiusura').value,
    indirizzo: {
      via: document.getElementById('via').value,
      citta: document.getElementById('citta').value,
      cap: document.getElementById('cap').value
    }
  };

  try {
    let response;
    if (restaurant) {
      // Aggiorna ristorante esistente
      response = await apiCall(`/restaurants/${restaurant._id}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
    } else {
      // Crea nuovo ristorante
      response = await apiCall('/restaurants', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
    }

    if (response.success) {
      showAlert(
        restaurant ? 'Ristorante aggiornato con successo' : 'Ristorante creato con successo',
        'success'
      );
      closeRestaurantModal();
      await loadRestaurant();
      
      // Se è stato appena creato, carica anche il menu
      if (!restaurant) {
        await loadMenu();
        await loadOrders();
      }
    }
  } catch (error) {
    console.error('Errore salvataggio ristorante:', error);
    showAlert(error.message || 'Errore nel salvataggio del ristorante', 'error');
  }
}

/**
 * Carica e visualizza le statistiche del ristorante
 */
async function loadStatistics() {
  try {
    toggleElement('statisticsLoading', true);
    toggleElement('statisticsContainer', false);
    toggleElement('statisticsEmpty', false);

    if (!restaurant || receivedOrders.length === 0) {
      toggleElement('statisticsLoading', false);
      toggleElement('statisticsEmpty', true);
      return;
    }

    // Calcola statistiche
    const stats = calculateStatistics(receivedOrders);
    
    // Visualizza statistiche
    renderStatistics(stats);

    toggleElement('statisticsLoading', false);
    toggleElement('statisticsContainer', true);
  } catch (error) {
    console.error('Errore caricamento statistiche:', error);
    toggleElement('statisticsLoading', false);
    toggleElement('statisticsEmpty', true);
  }
}

/**
 * Calcola le statistiche dagli ordini
 * @param {Array} orders - Array di ordini
 * @returns {Object} Oggetto con le statistiche calcolate
 */
function calculateStatistics(orders) {
  const totalOrders = orders.length;
  
  // Ordini in corso (non completati e non annullati)
  const pendingOrders = orders.filter(order => 
    !['completato', 'consegnato', 'annullato'].includes(order.stato)
  ).length;
  
  // Ordini completati
  const completedOrders = orders.filter(order => 
    ['completato', 'consegnato'].includes(order.stato)
  ).length;
  
  // Ricavo totale (solo ordini completati)
  const totalRevenue = orders
    .filter(order => ['completato', 'consegnato'].includes(order.stato))
    .reduce((sum, order) => {
      const totale = parseFloat(order.totale) || 0;
      return sum + totale;
    }, 0);
  
  // Conteggio piatti ordinati
  const dishCounts = {};
  orders.forEach(order => {
    if (!order.piatti || !Array.isArray(order.piatti)) return;
    
    order.piatti.forEach(item => {
      if (!item || !item.piatto) return;
      
      const dishId = item.piatto._id || item.piatto;
      const dishName = item.piatto.nome || 'Piatto sconosciuto';
      const dishCategory = item.piatto.categoria || '';
      const quantity = parseInt(item.quantita) || 0;
      
      if (!dishCounts[dishId]) {
        dishCounts[dishId] = {
          name: dishName,
          category: dishCategory,
          count: 0
        };
      }
      dishCounts[dishId].count += quantity;
    });
  });
  
  // Ordina piatti per numero di ordinazioni
  const mostOrdered = Object.entries(dishCounts)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5
  
  return {
    totalOrders,
    pendingOrders,
    completedOrders,
    totalRevenue,
    mostOrdered
  };
}

/**
 * Renderizza le statistiche nel DOM
 * @param {Object} stats - Oggetto con le statistiche
 */
function renderStatistics(stats) {
  // Aggiorna le card con i numeri
  document.getElementById('totalOrders').textContent = stats.totalOrders;
  document.getElementById('pendingOrders').textContent = stats.pendingOrders;
  document.getElementById('completedOrders').textContent = stats.completedOrders;
  document.getElementById('totalRevenue').textContent = formatPrice(stats.totalRevenue);
  
  // Renderizza i piatti più ordinati
  const mostOrderedContainer = document.getElementById('mostOrderedDishes');
  
  if (stats.mostOrdered.length === 0) {
    mostOrderedContainer.innerHTML = '<p class="text-center text-muted">Nessun dato disponibile</p>';
    return;
  }
  
  mostOrderedContainer.innerHTML = stats.mostOrdered.map((dish, index) => {
    const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32', '#E74C3C', '#9B59B6'];
    return `
      <div class="most-ordered-item">
        <div class="most-ordered-rank" style="background: ${rankColors[index] || 'var(--primary-color)'};">
          ${index + 1}
        </div>
        <div class="most-ordered-info">
          <p class="most-ordered-name">${escapeHtml(dish.name)}</p>
          <p class="most-ordered-category">${translateCategory(dish.category)}</p>
        </div>
        <div class="most-ordered-count">
          <span class="most-ordered-quantity">${dish.count}</span>
          <p class="most-ordered-label">ordinazioni</p>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Traduce la categoria del piatto
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
 * Setup degli event listeners
 */
function setupEventListeners() {
  // Pulsante modifica ristorante
  const btnEdit = document.getElementById('btnEditRestaurant');
  if (btnEdit) {
    btnEdit.addEventListener('click', () => openRestaurantModal(true));
  }

  // Pulsante crea ristorante
  const btnCreate = document.getElementById('btnCreateRestaurant');
  if (btnCreate) {
    btnCreate.addEventListener('click', () => openRestaurantModal(false));
  }

  // Form ristorante
  const restaurantForm = document.getElementById('restaurantForm');
  if (restaurantForm) {
    restaurantForm.addEventListener('submit', saveRestaurant);
  }

  // Chiusura modali
  document.getElementById('closeModal')?.addEventListener('click', closeRestaurantModal);
  document.getElementById('cancelBtn')?.addEventListener('click', closeRestaurantModal);

  // Pulsanti piatti
  document.getElementById('btnAddCustomDish')?.addEventListener('click', () => openCustomDishModal());
  document.getElementById('btnAddDishes')?.addEventListener('click', openDishesModal);

  // Modali piatti catalogo
  document.getElementById('closeDishesModal')?.addEventListener('click', closeDishesModal);
  document.getElementById('cancelDishesBtn')?.addEventListener('click', closeDishesModal);
  document.getElementById('addSelectedDishes')?.addEventListener('click', addSelectedDishesToMenu);

  // Modal piatto personalizzato
  document.getElementById('closeCustomDishModal')?.addEventListener('click', closeCustomDishModal);
  document.getElementById('cancelCustomDishBtn')?.addEventListener('click', closeCustomDishModal);
  document.getElementById('customDishForm')?.addEventListener('submit', saveCustomDish);

  // Pulsante refresh statistiche
  document.getElementById('btnRefreshStats')?.addEventListener('click', loadStatistics);

  // Chiudi modal cliccando fuori
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.classList.remove('active');
      setTimeout(() => e.target.classList.add('hidden'), 300);
    }
  });
}

/**
 * Configura i pulsanti filtro
 */
function setupFilterButtons() {
  const filterButtons = document.querySelectorAll('.btn-filter');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      currentFilter = button.getAttribute('data-status');
      renderOrders();
    });
  });
}

// Inizializza la dashboard quando il DOM è pronto
document.addEventListener('DOMContentLoaded', initRestaurantDashboard);
