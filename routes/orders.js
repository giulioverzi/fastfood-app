/**
 * Routes per la gestione degli ordini
 * @module routes/orders
 */

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Dish = require('../models/Dish');
const { protect, authorize } = require('../middleware/auth');

/**
 * @route   GET /api/orders
 * @desc    Ottieni ordini (filtrati per utente/ristorante)
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
  try {
    let query = {};

    // Se cliente, mostra solo i suoi ordini
    if (req.user.ruolo === 'cliente') {
      query.cliente = req.user.id;
    }

    // Se ristoratore, mostra ordini dei suoi ristoranti
    if (req.user.ruolo === 'ristoratore' && req.query.ristorante) {
      query.ristorante = req.query.ristorante;
    }

    const orders = await Order.find(query)
      .populate('cliente', 'nome cognome email telefono')
      .populate('ristorante', 'nome telefono indirizzo')
      .populate('piatti.piatto', 'nome prezzo')
      .sort({ dataOrdine: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero degli ordini',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/orders/:id
 * @desc    Ottieni un ordine specifico
 * @access  Private
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('cliente', 'nome cognome email telefono')
      .populate('ristorante', 'nome telefono indirizzo')
      .populate('piatti.piatto', 'nome descrizione prezzo immagine');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Ordine non trovato'
      });
    }

    // Verifica autorizzazione
    if (req.user.ruolo === 'cliente' && order.cliente._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorizzato a visualizzare questo ordine'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero dell\'ordine',
      error: error.message
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
  body('ristorante').notEmpty().withMessage('Il ristorante è obbligatorio'),
  body('piatti').isArray({ min: 1 }).withMessage('Devi selezionare almeno un piatto'),
  body('modalitaConsegna').isIn(['ritiro', 'consegna']).withMessage('Modalità di consegna non valida')
], async (req, res) => {
  // Validazione
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { ristorante, piatti, modalitaConsegna, indirizzoConsegna, note } = req.body;

    // Verifica e calcola il totale
    let totale = 0;
    const piattiValidati = [];

    for (const item of piatti) {
      const piatto = await Dish.findById(item.piatto);
      
      if (!piatto) {
        return res.status(404).json({
          success: false,
          message: `Piatto ${item.piatto} non trovato`
        });
      }

      if (!piatto.disponibile) {
        return res.status(400).json({
          success: false,
          message: `Piatto ${piatto.nome} non disponibile`
        });
      }

      const prezzoTotale = piatto.prezzo * item.quantita;
      totale += prezzoTotale;

      piattiValidati.push({
        piatto: piatto._id,
        quantita: item.quantita,
        prezzo: piatto.prezzo,
        note: item.note
      });
    }

    // Calcola il tempo di attesa stimato
    const pendingOrders = await Order.countDocuments({
      ristorante,
      stato: { $in: ['ordinato', 'in_preparazione'] }
    });
    
    const tempoAttesaStimato = Order.calcolaTempoAttesa(pendingOrders + 1);

    // Crea l'ordine
    const order = await Order.create({
      cliente: req.user.id,
      ristorante,
      piatti: piattiValidati,
      totale: totale.toFixed(2),
      modalitaConsegna,
      indirizzoConsegna,
      note,
      tempoAttesaStimato
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('ristorante', 'nome telefono indirizzo')
      .populate('piatti.piatto', 'nome');

    res.status(201).json({
      success: true,
      data: populatedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nella creazione dell\'ordine',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/orders/:id/status
 * @desc    Aggiorna lo stato di un ordine
 * @access  Private (solo ristoratori)
 */
router.put('/:id/status', protect, authorize('ristoratore'), async (req, res) => {
  try {
    const { stato } = req.body;

    if (!stato) {
      return res.status(400).json({
        success: false,
        message: 'Lo stato è obbligatorio'
      });
    }

    // Validazione del flusso degli stati
    const validTransitions = {
      'ordinato': ['in_preparazione', 'annullato'],
      'in_preparazione': ['pronto', 'in_consegna', 'annullato'],
      'pronto': ['in_consegna', 'consegnato', 'completato'],
      'in_consegna': ['consegnato', 'completato'],
      'consegnato': ['completato'],
      'completato': [],
      'annullato': []
    };

    const order = await Order.findById(req.params.id).populate('ristorante');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Ordine non trovato'
      });
    }

    // Verifica che l'utente sia il proprietario del ristorante
    if (order.ristorante.proprietario.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorizzato a modificare questo ordine'
      });
    }

    // Verifica che la transizione sia valida
    if (!validTransitions[order.stato].includes(stato)) {
      return res.status(400).json({
        success: false,
        message: `Transizione non valida da "${order.stato}" a "${stato}"`
      });
    }

    order.stato = stato;
    
    if (stato === 'completato' || stato === 'consegnato') {
      order.dataCompletamento = Date.now();
    }

    await order.save();

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nell\'aggiornamento dello stato',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/orders/restaurant/:restaurantId/queue
 * @desc    Ottieni informazioni sulla coda ordini per un ristorante
 * @access  Public
 */
router.get('/restaurant/:restaurantId/queue', async (req, res) => {
  try {
    const pendingOrders = await Order.countDocuments({
      ristorante: req.params.restaurantId,
      stato: { $in: ['ordinato', 'in_preparazione'] }
    });

    // Calcola il tempo di attesa per un nuovo ordine
    const tempoAttesaStimato = Order.calcolaTempoAttesa(pendingOrders + 1);

    res.json({
      success: true,
      data: {
        numeroPersoneInAttesa: pendingOrders,
        tempoAttesaStimato: tempoAttesaStimato
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero delle informazioni sulla coda',
      error: error.message
    });
  }
});

module.exports = router;
