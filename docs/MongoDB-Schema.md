# Struttura Database MongoDB - Fast Food App

## Collezioni del Database

Il database MongoDB dell'applicazione Fast Food App è strutturato in quattro collezioni principali che gestiscono tutti i dati necessari al funzionamento dell'applicazione.

---

## 1. Collezione: `users`

### Descrizione
Memorizza le informazioni di tutti gli utenti registrati nell'applicazione, sia clienti che ristoratori.

### Schema
```javascript
{
  _id: ObjectId,                    // ID univoco generato automaticamente
  nome: String,                      // Nome dell'utente (obbligatorio)
  cognome: String,                   // Cognome dell'utente (obbligatorio)
  email: String,                     // Email univoca (obbligatorio, indicizzato)
  password: String,                  // Password hashata con bcrypt (obbligatorio)
  ruolo: String,                     // 'cliente' o 'ristoratore' (obbligatorio)
  telefono: String,                  // Numero di telefono (opzionale)
  indirizzo: {                       // Indirizzo dell'utente (opzionale)
    via: String,
    citta: String,
    cap: String
  },
  createdAt: Date                    // Data di creazione (auto-generato)
}
```

### Vincoli
- `email`: deve essere unico, valido e normalizzato in minuscolo
- `password`: minimo 6 caratteri, sempre hashata (mai salvata in chiaro)
- `ruolo`: solo valori 'cliente' o 'ristoratore'

### Indici
- `email`: indice unico per garantire univocità e velocizzare ricerche

### Uso
- Autenticazione utenti (login/registrazione)
- Gestione profilo utente
- Autorizzazione basata su ruolo
- Associazione con ristoranti (per ristoratori) e ordini (per clienti)

---

## 2. Collezione: `restaurants`

### Descrizione
Memorizza le informazioni dei ristoranti registrati sulla piattaforma. Ogni ristorante è associato a un utente con ruolo 'ristoratore'.

### Schema
```javascript
{
  _id: ObjectId,                    // ID univoco generato automaticamente
  nome: String,                      // Nome del ristorante (obbligatorio)
  descrizione: String,               // Descrizione del ristorante (opzionale)
  proprietario: ObjectId,            // Riferimento a users._id (obbligatorio)
  indirizzo: {                       // Indirizzo del ristorante (obbligatorio)
    via: String,
    citta: String,
    cap: String
  },
  telefono: String,                  // Telefono del ristorante (opzionale)
  email: String,                     // Email del ristorante (opzionale)
  orari: {                          // Orari di apertura (opzionale)
    lunedi: String,
    martedi: String,
    mercoledi: String,
    giovedi: String,
    venerdi: String,
    sabato: String,
    domenica: String
  },
  immagine: String,                  // URL immagine ristorante (opzionale)
  categoria: String,                 // Categoria ristorante (es: "Pizza", "Burger")
  createdAt: Date                    // Data di creazione (auto-generato)
}
```

### Vincoli
- `proprietario`: deve riferirsi a un utente esistente con ruolo 'ristoratore'
- `nome`: obbligatorio

### Indici
- `proprietario`: per velocizzare query per ristoranti di un proprietario

### Uso
- Visualizzazione lista ristoranti
- Gestione informazioni ristorante (CRUD)
- Associazione con piatti e ordini
- Filtro per categoria

---

## 3. Collezione: `dishes`

### Descrizione
Memorizza i piatti disponibili nel menu di ciascun ristorante. Ogni piatto è collegato a un ristorante specifico.

