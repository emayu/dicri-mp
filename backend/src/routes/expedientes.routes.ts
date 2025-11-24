import { Router } from 'express';
import { actualizar, aprobar, crear, eliminar, listar, obtenerPorId, enviarRevision, rechazar } from '../controllers/expedientes.controller';
import { requireLogin, requireRole } from '../middlewares/auth.middleware';
import indiciosRoutes from './indicios.routes';
const router = Router();

router.get('/', requireLogin, listar);
router.get('/:id', requireLogin, obtenerPorId);
router.post('/', requireRole('TECNICO'), crear);
router.put('/:id', requireRole('TECNICO'), actualizar);
router.delete('/:id', requireRole('TECNICO'), eliminar);

router.use('/:id/indicios', indiciosRoutes);

router.post('/:id/aprobar', requireRole('COORDINADOR'), aprobar);
router.post('/:id/rechazar', requireRole('COORDINADOR'), rechazar);
router.post('/:id/enviar-revision', requireLogin, enviarRevision);


export default router;