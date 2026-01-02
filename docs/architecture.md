# Architettura e Funzionalità - Fast Food App

## Panoramica

Fast Food App è un'applicazione web full-stack che permette ai clienti di ordinare cibo online e ai ristoratori di gestire ristoranti, menu e ordini. L'applicazione è costruita con un'architettura client-server tradizionale con API REST.

## Stack Tecnologico

### Backend
- **Runtime**: Node.js v14+
- **Framework Web**: Express.js 4.18
- **Database**: MongoDB (tramite Mongoose ODM)
- **Autenticazione**: JWT (JSON Web Tokens)
- **Sicurezza Password**: bcryptjs
- **Validazione**: express-validator
- **CORS**: abilitato per sviluppo

### Frontend
- **Markup**: HTML5 semantico
- **Stili**: CSS3 con variabili custom properties
- **Script**: JavaScript ES6+ vanilla (no framework)
- **Design**: Responsive (mobile-first approach)

## Architettura del Sistema

```
┌─────────────┐
│   Browser   │
│  (Frontend) │
└──────┬──────┘
       │ HTTP/REST
       ▼
┌─────────────┐
│   Express   │
│   Server    │
│  (Backend)  │
└──────┬──────┘
       │ Mongoose
       ▼
┌─────────────┐
│   MongoDB   │
│  (Database) │
└─────────────┘
```

## Modelli di Dati

### 1. User (Utente)
Gestisce sia clienti che ristoratori con un sistema di ruoli.

**Campi:**
- `nome`, `cognome`: String (required)
- `email`: String (unique, required, validated)
- `password`: String (hashed con bcrypt, required)
- `ruolo`: Enum ['cliente', 'ristoratore'] (default: 'cliente')
- `telefono`: String (optional)
- `indirizzo`: Object { via, citta, cap }
- `createdAt`: Date (auto)

**Metodi:**
- `matchPassword(password)`: Confronta password con hash

### 2. Restaurant (Ristorante)
Informazioni sui ristoranti gestiti dai ristoratori.

**Campi:**
- `nome`: String (unique, required)
- `descrizione`: String (max 500 chars, required)
- `proprietario`: ObjectId → User (required)
- `indirizzo`: Object { via, citta, cap, coordinate }
- `telefono`: String (required)
- `orariApertura`: String
- `immagine`: String (URL)
- `valutazione`: Number (0-5)
- `attivo`: Boolean (default: true)
- `createdAt`: Date (auto)

### 3. Dish (Piatto)
Piatti del menu per ciascun ristorante.

**Campi:**
- `nome`: String (required)
- `descrizione`: String (max 300 chars, required)
- `ristorante`: ObjectId → Restaurant (required)
- `categoria`: Enum [antipasti, primi, secondi, contorni, dessert, bevande, panini, pizze, insalate]
- `prezzo`: Number (min 0, required)
- `ingredienti`: Array[String]
- `allergeni`: Array[Enum] (14 allergeni principali)
- `immagine`: String (URL)
- `disponibile`: Boolean (default: true)
- `vegetariano`: Boolean (default: false)
- `vegano`: Boolean (default: false)
- `createdAt`: Date (auto)

**Indici:**
- Compound index su (ristorante, categoria)

### 4. Order (Ordine)
Ordini effettuati dai clienti.

**Campi:**
- `cliente`: ObjectId → User (required)
- `ristorante`: ObjectId → Restaurant (required)
- `piatti`: Array[Object] { piatto, quantita, prezzo, note }
- `totale`: Number (required, min 0)
- `stato`: Enum [ordinato, in_preparazione, pronto, in_consegna, consegnato, completato, annullato]
- `modalitaConsegna`: Enum [ritiro, consegna]
- `indirizzoConsegna`: Object { via, citta, cap }
- `note`: String (max 200 chars)
- `dataOrdine`: Date (auto)
- `dataCompletamento`: Date (optional)

**Indici:**
- Index su (cliente, dataOrdine) descending
- Index su (ristorante, dataOrdine) descending

## API REST Endpoints

### Autenticazione
```
POST /api/auth/register  - Registrazione nuovo utente
POST /api/auth/login     - Login utente (ritorna JWT token)
```

