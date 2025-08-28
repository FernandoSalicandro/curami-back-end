// Controllers.js
import connection from '../Data/db.js';
import { sendNotification } from '../Mailer/mailer.js';

// --- util ----------------------------------------------------
const GIORNI_VALIDI = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
const ORARI_VALIDI  = ['Mattina', 'Pomeriggio', 'Sera'];

const toCSV = (v) => Array.isArray(v) ? v.join(', ') : (typeof v === 'string' ? v : '');
const toArray = (v) => Array.isArray(v) ? v
                  : (typeof v === 'string' ? v.split(',').map(s => s.trim()).filter(Boolean) : []);

// --- validazioni ---------------------------------------------
const validatePaziente = (data) => {
  const errors = [];

  if (!data.nome?.trim()) errors.push('Nome è obbligatorio');
  // cognome è facoltativo
  if (!data.email?.trim()) errors.push('Email è obbligatoria');
  if (!data.genere) errors.push('Genere è obbligatorio');

  // accetta eta o età
  const eta = data.età ?? data.eta;
  if (!eta) errors.push('Età è obbligatoria');

  if (!data.stato_paziente) errors.push('Stato paziente è obbligatorio');
  if (!data.urgenza) errors.push('Livello di urgenza è obbligatorio');
  if (!data.giorni) errors.push('Giorni disponibili sono obbligatori');
  if (!data.orari) errors.push('Orari disponibili sono obbligatori');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (data.email && !emailRegex.test(data.email)) errors.push('Formato email non valido');

  const phoneRegex = /^\+?\d{7,15}$/;
  if (data.telefono && !phoneRegex.test(data.telefono)) errors.push('Formato telefono non valido');

  return errors;
};

const validateMatching = (data) => {
  const errors = [];
  const giorni = toArray(data.giorni);
  const orari  = toArray(data.orari);

  if (!giorni.length) errors.push('Giorni sono obbligatori');
  if (!orari.length)  errors.push('Orari sono obbligatori');
  if (!data.nome?.trim()) errors.push('Nome paziente è obbligatorio');
  // cognome facoltativo

  if (giorni.some(g => !GIORNI_VALIDI.includes(g))) errors.push('Uno o più giorni non sono validi');
  if (orari.some(o => !ORARI_VALIDI.includes(o)))   errors.push('Uno o più orari non sono validi');

  return errors;
};

// --- controllers ---------------------------------------------
const index = (req, res) => {
  const sql = 'SELECT * FROM paziente;';
  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Errore nella query:', error);
      return res.status(500).json({ error: 'Errore nel server' });
    }
    res.status(200).json(results);
  });
};

const show = (_req, res) => {
  res.status(200).json({ message: 'Benvenuto nella rotta show' });
};

