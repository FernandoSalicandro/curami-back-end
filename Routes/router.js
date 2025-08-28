
import express from 'express';
import controllers from '../Controllers/Controllers.js';

const router = express.Router();

router.get('/', controllers.index);
router.post('/matching', controllers.matching);
router.get('/:id', controllers.show);
router.post('/nuovoPaziente', controllers.post)

export default router;
