import validateRequest from '@/app/middlewares/validateRequest';
import { StockControllers } from '@/app/modules/Stock/stock.controller';
import { StockValidation } from '@/app/modules/Stock/stock.validation';
import express from 'express';

const router = express.Router();

// Stock operations
router.post(
  '/in',
  validateRequest(StockValidation.stockInValidationSchema),
  StockControllers.stockIn,
);

router.post(
  '/out',
  validateRequest(StockValidation.stockOutValidationSchema),
  StockControllers.stockOut,
);

router.post(
  '/transfer',
  validateRequest(StockValidation.stockTransferValidationSchema),
  StockControllers.stockTransfer,
);

// Stock summary and movements
router.get(
  '/summary',
  validateRequest(StockValidation.stockSummaryValidationSchema),
  StockControllers.getStockSummary,
);

router.get('/', StockControllers.getFilteredStock);

export const StockRoutes = router;
