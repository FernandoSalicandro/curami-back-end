import express from 'express';
import cors from 'cors';
import router from './Routes/router.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware per parsing JSON e file statici
app.use(express.json());
// Middleware per il logging delle richieste
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`, {
    body: req.body,
    query: req.query,
    params: req.params
  });
  next();
});

// Configurazione CORS
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://curami-frontend.vercel.app',
    'https://fisionurse.com',
    'https://curami-back-end-production.up.railway.app',
    'https://063b3fdb5463.ngrok-free.app'
  ],
  methods: ['GET', 'POST'],
  credentials: true
}));


app.use(express.static('public'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Errore:', err);
  res.status(500).json({ 
    error: 'Errore interno del server',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Routes
app.use('/', router);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint non trovato' });
});

// Avvio server
app.listen(port, () => {
  console.log('🚀 Server in ascolto sulla porta:', port);
  console.log('📍 Ambiente:', process.env.NODE_ENV || 'development');
  console.log('🔑 CORS abilitato per:', [
    'http://localhost:5173', 
    'https://curami-frontend.vercel.app',
    'https://curami-back-end-production.up.railway.app',
    
  ]);
});

// Gestione errori non catturati
process.on('uncaughtException', (err) => {
  console.error('💥 Errore non catturato:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('💥 Promise rejection non gestita:', err);
  process.exit(1);
});