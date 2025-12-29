/**
 * Script per la dashboard
 * @module public/js/dashboard
 */

// Verifica autenticazione
if (!isAuthenticated()) {
  window.location.href = '/login.html';
}

const user = getUser();

/**
 * Inizializza la dashboard
 */
async function initDashboard() {
  const welcomeMessage = document.getElementById('welcomeMessage');
  welcomeMessage.textContent = `Benvenuto, ${user.nome} ${user.cognome}!`;

  if (user.ruolo === 'cliente') {
    document.getElementById('clientDashboard').classList.remove('hidden');
    await loadClientOrders();
  } else if (user.ruolo === 'ristoratore') {
    document.getElementById('restaurantDashboard').classList.remove('hidden');
    await loadRestaurants();
  }
}

/**
 * Carica gli ordini del cliente
 */
async function loadClientOrders() {
  const container = document.getElementById('clientOrders');

  try {
    const response = await fetch(`${API_URL}/orders`, {
      headers: getAuthHeaders()
    });

    const data = await response.json();

    if (data.success) {
      if (data.data.length === 0) {
        container.innerHTML = '<p class="text-center">Non hai ancora effettuato ordini.</p>';
        return;
      }

      container.innerHTML = data.data.map(order => `
        <div class="order-card">
          <div class="order-header">
            <div>
              <h3>Ordine #${order._id.slice(-6)}</h3>
              <p>${new Date(order.dataOrdine).toLocaleString('it-IT')}</p>
              <p><strong>${order.ristorante.nome}</strong></p>
            </div>
            <div>
              ${getStatusBadge(order.stato)}
            </div>
          </div>
          <div class="order-items">
            ${order.piatti.map(item => `
              <div class="order-item">
                <span>${item.quantita}x ${item.piatto.nome}</span>
                <span>€${(item.prezzo * item.quantita).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>
          <div class="order-total">
            Totale: €${order.totale.toFixed(2)}
          </div>
          <p style="margin-top: 1rem;">
            <strong>Modalità:</strong> ${order.modalitaConsegna === 'ritiro' ? 'Ritiro' : 'Consegna'}
          </p>
        </div>
      `).join('');
    } else {
      container.innerHTML = '<p class="text-center">Errore nel caricamento degli ordini.</p>';
    }
  } catch (error) {
    console.error('Errore:', error);
    container.innerHTML = '<p class="text-center">Errore di connessione.</p>';
  }
}

/**
 * Carica i ristoranti del ristoratore
 */
async function loadRestaurants() {
  const container = document.getElementById('restaurants');

  try {
    const response = await fetch(`${API_URL}/restaurants`, {
      headers: getAuthHeaders()
    });

    const data = await response.json();

    if (data.success) {
      const myRestaurants = data.data.filter(r => r.proprietario._id === user._id);

      if (myRestaurants.length === 0) {
        container.innerHTML = '<p class="text-center">Non hai ancora creato ristoranti.</p>';
        return;
      }

      container.innerHTML = myRestaurants.map(restaurant => `
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">${restaurant.nome}</h3>
          </div>
          <div class="card-body">
            <p>${restaurant.descrizione}</p>
            <p><strong>Indirizzo:</strong> ${restaurant.indirizzo.via}, ${restaurant.indirizzo.citta}</p>
            <p><strong>Telefono:</strong> ${restaurant.telefono}</p>
            <div class="mt-1">
              <a href="/dishes.html?restaurant=${restaurant._id}" class="btn btn-secondary">Gestisci Menu</a>
            </div>
          </div>
        </div>
      `).join('');

      // Carica ordini per i ristoranti
      if (myRestaurants.length > 0) {
        await loadRestaurantOrders(myRestaurants[0]._id);
      }
    }
  } catch (error) {
    console.error('Errore:', error);
    container.innerHTML = '<p class="text-center">Errore di connessione.</p>';
  }
}

/**
 * Carica gli ordini per un ristorante
 */
async function loadRestaurantOrders(restaurantId) {
  const container = document.getElementById('restaurantOrders');

  try {
    const response = await fetch(`${API_URL}/orders?ristorante=${restaurantId}`, {
      headers: getAuthHeaders()
    });

    const data = await response.json();

    if (data.success) {
      if (data.data.length === 0) {
        container.innerHTML = '<p class="text-center">Nessun ordine ricevuto.</p>';
        return;
      }

      container.innerHTML = data.data.map(order => `
        <div class="order-card">
          <div class="order-header">
            <div>
              <h3>Ordine #${order._id.slice(-6)}</h3>
              <p>${new Date(order.dataOrdine).toLocaleString('it-IT')}</p>
              <p><strong>Cliente:</strong> ${order.cliente.nome} ${order.cliente.cognome}</p>
              <p><strong>Tel:</strong> ${order.cliente.telefono || 'N/D'}</p>
            </div>
            <div>
              ${getStatusBadge(order.stato)}
              <select class="form-control mt-1" onchange="updateOrderStatus('${order._id}', this.value)">
                <option value="">Cambia stato...</option>
                <option value="in_preparazione">In preparazione</option>
                <option value="pronto">Pronto</option>
                <option value="in_consegna">In consegna</option>
                <option value="consegnato">Consegnato</option>
                <option value="completato">Completato</option>
                <option value="annullato">Annullato</option>
              </select>
            </div>
          </div>
          <div class="order-items">
            ${order.piatti.map(item => `
              <div class="order-item">
                <span>${item.quantita}x ${item.piatto.nome}</span>
                <span>€${(item.prezzo * item.quantita).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>
          <div class="order-total">
            Totale: €${order.totale.toFixed(2)}
          </div>
          ${order.note ? `<p style="margin-top: 1rem;"><strong>Note:</strong> ${order.note}</p>` : ''}
        </div>
      `).join('');
    }
  } catch (error) {
    console.error('Errore:', error);
  }
}

/**
 * Aggiorna lo stato di un ordine
 */
async function updateOrderStatus(orderId, newStatus) {
  if (!newStatus) return;

  try {
    const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ stato: newStatus })
    });

    const data = await response.json();

    if (data.success) {
      showAlert('Stato ordine aggiornato con successo!', 'success');
      // Ricarica la dashboard
      setTimeout(() => window.location.reload(), 1000);
    } else {
      showAlert(data.message || 'Errore nell\'aggiornamento dello stato', 'error');
    }
  } catch (error) {
    console.error('Errore:', error);
    showAlert('Errore di connessione', 'error');
  }
}

/**
 * Ottieni il badge per lo stato dell'ordine
 */
function getStatusBadge(stato) {
  const statusMap = {
    'ordinato': { class: 'badge-info', text: 'Ordinato' },
    'in_preparazione': { class: 'badge-warning', text: 'In preparazione' },
    'pronto': { class: 'badge-success', text: 'Pronto' },
    'in_consegna': { class: 'badge-info', text: 'In consegna' },
    'consegnato': { class: 'badge-success', text: 'Consegnato' },
    'completato': { class: 'badge-success', text: 'Completato' },
    'annullato': { class: 'badge-danger', text: 'Annullato' }
  };

  const status = statusMap[stato] || { class: 'badge-info', text: stato };
  return `<span class="badge ${status.class}">${status.text}</span>`;
}

// Inizializza la dashboard
document.addEventListener('DOMContentLoaded', initDashboard);
