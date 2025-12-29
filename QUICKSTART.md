# Quick Start Guide - Fast Food App

Guida rapida per avviare l'applicazione in 5 minuti.

## Prerequisiti Veloci

```bash
# Verifica Node.js (v14+)
node --version

# Verifica npm
npm --version

# Verifica MongoDB (opzionale se usi Atlas)
mongo --version
```

## Setup Rapido

### 1. Clone e Install (2 minuti)

```bash
git clone https://github.com/marcoportante/fastfood-app.git
cd fastfood-app
npm install
```

### 2. Configura Database (1 minuto)

**Opzione A - MongoDB Locale:**
```bash
# Copia configurazione
cp .env.example .env

# .env è già configurato per MongoDB locale
# MONGODB_URI=mongodb://localhost:27017/fastfood
```

**Opzione B - MongoDB Atlas (Gratuito):**
```bash
# Copia configurazione
cp .env.example .env

# Modifica .env con la tua connection string:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fastfood
```

### 3. Avvia (30 secondi)

```bash
npm start
```

🎉 Apri: **http://localhost:3000**

## Test Rapido (2 minuti)

### Scenario: Crea ordine completo

1. **Registra Ristoratore**
   - Vai a http://localhost:3000/register.html
   - Email: `chef@test.com`
   - Password: `password123`
   - Tipo: **Ristoratore**
   - Registrati

2. **Crea Ristorante**
   - Click "+ Nuovo Ristorante"
   - Nome: `Burger House`
   - Descrizione: `Il miglior burger della città`
   - Via: `Via Roma 1`
   - Città: `Milano`
   - CAP: `20100`
   - Telefono: `02123456`
   - Salva

3. **Aggiungi Piatti**
   - Click "Gestisci Menu"
   - Click "+ Nuovo Piatto"
   
   **Piatto 1:**
   - Nome: `Hamburger Classic`
   - Descrizione: `Burger con carne, insalata e salse`
   - Categoria: `panini`
   - Prezzo: `8.50`
   - Salva
   
   **Piatto 2:**
   - Nome: `Coca Cola`
   - Descrizione: `Bibita fresca`
   - Categoria: `bevande`
   - Prezzo: `2.50`
   - Salva

4. **Logout e Registra Cliente**
   - Click "Logout" in alto
   - Vai a http://localhost:3000/register.html
   - Email: `mario@test.com`
   - Password: `password123`
   - Tipo: **Cliente**
   - Registrati

5. **Ordina**
   - Click "Menu" in alto
   - Filtra per "Burger House"
   - Click "Aggiungi" su entrambi i piatti
   - Click "Vai al Carrello"
   - Scegli "Ritiro"
   - Click "Conferma Ordine"

6. **Gestisci Ordine (come Ristoratore)**
   - Logout
   - Login come `chef@test.com`
   - Vedi ordine in Dashboard
   - Cambia stato → "In preparazione"
   - Cambia stato → "Pronto"
   - Cambia stato → "Completato"

✅ **Test Completato!** Hai creato un ordine completo end-to-end.

## Comandi Utili

```bash
# Avvia server (normale)
npm start

# Avvia con auto-reload (development)
npm run dev

# Verifica sintassi
node -c server.js

# Pulisci e reinstalla dipendenze
rm -rf node_modules package-lock.json
npm install
```

## Accesso Rapido

Dopo l'avvio, accedi a:

- **Home**: http://localhost:3000
- **Menu**: http://localhost:3000/menu.html
- **Login**: http://localhost:3000/login.html
- **Registrazione**: http://localhost:3000/register.html
- **Dashboard**: http://localhost:3000/dashboard.html

## Struttura Minima

```
fastfood-app/
├── server.js          ← Entry point
├── package.json       ← Dipendenze
├── .env              ← Configurazione
├── backend/          ← API REST
├── public/           ← Frontend
└── config/           ← Database
```

## Troubleshooting Rapido

### "Cannot connect to MongoDB"
```bash
# Verifica MongoDB sia avviato
mongo --eval "db.version()"

# O usa MongoDB Atlas (cloud gratuito)
```

### "Port 3000 already in use"
```bash
# Cambia porta in .env
PORT=3001
```

### "Pagina bianca"
```bash
# Verifica server sia avviato
# Apri Console browser (F12) per errori
# Controlla http://localhost:3000
```

### "JWT malformed"
```bash
# Svuota localStorage del browser
# F12 → Application → Local Storage → Clear
```

## Prossimi Passi

Dopo il Quick Start:

1. Leggi [INSTALLATION.md](INSTALLATION.md) per setup dettagliato
2. Consulta [ARCHITECTURE.md](ARCHITECTURE.md) per capire l'architettura
3. Esplora [backend/API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md) per le API
4. Usa [data/SAMPLE_DATA.md](data/SAMPLE_DATA.md) per più dati di test

## Supporto

- 📖 Documentazione completa: README.md
- 🏗️ Architettura: ARCHITECTURE.md
- 💻 Setup dettagliato: INSTALLATION.md
- 🔌 API Reference: backend/API_DOCUMENTATION.md

Buon divertimento con Fast Food App! 🍔
