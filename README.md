# Fast Food App

Applicazione web full-stack per la gestione di ordini in un fast food con backend Node.js/Express e database MongoDB.

## Descrizione

Fast Food App è un'applicazione full-stack completa che permette ai clienti di ordinare cibo online e ai ristoratori di gestire ristoranti, menu e ordini. L'applicazione implementa un'architettura client-server con API REST, autenticazione JWT e database MongoDB per la persistenza dei dati.

## Obiettivi del Progetto

- **Architettura Full-Stack**: Backend Node.js/Express con frontend JavaScript moderno
- **API REST**: Endpoint ben strutturati seguendo le best practices REST
- **Sicurezza**: Autenticazione JWT e hash password con bcrypt
- **Database NoSQL**: MongoDB con Mongoose ODM
- **Manutenibilità**: Codice modulare, ben documentato e facile da mantenere
- **User Experience**: Interfaccia intuitiva e responsive per tutti i dispositivi

## Tecnologie Utilizzate

### Backend
- **Node.js** - Runtime JavaScript lato server
- **Express.js** - Framework web minimalista
- **MongoDB** - Database NoSQL orientato ai documenti
- **Mongoose** - ODM per MongoDB
- **JWT** - Autenticazione stateless con JSON Web Tokens
- **bcryptjs** - Hashing sicuro delle password
- **express-validator** - Validazione e sanitizzazione input
- **Swagger/OpenAPI** - Documentazione API interattiva

### Frontend
- **HTML5** - Markup semantico e accessibile
- **CSS3** - Styling moderno con variabili CSS, flexbox e grid
- **JavaScript ES6+** - Vanilla JavaScript moderno e modularizzato
- **Font Awesome** - Libreria di icone

### DevOps & Tools
- **Git** - Controllo di versione
- **npm** - Gestione dipendenze
- **nodemon** - Auto-restart server in sviluppo
- **dotenv** - Gestione variabili ambiente

## Struttura del Progetto

```
fastfood-app/
├── backend/                    # Backend Node.js/Express
│   ├── middleware/            # Middleware personalizzati
│   │   ├── auth.js           # Autenticazione JWT e autorizzazione
│   │   ├── validation.js     # Validazione input
│   │   └── errorHandler.js   # Gestione errori centralizzata
│   ├── models/                # Modelli Mongoose
│   │   ├── User.js           # Modello utente
│   │   ├── Restaurant.js     # Modello ristorante
│   │   ├── Dish.js           # Modello piatto
│   │   └── Order.js          # Modello ordine
│   └── routes/                # Route API REST
│       ├── auth.js           # Autenticazione e registrazione
│       ├── restaurants.js    # CRUD ristoranti
│       ├── dishes.js         # CRUD piatti
│       ├── orders.js         # CRUD ordini
│       └── users.js          # Gestione profilo utente
├── docs/                      # Documentazione del progetto
│   └── assets/               # Risorse documentazione
│       └── Relazione.md      # Relazione tecnica del progetto
├── lib/                       # Librerie e API
│   └── api/
│       └── docs/             # Documentazione API
│           └── swagger.yaml  # Specifica OpenAPI/Swagger
├── public/                    # Applicazione frontend
│   ├── Css/                  # Fogli di stile
│   │   ├── style.css         # Stili principali
│   │   └── layout.css        # Layout e componenti
│   ├── html/                 # Pagine HTML
│   │   ├── index.html        # Homepage
│   │   ├── login.html        # Pagina login
│   │   ├── register.html     # Pagina registrazione
│   │   ├── menu.html         # Lista ristoranti
│   │   ├── restaurant.html   # Dettaglio ristorante
│   │   ├── checkout.html     # Checkout ordine
│   │   ├── dashboard-customer.html     # Dashboard cliente
│   │   └── dashboard-restaurant.html   # Dashboard ristoratore
│   ├── images/               # Immagini statiche
│   └── scripts/              # JavaScript modularizzato
│       ├── common.js         # Funzioni condivise
│       ├── app.js            # Homepage
│       ├── login.js          # Gestione login
│       ├── register.js       # Gestione registrazione
│       ├── menu.js           # Visualizzazione menu
│       ├── checkout.js       # Gestione checkout
│       ├── customer.js       # Dashboard cliente
│       ├── restaurant.js     # Visualizzazione ristorante
│       └── restaurant-dashboard.js  # Dashboard ristoratore
├── server.js                  # Entry point dell'applicazione
├── package.json              # Dipendenze e scripts npm
├── .env.example              # Template variabili ambiente
├── .gitignore               # File ignorati da git
├── LICENSE                   # Licenza MIT
└── README.md                # Questo file
```

