// nacteni kodu z baliku bcryptjs
const bcrypt = require('bcryptjs');
// nacteni mongoose pro práci s MongoDB
const mongoose = require('mongoose');

// Definice schématu uživatele (pokud nebyl již definován)
let Uzivatel;
try {
  // Zkusit získat existující model
  Uzivatel = mongoose.model('Uzivatel');
} catch (e) {
  // Model neexistuje, tak ho vytvoříme
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

  // Vytvoření modelu
  Uzivatel = mongoose.model('Uzivatel', uzivatelSchema);
}

// Kontrola existence uživatele
exports.existuje = async (jmeno) => {
  try {
    // Kontrola připojení k databázi
    if (mongoose.connection.readyState !== 1) {
      if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI není nastavená v proměnných prostředí');
      }
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    }

    const uzivatel = await Uzivatel.findOne({ jmeno });
    return !!uzivatel; // Převede na boolean
  } catch (err) {
    console.error('Chyba při kontrole existence uživatele:', err);
    throw err;
  }
};

// Přidání nového uživatele
exports.pridat = async (jmeno, heslo) => {
  try {
    // Kontrola připojení k databázi
    if (mongoose.connection.readyState !== 1) {
      if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI není nastavená v proměnných prostředí');
      }
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    }

    const hash = bcrypt.hashSync(heslo, 10);
    await Uzivatel.create({ jmeno, heslo: hash });
  } catch (err) {
    console.error('Chyba při přidání uživatele:', err);
    throw err;
  }
};

// Ověření uživatele
exports.overit = async (jmeno, heslo) => {
  try {
    // Kontrola připojení k databázi
    if (mongoose.connection.readyState !== 1) {
      if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI není nastavená v proměnných prostředí');
      }
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    }

    const uzivatel = await Uzivatel.findOne({ jmeno });
    
    if (!uzivatel) {
      return false;
    }
    
    return bcrypt.compareSync(heslo, uzivatel.heslo);
  } catch (err) {
    console.error('Chyba při ověření uživatele:', err);
    throw err;
  }
};
