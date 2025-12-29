# Sample Data for Fast Food App

This file contains sample data that can be used to populate the database for testing purposes.

## Sample Users

### Cliente 1
- Nome: Mario
- Cognome: Rossi
- Email: mario.rossi@example.com
- Password: password123
- Ruolo: cliente
- Telefono: 333-1234567
- Indirizzo: Via Roma 10, Milano, 20100

### Ristoratore 1
- Nome: Luigi
- Cognome: Verdi
- Email: luigi.verdi@example.com
- Password: password123
- Ruolo: ristoratore
- Telefono: 333-7654321

## Sample Restaurants

### Burger Palace
- Nome: Burger Palace
- Descrizione: Il miglior hamburger della città con ingredienti freschi e di qualità
- Indirizzo: Via del Corso 100, Roma, 00100
- Telefono: 06-12345678
- Orari: Lun-Dom: 11:00-23:00

### Pizza Express
- Nome: Pizza Express
- Descrizione: Pizze napoletane cotte nel forno a legna
- Indirizzo: Piazza Garibaldi 5, Napoli, 80100
- Telefono: 081-9876543
- Orari: Lun-Dom: 12:00-00:00

## Sample Dishes

### For Burger Palace

1. **Hamburger Classic**
   - Categoria: panini
   - Prezzo: 8.50
   - Ingredienti: pane, carne di manzo, insalata, pomodoro, salse
   - Allergeni: glutine, uova
   - Vegetariano: No
   - Vegano: No

2. **Cheeseburger Deluxe**
   - Categoria: panini
   - Prezzo: 9.50
   - Ingredienti: pane, carne di manzo, formaggio cheddar, bacon, insalata, pomodoro, salse
   - Allergeni: glutine, latte, uova
   - Vegetariano: No
   - Vegano: No

3. **Veggie Burger**
   - Categoria: panini
   - Prezzo: 7.50
   - Ingredienti: pane integrale, burger di verdure, insalata, pomodoro, salse vegane
   - Allergeni: glutine, soia
   - Vegetariano: Sì
   - Vegano: Sì

4. **Patatine Fritte**
   - Categoria: contorni
   - Prezzo: 3.50
   - Ingredienti: patate, sale
   - Allergeni: -
   - Vegetariano: Sì
   - Vegano: Sì

5. **Coca Cola**
   - Categoria: bevande
   - Prezzo: 2.50
   - Ingredienti: acqua, zucchero, aromi
   - Allergeni: -
   - Vegetariano: Sì
   - Vegano: Sì

### For Pizza Express

1. **Pizza Margherita**
   - Categoria: pizze
   - Prezzo: 6.00
   - Ingredienti: farina, pomodoro, mozzarella, basilico, olio
   - Allergeni: glutine, latte
   - Vegetariano: Sì
   - Vegano: No

2. **Pizza Diavola**
   - Categoria: pizze
   - Prezzo: 7.50
   - Ingredienti: farina, pomodoro, mozzarella, salame piccante, olio
   - Allergeni: glutine, latte
   - Vegetariano: No
   - Vegano: No

3. **Pizza Capricciosa**
   - Categoria: pizze
   - Prezzo: 8.00
   - Ingredienti: farina, pomodoro, mozzarella, prosciutto, funghi, carciofi, olive
   - Allergeni: glutine, latte
   - Vegetariano: No
   - Vegano: No

4. **Tiramisù**
   - Categoria: dessert
   - Prezzo: 4.50
   - Ingredienti: savoiardi, mascarpone, caffè, cacao
   - Allergeni: glutine, uova, latte
   - Vegetariano: Sì
   - Vegano: No

## Notes

To add this data to your database, you can:
1. Use the API endpoints to create users, restaurants, and dishes
2. Use the web interface after registering
3. Create a seeding script using the Mongoose models
