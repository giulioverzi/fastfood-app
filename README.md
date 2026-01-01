# Fast Food App

Applicazione web per la gestione di ordini in un fast food, sviluppata per l'esame di Programmazione Web e Mobile.

## 📋 Descrizione

Fast Food App è un'applicazione completa che permette ai clienti di ordinare cibo online e ai ristoratori di gestire ristoranti, menu e ordini. L'applicazione offre un'interfaccia intuitiva e moderna con colori ispirati al mondo del fast food.

## 🚀 Tecnologie Utilizzate

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Database NoSQL
- **Mongoose** - ODM per MongoDB
- **JWT** - Autenticazione basata su token
- **bcryptjs** - Crittografia password

### Frontend
- **HTML5** - Markup semantico
- **CSS3** - Styling con variabili CSS e gradients
- **JavaScript** - Interattività lato client

## 📁 Struttura del Progetto

```
fastfood-app/
├── backend/
│   ├── models/          # Modelli Mongoose (User, Restaurant, Dish, Order)
│   ├── routes/          # Route API REST
│   ├── middleware/      # Middleware (autenticazione)
│   └── API_DOCUMENTATION.md  # Documentazione API
├── config/
│   └── database.js      # Configurazione MongoDB
├── public/              # File statici frontend
│   ├── css/
│   │   └── style.css    # Stili principali
│   ├── js/              # JavaScript frontend
│   ├── *.html           # Pagine HTML
│   └── images/          # Immagini
├── data/                # Dati e risorse
├── server.js            # Entry point del server
├── package.json         # Dipendenze e scripts
└── .env.example         # Esempio di configurazione ambiente
```

## ⚙️ Installazione

1. **Clone il repository**
   ```bash
   git clone https://github.com/marcoportante/fastfood-app.git
   cd fastfood-app
   ```

2. **Installa le dipendenze**
   ```bash
   npm install
   ```

3. **Configura le variabili d'ambiente**
   ```bash
   cp .env.example .env
   ```
   Modifica il file `.env` con le tue configurazioni:
   - `MONGODB_URI`: URI di connessione MongoDB
   - `JWT_SECRET`: Chiave segreta per JWT
   - `PORT`: Porta del server (default: 3000)

4. **Avvia MongoDB**
   Assicurati che MongoDB sia in esecuzione sulla tua macchina o usa MongoDB Atlas.

5. **Avvia l'applicazione**
   ```bash
   npm start
   ```
   L'applicazione sarà disponibile su `http://localhost:3000`

## 📱 Funzionalità

### Gestione Utenti
- ✅ Registrazione con ruolo (Cliente/Ristoratore)
- ✅ Login con JWT authentication
- ✅ Visualizzazione e modifica profilo
- ✅ Eliminazione account

### Gestione Ristoranti (Ristoratori)
- ✅ Creazione ristorante con informazioni dettagliate
- ✅ Aggiornamento informazioni ristorante
- ✅ Visualizzazione ristoranti
- ✅ Eliminazione ristorante

### Gestione Menu (Ristoratori)
- ✅ Aggiunta piatti con ingredienti, allergeni, prezzi
- ✅ Categorizzazione piatti
- ✅ Indicazione vegetariano/vegano
- ✅ Gestione disponibilità piatti
- ✅ Modifica ed eliminazione piatti

### Gestione Ordini
- ✅ Creazione ordine da parte dei clienti
- ✅ Selezione piatti e quantità
- ✅ Scelta modalità (ritiro/consegna)
- ✅ Visualizzazione stato ordine
- ✅ Aggiornamento stato ordine (ristoratori)
- ✅ Stati: ordinato, in preparazione, pronto, in consegna, consegnato, completato, annullato

### Ricerca e Filtri
- ✅ Filtro per ristorante
- ✅ Filtro per categoria
- ✅ Filtro per allergeni
- ✅ Filtro vegetariano/vegano

## 🎨 Design

L'interfaccia utilizza una palette di colori ispirata al mondo del fast food:
- **Rosso primario** (#E31837) - Colore principale
- **Giallo** (#FFC72C) - Accenti e call-to-action
- **Arancione** (#FF6B35) - Gradients e hover effects

Design responsive e mobile-friendly con breakpoint a 768px.

## 📚 API REST

Le API seguono i principi REST e sono documentate in `backend/API_DOCUMENTATION.md`.

### Documentazione Interattiva Swagger

**Nuova funzionalità!** La documentazione API interattiva è disponibile tramite Swagger UI:

- **URL Locale:** `http://localhost:3000/api-docs`
- **Specifiche OpenAPI:** `http://localhost:3000/api-docs.json`

Swagger UI permette di:
- Esplorare tutti gli endpoint disponibili
- Vedere schemi di richiesta e risposta
- Testare le API direttamente dal browser
- Autenticarsi con JWT per testare endpoint protetti

Per maggiori informazioni, consulta [SWAGGER_GUIDE.md](./SWAGGER_GUIDE.md).

**Endpoint principali:**
- `POST /api/auth/register` - Registrazione
- `POST /api/auth/login` - Login
- `GET /api/users/me` - Profilo utente
- `GET /api/restaurants` - Lista ristoranti
- `GET /api/dishes` - Lista piatti (con filtri)
- `POST /api/orders` - Crea ordine
- `GET /api/orders` - Lista ordini

Autenticazione tramite Bearer Token JWT.

## 🧪 Testing

Per testare l'applicazione:

1. **Crea un account ristoratore**
2. **Crea un ristorante**
3. **Aggiungi piatti al menu**
4. **Crea un account cliente**
5. **Effettua un ordine**
6. **Come ristoratore, gestisci l'ordine**

## 📖 Documentazione Codice

Il codice è ben documentato con commenti JSDoc per facilitare la comprensione e la manutenzione.

## 👥 Autore

**Marco Portante** - Progetto per l'esame di Programmazione Web e Mobile

## 📄 Licenza

MIT License - Vedi file LICENSE per dettagli
