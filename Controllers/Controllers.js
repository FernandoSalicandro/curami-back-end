import connection from '../Data/db.js';
import { sendNotification } from '../Mailer/mailer.js';

// Funzioni di validazione
const validatePaziente = (data) => {
  const errors = [];

  // Validazioni campi obbligatori
  if (!data.nome?.trim()) errors.push('Nome è obbligatorio');
  if (!data.cognome?.trim()) errors.push('Cognome è obbligatorio');
  if (!data.email?.trim()) errors.push('Email è obbligatoria');
  if (!data.genere) errors.push('Genere è obbligatorio');
  if (!data.età) errors.push('Età è obbligatoria');
  if (!data.stato_paziente) errors.push('Stato paziente è obbligatorio');
  if (!data.urgenza) errors.push('Livello di urgenza è obbligatorio');
  if (!data.giorni) errors.push('Giorni disponibili sono obbligatori');
  if (!data.orari) errors.push('Orari disponibili sono obbligatori');

  // Validazione email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (data.email && !emailRegex.test(data.email)) {
    errors.push('Formato email non valido');
  }

  // Validazione telefono
  const phoneRegex = /^\+?\d{7,15}$/;
  if (data.telefono && !phoneRegex.test(data.telefono)) {
    errors.push('Formato telefono non valido');
  }

  return errors;
};

const validateMatching = (data) => {
  const errors = [];

  // Validazioni base
  if (!data.giorni?.length) errors.push('Giorni sono obbligatori');
  if (!data.orari?.length) errors.push('Orari sono obbligatori');
  if (!data.nome?.trim()) errors.push('Nome paziente è obbligatorio');
  if (!data.cognome?.trim()) errors.push('Cognome paziente è obbligatorio');

  // Validazione giorni validi
  const giorniValidi = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
  if (data.giorni && !data.giorni.every(g => giorniValidi.includes(g))) {
    errors.push('Uno o più giorni non sono validi');
  }

  // Validazione orari validi
  const orariValidi = ['Mattina', 'Pomeriggio', 'Sera'];
  if (data.orari && !data.orari.every(o => orariValidi.includes(o))) {
    errors.push('Uno o più orari non sono validi');
  }

  return errors;
};

// Controllers
const index = (req, res) => {
  const sql = `SELECT * FROM paziente;`

  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Errore nella query:', error);
      return res.status(500).json({ error: 'Errore nel server' });
    }

    console.log('Risultati:', results);
    res.status(200).json(results);
  });
};

const show = (req, res) => {
  res.status(200).json({ message: 'Benvenuto nella rotta show' });
};

