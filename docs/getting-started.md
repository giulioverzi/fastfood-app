# Guida Introduttiva - Fast Food App

## Prerequisiti

Prima di iniziare, assicurati di avere installato:

- **Node.js** (versione 14 o superiore)
- **MongoDB** (versione 4.4 o superiore)
- **npm** (incluso con Node.js)

## Installazione Rapida

### 1. Clona il Repository

```bash
git clone https://github.com/marcoportante/fastfood-app.git
cd fastfood-app
```

### 2. Installa le Dipendenze

```bash
npm install
```

### 3. Configura le Variabili d'Ambiente

Crea un file `.env` nella root del progetto copiando `.env.example`:

```bash
cp .env.example .env
```

Modifica il file `.env` con le tue configurazioni:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/fastfood-app

# JWT
JWT_SECRET=il_tuo_secret_molto_sicuro_qui

# Server
PORT=3000
NODE_ENV=development
```

### 4. Avvia MongoDB

Assicurati che MongoDB sia in esecuzione:

```bash
# Su Linux/Mac
sudo systemctl start mongodb

# Su Mac con Homebrew
brew services start mongodb-community

# Oppure usa MongoDB Atlas (cloud)
# Aggiorna MONGODB_URI nel file .env con la connection string di Atlas
```

### 5. (Opzionale) Popola il Database con Dati di Esempio

```bash
node seed-data.js
```

Questo script creerà:
- Utenti di esempio (clienti e ristoratori)
- Ristoranti di esempio
- Menu con piatti
- Ordini di prova

### 6. Avvia l'Applicazione

```bash
# Modalità produzione
npm start

# Modalità sviluppo (con auto-reload)
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:3000`

## Verifica dell'Installazione

### Test del Server

Apri il browser e naviga a:
- Homepage: `http://localhost:3000`
- Documentazione API: `http://localhost:3000/api-docs`

### Test delle API

Puoi testare le API usando:

1. **Swagger UI** (consigliato): `http://localhost:3000/api-docs`
2. **Postman** o **curl**

Esempio con curl:

```bash
# Test endpoint pubblico
curl http://localhost:3000/api/restaurants

# Registrazione utente
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Mario",
    "cognome": "Rossi",
    "email": "mario@example.com",
    "password": "Password123",
    "ruolo": "cliente"
  }'
```

## Primi Passi

### 1. Crea un Account Ristoratore

1. Vai su `http://localhost:3000/register.html`
2. Seleziona ruolo "Ristoratore"
3. Compila il form e registrati

### 2. Crea un Ristorante

1. Effettua il login con le credenziali del ristoratore
2. Vai alla dashboard ristoratore
3. Clicca su "Crea Ristorante"
4. Compila le informazioni richieste

### 3. Aggiungi Piatti al Menu

1. Dalla dashboard ristoratore
2. Nella sezione "Gestione Menu"
3. Clicca su "Aggiungi Piatto"
4. Inserisci nome, descrizione, prezzo, categoria, allergeni, ecc.

### 4. Crea un Account Cliente

1. Registrati come "Cliente"
2. Esplora i ristoranti disponibili
3. Visualizza i menu e aggiungi piatti al carrello

### 5. Effettua un Ordine

1. Aggiungi piatti al carrello
2. Vai al checkout
3. Scegli modalità (ritiro o consegna)
4. Conferma l'ordine

## Script Disponibili

```bash
# Avvia il server
npm start

# Avvia in modalità sviluppo
npm run dev

# Popola il database con dati di esempio
node seed-data.js

# Test del server
node test-server.js
```

## Struttura delle Cartelle

```
fastfood-app/
├── backend/              # Logica backend
│   ├── models/          # Modelli Mongoose
│   ├── routes/          # Route API REST
│   └── middleware/      # Middleware Express
├── lib/                 # Librerie e servizi
│   ├── users/          # Servizi gestione utenti
│   ├── restaurants/    # Servizi gestione ristoranti
│   ├── orders/         # Servizi gestione ordini
│   ├── dishes/         # Servizi gestione piatti
│   └── utils/          # Utility condivise
├── config/              # Configurazioni
├── public/              # Frontend (HTML, CSS, JS)
├── docs/               # Documentazione
├── data/               # Dati e risorse
└── server.js           # Entry point
```

## Risoluzione Problemi

### MongoDB non si connette

**Problema**: Errore di connessione a MongoDB

**Soluzione**:
1. Verifica che MongoDB sia in esecuzione
2. Controlla che la MONGODB_URI nel file .env sia corretta
3. Se usi MongoDB Atlas, verifica che il tuo IP sia nella whitelist

### Porta 3000 già in uso

**Problema**: `Error: listen EADDRINUSE: address already in use :::3000`

**Soluzione**:
1. Cambia la porta nel file .env: `PORT=3001`
2. Oppure termina il processo che sta usando la porta 3000:

```bash
# Su Linux/Mac
lsof -ti:3000 | xargs kill

# Su Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Errori di autenticazione JWT

**Problema**: Token non valido o scaduto

**Soluzione**:
1. Effettua nuovamente il login
2. Verifica che JWT_SECRET nel .env sia impostato
3. Cancella il localStorage del browser e riprova

## Supporto

Per problemi o domande:
- Consulta la [Documentazione API](./api.md)
- Leggi l'[Architettura](./architecture.md)
- Crea una issue su GitHub

## Prossimi Passi

- Leggi la [Documentazione API](./api.md) per capire tutti gli endpoint disponibili
- Consulta l'[Architettura](./architecture.md) per comprendere la struttura del progetto
- Esplora il codice sorgente per personalizzazioni
