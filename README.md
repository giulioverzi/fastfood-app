# Fast Food App

Applicazione web frontend per la gestione di ordini in un fast food, basata su local storage e sviluppata seguendo il modello Marvel.

## Descrizione

Fast Food App è un'applicazione frontend moderna che permette ai clienti di ordinare cibo online e ai ristoratori di gestire ristoranti, menu e ordini. L'applicazione utilizza **local storage** per la persistenza dei dati, salvando JWT e informazioni utente/ristoratore per il rendering dinamico delle pagine.

## Obiettivi del Progetto

- **Modularità**: Architettura ben organizzata con JavaScript modularizzato
- **Persistenza Client-Side**: Utilizzo di local storage per dati utente e autenticazione
- **Manutenibilità**: Codice pulito, ben documentato e facile da mantenere
- **User Experience**: Interfaccia intuitiva e responsive per tutti i dispositivi
- **Best Practices**: Codice frontend moderno seguendo standard web

## Tecnologie Utilizzate

### Frontend
- **HTML5** - Markup semantico e accessibile
- **CSS3** - Styling moderno con variabili CSS, flexbox e grid
- **JavaScript ES6+** - Vanilla JavaScript moderno e modularizzato
- **Local Storage** - Persistenza dati lato client
- **Font Awesome** - Libreria di icone

### DevOps & Tools
- **Git** - Controllo di versione
- **npm** - Gestione dipendenze
- **http-server** - Server HTTP statico per sviluppo

## Struttura del Progetto

```
fastfood-app/
├── docs/                      # Documentazione del progetto
│   ├── README.md             # Guida alla documentazione
│   ├── Relazione.md          # Relazione tecnica del progetto
│   └── Relazione.pdf         # Versione PDF della relazione
├── public/                    # Applicazione frontend
│   ├── css/                  # Fogli di stile
│   │   ├── style.css         # Stili principali
│   │   └── layout.css        # Layout e componenti
│   ├── scripts/              # JavaScript modularizzato
│   │   ├── common.js         # Funzioni condivise
│   │   ├── app.js            # Homepage
│   │   ├── login.js          # Gestione login
│   │   ├── register.js       # Gestione registrazione
│   │   ├── menu.js           # Visualizzazione menu
│   │   ├── checkout.js       # Gestione checkout
│   │   ├── customer.js       # Dashboard cliente
│   │   └── restaurant-dashboard.js  # Dashboard ristoratore
│   └── *.html                # Pagine HTML
├── package.json              # Dipendenze e scripts npm
├── LICENSE                   # Licenza MIT
├── .gitignore               # File ignorati da git
└── README.md                # Questo file
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

2. **Avvia il server di sviluppo**
   ```bash
   npm start
   ```

3. **Apri il browser**
   - L'applicazione si aprirà automaticamente su `http://localhost:3000`
   - Inizia navigando dalla homepage per esplorare ristoranti e menu

## Funzionalità

### Gestione Utenti
- Registrazione con ruolo (Cliente/Ristoratore) tramite local storage
- Login con JWT salvato in local storage
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

## Persistenza Dati

L'applicazione utilizza **local storage** del browser per salvare:
- Token JWT per l'autenticazione
- Dati utente (nome, email, ruolo)
- Dati ristoratori
- Carrello e ordini
- Informazioni sui ristoranti e piatti

**Nota sulla Sicurezza:** I dati in local storage sono memorizzati lato client e possono essere accessibili tramite JavaScript. Non memorizzare informazioni sensibili o critiche. Il local storage è appropriato per applicazioni demo e prototipazione.

## Testing

### Test Manuale

1. **Crea un account ristoratore**
2. **Crea un ristorante e aggiungi piatti**
3. **Crea un account cliente**
4. **Effettua un ordine**
5. **Come ristoratore, gestisci l'ordine**

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

**Nota**: L'applicazione funziona completamente lato client utilizzando local storage. Non è necessario un server backend o database esterno.
