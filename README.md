# Fast Food App

Applicazione web completa per la gestione di ordini in un fast food, sviluppata con architettura moderna e best practices.

## Descrizione

Fast Food App è un'applicazione full-stack che permette ai clienti di ordinare cibo online e ai ristoratori di gestire ristoranti, menu e ordini in modo efficiente. L'applicazione offre un'interfaccia intuitiva e moderna, con una solida architettura backend modulare.

## Obiettivi del Progetto

- **Modularità**: Architettura ben organizzata con separazione delle responsabilità
- **Scalabilità**: Struttura che facilita l'aggiunta di nuove funzionalità
- **Manutenibilità**: Codice pulito, ben documentato e facile da mantenere
- **User Experience**: Interfaccia intuitiva e responsive per tutti i dispositivi
- **Best Practices**: Utilizzo di pattern standard e librerie consolidate

## Tecnologie Utilizzate

### Backend
- **Node.js** v14+ - Runtime JavaScript ad alte prestazioni
- **Express.js** 4.18 - Framework web minimalista e flessibile
- **MongoDB** - Database NoSQL orientato ai documenti
- **Mongoose** 7.5 - ODM elegante per MongoDB
- **JWT** - Autenticazione sicura basata su token
- **bcryptjs** - Crittografia password con salt
- **express-validator** - Validazione e sanitizzazione dati
- **Swagger** - Documentazione API interattiva

### Frontend
- **HTML5** - Markup semantico e accessibile
- **CSS3** - Styling moderno con variabili CSS, flexbox e grid
- **JavaScript ES6+** - Vanilla JavaScript moderno, nessun framework
- **Font Awesome** - Libreria di icone

### DevOps & Tools
- **Git** - Controllo di versione
- **npm** - Gestione dipendenze
- **nodemon** - Auto-reload in sviluppo

## Struttura del Progetto

```
fastfood-app/
├── models/                    # Modelli Mongoose (User, Restaurant, Dish, Order)
├── routes/                    # Route API REST
├── middleware/                # Middleware Express (autenticazione, validazione)
├── lib/                       # Librerie e servizi business logic
│   ├── users/                # Servizi per gestione utenti
│   ├── restaurants/          # Servizi per gestione ristoranti
│   ├── orders/               # Servizi per gestione ordini
│   ├── dishes/               # Servizi per gestione piatti
│   └── utils/                # Utility condivise (validazione, risposte)
├── config/                    # Configurazioni applicazione
│   └── database.js           # Configurazione connessione MongoDB
├── docs/                      # Documentazione del progetto
│   └── Relazione.md          # Relazione tecnica del progetto
├── public/                    # Frontend statico
│   ├── css/                  # Fogli di stile
│   │   ├── style.css         # Stili principali
│   │   └── layout.css        # Layout e componenti
│   ├── scripts/              # JavaScript client-side modularizzato
│   └── *.html                # Pagine HTML
├── app.js                     # Configurazione Express app
├── server.js                  # Entry point del server
├── swagger.js                 # Configurazione Swagger
├── package.json              # Dipendenze e scripts npm
├── LICENSE                    # Licenza MIT
├── .env                       # Variabili d'ambiente (non committato)
└── .env.example              # Template configurazione ambiente
```

## Avvio Rapido

Per istruzioni dettagliate sull'installazione e configurazione, consulta la [Relazione Tecnica](./docs/Relazione.md).

### Quick Start

1. **Clona e installa**
   ```bash
   git clone https://github.com/marcoportante/fastfood-app.git
   cd fastfood-app
   npm install
   ```

2. **Configura l'ambiente**
   ```bash
   cp .env.example .env
   # Modifica .env con le tue configurazioni
   ```

3. **Avvia MongoDB e il server**
   ```bash
   # Assicurati che MongoDB sia in esecuzione
   npm start
   ```

4. **Apri il browser**
   - Applicazione: `http://localhost:3000`
   - Documentazione API: `http://localhost:3000/api-docs`

## Funzionalità

### Gestione Utenti
- Registrazione con ruolo (Cliente/Ristoratore)
- Login con JWT authentication
- Visualizzazione e modifica profilo
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

La documentazione completa del progetto è disponibile nella [Relazione Tecnica](./docs/Relazione.md), che include:
- Analisi dei requisiti
- Architettura del sistema
- Modello dei dati
- Dettagli implementazione
- Testing e validazione

### Documentazione Interattiva Swagger

La documentazione API interattiva è disponibile tramite Swagger UI:

- **URL Locale:** `http://localhost:3000/api-docs`
- **Specifiche OpenAPI:** `http://localhost:3000/api-docs.json`

Funzionalità Swagger UI:
- Esplorare tutti gli endpoint disponibili
- Vedere schemi di richiesta e risposta dettagliati
- Testare le API direttamente dal browser
- Autenticarsi con JWT per testare endpoint protetti

**Endpoint principali:**
- `POST /api/auth/register` - Registrazione nuovo utente
- `POST /api/auth/login` - Login e ottenimento token
- `GET /api/users/me` - Profilo utente autenticato
- `GET /api/restaurants` - Lista ristoranti pubblici
- `GET /api/dishes` - Lista piatti (con filtri avanzati)
- `POST /api/orders` - Creazione nuovo ordine
- `GET /api/orders` - Lista ordini utente

Autenticazione tramite Bearer Token JWT nell'header `Authorization`.

## Testing

### Test Manuale

1. **Crea un account ristoratore**
2. **Crea un ristorante e aggiungi piatti**
3. **Crea un account cliente**
4. **Effettua un ordine**
5. **Come ristoratore, gestisci l'ordine**

### Test Automatico

L'applicazione usa MongoDB in-memory quando MongoDB locale non è disponibile, facilitando il testing in ambiente di sviluppo.

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
- [Relazione Tecnica](./docs/Relazione.md)

---

**Nota**: Per problemi, domande o suggerimenti, apri una issue su GitHub o consulta la relazione tecnica nella cartella `docs/`.
