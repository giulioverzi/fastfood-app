# Documentazione Fast Food App

Benvenuto nella documentazione completa dell'applicazione Fast Food App.

## 📚 Indice della Documentazione

### Guide per Sviluppatori

1. **[Guida Introduttiva](./getting-started.md)**
   - Prerequisiti e installazione
   - Configurazione iniziale
   - Primi passi con l'applicazione
   - Risoluzione problemi comuni

2. **[Architettura del Sistema](./architecture.md)**
   - Panoramica dell'architettura
   - Stack tecnologico
   - Modelli di dati
   - Flussi principali dell'applicazione

3. **[Documentazione API](./api.md)**
   - Endpoint REST disponibili
   - Schemi di richiesta e risposta
   - Autenticazione JWT
   - Esempi di utilizzo

4. **[Guida Swagger](./swagger-guide.md)**
   - Come utilizzare Swagger UI
   - Test interattivo delle API
   - Download specifiche OpenAPI

## 🚀 Link Rapidi

- **Applicazione**: `http://localhost:3000`
- **Swagger UI**: `http://localhost:3000/api-docs`
- **Specifiche API**: `http://localhost:3000/api-docs.json`

## 📋 Panoramica del Progetto

Fast Food App è un'applicazione full-stack per la gestione di ordini di fast food con:

- **Backend**: Node.js + Express + MongoDB
- **Frontend**: HTML5 + CSS3 + JavaScript Vanilla
- **Autenticazione**: JWT (JSON Web Tokens)
- **Documentazione**: Swagger/OpenAPI

### Funzionalità Principali

#### Per i Clienti
- Registrazione e autenticazione
- Esplorazione ristoranti e menu
- Filtri avanzati (categoria, allergeni, preferenze alimentari)
- Carrello e checkout
- Tracciamento ordini in tempo reale
- Gestione profilo e metodi di pagamento

#### Per i Ristoratori
- Gestione informazioni ristorante
- Creazione e modifica menu
- Gestione ordini ricevuti
- Aggiornamento stati ordine
- Dashboard con statistiche

## 🏗️ Struttura del Codice

### Backend (`/backend`)
- `models/` - Modelli Mongoose (User, Restaurant, Dish, Order)
- `routes/` - Route API REST
- `middleware/` - Middleware Express (autenticazione, validazione)

### Librerie (`/lib`)
- `users/` - Servizi gestione utenti
- `restaurants/` - Servizi gestione ristoranti
- `orders/` - Servizi gestione ordini
- `dishes/` - Servizi gestione piatti
- `utils/` - Utility condivise

### Frontend (`/public`)
- `css/` - Fogli di stile
- `js/` - JavaScript client-side
- `*.html` - Pagine dell'applicazione

### Configurazione (`/config`)
- Configurazioni database e ambiente

## 📖 Come Usare Questa Documentazione

### Per Iniziare
Se è la prima volta che lavori con questo progetto, inizia dalla [Guida Introduttiva](./getting-started.md).

### Per Sviluppatori Backend
1. Leggi l'[Architettura](./architecture.md) per capire la struttura
2. Consulta la [Documentazione API](./api.md) per gli endpoint
3. Esplora i moduli in `/lib` per la business logic

### Per Sviluppatori Frontend
1. Leggi l'[Architettura](./architecture.md) sezione Frontend
2. Esplora i file in `/public`
3. Consulta la [Documentazione API](./api.md) per integrazioni

### Per Testare le API
1. Avvia il server locale
2. Apri [Swagger UI](http://localhost:3000/api-docs)
3. Segui la [Guida Swagger](./swagger-guide.md)

## 🛠️ Script Disponibili

```bash
# Avvia il server (produzione)
npm start

# Avvia in modalità sviluppo con auto-reload
npm run dev

# Avvia con MongoDB in-memory per test
node test-server.js

# Popola il database con dati di esempio
node seed-data.js
```

## 📦 Dipendenze Principali

### Produzione
- `express` - Framework web
- `mongoose` - ODM MongoDB
- `jsonwebtoken` - Autenticazione JWT
- `bcryptjs` - Hashing password
- `express-validator` - Validazione dati
- `swagger-jsdoc` & `swagger-ui-express` - Documentazione API

### Sviluppo
- `nodemon` - Auto-reload in sviluppo
- `mongodb-memory-server` - MongoDB in-memory per test

## 🔐 Sicurezza

- Password hashate con bcryptjs
- Autenticazione basata su JWT
- Validazione input con express-validator
- Protezione route con middleware di autenticazione
- Autorizzazione basata sui ruoli (cliente/ristoratore)

## 🤝 Contribuire

Per contribuire al progetto:

1. Leggi la documentazione per comprendere l'architettura
2. Segui gli standard di codice esistenti
3. Aggiungi commenti in italiano
4. Testa le modifiche localmente
5. Aggiorna la documentazione se necessario

## 📞 Supporto

Per domande o problemi:

- Consulta la [Guida Introduttiva](./getting-started.md) per problemi comuni
- Leggi la [Documentazione API](./api.md) per dettagli sugli endpoint
- Apri una issue su GitHub per bug o feature request

## 📝 Note per lo Sviluppo

### Convenzioni di Codice
- Commenti e documentazione in italiano
- Nomi variabili in italiano (es: `ristorante`, `piatto`, `ordine`)
- Stile JSDoc per documentare funzioni
- Messaggi di commit descrittivi

### Best Practices
- Separazione delle responsabilità (route → service → model)
- Validazione input su tutti gli endpoint
- Gestione errori consistente
- Logging appropriato per debugging

### Testing
- Test manuali con Swagger UI
- Utilizzo di dati di esempio con seed-data.js
- Test con MongoDB in-memory per ambiente isolato

---

**Ultimo aggiornamento**: Gennaio 2026
**Versione**: 1.0.0