const post = async (req, res) => {
  try {
    const b = req.body || {};
    const validationErrors = validatePaziente(b);
    if (validationErrors.length) {
      return res.status(400).json({ error: 'Errori di validazione', details: validationErrors });
    }

    // normalizzazioni
    const eta = b.età ?? b.eta;
    const servizioValido = b.servizio || 'Entrambi';
    const giorniCSV = toCSV(b.giorni);
    const orariCSV  = toCSV(b.orari);
    const preferenza_genere = b.preferenza_genere ?? b.preferenzaGenere ?? null;

    const sql = `
      INSERT INTO paziente (
        genere, \`età\`, stato_paziente, servizio, racconto,
        urgenza, giorni, orari, preferenza_genere,
        nome, cognome, telefono, email
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const values = [
      b.genere, eta, b.stato_paziente, servizioValido, b.racconto ?? null,
      b.urgenza, giorniCSV, orariCSV, preferenza_genere,
      b.nome, b.cognome ?? null, b.telefono ?? null, b.email
    ];

    connection.query(sql, values, (error, result) => {
      if (error) {
        console.error('Errore nella query:', error);
        return res.status(500).json({ error: 'Errore nel server' });
      }

      // rispondi SUBITO al client
      res.status(201).json({ message: 'Paziente inserito con successo', insertId: result.insertId });

      // invio email in background (non blocca la risposta)
      setImmediate(() => {
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2c3e50;">Gentile ${b.nome},</h2>
            <p style="color: #34495e; line-height: 1.6;">
              Abbiamo ricevuto la tua richiesta e a breve verrai ricontattato per una prima visita.
            </p>
            <h3 style="color: #2c3e50; margin-top: 20px;">Come funziona adesso?</h3>
            <ol style="color: #34495e; line-height: 1.6;">
              <li>I professionisti più adatti verranno contattati immediatamente.</li>
              <li>Sarai ricontattato nelle prossime 24 ore lavorative.</li>
            </ol>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="color: #34495e; margin: 0;">
                Rimani disponibile via telefono nei giorni e fasce orarie indicate.
              </p>
            </div>
            <p style="color: #34495e; line-height: 1.6;">
              La prima visita è <strong>gratuita</strong> e deciderai tu se avviare il percorso di cura.
            </p>
            <hr style="border: 1px solid #eee; margin: 20px 0;">
            <p style="color: #7f8c8d; font-size: 14px;">Cordiali saluti,<br>Il team di Curami.it</p>
          </div>
        `;
        sendNotification(b.email, 'Conferma della tua richiesta su Curami.it', html)
          .catch(err => console.error('Invio email fallito:', err));
      });
    });
  } catch (error) {
    console.error('Errore generale:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
};

const matching = async (req, res) => {
  try {
    const b = req.body || {};
    const validationErrors = validateMatching(b);
    if (validationErrors.length) {
      return res.status(400).json({ error: 'Errori di validazione', details: validationErrors });
    }

    const servizioValido = b.servizioValido || b.servizio || 'Entrambi';
    const giorni = toArray(b.giorni);
    const orari  = toArray(b.orari);
    const preferenza_genere = b.preferenza_genere ?? b.preferenzaGenere ?? 'Indifferente';

    // condizioni OR su (giorno, orario)
    const condizioni = [];
    const valuesForConditions = [];
    for (const g of giorni) {
      for (const o of orari) {
        condizioni.push('(d.giorno = ? AND d.orario = ?)');
        valuesForConditions.push(g, o);
      }
    }

    let sql;
    const values = [];

    if (servizioValido === 'Entrambi' || !servizioValido) {
      sql = `
        (SELECT DISTINCT p.*
         FROM professionisti p
         JOIN \`disponibilità\` d ON p.id = d.professionista_id
         WHERE p.settore = 'Fisioterapista'
         ${preferenza_genere !== 'Indifferente' ? 'AND p.genere = ?' : ''}
         AND (${condizioni.join(' OR ')})
         LIMIT 1)
        UNION
        (SELECT DISTINCT p.*
         FROM professionisti p
         JOIN \`disponibilità\` d ON p.id = d.professionista_id
         WHERE p.settore = 'Infermiere'
         ${preferenza_genere !== 'Indifferente' ? 'AND p.genere = ?' : ''}
         AND (${condizioni.join(' OR ')})
         LIMIT 1)
      `;
      if (preferenza_genere !== 'Indifferente') {
        values.push(preferenza_genere, ...valuesForConditions, preferenza_genere, ...valuesForConditions);
      } else {
        values.push(...valuesForConditions, ...valuesForConditions);
      }
    } else {
      sql = `
        SELECT DISTINCT p.*
        FROM professionisti p
        JOIN \`disponibilità\` d ON p.id = d.professionista_id
        WHERE p.settore = ?
        ${preferenza_genere !== 'Indifferente' ? 'AND p.genere = ?' : ''}
        AND (${condizioni.join(' OR ')})
      `;
      values.push(servizioValido);
      if (preferenza_genere !== 'Indifferente') values.push(preferenza_genere);
      values.push(...valuesForConditions);
    }

    connection.query(sql, values, (error, matchingResult) => {
      if (error) {
        console.error('❌ Errore nella query:', error);
        return res.status(500).json({ error: 'Errore nel server' });
      }

      if (!matchingResult.length) {
        return res.status(404).json({ message: 'Nessun professionista disponibile con i criteri specificati' });
      }

      // rispondi SUBITO con i risultati
      res.status(200).json(matchingResult);

      // email ai professionisti in background (no await)
      setImmediate(() => {
        const payloads = matchingResult.map((prof) => {
          const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #2c3e50;">Gentile ${prof.nome} ${prof.cognome},</h2>
              <p style="color: #34495e; line-height: 1.6;">C'è una nuova richiesta per te.</p>
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #2c3e50; margin-top: 0;">Riepilogo della richiesta:</h3>
                <table style="width: 100%; color: #34495e;">
                  <tr><td style="padding:5px 0;"><strong>Paziente:</strong></td><td>${b.nome} ${b.cognome ?? ''}</td></tr>
                  <tr><td style="padding:5px 0;"><strong>Genere:</strong></td><td>${b.genere ?? '-'}</td></tr>
                  <tr><td style="padding:5px 0;"><strong>Età:</strong></td><td>${b.età ?? b.eta ?? '-'}</td></tr>
                  <tr><td style="padding:5px 0;"><strong>Stato:</strong></td><td>${b.stato_paziente ?? '-'}</td></tr>
                  <tr><td style="padding:5px 0;"><strong>Servizio:</strong></td><td>${servizioValido}</td></tr>
                  <tr><td style="padding:5px 0;"><strong>Urgenza:</strong></td><td>${b.urgenza ?? '-'}</td></tr>
                  <tr><td style="padding:5px 0;"><strong>Giorni:</strong></td><td>${giorni.join(', ')}</td></tr>
                  <tr><td style="padding:5px 0;"><strong>Orari:</strong></td><td>${orari.join(', ')}</td></tr>
                </table>
                ${b.racconto ? `<div style="margin-top:15px;"><strong>Descrizione:</strong><br><p style="margin-top:5px;">${b.racconto}</p></div>` : ''}
              </div>
              <p style="color:#7f8c8d;font-size:14px;">Cordiali saluti,<br>Il team di Curami.it</p>
            </div>
          `;
          return sendNotification(prof.email, 'Nuova richiesta di assistenza su Curami.it', html);
        });

        Promise.allSettled(payloads).catch(e => console.error('Errore invio email professionisti:', e));
      });
    });
  } catch (error) {
    console.error('Errore generale:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
};

export default { index, show, post, matching };
