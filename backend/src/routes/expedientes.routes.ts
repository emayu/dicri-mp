import { Router } from 'express';
import { getExpedientes } from '../controllers/expedientes.controller';
import { requireLogin, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', requireLogin, getExpedientes);

router.post('/:id/aprobar', requireLogin, requireRole("COORDINADOR"), getExpedientes);


export default router;