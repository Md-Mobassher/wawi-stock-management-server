import catchAsync from '@/app/shared/catchAsync';
import pick from '@/app/shared/pick';
import sendResponse from '@/app/shared/sendResponse';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { WarehouseFilterableFields } from './warehouse.constant';
import { WarehouseServices } from './warehouse.service';

const createAWarehouse = catchAsync(async (req: Request, res: Response) => {
  const result = await WarehouseServices.createAWarehouse(req);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Warehouse created successfully',
    data: result,
  });
});

const getFilteredWarehouse = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, WarehouseFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await WarehouseServices.getFilteredWarehouse(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Warehouses retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getAWarehouse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await WarehouseServices.getAWarehouse(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Warehouse retrieved successfully',
    data: result,
  });
});

const updateAWarehouse = catchAsync(async (req: Request, res: Response) => {
  const { id: warehouseId } = req.params;

  const result = await WarehouseServices.updateAWarehouse(
    warehouseId,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Warehouse updated successfully',
    data: result,
  });
});

const deleteAWarehouse = catchAsync(async (req: Request, res: Response) => {
  const { id: warehouseId } = req.params;

  const result = await WarehouseServices.deleteAWarehouse(warehouseId);

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Warehouse deleted successfully',
      data: null,
    });
  }
});

export const WarehouseControllers = {
  createAWarehouse,
  getFilteredWarehouse,
  getAWarehouse,
  updateAWarehouse,
  deleteAWarehouse,
};
