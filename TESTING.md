# Guida al Testing - Fast Food App

Questa guida fornisce istruzioni dettagliate per testare tutte le funzionalità dell'applicazione Fast Food App.

## Prerequisiti

1. **MongoDB in esecuzione**
   ```bash
   # Verifica che MongoDB sia in esecuzione
   mongo --version
   
   # Avvia MongoDB se necessario
   sudo systemctl start mongod   # Linux
   brew services start mongodb-community  # macOS
   ```

2. **Server avviato**
   ```bash
   npm start
   # oppure in modalità sviluppo
   npm run dev
   ```

3. **Variabili d'ambiente configurate**
   - Verifica che il file `.env` sia presente e configurato correttamente

## Test con Swagger UI

Il modo più semplice per testare le API è utilizzare l'interfaccia Swagger:

1. Avvia il server con `npm start`
2. Apri il browser su `http://localhost:5000/api-docs`
3. Esplora e testa gli endpoint direttamente dall'interfaccia

## Test con cURL o Postman

### 1. Registrazione Utente Ristoratore

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Mario",
    "cognome": "Rossi",
    "email": "mario.rossi@example.com",
    "password": "password123",
    "ruolo": "ristoratore",
    "telefono": "3331234567",
    "indirizzo": {
      "via": "Via Roma 1",
      "citta": "Milano",
      "cap": "20100"
    }
  }'
```

**Risposta attesa:**
```json
{
  "success": true,
  "message": "Registrazione completata con successo",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "nome": "Mario",
      "cognome": "Rossi",
      "email": "mario.rossi@example.com",
      "ruolo": "ristoratore"
    }
  }
}
```

**Salva il token JWT** per le successive richieste autenticate.

### 2. Login Utente

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mario.rossi@example.com",
    "password": "password123"
  }'
```

### 3. Creazione Ristorante

```bash
curl -X POST http://localhost:5000/api/restaurants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "nome": "Burger King Express",
    "descrizione": "I migliori burger della città",
    "indirizzo": {
      "via": "Corso Buenos Aires 15",
      "citta": "Milano",
      "cap": "20124"
    },
    "telefono": "0212345678",
    "email": "info@burgerking.com",
    "categoria": "Fast Food",
    "orari": {
      "lunedi": "10:00-22:00",
      "martedi": "10:00-22:00",
      "mercoledi": "10:00-22:00",
      "giovedi": "10:00-22:00",
      "venerdi": "10:00-23:00",
      "sabato": "10:00-23:00",
      "domenica": "11:00-22:00"
    }
  }'
```

**Salva l'ID del ristorante** dalla risposta per i test successivi.

### 4. Aggiunta Piatti al Menu

```bash
curl -X POST http://localhost:5000/api/dishes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "nome": "Whopper",
    "descrizione": "Il classico burger con carne alla griglia",
    "prezzo": 5.90,
    "categoria": "panino",
    "ristorante": "RESTAURANT_ID_HERE",
    "ingredienti": ["pane", "carne", "lattuga", "pomodoro", "cipolla", "maionese"],
    "allergeni": ["glutine", "uova"],
    "vegetariano": false,
    "vegano": false,
    "disponibile": true
  }'
```

```bash
curl -X POST http://localhost:5000/api/dishes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "nome": "Veggie Burger",
    "descrizione": "Burger vegetariano con verdure grigliate",
    "prezzo": 4.90,
    "categoria": "panino",
    "ristorante": "RESTAURANT_ID_HERE",
    "ingredienti": ["pane", "verdure grigliate", "lattuga", "pomodoro"],
    "allergeni": ["glutine"],
    "vegetariano": true,
    "vegano": true,
    "disponibile": true
  }'
```

### 5. Visualizzazione Ristoranti

```bash
# Tutti i ristoranti
curl http://localhost:5000/api/restaurants

# Ristoranti per città
curl http://localhost:5000/api/restaurants?citta=Milano

# Dettaglio ristorante specifico
curl http://localhost:5000/api/restaurants/RESTAURANT_ID_HERE
```

### 6. Visualizzazione Piatti

```bash
# Tutti i piatti disponibili
curl http://localhost:5000/api/dishes

# Piatti di un ristorante
curl http://localhost:5000/api/dishes/restaurant/RESTAURANT_ID_HERE

# Piatti vegetariani
curl http://localhost:5000/api/dishes?vegetariano=true

# Piatti per categoria
curl http://localhost:5000/api/dishes?categoria=panino
```

### 7. Registrazione Cliente

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Giulia",
    "cognome": "Bianchi",
    "email": "giulia.bianchi@example.com",
    "password": "password123",
    "ruolo": "cliente",
    "telefono": "3339876543",
    "indirizzo": {
      "via": "Via Garibaldi 42",
      "citta": "Milano",
      "cap": "20121"
    }
  }'
```

**Salva il token del cliente** per creare ordini.

### 8. Creazione Ordine

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer CLIENT_TOKEN_HERE" \
  -d '{
    "ristorante": "RESTAURANT_ID_HERE",
    "piatti": [
      {
        "piatto": "DISH_ID_1",
        "quantita": 2
      },
      {
        "piatto": "DISH_ID_2",
        "quantita": 1
      }
    ],
    "modalita": "consegna",
    "indirizzo": {
      "via": "Via Garibaldi 42",
      "citta": "Milano",
      "cap": "20121"
    },
    "note": "Suonare al citofono"
  }'
```

**Salva l'ID dell'ordine** dalla risposta.

### 9. Visualizzazione Ordini

