// nacteni kodu z baliku bcryptjs
const bcrypt = require('bcryptjs');
// nacteni kodu pro pripojeni k PostgreSQL
const { Pool } = require('pg');

// Konfigurace připojení k databázi (z proměnných prostředí)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // potřebné na některých hostingových platformách jako je Render
    }
});

// Vytvoření spojení s databází a chybové hlášení
pool.on('error', (err) => {
    console.error('Neočekávaná chyba na PostgreSQL klientovi', err);
    process.exit(-1);
});

exports.existuje = async (jmeno) => {
    try {
        const result = await pool.query(
            'SELECT * FROM uzivatele WHERE jmeno = $1',
            [jmeno]
        );
        return result.rows.length > 0;
    } catch (err) {
        console.error('Chyba při kontrole existence uživatele:', err);
        throw err;
    }
};

exports.pridat = async (jmeno, heslo) => {
    try {
        const hash = bcrypt.hashSync(heslo, 10);
        await pool.query(
            'INSERT INTO uzivatele (jmeno, heslo) VALUES ($1, $2)',
            [jmeno, hash]
        );
    } catch (err) {
        console.error('Chyba při přidání uživatele:', err);
        throw err;
    }
};

exports.overit = async (jmeno, heslo) => {
    try {
        const result = await pool.query(
            'SELECT heslo FROM uzivatele WHERE jmeno = $1',
            [jmeno]
        );
        
        if (result.rows.length === 0) {
            return false;
        }
        
        return bcrypt.compareSync(heslo, result.rows[0].heslo);
    } catch (err) {
        console.error('Chyba při ověření uživatele:', err);
        throw err;
    }
};