## Avvio Rapido

Per istruzioni dettagliate sull'installazione e configurazione, consulta la [Relazione Tecnica](./docs/assets/Relazione.md).

### Prerequisiti

- **Node.js** v14 o superiore
- **MongoDB** installato e in esecuzione localmente o connessione a MongoDB Atlas
- **npm** o **yarn** per la gestione delle dipendenze

### Installazione e Configurazione

1. **Clona il repository**
   ```bash
   git clone https://github.com/marcoportante/fastfood-app.git
   cd fastfood-app
   ```

2. **Installa le dipendenze**
   ```bash
   npm install
   ```

3. **Configura le variabili d'ambiente**
   
   Copia il file `.env.example` in `.env` e configura le variabili:
   ```bash
   cp .env.example .env
   ```
   
   Modifica il file `.env` con i tuoi valori:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/fastfood-app
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRE=24h
   CLIENT_URL=http://localhost:5000
   ```

4. **Avvia MongoDB**
   
   Assicurati che MongoDB sia in esecuzione sulla tua macchina:
   ```bash
   # Su macOS con Homebrew
   brew services start mongodb-community
   
   # Su Linux con systemd
   sudo systemctl start mongod
   
   # O avvia manualmente
   mongod
   ```

5. **Avvia il server**
   ```bash
   # Modalità produzione
   npm start
   
   # Modalità sviluppo con auto-restart
   npm run dev
   ```

6. **Accedi all'applicazione**
   - **Frontend**: Apri il browser su `http://localhost:5000`
   - **API**: Le API sono disponibili su `http://localhost:5000/api`
   - **Documentazione API**: Swagger UI disponibile su `http://localhost:5000/api-docs`

### Scripts NPM Disponibili

- `npm start` - Avvia il server in modalità produzione
- `npm run dev` - Avvia il server in modalità sviluppo con nodemon (auto-restart)
- `npm run frontend` - Avvia solo il frontend statico con http-server (deprecato, usare npm start)

## Funzionalità

### Autenticazione e Autorizzazione
- Registrazione utenti con ruoli differenziati (Cliente/Ristoratore)
- Login con JWT (JSON Web Token)
- Protezione route basata su autenticazione e ruoli
- Hash password sicuro con bcrypt

### Gestione Utenti
- Visualizzazione e modifica profilo
- Cambio password
- Eliminazione account
- Eliminazione account

### Gestione Ristoranti (Ristoratori)
- Creazione ristorante con informazioni dettagliate
- Aggiornamento informazioni ristorante
- Visualizzazione ristoranti
- Eliminazione ristorante

### Gestione Menu (Ristoratori)
- Aggiunta piatti con ingredienti, allergeni, prezzi
- Categorizzazione piatti
- Indicazione vegetariano/vegano
- Gestione disponibilità piatti
- Modifica ed eliminazione piatti

### Gestione Ordini
- Creazione ordine da parte dei clienti
- Selezione piatti e quantità
- Scelta modalità (ritiro/consegna)
- Visualizzazione stato ordine
- Aggiornamento stato ordine (ristoratori)
- Stati: ordinato, in preparazione, pronto, in consegna, consegnato, completato, annullato

### Ricerca e Filtri
- Filtro per ristorante
- Filtro per categoria
- Filtro per allergeni
- Filtro vegetariano/vegano

## Documentazione

### Relazione Tecnica
La documentazione completa del progetto è disponibile nella [Relazione Tecnica](./docs/assets/Relazione.md), che include:
- Analisi dei requisiti
- Architettura del sistema a tre livelli
- Modello dei dati MongoDB
- Dettagli implementazione backend e frontend
- Sicurezza e autenticazione
- Testing e validazione

### API Documentation
- **Swagger UI**: Documentazione interattiva disponibile su `/api-docs` quando il server è in esecuzione
- **OpenAPI Spec**: File `lib/api/docs/swagger.yaml` con la specifica completa delle API

## API Endpoints

### Autenticazione
- `POST /api/auth/register` - Registrazione nuovo utente
- `POST /api/auth/login` - Login utente
- `GET /api/auth/verify` - Verifica token JWT