### Schema
```javascript
{
  _id: ObjectId,                    // ID univoco generato automaticamente
  nome: String,                      // Nome del piatto (obbligatorio)
  descrizione: String,               // Descrizione del piatto (obbligatorio)
  prezzo: Number,                    // Prezzo in euro (obbligatorio, > 0)
  categoria: String,                 // Categoria piatto (obbligatorio)
  ristorante: ObjectId,              // Riferimento a restaurants._id (obbligatorio)
  immagine: String,                  // URL immagine piatto (opzionale)
  ingredienti: [String],             // Array di ingredienti (opzionale)
  allergeni: [String],               // Array di allergeni (opzionale)
  vegetariano: Boolean,              // Se è vegetariano (default: false)
  vegano: Boolean,                   // Se è vegano (default: false)
  disponibile: Boolean,              // Se è disponibile (default: true)
  createdAt: Date                    // Data di creazione (auto-generato)
}
```

### Categorie Valide
- 'antipasto'
- 'primo'
- 'secondo'
- 'contorno'
- 'dolce'
- 'bevanda'
- 'panino'
- 'pizza'

### Vincoli
- `ristorante`: deve riferirsi a un ristorante esistente
- `prezzo`: deve essere un numero positivo
- `categoria`: deve essere una delle categorie valide

### Indici
- `ristorante`: per velocizzare query per piatti di un ristorante
- `categoria`: per filtri per categoria
- `disponibile`: per filtrare solo piatti disponibili

### Uso
- Visualizzazione menu ristorante
- Gestione menu (CRUD) da parte dei ristoratori
- Filtri avanzati (categoria, allergeni, vegetariano/vegano)
- Creazione ordini

---

## 4. Collezione: `orders`

### Descrizione
Memorizza gli ordini effettuati dai clienti presso i ristoranti. Traccia lo stato dell'ordine durante tutto il processo.

### Schema
```javascript
{
  _id: ObjectId,                    // ID univoco generato automaticamente
  cliente: ObjectId,                 // Riferimento a users._id (obbligatorio)
  ristorante: ObjectId,              // Riferimento a restaurants._id (obbligatorio)
  piatti: [                         // Array di piatti ordinati (obbligatorio)
    {
      piatto: ObjectId,              // Riferimento a dishes._id
      quantita: Number,              // Quantità ordinata (> 0)
      prezzo: Number                 // Prezzo al momento dell'ordine
    }
  ],
  totale: Number,                    // Totale ordine in euro (calcolato)
  stato: String,                     // Stato corrente ordine (obbligatorio)
  modalita: String,                  // 'ritiro' o 'consegna' (obbligatorio)
  indirizzo: {                      // Indirizzo consegna (obbligatorio se modalita='consegna')
    via: String,
    citta: String,
    cap: String
  },
  note: String,                      // Note aggiuntive (opzionale)
  createdAt: Date,                   // Data creazione ordine (auto-generato)
  updatedAt: Date                    // Data ultima modifica (auto-aggiornato)
}
```

### Stati Ordine (in ordine di progressione)
1. `'ordinato'` - Ordine creato dal cliente
2. `'in preparazione'` - Ristorante ha preso in carico l'ordine
3. `'pronto'` - Ordine pronto per ritiro/consegna
4. `'in consegna'` - Ordine in fase di consegna (solo per modalità consegna)
5. `'consegnato'` - Ordine consegnato/ritirato
6. `'completato'` - Ordine completato
7. `'annullato'` - Ordine annullato

### Vincoli
- `cliente`: deve riferirsi a un utente esistente con ruolo 'cliente'
- `ristorante`: deve riferirsi a un ristorante esistente
- `piatti`: array non vuoto, ogni piatto deve esistere
- `quantita`: deve essere > 0
- `stato`: deve essere uno degli stati validi
- `modalita`: solo 'ritiro' o 'consegna'
- `indirizzo`: obbligatorio se modalita = 'consegna'

### Indici
- `cliente`: per query ordini di un cliente
- `ristorante`: per query ordini di un ristorante
- `stato`: per filtrare ordini per stato
- `createdAt`: per ordinamento cronologico

### Uso
- Creazione ordini da parte dei clienti
- Visualizzazione ordini (per cliente e ristoratore)
- Aggiornamento stato ordine da parte del ristoratore
- Storico ordini
- Calcolo statistiche

---

