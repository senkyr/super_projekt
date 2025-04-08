// nacteni kodu z baliku express
const express = require('express');
// nacteni kodu z baliku express-session
const session = require('express-session');
// nacteni modulů pro práci s PostgreSQL a souborovým systémem
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// nacteni dat z konfiguracniho souboru
require('dotenv').config();
// nacteni konkretnich konfiguracnich dat
const { SECRET, DATABASE_URL } = process.env;

// vytvoreni Express aplikace
const app = express();

// nastaveni sablonovaciho nastroje
app.set('view engine', 'ejs');
app.set('views', './app/views');

// prijimani dat z formularu
app.use(express.urlencoded({ extended: false }));

// nastaveni session
app.use(session({
  secret: SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// umisteni statickych souboru (HTML, CSS, obrazky, ...)
app.use(express.static('./www'));

// odchyceni URL tykajicich se aplikace jako takove
app.use('/aplikace', require('./routers/aplikaceRouter'));
// odchyceni URL tykajicich se uzivatele
app.use('/uzivatel', require('./routers/uzivatelRouter'));

// Cesta pro inicializaci databáze
app.get('/initdb', async (req, res) => {
  // Kontrola, zda existuje proměnná DATABASE_URL
  if (!DATABASE_URL) {
    return res.status(500).send('Chyba: DATABASE_URL není nastavená. Prosím nastavte připojovací řetězec k databázi.');
  }

  // Vytvoření připojení k databázi
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // potřebné pro Render.com
    }
  });

  try {
    // Načtení SQL skriptu
    const sqlPath = path.join(__dirname, '..', 'init.sql');
    const sqlScript = fs.readFileSync(sqlPath, 'utf8');
    
    // Spuštění celého skriptu najednou
    await pool.query(sqlScript);
    
    await pool.end(); // Ukončení spojení
    
    res.send('Databáze byla úspěšně inicializována! Tabulka uživatelů je připravena.');
  } catch (err) {
    console.error('Chyba při inicializaci databáze:', err);
    res.status(500).send(`Chyba při inicializaci databáze: ${err.message}`);
  }
});

// Cesta pro zobrazení uživatelů z databáze
app.get('/scandb', async (req, res) => {
  // Kontrola, zda existuje proměnná DATABASE_URL
  if (!DATABASE_URL) {
    return res.status(500).send('Chyba: DATABASE_URL není nastavená. Prosím nastavte připojovací řetězec k databázi.');
  }

  // Vytvoření připojení k databázi
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // potřebné pro Render.com
    }
  });

  try {
    // SQL dotaz pro získání všech uživatelů z tabulky
    const query = 'SELECT id, jmeno, heslo FROM uzivatele ORDER BY id';
    const result = await pool.query(query);
    
    // Formátování výsledků jako ASCII tabulka
    let tableOutput = '';
    
    // Záhlaví tabulky
    tableOutput += '+------+------------+--------------------------------------------------------------+\n';
    tableOutput += '| ID   | Jméno      | Heslo (hash)                                                |\n';
    tableOutput += '+------+------------+--------------------------------------------------------------+\n';
    
    // Řádky tabulky
    if (result.rows.length === 0) {
      tableOutput += '| Žádní uživatelé nebyli nalezeni                                               |\n';
    } else {
      result.rows.forEach(user => {
        const id = user.id.toString().padEnd(4);
        const jmeno = user.jmeno.padEnd(10);
        const heslo = user.heslo;
        tableOutput += `| ${id} | ${jmeno} | ${heslo} |\n`;
      });
    }
    
    // Patička tabulky
    tableOutput += '+------+------------+--------------------------------------------------------------+\n';
    tableOutput += `\nCelkem nalezeno ${result.rows.length} uživatelů.`;
    
    // Ukončení spojení s databází
    await pool.end();
    
    // Nastavení typu odpovědi na plain text a odeslání výsledku
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(tableOutput);
  } catch (err) {
    console.error('Chyba při načítání uživatelů:', err);
    res.status(500).send(`Chyba při načítání dat z databáze: ${err.message}`);
  }
});

// odchyceni defaultnich URL
app.get(['/', '/index', '/index.html'], (dotaz, odpoved) => odpoved.redirect('/aplikace/domov'));
// odchyceni vsech ostatnich URL --> chyba
app.get('*', (dotaz, odpoved) => odpoved.redirect('/aplikace/chyba'));

module.exports = app;
