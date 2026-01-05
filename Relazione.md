# Relazione Tecnica - Fast Food App

**Progetto:** Programmazione Web e Mobile  
**Anno Accademico:** 2025/2026  
**Studente:** Marco Portante  
**Data:** Gennaio 2026

---

## Indice

1. [Introduzione](#introduzione)
2. [Front-End](#front-end)
3. [Back-End](#back-end)
4. [Database MongoDB](#database-mongodb)
5. [API REST](#api-rest)
6. [Conclusioni](#conclusioni)

---

# Introduzione

Il progetto "Fast Food App" e' un'applicazione web per la gestione di ordini in ristoranti fast food. L'applicazione permette a due tipologie di utenti (clienti e ristoratori) di interagire con il sistema.

**Funzionalita principali:**
- Registrazione e autenticazione utenti (cliente/ristoratore)
- Gestione ristoranti e menu (per ristoratori)
- Ricerca piatti con filtri (categoria, allergeni, vegetariano/vegano)
- Creazione e gestione ordini (per clienti)
- Aggiornamento stato ordini (per ristoratori)

**Tecnologie utilizzate:**
- Front-End: HTML5, CSS3, JavaScript ES6+
- Back-End: Node.js, Express.js
- Database: MongoDB con Mongoose
- Autenticazione: JSON Web Token (JWT)

---

## Front-End

### Struttura delle pagine HTML

Le pagine HTML si trovano in `/public/html/`:

| File | Descrizione |
|------|-------------|
| `index.html` | Homepage con ristoranti consigliati |
| `login.html` | Pagina di login |
| `register.html` | Pagina di registrazione |
| `menu.html` | Lista ristoranti disponibili |
| `restaurant.html` | Dettaglio ristorante e menu |
| `checkout.html` | Completamento ordine |
| `dashboard-customer.html` | Dashboard cliente (storico ordini) |
| `dashboard-restaurant.html` | Dashboard ristoratore (gestione) |

### Fogli di stile CSS

I file CSS si trovano in `/public/Css/`:

| File | Descrizione |
|------|-------------|
| `style.css` | Stili principali dell'applicazione |
| `layout.css` | Layout e componenti riutilizzabili |

### Script JavaScript

Gli script si trovano in `/public/scripts/`:

| File | Descrizione |
|------|-------------|
| `common.js` | Funzioni condivise (autenticazione, chiamate API) |
| `app.js` | Logica homepage |
| `login.js` | Gestione form login |
| `register.js` | Gestione form registrazione |
| `menu.js` | Visualizzazione lista ristoranti |
| `restaurant.js` | Visualizzazione menu e carrello |
| `checkout.js` | Gestione checkout ordine |
| `customer.js` | Dashboard cliente |
| `restaurant-dashboard.js` | Dashboard ristoratore |

---

## Back-End

### Struttura del progetto

```
/backend
  /config
    database.js       # Configurazione connessione MongoDB
  /controllers
    autenticazioneController.js  # Logica autenticazione
  /middleware
    auth.js           # Middleware autenticazione JWT
    errorHandler.js   # Gestione errori centralizzata
    validation.js     # Validazione input
  /models
    User.js           # Modello utente
    Restaurant.js     # Modello ristorante
    Dish.js           # Modello piatto
    Order.js          # Modello ordine
  /routes
    auth.js           # Rotte autenticazione
    restaurants.js    # Rotte ristoranti
    dishes.js         # Rotte piatti
    orders.js         # Rotte ordini
    users.js          # Rotte profilo utente
```

### File delle Rotte (routes)

#### auth.js - Rotte Autenticazione
- `POST /api/auth/register` - Registrazione nuovo utente
- `POST /api/auth/login` - Login utente
- `GET /api/auth/verify` - Verifica token JWT

#### restaurants.js - Rotte Ristoranti
- `GET /api/restaurants` - Lista tutti i ristoranti
- `GET /api/restaurants/:id` - Dettaglio ristorante
- `POST /api/restaurants` - Crea ristorante (solo ristoratori)
- `PUT /api/restaurants/:id` - Modifica ristorante (solo proprietario)
- `DELETE /api/restaurants/:id` - Elimina ristorante (solo proprietario)

#### dishes.js - Rotte Piatti
- `GET /api/dishes` - Lista piatti con filtri
- `GET /api/dishes/restaurant/:restaurantId` - Piatti di un ristorante
- `GET /api/dishes/:id` - Dettaglio piatto
- `POST /api/dishes` - Crea piatto (solo ristoratori)
- `PUT /api/dishes/:id` - Modifica piatto (solo proprietario)
- `DELETE /api/dishes/:id` - Elimina piatto (solo proprietario)

#### orders.js - Rotte Ordini
- `GET /api/orders` - Ordini dell'utente autenticato
- `GET /api/orders/:id` - Dettaglio ordine
- `POST /api/orders` - Crea ordine (solo clienti)
- `PUT /api/orders/:id` - Aggiorna stato ordine
- `GET /api/orders/restaurant/:restaurantId` - Ordini di un ristorante

#### users.js - Rotte Profilo
- `GET /api/users/profile` - Profilo utente
- `PUT /api/users/profile` - Modifica profilo
- `PUT /api/users/password` - Cambia password
- `DELETE /api/users/account` - Elimina account

### Codici HTTP utilizzati

| Codice | Significato | Utilizzo |
|--------|-------------|----------|
| 200 | OK | Richiesta completata con successo |
| 201 | Created | Risorsa creata (registrazione, nuovo ordine) |
| 400 | Bad Request | Dati non validi o email duplicata |
| 401 | Unauthorized | Token mancante o non valido |
| 403 | Forbidden | Utente non autorizzato per l'operazione |
| 404 | Not Found | Risorsa non trovata |
| 500 | Internal Server Error | Errore generico del server |

---

## Database MongoDB

Il database utilizza MongoDB con 4 collezioni principali.

### Collezione: users

Memorizza i dati degli utenti registrati.

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| _id | ObjectId | Identificativo univoco |
| nome | String | Nome dell'utente |
| cognome | String | Cognome dell'utente |
| email | String | Email (unica, indicizzata) |
| password | String | Password hashata con bcrypt |
| ruolo | String | "cliente" oppure "ristoratore" |
| telefono | String | Numero di telefono |
| indirizzo | Object | Oggetto con via, citta, cap |
| createdAt | Date | Data di registrazione |

### Collezione: restaurants

Memorizza i dati dei ristoranti.

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| _id | ObjectId | Identificativo univoco |
| nome | String | Nome del ristorante |
| descrizione | String | Descrizione del ristorante |
| proprietario | ObjectId | Riferimento all'utente ristoratore |
| indirizzo | Object | Oggetto con via, citta, cap |
| telefono | String | Numero di telefono |
| email | String | Email del ristorante |
| orari | Object | Orari di apertura per ogni giorno |
| immagine | String | URL immagine ristorante |
| categoria | String | Categoria (es. "Fast Food") |
| createdAt | Date | Data di creazione |

### Collezione: meals (dishes)

Memorizza i piatti disponibili nei menu.

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| _id | ObjectId | Identificativo univoco |
| nome | String | Nome del piatto |
| descrizione | String | Descrizione del piatto |
| prezzoCentesimi | Number | Prezzo in centesimi (evita errori decimali) |
| categoria | String | antipasto, primo, secondo, contorno, dolce, bevanda, panino, pizza |
| ristorante | ObjectId | Riferimento al ristorante |
| immagine | String | URL immagine piatto |
| ingredienti | Array | Lista ingredienti |
| allergeni | Array | Lista allergeni presenti |
| vegetariano | Boolean | Se il piatto e' vegetariano |
| vegano | Boolean | Se il piatto e' vegano |
| disponibile | Boolean | Se il piatto e' disponibile |
| createdAt | Date | Data di creazione |

### Collezione: orders

Memorizza gli ordini effettuati.

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| _id | ObjectId | Identificativo univoco |
| cliente | ObjectId | Riferimento all'utente cliente |
| ristorante | ObjectId | Riferimento al ristorante |
| piatti | Array | Lista oggetti con piatto, quantita, prezzoCentesimi |
| totaleCentesimi | Number | Totale ordine in centesimi |
| stato | String | ordinato, in preparazione, pronto, in consegna, consegnato, completato, annullato |
| modalita | String | "ritiro" oppure "consegna" |
| indirizzo | Object | Indirizzo consegna (se modalita=consegna) |
| note | String | Note aggiuntive |
| createdAt | Date | Data ordine |
| updatedAt | Date | Ultimo aggiornamento |

### Relazioni tra collezioni

1. **users -> restaurants**: Un ristoratore puo possedere piu ristoranti (1:N)
2. **restaurants -> meals**: Un ristorante ha piu piatti nel menu (1:N)
3. **users -> orders**: Un cliente puo effettuare piu ordini (1:N)
4. **restaurants -> orders**: Un ristorante riceve piu ordini (1:N)

---

## API REST

La documentazione completa delle API e' disponibile in formato OpenAPI/Swagger:
- `/lib/api/docs/swagger.json`
- `/lib/api/docs/swagger.yaml`

Quando il server e' in esecuzione, la documentazione interattiva e' accessibile su:
`http://localhost:5000/api-docs`

---

## Conclusioni

Il progetto "Fast Food App" implementa un'applicazione web completa con architettura client-server. 

**Obiettivi raggiunti:**
- Separazione netta tra front-end e back-end
- API REST con autenticazione JWT
- Database MongoDB con relazioni tra collezioni
- Gestione ruoli (cliente/ristoratore)
- Codici HTTP usati correttamente

**Competenze acquisite:**
- Sviluppo full-stack con Node.js
- Gestione database NoSQL
- Autenticazione basata su token
- Documentazione API con Swagger

---

**Fine Relazione**

Data di consegna: Gennaio 2026
