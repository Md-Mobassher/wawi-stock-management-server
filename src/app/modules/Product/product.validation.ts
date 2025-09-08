import { z } from 'zod';

const createProductValidationSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  sku: z.string().min(1, 'Product SKU is required'),
});

const updateProductValidationSchema = z.object({
  name: z.string().min(1, 'Product name is required').optional(),
  sku: z.string().min(1, 'Product SKU is required').optional(),
});

export const ProductValidation = {
  createProductValidationSchema,
  updateProductValidationSchema,
};
