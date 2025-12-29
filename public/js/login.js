/**
 * Script per la pagina di login
 * @module public/js/login
 */

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    email: document.getElementById('email').value,
    password: document.getElementById('password').value
  };

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
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

      showAlert('Login effettuato con successo!', 'success');
      
      // Redirect dopo 1 secondo
      setTimeout(() => {
        window.location.href = '/dashboard.html';
      }, 1000);
    } else {
      showAlert(data.message || 'Credenziali non valide', 'error');
    }
  } catch (error) {
    console.error('Errore:', error);
    showAlert('Errore di connessione al server', 'error');
  }
});
