# Fast Food App 🍔

Applicazione web completa per la gestione di ordini in un fast food, sviluppata con architettura moderna e best practices.

## 📋 Descrizione

Fast Food App è un'applicazione full-stack che permette ai clienti di ordinare cibo online e ai ristoratori di gestire ristoranti, menu e ordini in modo efficiente. L'applicazione offre un'interfaccia intuitiva e moderna, con una solida architettura backend modulare.

## 🎯 Obiettivi del Progetto

- **Modularità**: Architettura ben organizzata con separazione delle responsabilità
- **Scalabilità**: Struttura che facilita l'aggiunta di nuove funzionalità
- **Manutenibilità**: Codice pulito, ben documentato e facile da mantenere
- **User Experience**: Interfaccia intuitiva e responsive per tutti i dispositivi
- **Best Practices**: Utilizzo di pattern standard e librerie consolidate

## 🚀 Tecnologie Utilizzate

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

## 📁 Struttura del Progetto

```
fastfood-app/
├── backend/                    # Backend Express.js
│   ├── models/                # Modelli Mongoose (User, Restaurant, Dish, Order)
│   ├── routes/                # Route API REST
│   └── middleware/            # Middleware Express (autenticazione, validazione)
├── lib/                       # Librerie e servizi business logic
│   ├── users/                # Servizi per gestione utenti
│   ├── restaurants/          # Servizi per gestione ristoranti
│   ├── orders/               # Servizi per gestione ordini
│   ├── dishes/               # Servizi per gestione piatti
│   └── utils/                # Utility condivise (validazione, risposte)
├── config/                    # Configurazioni applicazione
│   └── database.js           # Configurazione connessione MongoDB
├── docs/                      # Documentazione del progetto
│   ├── getting-started.md    # Guida introduttiva
│   ├── api.md                # Documentazione API
│   └── architecture.md       # Architettura dettagliata
├── public/                    # Frontend statico
│   ├── css/                  # Fogli di stile
│   │   ├── style.css         # Stili principali
│   │   └── layout.css        # Layout e componenti
│   ├── js/                   # JavaScript client-side
│   └── *.html                # Pagine HTML
├── data/                      # Dati e risorse statiche
├── server.js                  # Entry point del server
├── swagger.js                 # Configurazione Swagger
├── seed-data.js              # Script per popolare il database
├── package.json              # Dipendenze e scripts npm
└── .env.example              # Template configurazione ambiente
```

## ⚙️ Avvio Rapido

Per istruzioni dettagliate sull'installazione e configurazione, consulta la [Guida Introduttiva](./docs/getting-started.md).

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

## 📚 Documentazione

### Guide e Documentazione
- **[Guida Introduttiva](./docs/getting-started.md)** - Setup e primi passi
- **[Documentazione API](./docs/api.md)** - Endpoint e esempi di utilizzo
- **[Architettura](./docs/architecture.md)** - Struttura e design del sistema

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

## 🧪 Testing

### Test Manuale

1. **Crea un account ristoratore**
2. **Crea un ristorante e aggiungi piatti**
3. **Crea un account cliente**
4. **Effettua un ordine**
5. **Come ristoratore, gestisci l'ordine**

### Popola Database con Dati di Esempio

```bash
node seed-data.js
```

Questo script crea utenti, ristoranti, piatti e ordini di esempio per testare l'applicazione.

## 📖 Codice e Commenti

Il codice è completamente documentato in italiano con:
- Commenti JSDoc per funzioni e moduli
- Descrizione dettagliata dei parametri
- Esempi di utilizzo dove necessario
- Spiegazione della logica complessa

## 👥 Autore

**Marco Portante** - [GitHub](https://github.com/marcoportante)

Progetto sviluppato per l'esame di Programmazione Web e Mobile

## 📄 Licenza

MIT License - Vedi file LICENSE per dettagli

## 🔗 Link Utili

- [Repository GitHub](https://github.com/marcoportante/fastfood-app)
- [Documentazione API](./docs/api.md)
- [Guida Introduttiva](./docs/getting-started.md)

---

**Nota**: Per problemi, domande o suggerimenti, apri una issue su GitHub o consulta la documentazione nella cartella `docs/`.
