import { Router } from 'express';
import * as IndicioController  from '../controllers/indicios.controller';
import { requireLogin, requireRole } from '../middlewares/auth.middleware';

const router = Router({ mergeParams: true });

router.get('/', requireLogin, IndicioController.listarPorExpediente);
router.post('/', requireLogin, IndicioController.crear);
router.put('/:idIndicio', requireLogin, IndicioController.actualizar);
router.delete('/:idIndicio', requireLogin, IndicioController.eliminar);

export default router;
