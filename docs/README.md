# Documentazione Fast Food App

Benvenuto nella documentazione completa dell'applicazione Fast Food App.

## Indice della Documentazione

### Documentazione Principale

1. **[Relazione Tecnica](./Relazione.md)**
   - Relazione universitaria completa del progetto
   - Analisi dei requisiti e architettura
   - Descrizione implementazione e testing
   - Bibliografia e riferimenti

### Documentazione API Interattiva

La documentazione API è disponibile tramite Swagger UI quando il server è in esecuzione.

## Link Rapidi

- **Applicazione**: `http://localhost:3000`
- **Swagger UI**: `http://localhost:3000/api-docs`
- **Specifiche API**: `http://localhost:3000/api-docs.json`

## Panoramica del Progetto

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

## Struttura del Codice

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

## Come Usare Questa Documentazione

### Per Comprendere il Progetto
Consulta la [Relazione Tecnica](./Relazione.md) per una comprensione completa del progetto, inclusi obiettivi, architettura, implementazione e testing.

### Per Testare le API
1. Avvia il server locale
2. Apri [Swagger UI](http://localhost:3000/api-docs)
3. Esplora e testa gli endpoint disponibili

## Script Disponibili

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

## Dipendenze Principali

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

## Sicurezza

- Password hashate con bcryptjs
- Autenticazione basata su JWT
- Validazione input con express-validator
- Protezione route con middleware di autenticazione
- Autorizzazione basata sui ruoli (cliente/ristoratore)

## Contribuire

Per contribuire al progetto:

1. Leggi la documentazione per comprendere l'architettura
2. Segui gli standard di codice esistenti
3. Aggiungi commenti in italiano
4. Testa le modifiche localmente
5. Aggiorna la documentazione se necessario

## Supporto

Per domande o problemi:

- Consulta la [Relazione Tecnica](./Relazione.md) per informazioni dettagliate
- Apri una issue su GitHub per bug o feature request

## Note per lo Sviluppo

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