### Utenti (Protected)
```
GET    /api/users/me     - Ottieni profilo utente corrente
PUT    /api/users/me     - Aggiorna profilo
DELETE /api/users/me     - Elimina account
```

### Ristoranti
```
GET    /api/restaurants       - Lista tutti i ristoranti (Public)
GET    /api/restaurants/:id   - Dettagli ristorante (Public)
POST   /api/restaurants       - Crea ristorante (Ristoratore)
PUT    /api/restaurants/:id   - Aggiorna ristorante (Proprietario)
DELETE /api/restaurants/:id   - Elimina ristorante (Proprietario)
```

### Piatti
```
GET    /api/dishes           - Lista piatti con filtri (Public)
         ?ristorante=ID
         ?categoria=nome
         ?escludiAllergeni=glutine,latte
         ?vegetariano=true
         ?vegano=true
GET    /api/dishes/:id       - Dettagli piatto (Public)
POST   /api/dishes           - Crea piatto (Ristoratore)
PUT    /api/dishes/:id       - Aggiorna piatto (Proprietario)
DELETE /api/dishes/:id       - Elimina piatto (Proprietario)
```

### Ordini
```
GET    /api/orders           - Lista ordini utente (Protected)
         ?ristorante=ID        (per ristoratori)
GET    /api/orders/:id       - Dettagli ordine (Protected)
POST   /api/orders           - Crea ordine (Cliente)
PUT    /api/orders/:id/status - Aggiorna stato (Ristoratore)
```

## Flussi Utente

### Flusso Cliente

1. **Registrazione/Login**
   - GET `/register.html` o `/login.html`
   - POST `/api/auth/register` o `/api/auth/login`
   - Riceve JWT token
   - Token salvato in localStorage

2. **Navigazione Menu**
   - GET `/menu.html`
   - GET `/api/restaurants` (carica lista ristoranti per filtro)
   - GET `/api/dishes` (carica tutti i piatti)
   - Filtri applicati lato client

3. **Aggiunta al Carrello**
   - Click "Aggiungi" su un piatto
   - Piatto salvato in localStorage come cart
   - Aggiornamento contatore carrello

4. **Completamento Ordine**
   - GET `/order.html`
   - Visualizza carrello da localStorage
   - Seleziona modalità consegna
   - POST `/api/orders` con JWT token
   - Redirect a `/dashboard.html`

5. **Monitoraggio Ordini**
   - GET `/dashboard.html`
   - GET `/api/orders` (filtra per cliente)
   - Visualizza lista ordini con stati

### Flusso Ristoratore

1. **Registrazione/Login**
   - Same as Cliente ma con ruolo='ristoratore'

2. **Creazione Ristorante**
   - GET `/restaurant-form.html`
   - POST `/api/restaurants` con JWT token
   - Redirect a `/dashboard.html`

3. **Gestione Menu**
   - GET `/dishes.html?restaurant=ID`
   - GET `/api/dishes?ristorante=ID`
   - POST `/api/dishes` (crea piatto)
   - PUT `/api/dishes/:id` (modifica)
   - DELETE `/api/dishes/:id` (elimina)

4. **Gestione Ordini**
   - GET `/dashboard.html`
   - GET `/api/orders?ristorante=ID`
   - PUT `/api/orders/:id/status` (aggiorna stato)
   - Stati disponibili: ordinato → in_preparazione → pronto → in_consegna → consegnato → completato

## Sicurezza

### Autenticazione
- **JWT (JSON Web Tokens)** per autenticazione stateless
- Token generato al login/registrazione
- Scadenza configurabile (default: 7 giorni)
- Header: `Authorization: Bearer <token>`

### Password
- **bcryptjs** per hashing con salt (10 rounds)
- Password mai salvate in chiaro
- Minimo 6 caratteri richiesti

### Autorizzazione
- Middleware `protect`: verifica presenza e validità JWT
- Middleware `authorize(...ruoli)`: verifica ruolo utente
- Controllo ownership su risorse (es: solo proprietario può modificare ristorante)

### Validazione Input
- **express-validator** per validazione server-side
- Validazione formato email
- Validazione lunghezza stringhe
- Validazione valori numerici (min/max)
- Sanitizzazione input

