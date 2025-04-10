const express = require('express');
const dbrouter = express.Router();
const mongoose = require('mongoose');
require('dotenv').config();

// Cesta pro inicializaci databáze
dbrouter.get('/init', async (req, res) => {
  // Kontrola, zda existuje proměnná MONGODB_URI
  if (!process.env.MONGODB_URI) {
    return res.status(500).send('Chyba: MONGODB_URI není nastavená. Prosím nastavte připojovací řetězec k MongoDB.');
  }

  try {
    // Připojení k MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Kontrola, zda model již existuje
    let Uzivatel;
    try {
      // Zkusíme získat existující model
      Uzivatel = mongoose.model('Uzivatel');
      
      // Vyčistíme kolekci, ale zachováme model
      await Uzivatel.deleteMany({});
      console.log('Existující kolekce byla resetována');
    } catch (err) {
      // Model neexistuje, vytvoříme ho
      const uzivatelSchema = new mongoose.Schema({
        jmeno: {
          type: String,
          required: true,
          unique: true,
        },
        heslo: {
          type: String,
          required: true,
        }
      });

      // Registrace modelu
      Uzivatel = mongoose.model('Uzivatel', uzivatelSchema);
      console.log('Model byl vytvořen');
    }

    res.send('Databáze MongoDB byla úspěšně inicializována! Kolekce uživatelů je připravena.');
  } catch (err) {
    console.error('Chyba při inicializaci MongoDB:', err);
    res.status(500).send(`Chyba při inicializaci MongoDB: ${err.message}`);
  }
});

// Cesta pro zobrazení uživatelů z databáze
dbrouter.get('/scan', async (req, res) => {
  // Kontrola, zda existuje proměnná MONGODB_URI
  if (!process.env.MONGODB_URI) {
    return res.status(500).send('Chyba: MONGODB_URI není nastavená. Prosím nastavte připojovací řetězec k MongoDB.');
  }

  try {
    // Připojení k MongoDB, pokud již není připojeno
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    }

    // Získání modelu uživatele
    const Uzivatel = mongoose.model('Uzivatel');
    
    // Načtení všech uživatelů
    const uzivatele = await Uzivatel.find().sort('_id');
    
    // Formátování výsledků jako ASCII tabulka
    let tableOutput = '';
    
    // Záhlaví tabulky
    tableOutput += '+------+------------+--------------------------------------------------------------+\n';
    tableOutput += '| ID   | Jméno      | Heslo (hash)                                                |\n';
    tableOutput += '+------+------------+--------------------------------------------------------------+\n';
    
    // Řádky tabulky
    if (uzivatele.length === 0) {
      tableOutput += '| Žádní uživatelé nebyli nalezeni                                               |\n';
    } else {
      uzivatele.forEach((user, index) => {
        const id = (index + 1).toString().padEnd(4);
        const jmeno = user.jmeno.padEnd(10);
        const heslo = user.heslo;
        tableOutput += `| ${id} | ${jmeno} | ${heslo} |\n`;
      });
    }
    
    // Patička tabulky
    tableOutput += '+------+------------+--------------------------------------------------------------+\n';
    tableOutput += `\nCelkem nalezeno ${uzivatele.length} uživatelů.`;
    
    // Nastavení typu odpovědi na plain text a odeslání výsledku
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(tableOutput);
  } catch (err) {
    console.error('Chyba při načítání uživatelů:', err);
    res.status(500).send(`Chyba při načítání dat z MongoDB: ${err.message}`);
  }
});

module.exports = dbrouter;
