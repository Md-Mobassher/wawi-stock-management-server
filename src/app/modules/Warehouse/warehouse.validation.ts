import { z } from 'zod';

const createWarehouseValidationSchema = z.object({
  name: z.string().min(1, 'Warehouse name is required'),
  location: z.string().optional(),
});

const updateWarehouseValidationSchema = z.object({
  name: z.string().min(1, 'Warehouse name is required').optional(),
  location: z.string().optional(),
});

export const WarehouseValidation = {
  createWarehouseValidationSchema,
  updateWarehouseValidationSchema,
};
