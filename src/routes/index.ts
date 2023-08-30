import { Router } from 'express';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';
import { isAuth } from '../middlewares';
import productRoutes from './product.routes';

const router = Router();

router.use( '/auth', authRoutes );
router.use( '/users', [ isAuth ], userRoutes );
router.use( '/products', productRoutes );

export default router;
