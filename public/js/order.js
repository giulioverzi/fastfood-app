/**
 * Script per la pagina ordine
 * @module public/js/order
 */

// Verifica autenticazione
if (!isAuthenticated() || getUser().ruolo !== 'cliente') {
  window.location.href = '/login.html';
}

let cart = JSON.parse(localStorage.getItem('cart')) || [];

/**
 * Mostra gli elementi del carrello
 */
function displayCart() {
  const cartItemsContainer = document.getElementById('cartItems');
  const cartTotalContainer = document.getElementById('cartTotal');

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="text-center">Il carrello è vuoto.</p>';
    cartTotalContainer.innerHTML = '';
    return;
  }

  // Raggruppa per ristorante
  const restaurantGroups = {};
  cart.forEach(item => {
    if (!restaurantGroups[item.ristorante]) {
      restaurantGroups[item.ristorante] = {
        nome: item.ristorante_nome,
        items: []
      };
    }
    restaurantGroups[item.ristorante].items.push(item);
  });

  // Verifica che tutti i piatti siano dello stesso ristorante
  const restaurantIds = Object.keys(restaurantGroups);
  if (restaurantIds.length > 1) {
    showAlert('Attenzione: Puoi ordinare solo da un ristorante alla volta. Svuota il carrello e riprova.', 'error');
    document.getElementById('orderForm').querySelector('button[type="submit"]').disabled = true;
  }

  let html = '';
  let total = 0;

  Object.values(restaurantGroups).forEach(group => {
    html += `<h4 style="margin-bottom: 1rem;">${group.nome}</h4>`;
    group.items.forEach((item, index) => {
      const itemTotal = item.prezzo * item.quantita;
      total += itemTotal;

      html += `
        <div class="order-item">
          <div>
            <strong>${item.nome}</strong>
            <div style="margin-top: 0.5rem;">
              <button class="btn btn-outline" style="padding: 0.3rem 0.7rem;" onclick="updateQuantity(${index}, -1)">-</button>
              <span style="margin: 0 1rem;">${item.quantita}</span>
              <button class="btn btn-outline" style="padding: 0.3rem 0.7rem;" onclick="updateQuantity(${index}, 1)">+</button>
              <button class="btn" style="padding: 0.3rem 0.7rem; background: none; color: var(--danger-color);" onclick="removeItem(${index})">Rimuovi</button>
            </div>
          </div>
          <div style="text-align: right;">
            <div>€${item.prezzo.toFixed(2)} cad.</div>
            <div><strong>€${itemTotal.toFixed(2)}</strong></div>
          </div>
        </div>
      `;
    });
  });

  cartItemsContainer.innerHTML = html;
  cartTotalContainer.innerHTML = `Totale: €${total.toFixed(2)}`;
}

/**
 * Aggiorna la quantità di un elemento
 */
function updateQuantity(index, change) {
  cart[index].quantita += change;
  
  if (cart[index].quantita <= 0) {
    cart.splice(index, 1);
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  displayCart();
}

/**
 * Rimuovi un elemento dal carrello
 */
function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  displayCart();
}

/**
 * Svuota il carrello
 */
function clearCart() {
  if (confirm('Sei sicuro di voler svuotare il carrello?')) {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
  }
}

/**
 * Gestisci il form dell'ordine
 */
document.getElementById('orderForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  if (cart.length === 0) {
    showAlert('Il carrello è vuoto!', 'error');
    return;
  }

  // Verifica che tutti i piatti siano dello stesso ristorante
  const restaurantIds = [...new Set(cart.map(item => item.ristorante))];
  if (restaurantIds.length > 1) {
    showAlert('Puoi ordinare solo da un ristorante alla volta!', 'error');
    return;
  }

  const modalitaConsegna = document.getElementById('modalitaConsegna').value;
  
  const orderData = {
    ristorante: cart[0].ristorante,
    piatti: cart.map(item => ({
      piatto: item.piatto,
      quantita: item.quantita
    })),
    modalitaConsegna,
    note: document.getElementById('note').value
  };

  // Aggiungi indirizzo se consegna
  if (modalitaConsegna === 'consegna') {
    const via = document.getElementById('via').value;
    const citta = document.getElementById('citta').value;
    const cap = document.getElementById('cap').value;

    if (!via || !citta || !cap) {
      showAlert('Compila tutti i campi dell\'indirizzo per la consegna!', 'error');
      return;
    }

    orderData.indirizzoConsegna = { via, citta, cap };
  }

  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData)
    });

    const data = await response.json();

    if (data.success) {
      showAlert('Ordine creato con successo!', 'success');
      
      // Svuota il carrello
      cart = [];
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Redirect alla dashboard dopo 2 secondi
      setTimeout(() => {
        window.location.href = '/dashboard.html';
      }, 2000);
    } else {
      showAlert(data.message || 'Errore nella creazione dell\'ordine', 'error');
    }
  } catch (error) {
    console.error('Errore:', error);
    showAlert('Errore di connessione al server', 'error');
  }
});

/**
 * Mostra/nascondi campi indirizzo in base alla modalità
 */
document.getElementById('modalitaConsegna').addEventListener('change', (e) => {
  const indirizzoFields = document.getElementById('indirizzoFields');
  
  if (e.target.value === 'consegna') {
    indirizzoFields.classList.remove('hidden');
    document.getElementById('via').required = true;
    document.getElementById('citta').required = true;
    document.getElementById('cap').required = true;
  } else {
    indirizzoFields.classList.add('hidden');
    document.getElementById('via').required = false;
    document.getElementById('citta').required = false;
    document.getElementById('cap').required = false;
  }
});

// Inizializza la pagina
document.addEventListener('DOMContentLoaded', () => {
  displayCart();
});
