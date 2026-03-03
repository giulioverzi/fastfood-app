/**
 * carrello.js - Classe per la gestione del carrello
 * Gestisce l'aggiunta, rimozione e calcolo del totale degli articoli nel carrello
 */

class Carrello {
  constructor() {
    this.articoli = this.caricaDaStorage();
  }

  /**
   * Carica il carrello dal localStorage
   * @returns {Array} Array di articoli nel carrello
   */
  caricaDaStorage() {
    const datiCarrello = localStorage.getItem('cart');
    return datiCarrello ? JSON.parse(datiCarrello) : [];
  }

  /**
   * Salva il carrello nel localStorage
   */
  salvaSuStorage() {
    localStorage.setItem('cart', JSON.stringify(this.articoli));
    if (typeof updateCartIcon === 'function') {
      updateCartIcon();
    }
  }

  /**
   * Aggiunge un piatto al carrello
   * @param {string} idPiatto - ID del piatto
   * @param {object} datiPiatto - Dati del piatto (nome, prezzo, ristorante, ecc.)
   */
  aggiungi(idPiatto, datiPiatto) {
    // Controlla se ci sono già articoli da un altro ristorante
    if (this.articoli.length > 0 && this.articoli[0].ristorante !== datiPiatto.ristorante) {
      const ristorantePrecedente = this.articoli[0].ristoranteNome;
      const ristoranteCorrente = datiPiatto.ristoranteNome;

      const messaggio = `Hai già piatti nel carrello da "${ristorantePrecedente}".\nAggiungendo piatti da "${ristoranteCorrente}", il carrello verrà svuotato.\nVuoi continuare?`;
      if (!confirm(messaggio)) {
        return;
      }
      this.articoli = [];
    }

    const articoloEsistente = this.articoli.find(a => a.piatto === idPiatto);

    if (articoloEsistente) {
      articoloEsistente.quantita += 1;
    } else {
      this.articoli.push({
        piatto: idPiatto,
        nome: datiPiatto.nome,
        prezzoCentesimi: datiPiatto.prezzoCentesimi,
        ristorante: datiPiatto.ristorante,
        ristoranteNome: datiPiatto.ristoranteNome,
        immagine: datiPiatto.immagine,
        quantita: 1
      });
    }

    this.salvaSuStorage();
  }

  /**
   * Rimuove un piatto dal carrello
   * @param {string} idPiatto - ID del piatto da rimuovere
   */
  rimuovi(idPiatto) {
    this.articoli = this.articoli.filter(a => a.piatto !== idPiatto);
    this.salvaSuStorage();
  }

  /**
   * Aggiorna la quantità di un articolo
   * @param {string} idPiatto - ID del piatto
   * @param {number} nuovaQuantita - Nuova quantità
   */
  aggiornaQuantita(idPiatto, nuovaQuantita) {
    if (nuovaQuantita <= 0) {
      this.rimuovi(idPiatto);
      return;
    }
    const articolo = this.articoli.find(a => a.piatto === idPiatto);
    if (articolo) {
      articolo.quantita = nuovaQuantita;
      this.salvaSuStorage();
    }
  }

  /**
   * Calcola il totale del carrello in centesimi
   * @returns {number} Totale in centesimi
   */
  getTotale() {
    return this.articoli.reduce((totale, articolo) => {
      return totale + (articolo.prezzoCentesimi * articolo.quantita);
    }, 0);
  }

  /**
   * Restituisce il numero totale di articoli nel carrello
   * @returns {number} Numero di articoli
   */
  getNumeroArticoli() {
    return this.articoli.reduce((totale, articolo) => totale + articolo.quantita, 0);
  }

  /**
   * Svuota completamente il carrello
   */
  svuota() {
    this.articoli = [];
    this.salvaSuStorage();
  }

  /**
   * Verifica se il carrello è vuoto
   * @returns {boolean} true se vuoto
   */
  isEmpty() {
    return this.articoli.length === 0;
  }
}
