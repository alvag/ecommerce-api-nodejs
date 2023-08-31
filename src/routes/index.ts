import { Router } from 'express';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';
import { isAuth } from '../middlewares';
import brandRoutes from './brand.routes';
import categoryRoutes from './category.routes';
import productRoutes from './product.routes';

const router = Router();

router.use( '/auth', authRoutes );
router.use( '/users', [ isAuth ], userRoutes );
router.use( productRoutes );
router.use( '/brands', brandRoutes );
router.use( '/categories', categoryRoutes );

export default router;
