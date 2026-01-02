# API Documentation - Fast Food App

Base URL: `http://localhost:3000/api`

## Autenticazione

Tutte le route protette richiedono un token JWT nell'header:
```
Authorization: Bearer <token>
```

### Registrazione Utente
**POST** `/auth/register`

**Body:**
```json
{
  "nome": "Mario",
  "cognome": "Rossi",
  "email": "mario@example.com",
  "password": "password123",
  "ruolo": "cliente", // "cliente" o "ristoratore"
  "telefono": "1234567890",
  "indirizzo": {
    "via": "Via Roma 1",
    "citta": "Milano",
    "cap": "20100"
  }
}
```

### Login Utente
**POST** `/auth/login`

**Body:**
```json
{
  "email": "mario@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "nome": "Mario",
    "cognome": "Rossi",
    "email": "mario@example.com",
    "ruolo": "cliente",
    "token": "jwt_token_here"
  }
}
```

## Utenti

### Ottieni Profilo Corrente
**GET** `/users/me` (Protected)

### Aggiorna Profilo
**PUT** `/users/me` (Protected)

**Body:**
```json
{
  "nome": "Mario",
  "cognome": "Rossi",
  "telefono": "0987654321"
}
```

### Elimina Account
**DELETE** `/users/me` (Protected)

## Ristoranti

### Ottieni Tutti i Ristoranti
**GET** `/restaurants`

### Ottieni Ristorante Specifico
**GET** `/restaurants/:id`

### Crea Ristorante
**POST** `/restaurants` (Protected - Solo ristoratori)

**Body:**
```json
{
  "nome": "Fast Food Roma",
  "descrizione": "Il miglior fast food della città",
  "indirizzo": {
    "via": "Via del Corso 100",
    "citta": "Roma",
    "cap": "00100"
  },
  "telefono": "06123456",
  "orariApertura": "Lun-Dom: 11:00-23:00"
}
```

### Aggiorna Ristorante
**PUT** `/restaurants/:id` (Protected - Solo proprietario)

### Elimina Ristorante
**DELETE** `/restaurants/:id` (Protected - Solo proprietario)

## Piatti

### Ottieni Tutti i Piatti
**GET** `/dishes`

**Query Parameters:**
- `ristorante`: ID del ristorante
- `categoria`: antipasti, primi, secondi, contorni, dessert, bevande, panini, pizze, insalate
- `escludiAllergeni`: glutine,latte,uova (separati da virgola)
- `vegetariano`: true/false
- `vegano`: true/false

**Esempio:** `/dishes?ristorante=123&categoria=panini&escludiAllergeni=glutine,latte`

### Ottieni Piatto Specifico
**GET** `/dishes/:id`

### Crea Piatto
**POST** `/dishes` (Protected - Solo ristoratori)

**Body:**
```json
{
  "nome": "Hamburger Classic",
  "descrizione": "Hamburger con carne, insalata, pomodoro e salse",
  "ristorante": "restaurant_id_here",
  "categoria": "panini",
  "prezzo": 8.50,
  "ingredienti": ["pane", "carne", "insalata", "pomodoro", "salse"],
  "allergeni": ["glutine", "uova"],
  "vegetariano": false,
  "vegano": false
}
```

### Aggiorna Piatto
**PUT** `/dishes/:id` (Protected - Solo proprietario del ristorante)

### Elimina Piatto
**DELETE** `/dishes/:id` (Protected - Solo proprietario del ristorante)

## Ordini

### Ottieni Ordini
**GET** `/orders` (Protected)
- Clienti: vedono solo i propri ordini
- Ristoratori: vedono ordini dei propri ristoranti (con query param `ristorante`)

**Query Parameters:**
- `ristorante`: ID del ristorante (solo per ristoratori)

### Ottieni Ordine Specifico
**GET** `/orders/:id` (Protected)

### Crea Ordine
**POST** `/orders` (Protected - Solo clienti)

**Body:**
```json
{
  "ristorante": "restaurant_id_here",
  "piatti": [
    {
      "piatto": "dish_id_1",
      "quantita": 2,
      "note": "Senza cipolla"
    },
    {
      "piatto": "dish_id_2",
      "quantita": 1
    }
  ],
  "modalitaConsegna": "ritiro", // "ritiro" o "consegna"
  "indirizzoConsegna": {
    "via": "Via Roma 1",
    "citta": "Milano",
    "cap": "20100"
  },
  "note": "Suonare al citofono"
}
```

### Aggiorna Stato Ordine
**PUT** `/orders/:id/status` (Protected - Solo ristoratori)

**Body:**
```json
{
  "stato": "in_preparazione"
}
```

**Stati possibili:**
- `ordinato`: Ordine appena creato
- `in_preparazione`: In preparazione
- `pronto`: Pronto per il ritiro/consegna
- `in_consegna`: In consegna
- `consegnato`: Consegnato al cliente
- `completato`: Completato
- `annullato`: Annullato

## Codici di Risposta

- `200`: Successo
- `201`: Risorsa creata con successo
- `400`: Richiesta non valida
- `401`: Non autenticato
- `403`: Non autorizzato
- `404`: Risorsa non trovata
- `500`: Errore del server

## Formato delle Risposte

**Successo:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Errore:**
```json
{
  "success": false,
  "message": "Messaggio di errore"
}
```