const post = async (req, res) => {
  try {
    // Validazione
    const validationErrors = validatePaziente(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        error: 'Errori di validazione', 
        details: validationErrors 
      });
    }

    const {
      genere, età, stato_paziente, servizio, racconto,
      urgenza, giorni, orari, preferenza_genere,
      nome, cognome, telefono, email
    } = req.body;

    const servizioValido = servizio || 'Entrambi';

    const sql = `
      INSERT INTO paziente (
        genere, età, stato_paziente, servizio, racconto,
        urgenza, giorni, orari, preferenza_genere,
        nome, cognome, telefono, email
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const values = [
      genere, età, stato_paziente, servizioValido, racconto,
      urgenza, giorni, orari, preferenza_genere,
      nome, cognome, telefono, email
    ];

    connection.query(sql, values, async (error, result) => {
      if (error) {
        console.error('Errore nella query:', error);
        return res.status(500).json({ error: 'Errore nel server' });
      }

      // Invio email al paziente
      await sendNotification(
        email,
        'Conferma della tua richiesta su Curami.it',
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2c3e50;">Gentile ${nome},</h2>
          
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
              Ti invitiamo a rimanere disponibile via telefono nei giorni e fasce orarie indicate.
            </p>
          </div>

          <p style="color: #34495e; line-height: 1.6;">
            La prima visita è <strong>gratuita</strong> e deciderai tu se avviare il percorso di cura.
          </p>

          <hr style="border: 1px solid #eee; margin: 20px 0;">

          <p style="color: #7f8c8d; font-size: 14px;">
            Cordiali saluti,<br>
            Il team di Curami.it
          </p>
        </div>
        `
      );

      res.status(201).json({ 
        message: 'Paziente inserito con successo', 
        insertId: result.insertId 
      });
    });
  } catch (error) {
    console.error('Errore generale:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
};

const matching = async (req, res) => {
  try {
    // Validazione
    const validationErrors = validateMatching(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        error: 'Errori di validazione', 
        details: validationErrors 
      });
    }

    let { 
      servizioValido, giorni, orari, preferenza_genere, 
      nome, cognome, genere, età, stato_paziente, 
      urgenza, racconto, zona_dolore, servizio_infermiere 
    } = req.body;

    // Sanitizzazione input
    if (typeof giorni === 'string') {
      giorni = giorni.split(',').map(g => g.trim()).filter(Boolean);
    }
    if (typeof orari === 'string') {
      orari = orari.split(',').map(o => o.trim()).filter(Boolean);
    }

    const condizioni = [];
    const valuesForConditions = [];

    for (const giorno of giorni) {
      for (const orario of orari) {
        condizioni.push(`(d.giorno = ? AND d.orario = ?)`);
        valuesForConditions.push(giorno, orario);
      }
    }

    let sql;
    let values = [];

    if (servizioValido === 'Entrambi' || !servizioValido) {
      sql = `
        (SELECT DISTINCT p.*
         FROM professionisti p
         JOIN disponibilità d ON p.id = d.professionista_id
         WHERE p.settore = 'Fisioterapista'
         ${preferenza_genere !== 'Indifferente' ? 'AND p.genere = ?' : ''}
         AND (${condizioni.join(' OR ')})
         LIMIT 1)
        UNION
        (SELECT DISTINCT p.*
         FROM professionisti p
         JOIN disponibilità d ON p.id = d.professionista_id
         WHERE p.settore = 'Infermiere'
         ${preferenza_genere !== 'Indifferente' ? 'AND p.genere = ?' : ''}
         AND (${condizioni.join(' OR ')})
         LIMIT 1)
      `;

      if (preferenza_genere !== 'Indifferente') {
        values.push(preferenza_genere);
        values.push(...valuesForConditions);
        values.push(preferenza_genere);
        values.push(...valuesForConditions);
      } else {
        values.push(...valuesForConditions);
        values.push(...valuesForConditions);
      }
    } else {
      sql = `
        SELECT DISTINCT p.*
        FROM professionisti p
        JOIN disponibilità d ON p.id = d.professionista_id
        WHERE p.settore = ?
        ${preferenza_genere !== 'Indifferente' ? 'AND p.genere = ?' : ''}
        AND (${condizioni.join(' OR ')})
      `;

      values.push(servizioValido);
      if (preferenza_genere !== 'Indifferente') {
        values.push(preferenza_genere);
      }
      values.push(...valuesForConditions);
    }

    connection.query(sql, values, async (error, matchingResult) => {
      if (error) {
        console.error('❌ Errore nella query:', error);
        return res.status(500).json({ error: 'Errore nel server' });
      }

      if (!matchingResult.length) {
        return res.status(404).json({ 
          message: 'Nessun professionista disponibile con i criteri specificati' 
        });
      }

      // Invio email ai professionisti trovati
      for (const prof of matchingResult) {
        await sendNotification(
          prof.email,
          'Nuova richiesta di assistenza su Curami.it',
          `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2c3e50;">Gentile ${prof.nome} ${prof.cognome},</h2>
            
            <p style="color: #34495e; line-height: 1.6;">
              C'è una nuova richiesta per te.
            </p>

            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #2c3e50; margin-top: 0;">Riepilogo della richiesta:</h3>
              
              <table style="width: 100%; color: #34495e;">
                <tr>
                  <td style="padding: 5px 0;"><strong>Paziente:</strong></td>
                  <td>${nome} ${cognome}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;"><strong>Genere:</strong></td>
                  <td>${genere}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;"><strong>Età:</strong></td>
                  <td>${età}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;"><strong>Stato:</strong></td>
                  <td>${stato_paziente}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;"><strong>Servizio:</strong></td>
                  <td>${servizioValido}</td>
                </tr>
                ${zona_dolore ? `
                <tr>
                  <td style="padding: 5px 0;"><strong>Zona del Dolore:</strong></td>
                  <td>${zona_dolore}</td>
                </tr>
                ` : ''}
                ${servizio_infermiere ? `
                <tr>
                  <td style="padding: 5px 0;"><strong>Servizio Infermiere:</strong></td>
                  <td>${servizio_infermiere}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 5px 0;"><strong>Urgenza:</strong></td>
                  <td>${urgenza}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;"><strong>Giorni:</strong></td>
                  <td>${giorni}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;"><strong>Orari:</strong></td>
                  <td>${orari}</td>
                </tr>
              </table>

              <div style="margin-top: 15px;">
                <strong>Descrizione del problema:</strong><br>
                <p style="margin-top: 5px;">${racconto || 'Nessuna descrizione fornita'}</p>
              </div>
            </div>

            <p style="color: #34495e; line-height: 1.6;">
              Ti preghiamo di contattare il paziente il prima possibile negli orari indicati.
            </p>

            <div style="background-color: #e8f4f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="color: #34495e; margin: 0;">
                Ricorda che la prima visita è <strong>gratuita</strong> e potrai definire autonomamente il percorso di cura.
              </p>
            </div>

            <hr style="border: 1px solid #eee; margin: 20px 0;">

            <p style="color: #7f8c8d; font-size: 14px;">
              Cordiali saluti,<br>
              Il team di Curami.it
            </p>
          </div>
          `
        );
      }

      res.status(200).json(matchingResult);
    });
  } catch (error) {
    console.error('Errore generale:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
};

export default { index, show, post, matching };