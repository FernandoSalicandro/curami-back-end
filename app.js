
import express from 'express';
import cors from 'cors';
import router from './Routes/router.js';

const app = express();
const port = process.env.PORT || 3000;


app.use(cors({
  origin: ['http://localhost:5173', 'https://curami-frontend.vercel.app', 'https://063b3fdb5463.ngrok-free.app'],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));



app.use('/', router);

app.listen(port, ()=> {
    console.log('server in ascolto sulla porta : ', port);
});
