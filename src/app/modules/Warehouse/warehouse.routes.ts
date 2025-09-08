import validateRequest from '@/app/middlewares/validateRequest';
import { WarehouseControllers } from '@/app/modules/Warehouse/warehouse.controller';
import { WarehouseValidation } from '@/app/modules/Warehouse/warehouse.validation';
import express from 'express';

const router = express.Router();

router.post(
  '/',
  validateRequest(WarehouseValidation.createWarehouseValidationSchema),
  WarehouseControllers.createAWarehouse,
);

router.get('/', WarehouseControllers.getFilteredWarehouse);

router.get('/:id', WarehouseControllers.getAWarehouse);

router.patch(
  '/:id',
  validateRequest(WarehouseValidation.updateWarehouseValidationSchema),
  WarehouseControllers.updateAWarehouse,
);

router.delete('/:id', WarehouseControllers.deleteAWarehouse);

export const WarehouseRoutes = router;
