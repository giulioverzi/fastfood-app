/**
 * Orders Routes - Route per la gestione degli ordini
 * 
 * Gestisce CRUD degli ordini
 */

const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const Order = require('../models/Order');
const Dish = require('../models/Dish');
const Restaurant = require('../models/Restaurant');
const { protect, authorize } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

/**
 * @route   GET /api/orders
 * @desc    Ottieni gli ordini dell'utente autenticato
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
  try {
    let ordini;
    
    if (req.user.ruolo === 'cliente') {
      // Cliente: vede solo i propri ordini
      ordini = await Order.getOrdiniCliente(req.user._id, req.query);
    } else if (req.user.ruolo === 'ristoratore') {
      // Ristoratore: vede gli ordini dei suoi ristoranti
      const ristoranti = await Restaurant.find({ proprietario: req.user._id });
      const ristorantiIds = ristoranti.map(r => r._id);
      
      ordini = await Order.find({ ristorante: { $in: ristorantiIds } })
        .populate('cliente', 'nome cognome telefono indirizzo')
        .populate('ristorante', 'nome')
        .populate('piatti.piatto', 'nome')
        .sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      count: ordini.length,
      data: ordini
    });
  } catch (error) {
    console.error('Errore recupero ordini:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante il recupero degli ordini'
    });
  }
});

/**
 * @route   GET /api/orders/:id
 * @desc    Ottieni un ordine specifico
 * @access  Private
 */
router.get('/:id', [
  protect,
  param('id').isMongoId().withMessage('ID ordine non valido'),
  handleValidationErrors
], async (req, res) => {
  try {
    const ordine = await Order.findById(req.params.id)
      .populate('cliente', 'nome cognome telefono email indirizzo')
      .populate('ristorante', 'nome indirizzo telefono')
      .populate('piatti.piatto', 'nome descrizione immagine');

    if (!ordine) {
      return res.status(404).json({
        success: false,
        message: 'Ordine non trovato'
      });
    }

    // Verifica autorizzazione
    const isCliente = ordine.cliente._id.toString() === req.user._id.toString();
    let isRistoratore = false;
    
    if (req.user.ruolo === 'ristoratore') {
      const ristorante = await Restaurant.findById(ordine.ristorante._id);
      isRistoratore = ristorante && ristorante.proprietario.toString() === req.user._id.toString();
    }

    if (!isCliente && !isRistoratore) {
      return res.status(403).json({
        success: false,
        message: 'Non sei autorizzato a visualizzare questo ordine'
      });
    }

    res.status(200).json({
      success: true,
      data: ordine
    });
  } catch (error) {
    console.error('Errore recupero ordine:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante il recupero dell\'ordine'
    });
  }
});

/**
 * @route   POST /api/orders
 * @desc    Crea un nuovo ordine
 * @access  Private (solo clienti)
 */
router.post('/', [
  protect,
  authorize('cliente'),
  body('ristorante').isMongoId().withMessage('ID ristorante non valido'),
  body('piatti').isArray({ min: 1 }).withMessage('Devi ordinare almeno un piatto'),
  body('piatti.*.piatto').isMongoId().withMessage('ID piatto non valido'),
  body('piatti.*.quantita').isInt({ min: 1 }).withMessage('La quantità deve essere almeno 1'),
  body('modalita').isIn(['ritiro', 'consegna']).withMessage('Modalità non valida'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { ristorante, piatti, modalita, indirizzo, note } = req.body;

    // Verifica che il ristorante esista
    const ristoranteDoc = await Restaurant.findById(ristorante);
    if (!ristoranteDoc) {
      return res.status(404).json({
        success: false,
        message: 'Ristorante non trovato'
      });
    }

    // Verifica che tutti i piatti esistano e appartengano al ristorante
    const piattiIds = piatti.map(item => item.piatto);
    const piattiDocs = await Dish.find({ _id: { $in: piattiIds } });
    
    if (piattiDocs.length !== piatti.length) {
      return res.status(404).json({
        success: false,
        message: 'Uno o più piatti non sono stati trovati'
      });
    }
    
    // Crea un map per accesso rapido ai piatti
    const piattiMap = new Map(piattiDocs.map(p => [p._id.toString(), p]));
    
    const piattiConPrezzo = [];
    for (const item of piatti) {
      const piatto = piattiMap.get(item.piatto);
      
      if (!piatto) {
        return res.status(404).json({
          success: false,
          message: 'Piatto non trovato'
        });
      }
      
      if (piatto.ristorante.toString() !== ristorante) {
        return res.status(400).json({
          success: false,
          message: `Il piatto ${piatto.nome} non appartiene a questo ristorante`
        });
      }
      
      if (!piatto.disponibile) {
        return res.status(400).json({
          success: false,
          message: `Il piatto ${piatto.nome} non è disponibile`
        });
      }
      
      piattiConPrezzo.push({
        piatto: piatto._id,
        quantita: item.quantita,
        prezzo: piatto.prezzo
      });
    }

    // Crea l'ordine
    const ordine = await Order.create({
      cliente: req.user._id,
      ristorante,
      piatti: piattiConPrezzo,
      modalita,
      indirizzo: modalita === 'consegna' ? indirizzo : undefined,
      note
    });

    const ordineCompleto = await Order.findById(ordine._id)
      .populate('ristorante', 'nome indirizzo telefono')
      .populate('piatti.piatto', 'nome immagine');

    res.status(201).json({
      success: true,
      message: 'Ordine creato con successo',
      data: ordineCompleto
    });
  } catch (error) {
    console.error('Errore creazione ordine:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Errore durante la creazione dell\'ordine'
    });
  }
});

