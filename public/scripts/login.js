/**
 * login.js - Script per la pagina di login
 * Gestisce il form di login e l'autenticazione utente
 */

// Inizializza la pagina di login
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

  // Gestione submit del form di login
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
});

/**
 * Gestisce il submit del form di login
 * @param {Event} e - L'evento di submit
 */
async function handleLogin(e) {
  e.preventDefault();

  const formData = {
    email: document.getElementById('email').value,
    password: document.getElementById('password').value
  };

  try {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(formData)
    });

    if (response.success) {
      // Salva token e dati utente
      saveAuthData(response.data.token, response.data);

      showAlert('Login effettuato con successo! Reindirizzamento...', 'success');
      
      // Redirect dopo 1 secondo alla dashboard appropriata
      setTimeout(() => {
        const dashboardUrl = response.data.ruolo === 'ristoratore' 
          ? '/dashboard-restaurant.html' 
          : '/dashboard-customer.html';
        window.location.href = dashboardUrl;
      }, 1000);
    } else {
      showAlert(response.message || 'Credenziali non valide', 'error');
    }
  } catch (error) {
    console.error('Errore login:', error);
    showAlert(error.message || 'Errore di connessione al server', 'error');
  }
}

