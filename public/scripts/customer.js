/**
 * customer.js - Logica per la dashboard del cliente
 * Gestisce visualizzazione ordini attivi, storico ordini, profilo e metodi di pagamento
 */

// Variabili globali
let activeOrders = [];
let orderHistory = [];
let currentFilter = 'all';
let paymentMethods = [];

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

  // Carica profilo, metodi di pagamento, ordini attivi e storico
  await loadProfile();
  await loadPaymentMethods();
  await loadActiveOrders();
  await loadOrderHistory();

  // Aggiungi event listener per i filtri e i pulsanti
  setupEventListeners();
}

/**
 * Carica e visualizza il profilo utente
 */
async function loadProfile() {
  try {
    const user = getUserData();
    const container = document.getElementById('profileContainer');
    if (!container) return;

    container.innerHTML = `
      <div class="profile-info">
        <div class="profile-item">
          <div class="profile-item-label"><i class="fas fa-user"></i> Nome Completo</div>
          <div class="profile-item-value">${user.nome} ${user.cognome}</div>
        </div>
        <div class="profile-item">
          <div class="profile-item-label"><i class="fas fa-envelope"></i> Email</div>
          <div class="profile-item-value">${user.email}</div>
        </div>
        <div class="profile-item">
          <div class="profile-item-label"><i class="fas fa-phone"></i> Telefono</div>
          <div class="profile-item-value">${user.telefono || 'Non specificato'}</div>
        </div>
        <div class="profile-item">
          <div class="profile-item-label"><i class="fas fa-map-marker-alt"></i> Indirizzo</div>
          <div class="profile-item-value">
            ${user.indirizzo ? `${user.indirizzo.via}, ${user.indirizzo.citta} ${user.indirizzo.cap}` : 'Non specificato'}
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Errore caricamento profilo:', error);
  }
}

  /**
   * Carica i metodi di pagamento del cliente
   * NOTA: Questa è un'implementazione demo che usa localStorage.
   * In produzione, i metodi di pagamento dovrebbero essere salvati
   * lato server per motivi di sicurezza e compliance PCI DSS.
   */
  async function loadPaymentMethods() {
    try {
      toggleElement('paymentMethodsLoading', true);
      toggleElement('paymentMethodsContainer', false);
      toggleElement('paymentMethodsEmpty', false);

      // Simula caricamento metodi di pagamento dal localStorage
      // TODO: In produzione, sostituire con chiamata API al server
      // const response = await apiCall('/payment-methods');
      const savedMethods = localStorage.getItem('paymentMethods');
      paymentMethods = savedMethods ? JSON.parse(savedMethods) : [];

    if (paymentMethods.length > 0) {
      renderPaymentMethods();
      toggleElement('paymentMethodsLoading', false);
      toggleElement('paymentMethodsContainer', true);
    } else {
      toggleElement('paymentMethodsLoading', false);
      toggleElement('paymentMethodsEmpty', true);
    }
  } catch (error) {
    console.error('Errore caricamento metodi di pagamento:', error);
    toggleElement('paymentMethodsLoading', false);
    toggleElement('paymentMethodsEmpty', true);
  }
}

/**
 * Renderizza i metodi di pagamento
 */
function renderPaymentMethods() {
  const container = document.getElementById('paymentMethodsContainer');
  if (!container) return;

  container.innerHTML = paymentMethods.map((method, index) => `
    <div class="payment-card ${method.isDefault ? 'default' : ''}" data-method-id="${index}">
      ${method.isDefault ? '<span class="default-badge">Predefinito</span>' : ''}
      <div class="payment-card-header">
        <div class="payment-card-type">${method.cardType}</div>
        <div class="payment-card-icon">
          <i class="fab fa-cc-${method.cardType.toLowerCase()}"></i>
        </div>
      </div>
      <div class="payment-card-number">**** **** **** ${method.lastFourDigits}</div>
      <div class="payment-card-footer">
        <div>
          <div class="payment-card-expiry">Scad: ${method.expiryDate}</div>
          <div class="payment-card-holder">${method.cardholderName}</div>
        </div>
      </div>
      <div class="payment-card-actions">
        ${!method.isDefault ? `<button onclick="setDefaultPaymentMethod(${index})" title="Imposta come predefinito"><i class="fas fa-star"></i></button>` : ''}
        <button onclick="deletePaymentMethod(${index})" title="Elimina"><i class="fas fa-trash"></i></button>
      </div>
    </div>
  `).join('');
}

/**
 * Imposta un metodo di pagamento come predefinito
 */
function setDefaultPaymentMethod(index) {
  paymentMethods.forEach((method, i) => {
    method.isDefault = (i === index);
  });
  localStorage.setItem('paymentMethods', JSON.stringify(paymentMethods));
  renderPaymentMethods();
  showAlert('Metodo di pagamento predefinito aggiornato', 'success');
}

/**
 * Elimina un metodo di pagamento
 */
function deletePaymentMethod(index) {
  if (confirm('Sei sicuro di voler eliminare questo metodo di pagamento?')) {
    paymentMethods.splice(index, 1);
    localStorage.setItem('paymentMethods', JSON.stringify(paymentMethods));
    
    if (paymentMethods.length > 0) {
      renderPaymentMethods();
    } else {
      toggleElement('paymentMethodsContainer', false);
      toggleElement('paymentMethodsEmpty', true);
    }
    showAlert('Metodo di pagamento eliminato', 'success');
  }
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
 * Calcola la stima del tempo di consegna basata sullo stato e modalità
 * @param {object} order - L'ordine
 * @returns {string} Messaggio con la stima del tempo
 */
function calculateDeliveryEstimate(order) {
  const now = new Date();
  const orderDate = new Date(order.dataOrdine);
  const elapsedMinutes = Math.floor((now - orderDate) / 60000);

  let estimateMinutes = 0;
  let message = '';

  switch (order.stato) {
    case 'ordinato':
      estimateMinutes = order.modalitaConsegna === 'consegna' ? 45 : 30;
      message = `Tempo stimato: ${estimateMinutes - elapsedMinutes > 0 ? estimateMinutes - elapsedMinutes : 5} minuti`;
      break;
    case 'in_preparazione':
      estimateMinutes = order.modalitaConsegna === 'consegna' ? 30 : 20;
      message = `Tempo stimato: ${estimateMinutes - elapsedMinutes > 0 ? estimateMinutes - elapsedMinutes : 5} minuti`;
      break;
    case 'pronto':
      if (order.modalitaConsegna === 'ritiro') {
        message = 'Pronto per il ritiro!';
      } else {
        message = 'Pronto - In attesa del corriere (circa 15 minuti)';
      }
      break;
    case 'in_consegna':
      message = 'In consegna - Arrivo previsto in 10-15 minuti';
      break;
    case 'consegnato':
    case 'completato':
      message = 'Ordine completato';
      break;
    case 'annullato':
      message = 'Ordine annullato';
      break;
    default:
      message = '';
  }

  return message;
}

/**
 * Renderizza gli ordini attivi con tempi di consegna stimati
 */
function renderActiveOrders() {
  const container = document.getElementById('activeOrdersContainer');
  if (!container) return;

  container.innerHTML = activeOrders.map(order => {
    const deliveryEstimate = calculateDeliveryEstimate(order);
    const restaurantName = escapeHtml(order.ristorante?.nome || 'N/A');
    const orderId = order._id;
    const orderNumber = escapeHtml(order._id.slice(-6).toUpperCase());
    
    return `
    <div class="order-card" data-order-id="${orderId}">
      <div class="order-header">
        <div>
          <div class="order-number">Ordine #${orderNumber}</div>
          <div class="order-date">${formatDate(order.dataOrdine)}</div>
        </div>
        <span class="order-status ${order.stato}">${translateOrderStatus(order.stato)}</span>
      </div>
      
      ${deliveryEstimate && !['completato', 'consegnato', 'annullato'].includes(order.stato) ? `
        <div class="delivery-estimate">
          <i class="fas fa-clock"></i>
          <strong>${escapeHtml(deliveryEstimate)}</strong>
        </div>
      ` : ''}
      
      <div class="order-restaurant">
        <strong>Ristorante:</strong> ${restaurantName}
      </div>

      <div class="order-items">
        ${order.piatti.map(item => {
          const itemName = escapeHtml(item.piatto?.nome || 'Piatto');
          return `
          <div class="order-item">
            <span class="item-name">
              ${itemName} 
              <span class="item-quantity">x${item.quantita}</span>
            </span>
            <span class="item-price">${formatPrice(item.prezzo * item.quantita)}</span>
          </div>`;
        }).join('')}
      </div>

      <div class="order-total">
        <span>Totale:</span>
        <span>${formatPrice(order.totaleCentesimi)}</span>
      </div>

      <div class="order-delivery">
        <strong>Modalità:</strong> ${order.modalitaConsegna === 'consegna' ? 'Consegna' : 'Ritiro'}
        ${order.indirizzoConsegna && order.modalitaConsegna === 'consegna' ? 
          `<br><strong>Indirizzo:</strong> ${escapeHtml(order.indirizzoConsegna.via)}, ${escapeHtml(order.indirizzoConsegna.citta)}` : ''}
      </div>
    </div>
  `;
  }).join('');
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

  container.innerHTML = filteredOrders.map(order => {
    const restaurantName = escapeHtml(order.ristorante?.nome || 'N/A');
    const orderId = order._id;
    const orderNumber = escapeHtml(order._id.slice(-6).toUpperCase());
    
    return `
    <div class="order-card" data-order-id="${orderId}">
      <div class="order-header">
        <div>
          <div class="order-number">Ordine #${orderNumber}</div>
          <div class="order-date">${formatDate(order.dataOrdine)}</div>
        </div>
        <span class="order-status ${order.stato}">${translateOrderStatus(order.stato)}</span>
      </div>
      
      <div class="order-restaurant">
        <strong>Ristorante:</strong> ${restaurantName}
      </div>

      <div class="order-items">
        ${order.piatti.map(item => {
          const itemName = escapeHtml(item.piatto?.nome || 'Piatto');
          return `
          <div class="order-item">
            <span class="item-name">
              ${itemName} 
              <span class="item-quantity">x${item.quantita}</span>
            </span>
            <span class="item-price">${formatPrice(item.prezzo * item.quantita)}</span>
          </div>`;
        }).join('')}
      </div>

      <div class="order-total">
        <span>Totale:</span>
        <span>${formatPrice(order.totaleCentesimi)}</span>
      </div>

      <div class="order-delivery">
        <strong>Modalità:</strong> ${order.modalitaConsegna === 'consegna' ? 'Consegna' : 'Ritiro'}
        ${order.dataCompletamento ? `<br><strong>Completato:</strong> ${formatDate(order.dataCompletamento)}` : ''}
      </div>
    </div>
  `;
  }).join('');
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

/**
 * Configura tutti gli event listener
 */
function setupEventListeners() {
  // Event listener per i filtri
  setupFilterButtons();

  // Event listener per il pulsante aggiorna ordini
  const btnRefreshOrders = document.getElementById('btnRefreshOrders');
  if (btnRefreshOrders) {
    btnRefreshOrders.addEventListener('click', async () => {
      await loadActiveOrders();
      showAlert('Ordini aggiornati', 'success');
    });
  }

  // Event listener per il pulsante modifica profilo
  const btnEditProfile = document.getElementById('btnEditProfile');
  if (btnEditProfile) {
    btnEditProfile.addEventListener('click', openProfileModal);
  }

  // Event listener per il pulsante aggiungi metodo di pagamento
  const btnAddPaymentMethod = document.getElementById('btnAddPaymentMethod');
  if (btnAddPaymentMethod) {
    btnAddPaymentMethod.addEventListener('click', openPaymentMethodModal);
  }

  // Event listener per chiusura modal profilo
  const closeProfileModal = document.getElementById('closeProfileModal');
  const cancelProfileBtn = document.getElementById('cancelProfileBtn');
  if (closeProfileModal) {
    closeProfileModal.addEventListener('click', () => {
      document.getElementById('profileModal').classList.remove('active');
      document.getElementById('profileModal').classList.add('hidden');
    });
  }
  if (cancelProfileBtn) {
    cancelProfileBtn.addEventListener('click', () => {
      document.getElementById('profileModal').classList.remove('active');
      document.getElementById('profileModal').classList.add('hidden');
    });
  }

  // Event listener per chiusura modal pagamento
  const closePaymentMethodModal = document.getElementById('closePaymentMethodModal');
  const cancelPaymentMethodBtn = document.getElementById('cancelPaymentMethodBtn');
  if (closePaymentMethodModal) {
    closePaymentMethodModal.addEventListener('click', () => {
      document.getElementById('paymentMethodModal').classList.remove('active');
      document.getElementById('paymentMethodModal').classList.add('hidden');
    });
  }
  if (cancelPaymentMethodBtn) {
    cancelPaymentMethodBtn.addEventListener('click', () => {
      document.getElementById('paymentMethodModal').classList.remove('active');
      document.getElementById('paymentMethodModal').classList.add('hidden');
    });
  }

  // Event listener per form profilo
  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', handleProfileUpdate);
  }

  // Event listener per form metodo di pagamento
  const paymentMethodForm = document.getElementById('paymentMethodForm');
  if (paymentMethodForm) {
    paymentMethodForm.addEventListener('submit', handlePaymentMethodAdd);
  }

  // Formattazione automatica numero carta
  const cardNumberInput = document.getElementById('cardNumber');
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
      e.target.value = formattedValue;
    });
  }

  // Formattazione automatica data scadenza
  const expiryDateInput = document.getElementById('expiryDate');
  if (expiryDateInput) {
    expiryDateInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      e.target.value = value;
    });
  }
}

/**
 * Apre il modal per modificare il profilo
 */
function openProfileModal() {
  const user = getUserData();
  const modal = document.getElementById('profileModal');
  
  // Precompila i campi del form
  document.getElementById('profileNome').value = user.nome || '';
  document.getElementById('profileCognome').value = user.cognome || '';
  document.getElementById('profileTelefono').value = user.telefono || '';
  document.getElementById('profileVia').value = user.indirizzo?.via || '';
  document.getElementById('profileCitta').value = user.indirizzo?.citta || '';
  document.getElementById('profileCap').value = user.indirizzo?.cap || '';
  
  modal.classList.remove('hidden');
  modal.classList.add('active');
}

/**
 * Gestisce l'aggiornamento del profilo
 */
async function handleProfileUpdate(e) {
  e.preventDefault();
  
  try {
    const formData = {
      nome: document.getElementById('profileNome').value,
      cognome: document.getElementById('profileCognome').value,
      telefono: document.getElementById('profileTelefono').value,
      indirizzo: {
        via: document.getElementById('profileVia').value,
        citta: document.getElementById('profileCitta').value,
        cap: document.getElementById('profileCap').value
      }
    };

    const response = await apiCall('/users/me', {
      method: 'PUT',
      body: JSON.stringify(formData)
    });

    if (response.success) {
      // Aggiorna i dati utente nel localStorage
      const updatedUser = { ...getUserData(), ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      showAlert('Profilo aggiornato con successo', 'success');
      
      // Chiudi il modal
      document.getElementById('profileModal').classList.remove('active');
      document.getElementById('profileModal').classList.add('hidden');
      
      // Ricarica il profilo
      await loadProfile();
    }
  } catch (error) {
    console.error('Errore aggiornamento profilo:', error);
    showAlert('Errore nell\'aggiornamento del profilo: ' + error.message, 'error');
  }
}

/**
 * Apre il modal per aggiungere un metodo di pagamento
 */
function openPaymentMethodModal() {
  const modal = document.getElementById('paymentMethodModal');
  document.getElementById('paymentMethodForm').reset();
  modal.classList.remove('hidden');
  modal.classList.add('active');
}

/**
 * Gestisce l'aggiunta di un nuovo metodo di pagamento
 */
function handlePaymentMethodAdd(e) {
  e.preventDefault();
  
  try {
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s+/g, '');
    const newMethod = {
      cardType: document.getElementById('cardType').value,
      lastFourDigits: cardNumber.slice(-4),
      expiryDate: document.getElementById('expiryDate').value,
      cardholderName: document.getElementById('cardholderName').value,
      isDefault: document.getElementById('isDefault').checked || paymentMethods.length === 0
    };

    // Se questo è impostato come predefinito, rimuovi il flag dagli altri
    if (newMethod.isDefault) {
      paymentMethods.forEach(method => method.isDefault = false);
    }

    paymentMethods.push(newMethod);
    localStorage.setItem('paymentMethods', JSON.stringify(paymentMethods));

    showAlert('Metodo di pagamento aggiunto con successo', 'success');
    
    // Chiudi il modal
    document.getElementById('paymentMethodModal').classList.remove('active');
    document.getElementById('paymentMethodModal').classList.add('hidden');
    
    // Aggiorna la visualizzazione
    toggleElement('paymentMethodsEmpty', false);
    toggleElement('paymentMethodsContainer', true);
    renderPaymentMethods();
  } catch (error) {
    console.error('Errore aggiunta metodo di pagamento:', error);
    showAlert('Errore nell\'aggiunta del metodo di pagamento: ' + error.message, 'error');
  }
}

// Inizializza la dashboard quando il DOM è pronto
document.addEventListener('DOMContentLoaded', initCustomerDashboard);