### Ristoranti
- `GET /api/restaurants` - Lista tutti i ristoranti
- `GET /api/restaurants/:id` - Dettagli ristorante
- `POST /api/restaurants` - Crea ristorante (solo ristoratori)
- `PUT /api/restaurants/:id` - Aggiorna ristorante (solo proprietario)
- `DELETE /api/restaurants/:id` - Elimina ristorante (solo proprietario)

### Piatti
- `GET /api/dishes` - Lista piatti con filtri
- `GET /api/dishes/restaurant/:restaurantId` - Piatti di un ristorante
- `GET /api/dishes/:id` - Dettagli piatto
- `POST /api/dishes` - Crea piatto (solo ristoratori)
- `PUT /api/dishes/:id` - Aggiorna piatto (solo proprietario)
- `DELETE /api/dishes/:id` - Elimina piatto (solo proprietario)

### Ordini
- `GET /api/orders` - Lista ordini utente
- `GET /api/orders/:id` - Dettagli ordine
- `POST /api/orders` - Crea ordine (solo clienti)
- `PUT /api/orders/:id` - Aggiorna stato ordine (ristoratori)
- `GET /api/orders/restaurant/:restaurantId` - Ordini di un ristorante

### Utenti
- `GET /api/users/profile` - Profilo utente
- `PUT /api/users/profile` - Aggiorna profilo
- `PUT /api/users/password` - Cambia password
- `DELETE /api/users/account` - Elimina account

## Architettura

### Pattern MVC
L'applicazione segue il pattern Model-View-Controller:
- **Model**: Modelli Mongoose in `backend/models/`
- **View**: Pagine HTML in `public/html/`
- **Controller**: Route Express in `backend/routes/`

### Autenticazione JWT
- Token generato al login
- Token verificato tramite middleware `protect`
- Autorizzazione basata su ruoli tramite middleware `authorize`
- Token salvato nel localStorage del client

### Database MongoDB
- Quattro collezioni principali: Users, Restaurants, Dishes, Orders
- Relazioni tramite ObjectId references
- Indici per ottimizzare le query
- Validazione schema con Mongoose

## Persistenza Dati

L'applicazione utilizza **MongoDB** per la persistenza dei dati:
- **Users**: Informazioni utenti con password hashate
- **Restaurants**: Dati ristoranti con riferimento al proprietario
- **Dishes**: Piatti del menu con allergeni e categorie
- **Orders**: Ordini con riferimenti a cliente, ristorante e piatti

Il **JWT token** viene salvato nel localStorage del browser per mantenere la sessione utente.

## Testing

### Test delle API con Swagger
1. Avvia il server con `npm start`
2. Apri `http://localhost:5000/api-docs`
3. Testa gli endpoint direttamente dall'interfaccia Swagger

### Test Manuale Completo
1. **Registra un account ristoratore** via POST `/api/auth/register`
2. **Crea un ristorante** via POST `/api/restaurants`
3. **Aggiungi piatti al menu** via POST `/api/dishes`
4. **Registra un account cliente**
5. **Crea un ordine** via POST `/api/orders`
6. **Come ristoratore, aggiorna lo stato dell'ordine** via PUT `/api/orders/:id`

## Codice e Commenti

Il codice è completamente documentato in italiano con:
- Commenti JSDoc per funzioni e moduli
- Descrizione dettagliata dei parametri
- Esempi di utilizzo dove necessario
- Spiegazione della logica complessa

## Autore

**Marco Portante** - [GitHub](https://github.com/marcoportante)

Progetto sviluppato per l'esame di Programmazione Web e Mobile

## Licenza

MIT License - Vedi file LICENSE per dettagli

## Link Utili

- [Repository GitHub](https://github.com/marcoportante/fastfood-app)
- [Relazione Tecnica](./docs/assets/Relazione.md)
- [Documentazione API](http://localhost:5000/api-docs) (quando il server è in esecuzione)

---

## Note Importanti

### Sicurezza
- Le password sono hashate con bcrypt (salt rounds: 10)
- I token JWT hanno una scadenza configurabile (default 24h)
- Le route protette richiedono autenticazione
- L'autorizzazione è basata sui ruoli (cliente/ristoratore)
- In produzione, usa HTTPS e un secret JWT robusto

### Database
- Assicurati che MongoDB sia in esecuzione prima di avviare il server
- Il database viene creato automaticamente alla prima connessione
- Per reset del database, elimina la collection da MongoDB Compass o shell

### Ambiente di Sviluppo
- Usa `npm run dev` per sviluppo con auto-restart
- Le variabili d'ambiente devono essere configurate nel file `.env`
- Non committare mai il file `.env` nel repository
