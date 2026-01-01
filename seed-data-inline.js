/**
 * Modulo per il popolamento del database con dati di esempio
 */

const User = require('./backend/models/User');
const Restaurant = require('./backend/models/Restaurant');
const Dish = require('./backend/models/Dish');

async function seedDatabase() {
  try {
    console.log('Inizio popolamento database...');

    // Pulisci il database
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await Dish.deleteMany({});

    // Crea un proprietario di ristorante
    const owner = await User.create({
      nome: 'Luigi',
      cognome: 'Verdi',
      email: 'luigi.verdi@example.com',
      password: 'password123',
      ruolo: 'ristoratore',
      telefono: '333-7654321'
    });
    console.log('Creato proprietario ristorante');

    // Crea ristoranti
    const restaurant1 = await Restaurant.create({
      nome: 'Burger Palace',
      descrizione: 'Il miglior hamburger della città con ingredienti freschi e di qualità',
      indirizzo: {
        via: 'Via del Corso 100',
        citta: 'Roma',
        cap: '00100'
      },
      telefono: '06-12345678',
      orariApertura: 'Lun-Dom: 11:00-23:00',
      proprietario: owner._id,
      immagine: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop'
    });

    const restaurant2 = await Restaurant.create({
      nome: 'Pizza Express',
      descrizione: 'Pizze napoletane cotte nel forno a legna',
      indirizzo: {
        via: 'Piazza Garibaldi 5',
        citta: 'Napoli',
        cap: '80100'
      },
      telefono: '081-9876543',
      orariApertura: 'Lun-Dom: 12:00-00:00',
      proprietario: owner._id,
      immagine: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop'
    });

    const restaurant3 = await Restaurant.create({
      nome: 'Sushi Bar',
      descrizione: 'Sushi fresco e autentico preparato da chef esperti',
      indirizzo: {
        via: 'Via Montenapoleone 8',
        citta: 'Milano',
        cap: '20121'
      },
      telefono: '02-5551234',
      orariApertura: 'Mar-Dom: 12:00-23:00',
      proprietario: owner._id,
      immagine: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop'
    });

    console.log('Creati 3 ristoranti');

    // Crea piatti per Burger Palace
    await Dish.create([
      {
        nome: 'Hamburger Classic',
        descrizione: 'Il nostro classico hamburger con carne di manzo, insalata fresca e salse speciali',
        ristorante: restaurant1._id,
        categoria: 'panini',
        prezzo: 8.50,
        ingredienti: ['pane', 'carne di manzo', 'insalata', 'pomodoro', 'salse'],
        allergeni: ['glutine', 'uova'],
        vegetariano: false,
        vegano: false,
        disponibile: true,
        immagine: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop'
      },
      {
        nome: 'Cheeseburger Deluxe',
        descrizione: 'Hamburger con formaggio cheddar, bacon croccante e verdure fresche',
        ristorante: restaurant1._id,
        categoria: 'panini',
        prezzo: 9.50,
        ingredienti: ['pane', 'carne di manzo', 'formaggio cheddar', 'bacon', 'insalata', 'pomodoro'],
        allergeni: ['glutine', 'latte', 'uova'],
        vegetariano: false,
        vegano: false,
        disponibile: true,
        immagine: 'https://images.unsplash.com/photo-1551615593-ef5fe247e8f7?w=400&h=300&fit=crop'
      },
      {
        nome: 'Veggie Burger',
        descrizione: 'Burger vegetale con verdure grigliate e salse vegane',
        ristorante: restaurant1._id,
        categoria: 'panini',
        prezzo: 7.50,
        ingredienti: ['pane integrale', 'burger di verdure', 'insalata', 'pomodoro', 'salse vegane'],
        allergeni: ['glutine', 'soia'],
        vegetariano: true,
        vegano: true,
        disponibile: true,
        immagine: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&h=300&fit=crop'
      },
      {
        nome: 'Patatine Fritte',
        descrizione: 'Patatine croccanti servite con salse a scelta',
        ristorante: restaurant1._id,
        categoria: 'contorni',
        prezzo: 3.50,
        ingredienti: ['patate', 'sale'],
        allergeni: [],
        vegetariano: true,
        vegano: true,
        disponibile: true,
        immagine: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop'
      }
    ]);

    // Crea piatti per Pizza Express
    await Dish.create([
      {
        nome: 'Pizza Margherita',
        descrizione: 'La classica pizza napoletana con mozzarella e basilico',
        ristorante: restaurant2._id,
        categoria: 'pizze',
        prezzo: 6.00,
        ingredienti: ['farina', 'pomodoro', 'mozzarella', 'basilico', 'olio'],
        allergeni: ['glutine', 'latte'],
        vegetariano: true,
        vegano: false,
        disponibile: true,
        immagine: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop'
      },
      {
        nome: 'Pizza Diavola',
        descrizione: 'Pizza piccante con salame e peperoncino',
        ristorante: restaurant2._id,
        categoria: 'pizze',
        prezzo: 7.50,
        ingredienti: ['farina', 'pomodoro', 'mozzarella', 'salame piccante', 'olio'],
        allergeni: ['glutine', 'latte'],
        vegetariano: false,
        vegano: false,
        disponibile: true,
        immagine: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop'
      },
      {
        nome: 'Tiramisù',
        descrizione: 'Il famoso dolce italiano con mascarpone e caffè',
        ristorante: restaurant2._id,
        categoria: 'dessert',
        prezzo: 4.50,
        ingredienti: ['savoiardi', 'mascarpone', 'caffè', 'cacao'],
        allergeni: ['glutine', 'uova', 'latte'],
        vegetariano: true,
        vegano: false,
        disponibile: true,
        immagine: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop'
      }
    ]);

    // Crea piatti per Sushi Bar
    await Dish.create([
      {
        nome: 'Sushi Misto',
        descrizione: 'Selezione di nigiri e sashimi di pesce fresco',
        ristorante: restaurant3._id,
        categoria: 'primi',
        prezzo: 15.00,
        ingredienti: ['riso', 'salmone', 'tonno', 'pesce spada', 'wasabi', 'zenzero'],
        allergeni: ['pesce', 'soia'],
        vegetariano: false,
        vegano: false,
        disponibile: true,
        immagine: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop'
      },
      {
        nome: 'Uramaki California',
        descrizione: 'Roll con avocado, cetriolo e surimi',
        ristorante: restaurant3._id,
        categoria: 'primi',
        prezzo: 8.00,
        ingredienti: ['riso', 'alga nori', 'avocado', 'cetriolo', 'surimi', 'sesamo'],
        allergeni: ['pesce', 'soia', 'sesamo'],
        vegetariano: false,
        vegano: false,
        disponibile: true,
        immagine: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=400&h=300&fit=crop'
      }
    ]);

    console.log('Creati piatti per tutti i ristoranti');
    
    // Crea un utente cliente
    await User.create({
      nome: 'Mario',
      cognome: 'Rossi',
      email: 'mario.rossi@example.com',
      password: 'password123',
      ruolo: 'cliente',
      telefono: '333-1234567',
      indirizzo: {
        via: 'Via Roma 10',
        citta: 'Milano',
        cap: '20100'
      }
    });
    console.log('Creato utente cliente');

    console.log('Popolamento database completato con successo!');
  } catch (error) {
    console.error('Errore durante il popolamento del database:', error);
    throw error;
  }
}

module.exports = seedDatabase;