### CORS
- Abilitato per sviluppo locale
- In produzione: configurare origin specifici

## Design Pattern

### Backend
- **MVC Pattern**: Separation of concerns
  - Models: schema e business logic
  - Routes: HTTP endpoints e controller logic
  - Middleware: autenticazione e validazione

- **RESTful API**: Risorse e operazioni standard
  - GET: lettura
  - POST: creazione
  - PUT: aggiornamento completo
  - DELETE: eliminazione

### Frontend
- **Module Pattern**: Codice JavaScript organizzato in moduli
- **Event-Driven**: Listeners per interazioni utente
- **Async/Await**: Gestione chiamate API asincrone
- **LocalStorage**: Cache lato client per carrello e autenticazione

## Performance

### Database
- **Indici**: Compound index per query frequenti
- **Population**: Lazy loading con .populate()
- **Projection**: Select solo campi necessari

### Frontend
- **Lazy Loading**: Contenuti caricati on-demand
- **Client-side Filtering**: Riduce chiamate API
- **LocalStorage Caching**: Token e carrello persistenti

### Network
- **JSON**: Formato leggero per scambio dati
- **Compression**: Abilitabile con compression middleware
- **Static Files**: Serviti direttamente da Express

## Estensibilità

### Aggiunte Possibili
1. **Upload Immagini**: Implementare upload per foto piatti/ristoranti
2. **Pagamenti**: Integrare Stripe/PayPal
3. **Recensioni**: Sistema di rating e commenti
4. **Notifiche**: Real-time con Socket.io
5. **Email**: Conferme ordine con nodemailer
6. **Geolocalizzazione**: Calcolo distanze e tempi consegna
7. **Admin Panel**: Dashboard amministratore
8. **Analytics**: Statistiche vendite e popolarità piatti
9. **Coupon**: Sistema di sconti e promozioni
10. **Multi-lingua**: i18n support

### Scalabilità
- **Database**: Sharding MongoDB per grandi volumi
- **Caching**: Redis per sessioni e dati frequenti
- **Load Balancing**: Nginx per multiple istanze
- **CDN**: CloudFlare per static assets
- **Microservices**: Separare ordini, pagamenti, notifiche

## Testing Raccomandato

### Unit Tests
- Modelli Mongoose (validazione)
- Utility functions (token generation, password hashing)

### Integration Tests
- API endpoints con supertest
- Database operations con MongoDB Memory Server

### E2E Tests
- User flows con Cypress o Playwright
- Test registrazione → ordine → gestione

## Deployment

### Preparazione Produzione
1. **Environment Variables**: Usa .env per secrets
2. **JWT Secret**: Genera chiave strong (32+ chars random)
3. **MongoDB**: Usa MongoDB Atlas o server dedicato
4. **HTTPS**: SSL/TLS obbligatorio per produzione
5. **Error Handling**: Nascondi stack traces in produzione
6. **Logging**: Implementa logging con Winston/Bunyan
7. **Rate Limiting**: Proteggi da abuse con express-rate-limit
8. **Helmet**: Security headers con helmet middleware

### Piattaforme Consigliate
- **Heroku**: Deploy facile per Node.js
- **Vercel/Netlify**: Frontend statico
- **DigitalOcean**: VPS con controllo completo
- **AWS**: EC2 + S3 + RDS per enterprise
- **MongoDB Atlas**: Database gestito (gratuito tier M0)

## Manutenzione

### Aggiornamenti
```bash
npm outdated              # Check versioni disponibili
npm update               # Update minor/patch versions
npm audit                # Security vulnerabilities check
npm audit fix            # Fix automatico vulnerabilità
```

### Backup
- **Database**: Backup giornalieri automatici MongoDB
- **Code**: Git repository con branches
- **Config**: Backup file .env (encrypted)

### Monitoring
- **Uptime**: UptimeRobot o similar
- **Errors**: Sentry per error tracking
- **Performance**: New Relic o DataDog
- **Logs**: Papertrail o Loggly

## Conclusione

Fast Food App rappresenta un'applicazione web moderna e completa con architettura scalabile e best practices implementate. Il codice è ben documentato e organizzato per facilitare manutenzione ed estensioni future.
