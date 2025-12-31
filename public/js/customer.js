/**
 * customer.js - Logica per la dashboard del cliente
 * Gestisce visualizzazione ordini attivi e storico ordini
 */

// Variabili globali
let activeOrders = [];
let orderHistory = [];
let currentFilter = 'all';

/**
 * Inizializza la dashboard cliente
 */
async function initCustomerDashboard() {
  // Verifica autenticazione
  if (!checkAuth('cliente')) {
    return;
  }

  // Imposta messaggio di benvenuto
  const user = getUserData();
  const welcomeMessage = document.getElementById('welcomeMessage');
  if (welcomeMessage) {
    welcomeMessage.textContent = `Benvenuto, ${user.nome} ${user.cognome}!`;
  }

  // Carica ordini attivi e storico
  await loadActiveOrders();
  await loadOrderHistory();

  // Aggiungi event listener per i filtri
  setupFilterButtons();
}

/**
 * Carica gli ordini attivi del cliente
 */
async function loadActiveOrders() {
  try {
    toggleElement('activeOrdersLoading', true);
    toggleElement('activeOrdersContainer', false);
    toggleElement('activeOrdersEmpty', false);

    const user = getUserData();
    const response = await apiCall(`/orders?cliente=${user._id}&status=active`);

    if (response.success && response.data.length > 0) {
      // Filtra solo ordini non completati/annullati
      activeOrders = response.data.filter(order => 
        !['completato', 'annullato', 'consegnato'].includes(order.stato)
      );

      if (activeOrders.length > 0) {
        renderActiveOrders();
        toggleElement('activeOrdersLoading', false);
        toggleElement('activeOrdersContainer', true);
      } else {
        toggleElement('activeOrdersLoading', false);
        toggleElement('activeOrdersEmpty', true);
      }
    } else {
      toggleElement('activeOrdersLoading', false);
      toggleElement('activeOrdersEmpty', true);
    }
  } catch (error) {
    console.error('Errore caricamento ordini attivi:', error);
    showAlert('Errore nel caricamento degli ordini attivi', 'error');
    toggleElement('activeOrdersLoading', false);
    toggleElement('activeOrdersEmpty', true);
  }
}

/**
 * Carica lo storico ordini del cliente
 */
async function loadOrderHistory() {
  try {
    toggleElement('orderHistoryLoading', true);
    toggleElement('orderHistoryContainer', false);
    toggleElement('orderHistoryEmpty', false);

    const user = getUserData();
    const response = await apiCall(`/orders?cliente=${user._id}`);

    if (response.success && response.data.length > 0) {
      orderHistory = response.data;
      renderOrderHistory();
      toggleElement('orderHistoryLoading', false);
      toggleElement('orderHistoryContainer', true);
    } else {
      toggleElement('orderHistoryLoading', false);
      toggleElement('orderHistoryEmpty', true);
    }
  } catch (error) {
    console.error('Errore caricamento storico ordini:', error);
    showAlert('Errore nel caricamento dello storico ordini', 'error');
    toggleElement('orderHistoryLoading', false);
    toggleElement('orderHistoryEmpty', true);
  }
}

/**
 * Renderizza gli ordini attivi
 */
function renderActiveOrders() {
  const container = document.getElementById('activeOrdersContainer');
  if (!container) return;

  container.innerHTML = activeOrders.map(order => `
    <div class="order-card" data-order-id="${order._id}">
      <div class="order-header">
        <div>
          <div class="order-number">Ordine #${order._id.slice(-6).toUpperCase()}</div>
          <div class="order-date">${formatDate(order.dataOrdine)}</div>
        </div>
        <span class="order-status ${order.stato}">${translateOrderStatus(order.stato)}</span>
      </div>
      
      <div class="order-restaurant">
        <strong>Ristorante:</strong> ${order.ristorante?.nome || 'N/A'}
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

      <div class="order-delivery">
        <strong>Modalità:</strong> ${order.modalitaConsegna === 'consegna' ? '🚚 Consegna' : '🏪 Ritiro'}
      </div>
    </div>
  `).join('');
}

/**
 * Renderizza lo storico ordini
 */
function renderOrderHistory() {
  const container = document.getElementById('orderHistoryContainer');
  if (!container) return;

  // Filtra ordini in base al filtro selezionato
  let filteredOrders = orderHistory;
  if (currentFilter !== 'all') {
    filteredOrders = orderHistory.filter(order => order.stato === currentFilter);
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
      
      <div class="order-restaurant">
        <strong>Ristorante:</strong> ${order.ristorante?.nome || 'N/A'}
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

      <div class="order-delivery">
        <strong>Modalità:</strong> ${order.modalitaConsegna === 'consegna' ? '🚚 Consegna' : '🏪 Ritiro'}
        ${order.dataCompletamento ? `<br><strong>Completato:</strong> ${formatDate(order.dataCompletamento)}` : ''}
      </div>
    </div>
  `).join('');
}

/**
 * Configura i pulsanti filtro
 */
function setupFilterButtons() {
  const filterButtons = document.querySelectorAll('.btn-filter');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Rimuovi classe active da tutti i bottoni
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Aggiungi classe active al bottone cliccato
      button.classList.add('active');
      
      // Aggiorna il filtro corrente
      currentFilter = button.getAttribute('data-status');
      
      // Ri-renderizza lo storico ordini
      renderOrderHistory();
    });
  });
}

// Inizializza la dashboard quando il DOM è pronto
document.addEventListener('DOMContentLoaded', initCustomerDashboard);
