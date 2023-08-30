import { Router } from 'express';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';
import { isAuth } from '../middlewares';

const router = Router();

router.use( '/auth', authRoutes );
router.use( '/users', [ isAuth ], userRoutes );

export default router;