/**
 * @route   PUT /api/orders/:id
 * @desc    Aggiorna lo stato di un ordine
 * @access  Private (ristoratori per i propri ordini)
 */
router.put('/:id', [
  protect,
  param('id').isMongoId().withMessage('ID ordine non valido'),
  body('stato').isIn(['ordinato', 'in preparazione', 'pronto', 'in consegna', 'consegnato', 'completato', 'annullato'])
    .withMessage('Stato non valido'),
  handleValidationErrors
], async (req, res) => {
  try {
    let ordine = await Order.findById(req.params.id);

    if (!ordine) {
      return res.status(404).json({
        success: false,
        message: 'Ordine non trovato'
      });
    }

    // Verifica autorizzazione
    if (req.user.ruolo === 'ristoratore') {
      const ristorante = await Restaurant.findById(ordine.ristorante);
      if (!ristorante || ristorante.proprietario.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Non sei autorizzato a modificare questo ordine'
        });
      }
    } else if (req.user.ruolo === 'cliente') {
      // I clienti possono solo annullare ordini in stato 'ordinato'
      if (ordine.cliente.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Non sei autorizzato a modificare questo ordine'
        });
      }
      if (req.body.stato !== 'annullato' || ordine.stato !== 'ordinato') {
        return res.status(403).json({
          success: false,
          message: 'Puoi annullare solo ordini appena effettuati'
        });
      }
    }

    ordine = await Order.findByIdAndUpdate(
      req.params.id,
      { stato: req.body.stato },
      { new: true, runValidators: true }
    )
    .populate('ristorante', 'nome')
    .populate('piatti.piatto', 'nome');

    res.status(200).json({
      success: true,
      message: 'Stato ordine aggiornato con successo',
      data: ordine
    });
  } catch (error) {
    console.error('Errore aggiornamento ordine:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante l\'aggiornamento dell\'ordine'
    });
  }
});

/**
 * @route   GET /api/orders/restaurant/:restaurantId
 * @desc    Ottieni gli ordini di un ristorante specifico
 * @access  Private (solo proprietario del ristorante)
 */
router.get('/restaurant/:restaurantId', [
  protect,
  authorize('ristoratore'),
  param('restaurantId').isMongoId().withMessage('ID ristorante non valido'),
  handleValidationErrors
], async (req, res) => {
  try {
    // Verifica che l'utente sia il proprietario del ristorante
    const ristorante = await Restaurant.findById(req.params.restaurantId);
    
    if (!ristorante) {
      return res.status(404).json({
        success: false,
        message: 'Ristorante non trovato'
      });
    }
    
    if (ristorante.proprietario.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Non sei autorizzato a visualizzare gli ordini di questo ristorante'
      });
    }

    const ordini = await Order.getOrdiniRistorante(req.params.restaurantId, req.query);

    res.status(200).json({
      success: true,
      count: ordini.length,
      data: ordini
    });
  } catch (error) {
    console.error('Errore recupero ordini ristorante:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante il recupero degli ordini'
    });
  }
});

module.exports = router;