```bash
# Come cliente - vedi i tuoi ordini
curl http://localhost:5000/api/orders \
  -H "Authorization: Bearer CLIENT_TOKEN_HERE"

# Come ristoratore - vedi ordini dei tuoi ristoranti
curl http://localhost:5000/api/orders \
  -H "Authorization: Bearer RESTAURANT_TOKEN_HERE"

# Dettaglio ordine specifico
curl http://localhost:5000/api/orders/ORDER_ID_HERE \
  -H "Authorization: Bearer TOKEN_HERE"
```

### 10. Aggiornamento Stato Ordine (Ristoratore)

```bash
curl -X PUT http://localhost:5000/api/orders/ORDER_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer RESTAURANT_TOKEN_HERE" \
  -d '{
    "stato": "in preparazione"
  }'
```

Stati possibili:
- `ordinato` (default)
- `in preparazione`
- `pronto`
- `in consegna`
- `consegnato`
- `completato`
- `annullato`

### 11. Gestione Profilo Utente

```bash
# Visualizza profilo
curl http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Aggiorna profilo
curl -X PUT http://localhost:5000/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "telefono": "3331111111",
    "indirizzo": {
      "via": "Via Nuova 1",
      "citta": "Milano",
      "cap": "20100"
    }
  }'

# Cambia password
curl -X PUT http://localhost:5000/api/users/password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "newpassword456"
  }'
```

## Test Frontend

### 1. Registrazione e Login
1. Apri `http://localhost:5000/html/register.html`
2. Registra un nuovo utente ristoratore
3. Verifica che il token venga salvato nel localStorage
4. Fai logout e riprova il login

### 2. Dashboard Ristoratore
1. Login come ristoratore
2. Vai alla dashboard ristorante
3. Crea un nuovo ristorante
4. Aggiungi piatti al menu
5. Verifica che i piatti appaiano nel menu

### 3. Esperienza Cliente
1. Registra un nuovo cliente
2. Naviga tra i ristoranti
3. Visualizza il menu di un ristorante
4. Aggiungi piatti al carrello
5. Completa un ordine
6. Visualizza lo stato dell'ordine nella dashboard

### 4. Gestione Ordini Ristoratore
1. Login come ristoratore
2. Visualizza gli ordini ricevuti
3. Aggiorna lo stato di un ordine
4. Verifica che il cliente veda l'aggiornamento

## Validazione e Errori

### Test Validazione Input

```bash
# Email non valida
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Test",
    "cognome": "User",
    "email": "invalid-email",
    "password": "password123",
    "ruolo": "cliente"
  }'
# Atteso: 400 Bad Request con errore di validazione

# Password troppo corta
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Test",
    "cognome": "User",
    "email": "test@example.com",
    "password": "12345",
    "ruolo": "cliente"
  }'
# Atteso: 400 Bad Request con errore di validazione
```

### Test Autorizzazione

```bash
# Tentativo di creare ristorante senza autenticazione
curl -X POST http://localhost:5000/api/restaurants \
  -H "Content-Type: application/json" \
  -d '{"nome": "Test"}'
# Atteso: 401 Unauthorized

# Tentativo di creare ristorante come cliente
curl -X POST http://localhost:5000/api/restaurants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer CLIENT_TOKEN" \
  -d '{"nome": "Test"}'
# Atteso: 403 Forbidden
```

## Checklist Testing Completo

- [ ] Registrazione utente ristoratore funziona
- [ ] Registrazione utente cliente funziona
- [ ] Login con credenziali corrette funziona
- [ ] Login con credenziali errate fallisce correttamente
- [ ] Token JWT viene generato e validato
- [ ] Ristoratore può creare ristoranti
- [ ] Cliente non può creare ristoranti
- [ ] Ristoratore può aggiungere piatti al proprio ristorante
- [ ] Ristoratore non può aggiungere piatti ad altri ristoranti
- [ ] I filtri sui piatti funzionano (vegetariano, categoria, allergeni)
- [ ] Cliente può creare ordini
- [ ] Ristoratore non può creare ordini
- [ ] Ristoratore può aggiornare stato ordini dei propri ristoranti
- [ ] Cliente può vedere i propri ordini
- [ ] Cliente può annullare ordini appena creati
- [ ] Le password sono hashate nel database
- [ ] Le validazioni input funzionano correttamente
- [ ] Gli errori restituiscono messaggi chiari
- [ ] Frontend salva e usa correttamente il token JWT
- [ ] Logout cancella il token dal localStorage

## Strumenti Consigliati

### Postman
1. Importa la collection da `lib/api/docs/swagger.yaml`
2. Configura le variabili d'ambiente (base_url, token)
3. Testa gli endpoint con interfaccia grafica

### MongoDB Compass
1. Connettiti a `mongodb://localhost:27017`
2. Visualizza le collezioni create
3. Verifica i dati inseriti
4. Controlla che le password siano hashate

### Browser DevTools
1. Apri le DevTools (F12)
2. Tab Network: monitora le richieste API
3. Tab Application → Local Storage: verifica il token JWT
4. Tab Console: controlla eventuali errori JavaScript

## Troubleshooting

### Server non si avvia
- Verifica che MongoDB sia in esecuzione
- Controlla che la porta 5000 sia libera
- Verifica che il file `.env` sia presente e configurato

### Errore di connessione al database
- Verifica che `MONGODB_URI` nel `.env` sia corretto
- Assicurati che MongoDB sia in esecuzione
- Prova la connessione con `mongo mongodb://localhost:27017`

### Token JWT non valido
- Il token potrebbe essere scaduto (default 24h)
- Effettua nuovamente il login per ottenere un nuovo token
- Verifica che `JWT_SECRET` sia lo stesso tra riavvii del server

### Errori 403 Forbidden
- Verifica di usare il token del ruolo corretto (cliente/ristoratore)
- Controlla di essere il proprietario della risorsa che stai modificando
