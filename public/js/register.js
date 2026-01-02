/**
 * register.js - Script per la pagina di registrazione
 * Gestisce il form di registrazione e la creazione nuovo utente
 */

// Inizializza la pagina di registrazione
document.addEventListener('DOMContentLoaded', () => {
  // Se l'utente è già autenticato, reindirizza alla dashboard appropriata
  if (isAuthenticated()) {
    const user = getUserData();
    const dashboardUrl = user.ruolo === 'ristoratore' 
      ? '/dashboard-restaurant.html' 
      : '/dashboard-customer.html';
    window.location.href = dashboardUrl;
    return;
  }

  // Gestione cambio ruolo per mostrare/nascondere Partita IVA
  const ruoloSelect = document.getElementById('ruolo');
  const partitaIVAGroup = document.getElementById('partitaIVAGroup');
  const partitaIVAInput = document.getElementById('partitaIVA');

  ruoloSelect.addEventListener('change', (e) => {
    if (e.target.value === 'ristoratore') {
      partitaIVAGroup.style.display = 'block';
      partitaIVAInput.required = true;
    } else {
      partitaIVAGroup.style.display = 'none';
      partitaIVAInput.required = false;
      partitaIVAInput.value = '';
    }
  });

  // Gestione submit del form di registrazione
  document.getElementById('registerForm').addEventListener('submit', handleRegister);
});

/**
 * Gestisce il submit del form di registrazione
 * @param {Event} e - L'evento di submit
 */
async function handleRegister(e) {
  e.preventDefault();

  const ruolo = document.getElementById('ruolo').value;
  const formData = {
    nome: document.getElementById('nome').value,
    cognome: document.getElementById('cognome').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    ruolo: ruolo,
    telefono: document.getElementById('telefono').value,
    indirizzo: {
      via: document.getElementById('via').value,
      citta: document.getElementById('citta').value,
      cap: document.getElementById('cap').value
    }
  };

  // Aggiungi Partita IVA solo per ristoratori
  if (ruolo === 'ristoratore') {
    const partitaIVA = document.getElementById('partitaIVA').value;
    if (!partitaIVA || !/^\d{11}$/.test(partitaIVA)) {
      showAlert('La Partita IVA deve essere di 11 cifre', 'error');
      return;
    }
    formData.partitaIVA = partitaIVA;
  }

  try {
    const response = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(formData)
    });

    if (response.success) {
      // Salva token e dati utente
      saveAuthData(response.data.token, response.data);

      showAlert('Registrazione completata con successo! Reindirizzamento...', 'success');
      
      // Redirect dopo 1 secondo alla dashboard appropriata
      setTimeout(() => {
        const dashboardUrl = response.data.ruolo === 'ristoratore' 
          ? '/dashboard-restaurant.html' 
          : '/dashboard-customer.html';
        window.location.href = dashboardUrl;
      }, 1000);
    } else {
      showAlert(response.message || 'Errore durante la registrazione', 'error');
    }
  } catch (error) {
    console.error('Errore registrazione:', error);
    showAlert(error.message || 'Errore di connessione al server', 'error');
  }
}

