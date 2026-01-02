# Relazione Tecnica - Fast Food App

## Progetto di Programmazione Web e Mobile

**Studente:** Marco Portante  
**Anno Accademico:** 2023/2024  
**Corso:** Programmazione Web e Mobile  
**Data:** Gennaio 2026

---

## Indice

1. [Introduzione](#1-introduzione)
2. [Obiettivi del Progetto](#2-obiettivi-del-progetto)
3. [Analisi dei Requisiti](#3-analisi-dei-requisiti)
4. [Architettura del Sistema](#4-architettura-del-sistema)
5. [Tecnologie Utilizzate](#5-tecnologie-utilizzate)
6. [Modello dei Dati](#6-modello-dei-dati)
7. [Implementazione](#7-implementazione)
8. [Testing e Validazione](#8-testing-e-validazione)
9. [Conclusioni](#9-conclusioni)
10. [Bibliografia](#10-bibliografia)

---

## 1. Introduzione

Il progetto "Fast Food App" consiste nello sviluppo di un'applicazione web completa per la gestione di ordini in ristoranti fast food. L'applicazione implementa un sistema client-server basato su architettura REST, permettendo a clienti e ristoratori di interagire attraverso un'interfaccia web moderna e intuitiva.

### 1.1 Contesto

Nell'era digitale, la gestione informatizzata degli ordini di ristorazione è diventata una necessità per garantire efficienza e tracciabilità. Il progetto si inserisce in questo contesto offrendo una soluzione completa che copre tutte le fasi del processo: dalla registrazione utente, alla scelta dei piatti, fino alla gestione dell'ordine da parte del ristoratore.

### 1.2 Motivazioni

Le principali motivazioni alla base dello sviluppo di questo progetto sono:
- Applicare le conoscenze teoriche acquisite durante il corso
- Implementare un'architettura web moderna e scalabile
- Gestire un database NoSQL (MongoDB) in un contesto reale
- Sviluppare competenze nell'implementazione di API REST
- Implementare un sistema di autenticazione sicuro basato su JWT

---

## 2. Obiettivi del Progetto

Gli obiettivi principali del progetto sono:

### 2.1 Obiettivi Funzionali
- Permettere la registrazione di utenti con ruoli differenziati (cliente/ristoratore)
- Implementare un sistema di autenticazione sicuro
- Consentire ai ristoratori di creare e gestire ristoranti e menu
- Permettere ai clienti di esplorare ristoranti, visualizzare menu e creare ordini
- Implementare un sistema di gestione dello stato degli ordini
- Fornire filtri avanzati per la ricerca di piatti (allergeni, preferenze alimentari)

### 2.2 Obiettivi Non Funzionali
- Garantire la sicurezza dei dati sensibili (password, informazioni personali)
- Assicurare un'interfaccia utente responsiva e user-friendly
- Implementare un codice modulare e manutenibile
- Fornire documentazione completa e chiara
- Rispettare le best practices di sviluppo web

---

## 3. Analisi dei Requisiti

### 3.1 Requisiti Funzionali

#### RF1 - Gestione Utenti
- RF1.1: Il sistema deve permettere la registrazione di nuovi utenti
- RF1.2: Il sistema deve autenticare gli utenti tramite email e password
- RF1.3: Il sistema deve distinguere tra utenti "cliente" e "ristoratore"
- RF1.4: Gli utenti devono poter visualizzare e modificare il proprio profilo
- RF1.5: Gli utenti devono poter eliminare il proprio account

#### RF2 - Gestione Ristoranti
- RF2.1: I ristoratori devono poter creare nuovi ristoranti
- RF2.2: I ristoratori devono poter modificare le informazioni dei propri ristoranti
- RF2.3: Tutti gli utenti devono poter visualizzare la lista dei ristoranti
- RF2.4: I ristoratori devono poter eliminare i propri ristoranti

#### RF3 - Gestione Menu
- RF3.1: I ristoratori devono poter aggiungere piatti al menu
- RF3.2: Ogni piatto deve includere: nome, descrizione, prezzo, categoria, ingredienti, allergeni
- RF3.3: I piatti devono poter essere marcati come vegetariani o vegani
- RF3.4: I ristoratori devono poter modificare ed eliminare i piatti

#### RF4 - Gestione Ordini
- RF4.1: I clienti devono poter creare ordini selezionando piatti
- RF4.2: Il sistema deve calcolare automaticamente il totale dell'ordine
- RF4.3: Gli ordini devono supportare modalità ritiro o consegna
- RF4.4: I ristoratori devono poter aggiornare lo stato degli ordini
- RF4.5: Il sistema deve tracciare gli stati: ordinato, in preparazione, pronto, in consegna, consegnato, completato, annullato

### 3.2 Requisiti Non Funzionali

#### RNF1 - Sicurezza
- Le password devono essere hashate con algoritmo bcrypt
- L'autenticazione deve utilizzare token JWT
- Le route protette devono verificare l'autenticazione
- I dati sensibili non devono essere esposti nelle risposte API

#### RNF2 - Usabilità
- L'interfaccia deve essere intuitiva e facile da navigare
- Il design deve essere responsive per dispositivi mobili
- I messaggi di errore devono essere chiari e informativi

#### RNF3 - Manutenibilità
- Il codice deve essere modulare e ben organizzato
- Ogni funzione deve essere documentata con commenti JSDoc
- I nomi delle variabili devono essere descrittivi e in italiano

#### RNF4 - Performance
- Le query al database devono essere ottimizzate
- Il tempo di risposta delle API deve essere inferiore a 500ms in condizioni normali

---

## 4. Architettura del Sistema

### 4.1 Architettura Generale

Il sistema adotta un'architettura client-server a tre livelli:

1. **Presentation Layer (Frontend)**: Interfaccia utente web realizzata con HTML5, CSS3 e JavaScript
2. **Business Logic Layer (Backend)**: Server Node.js con Express.js che gestisce la logica applicativa
3. **Data Layer (Database)**: MongoDB per la persistenza dei dati

### 4.2 Pattern Architetturali

#### 4.2.1 Model-View-Controller (MVC)
L'applicazione segue il pattern MVC:
- **Model**: Modelli Mongoose che definiscono la struttura dei dati
- **View**: Pagine HTML statiche servite dal server
- **Controller**: Route Express che gestiscono le richieste HTTP

#### 4.2.2 Service Layer Pattern
La logica di business è separata dalle route attraverso un layer di servizi (/lib):
- Maggiore testabilità del codice
- Riutilizzo della logica in più route
- Separazione delle responsabilità

### 4.3 Struttura delle Directory

```
fastfood-app/
├── backend/              # Backend Express.js
│   ├── models/          # Modelli Mongoose
│   ├── routes/          # Route API REST
│   └── middleware/      # Middleware personalizzati
├── lib/                 # Business logic layer
│   ├── users/          # Servizi utenti
│   ├── restaurants/    # Servizi ristoranti
│   ├── orders/         # Servizi ordini
│   ├── dishes/         # Servizi piatti
│   ├── api/            # API utilities
│   └── utils/          # Utility condivise
├── config/              # Configurazioni
├── docs/                # Documentazione
├── public/              # Frontend statico
│   ├── css/            # Fogli di stile
│   ├── js/             # JavaScript client
│   └── scripts/        # Script aggiuntivi
├── data/                # Dati statici
└── server.js            # Entry point
```

### 4.4 Flusso delle Richieste

1. Il client invia una richiesta HTTP alla route appropriata
2. Il middleware di autenticazione verifica il token JWT (se richiesto)
3. Il middleware di validazione controlla i dati in input
4. La route delega la logica al servizio appropriato
5. Il servizio interagisce con i modelli per accedere al database
6. La risposta viene formattata e restituita al client

---

## 5. Tecnologie Utilizzate

### 5.1 Backend

#### 5.1.1 Node.js
Runtime JavaScript lato server che permette di eseguire codice JavaScript al di fuori del browser. Scelto per:
- Event-driven architecture ideale per applicazioni I/O intensive
- Ampio ecosistema di librerie (npm)
- Uniformità del linguaggio con il frontend

#### 5.1.2 Express.js
Framework web minimalista per Node.js. Vantaggi:
- Gestione semplice delle route
- Supporto middleware
- Flessibilità e leggerezza
- Ampia documentazione e community

#### 5.1.3 MongoDB
Database NoSQL orientato ai documenti. Motivazioni della scelta:
- Schema flessibile adatto a dati semi-strutturati
- Scalabilità orizzontale
- Query ricche e indicizzazione efficiente
- Integrazione nativa con Node.js

#### 5.1.4 Mongoose
ODM (Object Document Mapper) per MongoDB. Fornisce:
- Schema validation
- Middleware (hooks)
- Query building
- Type casting automatico

#### 5.1.5 JSON Web Token (JWT)
Standard per l'autenticazione stateless. Vantaggi:
- Stateless: il server non deve mantenere sessioni
- Self-contained: contiene tutte le informazioni necessarie
- Scalabile: ideale per architetture distribuite

#### 5.1.6 bcryptjs
Libreria per l'hashing delle password. Caratteristiche:
- Algoritmo bcrypt sicuro e resistente agli attacchi brute-force
- Salting automatico
- Configurazione del costo computazionale

#### 5.1.7 express-validator
Middleware per validazione e sanitizzazione. Utilizzo:
- Validazione parametri di input
- Sanitizzazione dati
- Messaggi di errore personalizzati

### 5.2 Frontend

#### 5.2.1 HTML5
Standard moderno per il markup. Utilizzo di:
- Elementi semantici (header, footer, section, article)
- Attributi data per memorizzare informazioni
- Form validation nativa

#### 5.2.2 CSS3
Styling moderno con:
- CSS Variables per tematizzazione
- Flexbox e Grid per layout responsive
- Transitions e transforms per animazioni
- Media queries per responsive design

#### 5.2.3 JavaScript ES6+
Vanilla JavaScript moderno senza framework. Caratteristiche utilizzate:
- Arrow functions
- Async/await per gestione asincrona
- Template literals
- Destructuring
- Modules (import/export)

#### 5.2.4 Font Awesome
Libreria di icone vettoriali per migliorare l'interfaccia utente.

### 5.3 Documentazione

#### 5.3.1 Swagger/OpenAPI
Framework per documentazione API interattiva. Vantaggi:
- Documentazione auto-generata dal codice
- Testing interattivo degli endpoint
- Specifiche standard OpenAPI
- UI intuitiva per esplorare le API

### 5.4 Development Tools

#### 5.4.1 nodemon
Utility che riavvia automaticamente il server quando rileva modifiche ai file.

#### 5.4.2 dotenv
Gestione variabili d'ambiente da file .env per configurazioni sensibili.

---

## 6. Modello dei Dati

### 6.1 Entità Principali

Il database è strutturato in quattro collezioni principali:

#### 6.1.1 User (Utente)
```javascript
{
  _id: ObjectId,
  nome: String,
  cognome: String,
  email: String (unique, indexed),
  password: String (hashed),
  ruolo: String (enum: ['cliente', 'ristoratore']),
  telefono: String,
  indirizzo: {
    via: String,
    citta: String,
    cap: String
  },
  createdAt: Date
}
```

**Vincoli:**
- email deve essere unica e valida
- password minimo 6 caratteri (hashata con bcrypt)
- ruolo può essere solo 'cliente' o 'ristoratore'

#### 6.1.2 Restaurant (Ristorante)
```javascript
{
  _id: ObjectId,
  nome: String,
  descrizione: String,
  proprietario: ObjectId (ref: 'User'),
  indirizzo: {
    via: String,
    citta: String,
    cap: String
  },
  telefono: String,
  email: String,
  orari: {
    lunedi: String,
    martedi: String,
    // ... altri giorni
  },
  immagine: String (URL),
  categoria: String,
  createdAt: Date
}
```

**Vincoli:**
- proprietario deve essere un utente con ruolo 'ristoratore'
- nome è obbligatorio

#### 6.1.3 Dish (Piatto)
```javascript
{
  _id: ObjectId,
  nome: String,
  descrizione: String,
  prezzo: Number,
  categoria: String (enum: ['antipasto', 'primo', 'secondo', 'contorno', 
                            'dolce', 'bevanda', 'panino', 'pizza']),
  ristorante: ObjectId (ref: 'Restaurant'),
  immagine: String (URL),
  ingredienti: [String],
  allergeni: [String],
  vegetariano: Boolean,
  vegano: Boolean,
  disponibile: Boolean,
  createdAt: Date
}
```

**Vincoli:**
- prezzo deve essere positivo
- ristorante deve esistere
- categoria deve essere una delle opzioni previste

#### 6.1.4 Order (Ordine)
```javascript
{
  _id: ObjectId,
  cliente: ObjectId (ref: 'User'),
  ristorante: ObjectId (ref: 'Restaurant'),
  piatti: [{
    piatto: ObjectId (ref: 'Dish'),
    quantita: Number,
    prezzo: Number
  }],
  totale: Number,
  stato: String (enum: ['ordinato', 'in preparazione', 'pronto', 
                        'in consegna', 'consegnato', 'completato', 'annullato']),
  modalita: String (enum: ['ritiro', 'consegna']),
  indirizzo: {
    via: String,
    citta: String,
    cap: String
  },
  note: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Vincoli:**
- cliente deve essere un utente con ruolo 'cliente'
- ristorante deve esistere
- piatti devono esistere
- quantita deve essere positiva
- totale viene calcolato automaticamente

### 6.2 Relazioni tra Entità

1. **User → Restaurant**: Un ristoratore può possedere più ristoranti (1:N)
2. **Restaurant → Dish**: Un ristorante ha più piatti nel menu (1:N)
3. **User → Order**: Un cliente può effettuare più ordini (1:N)
4. **Restaurant → Order**: Un ristorante può ricevere più ordini (1:N)
5. **Order → Dish**: Un ordine contiene più piatti (M:N attraverso array embedded)

### 6.3 Indici

Per ottimizzare le performance, sono stati creati indici su:
- User.email (unique index)
- Restaurant.proprietario
- Dish.ristorante
- Order.cliente
- Order.ristorante
- Order.stato

---

## 7. Implementazione

### 7.1 Backend

#### 7.1.1 Configurazione Server
Il server Express è configurato in `server.js`:
- Connessione al database MongoDB
- Configurazione middleware (CORS, JSON parser)
- Definizione route API
- Servizio file statici
- Configurazione Swagger

#### 7.1.2 Middleware di Autenticazione
Il middleware `auth.js` verifica la validità del token JWT:
```javascript
- Estrazione token dall'header Authorization
- Verifica validità token con jsonwebtoken
- Recupero utente dal database
- Attachment utente alla request
```

#### 7.1.3 Validazione Input
Utilizzo di express-validator per validare tutti gli input:
- Validazione campi obbligatori
- Validazione formato (email, numeri, etc.)
- Sanitizzazione input (trim, escape)
- Messaggi di errore personalizzati

#### 7.1.4 Gestione Errori
Gestione centralizzata degli errori:
- Try-catch in tutte le route asincrone
- Formattazione consistente risposte errore
- Logging errori per debugging
- Status code HTTP appropriati

#### 7.1.5 Service Layer
La business logic è implementata nel layer /lib:
- userService: gestione profilo utente
- restaurantService: CRUD ristoranti
- dishService: CRUD piatti con filtri avanzati
- orderService: creazione e gestione ordini

### 7.2 Frontend

#### 7.2.1 Struttura Pagine
Le pagine HTML sono organizzate per funzionalità:
- index.html: Homepage con ristoranti in evidenza
- login.html / register.html: Autenticazione
- menu.html: Lista ristoranti
- restaurant.html: Dettaglio ristorante e menu
- checkout.html: Carrello e completamento ordine
- dashboard-customer.html: Dashboard cliente con ordini
- dashboard-restaurant.html: Dashboard ristoratore

#### 7.2.2 JavaScript Client
Ogni pagina ha il proprio script JavaScript:
- common.js: funzioni condivise (autenticazione, fetch, etc.)
- app.js: logica homepage
- login.js / register.js: gestione autenticazione
- menu.js: visualizzazione e filtro ristoranti
- restaurant.js: visualizzazione menu e carrello
- checkout.js: gestione checkout
- dashboard-customer.js: visualizzazione ordini cliente
- dashboard-restaurant.js: gestione ordini ristoratore

#### 7.2.3 Gestione Stato
Lo stato dell'applicazione è gestito tramite:
- localStorage: token JWT, carrello
- sessionStorage: dati temporanei di navigazione
- DOM manipulation: aggiornamento UI dinamico

#### 7.2.4 Comunicazione API
Tutte le chiamate API utilizzano fetch con:
- Async/await per gestione asincrona
- Token JWT nell'header Authorization
- Gestione errori con try-catch
- Feedback utente su operazioni

### 7.3 Sicurezza Implementata

#### 7.3.1 Autenticazione
- Password hashate con bcrypt (salt rounds: 10)
- Token JWT con scadenza (24 ore)
- Secret key per firma token
- Middleware verifica token su route protette

#### 7.3.2 Autorizzazione
- Controllo ruolo utente nelle route
- Verifica proprietà risorse (es: solo il proprietario può modificare il ristorante)
- Separazione permessi cliente/ristoratore

#### 7.3.3 Validazione
- Validazione input su tutti gli endpoint
- Sanitizzazione dati per prevenire injection
- Validazione tipi e formati
- Limiti dimensioni input

#### 7.3.4 Best Practices
- CORS configurato appropriatamente
- Password non incluse nelle risposte (select: false)
- Variabili ambiente per dati sensibili
- HTTPS consigliato in produzione

---

## 8. Testing e Validazione

### 8.1 Approccio al Testing

Il testing è stato condotto attraverso:
1. Test manuali delle funzionalità
2. Testing API con Swagger UI
3. Testing con dati di esempio (seed-data.js)
4. Validazione frontend su diversi browser

### 8.2 Test Funzionali Eseguiti

#### 8.2.1 Gestione Utenti
- Registrazione nuovi utenti (cliente e ristoratore)
- Login con credenziali valide
- Login con credenziali non valide (fallimento atteso)
- Visualizzazione profilo
- Modifica profilo
- Eliminazione account

#### 8.2.2 Gestione Ristoranti
- Creazione ristorante da parte di ristoratore
- Tentativo creazione da parte di cliente (fallimento atteso)
- Visualizzazione lista ristoranti
- Visualizzazione dettaglio ristorante
- Modifica ristorante da proprietario
- Tentativo modifica da non proprietario (fallimento atteso)
- Eliminazione ristorante

#### 8.2.3 Gestione Menu
- Aggiunta piatti al menu
- Visualizzazione piatti con filtri (categoria, allergeni, vegetariano/vegano)
- Modifica piatti
- Eliminazione piatti
- Gestione disponibilità piatti

#### 8.2.4 Gestione Ordini
- Creazione ordine da cliente
- Calcolo automatico totale
- Visualizzazione ordini cliente
- Visualizzazione ordini ristorante
- Aggiornamento stato ordine da ristoratore
- Tentativo modifica da cliente (fallimento atteso)

### 8.3 Test di Validazione

Verificata la validazione su:
- Campi obbligatori mancanti
- Formati email non validi
- Password troppo corte
- Prezzi negativi
- Quantità negative
- Riferimenti a risorse inesistenti

### 8.4 Test di Sicurezza

Verificata la sicurezza attraverso:
- Tentativo accesso route protette senza token (401)
- Tentativo uso token scaduto (401)
- Tentativo modifica risorse altrui (403)
- Verifica password hashate in database
- Verifica password non esposte in risposte API

### 8.5 Test di Usabilità

Valutazione usabilità frontend:
- Navigazione intuitiva tra pagine
- Feedback visivo su azioni (loading, successo, errore)
- Messaggi di errore chiari
- Form validati lato client
- Responsive design su dispositivi mobili

### 8.6 Risultati Testing

Tutti i test funzionali hanno avuto esito positivo. Il sistema:
- Gestisce correttamente tutti i flussi utente principali
- Valida appropriatamente gli input
- Implementa sicurezza e autorizzazione correttamente
- Fornisce un'interfaccia utente responsive e intuitiva
- Gestisce gli errori in modo appropriato

---

## 9. Conclusioni

### 9.1 Obiettivi Raggiunti

Il progetto ha raggiunto tutti gli obiettivi prefissati:

1. **Funzionalità**: Tutte le funzionalità richieste sono state implementate e testate con successo
2. **Architettura**: È stata realizzata un'architettura modulare, scalabile e manutenibile
3. **Sicurezza**: Implementati meccanismi di autenticazione e autorizzazione robusti
4. **Usabilità**: Sviluppata un'interfaccia utente moderna e intuitiva
5. **Documentazione**: Prodotta documentazione completa del codice e del sistema

### 9.2 Competenze Acquisite

Durante lo sviluppo del progetto sono state acquisite e consolidate competenze in:
- Progettazione e implementazione di API REST
- Gestione database NoSQL con MongoDB
- Autenticazione basata su JWT
- Sviluppo frontend con JavaScript moderno
- Pattern architetturali (MVC, Service Layer)
- Sicurezza applicazioni web
- Documentazione tecnica e API

### 9.3 Difficoltà Incontrate

Le principali difficoltà affrontate sono state:
1. **Gestione autorizzazioni**: Implementare controlli granulari sulle risorse
2. **Filtri avanzati**: Implementare filtri complessi sui piatti (allergeni, preferenze)
3. **Gestione carrello**: Sincronizzare stato carrello tra localStorage e server
4. **Validazione consistente**: Garantire validazione sia lato client che server

### 9.4 Possibili Sviluppi Futuri

Il progetto potrebbe essere esteso con:
1. **Pagamenti online**: Integrazione gateway di pagamento (Stripe, PayPal)
2. **Notifiche real-time**: WebSocket per notificare cambio stato ordini
3. **Sistema recensioni**: Permettere ai clienti di recensire ristoranti e piatti
4. **Analytics**: Dashboard con statistiche per ristoratori
5. **Geolocalizzazione**: Suggerire ristoranti in base alla posizione utente
6. **Chat supporto**: Sistema di messaggistica tra clienti e ristoratori
7. **App mobile**: Sviluppo app native iOS/Android
8. **Sistema coupon**: Gestione sconti e promozioni

### 9.5 Considerazioni Finali

Il progetto "Fast Food App" rappresenta un'applicazione web completa e funzionale che dimostra l'applicazione pratica dei concetti di programmazione web e mobile. L'architettura modulare e le best practices adottate garantiscono che il sistema sia facilmente estendibile e manutenibile.

L'esperienza acquisita nello sviluppo di questo progetto costituisce una solida base per futuri sviluppi nell'ambito delle applicazioni web full-stack.

---

## 10. Bibliografia

### Documentazione Tecnica

1. **Node.js Documentation**  
   https://nodejs.org/docs/  
   Documentazione ufficiale Node.js

2. **Express.js Guide**  
   https://expressjs.com/  
   Guida ufficiale Express.js

3. **MongoDB Manual**  
   https://docs.mongodb.com/manual/  
   Manuale ufficiale MongoDB

4. **Mongoose Documentation**  
   https://mongoosejs.com/docs/  
   Documentazione Mongoose ODM

5. **JWT Introduction**  
   https://jwt.io/introduction  
   Introduzione a JSON Web Tokens

6. **MDN Web Docs**  
   https://developer.mozilla.org/  
   Riferimento per HTML5, CSS3, JavaScript

### Libri di Riferimento

7. **"Node.js Design Patterns"**  
   Mario Casciaro, Luciano Mammino  
   Packt Publishing, 2020

8. **"RESTful Web API Design with Node.js"**  
   Valentin Bojinov  
   Packt Publishing, 2018

9. **"MongoDB: The Definitive Guide"**  
   Shannon Bradshaw, Eoin Brazil, Kristina Chodorow  
   O'Reilly Media, 2019

### Standard e Specifiche

10. **OpenAPI Specification**  
    https://spec.openapis.org/oas/latest.html  
    Specifica OpenAPI/Swagger

11. **ECMAScript 2021 Language Specification**  
    https://262.ecma-international.org/  
    Specifica JavaScript ES2021

### Articoli e Risorse

12. **"RESTful API Design - Best Practices"**  
    https://restfulapi.net/  
    Best practices per design API REST

13. **"OWASP Top 10"**  
    https://owasp.org/www-project-top-ten/  
    Top 10 vulnerabilità sicurezza web

---

**Fine Relazione**

**Data di consegna:** Gennaio 2026  
**Versione documento:** 1.0
