import { ProductRoutes } from '@/app/modules/Product/product.routes';
import { StockRoutes } from '@/app/modules/Stock/stock.routes';
import { WarehouseRoutes } from '@/app/modules/Warehouse/warehouse.routes';
import { Router } from 'express';

const router = Router();

const moduleRoutes = [
  { path: '/products', route: ProductRoutes },
  { path: '/warehouses', route: WarehouseRoutes },
  { path: '/stock', route: StockRoutes },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
