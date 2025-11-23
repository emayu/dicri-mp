import { Router } from 'express';
import authRoutes from './auth.routes';
import expedientesRoutes from './expedientes.routes'

const router = Router();

router.use('/auth', authRoutes);
router.use('/expedientes', expedientesRoutes);


export default router;