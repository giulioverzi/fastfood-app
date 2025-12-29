/**
 * Script per il form del ristorante
 * @module public/js/restaurant-form
 */

// Verifica autenticazione e ruolo
if (!isAuthenticated() || getUser().ruolo !== 'ristoratore') {
  window.location.href = '/login.html';
}

let restaurantId = null;
let isEditMode = false;

/**
 * Inizializza la pagina
 */
async function initPage() {
  // Verifica se è in modalità modifica
  const urlParams = new URLSearchParams(window.location.search);
  restaurantId = urlParams.get('id');

  if (restaurantId) {
    isEditMode = true;
    document.getElementById('pageTitle').textContent = 'Modifica Ristorante';
    await loadRestaurantData();
  }
}

/**
 * Carica i dati del ristorante per la modifica
 */
async function loadRestaurantData() {
  try {
    const response = await fetch(`${API_URL}/restaurants/${restaurantId}`, {
      headers: getAuthHeaders()
    });

    const data = await response.json();

    if (data.success) {
      const restaurant = data.data;

      // Verifica che l'utente sia il proprietario
      if (restaurant.proprietario._id !== getUser()._id) {
        showAlert('Non sei autorizzato a modificare questo ristorante', 'error');
        setTimeout(() => window.location.href = '/dashboard.html', 2000);
        return;
      }

      // Popola il form
      document.getElementById('nome').value = restaurant.nome;
      document.getElementById('descrizione').value = restaurant.descrizione;
      document.getElementById('telefono').value = restaurant.telefono;
      document.getElementById('via').value = restaurant.indirizzo.via;
      document.getElementById('citta').value = restaurant.indirizzo.citta;
      document.getElementById('cap').value = restaurant.indirizzo.cap;
      document.getElementById('orariApertura').value = restaurant.orariApertura || 'Lun-Dom: 11:00-23:00';
    } else {
      showAlert('Errore nel caricamento dei dati del ristorante', 'error');
    }
  } catch (error) {
    console.error('Errore:', error);
    showAlert('Errore di connessione', 'error');
  }
}

/**
 * Gestisci il submit del form
 */
document.getElementById('restaurantForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    nome: document.getElementById('nome').value,
    descrizione: document.getElementById('descrizione').value,
    telefono: document.getElementById('telefono').value,
    indirizzo: {
      via: document.getElementById('via').value,
      citta: document.getElementById('citta').value,
      cap: document.getElementById('cap').value
    },
    orariApertura: document.getElementById('orariApertura').value
  };

  try {
    const url = isEditMode 
      ? `${API_URL}/restaurants/${restaurantId}`
      : `${API_URL}/restaurants`;
    
    const method = isEditMode ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (data.success) {
      showAlert(
        isEditMode ? 'Ristorante aggiornato con successo!' : 'Ristorante creato con successo!',
        'success'
      );
      
      setTimeout(() => {
        window.location.href = '/dashboard.html';
      }, 1500);
    } else {
      showAlert(data.message || 'Errore nel salvataggio del ristorante', 'error');
    }
  } catch (error) {
    console.error('Errore:', error);
    showAlert('Errore di connessione al server', 'error');
  }
});

// Inizializza la pagina
document.addEventListener('DOMContentLoaded', initPage);
