/**
 * Script principale dell'applicazione
 * @module public/js/app
 */

/**
 * Carica i ristoranti consigliati per la homepage
 */
async function loadRecommendedRestaurants() {
  const loading = document.getElementById('restaurantsLoading');
  const container = document.getElementById('restaurantsContainer');
  const empty = document.getElementById('restaurantsEmpty');

  // Check if elements exist (only on homepage)
  if (!loading || !container || !empty) {
    return;
  }

  try {
    loading.classList.remove('hidden');
    
    const response = await fetch(`${API_URL}/restaurants`);
    const data = await response.json();

    loading.classList.add('hidden');

    if (data.success && data.data.length > 0) {
      // Show up to 6 recommended restaurants
      const restaurants = data.data.slice(0, 6);
      
      container.classList.remove('hidden');
      empty.classList.add('hidden');

      container.innerHTML = restaurants.map(restaurant => `
        <div class="restaurant-card" onclick="window.location.href='/menu.html'">
          <img src="${restaurant.immagine || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop'}" 
               alt="${restaurant.nome}"
               onerror="this.src='https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop'">
          <div class="restaurant-card-content">
            <h3 class="restaurant-card-title">${restaurant.nome}</h3>
            <p class="restaurant-card-address">📍 ${restaurant.indirizzo.via}, ${restaurant.indirizzo.citta}</p>
            <p style="color: #666; font-size: 0.9rem; margin-top: 0.5rem;">${restaurant.descrizione}</p>
          </div>
        </div>
      `).join('');
    } else {
      container.classList.add('hidden');
      empty.classList.remove('hidden');
    }
  } catch (error) {
    console.error('Errore nel caricamento dei ristoranti:', error);
    loading.classList.add('hidden');
    container.classList.add('hidden');
    empty.classList.remove('hidden');
  }
}

// Inizializzazione generale dell'applicazione
document.addEventListener('DOMContentLoaded', () => {
  console.log('Fast Food App caricata correttamente');
  loadRecommendedRestaurants();
});
