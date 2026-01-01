# Documentazione Swagger API - Fast Food App

## Accesso alla Documentazione Interattiva

La documentazione completa delle API REST è disponibile attraverso Swagger UI, uno strumento interattivo che permette di:
- Esplorare tutti gli endpoint API
- Vedere gli schemi di richiesta e risposta
- Testare le API direttamente dal browser
- Scaricare le specifiche OpenAPI in formato JSON

### URL Documentazione

Una volta avviato il server, la documentazione è accessibile a:

```
http://localhost:3000/api-docs
```

### Download Specifiche OpenAPI

Le specifiche OpenAPI in formato JSON sono scaricabili da:

```
http://localhost:3000/api-docs.json
```

## Struttura API

L'applicazione Fast Food espone le seguenti categorie di endpoint:

### 1. Autenticazione
- **POST /api/auth/register** - Registrazione nuovo utente
- **POST /api/auth/login** - Login e ottenimento token JWT

### 2. Utenti
- **GET /api/users/me** - Ottieni profilo utente corrente (protetto)
- **PUT /api/users/me** - Aggiorna profilo utente (protetto)
- **DELETE /api/users/me** - Elimina account (protetto)

### 3. Ristoranti
- **GET /api/restaurants** - Lista tutti i ristoranti (pubblico)
- **GET /api/restaurants/:id** - Ottieni dettagli ristorante (pubblico)
- **POST /api/restaurants** - Crea nuovo ristorante (solo ristoratori)
- **PUT /api/restaurants/:id** - Aggiorna ristorante (solo proprietario)
- **DELETE /api/restaurants/:id** - Elimina ristorante (solo proprietario)

### 4. Piatti
- **GET /api/dishes** - Lista piatti con filtri (pubblico)
- **GET /api/dishes/:id** - Ottieni dettagli piatto (pubblico)
- **POST /api/dishes** - Crea nuovo piatto (solo ristoratori)
- **PUT /api/dishes/:id** - Aggiorna piatto (solo proprietario ristorante)
- **DELETE /api/dishes/:id** - Elimina piatto (solo proprietario ristorante)

### 5. Ordini
- **GET /api/orders** - Lista ordini utente (protetto)
- **GET /api/orders/:id** - Dettagli ordine specifico (protetto)
- **POST /api/orders** - Crea nuovo ordine (solo clienti)
- **PUT /api/orders/:id/status** - Aggiorna stato ordine (solo ristoratori)

## Autenticazione

La maggior parte degli endpoint richiede autenticazione tramite token JWT.

### Come Ottenere il Token

1. Registrati o effettua il login tramite `/api/auth/register` o `/api/auth/login`
2. Salva il token ricevuto nella risposta
3. Includi il token nelle richieste successive nell'header Authorization:

```
Authorization: Bearer <il_tuo_token_jwt>
```

### Testare in Swagger UI

1. Apri la documentazione Swagger
2. Clicca sul pulsante "Authorize" in alto
3. Inserisci il token nel formato: `Bearer <il_tuo_token>`
4. Clicca "Authorize"
5. Ora puoi testare tutti gli endpoint protetti

## Filtri API

### Piatti (GET /api/dishes)

Parametri query disponibili:
- `ristorante` - Filtra per ID ristorante
- `categoria` - Filtra per categoria (antipasti, primi, secondi, etc.)
- `escludiAllergeni` - Escludi allergeni (es: glutine,latte,uova)
- `vegetariano` - true/false
- `vegano` - true/false

Esempio:
```
GET /api/dishes?categoria=panini&escludiAllergeni=glutine&vegetariano=true
```

### Ordini (GET /api/orders)

Parametri query disponibili:
- `ristorante` - Filtra per ID ristorante (solo ristoratori)
- `cliente` - Filtra per ID cliente
- `stato` - Filtra per stato ordine

## Stati Ordine

Gli ordini possono avere i seguenti stati:

1. **ordinato** - Ordine appena creato
2. **in_preparazione** - In preparazione in cucina
3. **pronto** - Pronto per ritiro/consegna
4. **in_consegna** - In fase di consegna
5. **consegnato** - Consegnato al cliente
6. **completato** - Ordine completato
7. **annullato** - Ordine annullato

## Codici di Stato HTTP

L'API utilizza i seguenti codici di stato:

- **200 OK** - Richiesta completata con successo
- **201 Created** - Risorsa creata con successo
- **400 Bad Request** - Dati della richiesta non validi
- **401 Unauthorized** - Autenticazione richiesta o fallita
- **403 Forbidden** - Accesso negato (permessi insufficienti)
- **404 Not Found** - Risorsa non trovata
- **500 Internal Server Error** - Errore interno del server

## Formato Risposte

### Successo
```json
{
  "success": true,
  "data": { /* dati richiesti */ }
}
```

### Errore
```json
{
  "success": false,
  "message": "Descrizione dell'errore"
}
```

## Esempi Pratici

### Registrazione e Login

```bash
# Registrazione
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Mario",
    "cognome": "Rossi",
    "email": "mario@example.com",
    "password": "password123",
    "ruolo": "cliente"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mario@example.com",
    "password": "password123"
  }'
```

### Creare un Ordine

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "ristorante": "restaurant_id",
    "piatti": [
      {
        "piatto": "dish_id_1",
        "quantita": 2,
        "note": "Senza cipolla"
      }
    ],
    "modalitaConsegna": "consegna",
    "indirizzoConsegna": {
      "via": "Via Roma 1",
      "citta": "Milano",
      "cap": "20100"
    }
  }'
```

## Note di Sicurezza

- Le password vengono hash utilizzando bcrypt
- I token JWT hanno una scadenza configurabile
- Il CVV delle carte di pagamento non viene mai memorizzato
- Tutte le comunicazioni in produzione dovrebbero utilizzare HTTPS

## Supporto

Per problemi o domande sulla documentazione API:
- Consulta la documentazione interattiva su `/api-docs`
- Verifica gli esempi in `backend/API_DOCUMENTATION.md`
- Controlla il codice sorgente in `backend/routes/`
