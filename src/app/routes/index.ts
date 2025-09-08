import { ProductRoutes } from '@/app/modules/Product/product.routes';
import { Router } from 'express';

const router = Router();

const moduleRoutes = [{ path: '/products', route: ProductRoutes }];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
