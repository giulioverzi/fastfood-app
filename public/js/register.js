/**
 * Script per la pagina di registrazione
 * @module public/js/register
 */

document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    nome: document.getElementById('nome').value,
    cognome: document.getElementById('cognome').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    ruolo: document.getElementById('ruolo').value,
    telefono: document.getElementById('telefono').value,
    indirizzo: {
      via: document.getElementById('via').value,
      citta: document.getElementById('citta').value,
      cap: document.getElementById('cap').value
    }
  };

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (data.success) {
      // Salva token e dati utente
      setToken(data.data.token);
      setUser(data.data);

      showAlert('Registrazione completata con successo!', 'success');
      
      // Redirect dopo 1 secondo
      setTimeout(() => {
        window.location.href = '/dashboard.html';
      }, 1000);
    } else {
      showAlert(data.message || 'Errore durante la registrazione', 'error');
    }
  } catch (error) {
    console.error('Errore:', error);
    showAlert('Errore di connessione al server', 'error');
  }
});
