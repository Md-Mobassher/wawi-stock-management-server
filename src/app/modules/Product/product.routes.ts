import validateRequest from '@/app/middlewares/validateRequest';
import { ProductControllers } from '@/app/modules/Product/product.controller';
import { ProductValidation } from '@/app/modules/Product/product.validation';
import express from 'express';

const router = express.Router();

router.post(
  '/',
  validateRequest(ProductValidation.createProductValidationSchema),
  ProductControllers.createAProduct,
);

router.get('/', ProductControllers.getFilteredProduct);

router.get('/:id', ProductControllers.getAProduct);

router.patch(
  '/:id',
  validateRequest(ProductValidation.updateProductValidationSchema),
  ProductControllers.updateAProduct,
);

router.delete('/:id', ProductControllers.deleteAProduct);

export const ProductRoutes = router;
