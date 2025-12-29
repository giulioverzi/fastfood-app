# Guida di Installazione e Setup - Fast Food App

## Prerequisiti

Prima di iniziare, assicurati di avere installato:
- **Node.js** (versione 14 o superiore) - [Download](https://nodejs.org/)
- **MongoDB** (versione 4.4 o superiore) - [Download](https://www.mongodb.com/try/download/community)
  - Oppure un account **MongoDB Atlas** (gratuito) - [Registrati](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)

## Installazione

### 1. Clona il Repository

```bash
git clone https://github.com/marcoportante/fastfood-app.git
cd fastfood-app
```

### 2. Installa le Dipendenze

```bash
npm install
```

Questo comando installerà tutte le dipendenze necessarie elencate in `package.json`:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- dotenv
- cors
- express-validator

### 3. Configura MongoDB

#### Opzione A: MongoDB Locale

1. Installa MongoDB Community Edition
2. Avvia il servizio MongoDB:
   
   **Su Windows:**
   ```
   net start MongoDB
   ```
   
   **Su macOS/Linux:**
   ```bash
   sudo systemctl start mongod
   # oppure
   brew services start mongodb-community
   ```

3. Verifica che MongoDB sia in esecuzione:
   ```bash
   mongo --eval "db.version()"
   ```

#### Opzione B: MongoDB Atlas (Cloud)

1. Crea un account gratuito su [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea un nuovo cluster (M0 gratuito)
3. Crea un database user con username e password
4. Configura l'accesso di rete (IP Whitelist):
   - Aggiungi `0.0.0.0/0` per accesso da qualsiasi IP (solo per sviluppo)
5. Ottieni la connection string:
   - Clicca su "Connect" → "Connect your application"
   - Copia la connection string (es: `mongodb+srv://username:password@cluster.mongodb.net/fastfood`)

### 4. Configura le Variabili d'Ambiente

1. Copia il file di esempio:
   ```bash
   cp .env.example .env
   ```

2. Modifica il file `.env` con un editor di testo:

   ```env
   # Per MongoDB Locale:
   MONGODB_URI=mongodb://localhost:27017/fastfood

   # Oppure per MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fastfood

   PORT=3000
   NODE_ENV=development

   # Genera una chiave segreta sicura (esempio con OpenSSL):
   # openssl rand -base64 32
   JWT_SECRET=your_secure_random_jwt_secret_key_here

   JWT_EXPIRE=7d
   ```

### 5. Avvia l'Applicazione

```bash
npm start
```

L'applicazione sarà disponibile su: **http://localhost:3000**

Per lo sviluppo con auto-reload:
```bash
npm run dev
```

## Primo Utilizzo

### 1. Accedi all'Applicazione

Apri il browser e vai su: http://localhost:3000

### 2. Crea un Account Ristoratore

1. Clicca su "Registrati"
2. Compila il form:
   - Nome e Cognome
   - Email (es: `ristoratore@example.com`)
   - Password (almeno 6 caratteri)
   - **Seleziona "Ristoratore" come tipo di account**
   - Opzionale: telefono e indirizzo
3. Clicca "Registrati"
4. Verrai reindirizzato alla Dashboard

### 3. Crea un Ristorante

1. Dalla Dashboard, clicca su "+ Nuovo Ristorante"
2. Compila i dettagli:
   - Nome ristorante
   - Descrizione
   - Telefono
   - Indirizzo completo (via, città, CAP)
   - Orari di apertura
3. Clicca "Salva Ristorante"

### 4. Aggiungi Piatti al Menu

1. Dalla Dashboard, clicca su "Gestisci Menu" per il tuo ristorante
2. Clicca "+ Nuovo Piatto"
3. Compila i dettagli del piatto:
   - Nome
   - Descrizione
   - Categoria
   - Prezzo
   - Ingredienti (opzionale)
   - Allergeni (opzionale)
   - Opzioni vegetariano/vegano
4. Clicca "Salva Piatto"
5. Ripeti per aggiungere più piatti

### 5. Crea un Account Cliente

1. Logout (clicca sul nome in alto a destra)
2. Clicca su "Registrati"
3. Compila il form selezionando **"Cliente" come tipo di account**
4. Email diversa (es: `cliente@example.com`)

### 6. Effettua un Ordine

1. Come cliente, vai su "Menu"
2. Filtra i piatti per ristorante/categoria (opzionale)
3. Clicca "Aggiungi" sui piatti che vuoi ordinare
4. Clicca "Vai al Carrello"
5. Rivedi l'ordine e scegli modalità di consegna
6. Clicca "Conferma Ordine"

### 7. Gestisci l'Ordine (come Ristoratore)

1. Logout e ri-login come ristoratore
2. Vai alla Dashboard
3. Visualizza gli ordini ricevuti
4. Cambia lo stato dell'ordine:
   - In preparazione
   - Pronto
   - In consegna
   - Consegnato
   - Completato

## Struttura dell'Applicazione

```
fastfood-app/
├── backend/              # Logica backend
│   ├── models/          # Modelli Mongoose
│   ├── routes/          # Route API
│   ├── middleware/      # Middleware di autenticazione
│   └── API_DOCUMENTATION.md
├── config/              # Configurazione database
├── public/              # Frontend statico
│   ├── css/            # Stili CSS
│   ├── js/             # JavaScript frontend
│   └── *.html          # Pagine HTML
├── data/               # Dati di esempio
├── server.js           # Entry point
├── package.json        # Dipendenze
└── .env                # Configurazione ambiente
```

## Funzionalità Principali

### Per i Clienti
- ✅ Registrazione e login
- ✅ Navigazione menu con filtri (categoria, allergeni, vegetariano/vegano)
- ✅ Aggiunta piatti al carrello
- ✅ Creazione ordine con scelta ritiro/consegna
- ✅ Visualizzazione stato ordini in tempo reale
- ✅ Gestione profilo

### Per i Ristoratori
- ✅ Registrazione e login
- ✅ Creazione e gestione ristoranti
- ✅ Creazione e gestione menu (piatti)
- ✅ Visualizzazione ordini ricevuti
- ✅ Aggiornamento stato ordini
- ✅ Gestione profilo

## API REST

Le API sono documentate in `backend/API_DOCUMENTATION.md`

Endpoint base: `http://localhost:3000/api`

Principali endpoints:
- `POST /api/auth/register` - Registrazione
- `POST /api/auth/login` - Login
- `GET /api/restaurants` - Lista ristoranti
- `GET /api/dishes` - Lista piatti
- `POST /api/orders` - Crea ordine

## Risoluzione Problemi

### Errore: "Cannot connect to MongoDB"

**Soluzione:**
- Verifica che MongoDB sia in esecuzione
- Controlla la MONGODB_URI nel file `.env`
- Per Atlas, verifica username, password e IP whitelist

### Errore: "Port 3000 already in use"

**Soluzione:**
- Cambia la porta nel file `.env` (es: `PORT=3001`)
- Oppure termina il processo sulla porta 3000:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  
  # macOS/Linux
  lsof -ti:3000 | xargs kill
  ```

### Errore: "JWT malformed" o problemi di autenticazione

**Soluzione:**
- Svuota localStorage del browser (F12 → Application → Local Storage → Clear All)
- Genera una nuova JWT_SECRET nel file `.env`

### La pagina è bianca o non si carica

**Soluzione:**
- Apri la Console del browser (F12)
- Verifica errori JavaScript
- Assicurati che il server sia in esecuzione
- Controlla che i file siano nella cartella `public/`

## Testing

### Test Manuale

Segui i passaggi in "Primo Utilizzo" per testare tutte le funzionalità.

### Test con dati di esempio

Puoi usare i dati in `data/SAMPLE_DATA.md` per popolare il database.

## Sviluppo

### Script disponibili

- `npm start` - Avvia il server
- `npm run dev` - Avvia con nodemon (auto-reload)

### Aggiungere nuove funzionalità

1. Backend: aggiungi routes in `backend/routes/`
2. Frontend: aggiungi HTML in `public/` e JS in `public/js/`
3. Documenta le nuove API in `backend/API_DOCUMENTATION.md`

## Sicurezza

⚠️ **Importante per la produzione:**

1. Cambia `JWT_SECRET` con una chiave sicura e complessa
2. Usa HTTPS
3. Configura CORS appropriatamente
4. Limita IP whitelist su MongoDB
5. Implementa rate limiting
6. Valida tutti gli input
7. Non committare `.env` nel repository

## Supporto

Per problemi o domande:
- Consulta la documentazione API in `backend/API_DOCUMENTATION.md`
- Leggi il README principale
- Controlla i commenti nel codice

## Licenza

MIT License - vedi file LICENSE per dettagli
