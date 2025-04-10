const express = require('express');
const dbrouter = express.Router();

// nacteni modulů pro práci s PostgreSQL a souborovým systémem
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

require('dotenv').config();
const { DATABASE_URL } = process.env;

// Cesta pro inicializaci databáze
dbrouter.get('/init', async (req, res) => {
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
dbrouter.get('/scan', async (req, res) => {
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

module.exports = dbrouter;
