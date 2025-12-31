/**
 * app.js - Script principale per la homepage
 * Carica e visualizza i ristoranti consigliati
 */

// Immagine di fallback per i ristoranti
const DEFAULT_RESTAURANT_IMAGE = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop';

/**
 * Carica i ristoranti consigliati per la homepage
 */
async function loadRecommendedRestaurants() {
  const loading = document.getElementById('restaurantsLoading');
  const container = document.getElementById('restaurantsContainer');
  const empty = document.getElementById('restaurantsEmpty');

  // Verifica se gli elementi esistono (solo su homepage)
  if (!loading || !container || !empty) {
    return;
  }

  try {
    toggleElement('restaurantsLoading', true);
    toggleElement('restaurantsContainer', false);
    toggleElement('restaurantsEmpty', false);
    
    const response = await apiCall('/restaurants');

    if (response.success && response.data.length > 0) {
      // Mostra fino a 6 ristoranti consigliati
      const restaurants = response.data.slice(0, 6);
      
      container.innerHTML = restaurants.map(restaurant => `
        <div class="restaurant-card" onclick="handleRestaurantClick('${restaurant._id}')">
          <img src="${restaurant.immagine || DEFAULT_RESTAURANT_IMAGE}" 
               alt="${restaurant.nome}"
               onerror="this.src='${DEFAULT_RESTAURANT_IMAGE}'">
          <div class="restaurant-card-content">
            <h3 class="restaurant-card-title">${restaurant.nome}</h3>
            <p class="restaurant-card-address">📍 ${restaurant.indirizzo.via}, ${restaurant.indirizzo.citta}</p>
            <p style="color: #666; font-size: 0.9rem; margin-top: 0.5rem;">${restaurant.descrizione}</p>
          </div>
        </div>
      `).join('');

      toggleElement('restaurantsLoading', false);
      toggleElement('restaurantsContainer', true);
    } else {
      toggleElement('restaurantsLoading', false);
      toggleElement('restaurantsEmpty', true);
    }
  } catch (error) {
    console.error('Errore nel caricamento dei ristoranti:', error);
    toggleElement('restaurantsLoading', false);
    toggleElement('restaurantsEmpty', true);
  }
}

/**
 * Gestisce il click su un ristorante
 * @param {string} restaurantId - ID del ristorante
 */
function handleRestaurantClick(restaurantId) {
  // TODO: Implementare navigazione alla pagina del menu del ristorante
  // Per ora mostra un messaggio
  console.log('Click su ristorante:', restaurantId);
  showAlert('Funzionalità menu ristorante in sviluppo', 'info');
}

// Inizializzazione della homepage
document.addEventListener('DOMContentLoaded', () => {
  console.log('Fast Food App caricata correttamente');
  loadRecommendedRestaurants();
});
