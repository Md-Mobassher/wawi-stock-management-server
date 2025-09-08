import { z } from 'zod';

const stockInValidationSchema = z.object({
  productId: z.number().int().positive('Product ID must be a positive integer'),
  warehouseId: z
    .number()
    .int()
    .positive('Warehouse ID must be a positive integer'),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
  operationKey: z.string().min(1, 'Operation key is required'),
});

const stockOutValidationSchema = z.object({
  productId: z.number().int().positive('Product ID must be a positive integer'),
  warehouseId: z
    .number()
    .int()
    .positive('Warehouse ID must be a positive integer'),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
  operationKey: z.string().min(1, 'Operation key is required'),
});

const stockTransferValidationSchema = z
  .object({
    productId: z
      .number()
      .int()
      .positive('Product ID must be a positive integer'),
    fromWarehouseId: z
      .number()
      .int()
      .positive('From warehouse ID must be a positive integer'),
    toWarehouseId: z
      .number()
      .int()
      .positive('To warehouse ID must be a positive integer'),
    quantity: z.number().int().positive('Quantity must be a positive integer'),
    operationKey: z.string().min(1, 'Operation key is required'),
  })
  .refine(data => data.fromWarehouseId !== data.toWarehouseId, {
    message: 'From warehouse and to warehouse must be different',
    path: ['toWarehouseId'],
  });

const stockSummaryValidationSchema = z.object({
  productId: z
    .number()
    .int()
    .positive('Product ID must be a positive integer')
    .optional(),
  warehouseId: z
    .number()
    .int()
    .positive('Warehouse ID must be a positive integer')
    .optional(),
});

export const StockValidation = {
  stockInValidationSchema,
  stockOutValidationSchema,
  stockTransferValidationSchema,
  stockSummaryValidationSchema,
};
