/**
 * checkout.js - Script per la pagina di checkout
 * Gestisce il completamento dell'ordine e l'invio al backend
 */

/**
 * Verifica se l'utente è autenticato e ha il ruolo di cliente
 */
function checkClientAuth() {
  if (!isAuthenticated()) {
    showAlert('Devi effettuare il login per completare l\'ordine', 'error');
    setTimeout(() => {
      window.location.href = '/html/login.html';
    }, 1500);
    return false;
  }

  const user = getUserData();
  if (user.ruolo !== 'cliente') {
    showAlert('Solo i clienti possono effettuare ordini', 'error');
    setTimeout(() => {
      window.location.href = '/';
    }, 1500);
    return false;
  }

  return true;
}

/**
 * Carica e visualizza il riepilogo dell'ordine
 */
function loadOrderSummary() {
  const cart = getCart();
  const summaryContainer = document.getElementById('orderSummary');
  const totalPriceElement = document.getElementById('totalPrice');

  if (!cart || cart.length === 0) {
    showAlert('Il carrello è vuoto', 'error');
    setTimeout(() => {
      window.location.href = '/html/menu.html';
    }, 1500);
    return;
  }

  // Calcola il totale
  const totaleCentesimi = cart.reduce((sum, item) => sum + (item.prezzoCentesimi * item.quantita), 0);

  // Visualizza il riepilogo
  summaryContainer.innerHTML = `
    <div class="order-items">
      ${cart.map(item => `
        <div class="order-item">
          <div class="order-item-details">
            <h4>${item.nome}</h4>
            <p class="order-item-restaurant">${item.ristoranteNome}</p>
            <p class="order-item-quantity">Quantità: ${item.quantita}</p>
          </div>
          <div class="order-item-price">
            ${formatPrice(item.prezzoCentesimi * item.quantita)}
          </div>
        </div>
      `).join('')}
    </div>
    <div class="order-summary-footer">
      <p><strong>Ristorante:</strong> ${cart[0].ristoranteNome}</p>
    </div>
  `;

  totalPriceElement.textContent = formatPrice(totaleCentesimi);
}

/**
 * Pre-compila i dati utente se disponibili
 */
function prefillUserData() {
  const user = getUserData();
  
  if (user && user.indirizzo) {
    const viaInput = document.getElementById('via');
    const cittaInput = document.getElementById('citta');
    const capInput = document.getElementById('cap');
    
    if (viaInput && user.indirizzo.via) viaInput.value = user.indirizzo.via;
    if (cittaInput && user.indirizzo.citta) cittaInput.value = user.indirizzo.citta;
    if (capInput && user.indirizzo.cap) capInput.value = user.indirizzo.cap;
  }
}

/**
 * Gestisce il cambio della modalità di consegna
 */
function handleDeliveryModeChange() {
  const modalitaConsegna = document.getElementById('modalitaConsegna').value;
  const deliveryAddressSection = document.getElementById('deliveryAddressSection');

  if (modalitaConsegna === 'consegna') {
    deliveryAddressSection.classList.remove('hidden');
    // Rendi obbligatori i campi indirizzo
    document.getElementById('via').required = true;
    document.getElementById('citta').required = true;
    document.getElementById('cap').required = true;
  } else {
    deliveryAddressSection.classList.add('hidden');
    // Rimuovi l'obbligo dai campi indirizzo
    document.getElementById('via').required = false;
    document.getElementById('citta').required = false;
    document.getElementById('cap').required = false;
  }
}

/**
 * Carica i metodi di pagamento salvati e popola il select
 */
async function caricaMetodiPagamento() {
  const selectMetodo = document.getElementById('metodoPagamento');
  const loadingDiv = document.getElementById('paymentMethodsLoading');

  try {
    const risposta = await apiCall('/users/payment-methods');
    const metodiPagamento = risposta.data || [];

    if (loadingDiv) loadingDiv.style.display = 'none';
    selectMetodo.innerHTML = '';

    if (metodiPagamento.length === 0) {
      const opzioneContanti = document.createElement('option');
      opzioneContanti.value = 'contanti';
      opzioneContanti.textContent = 'Pagamento alla consegna';
      selectMetodo.appendChild(opzioneContanti);
    } else {
      metodiPagamento.forEach((metodo, indice) => {
        const opzione = document.createElement('option');
        opzione.value = indice;
        const tipo = metodo.tipo || 'Carta';
        const ultime4 = metodo.ultime4Cifre || '****';
        const scadenza = metodo.scadenza || '--/--';
        const intestatario = metodo.intestatario || '';
        opzione.textContent = `${tipo} **** ${ultime4} - Scad: ${scadenza} (${intestatario})`;
        selectMetodo.appendChild(opzione);
      });
      const opzioneContanti = document.createElement('option');
      opzioneContanti.value = 'contanti';
      opzioneContanti.textContent = 'Pagamento alla consegna';
      selectMetodo.appendChild(opzioneContanti);
    }
  } catch (errore) {
    console.error('Errore caricamento metodi di pagamento:', errore);
    if (loadingDiv) loadingDiv.style.display = 'none';
    selectMetodo.innerHTML = '<option value="contanti">Pagamento alla consegna</option>';
  }
}

/**
 * Gestisce l'invio del form di checkout
 * @param {Event} e - L'evento submit
 */
async function handleCheckoutSubmit(e) {
  e.preventDefault();

  const cart = getCart();
  if (!cart || cart.length === 0) {
    showAlert('Il carrello è vuoto', 'error');
    return;
  }

  // Prepara i dati dell'ordine
  const modalitaConsegna = document.getElementById('modalitaConsegna').value;
  const note = document.getElementById('note').value;
  
  const orderData = {
    ristorante: cart[0].ristorante,
    piatti: cart.map(item => ({
      piatto: item.piatto,
      quantita: item.quantita,
      prezzoCentesimi: item.prezzoCentesimi
    })),
    modalitaConsegna: modalitaConsegna,
    metodoPagamento: document.getElementById('metodoPagamento').value,
    note: note
  };

  // Aggiungi indirizzo di consegna se necessario
  if (modalitaConsegna === 'consegna') {
    orderData.indirizzoConsegna = {
      via: document.getElementById('via').value,
      citta: document.getElementById('citta').value,
      cap: document.getElementById('cap').value
    };
  }

  // Disabilita il pulsante di submit
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Elaborazione...';

  try {
    const response = await apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });

    if (response.success) {
      // Svuota il carrello
      clearCart();
      
      // Mostra messaggio di successo
      showAlert('Ordine effettuato con successo!', 'success');
      
      // Reindirizza alla dashboard cliente dopo 2 secondi
      setTimeout(() => {
        window.location.href = '/html/dashboard-customer.html';
      }, 2000);
    }
  } catch (error) {
    console.error('Errore nell\'invio dell\'ordine:', error);
    showAlert(error.message || 'Errore nell\'invio dell\'ordine. Riprova.', 'error');
    
    // Riabilita il pulsante
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
}

// Inizializzazione della pagina checkout
document.addEventListener('DOMContentLoaded', () => {
  console.log('Pagina checkout caricata');

  // Verifica autenticazione
  if (!checkClientAuth()) {
    return;
  }

  // Carica il riepilogo dell'ordine
  loadOrderSummary();

  // Pre-compila i dati utente
  prefillUserData();

  // Carica i metodi di pagamento salvati
  caricaMetodiPagamento();

  // Event listener per modalità di consegna
  document.getElementById('modalitaConsegna').addEventListener('change', handleDeliveryModeChange);

  // Event listener per il form
  document.getElementById('checkoutForm').addEventListener('submit', handleCheckoutSubmit);
});
