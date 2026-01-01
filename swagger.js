/**
 * Configurazione Swagger per la documentazione API
 * Definisce le specifiche OpenAPI per tutte le route dell'applicazione
 */

const swaggerJsdoc = require('swagger-jsdoc');

// Definizione base delle specifiche Swagger/OpenAPI
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fast Food App API',
      version: '1.0.0',
      description: 'API REST per l\'applicazione Fast Food App - Sistema di gestione ordini online per ristoranti',
      contact: {
        name: 'Marco Portante',
        email: 'support@fastfoodapp.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Server di sviluppo locale'
      },
      {
        url: 'https://fastfoodapp.com',
        description: 'Server di produzione'
      }
    ],
    // Definizione degli schemi di sicurezza
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT ottenuto dal login'
        }
      },
      // Definizione degli schemi dati riutilizzabili
      schemas: {
        User: {
          type: 'object',
          required: ['nome', 'cognome', 'email', 'password', 'ruolo'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID univoco dell\'utente'
            },
            nome: {
              type: 'string',
              description: 'Nome dell\'utente',
              example: 'Mario'
            },
            cognome: {
              type: 'string',
              description: 'Cognome dell\'utente',
              example: 'Rossi'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Indirizzo email dell\'utente',
              example: 'mario@example.com'
            },
            ruolo: {
              type: 'string',
              enum: ['cliente', 'ristoratore'],
              description: 'Ruolo dell\'utente nel sistema',
              example: 'cliente'
            },
            telefono: {
              type: 'string',
              description: 'Numero di telefono',
              example: '+39 123 456 7890'
            },
            indirizzo: {
              type: 'object',
              properties: {
                via: { type: 'string', example: 'Via Roma 1' },
                citta: { type: 'string', example: 'Milano' },
                cap: { type: 'string', example: '20100' }
              }
            },
            dataRegistrazione: {
              type: 'string',
              format: 'date-time',
              description: 'Data di registrazione dell\'utente'
            }
          }
        },
        Restaurant: {
          type: 'object',
          required: ['nome', 'descrizione', 'indirizzo', 'telefono', 'proprietario'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID univoco del ristorante'
            },
            nome: {
              type: 'string',
              description: 'Nome del ristorante',
              example: 'Fast Food Roma'
            },
            descrizione: {
              type: 'string',
              description: 'Descrizione del ristorante',
              example: 'Il miglior fast food della città'
            },
            indirizzo: {
              type: 'object',
              required: ['via', 'citta', 'cap'],
              properties: {
                via: { type: 'string', example: 'Via del Corso 100' },
                citta: { type: 'string', example: 'Roma' },
                cap: { type: 'string', example: '00100' }
              }
            },
            telefono: {
              type: 'string',
              description: 'Numero di telefono del ristorante',
              example: '06 123 456'
            },
            orariApertura: {
              type: 'string',
              description: 'Orari di apertura del ristorante',
              example: 'Lun-Dom: 11:00-23:00'
            },
            proprietario: {
              type: 'string',
              description: 'ID dell\'utente proprietario del ristorante'
            },
            dataCreazione: {
              type: 'string',
              format: 'date-time',
              description: 'Data di creazione del ristorante'
            }
          }
        },
        Dish: {
          type: 'object',
          required: ['nome', 'descrizione', 'ristorante', 'categoria', 'prezzo'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID univoco del piatto'
            },
            nome: {
              type: 'string',
              description: 'Nome del piatto',
              example: 'Hamburger Classic'
            },
            descrizione: {
              type: 'string',
              description: 'Descrizione del piatto',
              example: 'Hamburger con carne, insalata, pomodoro e salse'
            },
            ristorante: {
              type: 'string',
              description: 'ID del ristorante che offre il piatto'
            },
            categoria: {
              type: 'string',
              enum: ['antipasti', 'primi', 'secondi', 'contorni', 'dessert', 'bevande', 'panini', 'pizze', 'insalate'],
              description: 'Categoria del piatto',
              example: 'panini'
            },
            prezzo: {
              type: 'number',
              format: 'float',
              description: 'Prezzo del piatto in euro',
              example: 8.50
            },
            ingredienti: {
              type: 'array',
              items: { type: 'string' },
              description: 'Lista degli ingredienti',
              example: ['pane', 'carne', 'insalata', 'pomodoro', 'salse']
            },
            allergeni: {
              type: 'array',
              items: { type: 'string' },
              description: 'Lista degli allergeni presenti',
              example: ['glutine', 'uova']
            },
            vegetariano: {
              type: 'boolean',
              description: 'Indica se il piatto è vegetariano',
              example: false
            },
            vegano: {
              type: 'boolean',
              description: 'Indica se il piatto è vegano',
              example: false
            },
            disponibile: {
              type: 'boolean',
              description: 'Indica se il piatto è disponibile',
              example: true
            },
            immagine: {
              type: 'string',
              description: 'URL dell\'immagine del piatto',
              example: 'https://example.com/image.jpg'
            }
          }
        },
        Order: {
          type: 'object',
          required: ['cliente', 'ristorante', 'piatti', 'modalitaConsegna', 'totale'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID univoco dell\'ordine'
            },
            cliente: {
              type: 'string',
              description: 'ID del cliente che ha effettuato l\'ordine'
            },
            ristorante: {
              type: 'string',
              description: 'ID del ristorante'
            },
            piatti: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  piatto: { type: 'string', description: 'ID del piatto' },
                  quantita: { type: 'integer', description: 'Quantità ordinata', example: 2 },
                  prezzo: { type: 'number', format: 'float', description: 'Prezzo unitario', example: 8.50 },
                  note: { type: 'string', description: 'Note per il piatto', example: 'Senza cipolla' }
                }
              }
            },
            totale: {
              type: 'number',
              format: 'float',
              description: 'Totale dell\'ordine in euro',
              example: 25.50
            },
            stato: {
              type: 'string',
              enum: ['ordinato', 'in_preparazione', 'pronto', 'in_consegna', 'consegnato', 'completato', 'annullato'],
              description: 'Stato corrente dell\'ordine',
              example: 'ordinato'
            },
            modalitaConsegna: {
              type: 'string',
              enum: ['ritiro', 'consegna'],
              description: 'Modalità di consegna scelta',
              example: 'consegna'
            },
            indirizzoConsegna: {
              type: 'object',
              properties: {
                via: { type: 'string', example: 'Via Roma 1' },
                citta: { type: 'string', example: 'Milano' },
                cap: { type: 'string', example: '20100' }
              }
            },
            note: {
              type: 'string',
              description: 'Note aggiuntive per l\'ordine',
              example: 'Suonare al citofono'
            },
            dataOrdine: {
              type: 'string',
              format: 'date-time',
              description: 'Data e ora dell\'ordine'
            },
            dataCompletamento: {
              type: 'string',
              format: 'date-time',
              description: 'Data e ora di completamento dell\'ordine'
            }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indica se la richiesta è stata completata con successo'
            },
            data: {
              type: 'object',
              description: 'Dati di risposta'
            },
            message: {
              type: 'string',
              description: 'Messaggio descrittivo (in caso di errore)'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Messaggio di errore',
              example: 'Risorsa non trovata'
            }
          }
        }
      }
    },
    // Tag per organizzare gli endpoint
    tags: [
      {
        name: 'Autenticazione',
        description: 'Endpoint per registrazione e login'
      },
      {
        name: 'Utenti',
        description: 'Gestione profilo utente'
      },
      {
        name: 'Ristoranti',
        description: 'Operazioni CRUD sui ristoranti'
      },
      {
        name: 'Piatti',
        description: 'Gestione menu e piatti'
      },
      {
        name: 'Ordini',
        description: 'Creazione e gestione ordini'
      }
    ]
  },
  // Percorsi dei file da cui estrarre le annotazioni JSDoc
  // Nota: I percorsi sono relativi alla root del progetto dove viene eseguito server.js
  apis: [
    './backend/routes/*.js',
    './server.js'
  ]
};

// Genera le specifiche Swagger
const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
