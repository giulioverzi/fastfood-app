/**
 * Script per la gestione dei piatti
 * @module public/js/dishes
 */

// Verifica autenticazione e ruolo
if (!isAuthenticated() || getUser().ruolo !== 'ristoratore') {
  window.location.href = '/login.html';
}

let restaurantId = null;
let currentDishId = null;
let isEditMode = false;

/**
 * Inizializza la pagina
 */
async function initPage() {
  const urlParams = new URLSearchParams(window.location.search);
  restaurantId = urlParams.get('restaurant');

  if (!restaurantId) {
    showAlert('ID ristorante mancante', 'error');
    setTimeout(() => window.location.href = '/dashboard.html', 2000);
    return;
  }

  await loadRestaurantInfo();
  await loadDishes();
}

/**
 * Carica le informazioni del ristorante
 */
async function loadRestaurantInfo() {
  try {
    const response = await fetch(`${API_URL}/restaurants/${restaurantId}`, {
      headers: getAuthHeaders()
    });

    const data = await response.json();

    if (data.success) {
      document.getElementById('restaurantName').textContent = `Menu - ${data.data.nome}`;
    }
  } catch (error) {
    console.error('Errore:', error);
  }
}

/**
 * Carica i piatti del ristorante
 */
async function loadDishes() {
  const container = document.getElementById('dishesContainer');

  try {
    const response = await fetch(`${API_URL}/dishes?ristorante=${restaurantId}`, {
      headers: getAuthHeaders()
    });

    const data = await response.json();

    if (data.success) {
      if (data.data.length === 0) {
        container.innerHTML = '<p class="text-center">Nessun piatto nel menu. Aggiungi il tuo primo piatto!</p>';
        return;
      }

      container.innerHTML = `
        <div class="grid">
          ${data.data.map(dish => `
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">${dish.nome}</h3>
                ${!dish.disponibile ? '<span class="badge badge-danger">Non disponibile</span>' : ''}
              </div>
              <div class="card-body">
                <p>${dish.descrizione}</p>
                <p><strong>Categoria:</strong> ${dish.categoria}</p>
                <p><strong>Prezzo:</strong> €${dish.prezzo.toFixed(2)}</p>
                ${dish.ingredienti && dish.ingredienti.length > 0 ? `
                  <p><strong>Ingredienti:</strong> ${dish.ingredienti.join(', ')}</p>
                ` : ''}
                ${dish.allergeni && dish.allergeni.length > 0 ? `
                  <p><strong>Allergeni:</strong> ${dish.allergeni.join(', ')}</p>
                ` : ''}
                <div style="margin: 1rem 0;">
                  ${dish.vegetariano ? '<span class="badge badge-success">Vegetariano</span>' : ''}
                  ${dish.vegano ? '<span class="badge badge-success">Vegano</span>' : ''}
                </div>
                <div style="display: flex; gap: 0.5rem;">
                  <button class="btn btn-secondary" onclick="editDish('${dish._id}')">Modifica</button>
                  <button class="btn" style="background: var(--danger-color); color: white;" 
                          onclick="deleteDish('${dish._id}', '${dish.nome}')">Elimina</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
  } catch (error) {
    console.error('Errore:', error);
    container.innerHTML = '<p class="text-center">Errore nel caricamento dei piatti</p>';
  }
}

/**
 * Mostra il form per nuovo piatto
 */
function showDishForm() {
  isEditMode = false;
  currentDishId = null;
  document.getElementById('formTitle').textContent = 'Nuovo Piatto';
  document.getElementById('dishForm').reset();
  document.getElementById('disponibile').checked = true;
  document.getElementById('dishFormContainer').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Nascondi il form
 */
function hideDishForm() {
  document.getElementById('dishFormContainer').classList.add('hidden');
  document.getElementById('dishForm').reset();
  isEditMode = false;
  currentDishId = null;
}

/**
 * Modifica un piatto
 */
async function editDish(dishId) {
  try {
    const response = await fetch(`${API_URL}/dishes/${dishId}`, {
      headers: getAuthHeaders()
    });

    const data = await response.json();

    if (data.success) {
      const dish = data.data;
      
      isEditMode = true;
      currentDishId = dishId;
      
      document.getElementById('formTitle').textContent = 'Modifica Piatto';
      document.getElementById('nome').value = dish.nome;
      document.getElementById('descrizione').value = dish.descrizione;
      document.getElementById('categoria').value = dish.categoria;
      document.getElementById('prezzo').value = dish.prezzo;
      document.getElementById('ingredienti').value = dish.ingredienti ? dish.ingredienti.join(', ') : '';
      document.getElementById('vegetariano').checked = dish.vegetariano;
      document.getElementById('vegano').checked = dish.vegano;
      document.getElementById('disponibile').checked = dish.disponibile;
      
      // Seleziona allergeni
      const allergeniSelect = document.getElementById('allergeni');
      Array.from(allergeniSelect.options).forEach(option => {
        option.selected = dish.allergeni && dish.allergeni.includes(option.value);
      });
      
      document.getElementById('dishFormContainer').classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } catch (error) {
    console.error('Errore:', error);
    showAlert('Errore nel caricamento del piatto', 'error');
  }
}

/**
 * Elimina un piatto
 */
async function deleteDish(dishId, dishName) {
  if (!confirm(`Sei sicuro di voler eliminare "${dishName}"?`)) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/dishes/${dishId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    const data = await response.json();

    if (data.success) {
      showAlert('Piatto eliminato con successo!', 'success');
      await loadDishes();
    } else {
      showAlert(data.message || 'Errore nell\'eliminazione del piatto', 'error');
    }
  } catch (error) {
    console.error('Errore:', error);
    showAlert('Errore di connessione', 'error');
  }
}

/**
 * Gestisci il submit del form
 */
document.getElementById('dishForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Ottieni allergeni selezionati
  const allergeniSelect = document.getElementById('allergeni');
  const allergeni = Array.from(allergeniSelect.selectedOptions).map(opt => opt.value);

  // Ottieni ingredienti
  const ingredientiStr = document.getElementById('ingredienti').value;
  const ingredienti = ingredientiStr ? ingredientiStr.split(',').map(i => i.trim()).filter(i => i) : [];

  const formData = {
    nome: document.getElementById('nome').value,
    descrizione: document.getElementById('descrizione').value,
    ristorante: restaurantId,
    categoria: document.getElementById('categoria').value,
    prezzo: parseFloat(document.getElementById('prezzo').value),
    ingredienti,
    allergeni,
    vegetariano: document.getElementById('vegetariano').checked,
    vegano: document.getElementById('vegano').checked,
    disponibile: document.getElementById('disponibile').checked
  };

  try {
    const url = isEditMode 
      ? `${API_URL}/dishes/${currentDishId}`
      : `${API_URL}/dishes`;
    
    const method = isEditMode ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (data.success) {
      showAlert(
        isEditMode ? 'Piatto aggiornato con successo!' : 'Piatto creato con successo!',
        'success'
      );
      hideDishForm();
      await loadDishes();
    } else {
      showAlert(data.message || 'Errore nel salvataggio del piatto', 'error');
    }
  } catch (error) {
    console.error('Errore:', error);
    showAlert('Errore di connessione al server', 'error');
  }
});

// Inizializza la pagina
document.addEventListener('DOMContentLoaded', initPage);