## Relazioni tra Collezioni

### Grafo delle Relazioni
```
users (ristoratore) ──1:N──> restaurants
                              │
                              │ 1:N
                              ↓
                           dishes
                              │
                              │ M:N (attraverso orders.piatti)
                              ↓
users (cliente) ──1:N──> orders <──N:1── restaurants
```

### Descrizione Relazioni

1. **users → restaurants** (1:N)
   - Un ristoratore può possedere più ristoranti
   - Campo di join: `restaurants.proprietario` → `users._id`

2. **restaurants → dishes** (1:N)
   - Un ristorante ha più piatti nel menu
   - Campo di join: `dishes.ristorante` → `restaurants._id`

3. **users → orders** (1:N)
   - Un cliente può effettuare più ordini
   - Campo di join: `orders.cliente` → `users._id`

4. **restaurants → orders** (1:N)
   - Un ristorante può ricevere più ordini
   - Campo di join: `orders.ristorante` → `restaurants._id`

5. **dishes → orders** (M:N)
   - Un ordine contiene più piatti
   - Un piatto può essere in più ordini
   - Relazione implementata tramite array embedded in `orders.piatti`

---

## Operazioni CRUD Principali

### Users
- **Create**: Registrazione nuovo utente (POST /api/auth/register)
- **Read**: Visualizza profilo (GET /api/users/me)
- **Update**: Modifica profilo (PUT /api/users/me)
- **Delete**: Elimina account (DELETE /api/users/me)

### Restaurants
- **Create**: Crea ristorante (POST /api/restaurants) - solo ristoratori
- **Read**: Lista ristoranti (GET /api/restaurants), Dettaglio (GET /api/restaurants/:id)
- **Update**: Modifica ristorante (PUT /api/restaurants/:id) - solo proprietario
- **Delete**: Elimina ristorante (DELETE /api/restaurants/:id) - solo proprietario

### Dishes
- **Create**: Aggiungi piatto (POST /api/dishes) - solo ristoratore proprietario
- **Read**: Lista piatti (GET /api/dishes?ristorante=xxx&categoria=xxx)
- **Update**: Modifica piatto (PUT /api/dishes/:id) - solo ristoratore proprietario
- **Delete**: Elimina piatto (DELETE /api/dishes/:id) - solo ristoratore proprietario

### Orders
- **Create**: Crea ordine (POST /api/orders) - solo clienti
- **Read**: Lista ordini (GET /api/orders) - clienti vedono i propri, ristoratori vedono quelli del loro ristorante
- **Update**: Aggiorna stato (PUT /api/orders/:id/status) - solo ristoratore del ristorante
- **Delete**: Non supportata (gli ordini non vengono eliminati per mantenere lo storico)

---

## Dati di Esempio

### Popolazione Database
Il database può essere popolato con dati di esempio utilizzando:
```bash
node seed-data.js
```

Questo crea:
- 1 utente ristoratore (luigi.verdi@example.com)
- 3 ristoranti con menu completi
- 1 utente cliente (mario.rossi@example.com)
- Piatti variati per ogni ristorante

### Credenziali Test
**Ristoratore:**
- Email: luigi.verdi@example.com
- Password: password123

**Cliente:**
- Email: mario.rossi@example.com
- Password: password123

---

## Best Practices

### Sicurezza
- Le password sono sempre hashate con bcrypt prima del salvataggio
- I token JWT sono utilizzati per l'autenticazione stateless
- Le password non sono mai incluse nelle risposte API (campo `select: false`)

### Performance
- Indici creati sui campi di ricerca più comuni
- Query ottimizzate con projection per limitare i dati restituiti
- Popolamento selettivo (populate) solo quando necessario

### Integrità Dati
- Validazione a livello di schema Mongoose
- Validazione aggiuntiva con express-validator nelle route
- Riferimenti controllati prima di operazioni di modifica/eliminazione

---

**Versione**: 1.0  
**Data**: Gennaio 2026
