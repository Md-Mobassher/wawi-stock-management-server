import catchAsync from '@/app/shared/catchAsync';
import pick from '@/app/shared/pick';
import sendResponse from '@/app/shared/sendResponse';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { StockFilterableFields } from './stock.constant';
import { StockServices } from './stock.service';

const stockIn = catchAsync(async (req: Request, res: Response) => {
  const result = await StockServices.stockIn(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Stock in operation completed successfully',
    data: result,
  });
});

const stockOut = catchAsync(async (req: Request, res: Response) => {
  const result = await StockServices.stockOut(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Stock out operation completed successfully',
    data: result,
  });
});

const stockTransfer = catchAsync(async (req: Request, res: Response) => {
  const result = await StockServices.stockTransfer(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Stock transfer operation completed successfully',
    data: result,
  });
});

const getStockSummary = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['productId', 'warehouseId']);
  const result = await StockServices.getStockSummary(filters);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Stock summary retrieved successfully',
    data: result,
  });
});

const getFilteredStock = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, StockFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await StockServices.getFilteredStock(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Stock movements retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const StockControllers = {
  stockIn,
  stockOut,
  stockTransfer,
  getStockSummary,
  getFilteredStock,
};
